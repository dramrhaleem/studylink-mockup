/* يكشف «سرقة التمرير»: شاشة تعيد المستخدم لأعلى وحدها بلا أي تفاعل منه.
   عطل لا ينتج خطأً في الكونسول ولا يظهر في فحص التباين أو التخطيط، وقد وقع
   فعلًا: مؤقّت البانرات في الرئيسية كان ينادي `scrollIntoView` كل ٤ ثوانٍ،
   و`scrollIntoView` يمرّر كل الحاويات الأب لا الأفقية وحدها. */
import { chromium } from 'playwright'
const opts = () => ({ ...(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {}), args: ['--no-sandbox'] })
const SCREENS = process.argv.slice(2).length ? process.argv.slice(2)
  : ['home','lectures','ambassador','profile','more','cart','tracking','wallet','search','notifications','chat','library-harvard']
const WATCH_MS = Number(process.env.WATCH_MS || 12000)
const TOLERANCE = 8   // بكسل — لتموّج الالتصاق والحركات الصغيرة

const b = await chromium.launch(opts())
const p = await (await b.newContext({ viewport:{width:1400,height:1000}, locale:'ar-EG' })).newPage()
let bad = 0
for (const s of SCREENS) {
  await p.goto(`http://localhost:3000/?screen=${s}`, { waitUntil:'domcontentloaded', timeout:30000 })
  await p.waitForTimeout(2000)
  /* يُوسَم العنصر المختار مرة واحدة ثم يُقرأ بعينه.
     إعادة الاستعلام كل مرة تعطي إيجابيات كاذبة: قد تُركَّب حاوية تمرير أخرى
     (ورقة سفلية أو لوحة) فتصير هي الأولى في النتيجة، فنقيس عنصرًا مختلفًا. */
  const info = await p.evaluate(() => {
    const el = [...document.querySelectorAll('.phone-scroll, [class*="overflow-y-auto"]')]
      .filter(e => e.scrollHeight > e.clientHeight + 40)[0]
    if (!el) return null
    el.setAttribute('data-scrolljack-probe', '1')
    el.scrollTop = Math.min(600, el.scrollHeight - el.clientHeight)
    return { start: el.scrollTop, max: el.scrollHeight - el.clientHeight }
  })
  if (!info) { console.log(`  —    ${s} (لا حاوية تمرير)`); continue }
  // لا لمس ولا نقر — أي حركة بعد هذه اللحظة سرقة تمرير
  const samples = []
  const t0 = Date.now()
  while (Date.now() - t0 < WATCH_MS) {
    await p.waitForTimeout(1000)
    samples.push(await p.evaluate(() => {
      const el = document.querySelector('[data-scrolljack-probe]')
      return el ? Math.round(el.scrollTop) : -1
    }))
  }
  if (samples.includes(-1)) {
    console.log(`  ?    ${s.padEnd(18)} العنصر المُراقَب فُكّ تركيبه أثناء المراقبة — تُخطَّى`)
    continue
  }
  const drift = Math.max(...samples.map(v => Math.abs(v - info.start)))
  const ok = drift <= TOLERANCE
  if (!ok) bad++
  console.log(`${ok ? '✓' : '✗'} ${s.padEnd(18)} start=${Math.round(info.start)} drift=${drift}px  [${samples.join(', ')}]`)
}
console.log(bad === 0 ? '\nNO SCROLL JACKING' : `\n${bad} screen(s) scroll-jacking`)
await b.close()
process.exit(bad === 0 ? 0 : 1)
