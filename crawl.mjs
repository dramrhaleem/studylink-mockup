/* فحص سلوكي: كل شاشة، كل عنصر تفاعلي — أخطاء، أزرار بلا أثر، انتقالات. */
import { chromium } from 'playwright';
import fs from 'fs';
const opts = () => ({ ...(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {}), args:['--no-sandbox'] });
const SCREENS = ['home','lectures','ambassador','profile','more','cart','checkout','order-success','tracking','my-orders','wallet','gifts','search','bundle','wishlist','notifications','chat','faq','about','tools','rate','achievements','otp','onboarding','register','library-harvard','library-berlin'];
const SEL = '.phone-scroll button:not([disabled]), .phone-scroll a[href], .phone-scroll [role="tab"], .phone-scroll [role="switch"]';

const browser = await chromium.launch(opts());
const page = await (await browser.newContext({ viewport:{width:1400,height:1000}, locale:'ar-EG' })).newPage();
let errs = [];
page.on('pageerror', e => errs.push(String(e).slice(0,180)));
page.on('console', m => { if (m.type()==='error') errs.push('[c] '+m.text().slice(0,180)); });

const report = {};
for (const s of SCREENS) {
  const R = { count:0, errors:[], dead:[], moved:[] };
  const go = async () => { await page.goto(`http://localhost:3000/?screen=${s}`, {waitUntil:'domcontentloaded', timeout:30000}); await page.waitForTimeout(1800); };
  try {
    await go();
    const n = (await page.$$(SEL)).length;
    R.count = n;
    for (let i = 0; i < Math.min(n, 26); i++) {
      const els = await page.$$(SEL);
      const el = els[i]; if (!el) continue;
      const label = await el.evaluate(x => (x.getAttribute('aria-label')||x.innerText||'').trim().replace(/\s+/g,' ').slice(0,30)).catch(()=>null);
      if (label === null) continue;
      const sig = () => page.evaluate(() => {
        const sc = document.querySelector('.phone-scroll');
        return { len: sc?.innerHTML.length ?? 0, head: sc?.querySelector('h1,h2')?.textContent?.trim().slice(0,24) ?? '' };
      });
      const a = await sig(); const e0 = errs.length;
      try { await el.click({ timeout:1500 }); } catch { continue; }
      await page.waitForTimeout(420);
      const b = await sig();
      if (errs.length > e0) R.errors.push(`«${label}» → ${errs[e0]}`);
      else if (b.head !== a.head) { R.moved.push(`${label} → ${b.head}`); await go(); }
      else if (Math.abs(b.len - a.len) < 25) R.dead.push(label || '(بلا اسم)');
    }
  } catch (e) { R.errors.push('SCREEN '+String(e).slice(0,120)); }
  report[s] = R;
  console.log(`${s.padEnd(17)} n=${String(R.count).padStart(3)}  err=${R.errors.length}  dead=${R.dead.length}  nav=${R.moved.length}`);
}
fs.writeFileSync('/tmp/crawl.json', JSON.stringify(report,null,1));
await browser.close();
