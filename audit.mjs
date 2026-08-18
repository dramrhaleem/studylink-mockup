/* Automated UI audit across every screen: contrast, touch targets, accessible
   names, overflow, and stray non-brand colours. */
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


const SCREENS = ['home','lectures','ambassador','profile','more','cart','checkout','order-success','tracking','my-orders','wallet','gifts','search','bundle','wishlist','notifications','chat','faq','about','tools','rate','achievements','otp','onboarding','register','library-harvard','library-berlin'];

const BRAND = new Set([
 '#EEF6FF','#DCE6F1','#C4CFDC','#A6B2C1','#8694A4','#677688','#495A6D','#304156','#13253A','#08192C','#000919',
 '#EDF6FF','#CFE8FF','#A4D4FF','#82B7E7','#5998CF','#17699F','#0A5C94','#00426F','#002D4E','#001A30','#1A70B0',
 '#4595D7','#327AB3',
 '#FBF9F4','#F2EEE3','#DAD7CF','#BEBAB1','#6B6860','#5A5852','#42403A','#2D2B27','#1B2C41',
 '#DCFFEB','#C6F1D8','#A9DCBF','#84C1A0','#59A47E','#28885D','#00734A','#006943','#004D30','#003520','#001F10','#4FD39A',
 '#FFF6CA','#FFEE9E','#FFE24B','#CAB129','#756500','#665800','#524600','#4B4000','#332B00','#1E1800',
 '#FFF3E7','#FFDEBD','#EFC59B','#D7A775','#BC854A','#A16515','#8A5300','#7D4A00','#5C3500','#402400',
 '#FFF1F1','#FFDAD9','#FFB9B7','#F59090','#DE686A','#C53D46','#B4122E','#A50828','#7C001A','#58000F',
 '#FFFFFF','#000000',
]);

const browser = await chromium.launch(launchOpts());
const page = await (await browser.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1, locale: 'ar-EG' })).newPage();

const AUDIT = String(fs.readFileSync(new URL('./audit-inpage.js', import.meta.url)));
const out = {};
for (const s of SCREENS) {
  await page.goto(`http://localhost:3000/?screen=${s}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1400);
  out[s] = await page.evaluate(({ src, brandList }) => {
    // eslint-disable-next-line no-new-func
    const fn = new Function(src + '\nreturn runAudit;')();
    return fn(brandList);
  }, { src: AUDIT, brandList: [...BRAND] });
}
await browser.close();
fs.writeFileSync('/tmp/audit.json', JSON.stringify(out, null, 1));

const agg = { contrast: [], touch: [], name: [], overflow: [], offBrand: new Map() };
for (const [scr, r] of Object.entries(out)) {
  r.contrast.forEach(x => agg.contrast.push({ scr, ...x }));
  r.touch.forEach(x => agg.touch.push({ scr, ...x }));
  r.name.forEach(x => agg.name.push({ scr, ...x }));
  r.overflow.forEach(x => agg.overflow.push({ scr, ...x }));
  r.offBrand.forEach(c => agg.offBrand.set(c, (agg.offBrand.get(c) || 0) + 1));
}
console.log('contrast failures :', agg.contrast.length);
console.log('touch < 44px      :', agg.touch.length);
console.log('unnamed controls  :', agg.name.length);
console.log('horizontal overflow:', agg.overflow.length);
console.log('off-brand colours :', agg.offBrand.size);
console.log('\n-- worst contrast --');
agg.contrast.sort((a,b)=>a.ratio-b.ratio).slice(0,15).forEach(x => console.log(`  ${x.ratio.toFixed(2)}  ${x.fg} on ${x.bg}  ${x.size}px  [${x.scr}] "${x.text}"`));
console.log('\n-- small touch targets --');
agg.touch.slice(0,12).forEach(x => console.log(`  ${x.w}x${x.h}  [${x.scr}] ${x.tag} "${x.text}"`));
console.log('\n-- unnamed controls --');
agg.name.slice(0,12).forEach(x => console.log(`  [${x.scr}] ${x.tag} ${x.cls}`));
console.log('\n-- overflow --');
agg.overflow.slice(0,10).forEach(x => console.log(`  [${x.scr}] ${x.tag} ${x.cls} w=${x.w}`));
console.log('\n-- off-brand colours --');
[...agg.offBrand.entries()].sort((a,b)=>b[1]-a[1]).slice(0,20).forEach(([c,n]) => console.log(`  ${c}  ×${n}`));
