import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const parts = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))
  );
  return parts.flat();
}
const files = await walk('dist');
const html = files.filter((file) => file.endsWith('.html'));
const routes = JSON.parse(await readFile('dist/site-manifest.json', 'utf8'));
assert.equal(routes.length, 26, '26 bilingual content routes');
assert.equal(html.length, 28, '26 content pages, the entry and the 404');
assert.equal(new Set(routes.map((route) => route.path)).size, 26);
assert.equal(new Set(routes.map((route) => route.title)).size, 26);
assert.equal(new Set(routes.map((route) => route.image)).size, 26);
for (const route of routes) {
  const text = await readFile(`dist${route.path}index.html`, 'utf8');
  assert(routes.some((other) => other.path === route.counterpart && other.counterpart === route.path));
  assert(text.includes(route.image));
  if (route.kind === 'article') {
    assert(!/<li>\s*\*\*/.test(text), `Unparsed Markdown emphasis: ${route.path}`);
    assert(text.includes('"@type":"Article"'));
    assert(text.includes('article-sources') && text.includes('article-inquiry'));
    assert(text.includes(`?topic=${route.service}`));
    assert(text.includes('datetime="2026-09-19"'));
  }
}
assert.match(await readFile('dist/404.html', 'utf8'), /<title>页面未找到/);
for (const file of html) {
  const text = await readFile(file, 'utf8');
  assert.match(text, /content="noindex, nofollow"/, `${file}: noindex required`);
  assert(!text.includes('astrowind.vercel.app'), `${file}: template origin leaked`);
  assert(!text.includes('googletagmanager'), `${file}: tracking leaked`);
  assert(!text.includes('rel="canonical"'), `${file}: no canonical before a domain is chosen`);
  assert(!text.includes('model-catalog.jpg'), `${file}: removed product screenshot must not return`);
  if (file !== 'dist/index.html') {
    assert(text.includes('application/ld+json'), `${file}: structured brand data missing`);
    assert(text.includes('og:image'), `${file}: sharing metadata missing`);
    assert(text.includes('name="description"'), `${file}: description missing`);
    assert(text.includes('/brand/favicon.svg?v=whale-a'), `${file}: use the current optical favicon`);
  }
  if (file.endsWith('/zh/index.html') || file.endsWith('/en/index.html')) {
    assert(!text.replaceAll('CCGAI008', '').includes('CCG'), `${file}: product displaced the brand`);
    assert(text.includes('hero-side-panel'), `${file}: hero cooperation panel missing`);
    assert.equal(
      (text.match(/hero-route-number/g) || []).length,
      3,
      `${file}: hero must retain all three cooperation routes`
    );
    assert.equal((text.match(/class="guide-card"/g) || []).length, 3, `${file}: one featured guide per service`);
    assert.equal((text.match(/class="faq-number"/g) || []).length, 6, `${file}: two FAQs per service`);
    assert.equal((text.match(/class="step-prompts"/g) || []).length, 4, `${file}: four cooperation stages`);
    assert(text.includes('data-contact-panel'), `${file}: consultation should work on the homepage`);
    for (const service of ['workbuddy', 'model-services', 'infrastructure']) {
      assert(text.includes(`/contact/?topic=${service}`), `${file}: service-specific inquiry is missing`);
      assert(text.includes(`data-topic-preparation="${service}"`), `${file}: preparation copy is missing`);
    }
  }
}
assert.equal(files.filter((file) => file.includes('sitemap')).length, 0);
assert.equal(files.filter((file) => file.includes('decapcms')).length, 0);
assert.match(await readFile('dist/robots.txt', 'utf8'), /Disallow: \//);
assert(!files.includes('dist/products/model-catalog.jpg'));
for (const font of ['manrope-latin', 'noto-sans-sc-site']) {
  const bytes = await readFile(`dist/fonts/${font}.woff2`);
  assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
  assert(bytes.length < 180000);
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
assert.equal(brandImages.length, 27, 'Hero and 26 distinct sharing images');
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
  `PASS: ${html.length} pages; noindex/brand/assets/no sitemap; external JS files ${scriptBytes} bytes (inline scripts measured by browser tests).`
);
