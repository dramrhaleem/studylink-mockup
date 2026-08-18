'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { computeOrderTotals } from '@/lib/pricing'
import {
  Check,
  CheckCircle2,
  Truck,
  Phone,
  Package,
  MapPin,
  Clock,
  CircleCheckBig,
  CircleDashed,
  CircleDot,
  Receipt,
  ChevronDown,
  ChevronUp,
  Wallet,
  Home,
  RotateCcw,
} from 'lucide-react'

/* ──────────────────────────── types ──────────────────────────── */

interface OrderSuccessScreenProps {
  onNavigate?: (screen: string) => void
}

type OrderType = 'delivery' | 'pickup'
type LibraryStage = 'accepted' | 'preparing' | 'dispatched' | 'delivered'

interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
  library: string
}

interface LibraryTrack {
  name: string
  stage: LibraryStage
}

/* ──────────────────────────── mock data ──────────────────────── */

const ORDER_NUMBER = '#15649'
const ORDER_TYPE: OrderType = 'delivery'
const PAYMENT_METHOD = 'محفظة StudyLink'

const LIBRARIES: LibraryTrack[] = [
  { name: 'هارفرد', stage: 'dispatched' },
  { name: 'برلين', stage: 'preparing' },
]

const DELIVERY_STAGES: { key: LibraryStage; label: string; icon: React.ReactNode }[] = [
  { key: 'accepted', label: 'تم القبول', icon: <CircleCheckBig className="w-4 h-4" /> },
  { key: 'preparing', label: 'جاري التجهيز', icon: <CircleDashed className="w-4 h-4" /> },
  { key: 'dispatched', label: 'مع المندوب', icon: <Truck className="w-4 h-4" /> },
  { key: 'delivered', label: 'تم التوصيل', icon: <CircleDot className="w-4 h-4" /> },
]

const PICKUP_STAGES: { key: LibraryStage; label: string; icon: React.ReactNode }[] = [
  { key: 'accepted', label: 'تم القبول', icon: <CircleCheckBig className="w-4 h-4" /> },
  { key: 'preparing', label: 'جاري التجهيز', icon: <CircleDashed className="w-4 h-4" /> },
  { key: 'dispatched', label: 'جاهز للتسليم', icon: <Package className="w-4 h-4" /> },
  { key: 'delivered', label: 'تم الاستلام', icon: <CircleDot className="w-4 h-4" /> },
]

/* كان `PriceRow` و`ContextualCTA` معرَّفين **داخل** جسم المكوّن، فيُنشأ نوعٌ
   جديد منهما في كل رسم؛ React تفكّك الشجرة وتعيد تركيبها بدل تحديثها، فتضيع
   حالة العناصر الداخلية وتتكرّر حركات الدخول. رُفعا لأعلى الملف. */
function PriceRow({
  label,
  value,
  subtext,
  className = '',
  valueColor = '',
}: {
  label: string
  value: string
  subtext?: string
  className?: string
  valueColor?: string
}) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div>
        <span className="text-[13px] text-brand-grey-500">{label}</span>
        {subtext && (
          <span className="text-[12px] text-success ms-1 font-medium">{subtext}</span>
        )}
      </div>
      <span className={`text-[13px] font-semibold sl-num ${valueColor || 'text-navy-800'}`}>
        {value}
      </span>
    </div>
  )
}

function ContextualCTA({
  status,
  onNavigate,
}: {
  status: string
  onNavigate?: (screen: string) => void
}) {
  if (status === 'preparing') {
    return (
      <button
        type="button"
        onClick={() => onNavigate?.('my-orders')}
        className="w-full h-12 flex items-center justify-center gap-2 bg-navy-800 text-white rounded-xl text-[14px] font-semibold hover:bg-navy-700 active:bg-navy-900 transition-colors"
      >
        <Receipt className="w-4 h-4" aria-hidden="true" />
        تفاصيل الطلب
      </button>
    )
  }

  if (status === 'dispatched') {
    return (
      <a
        href="tel:+201234567890"
        className="w-full h-12 flex items-center justify-center gap-2 bg-success text-white rounded-xl text-[14px] font-semibold transition-opacity hover:opacity-90"
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
        اتصل بالمندوب
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onNavigate?.('home')}
      className="w-full h-12 flex items-center justify-center gap-2 bg-navy-800 text-white rounded-xl text-[14px] font-semibold hover:bg-navy-700 active:bg-navy-900 transition-colors"
    >
      <Home className="w-4 h-4" aria-hidden="true" />
      الرجوع للرئيسية
    </button>
  )
}

