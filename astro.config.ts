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
  // Guide code samples use the site's own dark block instead of Shiki's inline colours.
  markdown: { syntaxHighlight: false },
  // Emit every processed script as a file so the CSP can drop script-src 'unsafe-inline'; the only inline
  // script left is the fixed `js` class snippet in YiAiLayout, allowed by hash (see test-build.mjs).
  vite: { build: { assetsInlineLimit: 0 } },
});
