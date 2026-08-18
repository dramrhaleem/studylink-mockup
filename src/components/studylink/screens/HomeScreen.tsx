'use client'

import { asset } from '@/lib/asset'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Search,
  Sparkles,
  Plus,
  Flame,
  BookOpen,
  FlaskConical,
  Stethoscope,
  Users,
  Check,
  ChevronUp,
  ArrowLeft,
  Clock,
  Trash2,
  Package,
  GraduationCap,
  ShoppingCart,
  Store,
  CalendarClock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import BottomNavBar from '@/components/studylink/BottomNavBar'
import { products, ALL_GRADES, type StoreType, type Product, type GradeType, isProductForGrade } from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'
import { CATEGORY, CATEGORY_ORDER } from '@/lib/category'
import { activeSeason } from '@/lib/season'
import ProductDetailScreen from '@/components/studylink/screens/ProductDetailScreen'
import QuantityControl from '@/components/studylink/QuantityControl'
import LibraryClosedSheet from '@/components/studylink/LibraryClosedSheet'
import BundleBuilderSheet from '@/components/studylink/screens/BundleBuilderSheet'

/* ───────────── Banner data ───────────── */
const banners = [
  { title: 'خصم 15% على باقات الامتحانات', subtitle: 'مكتبة هارفرد × StudyLink', subtext: 'لفترة محدودة', image: asset('/banners/home-banner-1.png'), overlay: 'from-navy-900/70 via-navy-900/40 to-transparent' },
  { title: 'محاضرات الأسبوع الجديدة', subtitle: 'شرح نظري + ورق عملي', subtext: 'جراحة · باطنة · أطفال', image: asset('/banners/home-banner-2.png'), overlay: 'from-sky-900/70 via-sky-900/40 to-transparent' },
  { title: 'أدوات طبية ومكتبية', subtitle: 'سماعات · بالطو · أدوات فحص', subtext: 'من المكتبات الشريكة', image: asset('/banners/home-banner-3.png'), overlay: 'from-teal-900/70 via-teal-900/40 to-transparent' },
]

