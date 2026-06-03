// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain serves at the root, so no `base` path is needed.
export default defineConfig({
  site: 'https://blog.wellsstar.dev',
  integrations: [sitemap()],
  // Dev server: bind all interfaces and allow the homelab hostname so the
  // blog is reachable at http://server.home.arpa:4321 from other machines.
  server: {
    host: true,
    allowedHosts: ['server.home.arpa', '.home.arpa'],
  },
});