const ORDER_ITEMS: OrderItem[] = [
  { id: 1, name: 'محاضرات تشريح - د.أحمد محمود', quantity: 1, price: 60, library: 'هارفرد' },
  { id: 2, name: 'معطف أبيض مقاس M', quantity: 1, price: 55, library: 'برلين' },
  { id: 3, name: 'أقلام ملونة + ملاحظات فسيولوجي', quantity: 2, price: 35, library: 'هارفرد' },
]

const LOCATION = 'شارع الجامعة، المدينة'
const ETA = '10:30 مساءً — اليوم'
const UNDO_DURATION = 5 // seconds

/* إجماليات هذا الطلب النموذجي محسوبة من نفس المحرّك الذي تستخدمه السلة
   والدفع، فلا يمكن أن تختلف الأرقام بين الشاشات مرة أخرى. */
const orderTotals = computeOrderTotals(
  ORDER_ITEMS.map(i => ({ price: i.price, quantity: i.quantity, store: i.library })),
  'delivery'
)

/* ──────────────────────────── helpers ────────────────────────── */

function getStageIndex(stage: LibraryStage): number {
  return ['accepted', 'preparing', 'dispatched', 'delivered'].indexOf(stage)
}

function getOverallStatus(libraries: LibraryTrack[]): LibraryStage {
  const minStage = Math.min(...libraries.map((l) => getStageIndex(l.stage)))
  return ['accepted', 'preparing', 'dispatched', 'delivered'][minStage] as LibraryStage
}

/* ──────────────────────────── component ──────────────────────── */

