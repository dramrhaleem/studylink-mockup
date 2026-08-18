import { chromium } from 'playwright'
import fs from 'fs'
const OUT = process.argv[2] || '/tmp/shots/full'
const SCREENS = process.argv.slice(3)
fs.mkdirSync(OUT, { recursive: true })
function launchOpts() {
  const exe = process.env.PW_CHROME
  return { ...(exe ? { executablePath: exe } : {}), args: ['--no-sandbox', '--font-render-hinting=none'] }
}
const b = await chromium.launch(launchOpts())
const p = await b.newPage({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 })
for (const s of SCREENS) {
  await p.goto(`http://localhost:3000/?screen=${s}`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2200)
  const el = await p.$('.phone-scroll, [class*="overflow-y-auto"]')
  if (el) {
    const h = await el.evaluate(n => n.scrollHeight)
    await p.setViewportSize({ width: 420, height: Math.min(h + 200, 4000) })
    await p.waitForTimeout(800)
  }
  await p.screenshot({ path: `${OUT}/${s}.png`, fullPage: false })
  console.log('ok', s)
  await p.setViewportSize({ width: 420, height: 900 })
}
await b.close()
