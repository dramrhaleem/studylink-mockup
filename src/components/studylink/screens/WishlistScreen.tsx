'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Heart, ShoppingCart, SlidersHorizontal, X, Check, Trash2, BookMarked, Stethoscope, ClipboardList, Shirt, type LucideIcon } from 'lucide-react'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface WishlistScreenProps {
  onNavigate?: (screen: string) => void
}

interface WishlistItem {
  id: number
  name: string
  doctor: string | null
  store: string
  price: number
  originalPrice: number | null
  emoji: LucideIcon
  gradient: string
  storeColor: string
  removed?: boolean
}

const wishlistData: WishlistItem[] = [
  {
    id: 1,
    name: 'جراحة عامة - شرح نظري كامل',
    doctor: 'د. أحمد محمود',
    store: 'هارفرد',
    price: 40,
    originalPrice: 55,
    emoji: BookMarked,
    gradient: 'from-sky-100 to-sky-200',
    storeColor: 'bg-sky-50 text-sky-700',
    removed: false,
  },
  {
    id: 2,
    name: 'سماعة ليتمان كلاسيك III',
    doctor: null,
    store: 'طبي',
    price: 850,
    originalPrice: null,
    emoji: Stethoscope,
    gradient: 'from-teal-100 to-teal-200',
    storeColor: 'bg-teal-50 text-teal-700',
    removed: false,
  },
  {
    id: 3,
    name: 'باطنة - ملخص شامل',
    doctor: 'د. محمد علي',
    store: 'برلين',
    price: 35,
    originalPrice: 50,
    emoji: ClipboardList,
    gradient: 'from-brand-grey-100 to-brand-grey-200',
    storeColor: 'bg-amber-50 text-amber-700',
    removed: false,
  },
  {
    id: 4,
    name: 'الطو الطبي أبيض - مقاس M',
    doctor: null,
    store: 'طبي',
    price: 180,
    originalPrice: null,
    emoji: Shirt,
    gradient: 'from-sky-50 to-navy-100',
    storeColor: 'bg-teal-50 text-teal-700',
    removed: false,
  },
]

const sortOptions = ['الأحدث', 'الأقل سعراً', 'الأعلى سعراً', 'الأكثر مبيعاً']

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    x: -60,
    scale: 0.9,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
}

