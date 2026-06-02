# Portfolio Brief — Drew Wells

> **Purpose:** Source material for a Claude Design–built portfolio article on the Wellsstar blog
> (`blog.wellsstar.dev`). Hand this whole file to Claude Design.
> **Author:** Drew Wells · **Compiled:** 2026-06-02 · **Focus (per Drew):** the *infrastructure* —
> especially the **bridge** (inter-agent message bus) and the **Telegram relay**. The apps are
> supporting cast; the platform is the story.
>
> **House style to match** (see existing posts `the-5-3-trillion-question`, `effectiveness-per-tax-dollar`):
> data-forward magazine layout — kicker → headline → dek → byline, a **stat strip** of 3–4 big numbers,
> numbered sections, figure panels with takeaways and a system diagram. Tone: understated; let the
> engineering carry it. A clean architecture diagram of the bridge would be the centerpiece figure.

---

## 0. Thesis (suggested)

Most people run a homelab as a pile of containers. Drew runs his as a **distributed system with an
operating org on top of it** — a custom WebSocket message bus that lets AI agents on different machines
coordinate, a leader-election protocol so exactly one "COO" agent is ever in charge, and a Telegram bridge
that turns his phone (including **voice notes**) into a control plane for the whole fleet. The apps it runs
(a dance-video host, scrapers, schedulers) are real and live — but the interesting engineering is the
**substrate that keeps a team of agents alive, addressable, and reliable across three machines.**

Possible headlines:
- *"I built a message bus so my AI agents could run my servers."*
- *"Leader election, heartbeats, and voice notes: the infrastructure behind a one-person agent org."*
- *"The bridge: a distributed control plane for a homelab run by agents."*

### Headline stat strip (candidates)
| Number | Label |
|--------|-------|
| **3** | machines in a Tailscale mesh, one logical agent fabric |
| **8** | MCP tools exposed to every agent (register, send, get_messages, ack, status, list_peers, hub_status, leader_status) |
| **60s** | lease duration — the window that guarantees a single live "COO" leader |
| **~5,000** | lines of Go in the Telegram relay alone (voice, access control, ack tracking) |
| **123.6 tok/s** | local LLM throughput (Qwen3 35B-MoE, 4-bit MLX, on-prem) |
| **245** | synced knowledge-base entries the agents read/write as long-term memory |

---

## 1. The substrate (machines + network)

All nodes joined in a **Tailscale** mesh; the homelab has *no public IPv4* (T-Mobile home internet, IPv6
ingress blocked), so a small cloud droplet exists purely to provide an IPv4 egress point.

| Machine | Role | Specs |
|---------|------|-------|
| **amazon** | Agent orchestration + central **hub** + app host | 16-core / 128 GB / ~50 TB RAID |
| **beast** | Local LLM inference (oMLX), voice transcription (Whisper) | Mac Studio M4 Max, 128 GB unified, 40-core GPU |
| **ocean → vultr** | IPv4 egress proxy (migrating DO→Vultr Dallas for latency) | 2 vCPU / 4 GB |
| opnsense / snow | Router (Protectli i7) / inactive GPU box (RTX 4070) | — |

LAN: fiber → switch → **2.5 Gbps** copper to every machine.

---

## 2. ⭐ The bridge — a cross-machine message bus for agents

**The problem it solves:** Claude Code agents run as isolated processes with limited context. To act as a
coordinated *organization* — a COO delegating to PMs and coders across machines — they need to (a) find each
other, (b) message each other reliably, and (c) never step on each other's identities. The bridge is a
purpose-built, two-layer system (all Go) that provides exactly that.

### 2.1 Two layers
1. **Hub** (`bridge/hub/`) — a single central **WebSocket router** at `ws://amazon.home.arpa:8991`. It owns
   the registry of live sessions and routes messages between machines. Typed wire protocol:
   `register · heartbeat · send · list_peers · claim_role` (client→hub) and
   `registered · peers · message · ack · error · lease · lease_lost · primary_changed` (hub→client).
2. **Bridge MCP server** (`bridge/server/server.go`, ~1,000 LOC) — runs alongside each agent and exposes the
   hub as **MCP tools** the model can call directly:
   `register, send, list_peers, get_messages, ack, status, hub_status, leader_status`.

### 2.2 The genuinely hard parts (these are the showcase details)

- **Addressing = `name@machine`.** Every agent is `researcher@beast`, `coo@amazon`, etc. The format is
  validated; queues are machine-scoped. A clean, human-readable namespace over a distributed fabric.

