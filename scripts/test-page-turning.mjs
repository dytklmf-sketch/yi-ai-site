import assert from 'node:assert/strict';

export async function testPageTurning(page, base, engine) {
  const ids = ['intro', 'services', 'capabilities', 'process', 'guides', 'faq', 'inquiry'];
  const aligned = async (index) => {
    await page.waitForFunction(
      (index) => {
        const sections = [...document.querySelectorAll('.home-chapter')];
        const top = document.querySelector('.site-header').getBoundingClientRect().bottom;
        return (
          Math.abs(sections[index].getBoundingClientRect().top - top) < 2 &&
          !document.documentElement.hasAttribute('data-chapter-scrolling')
        );
      },
      index,
      { timeout: 5000 }
    );
  };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1524, height: 1227 });
  await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
  await page.mouse.move(700, 500);
  assert.equal(await page.locator('html').getAttribute('data-chapter-paging'), '');
  const deltas = [12, 80, 430, 650, 1400, 45];
  for (const [index, delta] of deltas.entries()) {
    await page.mouse.wheel(0, delta);
    await aligned(index + 1);
  }
  await page.screenshot({ path: `test-results/chapters/${engine}-paged-inquiry.png` });
  for (let index = 5; index >= 0; index--) {
    await page.mouse.wheel(0, -80);
    await aligned(index);
  }

  // A long gesture with a decaying tail must not spill into a second chapter.
  for (const delta of [120, 100, 80, 50, ...Array(25).fill(5)]) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(32);
  }
  await aligned(1);
  await page.waitForTimeout(250);
  await aligned(1);
  await page.screenshot({ path: `test-results/chapters/${engine}-paged-services.png` });

  // A delayed touchpad tail must not skip the FAQ chapter after its arrival.
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
  await page.locator('#guides').evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(450);
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(1050);
  await aligned(5);
  await page.mouse.wheel(0, 12);
  await page.waitForTimeout(900);
  await aligned(5);
  await page.waitForTimeout(450);
  await page.mouse.wheel(0, 80);
  await aligned(6);

  // Reproduce the reported resting state at several points, including the exact midpoint.
  const rests = [];
  for (const fraction of [0.1, 0.32, 0.49, 0.5, 0.68, 0.9]) {
    await page.evaluate((fraction) => {
      const inset = document.querySelector('.site-header').getBoundingClientRect().bottom;
      const current = document.querySelector('#services');
      const start = scrollY + current.getBoundingClientRect().top - inset;
      window.scrollTo({ top: start + current.getBoundingClientRect().height * fraction, behavior: 'instant' });
    }, fraction);
    await page.waitForTimeout(850);
    const rest = await page.evaluate(() => {
      const inset = document.querySelector('.site-header').getBoundingClientRect().bottom;
      const sections = [...document.querySelectorAll('.home-chapter')];
      const nearest = sections.reduce((a, b) =>
        Math.abs(a.getBoundingClientRect().top - inset) < Math.abs(b.getBoundingClientRect().top - inset) ? a : b
      );
      return { id: nearest.id, error: Math.abs(nearest.getBoundingClientRect().top - inset) };
    });
    assert(rest.error < 2, `${engine}: must not rest between chapters at ${fraction}: ${JSON.stringify(rest)}`);
    rests.push({ fraction, ...rest });
  }

  await page.keyboard.press('Home');
  await aligned(0);
  await page.keyboard.press('PageDown');
  await aligned(1);
  await page.keyboard.press('PageUp');
  await aligned(0);
  await page.keyboard.press('End');
  await aligned(6);
  assert(
    await page.locator('.site-footer').evaluate((footer) => footer.getBoundingClientRect().top >= 80),
    'Footer remains after the final primary chapter instead of becoming a chapter target'
  );
  await page.keyboard.press('Home');
  await aligned(0);

  // Releasing a drag must settle even if the user held the pointer during the scroll.
  await page.mouse.move(700, 120);
  await page.mouse.down();
  await page.evaluate(() => window.scrollTo({ top: (innerHeight - 81) * 1.45, behavior: 'instant' }));
  await page.waitForTimeout(300);
  await page.mouse.move(720, 140);
  await page.mouse.up();
  await aligned(1);

  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${base}/en/#services`, { waitUntil: 'networkidle' });
  await aligned(1);
  await page.mouse.move(720, 480);
  await page.mouse.wheel(0, 80);
  await aligned(2);
  await page.goBack();
  await page.waitForTimeout(900);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 720, height: 480 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('data-chapter-paging'), null);
    const prevented = await page.evaluate(() => {
      const event = new WheelEvent('wheel', { deltaY: 80, bubbles: true, cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    });
    assert.equal(prevented, false, `${engine}: small screens keep native reading`);
  }
  return {
    sections: ids,
    wheelDeltas: deltas,
    intermediateRests: rests,
    checks: [
      'Each desktop wheel gesture turns exactly one primary chapter in both directions; the footer remains natural flow',
      'A decaying inertia tail never advances a second chapter; drag release and midpoint positions always settle',
      'A late same-direction touchpad tail cannot skip the FAQ chapter after the transition completes',
      'Home, End, PageUp, PageDown and bilingual fragments align; mobile and short windows remain native',
    ],
  };
}
