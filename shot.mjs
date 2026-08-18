import { chromium } from 'playwright';
import fs from 'fs';

/* اختيار المتصفح: Playwright بيلاقي نسخته المحمّلة لوحده.
   لو البيئة فيها كروميوم في مكان مخصص، اضبط PW_CHROME.
   (كان المسار مثبّتًا على بيئة واحدة فيفشل السكريبت على أي جهاز آخر.) */
function launchOpts() {
  const exe = process.env.PW_CHROME
  return {
    ...(exe ? { executablePath: exe } : {}),
    args: ['--no-sandbox', '--font-render-hinting=none'],
  }
}


const OUT = process.argv[2] || '/tmp/shots/before';
const SCREENS = ['home','lectures','ambassador','profile','more','cart','checkout','order-success','tracking','my-orders','wallet','gifts','search','bundle','wishlist','notifications','chat','faq','about','tools','rate','achievements','otp','onboarding','register','library-harvard','library-berlin'];
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(launchOpts());
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2, locale: 'ar-EG' });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text().slice(0,300)}`); });
page.on('pageerror', e => errors.push(`[pageerror] ${String(e).slice(0,300)}`));

for (const s of SCREENS) {
  try {
    await page.goto(`http://localhost:3000/?screen=${s}`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(3600);
    const el = await page.$('.phone-frame');
    if (!el) { console.log(`!! no frame for ${s}`); continue; }
    await el.screenshot({ path: `${OUT}/${s}.png` });
    // also capture inner scroll full height
    const h = await page.evaluate(() => {
      const sc = document.querySelector('.phone-scroll');
      return sc ? { scrollH: sc.scrollHeight, clientH: sc.clientHeight } : null;
    });
    console.log(`ok ${s}  scroll=${h ? h.scrollH+'/'+h.clientH : 'n/a'}`);
  } catch (e) { console.log(`ERR ${s}: ${String(e).slice(0,160)}`); }
}
fs.writeFileSync(`${OUT}/_console.txt`, [...new Set(errors)].join('\n'));
await browser.close();