export default function WishlistScreen({ onNavigate }: WishlistScreenProps) {
  const addToCartStore = useStudylinkStore(s => s.addToCart)
  const [items, setItems] = useState<WishlistItem[]>(wishlistData)
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState('الأحدث')
  const [editMode, setEditMode] = useState(false)
  const [removedToast, setRemovedToast] = useState<number | null>(null)
  const [movedToCart, setMovedToCart] = useState<number | null>(null)
  const [priceHighlight, setPriceHighlight] = useState<number | null>(null)

  const activeItems = items.filter(i => !i.removed)
  const totalPrice = activeItems.reduce((sum, item) => sum + item.price, 0)

  const handleRemove = (id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, removed: true } : item
    ))
    setRemovedToast(id)
    setTimeout(() => setRemovedToast(null), 2000)
  }

  const handleRestore = (id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, removed: false } : item
    ))
  }

  const handleClearAll = () => {
    setItems(prev => prev.map(item => ({ ...item, removed: true })))
    setEditMode(false)
  }

  const handleSortChange = (option: string) => {
    setSelectedSort(option)
    setSortOpen(false)
    // Trigger price highlight animation
    setPriceHighlight(Date.now())
    setTimeout(() => setPriceHighlight(null), 600)
  }

  const handleMoveToCart = (id: number) => {
    setMovedToCart(id)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
    setTimeout(() => setMovedToCart(null), 1200)
  }

  /* بلا `useCallback` عمدًا: مترجم React لم يستطع الحفاظ على التذكير اليدوي
     هنا (المصفوفة تُحوَّر لاحقًا)، فتخطّى تحسين المكوّن كله. تركُها للمترجم
     يعطي تذكيرًا صحيحًا تلقائيًا. */
  const handleAddAllToCart = (() => {
    activeItems.forEach(item => {
      addToCartStore({
        id: `wishlist-${item.id}`,
        title: item.name,
        category: item.store === 'طبي' ? 'أدوات طبية' : 'محاضرات',
        /* `item.store` is a free-form label on a wishlist row, not a StoreType.
           Mapping it explicitly instead of casting keeps the cart's store
           grouping (and therefore the per-bookstore service fee) correct. */
        store: item.store === 'برلين' ? 'برلين' : 'هارفرد',
        doctor: item.doctor || '',
        subject: '',
        price: item.price,
        pages: 40,
        paperSize: 'A4' as const,
        available: true,
        originalPrice: item.originalPrice ?? undefined,
        specs: '',
      })
    })
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
    onNavigate?.('cart')
  })

  return (
    <div className="screen-enter min-h-full bg-brand-grey-100 flex flex-col">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-40 bg-white px-4 pt-3 pb-3 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          <button data-tap="44" aria-label="رجوع"
            onClick={() => onNavigate?.('profile')}
            className="w-9 h-9 rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-95 transition-transform tap-44"
          >
            <ChevronLeft className="w-5 h-5 text-navy-800 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-bold text-navy-800">المفضلة</h1>
            <span className="text-[12px] font-bold sl-num text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full min-w-[24px] text-center">
              {activeItems.length}
            </span>
          </div>
          {/* Clear All in edit mode, or spacer */}
          {editMode && activeItems.length > 0 ? (
            <button data-tap="44"
              onClick={handleClearAll}
              className="flex items-center gap-1 text-[12px] font-semibold text-error active:opacity-70 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح الكل</span>
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </div>

      {/* ── Filter / Sort Row ── */}
      <div className="sticky top-[60px] z-30 bg-brand-grey-100/95 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Sort Dropdown with animated chevron */}
          <div className="relative">
            <button data-tap="44" aria-label="فلترة"
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 bg-white border border-brand-grey-200/70 rounded-xl px-3 py-2 shadow-sm active:scale-[0.97] transition-transform"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-500" />
              <span className="text-[13px] font-semibold text-navy-800">{selectedSort}</span>
              <motion.div
                animate={{ rotate: sortOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="w-3.5 h-3.5 text-brand-grey-400 rotate-180" />
              </motion.div>
            </button>

            <AnimatePresence>
              {sortOpen && (
                <>
                  <div className="absolute inset-0 z-40" onClick={() => setSortOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1.5 start-0 z-50 bg-white rounded-xl shadow-lg border border-brand-grey-200/60 py-1.5 min-w-[160px] overflow-hidden"
                  >
                    {sortOptions.map(option => (
                      <button data-tap="44"
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className={`w-full text-start px-4 py-2.5 text-[13px] font-medium transition-colors ${
                          selectedSort === option
                            ? 'text-sky-500 bg-sky-50/70'
                            : 'text-navy-800 hover:bg-brand-grey-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Edit Button */}
          <button data-tap="44"
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all active:scale-[0.97] ${
              editMode
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                : 'bg-white border border-brand-grey-200/70 text-navy-800 shadow-sm'
            }`}
          >
            <span>{editMode ? 'تم' : 'تعديل'}</span>
          </button>
        </div>
      </div>

      {/* ── Wishlist Items ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto phone-scroll px-4 pt-2 pb-36 space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              layout
              exit="exit"
              whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
                item.removed
                  ? 'border-error/20 bg-error-bg/30'
                  : 'border-brand-grey-200/50 hover:shadow-lg'
              }`}
            >
              <div className="p-3.5">
                <div className="flex gap-3">
                  {/* ── Left: Product Image Placeholder ── */}
                  <div className={`w-[72px] h-[72px] rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 relative`}>
                    <item.emoji className="w-8 h-8 text-navy-800" aria-hidden />
                    {/* Moved to cart success animation */}
                    <AnimatePresence>
                      {movedToCart === item.id && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 rounded-xl bg-success/80 flex items-center justify-center z-20"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                          >
                            <Check className="w-7 h-7 text-white" strokeWidth={3} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Middle: Product Info ── */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-navy-800 leading-snug truncate">
                      {item.name}
                    </p>
                    {item.doctor && (
                      <p className="text-[12px] text-brand-grey-500 mt-0.5">
                        {item.doctor}
                      </p>
                    )}

                    {/* Store Badge */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[12px] font-bold px-2 py-0.5 rounded-md ${item.storeColor}`}>
                        {item.store}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[12px] font-semibold sl-num text-success bg-success-bg px-1.5 py-0.5 rounded-md">
                          خصم {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Price Row with highlight animation */}
                    <div className="flex items-center gap-2 mt-2">
                      <motion.span
                        key={priceHighlight}
                        animate={priceHighlight ? {
                          color: ['#0f172a', '#1A70B0', '#0f172a'],
                        } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-[15px] font-bold text-navy-800 sl-num inline-block"
                      >
                        {item.price} ج.م
                      </motion.span>
                      {item.originalPrice && (
                        <span className="text-[12px] sl-num text-brand-grey-400 line-through">
                          {item.originalPrice} ج.م
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Right: Actions ── */}
                  <div className="flex flex-col items-center justify-between py-0.5">
                    {/* Heart / Remove Button */}
                    {!item.removed ? (
                      <motion.button data-tap="44" aria-label="المفضلة"
                        whileTap={{ scale: 0.75 }}
                        onClick={() => handleRemove(item.id)}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors tap-44"
                      >
                        <motion.div
                          initial={false}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className="w-5 h-5 text-error fill-error" />
                        </motion.div>
                      </motion.button>
                    ) : (
                      <motion.button data-tap="44" aria-label="إغلاق"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleRestore(item.id)}
                        className="w-9 h-9 rounded-full bg-brand-grey-100 flex items-center justify-center tap-44"
                      >
                        <X className="w-4 h-4 text-brand-grey-500" />
                      </motion.button>
                    )}

                    {/* Add to Cart Button */}
                    {!item.removed && (
                      <motion.button data-tap="44" aria-label="السلة"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleMoveToCart(item.id)}
                        className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-sm shadow-sky-500/25 active:bg-sky-600 transition-colors tap-44"
                      >
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Edit Mode: Remove Button */}
                {editMode && !item.removed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-brand-grey-100">
                      <button data-tap="44"
                        onClick={() => handleRemove(item.id)}
                        className="w-full flex items-center justify-center gap-1.5 text-[13px] font-semibold text-error py-2 rounded-xl bg-error-bg/60 active:scale-[0.97] transition-transform"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>إزالة من المفضلة</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Removed state inline label */}
                {item.removed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-error/10 flex items-center justify-between">
                      <span className="text-[12px] text-brand-grey-500 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-success" />
                        تم إزالته من المفضلة
                      </span>
                      <button data-tap="44"
                        onClick={() => handleRestore(item.id)}
                        className="text-[12px] font-semibold text-sky-500 active:opacity-70 transition-opacity"
                      >
                        تراجع
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Toast Feedback ── */}
      <AnimatePresence>
        {removedToast !== null && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute bottom-28 end-4 start-4 z-50"
          >
            <div className="bg-navy-800 text-white rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-xl shadow-navy-800/30">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-success" />
              </div>
              <span className="text-[13px] font-semibold">تم إزالته من المفضلة</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky Bottom Summary Bar with shimmer border ── */}
      {activeItems.length > 0 && (
        <div className="sticky bottom-0 z-30 relative">
          {/* Animated shimmer gradient border at top */}
          <div className="absolute top-0 end-0 start-0 h-[2px] overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-sky-400 to-transparent"
            />
          </div>
          <div className="bg-white border-t border-brand-grey-200/50 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-shrink-0">
                <p className="text-[12px] text-brand-grey-500">
                  <span className="sl-num font-bold text-navy-800">{activeItems.length}</span> منتجات
                </p>
                <p className="text-[15px] font-bold text-navy-800 sl-num mt-0.5">
                  {totalPrice.toLocaleString('en-US')} ج.م
                </p>
              </div>
              <button
                onClick={handleAddAllToCart}
                className="flex-1 h-12 bg-navy-800 text-white text-[13px] font-bold rounded-xl hover:bg-navy-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-navy-800/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>إضافة كلها للسلة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State with floating heart pulse */}
      {activeItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center px-4 -mt-20"
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-20 h-20 rounded-full bg-brand-grey-100 flex items-center justify-center mb-4"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="w-9 h-9 text-brand-grey-400" />
            </motion.div>
          </motion.div>
          <p className="text-[15px] font-bold text-navy-800 mb-1">المفضلة فاضية</p>
          <p className="text-[13px] text-brand-grey-500 mb-5 text-center leading-relaxed max-w-[240px]">
            ممكن تضيف المحاضرات والأدوات اللي عجبتك هنا عشان ترجعلهام بعدين
          </p>
          <button data-tap="44"
            onClick={() => onNavigate?.('lectures')}
            className="bg-sky-500 text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl shadow-sm shadow-sky-500/20 active:scale-95 transition-transform"
          >
            تصفح المحاضرات
          </button>
        </motion.div>
      )}
    </div>
  )
}