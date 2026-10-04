import { defineConfig } from 'astro/config';
import { base, indexing, site } from './scripts/site-indexing.mjs';

// Canonical origin, subpath and sitemap come from SITE_ORIGIN / SITE_BASE; see scripts/site-indexing.mjs.
export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [indexing],
});
