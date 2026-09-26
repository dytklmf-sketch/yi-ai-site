import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

export async function testChapterTransition(page, base, engine) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.chapterFrames = [];
    const started = performance.now();
    const sample = (now) => {
      const content = document.querySelector('#services > .site-container');
      window.chapterFrames.push({
        time: now - started,
        y: scrollY,
        active: document.documentElement.hasAttribute('data-chapter-scrolling'),
        opacity: Number(getComputedStyle(content).opacity),
        visible: content.getBoundingClientRect().top < innerHeight,
      });
      if (now - started < 1300) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.locator('.chapter-next').click();
  await page.waitForTimeout(1400);
  const frames = await page.evaluate(() => window.chapterFrames);
  await writeFile(`test-results/chapters/${engine}-transition-frames.json`, JSON.stringify(frames, null, 2));
  const active = frames.filter((frame) => frame.active);
  assert(active.length > 12, `${engine}: chapter links must interpolate across frames`);
  const duration = active.at(-1).time - active[0].time;
  assert(duration > 600 && duration < 1100, `${engine}: controlled scroll duration ${duration}`);
  let peakSpeed = 0;
  for (let i = 1; i < frames.length; i++) {
    const before = frames[i - 1];
    const after = frames[i];
    assert(after.y >= before.y - 1, `${engine}: chapter transition must not reverse or re-snap`);
    // WebKit can deliver samples less than 1ms apart; measure speed over a stable 100ms window.
    const windowStart = frames.find((frame) => frame.time >= after.time - 100);
    const elapsed = after.time - windowStart.time;
    if (elapsed >= 70) peakSpeed = Math.max(peakSpeed, (after.y - windowStart.y) / elapsed);
    if (before.visible && after.visible) {
      assert(after.opacity >= before.opacity - 0.02, `${engine}: visible content must not blink out`);
    }
  }
  assert(peakSpeed < 3.5, `${engine}: abrupt scroll speed ${peakSpeed} px/ms`);
  assert(Math.abs(frames.at(-1).y - 879) < 2);
  assert.equal(await page.locator('html').getAttribute('data-chapter-scrolling'), null);

  await page.locator('.chapter-nav a[href="#guides"]').click();
  await page.waitForTimeout(150);
  await page.mouse.wheel(0, -140);
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('html').getAttribute('data-chapter-scrolling'), null);
  assert(await page.evaluate(() => scrollY < 2000), `${engine}: wheel input must cancel the old destination`);

  await page.goto(`${base}/en/#intro`, { waitUntil: 'networkidle' });
  await page.locator('.chapter-next').click();
  await page.waitForTimeout(150);
  await page.goBack();
  await page.waitForTimeout(1100);
  assert.equal(new URL(page.url()).hash, '#intro');
  assert(await page.evaluate(() => scrollY < 2), `${engine}: Back must cancel an unfinished transition`);

  await page.locator('.chapter-next').click();
  await page.waitForTimeout(100);
  await page.locator('.chapter-nav a[href="#guides"]').click();
  await page.waitForTimeout(1200);
  assert.equal(new URL(page.url()).hash, '#guides');
  assert(
    await page.evaluate(() => Math.abs(document.querySelector('#guides').getBoundingClientRect().top - 81) < 2),
    `${engine}: the latest chapter request must win`
  );

  await page.locator('.chapter-nav a[href="#intro"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1200);
  assert(await page.locator('#intro').evaluate((el) => el === document.activeElement));

  await page.locator('.chapter-next').click();
  await page.waitForTimeout(150);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-chapter-scrolling'));
  assert.equal(await page.locator('html').getAttribute('data-chapter-scrolling'), null);
  const stopped = await page.evaluate(() => scrollY);
  await page.waitForTimeout(1100);
  assert.equal(await page.evaluate(() => scrollY), stopped, `${engine}: preference changes stop active motion`);
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.chapterWheelSamples = [];
    window.addEventListener('wheel', (event) => window.chapterWheelSamples.push(event.defaultPrevented), {
      passive: true,
    });
  });
  const smallDeltas = [];
  for (const delta of [...Array(14).fill(35), 28, 24, 20, 16, 12, 8, 4]) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(16);
    smallDeltas.push(await page.evaluate(() => scrollY));
  }
  await page.waitForTimeout(700);
  const wheel = await page.evaluate(() => ({ events: window.chapterWheelSamples, y: scrollY }));
  assert(wheel.events.length > 0 && wheel.events.every((prevented) => prevented));
  assert(Math.abs(wheel.y - 879) < 2, `${engine}: one gesture must finish at exactly the next chapter`);
  assert(
    smallDeltas.every((y, index) => !index || y >= smallDeltas[index - 1] - 1),
    `${engine}: snapping must not pull backward while wheel input continues`
  );
  assert.equal(await page.locator('html').getAttribute('data-chapter-scrolling'), null);
  return {
    durationMs: Math.round(duration),
    peak100msPixelsPerMs: Number(peakSpeed.toFixed(2)),
    frames: frames.length,
    smallDeltaEvents: wheel.events.length,
    smallDeltaPositions: smallDeltas,
    checks: [
      'Continuous eased chapter links without visible opacity resets or reverse correction',
      'Wheel, browser Back, replacement navigation and reduced-motion changes cancel in-flight scroll',
      'Keyboard navigation focuses the destination; small-delta wheel input turns exactly one screen',
    ],
  };
}
