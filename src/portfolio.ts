// ---------------------------------------------------------------------------
// Portfolio manifest — the single source of truth for the /portfolio/ page.
//
// This is the curated, hiring-facing view of selected work. It is intentionally
// separate from posts.ts: a portfolio item points at wherever the full story
// lives (usually a blog post here, but `href` can be any URL), and carries the
// framing a reviewer wants — what it is, the role played, the stack.
//
// To add a piece: prepend an entry below. Keep it newest-first; the page
// renders them in array order.
// ---------------------------------------------------------------------------

export interface PortfolioItem {
  /** Stable key/anchor for the item. */
  slug: string;
  /** Project name shown as the card title. */
  title: string;
  /** Short uppercase eyebrow — the category/domain. */
  kicker: string;
  /** One- or two-sentence framing of what it is and why it matters. */
  blurb: string;
  /** Role / what you did. */
  role: string;
  /** Notable technologies, in display order. */
  stack: string[];
  /** Year (or range) for the meta line. */
  year: string;
  /** Where the full write-up lives. Internal path or absolute URL. */
  href: string;
  /** True when `href` points off-site (renders an external-link affordance). */
  external?: boolean;
}

export const portfolio: PortfolioItem[] = [
  {
    slug: 'message-bus-for-my-agents',
    title: 'A message bus for my AI agents',
    kicker: 'Homelab · Distributed Systems',
    blurb:
      'A custom WebSocket message bus with leader election and a Telegram voice bridge that turns a five-machine homelab — Linux and macOS alike — into a fault-tolerant organization of AI agents that supervises itself, keeps the apps running, and pages me when it gets stuck.',
    role: 'Design & implementation',
    stack: [
      'WebSocket bus',
      'Leader election',
      'Telegram bridge',
      'Linux + macOS',
      'LLM agents',
    ],
    year: '2026',
    href: '/posts/message-bus-for-my-agents/',
  },
];
