/* فحص UI/UX ختامي: نص مقصوص · نص أصغر من الحد · شاشة بلا مخرج · حالة فارغة. */
import { chromium } from 'playwright'
const opts = () => ({ ...(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {}), args: ['--no-sandbox'] })
const SCREENS = ['home','lectures','ambassador','profile','more','cart','checkout','order-success','tracking','my-orders','wallet','gifts','search','bundle','wishlist','notifications','chat','faq','about','tools','rate','achievements','otp','onboarding','register','library-harvard','library-berlin']
const EMPTY = process.env.EMPTY === '1'

const b = await chromium.launch(opts())
const ctx = await b.newContext({ viewport:{width:1400,height:1000}, locale:'ar-EG' })
const p = await ctx.newPage()
const out = { clipped: [], tiny: [], noExit: [], blank: [], errors: [] }
p.on('pageerror', e => out.errors.push(String(e).slice(0,120)))

for (const s of SCREENS) {
  await p.goto(`http://localhost:3000/?screen=${s}`, { waitUntil:'domcontentloaded', timeout:30000 })
  if (EMPTY) { await p.evaluate(() => { try { localStorage.removeItem('studylink-store') } catch {} }); await p.reload({ waitUntil:'domcontentloaded' }) }
  await p.waitForTimeout(2200)
  const r = await p.evaluate(() => {
    const root = document.querySelector('.phone-scroll')?.closest('[class*="overflow-hidden"]') || document.body
    const vis = e => { const c = getComputedStyle(e); const r = e.getBoundingClientRect()
      return c.display!=='none' && c.visibility!=='hidden' && c.opacity!=='0' && r.width>0 && r.height>0 }
    const clipped = [], tiny = []
    for (const e of root.querySelectorAll('*')) {
      if (!vis(e)) continue
      const txt = [...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('').trim()
      if (!txt) continue
      const c = getComputedStyle(e)
      const fs = parseFloat(c.fontSize)
      if (fs && fs < 12) tiny.push({ fs: +fs.toFixed(1), txt: txt.slice(0,40), cls: (e.className||'').toString().slice(0,45) })
      const overflowsX = e.scrollWidth > e.clientWidth + 2
      const overflowsY = e.scrollHeight > e.clientHeight + 2
      const hidden = c.overflow === 'hidden' || c.overflowX === 'hidden' || c.overflowY === 'hidden'
      const clamps = c.webkitLineClamp && c.webkitLineClamp !== 'none'
      const ellipsis = c.textOverflow === 'ellipsis'
      if ((overflowsX || overflowsY) && hidden && !clamps && !ellipsis && c.whiteSpace !== 'nowrap') {
        clipped.push({ txt: txt.slice(0,45), cls: (e.className||'').toString().slice(0,45),
                       w: `${e.scrollWidth}/${e.clientWidth}`, h: `${e.scrollHeight}/${e.clientHeight}` })
      }
    }
    // مخرج: زر رجوع أو شريط تنقّل سفلي
    const hasNav = !!root.querySelector('nav, [role="tablist"]')
    const hasBack = [...root.querySelectorAll('button,a')].some(x => {
      const l = (x.getAttribute('aria-label')||'') + ' ' + (x.textContent||'')
      return /رجوع|back|إغلاق|السابق|الرئيسية/.test(l)
    })
    const textLen = (root.innerText||'').replace(/\s+/g,'').length
    return { clipped, tiny, hasNav, hasBack, textLen }
  })
  if (r.clipped.length) out.clipped.push([s, r.clipped])
  if (r.tiny.length) out.tiny.push([s, r.tiny])
  if (!r.hasNav && !r.hasBack) out.noExit.push(s)
  if (r.textLen < 60) out.blank.push([s, r.textLen])
}

const show = (title, rows) => {
  console.log(`\n=== ${title} (${rows.length}) ===`)
  for (const [s, items] of rows) {
    console.log(` [${s}]`)
    const seen = new Set()
    for (const it of (Array.isArray(items) ? items : [items])) {
      const k = JSON.stringify(it); if (seen.has(k)) continue; seen.add(k)
      console.log('   ', typeof it === 'object' ? Object.entries(it).map(([k,v])=>`${k}=${v}`).join('  ') : it)
    }
  }
}
show('نص مقصوص', out.clipped)
show('نص أصغر من 12px', out.tiny)
console.log(`\n=== شاشات بلا مخرج (${out.noExit.length}) ===\n `, out.noExit.join(', ') || '—')
console.log(`=== شاشات شبه فارغة (${out.blank.length}) ===\n `, out.blank.map(x=>x.join(':')).join(', ') || '—')
console.log(`=== أخطاء JS: ${out.errors.length} ===`, out.errors.slice(0,5).join(' | '))
await b.close()
