'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronDown, ChevronUp, ChevronLeft,
  ShoppingCart, Clock, Check, AlertCircle, Trash2,
  Package, BookOpen, RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import {
  type Product, type ContentType, type StoreType, type GradeType,
  ALL_CONTENT_TYPES, CONTENT_TYPE_ICONS, getSubjectsForGrade, products
} from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface BundleBuilderSheetProps {
  isOpen: boolean
  onClose: () => void
  store: StoreType
  grade: GradeType
}

interface BundleItem {
  product: Product
  contentType: ContentType
  removed: boolean
}

interface ContentTypeGroup {
  type: ContentType
  items: BundleItem[]
  activeCount: number
  totalPrice: number
}

interface SubjectGroup {
  subject: string
  doctors: string[]
  selectedDoctor: string | null
  contentGroups: ContentTypeGroup[]
  hasMissing: boolean
  totalActiveCount: number
  totalPrice: number
}

const DEFAULT_FILTERS: ContentType[] = ['شرح نظري', 'أسئلة MCQs', 'ورق عملي']

const WEEKS = [
  { value: 0, label: 'الكل' },
  { value: 1, label: 'الأسبوع 1' },
  { value: 2, label: 'الأسبوع 2' },
  { value: 3, label: 'الأسبوع 3' },
]

/**
 * Deterministic pattern: certain store+grade+week combos have no lectures.
 * Key format: "store|grade|week"
 */
const UNAVAILABLE_WEEKS: Record<string, boolean> = {
  'هارفرد|الفرقة الأولى|2': true,
  'برلين|الفرقة الثانية|3': true,
  'هارفرد|الفرقة الثالثة|1': true,
}

