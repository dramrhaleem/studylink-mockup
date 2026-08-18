'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Minus, Plus, X, Truck, Store, ChevronLeft, ShoppingBag } from 'lucide-react'
import BottomNavBar from '@/components/studylink/BottomNavBar'
import PricingBreakdown from './PricingBreakdown'
import { computeOrderTotals } from '@/lib/pricing'
import { toast } from 'sonner'
import { useStudylinkStore } from '@/lib/use-studylink-store'
import { products, isProductForGrade } from '@/lib/studylink-data'
import { categoryStyle } from '@/lib/category'
import CategoryGlyph from '@/components/studylink/CategoryGlyph'
import type { Product } from '@/lib/studylink-data'

interface CartScreenProps {
  onNavigate?: (screen: string) => void
}

/* ── animation presets ────────────────────────────────────────── */

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

const quantitySpring = { type: 'spring' as const, stiffness: 500, damping: 30 }

/* ── static helpers ───────────────────────────────────────────── */

/* أُزيلت أرقام وتواريخ «الطلب» من مجموعات السلة: السلة ليست طلبًا بعد، فلا رقم
   لها، والتواريخ كانت مثبّتة على «15 يناير 2025» — تاريخ ماضٍ ثابت يظهر لكل
   مستخدم. الترويسة الآن تقول ما هو صحيح: اسم المكتبة وعدد أصنافها. */

const toastStyle = { direction: 'rtl' as const, fontSize: '12px' }

/* ── component ────────────────────────────────────────────────── */

