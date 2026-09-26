import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { testChapterTransition } from './test-chapter-transition.mjs';
import { testPageTurning } from './test-page-turning.mjs';

export async function testHomeChapters(page, base, engine) {
  await mkdir('test-results/chapters', { recursive: true });
  const result = { screens: [], checks: [] };
  result.transition = await testChapterTransition(page, base, engine);
  result.paging = await testPageTurning(page, base, engine);
  const ids = ['intro', 'services', 'capabilities', 'process', 'guides', 'faq', 'inquiry'];
  for (const lang of ['zh', 'en']) {
    for (const width of [1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: width === 1440 ? 960 : 1080 });
      await page.goto(`${base}/${lang}/`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.home-chapter').count(), 7);
      assert.equal(await page.locator('html').getAttribute('data-chapter-paging'), '');
      for (const id of ids) {
        await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await page.waitForFunction(
          (id) => document.querySelector('.chapter-nav [aria-current="step"]')?.getAttribute('href') === `#${id}`,
          id
        );
        await page.waitForTimeout(550);
        const geometry = await page.locator(`#${id}`).evaluate((el) => {
          const box = el.getBoundingClientRect();
          const header = document.querySelector('.site-header').getBoundingClientRect();
          const content = el.querySelector('.site-container').getBoundingClientRect();
          return {
            top: box.top,
            height: box.height,
            available: innerHeight - header.bottom,
            aligned: Math.abs(box.top - header.bottom) < 2,
            contained: content.top >= header.bottom && content.bottom <= innerHeight,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        assert(
          geometry.aligned && geometry.contained && !geometry.overflow,
          `${engine} ${lang} ${width} ${id}: ${JSON.stringify(geometry)}`
        );
        if (id === 'inquiry') {
          assert(geometry.height < geometry.available, 'Inquiry closes naturally before the footer');
        } else {
          assert(Math.abs(geometry.height - geometry.available) < 2, `One screen per chapter: ${id}`);
        }
        result.screens.push({ lang, width, id, ...geometry });
        if (width === 1440) {
          await page.screenshot({ path: `test-results/chapters/${engine}-${lang}-${id}.png` });
        }
      }
    }
  }
  result.checks.push('42 complete desktop chapters; 1440, 1920 and 2560px; both languages');

  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => scrollY < 2);
  await page.mouse.move(720, 480);
  await page.mouse.wheel(0, 650);
  try {
    await page.waitForFunction(
      () => Math.abs(document.querySelector('#services').getBoundingClientRect().top - 81) < 2
    );
  } catch (error) {
    const position = await page.evaluate(() => ({
      y: scrollY,
      services: document.querySelector('#services').getBoundingClientRect().top,
      snap: getComputedStyle(document.documentElement).scrollSnapType,
      scrolling: document.documentElement.hasAttribute('data-chapter-scrolling'),
      input: document.documentElement.hasAttribute('data-chapter-input'),
      size: [innerWidth, innerHeight],
    }));
    throw new Error(`${engine} wheel positioning: ${JSON.stringify(position)}`, { cause: error });
  }
  await page.waitForTimeout(600);
  assert.equal(await page.locator('.chapter-nav [aria-current]').getAttribute('href'), '#services');
  await page.locator('.chapter-nav a[href="#intro"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => scrollY < 2);
  await page.waitForTimeout(350);
  await page.locator('.chapter-next').click();
  await page.waitForFunction(() => Math.abs(document.querySelector('#services').getBoundingClientRect().top - 81) < 2);
  assert.equal(new URL(page.url()).hash, '#services');
  await page.waitForTimeout(350);
  await page.goBack();
  await page.waitForFunction(() => scrollY < 2);
  await page.waitForTimeout(300);
  assert(await page.evaluate(() => scrollY < 2), 'An old scroll frame must not undo browser-back positioning');
  await page.goto(`${base}/en/#guides`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Math.abs(document.querySelector('#guides').getBoundingClientRect().top - 81) < 2);
  result.checks.push('One-screen wheel paging, keyboard chapter links, next-section cue, history and direct fragment');

  await page.goto(`${base}/en/`, { waitUntil: 'networkidle' });
  await page.locator('.faq-list summary').last().focus();
  await page.waitForFunction(() => Math.abs(document.querySelector('#faq').getBoundingClientRect().top - 81) < 2);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const focusedFAQ = await page.locator('.faq-list summary').last().boundingBox();
  assert(focusedFAQ.y >= 81 && focusedFAQ.y + focusedFAQ.height < 960);
  await page.locator('.footer-bottom a').focus();
  await page.waitForFunction(() => {
    const box = document.querySelector('.footer-bottom a').getBoundingClientRect();
    return box.top >= 81 && box.bottom <= innerHeight;
  });
  const footer = await page.locator('.footer-bottom a').boundingBox();
  assert(footer.y >= 81 && footer.y + footer.height <= 960);
  result.checks.push('Keyboard can reach FAQ and footer without being trapped by snap points');

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 375, height: 667 },
    { width: 720, height: 480 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/en/`, { waitUntil: 'networkidle' });
    assert.notEqual(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType),
      'y mandatory'
    );
    // Long cards remain native content: each part must be readable, not squeezed into one screen.
    for (const child of await page.locator('.guide-card').last().locator(':scope > *').all()) {
      await child.evaluate((el) => {
        const header = document.querySelector('.site-header').getBoundingClientRect();
        scrollTo({ top: scrollY + el.getBoundingClientRect().top - header.bottom - 16, behavior: 'instant' });
      });
      await page.waitForTimeout(200);
      assert(
        await child.evaluate((el) => {
          const header = document.querySelector('.site-header').getBoundingClientRect();
          const bar = document.querySelector('.mobile-inquiry').getBoundingClientRect();
          const content = el.getBoundingClientRect();
          return content.top >= header.bottom && content.bottom <= (bar.height ? bar.top : innerHeight);
        }),
        `Long chapter content remains readable: ${engine} ${viewport.width}px`
      );
    }
    await page.screenshot({ path: `test-results/chapters/${engine}-en-long-${viewport.width}.png` });
  }
  result.checks.push('Long mobile chapters and 200% equivalent reflow retain reachable content');

  await page.setViewportSize({ width: 1440, height: 650 });
  await page.goto(`${base}/en/#faq`, { waitUntil: 'networkidle' });
  for (const summary of await page.locator('.faq-list summary').all()) {
    await summary.click();
    await page.waitForTimeout(250);
  }
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType), 'none');
  await page.locator('.faq-list details').last().locator('p').scrollIntoViewIfNeeded();
  const answer = await page.locator('.faq-list details').last().locator('p').boundingBox();
  assert(answer.y >= 81 && answer.y + answer.height <= 650);
  result.checks.push('All FAQ answers stay reachable together in a 650px-high window');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType), 'none');
  await page.locator('.chapter-next').click();
  assert(await page.evaluate(() => document.getAnimations().length === 0));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  result.checks.push('Reduced motion removes snapping and animation');
  return result;
}
