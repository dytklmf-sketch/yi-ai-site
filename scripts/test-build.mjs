import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// sha256 of the `js` class snippet in YiAiLayout; mirrored in /etc/nginx/snippets/yi-ai-site-headers.conf.
const inlineScriptHash = 'sa2BD07tH4oO53uT1B5vNSLM2+gcrREM4WTXttKp6oU=';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const parts = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))
  );
  return parts.flat();
}
// Production builds (SITE_ORIGIN, optional SITE_BASE) must be indexable; plain builds stay noindex previews.
const origin = process.env.SITE_ORIGIN;
const base = (process.env.SITE_BASE || '').replace(/\/$/, '');
const local = (url) => url.slice(base.length);
const files = await walk('dist');
const html = files.filter((file) => file.endsWith('.html'));
const routes = JSON.parse(await readFile('dist/site-manifest.json', 'utf8'));
// Eight pages per language (home, three services, contact, guides, about, FAQ) plus one per guide.
const guideCount = (await readdir('src/content/guides/zh')).length;
assert.equal(guideCount, (await readdir('src/content/guides/en')).length, 'every guide is paired');
const routeCount = 2 * (8 + guideCount);
assert.equal(routes.length, routeCount, `${routeCount} bilingual content routes`);
assert.equal(html.length, routeCount + 2, 'content pages, the entry and the 404');
assert.equal(new Set(routes.map((route) => route.path)).size, routeCount);
assert.equal(new Set(routes.map((route) => route.title)).size, routeCount);
assert.equal(new Set(routes.map((route) => route.image)).size, routeCount);
for (const route of routes) {
  assert(route.path.startsWith(`${base}/`) && route.image.startsWith(`${base}/brand/`), `${route.path}: base path`);
  const text = await readFile(`dist${local(route.path)}index.html`, 'utf8');
  if (origin) {
    const canonical = new URL(route.path, origin).href;
    assert(text.includes(`<link rel="canonical" href="${canonical}">`), `${route.path}: canonical`);
    assert(text.includes(`<meta property="og:url" content="${canonical}">`), `${route.path}: og:url`);
    assert(text.includes(`hreflang="x-default"`), `${route.path}: x-default alternate`);
    assert(!text.includes('noindex'), `${route.path}: production pages must be indexable`);
  }
  assert(routes.some((other) => other.path === route.counterpart && other.counterpart === route.path));
  assert(text.includes(route.image));
  if (route.kind === 'article') {
    assert(!/<li>\s*\*\*/.test(text), `Unparsed Markdown emphasis: ${route.path}`);
    assert(text.includes('"@type":"Article"'));
    assert(text.includes('class="key-points"'), `${route.path}: key points under the title`);
    assert(text.includes('article-sources') && text.includes('article-inquiry'));
    assert(text.includes(`?topic=${route.service}`));
    // Round 38: no dates on the page; dateModified stays in the structured data only.
    assert(!/<time\b/.test(text), `${route.path}: no visible update date`);
  }
}
assert.match(await readFile('dist/404.html', 'utf8'), /<title>页面未找到/);
for (const file of html) {
  const text = await readFile(file, 'utf8');
  // The nginx CSP allows exactly one inline script by hash; anything else inline would be blocked in production.
  for (const [, attrs, body] of text.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=|application\/ld\+json/.test(attrs)) continue;
    const hash = createHash('sha256').update(body).digest('base64');
    assert.equal(hash, inlineScriptHash, `${file}: unexpected inline script; update the CSP hash in nginx too`);
  }
  if (!origin || file === 'dist/404.html' || file === 'dist/index.html')
    assert.match(text, /content="noindex, (?:no)?follow"/, `${file}: noindex required`);
  for (const [, url] of text.matchAll(/(?:href|src|content)="(\/[^"]*)"/g))
    assert(url.startsWith(`${base}/`) && !url.startsWith('//'), `${file}: ${url} ignores the base path`);
  assert(!text.includes('astrowind.vercel.app'), `${file}: template origin leaked`);
  assert(!text.includes('googletagmanager'), `${file}: tracking leaked`);
  if (!origin) assert(!text.includes('rel="canonical"'), `${file}: no canonical before a domain is chosen`);
  assert(!text.includes('model-catalog.jpg'), `${file}: removed product screenshot must not return`);
  if (file !== 'dist/index.html') {
    assert(text.includes('application/ld+json'), `${file}: structured brand data missing`);
    assert(text.includes('og:image'), `${file}: sharing metadata missing`);
    assert(text.includes('name="description"'), `${file}: description missing`);
    assert(text.includes(`${base}/brand/favicon.svg?v=whale-a`), `${file}: use the current optical favicon`);
  }
  // Round 41: no small two-digit mono numbering (01, 02…) anywhere.
  assert(
    !/class="[^"]*\bmono\b[^"]*">0\d</.test(text) && !/faq-number/.test(text),
    `${file}: small 01-style numbering`
  );
  // Round 38: the owner wants no dates on the site (checked-on, updated-on, valid-until).
  const visible = text
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ');
  assert(!/\d{4}-\d{2}-\d{2}|核对于|更新于|有效期至/.test(visible), `${file}: a date is visible`);
  // Round 39: no sample usage figures in the service pages' hero cards and quote notes.
  if (/\/(workbuddy|model-services|infrastructure)\/index\.html$/.test(file))
    assert(!/2000 万|20M tokens|约 20 人|About 20\b|约一年|About a year/.test(visible), `${file}: sample usage figure`);
  // Round 12: chapter titles are short labels, not slogans.
  for (const [, heading] of text.matchAll(/<h2[^>]*class="(?:section-title|cta-title)"[^>]*>([^<]*)</g))
    assert(
      !/[。，,.\n]/.test(heading.trim()) && heading.trim().length <= 32,
      `${file}: heading "${heading}" reads as a slogan`
    );
  // Round 42: the copy rules cover the guides too, plus the template headings and self-referring sentences.
  assert(
    !/先[^<。]{0,12}再|写不全|逐条|先给结论|适用条件|The short answer|When this applies|本文帮助|下文是/.test(text),
    `${file}: AI-style copy pattern`
  );
  if (/\/(workbuddy|model-services|infrastructure)\/index\.html$/.test(file)) {
    assert(text.includes('class="service-sample'), `${file}: hero sample missing`);
    if (file.includes('/model-services/')) {
      assert(
        text.includes('class="service-sample sample-window api-card"'),
        `${file}: the CCG API request card is missing`
      );
      assert(text.includes('https://ccg-cli.online/v1/chat/completions'), `${file}: use the public CCG API base URL`);
      assert(
        /<code><span class="type-line"[^>]*>curl /.test(text),
        `${file}: no stray whitespace at the top of the request`
      );
      assert(/&lt;(?:模型名|model)&gt;/.test(text), `${file}: the model name stays a placeholder`);
      assert(text.includes('CCG API'), `${file}: name the product CCG API`);
    } else
      assert(text.includes('class="service-sample sample-window request-sheet"'), `${file}: request sheet missing`);
    assert(!text.includes('id="scope"') && !text.includes('id="brief"'), `${file}: scope and brief merged`);
    assert.equal((text.match(/class="scenario-icon"/g) || []).length, 4, `${file}: four scenario cards`);
    assert.equal((text.match(/class="step-card-index/g) || []).length, 3, `${file}: three step cards`);
    assert.equal((text.match(/class="tag-list"/g) || []).length, 1, `${file}: quote inputs as chips`);
    // Round 34: only WorkBuddy keeps the fourth chapter (editions); the other services drop their explainers.
    const wb = file.includes('/workbuddy/');
    assert.equal(
      // Round 41: subnav items carry no numbers.
      ((text.match(/<nav class="subnav"[\s\S]*?<\/nav>/) || [''])[0].match(/<a href="#[a-z]+">/g) || []).length,
      wb ? 5 : 3,
      `${file}: chapters in the subnav`
    );
    assert.equal(text.includes('id="editions"'), wb, `${file}: WorkBuddy editions only on its page`);
    // Round 35: official list prices with source and check date; round 36: Enterprise only (three editions).
    if (wb)
      assert(
        text.includes('cloud.tencent.com/document/product/1831/134332') &&
          (text.match(/class="wb-tier"/g) || []).length === 3 &&
          !/体验版|Trial</.test(text) &&
          // Round 39: the certificate sits under the price cards; the comparison follows.
          /class="wb-tiers"[\s\S]*class="wb-cert"[\s\S]*id="compare"/.test(text) &&
          // Round 43: two aligned cards, eight rows each, no label column.
          (text.match(/<li><svg[^>]*lucide-minus/g) || []).length === 8 &&
          (text.match(/<li><svg[^>]*lucide-check/g) || []).length >= 8,
        `${file}: official WorkBuddy Enterprise prices with source and date`
      );
    assert(!/id="(?:access|forms)"|data-cost-estimator/.test(text), `${file}: removed explainers stay removed`);
    assert(/href="[^"]*\/templates\/(?:zh|en)\/[a-z-]+\.txt" download/.test(text), `${file}: brief download`);
  }
  // Round 40: every page but contact carries the resident contact button; the closing contact card is gone.
  if (file !== 'dist/index.html' && file !== 'dist/404.html') {
    assert.equal(text.includes('data-contact-fab'), !file.endsWith('/contact/index.html'), `${file}: contact button`);
    assert(!text.includes('cta-strip'), `${file}: the closing contact card stays removed`);
  }
  if (/\/(workbuddy|model-services|infrastructure)\/index\.html$/.test(file))
    assert(/class="guide-list"[^]*?(<li>[^]*?){4}<\/ul>/.test(text), `${file}: related guides as a compact list`);
  if (file.endsWith('/faq/index.html')) {
    assert.equal((text.match(/<details data-service=/g) || []).length, 18, `${file}: six questions per service`);
    assert(text.includes('data-faq-filter'), `${file}: filter by service`);
    assert(!text.includes('CCG'), `${file}: product stays off the FAQ`);
  }
  if (file.endsWith('/about/index.html')) {
    assert(text.includes('<span class="mono">CCG API</span>'), `${file}: the product is named CCG API`);
    assert(!text.includes('principle'), `${file}: the working-rules block stays removed`);
    // Round 40: the closing contact card left; the resident contact button is not a section.
    assert.equal((text.match(/<section /g) || []).length, 3, `${file}: three chapters`);
  }
  if (file.endsWith('/zh/index.html') || file.endsWith('/en/index.html')) {
    assert(!text.includes('CCG'), `${file}: product displaced the brand`);
    assert(!text.includes('hero-routes'), `${file}: the hero routes stay removed; the columns below carry them`);
    assert.equal((text.match(/data-service-column=/g) || []).length, 3, `${file}: one column per service`);
    assert(!text.includes('role="tab"'), `${file}: services are side-by-side columns, not tabs`);
    assert(!text.includes('id="process"'), `${file}: the process lives in the inquiry chapter`);
    // Round 43: home lists four guides in the compact list, like the service pages.
    assert(/class="guide-list"[^]*?(<li>[^]*?){4}<\/ul>/.test(text), `${file}: guides as a compact list`);
    // Round 33: one question per service on the home page; the rest live on the FAQ page.
    assert.equal((text.match(/<details data-service=/g) || []).length, 3, `${file}: one FAQ per service`);
    assert(/href="[^"]*\/faq\/"/.test(text), `${file}: link to the FAQ page`);
    assert(!text.includes('data-faq-filter'), `${file}: no filter for three questions`);
    assert.equal((text.match(/class="check-grid"/g) || []).length, 3, `${file}: scenarios on each service card`);
    assert(!/\bL[123]\b/.test(text.replace(/<svg[\s\S]*?<\/svg>/g, '')), `${file}: layer codes stay off the page`);
    assert(!text.includes('cta-steps'), `${file}: the inquiry carries no step list`);
    assert(!text.includes('class="section promise"'), `${file}: the slogan-only promise chapter stays removed`);
    assert(text.includes('data-contact-panel'), `${file}: consultation should work on the homepage`);
    // Round 15: a "why Easy AI" chapter with four factual reasons. Round 17: the seven partners named by the owner.
    // Round 17c: their logos in a chapter of their own. Round 18: the partners moved inside the why chapter as one
    // looping lane; the list repeats for the loop, so only the first copy carries an accessible name.
    assert(text.includes('id="why"'), `${file}: why-Easy-AI chapter missing`);
    assert.equal((text.match(/class="why-card"/g) || []).length, 4, `${file}: four reasons`);
    assert(/id="why"[\s\S]*id="guides"/.test(text), `${file}: the why chapter (with its partners) precedes the guides`);
    // Round 28: the partners sit still in one grid (BRAND.md: no looping motion), each listed once.
    assert.equal((text.match(/class="partner-plate"/g) || []).length, 8, `${file}: 8 partners, listed once`);
    const named = [...text.matchAll(/<img src="[^"]*\/partners\/[^"]+" alt="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(named.length, 8, `${file}: each partner announced once`);
    assert(named.includes(file.includes('/en/') ? 'China Mobile' : '中国移动'), `${file}: partner names`);
    assert(named.includes(file.includes('/en/') ? 'DAYUSEA' : '大鱼出海'), `${file}: the eighth partner`);
    assert(!/partner-(?:set|lane|toggle)/.test(text), `${file}: no travelling partner lane`);
    // Round 28: each reason links to its evidence; the authorization is on the first screen.
    assert.equal(
      (text.match(/class="text-link why-proof"/g) || []).length,
      4,
      `${file}: every reason has a proof link`
    );
    assert(
      /class="hero-credential" href="[^"]*\/workbuddy\/#editions"/.test(text),
      `${file}: hero authorization badge`
    );
    for (const service of ['workbuddy', 'model-services', 'infrastructure']) {
      assert(text.includes(`/contact/?topic=${service}`), `${file}: service-specific inquiry is missing`);
      assert(text.includes(`data-topic-preparation="${service}"`), `${file}: preparation copy is missing`);
      assert(/class="topic-brief" href="[^"]*\/templates\//.test(text), `${file}: brief download in the contact panel`);
    }
  }
}
if (origin) {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(
    locs.sort(),
    routes.map((route) => new URL(route.path, origin).href).sort(),
    'Sitemap lists every route'
  );
  assert.equal((sitemap.match(/hreflang="x-default"/g) || []).length, routeCount);
  assert.match(await readFile('dist/robots.txt', 'utf8'), new RegExp(`Sitemap: ${origin}${base}/sitemap.xml`));
  assert(!(await readFile('dist/_headers', 'utf8')).includes('X-Robots-Tag'), 'Production headers must allow indexing');
  for (const css of files.filter((file) => file.endsWith('.css')))
    for (const [, url] of (await readFile(css, 'utf8')).matchAll(/url\((\/[^)]*)\)/g))
      assert(url.startsWith(`${base}/`), `${css}: ${url} ignores the base path`);
} else {
  assert.equal(files.filter((file) => file.includes('sitemap')).length, 0);
  assert.match(await readFile('dist/robots.txt', 'utf8'), /Disallow: \//);
}
assert.equal(files.filter((file) => file.includes('decapcms')).length, 0);
assert(!files.includes('dist/products/model-catalog.jpg'));
for (const lang of ['zh', 'en'])
  for (const name of [
    'workbuddy-purchase-brief.txt',
    'model-usage-brief.txt',
    'workload-brief.txt',
    'model-price-comparison.csv',
  ])
    assert(
      (await readFile(`dist/templates/${lang}/${name}`)).subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])),
      `${name}: UTF-8 BOM`
    );
