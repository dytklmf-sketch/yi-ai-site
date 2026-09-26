import { mkdir, readFile } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';
const routes = JSON.parse(await readFile('dist/site-manifest.json', 'utf8'));

const dataURI = async (path, type) => `data:${type};base64,${(await readFile(path)).toString('base64')}`;
const fonts = {
  Manrope: await dataURI('public/fonts/manrope-latin.woff2', 'font/woff2'),
  Noto: await dataURI('public/fonts/noto-sans-sc-site.woff2', 'font/woff2'),
};
const logos = {};
for (const lang of ['zh', 'en']) {
  for (const suffix of ['', '-mono', '-inverse']) {
    const name = `logo-${lang}${suffix}`;
    logos[name] = await dataURI(`public/brand/${name}.svg`, 'image/svg+xml');
  }
}
for (const suffix of ['', '-small', '-mono', '-inverse']) {
  const name = `logo-symbol${suffix}`;
  logos[name] = await dataURI(`public/brand/${name}.svg`, 'image/svg+xml');
}
await mkdir('test-results', { recursive: true });
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 800 }, deviceScaleFactor: 1 });
  await page.setContent(
    '<style>body{margin:0}canvas{display:block}</style><canvas width="1600" height="800"></canvas>'
  );
  await page.evaluate(
    async ({ fonts, logos }) => {
      for (const [family, uri] of Object.entries(fonts)) {
        const face = new FontFace(family, `url(${uri})`, { weight: '200 800' });
        document.fonts.add(await face.load());
      }
      window.brandImages = {};
      for (const [name, uri] of Object.entries(logos)) {
        const image = new Image();
        image.src = uri;
        await image.decode();
        window.brandImages[name] = image;
      }
    },
    { fonts, logos }
  );

  // A raster brand composition, not a depiction of equipment.
  await page.evaluate(() => {
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.fillStyle = '#f3f6fc';
    ctx.fillRect(0, 0, 1600, 800);
    ctx.globalAlpha = 0.12;
    const symbol = window.brandImages['logo-symbol'];
    const width = 620;
    const height = (width * symbol.naturalHeight) / symbol.naturalWidth;
    ctx.drawImage(symbol, 930, (800 - height) / 2, width, height);
    ctx.globalAlpha = 1;
  });
  await page.locator('canvas').screenshot({ path: 'public/brand/hero-field.png' });

  await page.setViewportSize({ width: 1200, height: 630 });
  for (const route of routes) {
    const { lang, title } = route;
    const caption =
      lang === 'zh' ? '企业 AI 应用 / 模型服务 / 基础设施' : 'Enterprise AI / Model services / Infrastructure';
    await page.evaluate(
      ({ lang, title, caption }) => {
        const canvas = document.querySelector('canvas');
        canvas.width = 1200;
        canvas.height = 630;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f3f6fc';
        ctx.fillRect(0, 0, 1200, 630);
        ctx.fillStyle = '#245bdb';
        ctx.fillRect(1040, 0, 160, 630);
        const logo = window.brandImages[`logo-${lang}`];
        const aspect = logo.naturalWidth / logo.naturalHeight;
        ctx.drawImage(logo, 76, 70, aspect * 78, 78);
        ctx.fillStyle = '#20242c';
        ctx.font = '550 46px Manrope, Noto';
        const words = lang === 'zh' ? [...title] : title.split(' ');
        const lines = [];
        let line = '';
        for (const word of words) {
          const next = line + (lang === 'en' && line ? ' ' : '') + word;
          if (ctx.measureText(next).width > 880 && line) {
            lines.push(line);
            line = word;
          } else line = next;
        }
        if (line) lines.push(line);
        if (lines.length > 3) throw new Error(`Sharing headline too tall: ${title}`);
        lines.forEach((line, i) => {
          if (ctx.measureText(line).width > 890) throw new Error(`Sharing headline too wide: ${line}`);
          ctx.fillText(line, 76, 278 + i * 72);
        });
        ctx.fillStyle = '#59616f';
        ctx.font = '400 22px Manrope, Noto';
        if (ctx.measureText(caption).width > 890) throw new Error(`Sharing caption too wide: ${caption}`);
        ctx.fillText(caption, 76, 534);
      },
      { lang, title, caption }
    );
    await page.locator('canvas').screenshot({ path: `public${route.image}` });
  }

  for (const name of Object.keys(logos)) {
    const size = await page.evaluate((name) => {
      const logo = window.brandImages[name];
      return { width: Math.ceil((logo.naturalWidth / logo.naturalHeight) * 256), height: 256 };
    }, name);
    await page.setViewportSize(size);
    await page.evaluate(
      ({ name, size }) => {
        const canvas = document.querySelector('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        canvas.getContext('2d').drawImage(window.brandImages[name], 0, 0, size.width, size.height);
      },
      { name, size }
    );
    await page.locator('canvas').screenshot({ path: `public/brand/${name}.png`, omitBackground: true });
  }

  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fbfcfe';
    ctx.fillRect(0, 0, 1600, 1100);
    const text = (value, x, y, size = 16, color = '#59616f') => {
      ctx.fillStyle = color;
      ctx.font = `500 ${size}px Manrope, Noto`;
      ctx.fillText(value, x, y);
    };
    const logo = (name, x, y, height) => {
      const image = window.brandImages[name];
      ctx.drawImage(image, x, y, (image.naturalWidth / image.naturalHeight) * height, height);
    };
    text('Easy AI / 易AI', 80, 76, 20, '#245bdb');
    text('Direction A / EAI Whale', 1240, 76);
    logo('logo-en', 80, 180, 112);
    logo('logo-zh', 920, 184, 108);
    text('让 AI 易懂、易用、易落地。', 84, 355, 28, '#20242c');
    text('Understand AI. Use it. Put it to work.', 84, 402, 21);
    ctx.fillStyle = '#245bdb';
    ctx.fillRect(0, 478, 800, 310);
    logo('logo-en-inverse', 80, 567, 94);
    text('REVERSED', 80, 737, 13, '#e6efff');
    logo('logo-en-mono', 895, 567, 94);
    text('MONOCHROME', 895, 737, 13);
    logo('logo-symbol', 85, 880, 112);
    for (const [index, size] of [48, 32, 24, 16].entries()) {
      const x = 330 + index * 105;
      const symbol = window.brandImages[size <= 24 ? 'logo-symbol-small' : 'logo-symbol'];
      const height = (size * symbol.naturalHeight) / symbol.naturalWidth;
      ctx.drawImage(symbol, x, 944 - height / 2, size, height);
      text(`${size}px`, x, 1000, 13);
    }
    text('SMALL-SIZE MARK', 85, 1050, 13);
    for (const [index, color] of ['#245bdb', '#e6efff', '#20242c'].entries()) {
      ctx.fillStyle = color;
      ctx.fillRect(895 + index * 205, 866, 170, 105);
      text(color.toUpperCase(), 895 + index * 205, 1005, 15);
    }
    text('Manrope / Noto Sans SC', 895, 1050, 16);
  });
  await page.locator('canvas').screenshot({ path: 'test-results/easyai-logo-board.png' });
  console.log(`Generated hero, ${routes.length} sharing images, 10 transparent logo PNGs and whale A presentation.`);
} finally {
  await browser.close();
}