- **Identity-collision detection (no two agents share a name).** Supervisors can relaunch agents at any time,
  so the hub guards against duplicates: if a *live* process already holds an identity, a newcomer's
  registration is refused and the MCP child stays anonymous (`ErrIdentityHeld`). A registration is considered
  "live" only within `LiveSessionAge = 60s` of its last heartbeat — after that it's treated as a **corpse** and
  a new claim takes over. This is the difference between "restarted cleanly" and "split-brain."

- **Lease-based leader election (exactly one COO).** Roles are leased, not assigned. `LeaseDuration = 60s`
  (2× the heartbeat, allowing one missed beat); the hub sweeps for expired leases every 5s. A `claim_role`
  succeeds only if no live lease exists; it's rejected while one does. Crucially, the **`coo` role is pinned to
  the `amazon` machine in code** (`AmazonMachine = "amazon"`, `CooRolePrefix = "coo"`) — a hard guarantee that
  the org's decision-maker can't accidentally spin up on the wrong host. Lease generations distinguish renewal
  (extends the lease, same generation) from a true ownership change (`primary_changed`). *This is real
  distributed-systems work — the same shape as etcd/ZooKeeper leader election, hand-rolled for an agent fleet.*

- **Liveness & reliability.** 30s heartbeats, 2-minute stale-session pruning, a 2s outgoing-relay loop, and a
  message store with **explicit ack semantics** (`ack`, `status`) so a sender can confirm a peer actually
  received a message — not just that it was sent.

> **Pull-quote candidate:** *"The COO role is a lease, not a title. If the agent holding it stops sending
> heartbeats for sixty seconds, the lease expires and someone else can take over — but only on the one machine
> the code allows to hold it."*

### 2.3 Why it matters
This is the connective tissue for everything else. Without it, "an org of agents" is just a metaphor; with it,
it's an addressable, fault-tolerant fabric with a single elected leader and at-least-once messaging.

---

## 3. ⭐ The Telegram relay — a phone as the control plane

**The problem it solves:** Drew isn't always at a terminal. The relay (`bridge/telegram/`, ~5,000 LOC Go) turns
a Telegram chat into a first-class, secured, reliable interface to the agent fleet — bidirectional, so agents
escalate *to* him and he commands them *back*.

### 3.1 Standout features
- **Voice notes → text, on-prem.** The relay accepts Telegram **voice/audio** (OGG/Opus) and pipes it through
  a **Whisper** client (`SetWhisperClient`) for transcription — so Drew can *speak* an instruction to his
  agents from his phone and it lands as text in the right agent's queue. (Transcription runs on local infra,
  not a cloud STT API.)
- **Real access control** (`access.go`): a DM policy of `open` / `pairing` / `closed`, an `allowFrom` user
  allowlist, a **pairing** handshake for new users, and **group→agent routing** — a given Telegram group maps
  to a specific agent identity, so different chats talk to different agents.
- **Delivery reliability, not fire-and-forget.** A pending-ack tracker, an **ack observer**, and **ack
  timeouts** (`pending_ack.go`, `ack_observer.go`, `ack_timeout.go`) detect when a relayed message *didn't*
  get picked up by its target agent, with a **degraded mode** (`degraded.go`) for when an agent is down — this
  is what stops the classic "the agent went silent and nobody noticed" failure.
- **Message splitting** (`split.go`) to respect Telegram's 4096-char cap on long agent replies, and
  **slash-command relaying** so phone-side commands reach the agent.
- **Typed message convention** so agents can tell ops chatter from real user input on the wire:
  `[OPS-PROBE]` (liveness), `[OPS]` (instruction), `[USER-RELAY]` (a forwarded human message).

> **Pull-quote candidate:** *"I can leave my servers a voice memo. Whisper turns it into text, the bridge routes
> it to the right agent, and the agent acks back — or the relay tells me it went unheard."*

---

## 4. Keeping it alive — supervision, LLMs, and memory

The infra story's third act: the bits that make it *stay* up unattended.

- **Supervisors + watchdogs** (systemd on Linux, **launchd** on the Mac): per-agent supervisors
  (`wst-coo-supervisor.sh`, `life-coach-supervisor.sh`, …) restart crashed agents and wedged hubs. A hard-won
  design rule: a supervisor **must never evict a session Drew is actively attached to** — it claims a live
  session and only kills+recreates when the pane's process is genuinely dead.
- **On-prem LLM serving (oMLX on beast).** OpenAI-compatible local inference via Apple MLX, LaunchDaemon-managed.
  A benchmarked finding drives model choice: **MoE beats dense ~4×** — Qwen3 35B-**A3B** (3B active) runs
  **123.6 tok/s** at 4-bit vs ~30 tok/s for a 27B dense model. Fallback chain: local Qwen → local Gemma →
  cloud Claude, so a single machine is never a hard dependency.
