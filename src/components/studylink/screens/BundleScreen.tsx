'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { X, Check, Info, Sparkles, Plus, Minus, Package, BookMarked, FileText, Microscope, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { doctors, getSubjectsForGrade } from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface BundleScreenProps {
  onNavigate?: (screen: string) => void
}

type ContentType = 'شرح نظري' | 'أسئلة MCQs' | 'ورق عملي'

interface BundleItem {
  id: string
  title: string
  doctor: string
  subject: string
  price: number
  type: ContentType
}

interface ConfettiParticle {
  id: number
  x: number
  color: string
  size: number
  delay: number
}

const subjects = [
  { name: 'جراحة عامة', doctors: ['د. أحمد محمود', 'د. سارة حسن'] },
  { name: 'باطنة', doctors: ['د. محمد علي'] },
  { name: 'أطفال', doctors: ['د. فاطمة أحمد'] },
  { name: 'فسيولوجي', doctors: ['د. خالد إبراهيم'] },
]

const typeLabels: Record<ContentType, LucideIcon> = {
  'شرح نظري': BookMarked,
  'أسئلة MCQs': FileText,
  'ورق عملي': Microscope,
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: 'easeOut' as const },
  }),
}

const confettiColors = ['#1A70B0', '#007C50', '#FFE24B', '#9C5E00', '#13253A']

