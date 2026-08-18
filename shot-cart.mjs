/* Seeds a realistic two-bookstore cart, then shoots the money screens.
   The default mockup state is an empty cart, so the pricing card — the part
   most worth reviewing — is never visible in a plain screenshot run. */
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

const OUT = process.argv[2] || '/tmp/shots/cart';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(launchOpts());
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2, locale: 'ar-EG' });
const page = await ctx.newPage();

const seed = (items) => ({
  state: {
    user: { name: 'أحمد المنصور', phone: '01012345678', grade: 'الفرقة الأولى', college: 'كلية الطب', createdAt: '2026-08-01T00:00:00.000Z' },
    cart: items, orders: [], deliveryOption: 'delivery', selectedGrade: 'الفرقة الأولى',
    notifications: [], recentlyViewed: [],
  }, version: 2,
});

const mk = (id, title, store, price, quantity) => ({
  product: { id, title, store, category: 'محاضرات', price, available: true, doctor: 'د. نورهان السيد', subject: 'تشريح', pages: 48, paperSize: 'A4' },
  quantity,
});

const CASES = {
  'cart-small':  [mk('p1','تشريح - شرح نظري الأسبوع الأول','هارفرد',28,1)],
  'cart-mid':    [mk('p1','تشريح - أطلس تشريحي ملون','هارفرد',50,1), mk('p2','فسيولوجي - ورق عملي','برلين',38,1)],
  'cart-large':  [mk('p1','تشريح - أطلس تشريحي ملون','هارفرد',50,2), mk('p2','فسيولوجي - ورق عملي','برلين',38,2), mk('p3','باثولوجي - ملخص شامل','هارفرد',35,1)],
};

for (const [name, items] of Object.entries(CASES)) {
  await page.goto('http://localhost:3000/?screen=cart', { waitUntil: 'domcontentloaded' });
  await page.evaluate(s => localStorage.setItem('studylink-store', JSON.stringify(s)), seed(items));
  for (const screen of ['cart', 'checkout']) {
    await page.goto(`http://localhost:3000/?screen=${screen}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const sc = await page.$('.phone-scroll');
    if (sc) await page.evaluate(() => { const e = document.querySelector('.phone-scroll'); if (e) e.scrollTop = e.scrollHeight; });
    await page.waitForTimeout(700);
    const el = await page.$('.phone-frame');
    if (el) await el.screenshot({ path: `${OUT}/${name}-${screen}.png` });
    console.log('ok', name, screen);
  }
}
await browser.close();
