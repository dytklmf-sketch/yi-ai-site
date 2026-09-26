import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

export async function testRoundThree(page, base, engine, routes) {
  const result = { screens: [], flows: [] };
  await mkdir('test-results/round3', { recursive: true });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const lang of ['zh', 'en']) {
    for (const viewport of [
      { width: 1200, height: 800 },
      { width: 1440, height: 960 },
      { width: 1524, height: 1227 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`${base}/${lang}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('#guides .guide-card').count(), 3);
      assert.equal(await page.locator('#process .steps article').count(), 4);
      assert.equal(await page.locator('#faq details').count(), 6);
      for (const chapter of await page.locator('.home-chapter').all()) {
        const id = await chapter.getAttribute('id');
        await chapter.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
        await page.waitForTimeout(700);
        const geometry = await chapter.evaluate((el) => {
          const box = el.getBoundingClientRect();
          const header = document.querySelector('.site-header').getBoundingClientRect().bottom;
          const content = el.querySelector('.site-container').getBoundingClientRect();
          const overflowing = [...el.querySelectorAll('h1,h2,h3,p,a,summary,fieldset,li')]
            .filter((item) => {
              if (!item.checkVisibility()) return false;
              const rect = item.getBoundingClientRect();
              return (
                rect.top < box.top - 1 || rect.bottom > box.bottom + 1 || rect.left < -1 || rect.right > innerWidth + 1
              );
            })
            .map((item) => item.className || item.tagName);
          return {
            top: box.top,
            height: box.height,
            available: innerHeight - header,
            contentBottom: content.bottom,
            overflowing,
          };
        });
        assert(Math.abs(geometry.top - 81) < 2, `${engine} ${lang} ${id}: not aligned`);
        if (id === 'inquiry') {
          assert(
            geometry.height < geometry.available,
            `${engine} ${lang} ${id}: inquiry should close naturally before the footer`
          );
        } else {
          assert(
            Math.abs(geometry.height - geometry.available) < 2,
            `${engine} ${lang} ${id}: ${JSON.stringify(geometry)}`
          );
        }
        assert(
          geometry.contentBottom <= viewport.height + 1 && !geometry.overflowing.length,
          `${engine} ${lang} ${id}: ${JSON.stringify(geometry)}`
        );
        result.screens.push({ lang, ...viewport, id, ...geometry });
        if (viewport.width !== 1440 || ['intro', 'inquiry'].includes(id)) {
          await page.screenshot({ path: `test-results/round3/${engine}-${lang}-${viewport.width}-${id}.png` });
        }
      }
    }
  }
  result.flows.push(
    '42 bilingual chapter checks at 1200x800, 1440x960 and 1524x1227; all visible content stays inside its chapter'
  );

  await page.setViewportSize({ width: 1440, height: 960 });
  for (const lang of ['zh', 'en']) {
    const other = lang === 'zh' ? 'en' : 'zh';
    await page.goto(`${base}/${lang}/`, { waitUntil: 'networkidle' });
    for (const service of ['workbuddy', 'model-services', 'infrastructure']) {
      const link = page.locator(`#services a[href="/${lang}/contact/?topic=${service}"]`);
      await link.click();
      assert(await page.locator(`input[value="${service}"]`).isChecked());
      await page.goBack({ waitUntil: 'networkidle' });
    }
    await page.goto(`${base}/${lang}/?topic=model-services#inquiry`, { waitUntil: 'networkidle' });
    assert(await page.locator('input[value="model-services"]').isChecked());
    await page.locator('label:has(input[value="infrastructure"])').click();
    assert.equal(new URL(page.url()).searchParams.get('topic'), 'infrastructure');
    const mail = new URL(await page.locator('.inquiry-email').getAttribute('href'));
    assert.equal(mail.pathname, 'yi__ai@126.com');
    assert(mail.searchParams.get('subject').includes(lang === 'zh' ? '基础设施' : 'Infrastructure'));
    assert(await page.locator('[data-topic-preparation="infrastructure"]').isVisible());
    assert.equal(await page.locator('[data-topic-preparation]:visible').count(), 1);
    await page.locator('.language-link').click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, `/${other}/`);
    assert.equal(new URL(page.url()).hash, '#inquiry');
    assert(await page.locator('input[value="infrastructure"]').isChecked());
    await page.goBack({ waitUntil: 'networkidle' });
    assert(await page.locator('input[value="infrastructure"]').isChecked());
    await page.reload({ waitUntil: 'networkidle' });
    assert(await page.locator('input[value="infrastructure"]').isChecked());
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error('denied');
          },
        },
      })
    );
    await page.locator('[data-copy]').click();
    await page.waitForFunction(() => document.querySelector('[data-contact-panel]').dataset.copyState === 'failure');
    assert.equal(await page.evaluate(() => getSelection().toString()), 'CCGAI008');
    assert(await page.locator('.copy-status').isVisible());
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.copiedTestText = text;
          },
        },
      })
    );
    await page.locator('[data-copy]').click();
    await page.waitForFunction(() => document.querySelector('[data-contact-panel]').dataset.copyState === 'success');
    assert.equal(await page.evaluate(() => window.copiedTestText), 'CCGAI008');
  }
  result.flows.push(
    'Six home service inquiries; inline topic/mail/preparation; language, Back and reload restoration; successful and denied clipboard'
  );

  for (const route of routes.filter((route) => route.kind === 'article')) {
    await page.goto(`${base}${route.path}`, { waitUntil: 'networkidle' });
    const toc = page.locator('.desktop-toc a').nth(1);
    await toc.click();
    await page.waitForTimeout(650);
    assert.equal(await toc.getAttribute('aria-current'), 'location');
    const current = decodeURIComponent(new URL(page.url()).hash.slice(1));
    const expected = await page
      .locator('[data-language-fragments]')
      .evaluate((el, id) => JSON.parse(el.dataset.languageFragments)[id], current);
    await page.locator('.language-link').click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, route.counterpart);
    assert.equal(decodeURIComponent(new URL(page.url()).hash.slice(1)), expected);
    assert(await page.locator(`[id="${expected}"]`).count());
    await page.goBack({ waitUntil: 'networkidle' });
    assert.equal(decodeURIComponent(new URL(page.url()).hash.slice(1)), current);
  }
  result.flows.push('All 12 translated article section links preserve meaning and restore on Back');
  for (const lang of ['zh', 'en'])
    for (const service of ['workbuddy', 'model-services', 'infrastructure']) {
      await page.goto(`${base}/${lang}/${service}/`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.service-contents a').count(), 6);
      assert(
        await page
          .locator('.header-cta')
          .getAttribute('href')
          .then((href) => href.endsWith(`topic=${service}`))
      );
      await page.locator('.service-contents a[href="#scope"]').click();
      await page.waitForTimeout(700);
      assert.equal(await page.locator('.service-contents a[href="#scope"]').getAttribute('aria-current'), 'location');
      await page.locator('.language-link').click();
      await page.waitForLoadState('networkidle');
      assert.equal(new URL(page.url()).hash, '#scope');
    }
  result.flows.push('Six service-page contents, persistent topic CTA and paired section fragments');
  return result;
}
