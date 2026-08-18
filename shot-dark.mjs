import { chromium } from 'playwright';
import fs from 'fs';
const OUT = '/tmp/shots/dark';
const SCREENS = ['home','lectures','profile','cart','more','checkout','tracking','wallet'];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2, locale: 'ar-EG' })).newPage();
for (const s of SCREENS) {
  await page.goto(`http://localhost:3000/?screen=${s}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: 'تبديل الوضع الداكن' }).click();
  await page.waitForTimeout(900);
  const el = await page.$('.phone-frame');
  if (el) await el.screenshot({ path: `${OUT}/${s}.png` });
  console.log('ok', s);
}
await browser.close();
