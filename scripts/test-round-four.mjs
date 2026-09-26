import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const engines = ['chromium', 'webkit'];
const homeWidths = [320, 360, 390, 412, 768, 1024, 1200, 1440, 1920];
const shortViewports = [
  { width: 320, height: 640 },
  { width: 390, height: 700 },
  { width: 768, height: 800 },
  { width: 1200, height: 700 },
];
const report = {
  testedAt: new Date().toISOString(),
  base,
  engines,
  checks: [],
  screenshots: [],
};

const isMobile = (width) => width <= 640;
const viewportHeight = (width) => (width <= 640 ? 844 : 960);

async function loaded(page, url) {
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  assert([200, 304].includes(response?.status()), `Expected 200 or 304 for ${url}`);
  await page.evaluate(() => document.fonts.ready);
}

async function assertNoHorizontalOverflow(page, label) {
  const result = await page.evaluate(() => {
    const overflow = [...document.querySelectorAll('main *, header *, footer *')]
      .filter((element) => {
        const box = element.getBoundingClientRect();
        return (
          element.checkVisibility() &&
          !element.classList.contains('sr-only') &&
          box.width > 0 &&
          (box.left < -1 || box.right > innerWidth + 1)
        );
      })
      .map((element) => `${element.tagName}.${element.className}`);
    return {
      overflow,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });
  assert(!result.overflow.length && result.scrollWidth <= result.innerWidth + 1, `${label}: ${JSON.stringify(result)}`);
}

async function assertMobileRoutesReachable(page, label) {
  const result = await page.evaluate(() => {
    const bar = document.querySelector('.mobile-inquiry')?.getBoundingClientRect();
    const routes = [...document.querySelectorAll('.hero-route-list a')].map((element) => {
      const box = element.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, covered: !!bar && box.bottom > bar.top + 0.5 };
    });
    return {
      barTop: bar?.top ?? null,
      routes,
      labels: [...document.querySelectorAll('.hero-route-copy strong')].map((element) => element.textContent?.trim()),
    };
  });
  assert.equal(result.routes.length, 3, `${label}: all three service routes must remain present`);
  assert(result.labels.every(Boolean), `${label}: a service route lost its visible name`);
  assert(
    result.routes.every((route) => !route.covered),
    `${label}: route covered by fixed inquiry bar: ${JSON.stringify(result)}`
  );
}

async function assertScrolledRouteReachable(page, label) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(40);
  await page.evaluate(() => {
    const target = document.querySelector('.hero-route-list a:last-child');
    const bar = document.querySelector('.mobile-inquiry');
    if (!target || !bar) return;
    const targetBottom = target.getBoundingClientRect().bottom + window.scrollY;
    const safeBottom = bar.getBoundingClientRect().top - 8;
    const requestedScroll = targetBottom - safeBottom;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Math.min(maxScroll, Math.max(0, requestedScroll)), behavior: 'instant' });
  });
  await page.waitForTimeout(60);
  const result = await page.evaluate(() => {
    const bar = document.querySelector('.mobile-inquiry')?.getBoundingClientRect();
    const target = document.querySelector('.hero-route-list a:last-child')?.getBoundingClientRect();
    return {
      barTop: bar?.top ?? null,
      targetBottom: target?.bottom ?? null,
      covered: !!bar && !!target && target.bottom > bar.top + 0.5,
    };
  });
  assert(!result.covered, `${label}: scrolled route remained behind fixed inquiry bar: ${JSON.stringify(result)}`);
}