export default function BundleBuilderSheet({ isOpen, onClose, store, grade }: BundleBuilderSheetProps) {
  const [filters, setFilters] = useState<ContentType[]>(DEFAULT_FILTERS)
  const [activeWeek, setActiveWeek] = useState(0)
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())
  const [expandedCTs, setExpandedCTs] = useState<Set<string>>(new Set())
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set())
  const [removedSubjects, setRemovedSubjects] = useState<Set<string>>(new Set())
  const [removedCTs, setRemovedCTs] = useState<Set<string>>(new Set())
  const [selectedDoctors, setSelectedDoctors] = useState<Record<string, string>>({})

  const addToCart = useStudylinkStore(s => s.addToCart)
  const filtersLoaded = useRef(false)

  useEffect(() => {
    if (filtersLoaded.current) return
    filtersLoaded.current = true
    try {
      const saved = localStorage.getItem('studylink-bundle-filters')
      if (saved) {
        const parsed = JSON.parse(saved) as ContentType[]
        /* قراءة `localStorage` لا تجوز أثناء الرسم — لا وجود لها على الخادم. */
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed) && parsed.length > 0) setFilters(parsed)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (!filtersLoaded.current) return
    try { localStorage.setItem('studylink-bundle-filters', JSON.stringify(filters)) } catch { /* ignore */ }
  }, [filters])

  const handleFilterChange = useCallback((ct: ContentType) => {
    setFilters(prev => {
      if (prev.includes(ct)) {
        if (prev.length <= 1) return prev
        return prev.filter(f => f !== ct)
      }
      return [...prev, ct]
    })
  }, [])

  const subjectGroups = useMemo((): SubjectGroup[] => {
    if (!isOpen) return []
    const gradeSubjects = getSubjectsForGrade(grade)
    const weekProducts = products.filter(p => {
      if (p.category !== 'محاضرات') return false
      if (p.store !== store) return false
      if (!p.subject || !gradeSubjects.includes(p.subject)) return false
      if (p.isBundle) return false
      if (activeWeek === 0) return true
      return (p.week || 1) === activeWeek
    })

    return gradeSubjects.map(subject => {
      const subjectProducts = weekProducts.filter(p => p.subject === subject)
      const uniqueDoctors = [...new Set(subjectProducts.map(p => p.doctor).filter(Boolean) as string[])]

      const filtered = subjectProducts
        .filter(p => p.contentType && filters.includes(p.contentType))
        .map(p => ({
          product: p,
          contentType: p.contentType as ContentType,
          removed: removedItems.has(p.id) || removedCTs.has(`${subject}::${p.contentType}`),
        }))

      const contentGroups: ContentTypeGroup[] = filters.map(ct => {
        const ctItems = filtered.filter(i => i.contentType === ct)
        const active = ctItems.filter(i => !i.removed)
        return {
          type: ct,
          items: ctItems,
          activeCount: active.length,
          totalPrice: active.reduce((s, i) => s + (i.product.available ? i.product.price : 0), 0),
        }
      }).filter(g => g.items.length > 0 || !filtered.some(i => i.contentType === g.type))

      const allActive = contentGroups.flatMap(g => g.items.filter(i => !i.removed))
      const hasMissing = uniqueDoctors.length > 0 && ALL_CONTENT_TYPES.some(
        ct => filters.includes(ct) && !filtered.some(i => i.contentType === ct)
      )

      return {
        subject,
        doctors: uniqueDoctors,
        selectedDoctor: selectedDoctors[subject] || (uniqueDoctors.length > 0 ? uniqueDoctors[0] : null),
        contentGroups,
        hasMissing,
        totalActiveCount: allActive.length,
        totalPrice: allActive.reduce((s, i) => s + (i.product.available ? i.product.price : 0), 0),
      }
    }).filter(g => g.contentGroups.length > 0 || g.doctors.length > 0)
  }, [isOpen, store, grade, activeWeek, filters, removedItems, removedCTs, selectedDoctors])

  const toggleExpandSubject = useCallback((subject: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev)
      if (next.has(subject)) next.delete(subject)
      else next.add(subject)
      return next
    })
  }, [])

  const toggleExpandCT = useCallback((key: string) => {
    setExpandedCTs(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setRemovedItems(prev => new Set(prev).add(productId))
  }, [])

  const restoreItem = useCallback((productId: string) => {
    setRemovedItems(prev => {
      const next = new Set(prev)
      next.delete(productId)
      return next
    })
  }, [])

  const removeCT = useCallback((subject: string, ct: ContentType) => {
    setRemovedCTs(prev => new Set(prev).add(`${subject}::${ct}`))
    // collapse
    setExpandedCTs(prev => {
      const next = new Set(prev)
      next.delete(`${subject}::${ct}`)
      return next
    })
  }, [])

  const restoreCT = useCallback((subject: string, ct: ContentType) => {
    setRemovedCTs(prev => {
      const next = new Set(prev)
      next.delete(`${subject}::${ct}`)
      return next
    })
  }, [])

  const removeSubject = useCallback((subject: string) => {
    setRemovedSubjects(prev => new Set(prev).add(subject))
    setExpandedSubjects(prev => {
      const next = new Set(prev)
      next.delete(subject)
      return next
    })
  }, [])

  const restoreSubject = useCallback((subject: string) => {
    setRemovedSubjects(prev => {
      const next = new Set(prev)
      next.delete(subject)
      return next
    })
  }, [])

  const changeDoctor = useCallback((subject: string, doctor: string) => {
    setSelectedDoctors(prev => ({ ...prev, [subject]: doctor }))
  }, [])

  const { totalPrice, totalCount, availableCount } = useMemo(() => {
    let total = 0, count = 0, avail = 0
    subjectGroups.forEach(g => {
      if (removedSubjects.has(g.subject)) return
      g.contentGroups.forEach(cg => {
        cg.items.forEach(item => {
          if (item.removed) return
          if (g.selectedDoctor && item.product.doctor !== g.selectedDoctor) return
          count++
          if (item.product.available) { total += item.product.price; avail++ }
        })
      })
    })
    return { totalPrice: total, totalCount: count, availableCount: avail }
  }, [subjectGroups, removedSubjects])

  const handleAddToCart = useCallback(() => {
    let addedCount = 0
    subjectGroups.forEach(g => {
      if (removedSubjects.has(g.subject)) return
      g.contentGroups.forEach(cg => {
        cg.items.forEach(item => {
          if (item.removed) return
          if (g.selectedDoctor && item.product.doctor !== g.selectedDoctor) return
          if (item.product.available) { addToCart(item.product); addedCount++ }
        })
      })
    })
    toast.success('تمت إضافة الباقة للسلة', {
      description: `${addedCount} مذكرة بـ ${totalPrice} ج.م`,
      duration: 2500,
      style: { direction: 'rtl', fontSize: '12px' },
    })
    onClose()
  }, [subjectGroups, removedSubjects, totalPrice, addToCart, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="absolute bottom-0 end-0 start-0 z-50 bg-white rounded-t-3xl flex flex-col"
            style={{ maxHeight: '96%', height: '96%' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-9 h-1 rounded-full bg-brand-grey-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-2 pt-1">
              <button data-tap="44" aria-label="إغلاق"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-brand-grey-100 flex items-center justify-center active:scale-90 transition-transform tap-44"
              >
                <X className="w-4 h-4 text-brand-grey-600" />
              </button>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-sky-500" />
                  <h2 className="text-[15px] font-bold text-navy-900">محاضراتك في الانجاز!</h2>
                </div>
                <p className="text-[12px] text-brand-grey-500 font-medium mt-0.5">
                  جهّز محاضرات الأسبوع واختمها بضغطة واحدة
                </p>
              </div>
              <div className="w-9" />
            </div>

            {/* Week Selector */}
            <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
              {WEEKS.map(w => (
                <button data-tap="44" aria-label="الوقت"
                  key={w.value}
                  onClick={() => setActiveWeek(w.value)}
                  style={{ minHeight: 48 }}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    activeWeek === w.value
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                      : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {w.label}
                </button>
              ))}
            </div>

            {/* Global Content Type Filters */}
            <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
              {ALL_CONTENT_TYPES.map(ct => {
                const isActive = filters.includes(ct)
                return (
                  <button data-tap="44" aria-label="تأكيد"
                    key={ct}
                    onClick={() => handleFilterChange(ct)}
                    style={{ minHeight: 48 }}
                    className={`shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 border ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20 border-sky-500'
                        : 'bg-white text-brand-grey-600 border-brand-grey-200 active:bg-brand-grey-50'
                    }`}
                  >
                    {(() => { const CtIcon = CONTENT_TYPE_ICONS[ct]; return <CtIcon className="w-3.5 h-3.5" aria-hidden /> })()}
                    <span>{ct}</span>
                    {isActive && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto phone-scroll px-5 pb-28">
              {(() => {
                const visibleGroups = subjectGroups.filter(g => !removedSubjects.has(g.subject))
                const isWeekUnavailable = activeWeek !== 0 && UNAVAILABLE_WEEKS[`${store}|${grade}|${activeWeek}`]
                const isEmpty = visibleGroups.length === 0

                if (isWeekUnavailable || isEmpty) {
                  return (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-16 h-16 rounded-2xl bg-brand-grey-100 flex items-center justify-center mb-4">
                        {isWeekUnavailable ? (
                          <AlertCircle className="w-7 h-7 text-brand-grey-400" />
                        ) : (
                          <BookOpen className="w-7 h-7 text-brand-grey-400" />
                        )}
                      </div>
                      <p className="text-[14px] text-brand-grey-700 font-bold mb-1">
                        {isWeekUnavailable ? 'محاضرات الأسبوع ده مش متوفرة حالياً' : 'لا توجد مذكرات'}
                      </p>
                      <p className="text-[13px] text-brand-grey-400 text-center max-w-[220px]">
                        {isWeekUnavailable
                          ? 'المحاضرات هتنزل قريب، تابعنا عشان تعرف أول بأول'
                          : 'جرب تغيير الأسبوع أو اختيار أنواع محتوى مختلفة'
                        }
                      </p>
                    </div>
                  )
                }

                return null
              })()}

              {!UNAVAILABLE_WEEKS[`${store}|${grade}|${activeWeek}`] && subjectGroups.filter(g => !removedSubjects.has(g.subject)).length > 0 && (
                <div className="flex flex-col gap-3">
                  {subjectGroups.map((group, gi) => {
                    if (removedSubjects.has(group.subject)) {
                      return (
                        <motion.div
                          key={group.subject}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="rounded-2xl border border-dashed border-brand-grey-300 bg-brand-grey-50/50 px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-brand-grey-500 font-semibold">{group.subject}</span>
                            <span className="text-[12px] text-brand-grey-400">— تم الحذف</span>
                          </div>
                          <button data-tap="44"
                            onClick={() => restoreSubject(group.subject)}
                            className="flex items-center gap-1 text-[12px] text-sky-600 font-semibold active:scale-95 transition-transform"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>استعادة</span>
                          </button>
                        </motion.div>
                      )
                    }

                    const isSubjectExpanded = expandedSubjects.has(group.subject)

                    return (
                      <motion.div
                        key={group.subject}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: gi * 0.03 }}
                        className="rounded-2xl border border-brand-grey-200/60 bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                      >
                        {/* ── Subject Header ── */}
                        <div
                          className="flex items-center gap-2.5 px-4 py-3 cursor-pointer active:bg-brand-grey-50 transition-colors"
                          onClick={() => toggleExpandSubject(group.subject)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold text-navy-900 truncate">
                                {group.subject}
                              </span>
                              {group.totalActiveCount > 0 && (
                                <span className="text-[12px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-full border border-sky-200/60">
                                  {group.totalActiveCount}
                                </span>
                              )}
                            </div>
                            <span className="text-[12px] text-brand-grey-500 font-medium mt-0.5 block">
                              {group.totalPrice} ج.م
                            </span>
                          </div>

                          <button data-tap="44" aria-label="حذف"
                            onClick={(e) => { e.stopPropagation(); removeSubject(group.subject) }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-error-bg transition-colors tap-44"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-brand-grey-400" />
                          </button>

                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-200 ${isSubjectExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-4 h-4 text-brand-grey-500" />
                          </div>
                        </div>

                        {/* ── Subject Expanded Content ── */}
                        <AnimatePresence>
                          {isSubjectExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-brand-grey-100">
                                {/* Doctor Choice Chips */}
                                {group.doctors.length > 1 && (
                                  <div className="flex gap-1.5 px-4 pt-3 pb-2 flex-wrap">
                                    {group.doctors.map(doc => (
                                      <button data-tap="44"
                                        key={doc}
                                        onClick={() => changeDoctor(group.subject, doc)}
                                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 border ${
                                          group.selectedDoctor === doc
                                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                                            : 'bg-white text-brand-grey-500 border-brand-grey-200/60'
                                        }`}
                                      >
                                        {doc}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {/* ── Content Type Rows (drill-down) ── */}
                                <div className="flex flex-col">
                                  {group.contentGroups.map(cg => {
                                    const ctKey = `${group.subject}::${cg.type}`
                                    const isCtRemoved = removedCTs.has(ctKey)
                                    const isCtExpanded = expandedCTs.has(ctKey)
                                    const hasUnavailable = cg.items.some(i => !i.product.available)

                                    if (isCtRemoved) {
                                      return (
                                        <div
                                          key={cg.type}
                                          className="mx-3 my-1.5 flex items-center justify-between py-2 px-3 rounded-xl bg-brand-grey-50 border border-dashed border-brand-grey-200"
                                        >
                                          <div className="flex items-center gap-2">
                                            {(() => { const CtIcon = CONTENT_TYPE_ICONS[cg.type]; return <CtIcon className="w-3.5 h-3.5" aria-hidden /> })()}
                                            <span className="text-[12px] text-brand-grey-500 font-semibold">{cg.type}</span>
                                            <span className="text-[12px] text-brand-grey-400">— محذوف</span>
                                          </div>
                                          <button data-tap="44"
                                            onClick={() => restoreCT(group.subject, cg.type)}
                                            className="flex items-center gap-1 text-[12px] text-sky-600 font-semibold active:scale-95 transition-transform"
                                          >
                                            <RotateCcw className="w-3 h-3" />
                                            <span>استعادة</span>
                                          </button>
                                        </div>
                                      )
                                    }

                                    return (
                                      <div key={cg.type} className="border-t border-brand-grey-100 first:border-t-0">
                                        {/* Content Type Header Row */}
                                        <div
                                          className="flex items-center gap-2.5 px-4 py-2.5 cursor-pointer active:bg-brand-grey-50 transition-colors"
                                          onClick={() => toggleExpandCT(ctKey)}
                                        >
                                          {(() => { const CtIcon = CONTENT_TYPE_ICONS[cg.type]; return <CtIcon className="w-3.5 h-3.5" aria-hidden /> })()}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-[12px] font-bold text-navy-800">
                                                {cg.type}
                                              </span>
                                              {cg.activeCount > 0 && (
                                                <span className="text-[12px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded-full">
                                                  {cg.activeCount}
                                                </span>
                                              )}
                                              {hasUnavailable && (
                                                <span className="text-[12px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200/60">
                                                  غير متوفر
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <span className="text-[12px] font-bold text-navy-800 sl-num">
                                            {cg.totalPrice} ج.م
                                          </span>

                                          <button data-tap="44" aria-label="إغلاق"
                                            onClick={(e) => { e.stopPropagation(); removeCT(group.subject, cg.type) }}
                                            className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-error-bg transition-colors tap-44"
                                          >
                                            <X className="w-3 h-3 text-brand-grey-400" />
                                          </button>

                                          <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-transform duration-200 ${isCtExpanded ? 'rotate-180' : ''}`}>
                                            <ChevronDown className="w-3.5 h-3.5 text-brand-grey-500" />
                                          </div>
                                        </div>

                                        {/* ── Individual Lecture Items (nested) ── */}
                                        <AnimatePresence>
                                          {isCtExpanded && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.15 }}
                                              className="overflow-hidden"
                                            >
                                              <div className="bg-brand-grey-50/50 px-4 pb-2.5 pt-1 flex flex-col gap-1.5">
                                                {cg.items.length === 0 && (
                                                  <div className="flex items-center gap-2 py-2 px-2 rounded-lg bg-amber-50/80 border border-amber-200/50">
                                                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                                    <span className="text-[12px] font-semibold text-amber-700">غير متوفر لهذا الأسبوع</span>
                                                  </div>
                                                )}

                                                {cg.items.map(item => (
                                                  <div
                                                    key={item.product.id}
                                                    className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl border transition-all duration-150 ${
                                                      item.removed
                                                        ? 'border-brand-grey-200/50 bg-brand-grey-100/50 opacity-50'
                                                        : !item.product.available
                                                        ? 'border-amber-200/40 bg-amber-50/40'
                                                        : 'border-brand-grey-200/40 bg-white'
                                                    }`}
                                                  >
                                                    {/* Item info */}
                                                    <div className="flex-1 min-w-0">
                                                      <span className="text-[12px] font-semibold text-navy-900 truncate block">
                                                        {item.product.doctor}
                                                      </span>
                                                      <div className="flex items-center gap-2 mt-0.5">
                                                        {item.product.pages && (
                                                          <span className="text-[12px] text-brand-grey-400">
                                                            {item.product.pages} صفحة
                                                          </span>
                                                        )}
                                                        {!item.product.available && (
                                                          <span className="text-[12px] text-amber-600 font-medium bg-amber-100 px-1.5 py-0.5 rounded">
                                                            لم ينزل بعد
                                                          </span>
                                                        )}
                                                      </div>
                                                    </div>

                                                    {/* Price + Action */}
                                                    {item.removed ? (
                                                      <button data-tap="44"
                                                        onClick={() => restoreItem(item.product.id)}
                                                        className="flex items-center gap-1 text-[12px] text-sky-600 font-semibold active:scale-95 transition-transform shrink-0"
                                                      >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        <span>إضافة</span>
                                                      </button>
                                                    ) : (
                                                      <div className="flex items-center gap-2 shrink-0">
                                                        {!item.product.available ? (
                                                          <span className="text-[12px] text-amber-500 sl-num font-bold">
                                                            0 ج.م
                                                          </span>
                                                        ) : (
                                                          <span className="text-[12px] text-navy-800 sl-num font-bold">
                                                            {item.product.price} ج.م
                                                          </span>
                                                        )}
                                                        <button data-tap="44" aria-label="إغلاق"
                                                          onClick={() => removeItem(item.product.id)}
                                                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-error-bg transition-colors tap-44"
                                                        >
                                                          <X className="w-3.5 h-3.5 text-brand-grey-400" />
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sticky CTA */}
            <div className="absolute bottom-0 end-0 start-0 z-10">
              <div className="bg-gradient-to-t from-white via-white to-white/90 pt-4 pb-5 px-5">
                <button
                  onClick={handleAddToCart}
                  disabled={availableCount === 0}
                  className={`w-full h-12 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    availableCount > 0
                      ? 'bg-navy-800 text-white shadow-lg shadow-navy-800/30'
                      : 'bg-brand-grey-200 text-brand-grey-400'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {availableCount > 0 ? (
                    <>
                      <span>أضف باقة الأسبوع للسلة</span>
                      <span className="bg-white/20 px-2.5 py-1 rounded-lg text-[13px]">
                        {totalCount} مذكرة بـ {totalPrice} ج.م
                      </span>
                    </>
                  ) : (
                    <span>لا توجد مذكرات مختارة</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}