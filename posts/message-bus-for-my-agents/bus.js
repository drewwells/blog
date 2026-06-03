/* ============================================================
   bus.js — interactive figures + page chrome for
   "I built a message bus so my AI agents could run my servers."

   Ported 1:1 from the Claude Design prototype (diagrams.jsx /
   Portfolio.html) to dependency-free vanilla JS so the static
   Astro site ships no React/Babel. Timing constants preserved
   verbatim: heartbeat 900ms, delegation 2600ms, lease 60s,
   sequence step 1050ms, MoE max 140, fill 1.1s, ≈4×.
   ============================================================ */
(function () {
  'use strict';

  var AMBER = 'oklch(0.805 0.135 78)';
  var GREEN = 'oklch(0.760 0.130 155)';
  var REDC = 'oklch(0.680 0.150 25)';
  var MUTED = 'oklch(0.640 0.012 250)';
  var LINE = 'oklch(0.370 0.014 250)';
  var SVGNS = 'http://www.w3.org/2000/svg';

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* tiny SVG element helper */
  function el(tag, attrs, text) {
    var e = document.createElementNS(SVGNS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (attrs[k] != null) e.setAttribute(k, attrs[k]);
      }
    }
    if (text != null) e.textContent = text;
    return e;
  }
  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* interpolate a point along a multi-segment polyline at fraction f */
  function ptAlong(pts, f) {
    var segs = [],
      total = 0,
      i;
    for (i = 0; i < pts.length - 1; i++) {
      var l = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
      segs.push(l);
      total += l;
    }
    var d = f * total;
    for (i = 0; i < segs.length; i++) {
      if (d <= segs[i] || i === segs.length - 1) {
        var t = segs[i] ? d / segs[i] : 0;
        return {
          x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
          y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
        };
      }
      d -= segs[i];
    }
    return pts[pts.length - 1];
  }

  /* ==========================================================
     FIGURE 02 — Bridge live control plane
     ========================================================== */
  var HUB = { x: 440, y: 300 };
  var MACHINES = [
    { id: 'amazon', label: 'amazon', sub: '16c · 128G · ~50TB', x: 250, y: 20, w: 380, h: 130 },
    { id: 'beast', label: 'beast', sub: 'M4 Max · oMLX · Whisper', x: 26, y: 168, w: 210, h: 308 },
    { id: 'snow', label: 'snow', sub: 'RTX 4070', x: 648, y: 214, w: 208, h: 180 },
  ];
  var NODES = [
    { id: 'coo@amazon', role: 'coo', machine: 'amazon', x: 345, y: 110, pinned: true },
    { id: 'pm@amazon', role: 'pm', machine: 'amazon', x: 535, y: 110 },
    { id: 'researcher@beast', role: 'researcher', machine: 'beast', x: 131, y: 244 },
    { id: 'coder@beast', role: 'coder', machine: 'beast', x: 131, y: 398 },
    { id: 'ops@snow', role: 'ops', machine: 'snow', x: 752, y: 300 },
  ];
  function npos(id) {
    var n = NODES.find(function (x) {
      return x.id === id;
    });
    return { x: n.x, y: n.y };
  }

  function initBridge(root) {
    var state = {
      leader: 'coo@amazon',
      lease: 54,
      gen: 6,
      phase: 'steady', // steady | lost | electing
      hover: null,
      log: [
        { t: 'registered', a: 'ops@snow', k: 'sys' },
        { t: 'heartbeat ✓', a: 'all peers', k: 'dim' },
      ],
    };
    var packets = [];
    var last = performance.now();

    function pushLog(entry) {
      state.log = state.log.slice(-7).concat([entry]);
      renderSide();
    }
    function addPacket(p) {
      p.id = Math.random();
      p.t = 0;
      packets.push(p);
    }

    /* ---- build static + side DOM ---- */
    root.className = 'bridge-layout';
    var diagWrap = document.createElement('div');
    diagWrap.className = 'bridge-diagram';
    var side = document.createElement('div');
    side.className = 'bridge-side';
    root.appendChild(diagWrap);
    root.appendChild(side);

    var svg = el('svg', { viewBox: '0 0 880 520' });
    svg.style.width = '100%';
    svg.style.display = 'block';
    diagWrap.appendChild(svg);

    // layer groups so we can repaint packets cheaply
    var gStatic = el('g');
    var gLinks = el('g');
    var gPackets = el('g');
    var gHub = el('g');
    var gNodes = el('g');
    svg.appendChild(gStatic);
    svg.appendChild(gLinks);
    svg.appendChild(gPackets);
    svg.appendChild(gHub);
    svg.appendChild(gNodes);

    // machine zones (static)
    MACHINES.forEach(function (m) {
      gStatic.appendChild(
        el('rect', {
          x: m.x, y: m.y, width: m.w, height: m.h, rx: 10,
          fill: 'oklch(0.205 0.014 250 / .5)', stroke: LINE, 'stroke-dasharray': '3 4',
        }),
      );
      gStatic.appendChild(
        el('text', {
          x: m.x + 14, y: m.y + 22, 'font-family': 'var(--mono)', 'font-size': 13,
          'font-weight': 600, fill: 'oklch(0.84 0.008 250)',
        }, m.label),
      );
      gStatic.appendChild(
        el('text', {
          x: m.x + 14, y: m.y + 38, 'font-family': 'var(--mono)', 'font-size': 9.5,
          'letter-spacing': '.08em', fill: MUTED,
        }, m.sub),
      );
    });

    var tip = document.createElement('div');
    tip.className = 'bridge-tip';
    tip.style.display = 'none';
    diagWrap.appendChild(tip);

    function renderLinks() {
      clear(gLinks);
      NODES.forEach(function (n) {
        var isLeaderLink = n.id === state.leader;
        gLinks.appendChild(
          el('line', {
            x1: n.x, y1: n.y, x2: HUB.x, y2: HUB.y,
            stroke: isLeaderLink ? 'oklch(0.805 0.135 78 / .55)' : LINE,
            'stroke-width': isLeaderLink ? 1.6 : 1,
            'stroke-dasharray': isLeaderLink ? 'none' : '2 5',
          }),
        );
      });
    }

    function renderHub() {
      clear(gHub);
      gHub.appendChild(
        el('rect', {
          x: HUB.x - 78, y: HUB.y - 30, width: 156, height: 60, rx: 9,
          fill: 'oklch(0.238 0.016 250)',
          stroke: state.phase === 'lost' ? REDC : AMBER, 'stroke-width': 1.4,
        }),
      );
      gHub.appendChild(
        el('text', {
          x: HUB.x, y: HUB.y - 8, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
          'font-size': 13, 'font-weight': 600, fill: AMBER,
        }, 'HUB · router'),
      );
      gHub.appendChild(
        el('text', {
          x: HUB.x, y: HUB.y + 9, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
          'font-size': 8.5, fill: MUTED,
        }, 'ws://amazon.home.arpa:8991'),
      );
      gHub.appendChild(
        el('text', {
          x: HUB.x, y: HUB.y + 22, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
          'font-size': 8.5, fill: state.phase === 'steady' ? GREEN : REDC,
        }, state.phase === 'steady'
          ? '● routing · leases ok'
          : state.phase === 'lost'
            ? '● lease_lost · sweeping'
            : '● electing…'),
      );
    }

    function renderNodes() {
      clear(gNodes);
      NODES.forEach(function (n) {
        var isLeader = n.id === state.leader;
        var dead = state.phase !== 'steady' && n.id === 'coo@amazon';
        var hl = state.hover === n.id;
        var g = el('g', { class: 'bridge-node' });

        if (isLeader && !reduceMotion) {
          var ring = el('circle', {
            cx: n.x, cy: n.y, r: 30, fill: 'none', stroke: AMBER,
            'stroke-width': 1, opacity: 0.4,
          });
          var a1 = el('animate', {
            attributeName: 'r', values: '24;32;24', dur: '2.4s', repeatCount: 'indefinite',
          });
          var a2 = el('animate', {
            attributeName: 'opacity', values: '0.5;0.05;0.5', dur: '2.4s', repeatCount: 'indefinite',
          });
          ring.appendChild(a1);
          ring.appendChild(a2);
          g.appendChild(ring);
        }
        g.appendChild(
          el('circle', {
            cx: n.x, cy: n.y, r: 22,
            fill: dead ? 'oklch(0.24 0.05 25)' : isLeader ? 'oklch(0.30 0.06 78)' : 'oklch(0.238 0.016 250)',
            stroke: dead ? REDC : isLeader ? AMBER : hl ? 'oklch(0.55 0.012 250)' : LINE,
            'stroke-width': isLeader ? 1.8 : 1.2,
          }),
        );
        g.appendChild(
          el('text', {
            x: n.x, y: n.y - 1, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
            'font-size': 10.5, 'font-weight': 600,
            fill: dead ? REDC : isLeader ? AMBER : 'oklch(0.9 0.005 250)',
          }, n.role),
        );
        g.appendChild(
          el('text', {
            x: n.x, y: n.y + 11, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
            'font-size': 7, fill: MUTED,
          }, '@' + n.machine),
        );
        if (isLeader) {
          g.appendChild(
            el('text', {
              x: n.x, y: n.y - 30, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
              'font-size': 8.5, 'font-weight': 600, fill: AMBER,
            }, '★ LEADER · ' + state.lease + 's'),
          );
        }
        if (n.pinned && !isLeader && state.phase !== 'steady') {
          g.appendChild(
            el('text', {
              x: n.x, y: n.y - 30, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
              'font-size': 8, fill: REDC,
            }, 'pinned→amazon'),
          );
        }
        g.addEventListener('mouseenter', function () {
          state.hover = n.id;
          renderNodes();
          showTip(n);
        });
        g.addEventListener('mouseleave', function () {
          state.hover = null;
          renderNodes();
          tip.style.display = 'none';
        });
        gNodes.appendChild(g);
      });
    }

    function showTip(n) {
      var q = n.id === state.leader ? 0 : Math.floor(Math.random() * 3);
      var hb = (Math.random() * 9 + 1).toFixed(0);
      var html =
        '<div class="id">' + n.id + '</div>' +
        '<div class="row">role &nbsp;<span>' + n.role + '</span></div>' +
        '<div class="row">queue &nbsp;<span>' + q + ' pending</span></div>' +
        '<div class="row hb">hb &nbsp;<span>' + hb + 's ago</span></div>' +
        (n.pinned ? '<div class="pin">coo role pinned to amazon</div>' : '');
      tip.innerHTML = html;
      tip.style.display = 'block';
    }

    function renderPackets() {
      clear(gPackets);
      packets.forEach(function (p) {
        var pos = ptAlong(p.pts, p.t);
        var c = el('circle', {
          cx: pos.x, cy: pos.y, r: p.r, fill: p.color,
          opacity: p.kind === 'hb' ? 0.5 : 1,
        });
        if (p.kind !== 'hb') {
          c.style.filter = 'drop-shadow(0 0 5px ' + p.color + ')';
        }
        gPackets.appendChild(c);
      });
    }

    /* ---- side panel ---- */
    var ctrl = document.createElement('div');
    ctrl.className = 'bridge-ctrl';
    var expireBtn = document.createElement('button');
    expireBtn.className = 'btn';
    expireBtn.textContent = '⚡ Expire leader lease';
    var sendBtn = document.createElement('button');
    sendBtn.className = 'btn';
    sendBtn.textContent = '↪ Send delegation';
    ctrl.innerHTML = '<div class="panel-label">Control plane</div>';
    ctrl.appendChild(expireBtn);
    ctrl.appendChild(sendBtn);
    var hint = document.createElement('div');
    hint.className = 'bridge-hint';
    hint.innerHTML =
      'Kill the leader and watch the hub sweep the dead lease and re-elect — only on ' +
      '<span class="amb">amazon</span>, where the <code>coo</code> role is pinned.';
    ctrl.appendChild(hint);
    side.appendChild(ctrl);

    var logBox = document.createElement('div');
    logBox.className = 'bridge-log';
    logBox.innerHTML = '<div class="panel-label">Wire log</div><div class="lines"></div>';
    side.appendChild(logBox);
    var lines = logBox.querySelector('.lines');

    function logColor(k) {
      return (
        {
          send: AMBER, ack: GREEN, lead: AMBER, warn: REDC,
          sys: 'oklch(0.84 0.008 250)', dim: MUTED,
        }[k] || MUTED
      );
    }
    function renderSide() {
      clear(lines);
      state.log.forEach(function (e, i) {
        var row = document.createElement('div');
        row.className = 'row';
        row.style.opacity = i === state.log.length - 1 ? 1 : 0.5 + i * 0.06;
        var t = document.createElement('span');
        t.className = 't';
        t.style.color = logColor(e.k);
        t.textContent = e.t;
        var a = document.createElement('span');
        a.className = 'a';
        a.textContent = e.a;
        row.appendChild(t);
        row.appendChild(a);
        lines.appendChild(row);
      });
      expireBtn.disabled = state.phase !== 'steady';
    }

    /* ---- traffic generators ---- */
    function delegate(speed1, speed2) {
      if (!state.leader) return;
      var targets = NODES.filter(function (n) {
        return n.id !== state.leader;
      });
      var tgt = targets[Math.floor(Math.random() * targets.length)];
      addPacket({
        pts: [npos(state.leader), HUB, npos(tgt.id)], speed: speed1, color: AMBER, r: 3.6, kind: 'msg',
        onArrive: function () {
          pushLog({ t: 'send → ' + tgt.role, a: state.leader.split('@')[0] + '→' + tgt.id, k: 'send' });
          addPacket({
            pts: [npos(tgt.id), HUB, npos(state.leader)], speed: speed2, color: GREEN, r: 3, kind: 'ack',
            onArrive: function () {
              pushLog({ t: 'ack ✓', a: tgt.id, k: 'ack' });
            },
          });
        },
      });
    }

    expireBtn.addEventListener('click', function () {
      if (state.phase !== 'steady') return;
      state.phase = 'lost';
      state.leader = null;
      state.lease = 0;
      pushLog({ t: 'lease_lost', a: 'coo@amazon · gen ' + state.gen, k: 'warn' });
      renderLinks();
      renderHub();
      renderNodes();
      setTimeout(function () {
        state.phase = 'electing';
        pushLog({ t: 'sweep · no live lease', a: 'hub', k: 'dim' });
        renderHub();
        renderNodes();
      }, 900);
      setTimeout(function () {
        pushLog({ t: 'claim_role coo', a: 'amazon · pinned', k: 'send' });
      }, 1800);
      setTimeout(function () {
        state.gen += 1;
        state.leader = 'coo@amazon';
        state.lease = 60;
        state.phase = 'steady';
        pushLog({ t: '★ primary_changed', a: 'coo@amazon · gen ' + state.gen, k: 'lead' });
        renderLinks();
        renderHub();
        renderNodes();
      }, 2700);
    });
    sendBtn.addEventListener('click', function () {
      delegate(0.9, 1);
    });

    // heartbeats — every 900ms
    setInterval(function () {
      var n = NODES[Math.floor(Math.random() * NODES.length)];
      if (state.phase === 'lost' && n.id === 'coo@amazon') return;
      addPacket({ pts: [npos(n.id), HUB], speed: 1.6, color: MUTED, r: 2.4, kind: 'hb' });
    }, 900);

    // delegations — every 2600ms, steady only
    setInterval(function () {
      if (state.phase !== 'steady' || !state.leader) return;
      delegate(0.85, 0.95);
    }, 2600);

    // lease countdown + renew — every 1000ms
    setInterval(function () {
      if (state.phase !== 'steady' || !state.leader) return;
      state.lease = state.lease <= 1 ? 60 : state.lease - 1;
      renderNodes();
    }, 1000);

    // animation loop
    function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var keep = [];
      packets.forEach(function (p) {
        p.t += dt * p.speed;
        if (p.t >= 1) {
          if (p.onArrive) p.onArrive();
        } else keep.push(p);
      });
      packets = keep;
      renderPackets();
      requestAnimationFrame(loop);
    }

    renderLinks();
    renderHub();
    renderNodes();
    renderSide();
    requestAnimationFrame(loop);
  }

  /* ==========================================================
     FIGURE 03 — Telegram sequence
     ========================================================== */
  var LANES = ['Phone', 'Relay', 'Whisper', 'Bridge', 'Agent'];
  var STEPS_OK = [
    { from: 0, to: 1, label: 'voice note · OGG/Opus 🎤', k: 'in' },
    { from: 1, to: 1, label: 'access check · allowFrom ✓', k: 'self' },
    { from: 1, to: 2, label: 'transcribe (on-prem)', k: 'in' },
    { from: 2, to: 1, label: '→ text', k: 'back' },
    { from: 1, to: 3, label: '[USER-RELAY] → researcher@beast', k: 'in' },
    { from: 3, to: 4, label: 'deliver to queue', k: 'in' },
    { from: 4, to: 3, label: 'ack ✓', k: 'ack' },
    { from: 3, to: 1, label: 'ack ✓', k: 'ack' },
    { from: 1, to: 0, label: 'delivered ✓', k: 'ack' },
  ];
  var STEPS_DEGRADED = [
    { from: 0, to: 1, label: 'voice note · OGG/Opus 🎤', k: 'in' },
    { from: 1, to: 1, label: 'access check · allowFrom ✓', k: 'self' },
    { from: 1, to: 2, label: 'transcribe (on-prem)', k: 'in' },
    { from: 2, to: 1, label: '→ text', k: 'back' },
    { from: 1, to: 3, label: '[USER-RELAY] → researcher@beast', k: 'in' },
    { from: 3, to: 4, label: 'deliver to queue', k: 'in' },
    { from: 3, to: 3, label: 'pending_ack · timeout 30s ⏱', k: 'wait' },
    { from: 3, to: 1, label: 'degraded · agent down', k: 'warn' },
    { from: 1, to: 0, label: '⚠ went unheard', k: 'warn' },
  ];

  function kColor(k) {
    return (
      { in: AMBER, back: 'oklch(0.7 0.05 250)', self: MUTED, ack: GREEN, warn: REDC, wait: AMBER }[k] ||
      AMBER
    );
  }

  function initSequence(root) {
    var state = { degraded: false, active: -1, playing: !reduceMotion };
    var W = 860,
      padX = 90,
      top = 64,
      rowH = 46;
    function laneX(i) {
      return padX + i * ((W - padX * 2) / (LANES.length - 1));
    }
    function steps() {
      return state.degraded ? STEPS_DEGRADED : STEPS_OK;
    }

    var svg = el('svg');
    svg.style.width = '100%';
    svg.style.display = 'block';
    root.appendChild(svg);

    var controls = document.createElement('div');
    controls.className = 'seq-controls';
    var playBtn = document.createElement('button');
    playBtn.className = 'btn';
    var replayBtn = document.createElement('button');
    replayBtn.className = 'btn';
    replayBtn.textContent = '↺ Replay';
    var degBtn = document.createElement('button');
    degBtn.className = 'btn';
    var readout = document.createElement('span');
    readout.className = 'step-read';
    controls.appendChild(playBtn);
    controls.appendChild(replayBtn);
    controls.appendChild(degBtn);
    controls.appendChild(readout);
    root.appendChild(controls);

    function render() {
      var st = steps();
      var H = top + st.length * rowH + 30;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      clear(svg);

      // lifelines
      LANES.forEach(function (l, i) {
        var g = el('g');
        g.appendChild(
          el('rect', {
            x: laneX(i) - 44, y: 20, width: 88, height: 30, rx: 6,
            fill: 'oklch(0.238 0.016 250)', stroke: LINE,
          }),
        );
        g.appendChild(
          el('text', {
            x: laneX(i), y: 39, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
            'font-size': 11.5, 'font-weight': 600, fill: 'oklch(0.9 0.005 250)',
          }, l),
        );
        g.appendChild(
          el('line', {
            x1: laneX(i), y1: 52, x2: laneX(i), y2: H - 12, stroke: LINE, 'stroke-dasharray': '2 5',
          }),
        );
        svg.appendChild(g);
      });

      // messages
      st.forEach(function (s, i) {
        var y = top + i * rowH + 18;
        var on = i === state.active,
          done = i < state.active;
        var x1 = laneX(s.from),
          x2 = laneX(s.to);
        var col = on ? kColor(s.k) : done ? 'oklch(0.5 0.02 250)' : LINE;
        var g = el('g', { opacity: on ? 1 : s.from === s.to ? (done ? 0.55 : 0.32) : done ? 0.6 : 0.32 });

        if (s.from === s.to) {
          // self-call loop
          g.appendChild(
            el('path', {
              d: 'M ' + (x1 + 4) + ' ' + (y - 8) + ' h 34 v 18 h -34',
              fill: 'none', stroke: col, 'stroke-width': on ? 1.8 : 1.2,
            }),
          );
          g.appendChild(
            el('polygon', {
              points: x1 + 4 + ',' + (y + 10) + ' ' + (x1 + 11) + ',' + (y + 6) + ' ' + (x1 + 11) + ',' + (y + 14),
              fill: col,
            }),
          );
          g.appendChild(
            el('text', {
              x: x1 + 48, y: y + 4, 'font-family': 'var(--mono)', 'font-size': 11,
              fill: on ? kColor(s.k) : MUTED,
            }, s.label),
          );
          svg.appendChild(g);
          return;
        }

        var dir = x2 > x1 ? 1 : -1;
        var line = el('line', {
          x1: x1, y1: y, x2: x2 - dir * 7, y2: y, stroke: col, 'stroke-width': on ? 2 : 1.2,
          'stroke-dasharray': s.k === 'ack' || s.k === 'back' ? '5 4' : 'none',
        });
        if (on && !reduceMotion) {
          line.appendChild(
            el('animate', {
              attributeName: 'stroke-dashoffset', values: '18;0', dur: '0.9s', repeatCount: 'indefinite',
            }),
          );
        }
        g.appendChild(line);
        g.appendChild(
          el('polygon', {
            points: x2 + ',' + y + ' ' + (x2 - dir * 8) + ',' + (y - 4) + ' ' + (x2 - dir * 8) + ',' + (y + 4),
            fill: col,
          }),
        );
        g.appendChild(
          el('text', {
            x: (x1 + x2) / 2, y: y - 8, 'text-anchor': 'middle', 'font-family': 'var(--mono)',
            'font-size': 11, fill: on ? kColor(s.k) : MUTED,
          }, s.label),
        );
        if (on && !reduceMotion) {
          var token = el('circle', { r: 4, cy: y, fill: kColor(s.k) });
          token.style.filter = 'drop-shadow(0 0 5px ' + kColor(s.k) + ')';
          token.appendChild(
            el('animate', {
              attributeName: 'cx', values: x1 + ';' + x2, dur: '0.9s', repeatCount: 'indefinite',
            }),
          );
          g.appendChild(token);
        }
        svg.appendChild(g);
      });

      playBtn.textContent = state.playing ? '❚❚ Pause' : '▶ Play';
      degBtn.textContent = state.degraded ? '● Agent down (degraded)' : '○ Simulate agent down';
      degBtn.className = 'btn' + (state.degraded ? ' primary' : '');
      readout.textContent =
        'step ' + (state.active < 0 ? '—' : state.active + 1) + '/' + st.length;
    }

    var timer = null;
    function startTimer() {
      stopTimer();
      if (!state.playing) return;
      timer = setInterval(function () {
        state.active = state.active >= steps().length - 1 ? -1 : state.active + 1;
        render();
      }, 1050);
    }
    function stopTimer() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    playBtn.addEventListener('click', function () {
      state.playing = !state.playing;
      render();
      startTimer();
    });
    replayBtn.addEventListener('click', function () {
      state.active = -1;
      render();
    });
    degBtn.addEventListener('click', function () {
      state.degraded = !state.degraded;
      state.active = -1;
      render();
      startTimer();
    });

    render();
    startTimer();
  }

  /* ==========================================================
     FIGURE 04 — MoE vs dense bars
     ========================================================== */
  function initMoe(root) {
    var MAX = 140;
    var bars = [
      { name: 'Qwen3 35B-A3B', note: 'MoE · 3B active · 4-bit MLX', val: 123.6, lead: true },
      { name: '27B dense', note: '4-bit · same machine', val: 30 },
    ];
    root.className = 'moe';
    bars.forEach(function (b) {
      var row = document.createElement('div');
      row.className = 'bar-row' + (b.lead ? ' lead' : '');
      var head = document.createElement('div');
      head.className = 'bar-head';
      head.innerHTML =
        '<div><span class="bar-name">' + b.name + '</span>' +
        '<span class="bar-note">' + b.note + '</span></div>' +
        '<span class="bar-val">' + b.val + ' <small>tok/s</small></span>';
      var track = document.createElement('div');
      track.className = 'bar-track';
      var fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.setProperty('--w', (b.val / MAX) * 100 + '%');
      track.appendChild(fill);
      row.appendChild(head);
      row.appendChild(track);
      root.appendChild(row);
    });
    var note = document.createElement('div');
    note.className = 'moe-note';
    note.innerHTML =
      '<span class="big">≈ 4× faster</span>' +
      '<span>MoE beats dense — same 4-bit budget, on <span class="hl">beast</span> ' +
      '(M4 Max). Fallback: local Qwen → local Gemma → cloud Claude.</span>';
    root.appendChild(note);

    if (reduceMotion) {
      root.classList.add('show');
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            root.classList.add('show');
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(root);
  }

  /* ==========================================================
     Page chrome: progress bar, rail nav, reveal-on-scroll
     ========================================================== */
  function initChrome() {
    var bar = document.getElementById('progress');
    if (bar) {
      var onScroll = function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var secs = ['top', 's1', 's2', 's3', 's4', 's5', 's6'];
    var links = {};
    document.querySelectorAll('.railnav a').forEach(function (a) {
      links[a.dataset.sec] = a;
    });
    if (Object.keys(links).length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              Object.keys(links).forEach(function (k) {
                links[k].classList.remove('on');
              });
              if (links[e.target.id]) links[e.target.id].classList.add('on');
            }
          });
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      secs.forEach(function (id) {
        var elm = document.getElementById(id);
        if (elm) io.observe(elm);
      });
    }

    // reveal — threshold 0.12, once; disabled under reduced motion
    var targets = document.querySelectorAll('.article .reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) {
        t.classList.add('in');
      });
    } else {
      var rio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              rio.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      targets.forEach(function (t) {
        rio.observe(t);
      });
    }
  }

  /* ==========================================================
     boot
     ========================================================== */
  function boot() {
    var b = document.getElementById('fig-bridge');
    if (b) initBridge(b);
    var s = document.getElementById('fig-sequence');
    if (s) initSequence(s);
    var m = document.getElementById('fig-moe');
    if (m) initMoe(m);
    initChrome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