export default function CartScreen({ onNavigate }: CartScreenProps) {
  /* store bindings */
  const cart = useStudylinkStore(s => s.cart)
  const removeFromCart = useStudylinkStore(s => s.removeFromCart)
  const updateQuantity = useStudylinkStore(s => s.updateQuantity)
  const addToCart = useStudylinkStore(s => s.addToCart)
  const deliveryOption = useStudylinkStore(s => s.deliveryOption)
  const setDeliveryOption = useStudylinkStore(s => s.setDeliveryOption)
  const selectedGrade = useStudylinkStore(s => s.selectedGrade)

  /* local state */
  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set())
  const [clearConfirmStore, setClearConfirmStore] = useState<string | null>(null)
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null)
  const [cartBounceKey, setCartBounceKey] = useState(0)

  /* computed — derived from cart array (reactive) */
  /* كل رقم مالي من `lib/pricing.ts`. كانت هذه السطور تعيد حساب الرسوم محليًا
     برقم ثابت (5 خدمة / 25 توصيل) مكرّر في الستور وفي شاشة الدفع، وقد اختلفت
     رسوم الخدمة فعليًا عن القاعدة المسجلة (6–12 لكل مكتبة، C-001). */
  const totals = useMemo(
    () => computeOrderTotals(
      cart.map(i => ({ price: i.product.price, quantity: i.quantity, store: i.product.store })),
      deliveryOption
    ),
    [cart, deliveryOption]
  )
  const { subtotal, serviceFee, fulfillmentFee: deliveryFee, total, storeCount } = totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  /* expand all stores whenever cart changes */
  useEffect(() => {
    const stores = new Set(cart.map(i => i.product.store))
    /* توسيع المكتبات حالة واجهة تتبع السلة؛ اشتقاقها أثناء الرسم يمنع المستخدم من طيّ مكتبة يدويًا. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stores.size > 0) setExpandedStores(stores)
  }, [cart])

  /* group cart by store */
  const cartByStore = useMemo(() => {
    const groups: Record<string, typeof cart> = {}
    for (const item of cart) {
      ;(groups[item.product.store] ??= []).push(item)
    }
    return groups
  }, [cart])

  /* suggested products – 50/50 split when multi-store, filtered by grade */
  const suggestedProducts = useMemo(() => {
    const cartIds = new Set(cart.map(i => i.product.id))
    const cartStores = [...new Set(cart.map(i => i.product.store))]
    const pool = products.filter(p => p.available && !cartIds.has(p.id))

    let result: Product[]
    if (cartStores.length === 1) {
      result = pool.filter(p => p.store === cartStores[0]).slice(0, 10)
    } else if (cartStores.length >= 2) {
      const out: Product[] = []
      for (const store of cartStores) {
        out.push(...pool.filter(p => p.store === store).slice(0, 5))
      }
      result = out.slice(0, 10)
    } else {
      result = []
    }

    if (selectedGrade) {
      const gradeMatch = result.filter(p => p.category !== 'محاضرات' || isProductForGrade(p, selectedGrade))
      if (gradeMatch.length > 0) result = gradeMatch
    }

    return result
  }, [cart, selectedGrade])

  /* handlers */
  const toggleStore = useCallback((name: string) => {
    setExpandedStores(prev => {
      const next = new Set(prev)
      if (next.has(name)) { next.delete(name) } else { next.add(name) }
      return next
    })
  }, [])

  const handleClearStore = useCallback((storeName: string) => {
    for (const item of cart.filter(i => i.product.store === storeName)) {
      removeFromCart(item.product.id)
    }
    setClearConfirmStore(null)
    toast.success('تم تفريغ سلة المكتبة', { style: toastStyle })
  }, [cart, removeFromCart])

  const handleAddSuggested = useCallback((product: Product) => {
    addToCart(product)
    setRecentlyAddedId(product.id)
    setCartBounceKey(k => k + 1)
    toast.success('تمت الإضافة للسلة', { style: toastStyle })
    setTimeout(() => setRecentlyAddedId(null), 600)
  }, [addToCart])

  /* tiny animated quantity display */
  const AnimatedQty = ({ value }: { value: number }) => (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={quantitySpring}
        className="text-[14px] font-bold text-navy-800 sl-num min-w-[36px] text-center py-1 inline-block"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div className="h-full bg-brand-grey-100 flex flex-col overflow-hidden">
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-30 bg-white px-4 pt-9 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <button data-tap="44" aria-label="رجوع"
            onClick={() => onNavigate?.('home')}
            className="w-10 h-10 rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-95 transition-transform tap-44"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <ChevronLeft className="w-4 h-4 text-navy-800 rotate-180" />
          </button>
          <h1 className="text-[16px] font-bold text-navy-800">سلة التسوق</h1>
          {/* bouncing cart count */}
          <AnimatePresence mode="popLayout">
            <motion.span
              key={cartBounceKey}
              initial={{ scale: 1.5, color: '#1A70B0' }}
              animate={{ scale: 1, color: '#00426F' }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="text-[13px] text-sky-500 font-semibold"
            >
              {cartCount} منتجات
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Empty state ─── */}
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <ShoppingBag className="w-16 h-16 text-brand-grey-400 mb-4" />
          </motion.div>
          <p className="text-[15px] font-bold text-brand-grey-900 mb-1">السلة فاضية</p>
          <p className="text-[13px] text-brand-grey-500 mb-5 text-center leading-relaxed">
            ابدأ بتسوق المحاضرات والأدوات وايصلك هيكون هنا
          </p>
          <button data-tap="44"
            onClick={() => onNavigate?.('lectures')}
            className="bg-sky-500 text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl shadow-sm shadow-sky-500/20 active:scale-95 transition-transform"
            style={{ minHeight: 48 }}
          >
            تسوّق الآن
          </button>
        </div>
      ) : (
        <>
          {/* ─── Scrollable content ─── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto phone-scroll p-4 space-y-3"
          >
            {/* ──── وضع التنفيذ ────
                كان شريطًا أخضر ممتلئًا بعرض الشاشة مع حركة تعبئة — يُقرأ كشريط
                نجاح أو تقدّم ويسحب الانتباه من محتوى السلة. المعلومة هنا وصفية
                لا احتفالية. */}
            <motion.div variants={staggerItem}>
              <div className="flex items-center gap-2 rounded-xl bg-success-bg px-3 py-2">
                <Truck className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span className="text-[13px] text-success font-medium">
                  توصيل أو استلام من المكتبة
                </span>
              </div>
            </motion.div>

            {/* ──── Multi-store badge ──── */}
            {storeCount > 1 && (
              <motion.div variants={staggerItem} className="bg-sky-50 rounded-2xl p-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-sky-600" />
                <p className="text-[12px] text-sky-700 font-medium">
                  مشتريات من {storeCount} مكتبات مختلفة
                </p>
              </motion.div>
            )}

            {/* ──── Expandable store sections ──── */}
            {Object.entries(cartByStore).map(([storeName, storeItems]) => {
              const isExpanded = expandedStores.has(storeName)
              const isConfirming = clearConfirmStore === storeName
              const storeSubtotal = storeItems.reduce((s, i) => s + i.product.price * i.quantity, 0)
              const storeItemCount = storeItems.reduce((s, i) => s + i.quantity, 0)

              return (
                <motion.div key={storeName} variants={staggerItem} className="space-y-0">
                  {/* ── Header (entire area clickable) ── */}
                  <button aria-label="رجوع" data-tap="44"
                    onClick={() => toggleStore(storeName)}
                    className="w-full bg-white rounded-t-xl p-4 shadow-sm border border-b-0 border-brand-grey-200/50 flex items-center justify-between active:bg-brand-grey-50 transition-colors"
                  >
                    {/* Right side: chevron + info */}
                    <div className="flex items-center gap-2.5">
                      <motion.div
                        animate={{ rotate: isExpanded ? -90 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <ChevronLeft className="w-4 h-4 text-brand-grey-400" />
                      </motion.div>
                      <div className="text-start">
                        <p className="text-[14px] font-bold text-navy-800">مكتبة {storeName}</p>
                        <p className="text-[12px] text-brand-grey-500 mt-0.5">
                          {storeItemCount === 1 ? 'صنف واحد' : <><span className="sl-num">{storeItemCount}</span> أصناف</>}
                        </p>
                      </div>
                    </div>

                    {/* Left side: subtotal + count badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-navy-800 sl-num">
                        {storeSubtotal} ج.م
                      </span>
                    </div>
                  </button>

                  {/* ── Expanded body ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="bg-white border-x border-b border-brand-grey-200/50 rounded-b-xl p-4 space-y-3">
                          {/* "مسح الكل" — inline confirmation */}
                          <div className="flex justify-end">
                            <AnimatePresence mode="wait">
                              {!isConfirming ? (
                                <motion.button data-tap="44"
                                  key="clear-btn"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  onClick={() => setClearConfirmStore(storeName)}
                                  className="text-[12px] text-error/70 font-medium active:scale-95 transition-transform"
                                >
                                  مسح الكل
                                </motion.button>
                              ) : (
                                <motion.div
                                  key="clear-confirm"
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  transition={{ duration: 0.15 }}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-[12px] text-brand-grey-600 leading-tight">
                                    هل أنت متأكد من إفراغ السلة بالكامل؟
                                  </span>
                                  {/* "نعم" — LESS prominent: small, muted */}
                                  <button data-tap="44"
                                    onClick={() => { if (navigator.vibrate) navigator.vibrate(10); handleClearStore(storeName) }}
                                    className="h-7 px-3 text-[12px] font-medium rounded-lg bg-error-bg text-error/70 active:scale-95 transition-transform tap-44"
                                  >
                                    نعم
                                  </button>
                                  {/* "لا" — MORE prominent: larger, bold, outlined */}
                                  <button data-tap="44"
                                    onClick={() => setClearConfirmStore(null)}
                                    className="h-8 px-4 text-[13px] font-bold rounded-lg border-2 border-navy-800 text-navy-800 bg-white active:scale-95 transition-transform tap-44"
                                  >
                                    لا
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Cart item cards */}
                          {storeItems.map(item => (
                            <div key={item.product.id} className="relative">
                              <motion.div
                                whileTap={{ scale: 0.98 }}
                                className="bg-brand-grey-50 rounded-xl p-3"
                              >
                                <div className="flex gap-3">
                                  {/* Thumbnail */}
                                  <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${categoryStyle(item.product.category).iconBg}`}
                                  >
                                    {item.product.image ? (
                                      <Image
                                        src={item.product.image}
                                        alt={item.product.title}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <CategoryGlyph category={item.product.category} className="w-6 h-6" />
                                    )}
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <p className="text-[13px] font-semibold text-brand-grey-900 leading-tight">
                                          {item.product.title}
                                        </p>
                                        {item.product.doctor && (
                                          <p className="text-[12px] text-brand-grey-500 mt-0.5">
                                            {item.product.doctor}
                                          </p>
                                        )}
                                      </div>
                                      <button data-tap="44" aria-label="إغلاق"
                                        onClick={() => { if (navigator.vibrate) navigator.vibrate(10); removeFromCart(item.product.id) }}
                                        className="w-7 h-7 rounded-full bg-error-bg text-error flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform tap-44"
                                        style={{ minWidth: 40, minHeight: 40 }}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                      {/* Quantity: – n (spacer for + outside) */}
                                      <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
                                        <button data-tap="44" aria-label="إنقاص"
                                          onClick={() => {
                                            if (navigator.vibrate) navigator.vibrate(10)
                                            if (item.quantity <= 1) {
                                              removeFromCart(item.product.id)
                                              return
                                            }
                                            updateQuantity(item.product.id, item.quantity - 1)
                                          }}
                                          className="w-9 h-9 flex items-center justify-center active:scale-90 transition-transform border-e border-brand-grey-200/50 tap-44"
                                        >
                                          <Minus className="w-3 h-3 text-navy-800" />
                                        </button>
                                        <div className="min-w-[36px] flex items-center justify-center py-1">
                                          <AnimatedQty value={item.quantity} />
                                        </div>
                                        {/* placeholder so – and number are visually centred */}
                                        <div className="w-9 h-9" />
                                      </div>

                                      {/* Price */}
                                      <div className="text-end">
                                        <span className="text-[14px] font-bold text-navy-800 sl-num">
                                          {item.product.price * item.quantity} ج.م
                                        </span>
                                        {item.quantity > 1 && (
                                          <p className="text-[12px] text-brand-grey-400 sl-num">
                                            {item.product.price} × {item.quantity}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              {/* (+) button — OUTSIDE the card */}
                              <motion.button data-tap="44" aria-label="زيادة"
                                whileTap={{ scale: 0.8 }}
                                onClick={() => { if (navigator.vibrate) navigator.vibrate(10); updateQuantity(item.product.id, item.quantity + 1) }}
                                className="absolute -bottom-3 -end-3 w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30 z-10 border-[3px] border-brand-grey-100 tap-44"
                              >
                                <Plus className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* ──── Suggested products — horizontal scroll ──── */}
            {suggestedProducts.length > 0 && (
              <motion.div variants={staggerItem} className="pt-2">
                <h3 className="text-[13px] font-bold text-navy-800 mb-3">
                  زمايلك في الدفعة طلبوا دول كمان:
                </h3>
                <div
                  className="flex gap-3 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {suggestedProducts.map(product => {
                    const justAdded = recentlyAddedId === product.id
                    return (
                      <div key={product.id} className="flex-shrink-0 w-[120px] relative">
                        {/* Card */}
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="bg-white rounded-xl border border-brand-grey-200/50 shadow-sm overflow-hidden"
                        >
                          <div
                            className={`w-full h-16 flex items-center justify-center overflow-hidden ${categoryStyle(product.category).iconBg}`}
                          >
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.title}
                                width={120}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <CategoryGlyph category={product.category} className="w-6 h-6" />
                            )}
                          </div>
                          <div className="p-2.5 pb-3">
                            <p className="text-[12px] font-bold text-brand-grey-900 leading-tight line-clamp-1">
                              {product.title}
                            </p>
                            <span className="text-[13px] font-bold text-navy-800 sl-num mt-1 block">
                              {product.price} ج.م
                            </span>
                          </div>
                        </motion.div>

                        {/* (+) button — OUTSIDE the card */}
                        <motion.button data-tap="44" aria-label="زيادة"
                          whileTap={{ scale: 0.65 }}
                          onClick={() => handleAddSuggested(product)}
                          animate={
                            justAdded
                              ? { scale: [1, 0.85, 1.1, 1], backgroundColor: ['#1A70B0', '#22c55e', '#22c55e', '#1A70B0'] }
                              : {}
                          }
                          transition={{ duration: 0.45, ease: 'easeInOut' }}
                          className="absolute -bottom-2.5 -end-1 w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm shadow-sky-500/30 z-10 border-[2.5px] border-brand-grey-100 tap-44"
                          style={{ minWidth: 44, minHeight: 44 }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* ──── Delivery options ──── */}
            <motion.div
              variants={staggerItem}
              className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
            >
              <h3 className="text-[13px] font-bold text-navy-800 mb-3">طريقة الاستلام</h3>
              <div className="space-y-2">
                {/* Delivery */}
                <button data-tap="44"
                  onClick={() => setDeliveryOption('delivery')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                    deliveryOption === 'delivery'
                      ? 'bg-sky-50 border-sky-200'
                      : 'bg-brand-grey-100 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        deliveryOption === 'delivery' ? 'bg-sky-500' : 'bg-brand-grey-300'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-start">
                      <p
                        className={`text-[13px] font-semibold ${
                          deliveryOption === 'delivery' ? 'text-navy-800' : 'text-brand-grey-600'
                        }`}
                      >
                        توصيل دليفري
                      </p>
                      <p className="text-[12px] text-brand-grey-500">الوقت المتوقع بيظهر مع الطلب</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-bold text-navy-800 sl-num">
                    {deliveryFee} ج.م
                  </span>
                </button>

                {/* Pickup */}
                <button data-tap="44"
                  onClick={() => setDeliveryOption('pickup')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                    deliveryOption === 'pickup'
                      ? 'bg-sky-50 border-sky-200'
                      : 'bg-brand-grey-100 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        deliveryOption === 'pickup' ? 'bg-sky-500' : 'bg-brand-grey-300'
                      }`}
                    >
                      <Store className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-start">
                      <p
                        className={`text-[13px] font-semibold ${
                          deliveryOption === 'pickup' ? 'text-navy-800' : 'text-brand-grey-600'
                        }`}
                      >
                        استلام من المكتبة
                      </p>
                      <p className="text-[12px] text-brand-grey-500">استلام فوري</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-bold text-success">مجاني</span>
                </button>
              </div>
            </motion.div>

            {/* بطاقة الحساب المعتمدة — مكوّن واحد لكل الشاشات. */}
            <motion.div variants={staggerItem}>
              <PricingBreakdown
                totals={totals}
                deliveryOption={deliveryOption}
                lines={cart.map(i => ({ price: i.product.price, quantity: i.quantity, store: i.product.store }))}
              />
            </motion.div>

            {/* spacer for CTA + bottom nav */}
            <div className="h-40" />
          </motion.div>

          {/* ─── Sticky CTA ─── */}
          <div className="bg-white border-t border-brand-grey-200/50 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
            <button
              type="button"
              onClick={() => onNavigate?.('checkout')}
              disabled={cart.length === 0}
              className="w-full h-12 bg-navy-800 text-white text-[14px] font-semibold rounded-xl hover:bg-navy-700 active:bg-navy-900 disabled:bg-brand-grey-300 disabled:text-brand-grey-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <span>المتابعة للدفع</span>
              <span aria-hidden="true" className="text-white/50">·</span>
              <span className="sl-num">{total} ج.م</span>
            </button>
          </div>
        </>
      )}

      {/* ─── Bottom Nav ─── */}
      <BottomNavBar activeTab="home" onNavigate={onNavigate} />
    </div>
  )
}