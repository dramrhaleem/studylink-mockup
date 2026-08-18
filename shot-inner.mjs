import { chromium } from 'playwright'
import fs from 'fs'
const OUT = '/tmp/shots/inner'
fs.mkdirSync(OUT, { recursive: true })
function launchOpts() {
  const exe = process.env.PW_CHROME
  return { ...(exe ? { executablePath: exe } : {}), args: ['--no-sandbox', '--font-render-hinting=none'] }
}
const jobs = JSON.parse(process.argv[2])   // [{screen, y}]
const b = await chromium.launch(launchOpts())
const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 })
for (const { screen, y, name } of jobs) {
  await p.goto(`http://localhost:3000/?screen=${screen}`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2500)
  await p.evaluate((yy) => {
    const els = [...document.querySelectorAll('.phone-scroll, [class*="overflow-y-auto"]')]
      .filter(e => e.scrollHeight > e.clientHeight + 20)
    if (els[0]) els[0].scrollTop = yy
  }, y)
  await p.waitForTimeout(900)
  const frame = await p.$('[class*="rounded-\\[3"], .phone-frame') || await p.$('main')
  await (frame || p).screenshot({ path: `${OUT}/${name || screen}-${y}.png` })
  console.log('ok', name || screen, y)
}
await b.close()
