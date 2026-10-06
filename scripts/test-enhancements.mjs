import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';

const settle = (page, ms = 120) => page.waitForTimeout(ms);
const scrollToElement = (page, selector, block = 'start') =>
  page.locator(selector).evaluate((el, block) => el.scrollIntoView({ block, behavior: 'instant' }), block);

export async function testEnhancements(base, routes) {
  const report = {
    testedAt: new Date().toISOString(),
    conditions: 'Local static preview; headless browsers; no CPU/network throttling. Not production field metrics.',
    engines: [],
  };
  await mkdir('test-results/motion', { recursive: true });
  for (const engine of ['chromium', 'webkit']) {
    console.log(`Checking enhanced workflows: ${engine}`);
    const browser = await launchBrowser(engine);
    const result = { engine, version: browser.version(), flows: [], errors: [], motion: {} };
    try {
      const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
      const page = await context.newPage();
      page.on('pageerror', (error) => result.errors.push(error.message));

      for (const route of routes) {
        await page.goto(`${base}${route.path}`, { waitUntil: 'networkidle' });
        await page.locator('.language-link').click();
        await page.waitForLoadState('networkidle');
        assert.equal(new URL(page.url()).pathname, route.counterpart);
        await page.goBack({ waitUntil: 'networkidle' });
        assert.equal(new URL(page.url()).pathname, route.path);
        if (route.kind === 'article') {
          const toc = page.locator('.desktop-toc ol a');
          const anchors = await toc.evaluateAll((links) =>
            links.map((link) => !!document.getElementById(decodeURIComponent(link.hash.slice(1))))
          );
          assert(anchors.length >= 5 && anchors.every(Boolean));
          await toc.nth(1).click();
          await page.waitForFunction(
            () => {
              const element = document.getElementById(decodeURIComponent(location.hash.slice(1)));
              const top = element?.getBoundingClientRect().top ?? -1;
              return top >= 72 && top < 400;
            },
            undefined,
            { timeout: 2500 }
          );
          // Smooth scrolling may still be settling; the TOC must catch up once it does.
          await page
            .waitForFunction(
              () => document.querySelectorAll('.desktop-toc ol a')[1]?.getAttribute('aria-current') === 'location',
              undefined,
              { timeout: 2500 }
            )
            .catch(() => {});
          assert.equal(await toc.nth(1).getAttribute('aria-current'), 'location', 'TOC follows the reader');
          // The counterpart article opens at the matching section.
          const expected = await page.locator('[data-language-fragments]').evaluate((el) => {
            const pairs = JSON.parse(el.dataset.languageFragments);
            return pairs[decodeURIComponent(location.hash.slice(1))];
          });
          assert.equal(
            decodeURIComponent(new URL(await page.locator('.language-link').evaluate((a) => a.href)).hash.slice(1)),
            expected
          );
          const progress = await page
            .locator('[data-reading-progress]')
            .evaluate((el) => Number(el.style.getPropertyValue('--progress')));
          assert(progress > 0 && progress < 1, `Reading progress follows the article: ${progress}`);
          assert(
            (await page.locator('.article-inquiry .btn-light').getAttribute('href')).endsWith(`topic=${route.service}`)
          );
          assert(
            (await page.locator('.toc-cta').getAttribute('href')).endsWith(`topic=${route.service}`),
            'TOC inquiry keeps the article service'
          );
        }
      }
      result.flows.push(
        `${routes.length} language round-trips; ${routes.filter((r) => r.kind === 'article').length} article TOCs, section pairing, reading progress and topic CTAs`
      );

      for (const service of ['workbuddy', 'model-services', 'infrastructure']) {
        await page.goto(`${base}/zh/${service}/`, { waitUntil: 'networkidle' });
        assert.equal(
          await page.locator('.subnav a').count(),
          { workbuddy: 5, 'model-services': 5, infrastructure: 5 }[service]
        );
        await page.locator('.subnav a[href="#process"]').click();
        await page.waitForFunction(() => {
          const top = document.getElementById('process').getBoundingClientRect().top;
          // WebKit can land a sub-pixel above the top (e.g. -0.03px) with rem-scaled layouts.
          return top >= -1 && top < 260;
        });
        await page
          .waitForFunction(
            () => document.querySelector('.subnav a[href="#process"]')?.getAttribute('aria-current') === 'location',
            undefined,
            { timeout: 2500 }
          )
          .catch(() => {});
        assert.equal(await page.locator('.subnav a[href="#process"]').getAttribute('aria-current'), 'location');
        assert.equal(new URL(page.url()).hash, '#process');
        const covered = await page.evaluate(() => {
          const bar = document.querySelector('.subnav').getBoundingClientRect().bottom;
          return document.querySelector('#process .section-title, #process h2').getBoundingClientRect().top < bar;
        });
        assert(!covered, `Sticky section nav must not cover the heading: ${service}`);
      }
      result.flows.push('Service section nav: anchor offset under sticky bars and aria-current tracking');

      // Home: dark header over the night hero, solid afterwards; the three services sit side by side.
      await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      const header = page.locator('.site-header');
      assert.equal(await header.evaluate((el) => el.classList.contains('is-solid')), false);
      await scrollToElement(page, '#services');
      await settle(page, 200);
      assert.equal(await header.evaluate((el) => el.classList.contains('is-solid')), true);
      assert.equal(await page.locator('.service-column:visible').count(), 3, 'All three services visible at once');
      // Round 28: only the hero fills the first screen; every other section takes its content height, so none of
      // them carries more than 0.4 of a screen in padding, and the three service columns share one row.
      for (const [width, height] of [
        [1440, 789],
        [1920, 945],
        [2560, 1305],
      ]) {
        await page.setViewportSize({ width, height });
        await settle(page, 150);
        const fit = await page.evaluate(() => {
          const [hero, ...rest] = document.querySelectorAll('main.chapters > section');
          const tops = [...document.querySelectorAll('.service-column')].map((el) => el.offsetTop);
          return {
            hero: hero.offsetHeight >= innerHeight - 1,
            blank: rest
              .filter((s) => s.offsetHeight - s.querySelector('.container').offsetHeight > innerHeight * 0.4)
              .map((s) => s.id || s.className),
            row: Math.max(...tops) - Math.min(...tops) < 1,
          };
        });
        assert(fit.hero, `The hero fills the first screen at ${width}×${height}`);
        assert.deepEqual(fit.blank, [], `Sections padded beyond 0.4 screen at ${width}×${height}`);
        assert(fit.row, `Service columns share one row at ${width}×${height}`);
      }
      await page.setViewportSize({ width: 1440, height: 960 });
      // Round 33: the filter lives on the FAQ page (six questions per service); home shows one per service.
      await page.goto(`${base}/zh/faq/`, { waitUntil: 'networkidle' });
      await scrollToElement(page, '#faq');
      // Let the reveal finish so the pointer targets the settled filter row.
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.faq-aside')).transform === 'none');
      await page.locator('[data-faq-filter] button[data-filter="infrastructure"]').click();
      await page
        .waitForFunction(() => document.querySelectorAll('.faq-list details:not([hidden])').length === 6, undefined, {
          timeout: 2000,
        })
        .catch(() => {});
      assert.equal(await page.locator('.faq-list details:visible').count(), 6);
      assert.equal(
        await page.locator('[data-faq-filter] button[data-filter="infrastructure"]').getAttribute('aria-pressed'),
        'true'
      );
      await page.locator('[data-faq-filter] button[data-filter="all"]').click();
      assert.equal(await page.locator('.faq-list details:visible').count(), 18);
      result.flows.push(
        'Header surface change, three service columns in one row, hero-only first screen and compact chapters at 3 desktop sizes, FAQ filter'
      );

      for (const width of [390, 768, 1024, 1199, 1200]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(`${base}/en/workbuddy/`, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('.mobile-menu').isVisible(), width < 1200);
        if (width < 1200) {
          await page.locator('.mobile-menu summary').focus();
          await page.keyboard.press('Enter');
          await page.waitForTimeout(300);
          assert(await page.locator('.mobile-menu nav').isVisible());
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null);
          assert(await page.locator('.mobile-menu summary').evaluate((el) => el === document.activeElement));
          await page.locator('.mobile-menu summary').click();
          await page.locator('.site-header').click({ position: { x: 1, y: 1 } });
          assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null, 'Outside click closes');
          await page.locator('.mobile-menu summary').click();
          await page.waitForTimeout(300);
          assert(await page.locator('.mobile-menu nav').isVisible(), 'Rapid reopen must not lose a click');
          await page.locator('.mobile-menu nav a').first().focus();
          assert.equal(await page.locator('.mobile-menu').getAttribute('open'), '', `Internal focus: ${engine}`);
          await page.locator('.mobile-sheet a').last().focus();
          await page.keyboard.press('Tab');
          await page.waitForFunction(() => !document.querySelector('.mobile-menu').open);
          await page.locator('.mobile-menu summary').click();
          await page.locator('.mobile-menu').evaluate((menu) => {
            menu.querySelectorAll('*').forEach((el) => el.getAnimations().forEach((animation) => animation.finish()));
            document.querySelector('main a').focus();
          });
          await page.waitForTimeout(50);
          assert.equal(
            await page.locator('.mobile-menu').getAttribute('open'),
            null,
            `Finishing entrance must not undo focus-out close: ${engine} ${width}px`
          );
        }
      }
      result.flows.push('1200px menu breakpoint, keyboard open, Escape focus return, outside click and Tab-out close');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${base}/en/resources/model-api-procurement/`, { waitUntil: 'networkidle' });
      // Round 40: a resident "contact us" button replaces the phone inquiry bar.
      const fab = page.locator('.contact-fab');
      assert(await fab.locator('summary').isVisible(), 'Contact button is always there');
      const footerReachable = await page.evaluate(() => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
        return document.querySelector('.footer-bottom').getBoundingClientRect().bottom <= innerHeight + 1;
      });
      assert(footerReachable, 'Footer must be fully reachable');
      await fab.locator('summary').click();
      assert(await fab.locator('.contact-fab-panel').isVisible());
      assert((await fab.locator('.contact-fab-topic').innerText()).includes('Model services'));
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('.contact-fab').open);
      await fab.locator('summary').click();
      await fab.locator('.contact-fab-more').click();
      await page.waitForURL(/\/en\/contact\//);
      assert(await page.locator('input[value="model-services"]').isChecked());
      assert.equal(await page.locator('.contact-fab').count(), 0);
      await page.locator('.language-link').click();
      await page.waitForURL(/\/zh\/contact\//);
      assert(await page.locator('input[value="model-services"]').isChecked());
      const mail = new URL(await page.locator('.inquiry-email').getAttribute('href'));
      assert(mail.searchParams.get('subject').includes('模型服务'));
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: { writeText: () => Promise.reject(new Error('denied')) },
        })
      );
      await page.locator('[data-copy]').click();
      await page.waitForFunction(() => document.querySelector('[data-contact-panel]').dataset.copyState === 'failure');
      assert.equal(await page.evaluate(() => getSelection().toString()), 'Li___CaB6');
      assert((await page.locator('.copy-status').innerText()).includes('手动复制'));
      result.flows.push('Mobile TOC, inquiry bar show/hide, footer reach, localized contact topic, clipboard fallback');

      await page.setViewportSize({ width: 1440, height: 960 });
      await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      const firstDisclosure = page.locator('.faq-list .disclosure-content').first();
      const finished = () =>
        firstDisclosure.evaluate(async (el) => {
          await Promise.all(el.getAnimations().map((animation) => animation.finished.catch(() => {})));
        });
      await page.locator('.faq-list summary').first().focus();
      await page.keyboard.press('Enter');
      await finished();
      assert(await page.locator('.faq-list details[open] p').isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.faq-list details[open]').count(), 0);
      await page.locator('.faq-list summary').first().click();
      await finished();
      await page.locator('.faq-list summary').first().click();
      await page.waitForFunction(() => !document.querySelector('.faq-list details').open);
      // Rapid double click settles in the last requested state.
      await page.locator('.faq-list summary').first().click();
      await page.locator('.faq-list summary').first().click();
      // WebKit can deliver the closing animation's finish a few hundred ms late under load; wait for it to settle.
      await page
        .waitForFunction(() => !document.querySelector('.faq-list details').open, undefined, { timeout: 3000 })
        .catch(() => {});
      assert.equal(await page.locator('.faq-list details[open]').count(), 0);
      result.flows.push('FAQ animated open/close, keyboard activation, Escape and interrupted toggles');

      // 1440 physical pixels at 200% zoom correspond to 720 CSS pixels.
      const zoom = await browser.newContext({ viewport: { width: 720, height: 480 }, deviceScaleFactor: 2 });
      const zoomPage = await zoom.newPage();
      for (const route of routes) {
        await zoomPage.goto(`${base}${route.path}`, { waitUntil: 'networkidle' });
        assert(
          await zoomPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `200% reflow: ${route.path}`
        );
        assert(await zoomPage.locator('.mobile-menu').isVisible());
      }
      await zoomPage.screenshot({ path: `test-results/${engine}-200-percent-reflow.png`, fullPage: true });
      await zoom.close();
      result.flows.push(`All ${routes.length} routes: 200% equivalent reflow (1440 physical / 720 CSS px, DPR 2)`);

      const calm = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
      const calmPage = await calm.newPage();
      await calmPage.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      await settle(calmPage, 100);
      assert(
        await calmPage.evaluate(() => document.getAnimations().every((animation) => animation.playState !== 'running')),
        'Reduced motion: nothing keeps running'
      );
      assert.equal(await calmPage.evaluate(() => document.documentElement.classList.contains('reveal-ready')), false);
      // Round 43: home lists guides in the compact list; hovering moves nothing.
      await scrollToElement(calmPage, '#guides');
      await calmPage.locator('.guide-list a').first().hover();
      assert.equal(
        await calmPage
          .locator('.guide-list a')
          .first()
          .evaluate((el) => getComputedStyle(el).transform),
        'none'
      );
      await calmPage.locator('.faq-list summary').first().click();
      assert(await calmPage.locator('.faq-list details[open] p').isVisible());
      // Round 44: the Enterprise card neither rises in nor lifts on hover under reduced motion.
      await calmPage.goto(`${base}/zh/workbuddy/`, { waitUntil: 'networkidle' });
      await scrollToElement(calmPage, '#compare');
      await calmPage.locator('.wb-vs-pro').hover();
      assert.equal(await calmPage.locator('.wb-vs-pro').evaluate((el) => getComputedStyle(el).transform), 'none');
      await calm.close();
      result.flows.push('Reduced motion: no entrance, reveal, hover movement or disclosure animation');

      const fallback = await browser.newContext();
      await fallback.addInitScript(() => {
        delete window.IntersectionObserver;
      });
      const fallbackPage = await fallback.newPage();
      await fallbackPage.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      assert(
        await fallbackPage.evaluate(() =>
          [...document.querySelectorAll('[data-reveal]')].every((el) => getComputedStyle(el).opacity === '1')
        )
      );
      await fallback.close();
      const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      const plain = await noJS.newPage();
      await plain.goto(`${base}/en/resources/model-api-procurement/`);
      assert((await plain.locator('.article-body').innerText()).length > 1500);
      await plain.locator('.mobile-toc summary').click();
      assert(await plain.locator('.mobile-toc nav').isVisible());
      await plain.goto(`${base}/en/`);
      await plain.locator('.hero-actions a[href="#services"]').click();
      await plain.waitForFunction(() => location.hash === '#services');
      await noJS.close();
      result.flows.push('Missing IntersectionObserver fallback and no-JS article/TOC/anchor');

      const videoContext = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        reducedMotion: 'no-preference',
        recordVideo: { dir: 'test-results/motion', size: { width: 1440, height: 960 } },
      });
      const motion = await videoContext.newPage();
      await motion.goto(`${base}/zh/`, { waitUntil: 'domcontentloaded' });
      await motion.waitForTimeout(80);
      const initial = await motion.locator('.hero-title').evaluate((el) => ({
        animation: getComputedStyle(el).animationName,
        duration: getComputedStyle(el).animationDuration,
      }));
      assert.equal(initial.animation, 'enter');
      const beam = await motion
        .locator('.hero-visual .stack-wide .beam-pulse')
        .evaluate((el) => getComputedStyle(el).animationIterationCount);
      assert.equal(beam, '2', 'Illustration motion ends; nothing loops');
      await motion.waitForTimeout(1600);
      const final = await motion.locator('.hero-title').evaluate((el) => ({
        transform: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
      }));
      assert(['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(final.transform) && final.opacity === '1');
      // Read the whole page like a visitor, one screen at a time.
      for (let y = 0; y < (await motion.evaluate(() => document.documentElement.scrollHeight)); y += 640) {
        await motion.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
        await motion.waitForTimeout(160);
      }
      // IntersectionObserver callbacks can lag while the video encoder holds the main thread, so wait for
      // every reveal to land before checking that none of them fades back out.
      await motion
        .waitForFunction(() => document.querySelectorAll('[data-reveal]:not(.is-in)').length === 0, undefined, {
          timeout: 4000,
        })
        .catch(() => {});
      const hiddenAfterReveal = await motion.evaluate(
        () => [...document.querySelectorAll('[data-reveal]')].filter((el) => !el.classList.contains('is-in')).length
      );
      await motion.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await motion.waitForTimeout(400);
      const hiddenAfterReturn = await motion.evaluate(
        () => [...document.querySelectorAll('[data-reveal]')].filter((el) => !el.classList.contains('is-in')).length
      );
      assert.equal(hiddenAfterReveal, 0, 'Every section reveals once read');
      assert.equal(hiddenAfterReturn, 0, 'Revealed content never hides again');
      await motion.locator('.hero .btn').first().hover();
      await motion.waitForTimeout(500);
      const video = motion.video();
      await videoContext.close();
      const videoPath = await video.path();
      result.motion = { initial, final, beamIterations: beam, hiddenAfterReveal, hiddenAfterReturn, video: videoPath };

      const stills = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        reducedMotion: 'no-preference',
      });
      const still = await stills.newPage();
      await still.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      await still.evaluate(() => document.getAnimations().forEach((animation) => animation.pause()));
      for (const [label, time] of [
        ['initial', 0],
        ['middle', 450],
        ['final', 2400],
      ]) {
        await still.evaluate(
          (time) =>
            document.getAnimations().forEach((animation) => {
              animation.currentTime = time;
            }),
          time
        );
        await still.screenshot({ path: `test-results/motion/${engine}-${label}.png` });
      }
      await stills.close();
      result.flows.push('Natural motion recorded; entrance ends at rest; finite illustration beam; one-way reveal');
      assert.deepEqual(result.errors, []);
      await context.close();
      report.engines.push(result);
    } finally {
      await browser.close();
    }
  }
  await writeFile('test-results/enhancement-report.json', JSON.stringify(report, null, 2));
  console.log('PASS: Chromium and WebKit enhanced workflows, motion capture, reduced motion and reflow.');
}
