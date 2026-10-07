import { launchBrowser } from './scripts/browser.mjs';
const b = await launchBrowser();
const p = await (await b.newContext({ viewport: { width: 1000, height: 700 } })).newPage();
await p.goto(`file:///tmp/logo3/${process.argv[2] || 'sheet'}.html`);
await p.waitForTimeout(300);
await p.screenshot({ path: `/tmp/logo3/${process.argv[2] || 'sheet'}.png`, fullPage: true });
await b.close();
