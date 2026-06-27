// ---------------------------------------------------------------------------
// Post manifest — the single source of truth for the home list, RSS, sitemap.
//
// To add a post (see README "Adding a post"): create the page at
// src/pages/posts/<slug>.astro, then prepend an entry here. Keep `posts`
// sorted newest-first; the home page and feed render them in array order.
// ---------------------------------------------------------------------------

export interface Post {
  /** URL slug; the page lives at src/pages/posts/<slug>.astro -> /posts/<slug>/ */
  slug: string;
  /** Headline shown on the home list and in the feed. */
  title: string;
  /** One- or two-sentence summary (the "dek"). */
  dek: string;
  /** Short uppercase eyebrow shown above the title on the home list. */
  kicker: string;
  /** Publication date, ISO 8601 (YYYY-MM-DD). Drives sort + feed pubDate. */
  date: string;
  /** Free-form tags for future filtering. Not yet surfaced in the UI. */
  tags?: string[];
}

export const posts: Post[] = [
  {
    slug: 'the-rotation',
    title: 'The Rotation',
    dek: 'Three interchangeable four-day programs — A, B, C — built from one exercise pool. A tap-through gym card that remembers where you stopped.',
    kicker: 'Training · Rotating Split',
    date: '2026-06-27',
    tags: ['training', 'reference'],
  },
  {
    slug: 'schwab-crypto-fees',
    title: 'The 0.75% Round Trip',
    dek: 'Schwab now sells bitcoin two ways: wrapped in an ETF that skims a small fee every year you hold, or bought direct, where you pay 0.75% going in and 0.75% coming out. One is a slow leak, the other a cover charge — and which is cheaper turns entirely on how long you stay. An interactive break-even, fees verified June 2026.',
    kicker: 'Crypto / Cost of Ownership',
    date: '2026-06-23',
    tags: ['data', 'crypto', 'investing', 'fees', 'schwab'],
  },
  {
    slug: 'message-bus-for-my-agents',
    title: 'I built a message bus so my AI agents could run my servers.',
    dek: 'Agents talk to each other over a custom WebSocket bridge — with leader election and a Telegram voice bridge — so I can run every machine through one elected leader. Supervisors keep it fault-tolerant across Linux and macOS, and it pages me when it hits something it can’t resolve.',
    kicker: 'Homelab / Agent Infrastructure',
    date: '2026-06-02',
    tags: [
      'homelab',
      'agents',
      'distributed-systems',
      'infrastructure',
      'llm',
    ],
  },
  {
    slug: 'the-5-3-trillion-question',
    title: 'The $5.3 Trillion Question',
    dek: 'In 2024 the United States spent $5.3 trillion on health care — about 18% of its economy and nearly double what peer nations spend per person — yet it buys some of the shortest lives in the rich world. The gap isn’t how much care Americans use. It’s the price.',
    kicker: 'U.S. Health Care',
    date: '2026-05-31',
    tags: ['data', 'health-care', 'economics', 'united-states'],
  },
  {
    slug: 'effectiveness-per-tax-dollar',
    title:
      'Effectiveness per Tax Dollar: Austin ISD vs. Texas’s Big Districts',
    dek: 'Austin ISD raises and spends the most per pupil of Texas’s big urban districts — and posts the best results. It also sends roughly half its local property taxes back to the state, and that single fact can flip its efficiency ranking from last toward the top.',
    kicker: 'Texas School Finance',
    date: '2026-05-31',
    tags: ['data', 'education', 'texas', 'public-finance'],
  },
];

/** Posts in display order (already newest-first by convention). */
export const sortedPosts: Post[] = [...posts].sort(
  (a, b) => +new Date(b.date) - +new Date(a.date),
);

export function getPost(slug: string): Post {
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error(`No post found in posts.ts for slug "${slug}"`);
  return post;
}
