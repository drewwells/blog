# blog.wellsstar.dev

The editorial blog at **https://blog.wellsstar.dev**, built with [Astro](https://astro.build)
and deployed to GitHub Pages.

Each article is a **self-contained bundle** (its own HTML, CSS, and optional JS) wrapped in a
thin shared site shell. This keeps designed articles — e.g. ones exported from Claude Design —
pixel-faithful, while the home page, RSS feed, and sitemap are generated from a single manifest.

> **Heads up — this repo has history.** The `master`, `hugo`, `octopress-archive`,
> `ghost-import`, and other branches are archives of previous (2012–2018) versions of the blog.
> They are kept for posterity. All current work happens on `main`.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

## Project layout

```
public/
  CNAME                         custom domain (blog.wellsstar.dev)
  .nojekyll                     REQUIRED — lets GitHub Pages serve Astro's _astro/ dir
  favicon.svg
  posts/<slug>/charts.js        per-article JS assets (served as-is)
src/
  consts.ts                     site title / description / URL
  posts.ts                      POST MANIFEST — drives home list, RSS, sitemap
  layouts/
    BaseLayout.astro            <head>, meta/OG, fonts
    PostLayout.astro            site header + "back" link + footer around an article
  components/
    SiteHeader.astro
    PostCard.astro              one row in the home list
  styles/
    site.css                    shared editorial shell styles
    posts/<slug>.css            per-article stylesheet (imported only by its page)
  pages/
    index.astro                 home page
    rss.xml.js                  RSS feed
    posts/<slug>.astro          one article page
.github/workflows/deploy.yml    build + publish dist/ to the gh-pages branch
```

## Adding a post

A new post is a repeatable 4-step recipe. Say the slug is `my-new-post`:

1. **Stylesheet** — drop the article's CSS at `src/styles/posts/my-new-post.css`.
2. **Scripts** (if any) — drop JS at `public/posts/my-new-post/charts.js` (and similar).
3. **Page** — create `src/pages/posts/my-new-post.astro`:

   ```astro
   ---
   import PostLayout from '../../layouts/PostLayout.astro';
   import { getPost } from '../../posts';
   import '../../styles/posts/my-new-post.css';
   const post = getPost('my-new-post');
   ---
   <PostLayout post={post}>
     <!-- paste the article's <body> markup here -->
     <script src="/posts/my-new-post/charts.js" is:inline></script>
   </PostLayout>
   ```

4. **Manifest** — prepend an entry to `posts` in `src/posts.ts`:

   ```ts
   { slug: 'my-new-post', title: '…', dek: '…', kicker: '…', date: '2026-06-15', tags: ['…'] }
   ```

Run `npm run build` to confirm it compiles, then commit and push to `main`.

> **Note on article markup in `.astro`:** Astro templates are HTML-based, so named entities
> (`&mdash;`, `&ldquo;`, …) work as-is. Just avoid bare `{` / `}` in text — escape them as
> `&#123;` / `&#125;` if a design uses them literally, since Astro reads `{…}` as an expression.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes
`dist/` to the **`gh-pages`** branch via `peaceiris/actions-gh-pages`. GitHub Pages serves that
branch at the custom domain. The `CNAME` file and `.nojekyll` marker ship in `dist/` (from
`public/`) so the domain and `_astro/` assets keep working on every deploy.

### One-time DNS setup (manual)

For `blog.wellsstar.dev` to resolve, add this record at the DNS provider for `wellsstar.dev`:

```
Type    Name    Value
CNAME   blog    drewwells.github.io
```

GitHub auto-provisions an HTTPS certificate once DNS resolves (can take up to ~24h). Until then
the published content is also viewable from the `gh-pages` branch in repo settings.
