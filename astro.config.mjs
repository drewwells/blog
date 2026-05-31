// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain serves at the root, so no `base` path is needed.
export default defineConfig({
  site: 'https://blog.wellsstar.dev',
  integrations: [sitemap()],
});
