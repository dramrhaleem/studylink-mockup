'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Headset } from 'lucide-react'
import { useStudylinkStore } from '@/lib/use-studylink-store'
import {
  ORDER_STAGES,
  activeOrder,
  demoStageIndex,
  stageIndexOf,
  stageProgressPercent,
} from '@/lib/order-status'

/**
 * شريط الطلب الجاري — يظهر أعلى الرئيسية طالما هناك طلب نشط.
 *
 * الغرض: الطالب الذي عنده طلب شغّال لا يجب أن يبحث عنه. الشريط يلاصق أعلى
 * منطقة التمرير فيبقى ظاهرًا وهو ينزل في الصفحة، ويعرض المرحلة الحالية وخطًا
 * زمنيًا يتقدّم، ومدخلين: التتبع الكامل، والتواصل مع الدعم.
 *
 * ⚠️ المرحلة هنا **مشتقّة من الزمن للمعاينة فقط** (`demoStageIndex`). في المنتج
 * تأتي من الباك-إند مع كل تحديث حالة — راجع التعليق في `src/lib/order-status.ts`.
 */
export default function ActiveOrderBar({
  onNavigate,
}: {
  onNavigate?: (screen: string) => void
}) {
  const orders = useStudylinkStore(s => s.orders)
  const order = activeOrder(orders)

  /* الوقت يُقرأ بعد التركيب فقط: قراءته أثناء الرسم تنتج اختلاف ترطيب
     (الخادم يرسم لحظة، والمتصفح لحظة أخرى). */
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    /* القراءة الأولى بعد التركيب إلزامية: `Date.now()` أثناء الرسم ينتج قيمة
       على الخادم وأخرى في المتصفح، فيفشل الترطيب. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(t)
  }, [])

  if (!order) return null

  /* المرحلة المخزّنة تُرسم فورًا، والمشتقّة من الزمن تحلّ محلها بعد التركيب.
     لو انتظرنا `now` لاختفى الشريط في أول إطار ثم ظهر، فيقفز ما تحته ١٣٧px —
     وهو ما رصده `npm run audit:scroll` فعلًا. */
  const idx = now === null ? stageIndexOf(order.status) : demoStageIndex(order, now)
  const stage = ORDER_STAGES[idx]
  const percent = stageProgressPercent(idx)
  const done = idx === ORDER_STAGES.length - 1

  return (
    <div className="sticky top-0 z-10 px-4 pt-3 pb-2 bg-brand-grey-100/95 backdrop-blur-sm">
      <div className="rounded-2xl bg-navy-800 text-white shadow-sm shadow-navy-800/20 overflow-hidden">
        <button
          data-tap="44"
          onClick={() => onNavigate?.('tracking')}
          className="w-full text-start px-3.5 pt-3 pb-2.5 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                done ? 'bg-success-on-dark/15' : 'bg-white/10'
              }`}
            >
              <stage.Icon
                className={`h-[18px] w-[18px] ${done ? 'text-success-on-dark' : 'text-amber-200'}`}
                aria-hidden
              />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-bold leading-tight truncate">{stage.label}</p>
                <span className="text-[12px] text-white/50 shrink-0">
                  طلب <span className="sl-num">{order.orderNumber}</span>
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-white/65 leading-relaxed truncate">{stage.hint}</p>
            </div>

            <ChevronLeft className="h-4 w-4 flex-shrink-0 text-white/40 rotate-180" aria-hidden />
          </div>

          {/* الخط الزمني — خمس محطات، الممتلئ منها يساوي المرحلة الحالية */}
          <div className="mt-3 flex items-center gap-1" aria-hidden>
            {ORDER_STAGES.map((s, i) => (
              <div key={s.key} className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${done ? 'bg-success-on-dark' : 'bg-amber-200'}`}
                  initial={false}
                  animate={{ width: i <= idx ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            ))}
          </div>
          <p className="sr-only">
            المرحلة <span className="sl-num">{idx + 1}</span> من{' '}
            <span className="sl-num">{ORDER_STAGES.length}</span> — {percent}%
          </p>
        </button>

        <div className="flex items-stretch border-t border-white/10">
          <button
            data-tap="44"
            onClick={() => onNavigate?.('tracking')}
            className="flex-1 py-2.5 text-[12px] font-bold text-white/85 active:bg-white/5 transition-colors"
          >
            تتبع الطلب
          </button>
          <span aria-hidden className="w-px bg-white/10" />
          <button
            data-tap="44"
            onClick={() => onNavigate?.('chat')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold text-white/85 active:bg-white/5 transition-colors"
          >
            <Headset className="h-3.5 w-3.5" aria-hidden />
            تواصل مع الدعم
          </button>
        </div>
      </div>
    </div>
  )
}
