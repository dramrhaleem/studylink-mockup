/* اختبار قواعد المال — يشتغل بلا إطار اختبار: `npm run test:pricing`
   كل حالة هنا مأخوذة من إفادة المؤسس المسجّلة (D-032 · D-035). */
import { execSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const out = mkdtempSync(join(tmpdir(), 'slx-pricing-'))
execSync(`npx tsc src/lib/pricing.ts --outDir ${out} --module esnext --target es2020 --moduleResolution bundler --skipLibCheck`, { stdio: 'inherit' })
const { serviceFeeFor, computeOrderTotals } = await import(join(out, 'pricing.js'))

const L = (store, price, quantity = 1) => ({ store, price, quantity })
const CASES = [
  ['مكتبة واحدة 88',            [L('هارفرد', 88)],                 8],
  ['50 هارفرد + 38 برلين',      [L('هارفرد', 50), L('برلين', 38)], 9],
  ['20 هارفرد + 40 برلين',      [L('هارفرد', 20), L('برلين', 40)], 7],
  ['135 هارفرد + 76 برلين',     [L('هارفرد', 135), L('برلين', 76)], 16],
  ['سلة 10 — الحد الأدنى',      [L('هارفرد', 10)],                 3],
  ['سلة فارغة',                 [],                                0],
  ['كمية 3×30',                 [L('هارفرد', 30, 3)],              8],
]

let bad = 0
for (const [name, lines, expect] of CASES) {
  const t = computeOrderTotals(lines, 'delivery')
  const ok = t.serviceFee === expect
  if (!ok) bad++
  console.log(`${ok ? '✓' : '✗'} ${name.padEnd(26)} fee=${t.serviceFee} (expect ${expect})`)
}
const pu = computeOrderTotals([L('هارفرد', 88)], 'pickup')
if (pu.fulfillmentFee !== 0) { bad++; console.log('✗ الاستلام يجب أن يكون بلا رسم تنفيذ') }
else if (pu.serviceFee !== 8) { bad++; console.log('✗ رسم الخدمة يظل مستحقًا في الاستلام') }
else console.log('✓ استلام: تنفيذ=0 · خدمة=8')

console.log('\nنقاط انكسار سلة المكتبة الواحدة:')
console.log('  ' + [0, 5, 25, 30, 35, 50, 75, 80, 500].map(v => `${v}→${serviceFeeFor(v)}`).join('  '))

if (bad) { console.error(`\n${bad} فشل`); process.exit(1) }
console.log('\nALL OK')