interface HomeScreenProps {
  onNavigate: (screen: string) => void
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [loading, setLoading] = useState(true)
  const [activeStore, setActiveStore] = useState<StoreType>('هارفرد')
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)
  const [showClosedSheet, setShowClosedSheet] = useState(false)
  const [justAddedIds, setJustAddedIds] = useState<Set<string>>(new Set())
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showBundleBuilder, setShowBundleBuilder] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Berlin is closed (demo state)
  const storeStatus: Record<StoreType, { open: boolean; reopenTime: string }> = {
    'هارفرد': { open: true, reopenTime: '' },
    'برلين': { open: false, reopenTime: 'غداً الساعة 9:00 صباحاً' },
  }
  const selectedGrade = useStudylinkStore((s) => s.selectedGrade)
  const setSelectedGrade = useStudylinkStore((s) => s.setSelectedGrade)
  const cart = useStudylinkStore((s) => s.cart)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const addToCartStore = useStudylinkStore((s) => s.addToCart)
  const updateQuantity = useStudylinkStore((s) => s.updateQuantity)
  const removeFromCart = useStudylinkStore((s) => s.removeFromCart)
  const recentlyViewed = useStudylinkStore((s) => s.recentlyViewed)
  const clearRecentlyViewed = useStudylinkStore((s) => s.clearRecentlyViewed)
  const getCartQuantity = useCallback((productId: string) => {
    const item = cart.find(i => i.product.id === productId)
    return item ? item.quantity : 0
  }, [cart])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Banner horizontal scroll ref
  const bannerScrollRef = useRef<HTMLDivElement>(null)
  const [bannerSnapIndex, setBannerSnapIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const userInteractTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* شريط البانرات — كان مضبوطًا على `direction: ltr` فيقرأ من اليسار لليمين
     داخل تطبيق عربي، ثم يحسب الشريحة الحالية من `scrollLeft / itemWidth`.
     في RTL تكون `scrollLeft` سالبة (أو معكوسة) حسب المتصفح، فينهار الحساب.
     البديل: نقيس أي شريحة أقرب لمركز الحاوية — يعمل في الاتجاهين. */
  const bannerItemRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollToBanner = useCallback((i: number) => {
    bannerItemRefs.current[i]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [])

  useEffect(() => {
    const el = bannerScrollRef.current
    if (!el) return
    let raf = 0
    const handleScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const mid = el.getBoundingClientRect().left + el.clientWidth / 2
        let best = 0
        let bestDist = Infinity
        bannerItemRefs.current.forEach((node, i) => {
          if (!node) return
          const r = node.getBoundingClientRect()
          const d = Math.abs(r.left + r.width / 2 - mid)
          if (d < bestDist) { bestDist = d; best = i }
        })
        setBannerSnapIndex(prev => (prev === best ? prev : best))
      })
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => { cancelAnimationFrame(raf); el.removeEventListener('scroll', handleScroll) }
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return
    autoScrollTimerRef.current = setInterval(() => {
      scrollToBanner((bannerSnapIndex + 1) % banners.length)
    }, 4000)
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current)
    }
  }, [isAutoScrolling, bannerSnapIndex, scrollToBanner])

  const pauseAutoScroll = useCallback(() => {
    setIsAutoScrolling(false)
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current)
    if (userInteractTimerRef.current) clearTimeout(userInteractTimerRef.current)
    userInteractTimerRef.current = setTimeout(() => setIsAutoScrolling(true), 6000)
  }, [])

  // Scroll-to-top visibility
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      setShowScrollTop(el.scrollTop > 300)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const addToCart = useCallback(
    (productId: string, title: string) => {
      const product = products.find((p) => p.id === productId)
      if (product) {
        addToCartStore(product)
      }
      toast.success('تمت الإضافة للسلة', {
        description: title,
        duration: 2000,
        style: {
          direction: 'rtl',
          fontSize: '13px',
        },
      })
      // Trigger check animation
      setJustAddedIds((prev) => new Set(prev).add(productId))
      setTimeout(() => {
        setJustAddedIds((prev) => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
      }, 800)
    },
    [addToCartStore]
  )

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Available lecture products filtered by grade
  const lectureProducts = products.filter(
    (p) => p.category === 'محاضرات' && p.store === activeStore && p.available &&
    (!selectedGrade || isProductForGrade(p, selectedGrade))
  ).slice(0, 8)

  // Products with original price for offers section filtered by grade
  const offerProducts = products.filter(
    (p) => p.category === 'محاضرات' && p.originalPrice && p.available &&
    (!selectedGrade || isProductForGrade(p, selectedGrade))
  ).slice(0, 6)

  // Medical tools for home grid
  const medicalTools = products.filter(
    (p) => p.category === 'أدوات طبية' && p.available
  ).slice(0, 3)

  // Stationery for home grid
  const stationery = products.filter(
    (p) => p.category === 'أدوات مكتبية' && p.available
  ).slice(0, 6)

  if (loading) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-brand-grey-100">
        {/* Header skeleton */}
        <div className="sticky top-0 z-20 bg-white px-4 pb-2.5 pt-9 border-b border-brand-grey-200/60">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 skeleton-shimmer rounded" />
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 skeleton-shimmer rounded-full" />
              <div className="h-9 w-9 skeleton-shimmer rounded-full" />
            </div>
          </div>
          <div className="mt-2 flex justify-center">
            <div className="h-3.5 w-44 skeleton-shimmer rounded-full" />
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 overflow-y-auto phone-scroll px-4 pt-3 space-y-5">
          {/* Banner skeleton */}
          <div className="h-[100px] w-full skeleton-shimmer rounded-2xl" />
          <div className="flex justify-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 skeleton-shimmer rounded-full" />
            ))}
          </div>
          {/* Section header skeleton */}
          <div className="h-4 w-40 skeleton-shimmer rounded" />
          {/* Store toggle skeleton */}
          <div className="h-8 w-48 skeleton-shimmer rounded-xl" />
          {/* Horizontal cards skeleton */}
          <div className="flex gap-2.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-[140px] shrink-0 space-y-0">
                <div className="h-[105px] w-full skeleton-shimmer rounded-2xl rounded-b-none" />
                <div className="space-y-2 p-2.5 bg-white rounded-2xl rounded-t-none border border-t-0 border-brand-grey-200/50">
                  <div className="h-2.5 w-12 skeleton-shimmer rounded" />
                  <div className="h-3 w-24 skeleton-shimmer rounded" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-10 skeleton-shimmer rounded" />
                    <div className="h-8 w-8 skeleton-shimmer rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Ambassador skeleton */}
          <div className="h-[60px] w-full skeleton-shimmer rounded-2xl" />
          {/* Offers section skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-36 skeleton-shimmer rounded" />
            <div className="h-5 w-14 skeleton-shimmer rounded-full ms-auto" />
          </div>
          <div className="flex gap-2.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-[140px] shrink-0 space-y-0">
                <div className="h-[105px] w-full skeleton-shimmer rounded-2xl rounded-b-none" />
                <div className="space-y-2 p-2.5 bg-white rounded-2xl rounded-t-none border border-t-0 border-brand-grey-200/50">
                  <div className="h-2.5 w-12 skeleton-shimmer rounded" />
                  <div className="h-3 w-20 skeleton-shimmer rounded" />
                  <div className="h-2 w-10 skeleton-shimmer rounded" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-10 skeleton-shimmer rounded" />
                    <div className="h-8 w-8 skeleton-shimmer rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Category section skeleton */}
          <div className="h-4 w-32 skeleton-shimmer rounded" />
          <div className="grid grid-cols-2 gap-2.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[88px] skeleton-shimmer rounded-2xl" />
            ))}
          </div>
          {/* Store section skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-32 skeleton-shimmer rounded" />
            <div className="h-5 w-14 skeleton-shimmer rounded-full ms-auto" />
          </div>
          <div className="flex gap-2.5">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex-1 h-[110px] skeleton-shimmer rounded-2xl" />
            ))}
          </div>
        </div>
        <BottomNavBar activeTab="home" onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-brand-grey-100">
      {/* ===== Sticky Header ===== */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 pb-2 pt-9 border-b border-brand-grey-200/60">
        <div className="flex items-center justify-between">
          {/* Right side (RTL) — StudyLink Text Logo (LTR to prevent reversal) */}
          <div className="flex items-center" dir="ltr">
            <span className="text-[17px] font-bold text-navy-900">Study</span>
            <span className="text-[17px] font-bold text-sky-500">Link</span>
          </div>

          {/* Left side — Cart + Search */}
          <div className="flex items-center gap-2">
            <button data-tap="44"
              onClick={() => onNavigate('cart')}
              aria-label="السلة"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-grey-100 text-navy-800 active:scale-95 transition-transform tap-44"
              style={{ minWidth: 48, minHeight: 48 }}
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -start-0.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-sky-500 text-white text-[12px] font-bold sl-num px-0.5">
                  {cartCount}
                </span>
              )}
            </button>
            <button data-tap="44" aria-label="بحث"
              onClick={() => onNavigate('search')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-grey-100 text-navy-800 active:scale-95 transition-transform tap-44"
              style={{ minWidth: 48, minHeight: 48 }}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* Green delivery bar */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          <span className="text-[12px] font-semibold text-success">
            توصيل أو استلام من المكتبة
          </span>
        </div>
      </div>

      {/* ===== Scrollable Content ===== */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto phone-scroll">

        {/* ===== 1. Draggable Hero Banner with Peek ===== */}
        <div className="pt-3">
          <div
            ref={bannerScrollRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="عروض StudyLink"
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar rail-gutter"
            onTouchStart={pauseAutoScroll}
            onMouseDown={pauseAutoScroll}
          >
            {banners.map((banner, i) => (
              <div
                key={i}
                ref={node => { bannerItemRefs.current[i] = node }}
                role="group"
                aria-roledescription="شريحة"
                aria-label={`${i + 1} من ${banners.length}`}
                className="relative h-[110px] min-w-[86%] snap-center snap-always shrink-0 rounded-2xl overflow-hidden"
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className={`absolute inset-0 bg-gradient-to-l ${banner.overlay}`} />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-4 text-white z-10">
                  <span className="text-[12px] text-white/80 font-medium">{banner.subtitle}</span>
                  <span className="mt-0.5 block text-[14px] font-bold leading-tight">{banner.title}</span>
                  <span className="text-[12px] text-white/60">{banner.subtext}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Banner Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`اذهب للعرض ${i + 1}`}
                aria-current={bannerSnapIndex === i ? 'true' : undefined}
                onClick={() => { scrollToBanner(i); pauseAutoScroll() }}
                className="relative overflow-hidden rounded-full transition-all duration-300 before:absolute before:-inset-2 before:content-['']"
                style={{ width: bannerSnapIndex === i ? 20 : 6, height: 6 }}
              >
                <div className="absolute inset-0 rounded-full bg-brand-grey-300" />
                {bannerSnapIndex === i && isAutoScrolling && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-sky-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                    key={`progress-${bannerSnapIndex}`}
                  />
                )}
                {bannerSnapIndex === i && !isAutoScrolling && (
                  <div className="absolute inset-0 rounded-full bg-sky-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ===== 2. "محاضراتك في أسرع وقت" — Fast Track Section ===== */}
        <div className="pt-4">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span className="text-[13px] font-bold text-navy-900">
                محاضرات الأسبوع في أسرع وقت
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button data-tap="44"
                onClick={() => {
                  if (!selectedGrade) return
                  setShowBundleBuilder(true)
                }}
                disabled={!selectedGrade}
                className={`flex items-center gap-1 rounded-xl bg-white border border-sky-300/70 px-3 py-1.5 text-[12px] font-bold shadow-sm shadow-sky-500/10 active:scale-95 transition-all duration-200 ${
                  selectedGrade
                    ? 'text-sky-600 active:shadow-md active:bg-sky-50'
                    : 'text-brand-grey-400 border-brand-grey-200 cursor-not-allowed'
                }`}
                style={{ minHeight: 48 }}
              >
                <Package className="h-3.5 w-3.5" />
                <span>كل محاضراتك في ضغطة</span>
              </button>
            </div>
          </div>

          {/* Inline grade selector — only in lecture section, not full screen */}
          {!selectedGrade && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mt-3 overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-br from-white to-sky-50/80 p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-sky-900">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-navy-900 leading-tight">
                    قولنا على دفعتك!
                  </p>
                  <p className="text-[12px] text-brand-grey-500">
                    هنعرضلك المحاضرات المناسبة لك
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ALL_GRADES.map((grade, i) => (
                  <motion.button data-tap="44"
                    key={grade}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    onClick={() => setSelectedGrade(grade)}
                    className="rounded-xl bg-white border border-brand-grey-200/60 py-2.5 text-[12px] font-bold text-navy-800 shadow-sm active:scale-95 transition-all hover:border-sky-400 hover:text-sky-700 hover:bg-sky-50"
                  >
                    {grade.replace('الفرقة ', '')}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* اختيار المكتبة.
              ما تغيّر: كان الزر المربّع بجانب المجموعة يحمل `w-8 h-8` مع
              `minWidth/minHeight: 48` inline، فيرسم مربّعًا 48px بمحتوى 32px
              يبدو منفصلًا عن المجموعة. وكان الدخول للمكتبة مربوطًا بـ
              `onContextMenu` — ضغطة يمين لا وجود لها على الموبايل، أي أن
              المسار كان غير قابل للاكتشاف. */}
          {selectedGrade && (
          <div className="mt-3 px-4">
            <div className="flex items-center gap-2">
              <div
                role="tablist"
                aria-label="اختر المكتبة"
                className="flex-1 flex rounded-xl bg-brand-grey-200/60 p-1 gap-1"
              >
                {(['هارفرد', 'برلين'] as StoreType[]).map((store) => {
                  const status = storeStatus[store]
                  const isActive = activeStore === store
                  return (
                    <button
                      key={store}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        if (!status.open) { setShowClosedSheet(true); return }
                        setActiveStore(store)
                      }}
                      className={`flex-1 min-h-[44px] px-3 rounded-lg text-[13px] font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5 ${
                        isActive ? 'bg-white text-navy-800 shadow-sm' : 'text-brand-grey-500'
                      }`}
                    >
                      <span>{store}</span>
                      {!status.open && (
                        <span className="text-[12px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md font-medium leading-none">
                          مغلقة
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <button data-tap="44"
                type="button"
                onClick={() => onNavigate(activeStore === 'هارفرد' ? 'library-harvard' : 'library-berlin')}
                aria-label={`ادخل مكتبة ${activeStore}`}
                className="h-[44px] px-3 flex items-center justify-center gap-1.5 rounded-xl bg-white border border-brand-grey-200 text-[13px] font-semibold text-navy-800 active:bg-brand-grey-50 transition-colors"
              >
                <Store className="w-4 h-4 text-sky-600" aria-hidden="true" />
                <span>ادخل</span>
              </button>
            </div>
          </div>
          )}

          {/* Horizontal lecture cards — only when grade selected */}
          {selectedGrade && (
          <div className="mt-3">
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar rail-gutter">
              {lectureProducts.map((product) => (
                <LectureProductCard
                  key={product.id}
                  product={product}
                  quantity={getCartQuantity(product.id)}
                  justAdded={justAddedIds.has(product.id)}
                  onAdd={addToCart}
                  onIncrement={(pid) => updateQuantity(pid, getCartQuantity(pid) + 1)}
                  onDecrement={(pid) => {
                    if (getCartQuantity(pid) <= 1) removeFromCart(pid)
                    else updateQuantity(pid, getCartQuantity(pid) - 1)
                  }}
                  onClick={() => setDetailProduct(product)}
                />
              ))}
            </div>
          </div>
          )}
        </div>

        {/* ===== 3. Ambassador Card — Gradient Border ===== */}
        <div className="mx-4 mt-4">
          {/* الإطار المتدرّج ثلاثي الدرجات صار حدًّا واحدًا: البطاقة تنافس
              بطاقة الموسم على الانتباه بلا داعٍ. */}
          <div className="rounded-2xl border border-sky-200 bg-white shadow-sm">
            <div className="flex items-center justify-between overflow-hidden rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                  <Users className="h-5 w-5 text-sky-500" aria-hidden />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-navy-900">
                    انضم لسفراء StudyLink
                  </p>
                  <p className="mt-0.5 text-[12px] text-brand-grey-500">
                    وفّر على زمايلك + كسب عمولة على كل طلب
                  </p>
                </div>
              </div>
              <button data-tap="44"
                onClick={() => onNavigate('ambassador')}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-sky-500 px-3 py-2 text-[12px] font-bold text-white active:scale-95 transition-transform shadow-sm shadow-sky-500/25"
                style={{ minHeight: 48 }}
              >
                <Users className="h-3.5 w-3.5" />
                <span>انضم</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== 4. "عروض مينفعش تفوتك" Section ===== */}
        <div className="pt-4">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-900" />
              <span className="text-[13px] font-bold text-navy-900">
                عروض مينفعش تفوتك
              </span>
            </div>
            <button data-tap="44"
              onClick={() => onNavigate('lectures')}
              className="flex items-center gap-0.5 text-[12px] font-semibold text-sky-500 active:opacity-70 transition-opacity"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 no-scrollbar rail-gutter">
            {offerProducts.map((product) => (
              <OfferProductCard
                key={product.id}
                product={product}
                quantity={getCartQuantity(product.id)}
                justAdded={justAddedIds.has(product.id)}
                onAdd={addToCart}
                onIncrement={(pid) => updateQuantity(pid, getCartQuantity(pid) + 1)}
                onDecrement={(pid) => {
                  if (getCartQuantity(pid) <= 1) removeFromCart(pid)
                  else updateQuantity(pid, getCartQuantity(pid) - 1)
                }}
                onClick={() => setDetailProduct(product)}
              />
            ))}
          </div>
        </div>

        {/* ===== Recently Viewed ===== */}
        <AnimatePresence>
          {recentlyViewed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pt-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <h3 className="text-[13px] font-bold text-navy-900">
                      شوهدت مؤخراً
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button data-tap="44"
                      onClick={() => onNavigate('search')}
                      className="flex items-center gap-0.5 text-[12px] font-semibold text-sky-500 active:opacity-70 transition-opacity"
                    >
                      <span>عرض الكل</span>
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button data-tap="44"
                      onClick={clearRecentlyViewed}
                      className="flex items-center gap-1 text-[12px] font-semibold text-brand-grey-400 active:opacity-70 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>مسح</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {recentlyViewed.map((p) => (
                    <motion.button data-tap="44" aria-label="صورة"
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setDetailProduct(p)}
                      className="flex-shrink-0 w-[100px] bg-white rounded-xl border border-brand-grey-200/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden text-start"
                    >
                      <div className="relative w-full aspect-square overflow-hidden bg-brand-grey-50">
                        <Image
                          src={p.image || asset('/studylink-icon.png')}
                          alt={p.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-[12px] font-bold text-navy-900 line-clamp-1 leading-tight">
                          {p.title}
                        </p>
                        <span className="sl-num text-[12px] font-bold text-navy-800 mt-1 block">
                          {p.price.toFixed(2)} ج.م
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== 5. "تسوّق حسب الفئة" — Category Cards (enhanced) ===== */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[13px] font-bold text-navy-900">
              تسوّق حسب الفئة
            </h3>
            <button data-tap="44"
              onClick={() => onNavigate('lectures')}
              className="flex items-center gap-0.5 text-[12px] font-semibold text-sky-500 active:opacity-70 transition-opacity"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="h-3 w-3" />
            </button>
          </div>
          {/* ── المدخل الموسمي ──────────────────────────────────────────────
              البطاقة الوحيدة التي يتغيّر محتواها بتغيّر الوقت لا بتغيّر
              المستخدم، فأخذت أقوى سطح في النظام (الحبر) وعرضًا كاملًا وشارة
              موسم صريحة — تمييز وظيفي لا زخرفي.
              كل نصوصها من `src/lib/season.ts` · بدّل `ACTIVE_SEASON` فقط. */}
          <button
            data-tap="44"
            onClick={() => onNavigate(activeSeason.screen)}
            className="relative w-full overflow-hidden rounded-2xl bg-navy-800 p-4 text-start text-white shadow-sm shadow-navy-800/20 active:scale-[0.99] transition-transform mb-2.5"
          >
            <div className="relative z-10 flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                <CalendarClock className="h-[18px] w-[18px] text-amber-200" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-navy-900 bg-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {activeSeason.chip}
                  </span>
                  <span className="text-[12px] text-white/60 truncate">يتغيّر كل موسم</span>
                </div>
                <p className="mt-1.5 text-[14px] font-bold leading-tight">{activeSeason.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-white/70">{activeSeason.subtitle}</p>
              </div>
              <ArrowLeft className="mt-1 h-4 w-4 flex-shrink-0 text-white/50" aria-hidden />
            </div>
          </button>

          {/* ── التصنيفات الثلاثة ───────────────────────────────────────────
              شكل واحد للثلاثة، والفرق الوحيد بينها زوج لون التصنيف من
              `lib/category.ts`. كانت أربع بطاقات بأربعة تدرّجات وأيقونات لا
              علاقة لها بمحتواها (قارورة كيمياء لـ«أدوات مكتبية»)، وأعداد
              مخزون مُختلَقة («60+ منتج») تخالف بوابة الادعاءات. */}
          <div className="grid grid-cols-3 gap-2.5">
            {CATEGORY_ORDER.map((key) => {
              const c = CATEGORY[key]
              return (
                <button
                  key={key}
                  data-tap="44"
                  onClick={() => onNavigate(key === 'محاضرات' ? 'lectures' : 'tools')}
                  className={`flex flex-col items-start gap-2 rounded-2xl border ${c.border} ${c.bg} p-3 text-start active:scale-[0.98] transition-transform`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/70">
                    <c.Icon className={`h-4.5 w-4.5 ${c.iconInk}`} aria-hidden />
                  </span>
                  <span className={`text-[12px] font-bold leading-tight ${c.ink}`}>{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ===== 6. "مكتباتنا المعتمدة" Section (Storefront Cards) ===== */}
        <div className="px-4 pt-4 pb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[13px] font-bold text-navy-900">
              مكتباتنا المعتمدة
            </h3>
            <button data-tap="44"
              onClick={() => onNavigate('lectures')}
              className="flex items-center gap-0.5 text-[12px] font-semibold text-sky-500 active:opacity-70 transition-opacity"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="h-3 w-3" />
            </button>
          </div>

          <div className="flex gap-3">
            {/* ── Harvard Storefront Card ── */}
            <motion.button data-tap="44"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={() => onNavigate('library-harvard')}
              className="flex-1 rounded-2xl border border-brand-grey-200/50 bg-white text-start shadow-[0_1px_4px_rgba(0,0,0,0.04)] active:shadow-md transition-all overflow-hidden"
            >
              <div className="p-3.5 flex flex-col gap-2.5">
                {/* Layer 1: Visual Identity */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-brand-grey-100">
                    <Image src={asset('/banners/harvard-logo.png')} alt="" aria-hidden="true" width={36} height={36} className="w-full h-full object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-navy-900 leading-tight">هارفرد</p>
                    <p className="text-[12px] text-brand-grey-400 mt-0.5">مكتبة شريكة — مذكرات مطبوعة</p>
                  </div>
                </div>

                {/* Layer 2: System Status */}
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    مفتوح الآن
                  </span>
                </div>

                {/* Note count */}
                <div className="pt-1">
                  <span className="text-[12px] font-semibold text-navy-700">مذكرات كل الفرق</span>
                </div>
              </div>
            </motion.button>

            {/* ── Berlin Storefront Card ── */}
            <motion.button data-tap="44"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              onClick={() => onNavigate('library-berlin')}
              className="flex-1 rounded-2xl border border-brand-grey-200/50 bg-white text-start shadow-[0_1px_4px_rgba(0,0,0,0.04)] active:shadow-md transition-all overflow-hidden"
            >
              <div className="p-3.5 flex flex-col gap-2.5">
                {/* Layer 1: Visual Identity */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-brand-grey-100">
                    <Image src={asset('/banners/berlin-logo.png')} alt="" aria-hidden="true" width={36} height={36} className="w-full h-full object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-navy-900 leading-tight">برلين</p>
                    <p className="text-[12px] text-brand-grey-400 mt-0.5">مكتبة شريكة — مذكرات وأدوات</p>
                  </div>
                </div>

                {/* Layer 2: System Status (Closed — yellow, order now message) */}
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                    مغلقة الآن
                  </span>
                </div>

                {/* Note count */}
                <div className="pt-1">
                  <span className="text-[12px] font-semibold text-navy-700">90+ مذكرة</span>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Extra padding for bottom nav */}
        <div className="h-2 pb-4" />
      </div>

      {/* ===== Scroll-to-Top Button ===== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button data-tap="44" aria-label="طَي"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="absolute bottom-20 end-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-navy-900/15 border border-brand-grey-200/50 text-navy-700 active:scale-90 transition-transform tap-44"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== Bottom Navigation ===== */}
      <BottomNavBar activeTab="home" onNavigate={onNavigate} />

      {/* ===== Product Detail Bottom Sheet ===== */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailScreen
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* ===== Bundle Builder Sheet ===== */}
      <AnimatePresence>
        {showBundleBuilder && selectedGrade && (
          <BundleBuilderSheet
            isOpen={showBundleBuilder}
            onClose={() => setShowBundleBuilder(false)}
            store={activeStore}
            grade={selectedGrade}
          />
        )}
      </AnimatePresence>

      {/* ===== Library Closed Sheet ===== */}
      <AnimatePresence>
        {showClosedSheet && (
          <LibraryClosedSheet
            storeName="برلين"
            reopenTime="غداً الساعة 9:00 صباحاً"
            onClose={() => setShowClosedSheet(false)}
            onPreOrder={() => {
              setShowClosedSheet(false)
              setActiveStore('برلين')
              toast.success('تم تفعيل الطلب المسبق', {
                style: { direction: 'rtl', fontSize: '12px' },
              })
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────── Lecture Product Card (horizontal scroll) ───────────── */
function LectureProductCard({
  product,
  quantity,
  justAdded,
  onAdd,
  onIncrement,
  onDecrement,
  onClick,
}: {
  product: Product
  quantity: number
  justAdded: boolean
  onAdd: (id: string, title: string) => void
  onIncrement: (productId: string) => void
  onDecrement: (productId: string) => void
  onClick: () => void
}) {
  return (
    <div className="w-[140px] shrink-0" onClick={onClick}>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-grey-200/50 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-sky-500/10 transition-shadow duration-300">
        {/* Image with gradient overlay */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-brand-grey-50">
          <Image
            src={product.image || asset('/studylink-icon.png')}
            alt={product.title}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          {/* Bundle badge */}
          {product.isBundle && (
            <span className="absolute top-1.5 start-1.5 text-[11px] font-bold text-white bg-navy-800/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
              باقة {product.bundleCount} مذكرات
            </span>
          )}
          {/* "جديد" badge for week === 1 */}
          {product.week === 1 && !product.isBundle && (
            <span className="absolute top-1.5 start-1.5 text-[11px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded-md shadow-sm">
              جديد
            </span>
          )}
          {/* Discount badge */}
          {product.originalPrice && !product.isBundle && product.week !== 1 && (
            <span className="absolute top-1.5 end-1.5 text-[11px] font-bold text-white bg-error px-1.5 py-0.5 rounded-md">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col p-2.5">
          {/* Doctor name (10pt muted) */}
          <span className="text-[12px] text-brand-grey-500 leading-none">
            {product.doctor}
          </span>
          {/* Title (dark, clamped 2 lines) */}
          <span className="mt-1 text-[12px] font-medium text-navy-900 leading-[1.35] line-clamp-2">
            {product.title}
          </span>
          {/* Price (BOLDEST) + add/check button */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-0.5">
              <span className="sl-num text-[14px] font-bold text-navy-800">
                {product.price}
              </span>
              <span className="text-[12px] text-brand-grey-500">ج.م</span>
              {product.originalPrice && (
                <span className="ms-1 text-[12px] text-brand-grey-400 sl-num line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
            {quantity > 0 ? (
              <QuantityControl
                quantity={quantity}
                onIncrement={() => onIncrement(product.id)}
                onDecrement={() => onDecrement(product.id)}
              />
            ) : (
              <motion.button aria-label="أضف للسلة" data-tap="44"
                onClick={(e) => {
                  e.stopPropagation()
                  onAdd(product.id, product.title)
                }}
                whileTap={{ scale: 0.85 }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white transition-colors shadow-sm shadow-sky-500/25 tap-44"
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="plus"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────── Offer Product Card (horizontal scroll) ───────────── */
function OfferProductCard({
  product,
  quantity,
  justAdded,
  onAdd,
  onIncrement,
  onDecrement,
  onClick,
}: {
  product: Product
  quantity: number
  justAdded: boolean
  onAdd: (id: string, title: string) => void
  onIncrement: (productId: string) => void
  onDecrement: (productId: string) => void
  onClick: () => void
}) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPct = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0
  const savingsAmount = hasDiscount ? (product.originalPrice! - product.price).toFixed(0) : '0'

  return (
    <div className="w-[140px] shrink-0" onClick={onClick}>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-grey-200/50 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-sky-500/10 transition-shadow duration-300">
        {/* Image with gradient overlay */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-brand-grey-50">
          <Image
            src={product.image || asset('/studylink-icon.png')}
            alt={product.title}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          {/* Badges */}
          <div className="absolute top-1.5 start-1.5 flex flex-col gap-1">
            {product.isBundle && (
              <span className="text-[11px] font-bold text-white bg-navy-800/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                باقة {product.bundleCount} مذكرات
              </span>
            )}
            {product.week === 1 && !product.isBundle && (
              <span className="text-[11px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded-md shadow-sm">
                جديد
              </span>
            )}
            {hasDiscount && !product.isBundle && product.week !== 1 && (
              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white bg-amber-500">
                خصم {discountPct}%
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-2.5">
          <span className="text-[12px] text-brand-grey-500 leading-none">
            {product.doctor}
          </span>
          <span className="mt-0.5 text-[12px] font-bold text-navy-900 leading-[1.35] line-clamp-2">
            {product.title}
          </span>
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                {hasDiscount && (
                  <span className="text-[12px] text-brand-grey-400 line-through sl-num">
                    {product.originalPrice}
                  </span>
                )}
                <span className="font-black text-navy-900 sl-num text-[15px]">
                  {product.price}
                </span>
                <span className="text-[12px] text-brand-grey-400">ج.م</span>
              </div>
              {quantity > 0 ? (
                <QuantityControl
                  quantity={quantity}
                  onIncrement={() => onIncrement(product.id)}
                  onDecrement={() => onDecrement(product.id)}
                />
              ) : (
                <motion.button aria-label="أضف للسلة" data-tap="44"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAdd(product.id, product.title)
                  }}
                  whileTap={{ scale: 0.85 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white transition-colors shadow-sm shadow-sky-500/25 tap-44"
                  style={{ minWidth: 48, minHeight: 48 }}
                >
                  <AnimatePresence mode="wait">
                    {justAdded ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="plus"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
            {hasDiscount && (
              <div className="mt-0.5 flex items-center gap-0.5">
                <Check className="w-3 h-3 text-teal-600" />
                <span className="text-[12px] font-semibold text-teal-600">وفرت {savingsAmount} ج.م</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}