for (const font of ['manrope-latin', 'noto-sans-sc-site', 'noto-sans-sc-guides', 'jetbrains-mono-latin']) {
  const bytes = await readFile(`dist/fonts/${font}.woff2`);
  assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
  // The Chinese subset grows with the copy (686 characters in round 9); Latin subsets stay well below.
  // Guide-only characters live in noto-sans-sc-guides, fetched through unicode-range only where they appear.
  assert(bytes.length < (font.startsWith('noto-sans-sc') ? 190000 : 180000), `${font}: ${bytes.length} bytes`);
}
for (const lang of ['zh', 'en']) {
  for (const variant of ['', '-mono', '-inverse']) {
    const logo = await readFile(`dist/brand/logo-${lang}${variant}.svg`, 'utf8');
    assert(logo.includes('<path') && !logo.includes('<text'), 'Logo wordmarks must be outlined');
    assert(logo.includes('data-direction="whale-a-refined"'), 'Every lockup must use the approved whale A');
    assert.match(logo, /^<svg[^>]+height="72"/, 'Keep room for the English y descender');
    assert(logo.toLowerCase().includes(variant === '' ? '#245bdb' : variant === '-mono' ? '#20242c' : '#ffffff'));
  }
}
const master = await readFile('assets/logo/mark.svg', 'utf8');
const symbol = await readFile('dist/brand/logo-symbol.svg', 'utf8');
assert.equal((master.match(/<path /g) || []).length, 4, 'Selected EAI ligature retains four open components');
assert(master.includes('viewBox="0 0 304 192"'), 'Keep the approved whale A aspect ratio');
assert(master.includes('width="304" height="192"'), 'Set intrinsic dimensions for reliable small-size rendering');
assert(master.includes('data-direction="whale-a-refined"'), 'Selected logo must be the refined whale A');
assert(master.includes('id="whale-head"') && master.includes('id="tail-flukes"'));
assert(master.includes('transform="translate(2 6)"'), 'Retain the selected clear space');
assert(!/<(?:rect|circle|image)\b/.test(master), 'Use clean vector paths without an outer frame or bitmap');
for (const d of [...master.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1])) {
  assert(symbol.includes(d), 'Shipped symbol must use the production master');
  for (const lang of ['zh', 'en']) {
    for (const variant of ['', '-mono', '-inverse']) {
      assert(
        (await readFile(`dist/brand/logo-${lang}${variant}.svg`, 'utf8')).includes(d),
        'Every wordmark must include the selected EAI paths'
      );
    }
  }
}
const smallMaster = await readFile('assets/logo/mark-small.svg', 'utf8');
const smallSymbol = await readFile('dist/brand/logo-symbol-small.svg', 'utf8');
assert.equal((smallMaster.match(/<path /g) || []).length, 4);
assert(smallMaster.includes('data-optical-size="16-24"'));
assert(!smallMaster.includes('M51.5'), 'The tiny eye must be omitted in the optical variant');
for (const d of [...smallMaster.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1])) {
  assert(smallSymbol.includes(d), 'Optical export must use its master');
  assert(symbol.includes(d), 'Optical changes must preserve the selected head, body and tail');
}
assert.notEqual(symbol, smallSymbol);
assert.equal(smallSymbol, await readFile('dist/brand/favicon.svg', 'utf8'));
for (const [variant, ink] of [
  ['mono', '#20242c'],
  ['inverse', '#ffffff'],
]) {
  const logo = await readFile(`dist/brand/logo-symbol-${variant}.svg`, 'utf8');
  assert(logo.includes('data-direction="whale-a-refined"'));
  assert(logo.includes(ink) && !logo.includes('#245bdb'));
}
for (const file of files.filter((file) => /\.(css|svg)$/.test(file))) {
  const text = (await readFile(file, 'utf8')).toLowerCase();
  assert(!/#217652|#dafa83|#182721/.test(text), `${file}: rejected green identity remains`);
}
assert(
  !files.some((file) => file.includes('original') || file.includes('generation.json')),
  'Raw concepts stay outside public output'
);
const brandImages = files.filter((file) => /^dist\/brand\/(hero-field|share-[\w-]+)\.png$/.test(file));
assert.equal(brandImages.length, routeCount + 1, 'Hero and one distinct sharing image per route');
for (const asset of brandImages) {
  const bytes = await readFile(asset);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  assert(bytes.length > 1000 && bytes.length < 300000);
}
const scripts = files.filter((file) => file.endsWith('.js'));
let scriptBytes = 0;
for (const script of scripts) scriptBytes += (await stat(script)).size;
assert(scriptBytes < 20000, `Keep shipped JS small: ${scriptBytes}`);
const inventory = await Promise.all(files.map(async (file) => ({ file, bytes: (await stat(file)).size })));
await mkdir('test-results', { recursive: true });
await writeFile(
  'test-results/build-report.json',
  JSON.stringify(
    {
      testedAt: new Date().toISOString(),
      mode: origin ? `production ${origin}${base}/` : 'noindex preview',
      htmlPages: html.length,
      sharingImages: brandImages.length - 1,
      totalBytes: inventory.reduce((sum, item) => sum + item.bytes, 0),
      externalJSBytes: scriptBytes,
      note: 'Inline executable scripts are counted separately by browser checks.',
      inventory,
    },
    null,
    2
  )
);
console.log(
  `PASS: ${html.length} pages; ${origin ? `indexable at ${origin}${base}/ with canonical/sitemap` : 'noindex preview, no sitemap'}; brand/assets; external JS files ${scriptBytes} bytes (inline scripts measured by browser tests).`
);
