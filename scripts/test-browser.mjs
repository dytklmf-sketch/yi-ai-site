import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser } from './browser.mjs';
import { testEnhancements } from './test-enhancements.mjs';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const routes = JSON.parse(await readFile('dist/site-manifest.json', 'utf8'));
const pages = routes.filter((route) => route.lang === 'zh').map((route) => route.path.slice(4));
const widths = [320, 360, 390, 768, 1024, 1200, 1440, 1920];
const browser = await launchBrowser();
const report = {
  testedAt: new Date().toISOString(),
  base,
  checks: [],
  errors: [],
  externalRequests: [],
  interactions: [],
  performance: [],
  accessibilityScans: 0,
  links: [],
};
const internalLinks = new Set();
const titles = new Set();
const sharingImages = new Set();
await mkdir('test-results', { recursive: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push(error.message));
  page.on('request', (request) => {
    if (!request.url().startsWith(base) && !request.url().startsWith('data:'))
      report.externalRequests.push(request.url());
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().includes('intentionally-missing'))
      report.errors.push(`${response.status()} ${response.url()}`);
  });
  for (const lang of ['zh', 'en']) {
    for (const suffix of pages) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: width >= 768 ? 960 : 844 });
        const response = await page.goto(`${base}/${lang}/${suffix}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(response.status(), 200);
        const info = await page.evaluate(() => {
          const overflow = [...document.querySelectorAll('main *,header *,footer *')]
            .filter((el) => {
              // Horizontally scrolling rows (section tabs, the focusable API code block) may clip
              // their own children.
              if (el.closest('.subnav, .topic-tabs') || el.parentElement?.closest('.api-code')) return false;
              const box = el.getBoundingClientRect();
              return (
                el.checkVisibility() &&
                !el.classList.contains('sr-only') &&
                box.width > 0 &&
                (box.right > innerWidth + 1 || box.left < -1)
              );
            })
            .map((el) => `${el.tagName}.${el.className}`);
          const logo = (img) => {
            const box = img.getBoundingClientRect();
            return {
              src: img.getAttribute('src'),
              naturalHeight: img.naturalHeight,
              aspectError: box.height
                ? Math.abs(
                    box.width / box.height - Number(img.getAttribute('width')) / Number(img.getAttribute('height'))
                  )
                : 0,
            };
          };
          return {
            overflow,
            totalOverflow: document.documentElement.scrollWidth > innerWidth,
            h1: document.querySelectorAll('h1').length,
            robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
            images: [...document.images].every((img) => img.complete && img.naturalWidth > 0),
            lang: document.documentElement.lang,
            mainText: document.querySelector('main').textContent.trim().length,
            canonical: !!document.querySelector('link[rel="canonical"]'),
            fonts:
              document.fonts.check('400 16px Manrope') &&
              document.fonts.check('550 32px "Noto Sans SC"', '易') &&
              document.fonts.check('500 13px "JetBrains Mono"'),
            productScreenshot: !!document.querySelector('img[src*="model-catalog"]'),
            headerLogo: logo(document.querySelector('.brand-mark .logo-default')),
            footerLogo: logo(document.querySelector('.footer-brand img')),
            visibleHeaderLogos: [...document.querySelectorAll('.brand-mark img')].filter(
              (img) => getComputedStyle(img).display !== 'none' && Number(getComputedStyle(img).opacity) > 0.5
            ).length,
            favicon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
            accent: getComputedStyle(document.documentElement).getPropertyValue('--cobalt').trim(),
            bodyFont: getComputedStyle(document.body).fontFamily,
            primaryButton: document.querySelector('main .btn-primary')
              ? getComputedStyle(document.querySelector('main .btn-primary')).backgroundColor
              : null,
          };
        });
        assert(!info.totalOverflow && info.overflow.length === 0, JSON.stringify({ lang, suffix, width, ...info }));
        assert.equal(info.h1, 1);
        assert.equal(info.robots, 'noindex, nofollow');
        assert(info.images && info.mainText > 100 && !info.canonical);
        assert(info.fonts && !info.productScreenshot, `Local fonts must load: ${lang}/${suffix}`);
        assert.equal(info.headerLogo.src, `/brand/logo-${lang}.svg`);
        assert.equal(info.footerLogo.src, `/brand/logo-${lang}-inverse.svg`);
        assert.equal(info.visibleHeaderLogos, 1, 'Exactly one header lockup is shown for the current surface');
        for (const logo of [info.headerLogo, info.footerLogo]) {
          assert(logo.naturalHeight === 72 && logo.aspectError < 0.002, 'Lockups must keep intrinsic proportions');
        }
        assert.equal(info.favicon, '/brand/favicon.svg?v=whale-a');
        assert.equal(info.lang, lang === 'zh' ? 'zh-CN' : 'en');
        assert.equal(info.accent, '#245bdb');
        assert(info.bodyFont.includes('Manrope') && info.bodyFont.includes('Noto Sans SC'));
        // Round 37: service pages take their own theme colour; every other page keeps brand blue.
        const theme = {
          'workbuddy/': 'rgb(9, 122, 100)',
          'model-services/': 'rgb(91, 63, 214)',
          'infrastructure/': 'rgb(10, 118, 181)',
        };
        if (info.primaryButton) assert.equal(info.primaryButton, theme[suffix] || 'rgb(36, 91, 219)');
        if (!suffix) {
          // Both hero actions sit on the first screen at every width with a usable tap size.
          const actions = await page.evaluate(() =>
            [...document.querySelectorAll('.hero .btn')].filter((link) => {
              const box = link.getBoundingClientRect();
              return link.checkVisibility() && box.height >= 44 && box.bottom <= innerHeight;
            })
          );
          assert.equal(actions.length, 2, `Hero actions: ${lang} ${width}px`);
          assert.equal(await page.locator('[data-service-column]').count(), 3, `Service columns: ${lang} ${width}px`);
          if (lang === 'zh') {
            const heroTitle = await page.locator('.hero-title').innerText();
            assert(heroTitle.includes('提供'), 'The hero headline carries the verb');
            assert(!heroTitle.includes('易'), 'The hero headline leaves 易 to the brand positioning line');
            assert.equal(await page.locator('.hero .eyebrow').innerText(), '企业 AI 应用与算力供应服务商');
            assert((await page.locator('.hero-lead').innerText()).includes('易懂、易用、易落地'));
            assert((await page.locator('.footer-promise').innerText()).includes('易懂、易用、易落地'));
          }
        }
        if (width === 390 || width === 1440) {
          // Scan the settled page: axe scrolls while it runs, which would otherwise catch reveals mid-fade.
          await page.evaluate(async () => {
            document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
            await new Promise(requestAnimationFrame);
            await Promise.all(
              document
                .getAnimations()
                .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
                .map((animation) => animation.finished.catch(() => {}))
            );
          });
          const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
          assert.equal(
            a11y.violations.length,
            0,
            JSON.stringify(a11y.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))
          );
          report.accessibilityScans++;
        }
        if (width === 1440) {
          const details = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const resources = performance.getEntriesByType('resource');
            const executable = [...document.scripts].filter(
              (script) => !script.type || ['module', 'text/javascript', 'application/javascript'].includes(script.type)
            );
            return {
              title: document.title,
              description: document.querySelector('meta[name="description"]').content,
              sharingImage: document.querySelector('meta[property="og:image"]').content,
              alternates: [...document.querySelectorAll('link[hreflang]')].map((link) => ({
                lang: link.hreflang,
                href: link.getAttribute('href'),
              })),
              links: [...document.querySelectorAll('a[href],link[hreflang]')]
                .map((link) => link.getAttribute('href'))
                .filter((href) => href.startsWith('/')),
              schema: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent),
              brandText: document.body.innerText,
              externalScripts: [
                ...new Set([
                  ...executable.filter((script) => script.src).map((script) => script.src),
                  ...resources.filter((item) => item.initiatorType === 'script').map((item) => item.name),
                ]),
              ],
              performance: {
                firstContentfulPaintMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
                domContentLoadedMs: navigation.domContentLoadedEventEnd,
                loadMs: navigation.loadEventEnd,
                decodedResourceBytes: resources.reduce(
                  (sum, item) => sum + item.decodedBodySize,
                  navigation.decodedBodySize
                ),
                inlineExecutableJSBytes: executable.reduce(
                  (sum, script) => sum + new TextEncoder().encode(script.textContent).length,
                  0
                ),
                externalJSBytes: 0,
                resourceRequests: resources.length,
              },
            };
          });
          // Cached modules can have zero timing bytes; measure their actual payload for the budget.
          for (const source of details.externalScripts) {
            assert.equal(new URL(source).origin, new URL(base).origin, 'Executable scripts must stay local');
            const script = await context.request.get(source);
            assert(script.ok(), `Script must load: ${source}`);
            details.performance.externalJSBytes += (await script.body()).byteLength;
          }
          assert(!titles.has(details.title), 'Every page needs its own title');
          titles.add(details.title);
          assert(!sharingImages.has(details.sharingImage), 'Every content page needs its own sharing image');
          sharingImages.add(details.sharingImage);
          assert(details.description.length > 30);
          const name = lang === 'zh' ? '易AI' : 'Easy AI';
          assert.equal(details.schema.name, name);
          assert.equal(details.schema.about.name, name);
          assert.equal(details.schema.alternateName, lang === 'zh' ? 'Easy AI' : '易AI');
          assert(!/\beasyai\b/i.test(details.brandText), 'Visible English brand must be Easy AI');
          assert(details.title.endsWith(`| ${name}`));
          assert.deepEqual(details.alternates, [
            { lang: 'zh-CN', href: `/zh/${suffix}` },
            { lang: 'en', href: `/en/${suffix}` },
          ]);
          if (!['model-services/', 'about/'].includes(suffix)) assert(!details.brandText.includes('CCG'));
          assert(
            details.performance.inlineExecutableJSBytes + details.performance.externalJSBytes < 20000,
            'Run browser acceptance against the static preview, not the dev server'
          );
          details.links.forEach((href) => internalLinks.add(href));
          report.performance.push({ lang, route: suffix || 'home', ...details.performance });
        }
        report.checks.push({ lang, route: suffix || 'home', width, passed: true });
        if (width === 390 || width === 1440 || (width === 768 && !suffix)) {
          const name = `${lang}-${suffix ? suffix.replaceAll('/', '-').replace(/-$/, '') : 'home'}-${width}`;
          await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
          if (!suffix) await page.screenshot({ path: `test-results/${name}-viewport.png` });
        }
      }
    }
  }
  for (const href of internalLinks) {
    const response = await context.request.get(new URL(href, base).href);
    assert.equal(response.status(), 200, `Broken internal link: ${href}`);
    report.links.push(href);
  }
  for (const href of sharingImages) {
    const response = await context.request.get(new URL(href, base).href);
    assert.equal(response.status(), 200, `Missing sharing image: ${href}`);
    assert(response.headers()['content-type'].startsWith('image/png'));
  }
  report.sharingImages = [...sharingImages];
  const logoChecks = await page.evaluate(async () => {
    const names = [
      'logo-symbol',
      'logo-symbol-small',
      'logo-symbol-mono',
      'logo-symbol-inverse',
      'logo-zh',
      'logo-en',
      'logo-zh-mono',
      'logo-en-mono',
      'logo-zh-inverse',
      'logo-en-inverse',
    ];
    const results = [];
    for (const name of names) {
      const image = new Image();
      image.src = `/brand/${name}.png`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      let painted = 0;
      let borderPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
        if (pixels[i] > 128) painted++;
        const pixel = (i - 3) / 4;
        const x = pixel % canvas.width;
        const y = Math.floor(pixel / canvas.width);
        if ((x === 0 || y === 0 || x === canvas.width - 1 || y === canvas.height - 1) && pixels[i] > 128)
          borderPixels++;
      }
      results.push({ name, transparent, painted, borderPixels, height: canvas.height });
    }
    for (const size of [16, 24, 32, 48]) {
      const image = new Image();
      image.src = size <= 24 ? '/brand/logo-symbol-small.svg' : '/brand/logo-symbol.svg';
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const height = (size * image.naturalHeight) / image.naturalWidth;
      ctx.drawImage(image, 0, (size - height) / 2, size, height);
      const pixels = ctx.getImageData(0, 0, size, size).data;
      let painted = 0;
      let borderPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 128) painted++;
        const pixel = (i - 3) / 4;
        const x = pixel % size;
        const y = Math.floor(pixel / size);
        if ((x === 0 || y === 0 || x === size - 1 || y === size - 1) && pixels[i] > 128) borderPixels++;
      }
      results.push({
        name: `symbol-${size}px`,
        painted,
        borderPixels,
        aspect: image.naturalWidth / image.naturalHeight,
      });
    }
    return results;
  });
  for (const result of logoChecks) {
    assert(result.painted > 20, `Blank logo: ${result.name}`);
    assert.equal(result.borderPixels, 0, `Logo must not be clipped: ${result.name}`);
    if ('transparent' in result) assert(result.transparent > result.painted && result.height === 256);
    if ('aspect' in result) assert.equal(result.aspect, 304 / 192, 'Do not stretch the approved whale A symbol');
  }
  report.logoChecks = logoChecks;
  const vectorChecks = await page.evaluate(async () => {
    const results = [];
    for (const name of ['logo-zh', 'logo-en', 'logo-symbol', 'logo-symbol-small', 'favicon']) {
      const response = await fetch(`/brand/${name}.svg`);
      if (!response.ok) throw new Error(`Missing vector ${name}`);
      const doc = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      if (doc.querySelector('parsererror')) throw new Error(`Invalid vector ${name}`);
      const root = doc.documentElement;
      results.push({
        name,
        direction: root.getAttribute('data-direction'),
        whaleParts: !!doc.querySelector('#whale-head') && !!doc.querySelector('#tail-flukes'),
        optical: root.getAttribute('data-optical-size'),
        hasEye: doc.querySelector('#whale-head')?.getAttribute('d').includes('M51.5'),
      });
    }
    return results;
  });
  for (const result of vectorChecks) {
    assert.equal(result.direction, 'whale-a-refined');
    assert(result.whaleParts, `Wrong logo loaded: ${result.name}`);
    const small = ['logo-symbol-small', 'favicon'].includes(result.name);
    assert.equal(result.hasEye, !small, `Unexpected optical variant: ${result.name}`);
    if (small) assert.equal(result.optical, '16-24');
  }
  report.vectorChecks = vectorChecks;

  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
  await page.locator('.service-column[data-service-column="model-services"] .btn-outline').click();
  await page.waitForURL(`${base}/zh/model-services/`);
  // The primary action opens the product in a new tab; enterprise usage stays on this site with its topic.
  const product = page.locator('.page-hero .btn-primary');
  assert.equal(await product.getAttribute('href'), 'https://ccg-cli.online/models/');
  assert.equal(await product.getAttribute('target'), '_blank');
  assert((await product.innerText()).includes('CCG API'));
  await page.locator('.page-hero .btn-outline').click();
  assert.equal(new URL(page.url()).searchParams.get('topic'), 'model-services');
  assert(await page.locator('input[value="model-services"]').isChecked());
  report.interactions.push(
    'service inquiry preserves topic; local fonts, localized logos, transparent exports and 16–48px symbols verified'
  );

  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/zh/workbuddy/`, { waitUntil: 'networkidle' });
    await page.locator('.mobile-menu summary').click();
    await page.waitForTimeout(300);
    const alignment = await page.evaluate(() => ({
      headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
      menuTop: document.querySelector('.mobile-sheet').getBoundingClientRect().top,
    }));
    assert(
      Math.abs(alignment.headerBottom - alignment.menuTop) <= 1,
      `Menu must sit directly below the header at ${width}px: ${JSON.stringify(alignment)}`
    );
    await page.keyboard.press('Escape');
  }
  report.interactions.push('phone and tablet menus align with the header');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/zh/workbuddy/`, { waitUntil: 'networkidle' });
  await page.locator('.mobile-menu summary').click();
  await page.waitForTimeout(500);
  assert(await page.locator('.mobile-menu nav').isVisible());
  assert.equal(await page.locator('.mobile-menu summary').getAttribute('aria-expanded'), 'true');
  const menuBox = await page.locator('.mobile-sheet').boundingBox();
  assert(menuBox.x >= 0 && menuBox.x + menuBox.width <= 390 && menuBox.width >= 350);
  assert.equal(
    await page.locator('.mobile-menu nav a[aria-current="page"]').getAttribute('href'),
    '/zh/workbuddy/',
    'The sheet marks the current page'
  );
  await page.screenshot({ path: 'test-results/mobile-menu.png' });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null);
  assert.equal(await page.locator('.mobile-menu summary').getAttribute('aria-expanded'), 'false');
  await page.locator('.language-link').click();
  assert.equal(new URL(page.url()).pathname, '/en/workbuddy/');
  await page.locator('.mobile-menu summary').click();
  await page.locator('.mobile-menu nav a[href="/en/model-services/"]').click();
  await page.waitForURL(`${base}/en/model-services/`);
  // On model services the primary action opens CCG API; the enterprise inquiry is the second button.
  await page.locator('.page-hero .btn-outline').click();
  assert.equal(new URL(page.url()).searchParams.get('topic'), 'model-services');
  assert(await page.locator('input[value="model-services"]').isChecked());
  const mail = new URL(await page.locator('.inquiry-email').getAttribute('href'));
  assert(mail.searchParams.get('subject').includes('Model services'));
  await page.locator('label:has(input[value="infrastructure"])').click();
  const updatedMail = new URL(await page.locator('.inquiry-email').getAttribute('href'));
  assert(updatedMail.searchParams.get('body').includes('Infrastructure'));
  // Round 34: the body lists that topic's own quote inputs.
  assert(updatedMail.searchParams.get('body').includes('Workload type'));
  assert(await page.locator('[data-topic-preparation="infrastructure"]').isVisible());
  assert.equal(await page.locator('[data-topic-preparation]:visible').count(), 1);
  assert.equal(new URL(page.url()).searchParams.get('topic'), 'infrastructure');
  assert(
    (await page.locator('.topic-options label').first().boundingBox()).height >= 44,
    'Topic options need touch-sized targets'
  );
  report.interactions.push(
    'mobile menu, Escape, aria-expanded, language counterpart, service-to-contact topic, mail subject/body and preparation copy'
  );

  await context.grantPermissions(['clipboard-write', 'clipboard-read'], { origin: base });
  const contactHeight = (await page.locator('.contact-option').first().boundingBox()).height;
  await page.locator('[data-copy]').click();
  await page.waitForFunction(() => document.querySelector('.copy-status')?.textContent.includes('copied'));
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'Li___CaB6');
  assert(Math.abs((await page.locator('.contact-option').first().boundingBox()).height - contactHeight) < 1);
  report.interactions.push('real clipboard write/read without layout shift');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  await page.locator('[data-copy]').click();
  await page.waitForFunction(() => document.querySelector('.copy-status')?.textContent.includes('manually'));
  assert.equal(await page.evaluate(() => getSelection()?.toString()), 'Li___CaB6');
  assert(Math.abs((await page.locator('.contact-option').first().boundingBox()).height - contactHeight) < 1);
  report.interactions.push('clipboard denied: localized fallback and selectable ID');

  await page.goto(`${base}/zh/contact/`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.contact-fab').count(), 0, 'The contact page has no contact button');
  assert.equal(await page.locator('.footer-lead .btn').count(), 0, 'The contact page has no footer inquiry button');
  await page.locator('input[value="workbuddy"]').focus();
  await page.keyboard.press('ArrowRight');
  assert(await page.locator('input[value="model-services"]').isChecked());
  assert(
    new URL(await page.locator('.inquiry-email').getAttribute('href')).searchParams.get('subject').includes('模型服务')
  );
  await page.locator('[data-copy]').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('.copy-status')?.textContent.includes('已复制'));
  await page.locator('input[value="model-services"]').focus();
  // Round 34: the selected topic's brief download sits between the topics and the contact options.
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('topic-brief')), true);
  assert(await page.evaluate(() => document.activeElement.href.endsWith('/model-usage-brief.txt')));
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('contact-id')), true);
  report.interactions.push('keyboard radio selection, Chinese email subject, Enter-to-copy, contact tab order');

  await page.goto(`${base}/zh/contact/?topic=unknown`, { waitUntil: 'networkidle' });
  assert(await page.locator('input[value="workbuddy"]').isChecked());
  await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
  await page.locator('.faq-list summary').first().click();
  await page.waitForTimeout(400);
  assert(await page.locator('.faq-list details[open] p').first().isVisible());
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForURL(`${base}/zh/`);
  report.interactions.push('unknown topic fallback, FAQ, root redirect');

  // Native HTML remains readable and navigable with JavaScript disabled.
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const plain = await noJS.newPage();
  for (const lang of ['zh', 'en']) {
    for (const suffix of pages) {
      await plain.goto(`${base}/${lang}/${suffix}`);
      assert((await plain.locator('main').innerText()).length > 100);
      assert(
        await plain.evaluate(() =>
          [...document.querySelectorAll('[data-reveal], [data-enter]')].every(
            (el) => getComputedStyle(el).opacity === '1'
          )
        ),
        `No-JS content must never be hidden: ${lang}/${suffix}`
      );
    }
  }
  await plain.goto(`${base}/zh/`);
  assert.equal(await plain.locator('[data-faq-filter]').isVisible(), false, 'The FAQ filter needs JS');
  await plain.locator('.mobile-menu summary').click();
  assert(await plain.locator('.mobile-menu nav').isVisible());
  await plain.locator('.mobile-menu summary').click();
  assert.equal(await plain.locator('.mobile-menu').getAttribute('open'), null);
  await plain.locator('.faq-list summary').first().click();
  assert(await plain.locator('.faq-list details[open]').isVisible());
  await plain.goto(`${base}/zh/contact/`);
  assert((await plain.locator('noscript').innerText()).includes('手动复制'));
  report.interactions.push(`all ${routes.length} pages readable without JS; native menu/FAQ work`);
  await noJS.close();

  const missing = await page.goto(`${base}/intentionally-missing/`, { waitUntil: 'networkidle' });
  assert.equal(missing.status(), 404);
  assert((await page.locator('h1').innerText()).includes('未找到该页面'), '404 keeps its headline');
  assert.equal(await page.locator('.desktop-nav a[aria-current]').count(), 0, '404 marks no navigation item');
  report.interactions.push('404');
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  assert.equal(report.externalRequests.length, 0, JSON.stringify(report.externalRequests));
  await writeFile('test-results/browser-report.json', JSON.stringify(report, null, 2));
  console.log(
    `PASS: ${report.checks.length} responsive page checks, ${report.accessibilityScans} axe scans, ${report.links.length} internal links, interactions and JS-disabled routes.`
  );
} finally {
  await browser.close();
}
await testEnhancements(base, routes);
