// Quick check for small UI changes (round 38): the changed pages at three widths, with overflow, console errors and
// axe, plus screenshots to look at. About a minute. The full `pnpm test:browser` still runs per batch of changes,
// for shared components (header, footer, contact, layout) and before handing over.
//   PREVIEW_URL=http://127.0.0.1:4322 pnpm test:quick /zh/workbuddy/ /en/workbuddy/
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser } from './browser.mjs';

const base = (process.env.PREVIEW_URL || 'http://127.0.0.1:4322').replace(/\/$/, '');
const paths = process.argv.slice(2);
assert(paths.length, 'Pass the changed paths, e.g. /zh/workbuddy/');
await mkdir('test-results/quick', { recursive: true });
const browser = await launchBrowser();
const failures = [];
for (const path of paths) {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
    const overflow = await page.evaluate(() =>
      [...document.querySelectorAll('main *, header *, footer *')]
        .filter((el) => {
          if (el.closest('.subnav, .topic-tabs') || el.parentElement?.closest('.api-code')) return false;
          const box = el.getBoundingClientRect();
          return el.checkVisibility() && box.width > 0 && (box.right > innerWidth + 1 || box.left < -1);
        })
        .map((el) => `${el.tagName}.${el.className}`)
    );
    const name = `${path.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'root'}-${width}`;
    await page.screenshot({ path: `test-results/quick/${name}.png`, fullPage: true });
    const axe =
      width === 768
        ? []
        : (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;
    const problems = [
      response.status() !== 200 && `status ${response.status()}`,
      overflow.length && `overflow ${overflow.slice(0, 3).join(', ')}`,
      errors.length && `errors ${errors.join(' | ')}`,
      axe.length && `axe ${axe.map((v) => v.id).join(', ')}`,
    ].filter(Boolean);
    if (problems.length) failures.push(`${path} @${width}: ${problems.join('; ')}`);
    await context.close();
  }
}
await browser.close();
assert.deepEqual(failures, [], failures.join('\n'));
console.log(`PASS quick: ${paths.length} page(s) × 390/768/1440, screenshots in test-results/quick/`);
