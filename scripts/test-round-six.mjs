import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const engines = ['chromium', 'webkit'];
const report = {
  testedAt: new Date().toISOString(),
  base,
  engines,
  checks: [],
  screenshots: [],
};

await mkdir('test-results/round6', { recursive: true });

for (const engine of engines) {
  const browser = await launchBrowser(engine);
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  try {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    await page
      .locator('#guides')
      .evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForTimeout(500);
    const guideMeta = await page
      .locator('#guides .guide-meta')
      .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top));
    assert(
      guideMeta.every((top) => Math.abs(top - guideMeta[0]) < 2),
      `${engine}: guide metadata is not aligned`
    );
    await page.screenshot({ path: `test-results/round6/${engine}-guides.png` });
    report.screenshots.push(`${engine}-guides.png`);

    await page
      .locator('#inquiry')
      .evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForTimeout(500);
    const inquiryStart = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(900);
    const footerState = await page.evaluate(() => {
      const footer = document.querySelector('.site-footer').getBoundingClientRect();
      return {
        y: scrollY,
        max: document.documentElement.scrollHeight - innerHeight,
        viewportHeight: innerHeight,
        footerTop: footer.top,
        footerBottom: footer.bottom,
      };
    });
    assert(footerState.y > inquiryStart, `${engine}: inquiry must allow reading into the footer`);
    assert(Math.abs(footerState.y - footerState.max) <= 1, `${engine}: inquiry/footer flow should reach the page end`);
    assert(footerState.footerBottom <= footerState.viewportHeight + 1, `${engine}: footer must be fully reachable`);
    await page.screenshot({ path: `test-results/round6/${engine}-footer.png` });
    report.screenshots.push(`${engine}-footer.png`);

    await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
    await page.locator('#faq').evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.locator('.faq-list summary').first().click();
    await page.waitForTimeout(250);
    const prevented = await page.evaluate(() => {
      const event = new WheelEvent('wheel', { deltaY: 600, bubbles: true, cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    });
    assert.equal(prevented, false, `${engine}: open FAQ must keep native reading`);
    assert(await page.locator('.faq-list details[open] p').isVisible());

    const numbers = await page.locator('#intro .hero-route-number').evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { width: box.width, height: box.height, text: element.textContent?.trim() };
      })
    );
    assert.equal(numbers.length, 3);
    assert(numbers.every((number) => number.width >= 30 && number.height >= 30 && number.text));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/en/contact/?topic=infrastructure`, { waitUntil: 'networkidle' });
    assert(await page.locator('input[value="infrastructure"]').isChecked());
    const mail = new URL(await page.locator('.inquiry-email').getAttribute('href'));
    assert(mail.searchParams.get('subject').includes('Infrastructure'));
    assert.equal(await page.locator('.topic-options').evaluate((element) => getComputedStyle(element).display), 'grid');
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `${engine}: contact page overflows at 390px`
    );
    await page.screenshot({ path: `test-results/round6/${engine}-contact-390.png` });
    report.screenshots.push(`${engine}-contact-390.png`);

    assert.equal(errors.length, 0, `${engine}: page errors ${JSON.stringify(errors)}`);
    report.checks.push(
      'Footer flow, guide alignment, FAQ native reading, visible route numbers, topic-aware email and mobile topic grid'
    );
  } finally {
    await context.close();
    await browser.close();
  }
}

await writeFile('test-results/round6-report.json', JSON.stringify(report, null, 2));
console.log(`PASS: sixth-round checks across ${engines.join(' and ')}, ${report.screenshots.length} screenshots.`);