export default function BundleScreen({ onNavigate }: BundleScreenProps) {
  const addToCart = useStudylinkStore(s => s.addToCart)
  const selectedGrade = useStudylinkStore(s => s.selectedGrade)
  const prevSavingsRef = useRef(0)
  const [savingsBounce, setSavingsBounce] = useState(false)

  const [contentTypes, setContentTypes] = useState<Record<ContentType, boolean>>({
    'شرح نظري': true,
    'أسئلة MCQs': true,
    'ورق عملي': false,
  })

  const [selectedDoctors, setSelectedDoctors] = useState<Record<string, string>>({
    'جراحة عامة': 'د. أحمد محمود',
    'باطنة': 'د. محمد علي',
    'أطفال': 'د. فاطمة أحمد',
    'فسيولوجي': 'د. خالد إبراهيم',
  })

  const [bundleItems, setBundleItems] = useState<BundleItem[]>([])
  const [displayTotal, setDisplayTotal] = useState(0)
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([])

  const toggleContentType = (type: ContentType) => {
    setContentTypes(prev => ({ ...prev, [type]: !prev[type] }))
  }

  const addItemToBundle = (subjectName: string, doctorName: string, type: ContentType) => {
    const existing = bundleItems.find(
      i => i.subject === subjectName && i.doctor === doctorName && i.type === type
    )
    if (existing) {
      setBundleItems(prev => prev.filter(i => i.id !== existing.id))
      return
    }
    const prices: Record<ContentType, number> = { 'شرح نظري': 40, 'أسئلة MCQs': 25, 'ورق عملي': 30 }
    setBundleItems(prev => [
      ...prev,
      { id: `b-${Date.now()}`, title: `${subjectName} - ${type}`, doctor: doctorName, subject: subjectName, price: prices[type], type },
    ])
  }

  const removeItem = (id: string) => {
    setBundleItems(prev => prev.filter(item => item.id !== id))
  }

  // Computed values (declared before effects that use them)
  const subtotal = bundleItems.reduce((sum, item) => sum + item.price, 0)
  const serviceFee = bundleItems.length > 0 ? 5 : 0
  const deliveryFee = 25
  const storeCount = new Set(bundleItems.map(i => i.doctor)).size
  const multiStoreFee = storeCount > 1 ? 5 : 0
  const total = subtotal + serviceFee + deliveryFee + multiStoreFee
  const originalDelivery = 30
  const savings = originalDelivery - deliveryFee

  // Animated price counter
  useEffect(() => {
    const target = subtotal
    const start = displayTotal
    const diff = target - start
    if (diff === 0) return
    const duration = 400
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayTotal(Math.round(start + diff * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [subtotal, displayTotal])

  // Confetti effect when bundle is complete (5+ items)
  useEffect(() => {
    if (bundleItems.length === 5) {
      const particles: ConfettiParticle[] = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.5,
      }))
      /* جسيمات مؤقتة تُمسح بعد 2.5s — أثر عرضي محض لا حالة مشتقّة. */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfettiParticles(particles)
      const timer = setTimeout(() => setConfettiParticles([]), 2500)
      return () => clearTimeout(timer)
    }
  }, [bundleItems.length])

  // Savings bounce effect
  useEffect(() => {
    if (savings > prevSavingsRef.current && savings > 0) {
      setSavingsBounce(true)
      const timer = setTimeout(() => setSavingsBounce(false), 500)
      return () => clearTimeout(timer)
    }
    prevSavingsRef.current = savings
  }, [savings])

  const addAllToCart = useCallback(() => {
    bundleItems.forEach(item => addToCart({
      id: item.id,
      title: item.title,
      category: 'محاضرات',
      store: item.doctor.includes('أحمد') || item.doctor.includes('سارة') ? 'هارفرد' : 'برلين',
      doctor: item.doctor,
      subject: item.subject,
      price: item.price,
      pages: 40,
      paperSize: 'A4',
      available: true,
      originalPrice: undefined,
      specs: '',
    }))
    toast.success(`تمت إضافة ${bundleItems.length} مذكرة للسلة!`, {
      description: `إجمالي ${subtotal} ج.م`,
      duration: 3000,
      style: { direction: 'rtl', fontSize: '12px' },
    })
    onNavigate?.('cart')
  }, [bundleItems, addToCart, onNavigate, subtotal])

  const hasItems = bundleItems.length > 0

  return (
    <div className="screen-enter min-h-full bg-brand-grey-100 relative overflow-hidden">
      {/* Confetti particles */}
      {confettiParticles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confettiParticles.map(p => (
            <div
              key={p.id}
              className="confetti-particle absolute rounded-sm"
              style={{
                left: `${p.x}%`,
                top: '30%',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                animationDelay: `${p.delay}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}

      {/* Header with gradient background and bundle icon */}
      <div className="sticky top-0 z-30 px-4 pt-3 pb-5 relative overflow-hidden bg-gradient-to-l from-navy-800 via-navy-800 to-sky-900">
        {/* Decorative elements */}
        <div className="absolute -end-10 -top-10 w-32 h-32 rounded-full bg-sky-500/10 pointer-events-none" />
        <div className="absolute -start-6 -bottom-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        {/* Bundle icon illustration */}
        <div className="absolute end-4 top-2 opacity-10 pointer-events-none">
          <Package className="w-20 h-20 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <button data-tap="44" aria-label="إغلاق" onClick={() => onNavigate?.('home')} className="text-white/70">
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-300" />
              <h1 className="text-[15px] font-bold text-white">صانع الباقات</h1>
            </div>
            <div className="w-5" />
          </div>
          <p className="text-[13px] text-white/80 text-center">ماذا تريد أن تطلب هذا الأسبوع؟</p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="p-4 space-y-4 pb-28"
      >
        {/* Content Type Chips with checkmark on selected */}
        <motion.div variants={staggerItem} className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50">
          <h3 className="text-[13px] font-bold text-navy-800 mb-3">نوع المحتوى</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(contentTypes) as ContentType[]).map(type => {
              const isActive = contentTypes[type]
              const TypeIcon = typeLabels[type]
              return (
                <button data-tap="44" aria-label="تأكيد"
                  key={type}
                  onClick={() => toggleContentType(type)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all border ${
                    isActive
                      ? 'bg-sky-50 text-sky-600 border-sky-200 shadow-sm'
                      : 'bg-brand-grey-100 text-brand-grey-500 border-transparent'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[12px] transition-all ${
                    isActive ? 'bg-sky-500 text-white' : 'bg-brand-grey-300 text-white'
                  }`}>
                    {isActive ? <Check className="w-2.5 h-2.5" /> : <TypeIcon className="w-2.5 h-2.5" aria-hidden="true" />}
                  </span>
                  {type}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Subject Selection with checkmark on selected doctor chips */}
        <motion.div variants={cardVariants} custom={0} className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-navy-800">
              اختر المواد
              <span className="text-[12px] text-brand-grey-400 font-normal ms-2">(اختر واحدة على الأقل)</span>
            </h3>
          </div>
          {selectedGrade && (
            <p className="text-[12px] text-brand-grey-400 mt-1">
              مواد فرقة {selectedGrade} فقط
            </p>
          )}
          <div className="space-y-3 mt-3">
            {(selectedGrade ? subjects.filter(s => getSubjectsForGrade(selectedGrade).includes(s.name)) : subjects).map(subject => (
              <div key={subject.name}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full bg-sky-500" />
                  <h4 className="text-[13px] font-bold text-navy-800">{subject.name}</h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {subject.doctors.map(doc => {
                    const isSelected = selectedDoctors[subject.name] === doc
                    return (
                      <button data-tap="44" aria-label="تأكيد"
                        key={doc}
                        onClick={() => setSelectedDoctors(prev => ({ ...prev, [subject.name]: doc }))}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-navy-800 text-white shadow-sm'
                            : 'bg-brand-grey-100 text-brand-grey-600 hover:bg-brand-grey-200'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                        {doc}
                      </button>
                    )
                  })}
                  <button data-tap="44" aria-label="زيادة"
                    onClick={() => addItemToBundle(subject.name, selectedDoctors[subject.name], 'شرح نظري')}
                    className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-100 transition-colors tap-44"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content Type Adder */}
        <motion.div variants={cardVariants} custom={1} className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50">
          <h3 className="text-[13px] font-bold text-navy-800 mb-3">أضف محتوى</h3>
          <div className="space-y-2">
            {(Object.keys(contentTypes) as ContentType[])
              .filter(t => contentTypes[t])
              .map(type => {
                const TypeIcon = typeLabels[type]
                return (
                  <button data-tap="44" aria-label="زيادة"
                    key={type}
                    onClick={() => {
                      const activeSubjects = subjects.filter(s => selectedDoctors[s.name])
                      if (activeSubjects.length > 0) {
                        addItemToBundle(activeSubjects[0].name, selectedDoctors[activeSubjects[0].name], type)
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-brand-grey-50 hover:bg-brand-grey-100 transition-colors active:scale-[0.98] border border-brand-grey-200/50"
                  >
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-4 h-4 text-brand-grey-500" aria-hidden="true" />
                      <span className="text-[13px] font-semibold text-navy-800">{type}</span>
                    </div>
                    <Plus className="w-5 h-5 text-sky-500" />
                  </button>
                )
              })}
          </div>
        </motion.div>

        {/* Selected Items */}
        {hasItems && (
          <motion.div variants={cardVariants} custom={2} className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-navy-800">المذكرات المختارة</h3>
              <span className="text-[12px] text-sky-500 font-semibold bg-sky-50 px-2 py-0.5 rounded-full">
                {bundleItems.length} مذكرة
              </span>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto phone-scroll">
              <AnimatePresence mode="popLayout">
                {bundleItems.map(item => {
                  const TypeIcon = typeLabels[item.type]
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between py-2 border-b border-brand-grey-100 last:border-0"
                    >
                      <div className="flex-1 me-3 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-sky-50 text-sky-700 rounded">
                            <TypeIcon className="w-3 h-3" aria-hidden="true" />
                          </span>
                          <span className="text-[11px] bg-brand-grey-100 text-brand-grey-600 px-1.5 py-0.5 rounded">
                            {item.subject}
                          </span>
                        </div>
                        <p className="text-[13px] font-medium text-brand-grey-900">{item.title}</p>
                        <p className="text-[12px] text-brand-grey-500">{item.doctor} · {item.subject}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[13px] font-bold text-navy-800 sl-num">{item.price} ج.م</span>
                        <button data-tap="44" aria-label="إغلاق"
                          onClick={() => removeItem(item.id)}
                          className="w-6 h-6 rounded-full bg-error-bg text-error flex items-center justify-center tap-44"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!hasItems && (
          <motion.div variants={staggerItem} className="bg-white rounded-2xl p-6 shadow-sm border border-brand-grey-200/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-grey-100 flex items-center justify-center mx-auto mb-3">
              <Package className="w-7 h-7 text-brand-grey-400" aria-hidden="true" />
            </div>
            <p className="text-[13px] font-semibold text-brand-grey-700 mb-1">لم تختر مذكرات بعد</p>
            <p className="text-[12px] text-brand-grey-400">اختر المواد والمحتوى من الأعلى</p>
          </motion.div>
        )}

        {/* Pricing Breakdown with animated price counter */}
        {hasItems && (
          <motion.div variants={cardVariants} custom={3} className="bg-white/70 rounded-2xl p-4 border border-brand-grey-200/30">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-brand-grey-900">
                  سعر المذكرات ({bundleItems.length} مذكرات)
                </span>
                <span className="text-[13px] font-semibold text-brand-grey-900 sl-num count-glow">
                  {displayTotal} ج.م
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[13px] text-brand-grey-500">رسوم تشغيل المنصة</span>
                  <Info className="w-3 h-3 text-brand-grey-400" />
                </div>
                <span className="text-[13px] font-semibold text-brand-grey-900 sl-num">{serviceFee} ج.م</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[13px] text-brand-grey-900">تكلفة التوصيل السريع للمنصورة</span>
                <span className="text-[13px] font-semibold text-brand-grey-900 sl-num">{deliveryFee} ج.م</span>
              </div>

              {/* Savings with bounce badge */}
              <motion.div
                className={`flex items-center gap-1 bg-success-bg rounded-lg px-3 py-2 ${savingsBounce ? 'badge-bounce' : ''}`}
                key={bundleItems.length}
              >
                <span className="text-[12px] text-success font-medium">
                  وفرت {savings} جنيه مع StudyLink! (كان {originalDelivery} ج.م)
                </span>
              </motion.div>

              {storeCount > 1 && (
                <div className="flex items-center gap-1">
                  <span className="text-[12px] text-brand-grey-600">الشراء من {storeCount} مكتبات +{multiStoreFee} ج.م</span>
                  <Info className="w-3 h-3 text-brand-grey-400" />
                </div>
              )}

              <div className="border-t border-brand-grey-200/50" />
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-navy-800">الإجمالي</span>
                <span className="text-[16px] font-bold text-navy-800 sl-num count-glow">{total} ج.م</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white border-t border-brand-grey-200/50 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={addAllToCart}
          disabled={!hasItems}
          className="w-full h-12 bg-sky-500 disabled:opacity-40 text-white text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 disabled:shadow-none transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>أضف باقة الأسبوع للسلة</span>
          {hasItems && (
            <span className="text-white/80">— <span className="sl-num">{bundleItems.length}</span> مذكرات بـ <span className="sl-num">{total}</span> جنيهاً</span>
          )}
        </motion.button>
      </div>
    </div>
  )
}