async function testContactFlow(page, lang, engine) {
  await page.setViewportSize({ width: 390, height: 844 });
  await loaded(page, `${base}/${lang}/contact/?topic=model-services`);
  assert(await page.locator('input[value="model-services"]').isChecked());
  assert((await page.locator('.topic-hint').innerText()).length > 10);
  assert.equal(
    await page
      .locator('.topic-options span')
      .first()
      .evaluate((element) => getComputedStyle(element).fontSize),
    '14px'
  );
  assert.equal(
    await page.locator('.topic-options').evaluate((element) => getComputedStyle(element).display),
    'grid',
    `${engine}/${lang}: topic options should use a stable mobile grid`
  );
  assert(
    (await page.locator('.topic-options span').first().boundingBox()).height >= 48,
    `${engine}/${lang}: topic options need a touch-sized target`
  );

  const copyButton = page.locator('[data-copy]');
  const status = page.locator('.copy-status');
  const initialHeight = (await page.locator('.contact-option').first().boundingBox()).height;
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.resolve() },
    })
  );
  await copyButton.click();
  await page.waitForFunction(() => document.querySelector('.copy-status')?.textContent?.length > 0);
  assert((await status.innerText()).includes(lang === 'zh' ? '已复制' : 'copied'));
  const successHeight = (await page.locator('.contact-option').first().boundingBox()).height;
  assert(Math.abs(successHeight - initialHeight) < 1, `${engine}/${lang}: copy success changed card height`);

  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    })
  );
  await copyButton.click();
  await page.waitForFunction(() => document.querySelector('.copy-status')?.textContent?.length > 0);
  assert((await status.innerText()).includes(lang === 'zh' ? '手动复制' : 'manually'));
  const failureHeight = (await page.locator('.contact-option').first().boundingBox()).height;
  assert(Math.abs(failureHeight - initialHeight) < 1, `${engine}/${lang}: copy failure changed card height`);
  assert.equal(await page.evaluate(() => window.getSelection()?.toString()), 'CCGAI008');
  assert.equal(await page.locator('.copy-button').getAttribute('aria-describedby'), `contact-copy-status-${lang}-full`);

  await page.locator('input[value="infrastructure"]').check();
  assert.equal(new URL(page.url()).searchParams.get('topic'), 'infrastructure');
  const mail = new URL(await page.locator('.inquiry-email').getAttribute('href'));
  assert(mail.searchParams.get('body').includes(lang === 'zh' ? '基础设施' : 'Infrastructure'));

  const alternate = page.locator('.language-link');
  assert(
    (await alternate.getAttribute('href')).includes(`${lang === 'zh' ? '/en/' : '/zh/'}contact/?topic=infrastructure`)
  );
  await page.screenshot({ path: `test-results/round-four-${engine}-${lang}-contact-390.png` });
  report.screenshots.push(`round-four-${engine}-${lang}-contact-390.png`);
}

await mkdir('test-results', { recursive: true });

for (const engine of engines) {
  const browser = await launchBrowser(engine);
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (!request.url().startsWith(base) && !request.url().startsWith('data:')) externalRequests.push(request.url());
  });

  try {
    for (const lang of ['zh', 'en']) {
      for (const width of homeWidths) {
        await page.setViewportSize({ width, height: viewportHeight(width) });
        await loaded(page, `${base}/${lang}/`);
        await assertNoHorizontalOverflow(page, `${engine}/${lang}/${width}`);
        if (isMobile(width)) await assertMobileRoutesReachable(page, `${engine}/${lang}/${width}`);
        report.checks.push(`${engine}/${lang}/home/${width}`);
        if (width === 390) {
          await page.screenshot({ path: `test-results/round-four-${engine}-${lang}-home-390.png` });
          report.screenshots.push(`round-four-${engine}-${lang}-home-390.png`);
        }
      }

      for (const { width, height } of shortViewports) {
        await page.setViewportSize({ width, height });
        await loaded(page, `${base}/${lang}/`);
        await assertNoHorizontalOverflow(page, `${engine}/${lang}/${width}x${height}`);
        if (isMobile(width)) await assertScrolledRouteReachable(page, `${engine}/${lang}/${width}x${height}`);
        report.checks.push(`${engine}/${lang}/short/${width}x${height}`);
      }

      await testContactFlow(page, lang, engine);
      await page.setViewportSize({ width: 390, height: 844 });
      await loaded(page, `${base}/${lang}/`);
      await page.locator('.mobile-inquiry').click();
      assert.equal(new URL(page.url()).pathname, `/${lang}/contact/`);
      assert((await page.locator('.topic-hint').innerText()).length > 10);
      report.checks.push(`${engine}/${lang}/mobile-inquiry`);
    }

    assert.equal(errors.length, 0, `${engine}: page errors ${JSON.stringify(errors)}`);
    assert.equal(externalRequests.length, 0, `${engine}: external requests ${JSON.stringify(externalRequests)}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

await writeFile('test-results/round-four-report.json', JSON.stringify(report, null, 2));
console.log(
  `PASS: fourth-round usability checks across ${engines.join(' and ')}, ${report.checks.length} viewport/task checks, ${report.screenshots.length} screenshots.`
);
