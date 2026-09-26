import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';
import { testHomeChapters } from './test-home-chapters.mjs';
import { testRoundThree } from './test-round-three.mjs';

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
    const result = { engine, version: browser.version(), flows: [], errors: [], motion: {}, chapters: {} };
    try {
      const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
      const page = await context.newPage();
      page.on('pageerror', (error) => result.errors.push(error.message));
      result.chapters = await testHomeChapters(page, base, engine);
      result.roundThree = await testRoundThree(page, base, engine, routes);
      for (const route of routes) {
        await page.goto(`${base}${route.path}`, { waitUntil: 'networkidle' });
        const response = await page
          .locator('.language-link')
          .click()
          .then(() => page.waitForLoadState('networkidle'));
        void response;
        assert.equal(new URL(page.url()).pathname, route.counterpart);
        await page.goBack({ waitUntil: 'networkidle' });
        assert.equal(new URL(page.url()).pathname, route.path);
        if (route.kind === 'article') {
          const anchors = await page.locator('.desktop-toc a').evaluateAll((links) =>
            links.map((link) => ({
              href: link.getAttribute('href'),
              exists: !!document.getElementById(decodeURIComponent(link.hash.slice(1))),
            }))
          );
          assert(anchors.length >= 5 && anchors.every((anchor) => anchor.exists));
          await page.locator('.desktop-toc a').nth(1).click();
          await page.waitForFunction(
            () => {
              const element = document.getElementById(decodeURIComponent(location.hash.slice(1)));
              if (!element) return false;
              const top = element.getBoundingClientRect().top;
              return top >= 80 && top < 400;
            },
            undefined,
            { timeout: 2500 }
          );
          const target = await page.evaluate(() => {
            const element = document.getElementById(decodeURIComponent(location.hash.slice(1)));
            return element.getBoundingClientRect().top;
          });
          assert(target >= 80 && target < 400, `TOC offset: ${engine} ${target}`);
          assert(
            (await page.locator('.article-inquiry .button').getAttribute('href')).endsWith(`topic=${route.service}`)
          );
        }
      }
      result.flows.push('26 language counterpart round-trips and browser back; 12 article TOCs and topic-aware CTAs');
      for (const width of [390, 768, 1024, 1199, 1200]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(`${base}/en/workbuddy/`, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('.mobile-menu').isVisible(), width < 1200);
        if (width < 1200) {
          await page.locator('.mobile-menu summary').focus();
          await page.keyboard.press('Enter');
          await page.waitForTimeout(250);
          assert(await page.locator('.mobile-menu nav').isVisible());
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null);
          assert(await page.locator('.mobile-menu summary').evaluate((el) => el === document.activeElement));
          await page.locator('.mobile-menu summary').click();
          await page.locator('.site-header').click({ position: { x: 1, y: 1 } });
          assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null);
          await page.locator('.mobile-menu summary').click();
          await page.waitForTimeout(250);
          assert(await page.locator('.mobile-menu nav').isVisible(), 'Rapid reopen must not lose a click');
          await page.locator('.mobile-menu nav a').first().focus();
          assert.equal(
            await page.locator('.mobile-menu').getAttribute('open'),
            '',
            `Internal focus must retain the menu: ${engine} ${width}px`
          );
          await page.locator('.mobile-menu nav a').last().focus();
          await page.keyboard.press('Tab');
          await page.waitForFunction(() => !document.querySelector('.mobile-menu').open);
          assert.equal(
            await page.locator('.mobile-menu').getAttribute('open'),
            null,
            `Tab-out must close the menu: ${engine} ${width}px`
          );
          await page.locator('.mobile-menu summary').click();
          await page.locator('.mobile-menu').evaluate((menu) => {
            menu
              .querySelector('nav')
              .getAnimations()
              .forEach((animation) => animation.finish());
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
      await page.locator('.mobile-toc summary').click();
      await page.waitForTimeout(250);
      await page.locator('.mobile-toc a').nth(1).click();
      await page.waitForTimeout(550);
      const fixed = page.locator('.mobile-inquiry');
      assert(await fixed.isVisible());
      assert((await fixed.locator('a').getAttribute('href')).includes('topic=model-services'));
      await page.locator('.footer-bottom a').focus();
      await page.waitForFunction(() => {
        const link = document.querySelector('.footer-bottom a').getBoundingClientRect();
        const bar = document.querySelector('.mobile-inquiry').getBoundingClientRect();
        return link.top >= 71 && link.bottom <= bar.top;
      });
      assert(
        await page
          .locator('.footer-bottom a')
          .evaluate(
            (el) =>
              el.getBoundingClientRect().bottom <= document.querySelector('.mobile-inquiry').getBoundingClientRect().top
          ),
        'Fixed CTA must not obscure focused footer content'
      );
      await fixed.locator('a').click();
      assert(await page.locator('input[value="model-services"]').isChecked());
      assert.equal(await page.locator('.mobile-inquiry').count(), 0);
      await page.locator('.language-link').click();
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
      assert.equal(await page.evaluate(() => getSelection().toString()), 'CCGAI008');
      assert((await page.locator('.copy-status').innerText()).includes('手动复制'));
      result.flows.push(
        'Mobile TOC, fixed inquiry, unobscured footer focus, localized contact topic, clipboard fallback'
      );

      await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      await page.locator('.faq-list summary').first().focus();
      await page.keyboard.press('Enter');
      await page
        .locator('.disclosure-content')
        .first()
        .evaluate(async (el) => {
          await Promise.all(el.getAnimations().map((animation) => animation.finished.catch(() => {})));
        });
      assert(await page.locator('.faq-list details[open] p').isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.faq-list details[open]').count(), 0);
      await page.locator('.faq-list summary').first().click();
      await page
        .locator('.disclosure-content')
        .first()
        .evaluate(async (el) => {
          await Promise.all(el.getAnimations().map((animation) => animation.finished.catch(() => {})));
        });
      await page.locator('.faq-list summary').first().click();
      await page.waitForFunction(() => !document.querySelector('.faq-list details').open);
      assert.equal(await page.locator('.faq-list details[open]').count(), 0);
      result.flows.push('FAQ animated open/close, keyboard activation and Escape');

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
      result.flows.push('All 26 routes: 200% equivalent reflow (1440 physical / 720 CSS px, DPR 2)');

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1440, height: 960 });
      await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      assert(await page.evaluate(() => document.getAnimations().length === 0));
      await page.locator('.service-card').first().hover();
      assert.equal(
        await page
          .locator('.service-card')
          .first()
          .evaluate((el) => getComputedStyle(el).transform),
        'none'
      );
      await page.locator('.faq-list summary').first().click();
      assert(await page.locator('.faq-list details[open] p').isVisible());
      assert(await page.evaluate(() => document.getAnimations().length === 0));
      result.flows.push('Reduced motion: no entrance, hover movement, disclosure animation or native page transition');

      const fallback = await browser.newContext();
      await fallback.addInitScript(() => {
        delete window.IntersectionObserver;
      });
      const fallbackPage = await fallback.newPage();
      await fallbackPage.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      assert(await fallbackPage.locator('#services').evaluate((el) => getComputedStyle(el).opacity === '1'));
      await fallback.close();
      const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      const plain = await noJS.newPage();
      await plain.goto(`${base}/en/`, { waitUntil: 'networkidle' });
      await plain.evaluate(() => document.fonts.ready);
      await plain.locator('.chapter-next').click();
      // Poll from the driver: page-side animation-frame polling is disabled with JS.
      let positioned = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        positioned = await plain.evaluate(
          () => Math.abs(document.querySelector('#services').getBoundingClientRect().top - 71) < 2
        );
        if (positioned) break;
        await plain.waitForTimeout(50);
      }
      assert(positioned, `No-JS chapter positioning: ${engine}`);
      await plain.goto(`${base}/en/resources/model-api-procurement/`);
      assert((await plain.locator('.article-body').innerText()).length > 1500);
      await plain.locator('.mobile-toc summary').click();
      assert(await plain.locator('.mobile-toc nav').isVisible());
      await noJS.close();
      result.flows.push('Missing IntersectionObserver fallback and no-JS article/TOC');

      const videoContext = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        reducedMotion: 'no-preference',
        recordVideo: { dir: 'test-results/motion', size: { width: 1440, height: 960 } },
      });
      await videoContext.addInitScript(() => {
        const original = Element.prototype.animate;
        Element.prototype.animate = function (frames, options) {
          if (this.matches('[data-reveal]')) {
            this.setAttribute('data-play-count', String(Number(this.getAttribute('data-play-count') || 0) + 1));
          }
          return original.call(this, frames, options);
        };
      });
      const motion = await videoContext.newPage();
      await motion.goto(`${base}/zh/`, { waitUntil: 'domcontentloaded' });
      await motion.waitForTimeout(80);
      const initial = await motion.locator('.hero-whale').evaluate((el) => ({
        transform: getComputedStyle(el).transform,
        titleOpacity: getComputedStyle(document.querySelector('.hero-brand')).opacity,
        animation: getComputedStyle(el).animationDuration,
      }));
      await motion.waitForTimeout(1000);
      const final = await motion.locator('.hero-whale').evaluate((el) => ({
        transform: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
      }));
      assert.equal(initial.titleOpacity, '1');
      assert.equal(initial.animation, '0.9s');
      assert(['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(final.transform));
      await motion.mouse.move(720, 480);
      await motion.mouse.wheel(0, 650);
      await motion.waitForFunction(
        () => Math.abs(document.querySelector('#services').getBoundingClientRect().top - 81) < 2
      );
      await motion.waitForTimeout(600);
      await motion.locator('.service-card').first().hover();
      await motion.waitForTimeout(250);
      await motion.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await motion.locator('.chapter-next').click();
      await motion.waitForFunction(() => !document.documentElement.hasAttribute('data-chapter-scrolling'));
      await motion.waitForTimeout(600);
      const revealCounts = await motion
        .locator('[data-play-count]')
        .evaluateAll((elements) => elements.map((el) => Number(el.getAttribute('data-play-count'))));
      assert(
        revealCounts.length > 0 && revealCounts.every((count) => count === 1),
        'Scroll reveals must play only once'
      );
      await motion.locator('.faq-list summary').first().click();
      await motion.waitForTimeout(500);
      await motion.locator('.faq-list summary').first().click();
      await motion.waitForTimeout(350);
      const video = motion.video();
      await videoContext.close();
      const videoPath = await video.path();
      result.motion = { initial, final, revealCounts, video: videoPath };

      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto(`${base}/zh/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        document.querySelectorAll('.hero-whale,.hero-intro,.hero-actions').forEach((el) => {
          el.getAnimations().forEach((animation) => animation.pause());
        });
      });
      for (const [label, time] of [
        ['initial', 0],
        ['middle', 240],
        ['final', 1100],
      ]) {
        await page.evaluate(
          (time) =>
            document.querySelectorAll('.hero-whale,.hero-intro,.hero-actions').forEach((el) =>
              el.getAnimations().forEach((animation) => {
                animation.currentTime = time;
              })
            ),
          time
        );
        await page.screenshot({ path: `test-results/motion/${engine}-${label}.png` });
      }
      result.flows.push('Natural motion playback recorded; deterministic initial/middle/final screenshots');
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
