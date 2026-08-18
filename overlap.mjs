/* يكشف تداخل العناصر: عنوان يمرّ تحت زر مطلق، أو نصّان متراكبان. */
import { chromium } from 'playwright'
const opts = () => ({ ...(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {}), args: ['--no-sandbox'] })
const SCREENS = ['home','lectures','ambassador','profile','more','cart','checkout','order-success','tracking','my-orders','wallet','gifts','search','bundle','wishlist','notifications','chat','faq','about','tools','rate','achievements','otp','onboarding','register','library-harvard','library-berlin']
const b = await chromium.launch(opts())
const p = await (await b.newContext({ viewport:{width:1400,height:1000}, locale:'ar-EG' })).newPage()
let total = 0
for (const s of SCREENS) {
  await p.goto(`http://localhost:3000/?screen=${s}`, { waitUntil:'domcontentloaded' })
  await p.waitForTimeout(1500)
  const hits = await p.evaluate(() => {
    const root = document.querySelector('.phone-scroll')?.closest('[class*="overflow-hidden"]') || document.body
    const texts = [...root.querySelectorAll('h1,h2,h3,p,span')].filter(e => {
      const t = (e.textContent||'').trim()
      if (!t || t.length < 2 || e.children.length) return false
      const r = e.getBoundingClientRect()
      return r.width > 8 && r.height > 6
    })
    const btns = [...root.querySelectorAll('button,a[href]')].filter(e => {
      const st = getComputedStyle(e)
      if (st.position !== 'absolute' && st.position !== 'fixed') return false
      if (st.opacity === '0' || st.visibility === 'hidden' || st.pointerEvents === 'none') return false
      const bg = st.backgroundColor
      return bg && bg !== 'rgba(0, 0, 0, 0)'   // زر له خلفية = يحجب فعلًا
    })
    const out = []
    for (const t of texts) {
      const a = t.getBoundingClientRect()
      for (const bn of btns) {
        if (bn.contains(t) || t.contains(bn)) continue
        const c = bn.getBoundingClientRect()
        const ox = Math.min(a.right, c.right) - Math.max(a.left, c.left)
        const oy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top)
        if (ox > 4 && oy > 4) {
          const za = +getComputedStyle(t).zIndex || 0
          const zb = +getComputedStyle(bn).zIndex || 0
          if (zb >= za) out.push({ text:(t.textContent||'').trim().slice(0,40), overlap:Math.round(ox)+'x'+Math.round(oy),
                                   btn:(bn.getAttribute('aria-label')||bn.textContent||'').trim().slice(0,24) })
        }
      }
    }
    return out
  })
  if (hits.length) { total += hits.length; console.log(`\n[${s}]`); hits.forEach(h => console.log(`   «${h.text}» تحت «${h.btn}» — ${h.overlap}px`)) }
}
console.log(`\nTOTAL overlaps: ${total}`)
await b.close()
