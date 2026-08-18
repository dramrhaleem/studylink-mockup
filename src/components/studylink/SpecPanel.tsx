'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCode2, X, AlertTriangle, CheckCircle2, Database, Layers, Ban } from 'lucide-react'
import { GLOBAL_SPEC, specFor } from '@/lib/spec'

/**
 * لوحة المواصفات — تظهر خارج إطار الهاتف، للمطوّر لا للمستخدم.
 *
 * سببها: الموك اب يُسلَّم لمطوّر لا يعرف قرارات المنتج، فكان يسأل المؤسس عن
 * كل تفصيلة. اللوحة تضع الإجابة بجانب الشاشة نفسها: الغرض · مصدر البيانات ·
 * القواعد الملزمة · الحالات · المؤجَّل · معايير القبول.
 */

function Bullets({
  items,
  icon: Icon,
  title,
  tone = 'neutral',
}: {
  items?: string[]
  icon: typeof Database
  title: string
  tone?: 'neutral' | 'warn' | 'good'
}) {
  if (!items || items.length === 0) return null
  const toneClass =
    tone === 'warn' ? 'text-warning' : tone === 'good' ? 'text-success' : 'text-sky-300'
  return (
    <section className="mt-4">
      <h4 className={`flex items-center gap-1.5 text-[12px] font-bold ${toneClass} mb-1.5`}>
        <Icon className="w-3.5 h-3.5" aria-hidden />
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-1.5 text-[12px] leading-relaxed text-white/75">
            <span aria-hidden className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-white/30" />
            <span className="min-w-0">{render(t)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** يحوّل `code` و**bold** إلى عناصر — لا مكتبة ماركداون لسطرين. */
function render(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) {
      return (
        <code
          key={i}
          dir="ltr"
          className="inline-block font-mono text-[11px] bg-white/10 text-sky-200 rounded px-1 py-px mx-0.5 align-middle"
        >
          {p.slice(1, -1)}
        </code>
      )
    }
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white">
          {p.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{p}</span>
  })
}

export default function SpecPanel({ screen }: { screen: string }) {
  const [open, setOpen] = useState(false)
  const [showGlobal, setShowGlobal] = useState(false)
  const spec = specFor(screen)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[12px] text-white/70 hover:text-white hover:border-white/25 transition-all duration-200 backdrop-blur-sm"
      >
        <FileCode2 className="w-3.5 h-3.5" aria-hidden />
        {open ? 'إخفاء المواصفات' : 'مواصفات للمطوّر'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[560px] mt-3 rounded-2xl bg-navy-950/70 border border-white/10 backdrop-blur-md overflow-hidden text-start"
          >
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10">
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-white truncate">
                  {spec ? spec.title : 'لا توجد مواصفة لهذه الشاشة'}
                </p>
                <p dir="ltr" className="text-[11px] font-mono text-white/40 truncate">
                  ?screen={screen}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق المواصفات"
                className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" aria-hidden />
              </button>
            </header>

            <div className="px-4 py-3 max-h-[460px] overflow-y-auto">
              {spec ? (
                <>
                  <p className="text-[12px] leading-relaxed text-white/85">{render(spec.purpose)}</p>
                  <Bullets items={spec.data} icon={Database} title="مصدر البيانات" />
                  <Bullets items={spec.rules} icon={Layers} title="قواعد ملزمة" />
                  <Bullets items={spec.states} icon={AlertTriangle} title="حالات يجب بناؤها" tone="warn" />
                  <Bullets items={spec.deferred} icon={Ban} title="مؤجَّل — لا يُبنى الآن" tone="warn" />
                  <Bullets items={spec.done} icon={CheckCircle2} title="معايير القبول" tone="good" />
                </>
              ) : (
                <p className="text-[12px] leading-relaxed text-white/60">
                  {render(
                    'أضف مواصفتها في `src/lib/spec.ts`. شاشة بلا مواصفة = سؤال جديد للمؤسس.'
                  )}
                </p>
              )}

              <div className="mt-5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowGlobal(v => !v)}
                  aria-expanded={showGlobal}
                  className="text-[12px] font-bold text-sky-300 hover:text-sky-200 transition-colors"
                >
                  {showGlobal ? '− ' : '+ '}
                  {GLOBAL_SPEC.title}
                </button>
                <AnimatePresence>
                  {showGlobal && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 mt-2 overflow-hidden"
                    >
                      {GLOBAL_SPEC.points.map((t, i) => (
                        <li key={i} className="flex gap-1.5 text-[12px] leading-relaxed text-white/75">
                          <span aria-hidden className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-white/30" />
                          <span className="min-w-0">{render(t)}</span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