export default function OrderSuccessScreen({ onNavigate }: OrderSuccessScreenProps) {
  const [showUndo, setShowUndo] = useState(true)
  const [progress, setProgress] = useState(100)
  const [canCancel, setCanCancel] = useState(true)
  const [itemsExpanded, setItemsExpanded] = useState(true)
  const [overallStatus] = useState<LibraryStage>(getOverallStatus(LIBRARIES))

  const stages = ORDER_TYPE === 'delivery' ? DELIVERY_STAGES : PICKUP_STAGES

  /* --- 5-second undo countdown --- */
  useEffect(() => {
    const interval = 100
    const totalSteps = (UNDO_DURATION * 1000) / interval
    let step = 0

    const timer = setInterval(() => {
      step++
      setProgress(Math.max(0, 100 - (step / totalSteps) * 100))
      if (step >= totalSteps) {
        clearInterval(timer)
        setShowUndo(false)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  /* --- Cancel handler --- */
  const handleCancel = useCallback(() => {
    if (!canCancel) return
    onNavigate?.('home')
  }, [canCancel, onNavigate])

  /* --- Determine if any library has moved past accepted --- */
  useEffect(() => {
    const hasMoved = LIBRARIES.some((l) => getStageIndex(l.stage) >= 1)
    if (hasMoved) setCanCancel(false)
  }, [])

  /* ──────────────── sub-components ──────────────── */

  /* ---------- Timeline ---------- */
  const TimelineTrack = ({ library }: { library: LibraryTrack }) => {
    const currentIdx = getStageIndex(library.stage)

    return (
      <div className="mb-5 last:mb-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[13px] font-semibold text-white/90">{library.name}</span>
          {library.stage === 'delivered' && (
            <span className="text-[12px] bg-[color:var(--color-success-on-dark)]/20 text-[color:var(--color-success-on-dark)] px-2 py-0.5 rounded-full font-medium">
              مكتمل
            </span>
          )}
        </div>

        <div className="flex items-center justify-between relative">
          <div className="absolute top-[11px] left-5 right-5 h-[3px] bg-white/10 rounded-full" />
          <motion.div
            className="absolute top-[11px] left-5 h-[3px] bg-success rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIdx / (stages.length - 1)) * 90}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          />

          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentIdx

            return (
              <div key={stage.key} className="relative flex flex-col items-center z-10 flex-1">
                <motion.div
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs ${
                    isCompleted ? 'bg-success text-white' : 'bg-white/10 text-white/30'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.12, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {isCompleted
                    ? <Check className="w-4 h-4 text-[color:var(--color-success-on-dark)]" aria-hidden="true" />
                    : <Clock className="w-4 h-4 text-white/50" aria-hidden="true" />}
                </motion.div>

                <span
                  className={`text-[12px] mt-1.5 text-center leading-tight max-w-[65px] ${
                    isCompleted ? 'text-[color:var(--color-success-on-dark)]' : 'text-white/60'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ──────────────── main render ──────────────── */
  return (
    <div className="min-h-full flex flex-col bg-brand-grey-100 relative">
      {/* ═══════ 1. Header ═══════ */}
      <div className="bg-white px-4 pt-3 pb-3 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <button data-tap="44" aria-label="إعادة"
            onClick={() => onNavigate?.('home')}
            className="w-10 h-10 rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-95 transition-transform tap-44"
          >
            <RotateCcw className="w-4 h-4 text-navy-800" />
          </button>
          <h1 className="text-[16px] font-bold text-navy-800">تفاصيل الطلب</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* ═══════ 2. Success Banner ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-success/10 border-b border-success/20 flex-shrink-0"
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          >
            <CheckCircle2 className="w-7 h-7 text-success" />
          </motion.div>
          <div>
            <p className="text-[14px] font-bold text-success leading-tight">
              استلمنا طلبك بنجاح!
            </p>
            <p className="text-[12px] text-brand-grey-500 leading-relaxed mt-0.5">
              في أسرع وقت أوردرك هيبقى جاهز.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ═══════ 3. Scrollable Content ═══════ */}
      <div className="flex-1 overflow-y-auto phone-scroll pb-16">
        <div className="px-4 pt-3 space-y-3">
          {/* ═══════ 3a. ORDER TIMELINE ═══════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="bg-navy-800 rounded-2xl p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/60" />
                <span className="text-[13px] text-white/70 font-medium">تتبع الطلب</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[12px] text-amber-300 font-medium">
                  الوصول المتوقع: {ETA}
                </span>
              </div>
            </div>

            {/* Library tracks */}
            {LIBRARIES.map((lib, i) => (
              <motion.div
                key={lib.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              >
                {i > 0 && <div className="border-t border-white/10 my-3" />}
                <TimelineTrack library={lib} />
              </motion.div>
            ))}
          </motion.div>

          {/* ═══════ 3b. ORDER DETAILS CARD ═══════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="bg-white rounded-2xl shadow-sm border border-brand-grey-200/50 overflow-hidden"
          >
            {/* Card header */}
            <div className="px-4 pt-4 pb-2.5 flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-navy-800">تفاصيل الطلب</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px] text-brand-grey-400 sl-num">
                    رقم الطلب: {ORDER_NUMBER}
                  </span>
                  <span className="text-brand-grey-400">|</span>
                  <span className="text-[12px] text-brand-grey-500">
                    {ORDER_TYPE === 'delivery' ? '🚚 توصيل' : '📦 استلام'}
                  </span>
                </div>
              </div>
              <div className="bg-sky-50 text-sky-600 text-[12px] font-semibold px-3 py-1 rounded-full">
                {stages[getStageIndex(overallStatus)]?.label}
              </div>
            </div>

            <div className="mx-4 border-t border-brand-grey-100" />

            {/* Info rows */}
            <div className="px-4 py-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-brand-grey-400" />
                  <span className="text-[13px] text-brand-grey-500">طريقة الدفع</span>
                </div>
                <span className="text-[13px] font-semibold text-navy-800">{PAYMENT_METHOD}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-grey-400" />
                  <span className="text-[13px] text-brand-grey-500">
                    {ORDER_TYPE === 'delivery' ? 'عنوان التوصيل' : 'مكان الاستلام'}
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-navy-800 max-w-[160px] text-left leading-tight" dir="ltr">
                  {LOCATION}
                </span>
              </div>
            </div>

            <div className="mx-4 border-t border-brand-grey-100" />

            {/* Products section */}
            <div className="px-4 py-3">
              <button data-tap="44"
                onClick={() => setItemsExpanded(!itemsExpanded)}
                className="w-full flex items-center justify-between"
              >
                <span className="text-[13px] font-bold text-navy-800">المنتجات ({ORDER_ITEMS.length})</span>
                {itemsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-brand-grey-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brand-grey-400" />
                )}
              </button>

              <AnimatePresence>
                {itemsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2.5 space-y-2.5 max-h-48 overflow-y-auto">
                      {ORDER_ITEMS.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * idx }}
                          className="flex items-center gap-2.5"
                        >
                          <div className="w-11 h-11 rounded-xl bg-brand-grey-100 flex-shrink-0 flex items-center justify-center text-lg">
                            {item.library === 'هارفرد' ? '📚' : '📖'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-navy-900 truncate">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[12px] text-brand-grey-400 bg-brand-grey-50 px-1.5 py-0.5 rounded">
                                {item.library}
                              </span>
                              <span className="text-[12px] text-brand-grey-400 sl-num">×{item.quantity}</span>
                            </div>
                          </div>
                          <span className="text-[13px] font-bold text-navy-800 sl-num flex-shrink-0">
                            {item.price * item.quantity} ج.م
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mx-4 border-t border-brand-grey-100" />

            {/* Price breakdown */}
            <div className="px-4 py-3 space-y-2">
              <PriceRow
                label="المنتجات"
                value={`${orderTotals.subtotal} ج.م`}
              />
              {/* كانت البنود مكتوبة يدويًا: توصيل 25 «وفرت 5 جنية» (بخطأ إملائي
                  وادعاء توفير لا مصدر له)، وخدمة 5، و«رسوم متعدد المكتبات» 5
                  كبند ثالث، وإجمالي 185 مكتوب نصًّا لا يساوي مجموع ما فوقه.
                  كلها الآن مشتقة من `computeOrderTotals`. */}
              <PriceRow
                label="رسوم خدمة StudyLink"
                value={`${orderTotals.serviceFee} ج.م`}
              />
              <PriceRow label="التوصيل" value={`${orderTotals.fulfillmentFee} ج.م`} />

              <div className="border-t border-dashed border-brand-grey-200 my-1" />

              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-navy-800">الإجمالي</span>
                <span className="text-[16px] font-bold text-navy-800 sl-num">
                  {orderTotals.total} ج.م
                </span>
              </div>
            </div>

            <div className="mx-4 border-t border-brand-grey-100" />

            {/* CTA */}
            <div className="px-4 py-3">
              <ContextualCTA status={overallStatus} onNavigate={onNavigate} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════ 4. UNDO BAR ═══════ */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 z-50"
          >
            {/* Red progress track */}
            <div className="h-1 bg-red-200 w-full">
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* Undo content */}
            <div className="bg-red-500 px-4 py-3">
              <div className="flex items-center justify-between">
                <button data-tap="44"
                  onClick={handleCancel}
                  disabled={!canCancel}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                    canCancel
                      ? 'bg-white text-red-600 active:scale-95'
                      : 'bg-white/20 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  إلغاء الطلب
                </button>

                <div className="flex items-center gap-2">
                  {!canCancel && (
                    <span className="text-[12px] text-white/70">
                      الطلب قيد التجهيز
                    </span>
                  )}
                  {canCancel && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold bg-white/20 text-white sl-num">
                      {Math.ceil((progress / 100) * UNDO_DURATION)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}