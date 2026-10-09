import { readFile, writeFile } from 'node:fs/promises';

// A plain build is a noindex preview. A production build sets the real origin and optional subpath, e.g.
// SITE_ORIGIN=https://www.yeeeai.com (SITE_BASE only for a subpath) — which enables canonical URLs, a sitemap and indexing.
export const site = process.env.SITE_ORIGIN || undefined;
export const base = process.env.SITE_BASE || undefined;

const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

/** Writes sitemap.xml and an allowing robots.txt/_headers after a production build. */
export const indexing = {
  name: 'yi-ai-indexing',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!site) return;
      const out = (file) => new URL(file, dir);
      const routes = JSON.parse(await readFile(out('site-manifest.json'), 'utf8'));
      const url = (path) => escapeXml(new URL(path, site).href);
      const entries = routes.map((route) => {
        const [zh, en] = route.lang === 'zh' ? [route.path, route.counterpart] : [route.counterpart, route.path];
        return [
          '  <url>',
          `    <loc>${url(route.path)}</loc>`,
          `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${url(zh)}"/>`,
          `    <xhtml:link rel="alternate" hreflang="en" href="${url(en)}"/>`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(zh)}"/>`,
          '  </url>',
        ].join('\n');
      });
      await writeFile(
        out('sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`
      );
      // Crawlers only read robots.txt at the origin root; this copy matters when the site owns the root.
      const sitemap = new URL(`${(base || '').replace(/\/$/, '')}/sitemap.xml`, site).href;
      await writeFile(out('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
      const headers = await readFile(out('_headers'), 'utf8');
      await writeFile(out('_headers'), headers.replace(/^\s*X-Robots-Tag:.*\n/m, ''));
    },
  },
};
