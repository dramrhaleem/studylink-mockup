'use client'

import { Info } from 'lucide-react'
import {
  CURRENCY,
  EXAM_SEASON_NOTE,
  PRICING_FLAGS,
  serviceFeeNote,
  type OrderTotals,
  type PricedLine,
} from '@/lib/pricing'
import { serviceFeeByStore } from '@/lib/pricing'

interface PricingBreakdownProps {
  totals: OrderTotals
  deliveryOption: 'delivery' | 'pickup'
  /** أسطر السلة — تُمرَّر لعرض تفصيل رسم كل مكتبة في الطلب متعدد المكتبات. */
  lines?: PricedLine[]
  /** نبرة مدمجة داخل بطاقة أخرى بدل بطاقة مستقلة. */
  flush?: boolean
  className?: string
}

function Row({
  label,
  hint,
  value,
  tone = 'normal',
}: {
  label: string
  hint?: string
  value: string
  tone?: 'normal' | 'muted' | 'free'
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <span className="text-[13px] text-brand-grey-600 leading-relaxed">
        {label}
        {hint && <span className="block text-[12px] text-brand-grey-400 mt-0.5">{hint}</span>}
      </span>
      <span
        className={`sl-num text-[13px] font-semibold shrink-0 ${
          tone === 'free' ? 'text-success' : tone === 'muted' ? 'text-brand-grey-500' : 'text-navy-800'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

/**
 * بطاقة تفصيل الحساب — المكوّن المعتمد الوحيد.
 *
 * قبل هذا كانت كل شاشة تبني جدول الأسعار بنفسها وتحسب الرسوم محليًا، فاختلفت
 * القيم بين السلة والدفع والستور. كل الأرقام هنا تأتي من `computeOrderTotals`
 * في `lib/pricing.ts`، ولا يُشتق أي رقم داخل هذا المكوّن.
 *
 * التشريح من design_system_specification §5.D:
 * خلفية Grey-50 · حد Grey-200 · زاوية 12px · حشو 16px · الإجمالي Bold Navy-800.
 */
export default function PricingBreakdown({
  totals,
  deliveryOption,
  lines,
  flush = false,
  className = '',
}: PricingBreakdownProps) {
  const {
    subtotal,
    storeCount,
    serviceFee,
    fulfillmentFee,
    fulfillmentFeeBeforeOffer,
    total,
  } = totals

  const money = (n: number) => `${n} ${CURRENCY}`
  /* الطلب متعدد المكتبات يحمل رسم خدمة مستقلًا لكل مكتبة، فيُعرض مفصّلًا:
     رقم مجمّع بلا تفصيل يبدو للطالب كأنه رسم مضاعف بلا سبب. */
  const feeSplit = storeCount > 1 && lines?.length ? serviceFeeByStore(lines) : null
  const deliveryDiscounted = deliveryOption === 'delivery' && fulfillmentFee < fulfillmentFeeBeforeOffer

  return (
    <div
      className={[
        flush ? '' : 'bg-brand-grey-50 border border-brand-grey-200 rounded-xl p-4',
        className,
      ].join(' ')}
    >
      {!flush && (
        <h3 className="text-[14px] font-semibold text-navy-800 mb-1">تفاصيل الحساب</h3>
      )}
      {storeCount > 1 && (
        <p className="text-[12px] text-brand-grey-500 mb-1">
          طلبك من <span className="sl-num">{storeCount}</span> مكتبات — كل مكتبة ليها رسم خدمة مستقل، والتوصيل مرة واحدة.
        </p>
      )}

      <div className="divide-y divide-brand-grey-200/70">
        <Row label="سعر المنتجات الرسمي من المكتبة" value={money(subtotal)} />

        <Row
          label="رسوم خدمة StudyLink"
          hint={serviceFeeNote(subtotal, storeCount)}
          value={money(serviceFee)}
        />

        {feeSplit && (
          <div className="py-2 ps-3 space-y-1.5">
            {feeSplit.map(f => (
              <div key={f.store} className="flex items-center justify-between gap-3">
                <span className="text-[12px] text-brand-grey-500">مكتبة {f.store}</span>
                <span className="sl-num text-[12px] text-brand-grey-500">{f.fee} {CURRENCY}</span>
              </div>
            ))}
          </div>
        )}

        {deliveryOption === 'delivery' ? (
          <Row
            label="التوصيل"
            value={deliveryDiscounted ? 'مجاني' : money(fulfillmentFee)}
            tone={deliveryDiscounted ? 'free' : 'normal'}
          />
        ) : (
          <Row
            label="الاستلام من المكتبة"
            hint="مفيش رسم تنفيذ على الاستلام — رسوم الخدمة وقيمة المنتجات زي ما هي"
            value="0"
            tone="free"
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-1 border-t border-brand-grey-300/70">
        <span className="text-[15px] font-bold text-navy-800">الإجمالي النهائي</span>
        <span className="sl-num text-[17px] font-bold text-navy-800">{money(total)}</span>
      </div>

      {PRICING_FLAGS.examSeason && deliveryOption === 'delivery' && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-warning bg-white p-3">
          <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[12px] text-brand-grey-600 leading-relaxed">{EXAM_SEASON_NOTE}</p>
        </div>
      )}
    </div>
  )
}