- **Persistent agent memory.** A **245-entry knowledge base** synced across machines via **Syncthing**
  (`~/.claude-memory/`), shared between the `.knowledge/` project store and the agents' auto-memory. Agents
  survive periodic context wipes by re-reading a `state.md` source-of-truth on every fresh boot.
- **"Dream" consolidation** (`runbooks/dream-consolidation.md`): a nightly **04:30** systemd timer, modeled on
  Anthropic's Managed-Agents "Dreams" pattern. It backs up memory, stages a copy, mines recent `.jsonl`
  transcripts for durable insights, runs a headless `claude -p` pass to merge duplicates / update stale
  entries, guards the result with **seven validation checks**, atomically swaps it back in, and Telegrams Drew
  a one-line PASS/FAIL. The `knowledge/` subdir is explicitly out of scope and never touched.

---

## 5. What it all runs (the apps — supporting cast)

Keep this section short; it's proof the infra carries real production load, not demos. All live under the
`jayloves.us` / `swingelo.com` domains, fronted by one nginx reverse-proxy repo (**10 domains**, shared SAN TLS).

| App | One-liner | Scale / stack |
|-----|-----------|---------------|
| **plex-host** | Auth'd dance-class video host w/ transcript search | Go + SvelteKit; Whisper + Qwen3 metadata; FFmpeg QSV transcode; **177 commits** |
| **swing-analytics** | West Coast Swing results warehouse, live at swingelo.com | Python→**DuckDB**→Go API; **132,750** entries / ~175 events; 7-phase name-normalization |
| **swingschedule** | Event-schedule aggregator + webcal, schedule.swingelo.com | Next.js 15; **vision-LLM** PDF→JSON ingestion; Gemma via oMLX |
| **reforge** | Rust-native Renovate replacement for self-hosted GitLab | Rust/tokio; ~35 modules, **167 tests** |
| **sites-available / infra** | nginx reverse proxy + Terraform egress proxy | 10 domains; Vultr/Terraform IaC |

---

## 6. Cross-cutting themes (closing section)

- **AI agents as operators, not chatbots.** The novel claim isn't "I use an LLM"; it's "a fleet of agents,
  with a leader, runs my infrastructure and pages me when they're stuck."
- **Distributed-systems fundamentals, hand-rolled.** Leader election, leases, heartbeats, identity arbitration,
  at-least-once messaging with acks — applied to a problem (agent orchestration) most people solve with hope.
- **Sovereignty / on-prem by default.** Own hardware, own LLMs, own message bus, own STT (Whisper). The cloud
  droplet exists only because the ISP won't hand out an IPv4.
- **Operational maturity.** Watchdogs that respect human-attached sessions, a memory system with backups and
  seven-check validation, PASS/FAIL phone notifications — the unglamorous reliability work that separates a
  toy from a thing you trust to run unattended.

---

## 7. Suggested article structure for Claude Design

1. **Masthead** — kicker "Homelab / Agent Infrastructure"; headline on the bridge + phone-as-control-plane angle; dek; byline (June 2026).
2. **Headline stat strip** — §0 numbers.
3. **Section 01 — The substrate** (machines + Tailscale + no-public-IPv4 constraint; §1). Small network diagram.
4. **Section 02 — The bridge** *(the centerpiece; §2)* — give it a real **architecture diagram** (hub at center, agents as `name@machine` nodes across 3 machines, MCP-tools call-out, lease/heartbeat annotations) and the §2.2 pull-quote.
5. **Section 03 — The Telegram relay** *(§3)* — a sequence diagram (voice note → Whisper → bridge route → agent → ack back to phone) and the §3.1 pull-quote.
6. **Section 04 — Keeping it alive** (supervisors, oMLX/MoE benchmark, memory + dreams; §4) — the MoE-vs-dense bar (123.6 vs ~30 tok/s) is a great figure.
7. **Section 05 — What it runs** (compact app table; §5).
8. **Section 06 — Themes** (§6).
9. Footer: live sites (swingelo.com, schedule.swingelo.com). Don't invent repo links.

### Accuracy notes / caveats
- Hub address is `ws://amazon.home.arpa:8991` (LAN/Tailscale-only; an older doc says `beast:9876` — that's stale, use amazon:8991).
- LOC/figures are approximate, repo-derived — present as "~". "132,750 entries / ~175 events" are project-reported.
- Only swingelo.com + schedule.swingelo.com are confirmed-public URLs. Bridge/relay are private LAN services — describe, don't link.
- Voice transcription and the local LLMs run on-prem (beast); say "local Whisper," not a cloud STT vendor.
- reforge stays framed as a learning project under the `wellington` org. Don't over-claim users/revenue — this is a personal operation.
