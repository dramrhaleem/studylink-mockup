'use client'

import { asset } from '@/lib/asset'

import { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, SlidersHorizontal, ChevronLeft,
  Clock, Sparkles, Zap, BookOpen, Check
} from 'lucide-react'
import CartHeaderButton from '../CartHeaderButton'
import Image from 'next/image'
import {
  products, type StoreType, type Product, type ContentType,
  isProductForGrade, getSubjectsForGrade, ALL_CONTENT_TYPES
} from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'
import BottomNavBar from '../BottomNavBar'
import ProductDetailScreen from '@/components/studylink/screens/ProductDetailScreen'
import QuantityControl from '@/components/studylink/QuantityControl'
import GradeGateOverlay from '@/components/studylink/GradeGateOverlay'
import BundleBuilderSheet from '@/components/studylink/screens/BundleBuilderSheet'

interface LecturesScreenProps {
  onNavigate?: (screen: string) => void
}

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

export default function LecturesScreen({ onNavigate }: LecturesScreenProps) {
  const [activeStore, setActiveStore] = useState<StoreType>('هارفرد')
  const [activeSubject, setActiveSubject] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<ContentType | 'الكل'>('الكل')
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showBundleBuilder, setShowBundleBuilder] = useState(false)

  const selectedGrade = useStudylinkStore(s => s.selectedGrade)
  const setSelectedGrade = useStudylinkStore(s => s.setSelectedGrade)
  const cart = useStudylinkStore(s => s.cart)
  const addToCart = useStudylinkStore(s => s.addToCart)
  const updateQuantity = useStudylinkStore(s => s.updateQuantity)
  const removeFromCart = useStudylinkStore(s => s.removeFromCart)

  const ribbonRef = useRef<HTMLDivElement>(null)

  const getQty = useCallback((id: string) => cart.find(i => i.product.id === id)?.quantity || 0, [cart])

  const handleAdd = useCallback((p: Product) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
    addToCart(p)
  }, [addToCart])

  const handleInc = useCallback((id: string) => updateQuantity(id, getQty(id) + 1), [updateQuantity, getQty])
  const handleDec = useCallback((id: string) => {
    if (getQty(id) <= 1) removeFromCart(id)
    else updateQuantity(id, getQty(id) - 1)
  }, [updateQuantity, getQty, removeFromCart])

  // ── Data ──
  const allStoreLectures = useMemo(() => {
    return products.filter(p => p.category === 'محاضرات' && p.store === activeStore)
  }, [activeStore])

  const storeGradeProducts = useMemo(() => {
    return products.filter(p => {
      if (p.category !== 'محاضرات') return false
      if (p.store !== activeStore) return false
      if (p.isBundle) return false
      if (selectedGrade && !isProductForGrade(p, selectedGrade)) return false
      return true
    })
  }, [activeStore, selectedGrade])

  const bgSubjects = useMemo(() => {
    const all = ['جراحة عامة', 'باطنة', 'أطفال', 'فسيولوجي', 'تشريح', 'أدوية', 'باثولوجي', 'نسا وتوليد']
    return all.filter(s => allStoreLectures.some(p => p.subject === s))
  }, [allStoreLectures])

  const subjects = useMemo(() => {
    const gradeSubjects = selectedGrade
      ? getSubjectsForGrade(selectedGrade)
      : ['جراحة عامة', 'باطنة', 'أطفال', 'فسيولوجي', 'تشريح', 'أدوية', 'باثولوجي', 'نسا وتوليد']
    return gradeSubjects.filter(s => storeGradeProducts.some(p => p.subject === s))
  }, [storeGradeProducts, selectedGrade])

  const filteredProducts = useMemo(() => {
    let result = storeGradeProducts
    if (activeFilter !== 'الكل') result = result.filter(p => p.contentType === activeFilter)
    if (activeSubject) result = result.filter(p => p.subject === activeSubject)
    return result
  }, [storeGradeProducts, activeFilter, activeSubject])

  // Fast Track Ribbon data — recent lectures for selected grade
  const ribbonProducts = useMemo(() => {
    if (!selectedGrade) return []
    return storeGradeProducts
      .filter(p => p.available && p.contentType)
      .slice(0, 8)
  }, [storeGradeProducts, selectedGrade])

  const contentTypes: (ContentType | 'الكل')[] = ['الكل', ...ALL_CONTENT_TYPES]

  // ── Background blurred content (shown when no grade selected) ──
  const bgContent = useMemo(() => {
    if (selectedGrade) return null
    return (
      <div className="pointer-events-none select-none">
        {bgSubjects.slice(0, 3).map(subject => {
          const items = allStoreLectures.filter(p => p.subject === subject)
          if (items.length === 0) return null
          return (
            <div key={subject} className="mb-4">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span className="text-[12px] font-bold text-navy-800">{subject}</span>
                <span className="text-[12px] text-brand-grey-400 font-medium">
                  {items.length} محاضرة
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {items.slice(0, 2).map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50 flex flex-col"
                  >
                    <div className="relative w-full aspect-[4/3] bg-brand-grey-50 overflow-hidden">
                      <Image
                        src={product.image || asset('/studylink-icon.png')}
                        alt={product.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col p-2.5 flex-1 min-h-0">
                      <span className="text-[12px] text-brand-grey-400 font-medium leading-none mb-1 truncate">
                        {product.doctor}
                      </span>
                      <p className="text-[12px] font-semibold text-navy-900 line-clamp-2 leading-tight flex-1">
                        {product.title}
                      </p>
                      <div className="flex items-baseline gap-0.5 mt-2 pt-2 border-t border-brand-grey-100">
                        <span className="sl-num text-[13px] font-extrabold text-navy-800 leading-none">
                          {product.price}
                        </span>
                        <span className="text-[12px] text-brand-grey-400 leading-none">ج.م</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [selectedGrade, bgSubjects, allStoreLectures])

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 overflow-y-auto phone-scroll bg-brand-grey-100">

        {/* ── Header ── */}
        <div className="sticky top-0 z-30 bg-white border-b border-brand-grey-200/60">
          <div className="flex items-center justify-between px-4 pt-9 pb-2">
            <h1 className="text-[17px] font-bold text-navy-900">المحاضرات</h1>
            <div className="flex items-center gap-2">
              <CartHeaderButton onNavigate={onNavigate} />
              <button data-tap="44" aria-label="بحث"
                onClick={() => onNavigate?.('search')}
                className="w-9 h-9 rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-95 transition-transform tap-44"
                style={{ minWidth: 48, minHeight: 48 }}
              >
                <Search className="w-4 h-4 text-brand-grey-600" />
              </button>
            </div>
          </div>

          {/* Store toggle */}
          <div className="flex gap-0.5 mx-4 mb-2 p-0.5 bg-brand-grey-100 rounded-xl w-fit">
            {(['هارفرد', 'برلين'] as StoreType[]).map(store => (
              <button data-tap="44"
                key={store}
                onClick={() => setActiveStore(store)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 ${
                  activeStore === store
                    ? 'bg-white text-navy-800 shadow-sm'
                    : 'text-brand-grey-400'
                }`}
                style={{ minHeight: 36 }}
              >
                {store}
              </button>
            ))}
          </div>

          {/* Subject pills */}
          {selectedGrade && subjects.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2.5 rail-gutter">
              <button data-tap="44"
                onClick={() => setActiveSubject(null)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
                  !activeSubject
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                    : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
                }`}
                style={{ minHeight: 48 }}
              >
                الكل
              </button>
              {subjects.map(s => (
                <button data-tap="44"
                  key={s}
                  onClick={() => setActiveSubject(activeSubject === s ? null : s)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
                    activeSubject === s
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                      : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
                  }`}
                  style={{ minHeight: 48 }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Content Area ── */}
        <div className="relative px-4 pt-3 pb-24">
          {/* Blurred background: full lecture page behind the grade gate */}
          {bgContent}

          {/* Main content after grade selection */}
          {selectedGrade && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* ═══ Fast Track Ribbon ═══ */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <h2 className="text-[13px] font-bold text-navy-900">محاضراتك في أسرع وقت</h2>
                  </div>
                  <div className="flex items-center gap-0.5 text-[12px] text-brand-grey-400">
                    <Clock className="w-2.5 h-2.5" />
                    <span>جديد</span>
                  </div>
                </div>

                <div
                  ref={ribbonRef}
                  className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1"
                >
                  {/* Bundle Trigger Card */}
                  <button data-tap="44"
                    onClick={() => setShowBundleBuilder(true)}
                    className="shrink-0 w-[160px] rounded-2xl overflow-hidden relative bg-gradient-to-br from-navy-800 to-navy-900 shadow-lg shadow-navy-800/25 active:scale-[0.97] transition-transform"
                  >
                    {/* Shimmer decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -top-1/2 -right-1/2 w-24 h-24 rounded-full bg-white/5" />
                      <div className="absolute -bottom-1/4 -left-1/4 w-16 h-16 rounded-full bg-sky-400/10" />
                    </div>

                    <div className="relative p-3 flex flex-col items-center text-center h-[130px] justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-1.5">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-white leading-tight mb-0.5">
                          كل محاضراتك في ضغطة
                        </p>
                        <p className="text-[12px] text-white/60 font-medium leading-tight">
                          باقة الأسبوع الحالي
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full">
                        <span className="text-[12px] font-bold text-white">اشترِ الآن</span>
                        <ChevronLeft className="w-3 h-3 text-white/70" />
                      </div>
                    </div>
                  </button>

                  {/* Ribbon Product Cards */}
                  {ribbonProducts.map(product => {
                    const qty = getQty(product.id)
                    return (
                      <div
                        key={product.id}
                        className="shrink-0 w-[120px] bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50 cursor-pointer active:scale-[0.97] transition-transform hover:shadow-md duration-200"
                        onClick={() => setDetailProduct(product)}
                      >
                        <div className="relative w-full h-[68px] bg-brand-grey-50 overflow-hidden">
                          <Image
                            src={product.image || asset('/studylink-icon.png')}
                            alt={product.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {product.contentType && (
                            <span className="absolute bottom-1 start-1 text-[12px] font-medium text-white/90 bg-black/40 backdrop-blur-sm px-1 py-0.5 rounded">
                              {product.contentType}
                            </span>
                          )}
                        </div>
                        <div className="p-2">
                          <span className="text-[12px] text-brand-grey-400 font-medium leading-none block truncate mb-0.5">
                            {product.doctor}
                          </span>
                          <p className="text-[12px] font-semibold text-navy-900 line-clamp-1 leading-tight mb-1.5">
                            {product.subject}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-0.5">
                              <span className="sl-num text-[12px] font-extrabold text-navy-800 leading-none">
                                {product.price}
                              </span>
                              <span className="text-[12px] text-brand-grey-400">ج.م</span>
                            </div>
                            {qty > 0 ? (
                              <QuantityControl
                                quantity={qty}
                                onIncrement={() => handleInc(product.id)}
                                onDecrement={() => handleDec(product.id)}
                                size="sm"
                              />
                            ) : (
                              <motion.button data-tap="44" aria-label="زيادة"
                                whileTap={{ scale: 0.85 }}
                                onClick={(e) => { e.stopPropagation(); handleAdd(product) }}
                                className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm bg-white text-navy-800 active:scale-90 transition-all duration-300 tap-44"
                                style={{ minWidth: 48, minHeight: 48 }}
                              >
                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="flex-1 h-px bg-brand-grey-200" />
                <span className="text-[12px] text-brand-grey-400 font-semibold">كل المحاضرات</span>
                <div className="flex-1 h-px bg-brand-grey-200" />
              </div>

              {/* Filter row */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button data-tap="44"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 active:scale-95 ${
                    showFilters
                      ? 'bg-sky-50 text-sky-600 border border-sky-200'
                      : 'bg-white text-brand-grey-500 border border-brand-grey-200/50'
                  }`}
                  style={{ minHeight: 36 }}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  فلتر النوع
                </button>
                <span className="text-[12px] text-brand-grey-400 font-medium">
                  {filteredProducts.length} محاضرة
                </span>
              </div>

              {/* Expandable content-type filter */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="flex gap-1.5 pb-3 px-1 flex-wrap">
                      {contentTypes.map(ct => (
                        <button data-tap="44"
                          key={ct}
                          onClick={() => setActiveFilter(ct)}
                          className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
                            activeFilter === ct
                              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                              : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
                          }`}
                          style={{ minHeight: 48 }}
                        >
                          {ct}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <motion.div
                  key={`${activeStore}-${selectedGrade}-${activeSubject}-${activeFilter}`}
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
                  }}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 gap-2.5"
                >
                  {filteredProducts.map(product => {
                    const qty = getQty(product.id)
                    /* was `product.originalPrice && …` — a truthiness check that
                       does not narrow the optional for TypeScript, so every use
                       below was an unguarded `number | undefined`. */
                    const listPrice = product.originalPrice ?? 0
                    const hasDiscount = listPrice > product.price
                    const discountPct = hasDiscount ? Math.round(((listPrice - product.price) / listPrice) * 100) : 0
                    const savingsAmt = hasDiscount ? String(listPrice - product.price) : '0'
                    return (
                      <motion.div
                        key={product.id}
                        variants={cardVariants}
                        transition={{ duration: 0.2 }}
                        className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50 flex flex-col ${
                          !product.available ? 'opacity-50' : 'active:scale-[0.98] cursor-pointer hover:shadow-md transition-shadow duration-200'
                        }`}
                        onClick={() => product.available && setDetailProduct(product)}
                      >
                        {/* Image */}
                        <div className="relative w-full aspect-[4/3] bg-brand-grey-50 overflow-hidden">
                          <Image
                            src={product.image || asset('/studylink-icon.png')}
                            alt={product.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {product.isBundle && (
                            <span className="absolute top-1.5 start-1.5 text-[12px] font-bold text-white bg-navy-800/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                              باقة {product.bundleCount}
                            </span>
                          )}
                          {hasDiscount && !product.isBundle && (
                            <span className="absolute top-1.5 end-1.5 text-[12px] font-bold text-white bg-amber-500 px-1.5 py-0.5 rounded-full">
                              خصم {discountPct}%
                            </span>
                          )}
                          {product.contentType && (
                            <span className="absolute bottom-1.5 start-1.5 text-[12px] font-medium text-white/90 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                              {product.contentType}
                            </span>
                          )}
                          {product.week && (
                            <span className="absolute top-1.5 start-1.5 text-[12px] font-bold text-white/90 bg-sky-500/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                              أسبوع {product.week}
                            </span>
                          )}
                        </div>

                        {/* Body */}
                        <div className="flex flex-col p-2.5 flex-1 min-h-0">
                          {/* Doctor name */}
                          <span className="text-[12px] text-brand-grey-500 font-medium leading-none mb-1 truncate">
                            {product.doctor}
                          </span>

                          {/* Title */}
                          <p className="text-[12px] font-bold text-navy-900 line-clamp-2 leading-[1.35] flex-1 min-h-[27px]">
                            {product.title}
                          </p>

                          {/* Price + Add */}
                          <div className="mt-2 pt-2 border-t border-brand-grey-100">
                            <div className="flex items-baseline gap-0.5">
                              {hasDiscount && (
                                <span className="text-[12px] text-brand-grey-400 line-through sl-num">
                                  {product.originalPrice}
                                </span>
                              )}
                              <span className="font-black text-navy-900 sl-num text-[13px] leading-none">
                                {product.price}
                              </span>
                              <span className="text-[12px] text-brand-grey-400 leading-none">ج.م</span>
                            </div>
                            {hasDiscount && (
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <Check className="w-3 h-3 text-teal-600" />
                                <span className="text-[12px] font-semibold text-teal-600">وفرت {savingsAmt} ج.م</span>
                              </div>
                            )}
                            <div className="flex items-center justify-end mt-1.5">
                              {product.available ? (
                                qty > 0 ? (
                                  <QuantityControl
                                    quantity={qty}
                                    onIncrement={() => handleInc(product.id)}
                                    onDecrement={() => handleDec(product.id)}
                                    size="sm"
                                  />
                                ) : (
                                  <motion.button data-tap="44" aria-label="زيادة"
                                    whileTap={{ scale: 0.85 }}
                                    onClick={(e) => { e.stopPropagation(); handleAdd(product) }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm bg-white text-navy-800 active:scale-90 transition-all duration-300 tap-44"
                                    style={{ minWidth: 48, minHeight: 48 }}
                                  >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                  </motion.button>
                                )
                              ) : (
                                <span className="text-[12px] text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-lg">
                                  لم ينزل بعد
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-grey-100 flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-brand-grey-400" />
                  </div>
                  <p className="text-[13px] text-brand-grey-600 font-semibold mb-1">لا توجد محاضرات</p>
                  <p className="text-[12px] text-brand-grey-400 mb-4 text-center">جرب تغيير الفلتر أو اختيار فرقة أخرى</p>
                  <button data-tap="44"
                    onClick={() => onNavigate?.('home')}
                    className="bg-sky-500 text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-500/20 active:scale-95 transition-transform"
                  >
                    تصفح المكتبات
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Grade Gate — outside scroll container, covers full screen; nav bar (z-40) stays above */}
      <AnimatePresence>
        {!selectedGrade && (
          <GradeGateOverlay onSelectGrade={(grade) => setSelectedGrade(grade)} />
        )}
      </AnimatePresence>

      {/* Bottom Nav — always visible above grade gate (z-50 > z-20) */}
      <div className="relative z-50 flex-shrink-0">
        <BottomNavBar activeTab="lectures" onNavigate={onNavigate} />
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailScreen
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Bundle Builder Sheet */}
      <BundleBuilderSheet
        isOpen={showBundleBuilder}
        onClose={() => setShowBundleBuilder(false)}
        store={activeStore}
        grade={selectedGrade!}
      />
    </div>
  )
}