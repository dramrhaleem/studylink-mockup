'use client'

import { asset } from '@/lib/asset'
import { categoryStyle } from '@/lib/category'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Search,
  Plus,
  Check,
  ShoppingCart,
  Package,
  X,
  GraduationCap,
  Clock,
  AlertTriangle,
  AlertCircle,
  Store,
  Layers,
  BookOpen,
  FileText,
  Stethoscope,
  Sparkles,
  Flame,
  BadgePercent,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import BottomNavBar from '@/components/studylink/BottomNavBar'
import CartHeaderButton from '@/components/studylink/CartHeaderButton'
import VariantSelectionSheet from '@/components/studylink/VariantSelectionSheet'
import {
  products,
  ALL_GRADES,
  type StoreType,
  type Product,
  type GradeType,
  isProductForGrade,
  getSubjectsForGrade,
} from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface LibraryScreenProps {
  storeName: StoreType
  onNavigate?: (screen: string) => void
}

/* ─── Store config with logos & descriptions ─── */
const STORE_CONFIG: Record<StoreType, {
  open: boolean
  reopenTime: string
  label: string
  logo: string
  description: string
  banners: { image: string; overlay: string; title: string; subtitle: string }[]
}> = {
  'هارفرد': {
    open: true,
    reopenTime: '',
    label: 'مكتبة هارفرد',
    logo: asset('/banners/harvard-logo.png'),
    description: 'مكتبة شريكة تطبع مذكرات وملخصات لكل الفرق، ومنها تُجمَّع الطلبات. حالة كل منتج وسعره مكتوبان قبل الإضافة للسلة.',
    banners: [
      { image: asset('/banners/library-harvard-banner-1.png'), overlay: 'from-navy-900/80 via-navy-900/50 to-transparent', title: 'خصم 15% على كل المحاضرات', subtitle: 'عرض حصري لفترة محدودة' },
      { image: asset('/banners/library-harvard-banner-2.png'), overlay: 'from-sky-900/80 via-sky-900/50 to-transparent', title: 'محاضرات الأسبوع الجاهزة', subtitle: 'شرح نظري + ورق عملي' },
    ],
  },
  'برلين': {
    open: false,
    reopenTime: 'غداً الساعة 9:00 صباحاً',
    label: 'مكتبة برلين',
    logo: asset('/banners/berlin-logo.png'),
    description: 'مكتبة شريكة تطبع المراجع والمذكرات الطبية. المواعيد وحالة التوفّر معروضة في الصفحة، والطلب يُجمَّع منها.',
    banners: [
      { image: asset('/banners/library-berlin-banner-1.png'), overlay: 'from-navy-900/80 via-navy-900/50 to-transparent', title: 'عروض برلين الحصرية', subtitle: 'افتتاح قريباً — ترقبوا!' },
    ],
  },
}

/* ─── Fuzzy match helper ─── */
function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true
  const q = query.trim().toLowerCase()
  if (!q) return true
  const t = text.toLowerCase()
  let qi = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++
  }
  if (qi === q.length) return true
  return t.includes(q)
}

/* ─── Animation variants ─── */
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

/* ─── Segmented control type ─── */
type StoreTab = 'محاضرات' | 'أدوات'

export default function LibraryScreen({ storeName, onNavigate }: LibraryScreenProps) {
  const storeConfig = STORE_CONFIG[storeName]

  // ─── Store state ───
  const selectedGrade = useStudylinkStore((s) => s.selectedGrade)
  const setSelectedGrade = useStudylinkStore((s) => s.setSelectedGrade)
  const addToCartStore = useStudylinkStore((s) => s.addToCart)
  const isInCartStore = useStudylinkStore((s) => s.isInCart)

  // ─── Local state ───
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSubject, setActiveSubject] = useState<string | null>(null)
  const [activeToolCategory, setActiveToolCategory] = useState<string | null>(null)
  const [showGradeSheet, setShowGradeSheet] = useState(!selectedGrade)
  const [variantProduct, setVariantProduct] = useState<Product | null>(null)
  const [justAddedIds, setJustAddedIds] = useState<Set<string>>(new Set())
  const [storeTab, setStoreTab] = useState<StoreTab>('محاضرات')
  const [bannerSnapIndex, setBannerSnapIndex] = useState(0)
  const [showSearch, setShowSearch] = useState(false)

  // ─── Refs ───
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const toolSectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const toolScrollSpyRef = useRef<{ current: string | null; manual: boolean }>({ current: null, manual: false })
  const bannerScrollRef = useRef<HTMLDivElement>(null)
  const weekScrollRef = useRef<HTMLDivElement>(null)
  const offersScrollRef = useRef<HTMLDivElement>(null)

  // ─── Banner scroll-spy ───
  useEffect(() => {
    const el = bannerScrollRef.current
    if (!el) return
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft
      const itemWidth = el.offsetWidth * 0.88 + 12
      const idx = Math.round(scrollLeft / itemWidth)
      if (idx !== bannerSnapIndex && idx >= 0 && idx < storeConfig.banners.length) {
        setBannerSnapIndex(idx)
      }
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [bannerSnapIndex, storeConfig.banners.length])

  // ─── Derived data ───
  const gradeSubjects = useMemo(() => {
    if (!selectedGrade) return []
    return getSubjectsForGrade(selectedGrade)
  }, [selectedGrade])

  // All products for this store (filtered by grade for lectures)
  const allStoreProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.store !== storeName) return false
      if (p.category === 'محاضرات') {
        if (!selectedGrade) return false
        return isProductForGrade(p, selectedGrade)
      }
      return true
    })
  }, [storeName, selectedGrade])

  // Filtered by search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return allStoreProducts
    return allStoreProducts.filter((p) => {
      return fuzzyMatch(searchQuery, p.title) || fuzzyMatch(searchQuery, p.doctor || '')
    })
  }, [allStoreProducts, searchQuery])

  // Group by category
  const lectures = useMemo(() => filteredProducts.filter((p) => p.category === 'محاضرات'), [filteredProducts])
  const medicalTools = useMemo(() => filteredProducts.filter((p) => p.category === 'أدوات طبية'), [filteredProducts])
  const stationery = useMemo(() => filteredProducts.filter((p) => p.category === 'أدوات مكتبية'), [filteredProducts])

  // Group lectures by subject
  const lecturesBySubject = useMemo(() => {
    const map = new Map<string, Product[]>()
    for (const p of lectures) {
      const subj = p.subject || 'أخرى'
      if (!map.has(subj)) map.set(subj, [])
      map.get(subj)!.push(p)
    }
    return map
  }, [lectures])

  // All tools combined
  const allTools = useMemo(() => [...medicalTools, ...stationery], [medicalTools, stationery])

  // Tool categories derived from available tools
  const toolCategories = useMemo(() => {
    const cats: string[] = []
    if (medicalTools.length > 0) cats.push('أدوات طبية')
    if (stationery.length > 0) cats.push('أدوات مكتبية')
    return cats
  }, [medicalTools.length, stationery.length])

  // "This week" products — lectures that are available, latest first (slice by week)
  const weekProducts = useMemo(() => {
    return lectures
      .filter((p) => p.available && p.week)
      .sort((a, b) => (b.week || 0) - (a.week || 0))
      .slice(0, 8)
  }, [lectures])

  // Offer/discounted products
  const offerProducts = useMemo(() => {
    return filteredProducts
      .filter((p) => p.originalPrice && p.originalPrice > p.price && p.available)
      .slice(0, 8)
  }, [filteredProducts])

  // Scroll-spy
  const scrollSpyRef = useRef<{ current: string | null; manual: boolean }>({ current: null, manual: false })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollSpyRef.current.manual) return
        let bestEntry: IntersectionObserverEntry | null = null
        let bestRatio = 0
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestEntry = entry
          }
        }
        if (bestEntry) {
          const subject = bestEntry.target.getAttribute('data-subject')
          if (subject && scrollSpyRef.current.current !== subject) {
            scrollSpyRef.current.current = subject
            setActiveSubject(subject)
          }
        }
      },
      {
        root: el,
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '-100px 0px -60% 0px',
      }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [gradeSubjects, selectedGrade])

  // ─── Tool scroll-spy (scroll event based — more reliable for tall sections) ───
  useEffect(() => {
    if (storeTab !== 'أدوات') return
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      if (toolScrollSpyRef.current.manual) return

      const containerRect = el.getBoundingClientRect()
      const anchorY = containerRect.top + containerRect.height * 0.3

      let closest: string | null = null
      let closestDist = Infinity

      for (const [cat, ref] of Object.entries(toolSectionRefs.current)) {
        if (!ref) continue
        const sectionTop = ref.getBoundingClientRect().top
        const dist = sectionTop - anchorY
        if (dist <= 0 && Math.abs(dist) < closestDist) {
          closestDist = Math.abs(dist)
          closest = cat
        }
      }

      if (closest && toolScrollSpyRef.current.current !== closest) {
        toolScrollSpyRef.current.current = closest
        setActiveToolCategory(closest)
      }
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [storeTab, toolCategories])

  // ─── Handlers ───
  const handleGradeSelect = useCallback((grade: GradeType) => {
    setSelectedGrade(grade)
    setShowGradeSheet(false)
    toast.success('تم تحديد الفرقة بنجاح', {
      duration: 2000,
      style: {

        direction: 'rtl',
        fontSize: '12px',
      },
    })
  }, [setSelectedGrade])

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCartStore(product)
      setJustAddedIds((prev) => new Set(prev).add(product.id))
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(30)
      }
      setTimeout(() => {
        setJustAddedIds((prev) => {
          const next = new Set(prev)
          next.delete(product.id)
          return next
        })
      }, 1200)
    },
    [addToCartStore]
  )

  const handleCTA = useCallback(
    (product: Product) => {
      if (!product.available) return
      if (product.hasVariants) {
        setVariantProduct(product)
      } else {
        handleAddToCart(product)
      }
    },
    [handleAddToCart]
  )

  const handleSubjectPillClick = useCallback((subject: string | null) => {
    scrollSpyRef.current.manual = true
    setActiveSubject(subject)
    if (subject && sectionRefs.current[subject]) {
      sectionRefs.current[subject]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setTimeout(() => { scrollSpyRef.current.manual = false }, 1500)
  }, [])

  const handleToolCategoryPillClick = useCallback((category: string | null) => {
    toolScrollSpyRef.current.manual = true
    setActiveToolCategory(category)
    if (category && toolSectionRefs.current[category]) {
      toolSectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setTimeout(() => { toolScrollSpyRef.current.manual = false }, 1500)
  }, [])

  const handlePreOrder = useCallback(() => {
    toast.success('تم تسجيل طلبك المسبق', {
      duration: 2000,
      style: {

        direction: 'rtl',
        fontSize: '12px',
      },
    })
  }, [])

  // ─── Subjects for pills ───
  const pillSubjects = useMemo(() => {
    if (!selectedGrade) return []
    return getSubjectsForGrade(selectedGrade)
  }, [selectedGrade])

  const activePill = activeSubject

  // Current tab data
  const currentTabTools = storeTab === 'أدوات' ? allTools : []

  return (
    <div className="h-full flex flex-col bg-brand-grey-100 relative overflow-hidden" dir="rtl">
      {/* ===== 1. Sticky Header — Brand Identity (Trunk Test) ===== */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-md">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 pt-9 pb-2">
          {/* Right: Back + Status */}
          <div className="flex items-center gap-2">
            <button data-tap="44" aria-label="رجوع"
              onClick={() => onNavigate?.('home')}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey-100 active:scale-90 transition-transform tap-44"
              style={{ minWidth: 48, minHeight: 48 }}
            >
              <ArrowRight className="w-[18px] h-[18px] text-navy-800" />
            </button>
            <span className="flex items-center gap-1 text-[12px] font-semibold">
              {storeConfig.open ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-teal-600">مفتوح الآن</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-error" />
                  <span className="text-error">مغلق</span>
                </>
              )}
            </span>
          </div>

          {/* Center: Logo + Name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-brand-grey-200 shadow-sm flex-shrink-0">
              <Image src={storeConfig.logo} alt={storeConfig.label} width={32} height={32} className="w-full h-full object-cover" unoptimized />
            </div>
            <h1 className="text-[15px] font-bold text-navy-900">{storeConfig.label}</h1>
          </div>

          {/* Left: Search + Cart */}
          <div className="flex items-center gap-1.5">
            <button data-tap="44" aria-label="بحث"
              onClick={() => setShowSearch(!showSearch)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey-100 active:scale-90 transition-transform tap-44"
              style={{ minWidth: 48, minHeight: 48 }}
            >
              <Search className="w-[18px] h-[18px] text-navy-800" />
            </button>
            <CartHeaderButton onNavigate={onNavigate} />
          </div>
        </div>

        {/* Collapsible Search Bar (Fuzzy Search — library-scoped) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-2.5">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`ابحث في ${storeConfig.label} فقط...`}
                    className="w-full h-10 pe-9 ps-9 rounded-xl bg-brand-grey-100 border-none outline-none text-[13px] text-navy-900 placeholder:text-brand-grey-400 focus:ring-2 focus:ring-sky-500/30 transition-shadow"
                    autoFocus
                  />
                  {searchQuery && (
                    <button data-tap="44" aria-label="إغلاق"
                      onClick={() => setSearchQuery('')}
                      className="absolute end-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-brand-grey-200/60 active:scale-90 transition-transform tap-44"
                    >
                      <X className="w-3 h-3 text-brand-grey-500" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Segmented Control — Visibility-first */}
        {selectedGrade && !showSearch && (
          <div className="px-4 pb-2">
            <div className="flex bg-brand-grey-100 rounded-xl p-1 gap-1">
              <button data-tap="44"
                onClick={() => { setStoreTab('محاضرات'); setActiveSubject(null); setActiveToolCategory(null) }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 ${
                  storeTab === 'محاضرات'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-brand-grey-500'
                }`}
                style={{ minHeight: 44 }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>المذكرات</span>
              </button>
              {allTools.length > 0 && (
                <button data-tap="44"
                  onClick={() => { setStoreTab('أدوات'); setActiveSubject(null); setActiveToolCategory(null) }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 ${
                    storeTab === 'أدوات'
                      ? 'bg-white text-navy-900 shadow-sm'
                      : 'text-brand-grey-500'
                  }`}
                  style={{ minHeight: 44 }}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>الأدوات</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scroll-Spy Category Pills — Tools Tab */}
        {selectedGrade && storeTab === 'أدوات' && !showSearch && toolCategories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2.5 no-scrollbar rail-gutter">
            <button data-tap="44"
              onClick={() => handleToolCategoryPillClick(null)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                !activeToolCategory
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
              }`}
              style={{ minHeight: 48 }}
            >
              الكل
            </button>
            {toolCategories.map((cat) => (
              <button data-tap="44"
                key={cat}
                onClick={() => handleToolCategoryPillClick(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                  activeToolCategory === cat
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                    : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
                }`}
                style={{ minHeight: 48 }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Scroll-Spy Subject Pills (only for محاضرات tab) */}
        {selectedGrade && storeTab === 'محاضرات' && !showSearch && pillSubjects.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2.5 no-scrollbar rail-gutter">
            <button data-tap="44"
              onClick={() => handleSubjectPillClick(null)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                !activePill
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
              }`}
              style={{ minHeight: 48 }}
            >
              الكل
            </button>
            {pillSubjects.map((subject) => (
              <button data-tap="44"
                key={subject}
                onClick={() => handleSubjectPillClick(subject)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                  activePill === subject
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                    : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
                }`}
                style={{ minHeight: 48 }}
              >
                {subject}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== Scrollable Content ===== */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 phone-scroll">
        <div className="pb-4">

          {/* Closed Library Banner */}
          {!storeConfig.open && (
            <div className="mx-4 mt-3">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-amber-50 border border-amber-200/60 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-amber-800">المكتبة مغلقة حالياً</p>
                    <p className="text-[12px] text-amber-600 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>هترجع: {storeConfig.reopenTime}</span>
                    </p>
                    <motion.button data-tap="44"
                      whileTap={{ scale: 0.97 }}
                      onClick={handlePreOrder}
                      className="mt-3 w-full h-10 rounded-xl bg-amber-500 text-white text-[13px] font-bold flex items-center justify-center gap-1.5 active:bg-amber-600 transition-colors tap-44"
                      style={{ minHeight: 48 }}
                    >
                      <Package className="w-4 h-4" />
                      <span>طلب مسبق</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* No grade selected state */}
          {!selectedGrade && !showGradeSheet && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-grey-100 flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-brand-grey-400" />
              </div>
              <p className="text-[13px] font-semibold text-brand-grey-500 text-center">
                اختار فرقتك عشان نعرضلك المحتوى
              </p>
              <button data-tap="44"
                onClick={() => setShowGradeSheet(true)}
                className="mt-3 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-[13px] font-bold active:bg-sky-600 transition-colors"
                style={{ minHeight: 48 }}
              >
                تحديد الفرقة
              </button>
            </div>
          )}

          {/* Empty state after filtering */}
          {selectedGrade && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-grey-100 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-brand-grey-400" />
              </div>
              <p className="text-[13px] font-semibold text-brand-grey-500 text-center">
                مفيش مذكرات في القسم ده حالياً
              </p>
              <motion.button data-tap="44"
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate?.('home')}
                className="mt-3 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-[13px] font-bold active:bg-sky-600 transition-colors"
                style={{ minHeight: 48 }}
              >
                تصفح مكتبة بديلة
              </motion.button>
            </div>
          )}

          {/* ===== 2. Hero Banners (Progressive Disclosure — Peek) ===== */}
          {selectedGrade && storeConfig.banners.length > 0 && !searchQuery && (
            <div className="mt-3">
              <div
                ref={bannerScrollRef}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar rail-gutter"
                style={{ direction: 'ltr' }}
              >
                {storeConfig.banners.map((banner, i) => (
                  <div
                    key={i}
                    className="relative h-[120px] min-w-[88%] snap-start snap-always shrink-0 rounded-2xl overflow-hidden"
                  >
                    <Image src={banner.image} alt={banner.title} fill className="object-cover" unoptimized />
                    <div className={`absolute inset-0 bg-gradient-to-l ${banner.overlay}`} />
                    <div className="absolute inset-0 flex flex-col justify-center px-4 text-white z-10">
                      <span className="text-[12px] text-white/80 font-medium">{banner.subtitle}</span>
                      <span className="mt-0.5 block text-[15px] font-bold leading-tight">{banner.title}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Banner dots */}
              {storeConfig.banners.length > 1 && (
                <div className="mt-2 flex justify-center gap-1.5">
                  {storeConfig.banners.map((_, i) => (
                    <button data-tap="44"
                      key={i}
                      onClick={() => {
                        const el = bannerScrollRef.current
                        if (!el) return
                        const itemWidth = el.offsetWidth * 0.88 + 12
                        el.scrollTo({ left: itemWidth * i, behavior: 'smooth' })
                        setBannerSnapIndex(i)
                      }}
                      aria-label={`لافتة ${i + 1}`}
                      aria-current={i === bannerSnapIndex}
                      className={`tap-44 h-1.5 rounded-full transition-all duration-300 ${
                        i === bannerSnapIndex ? 'w-4 bg-sky-500' : 'w-1.5 bg-brand-grey-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== 3. Horizontal Ribbons — Fast Track ===== */}
          {selectedGrade && storeTab === 'محاضرات' && !searchQuery && (
            <>
              {/* Ribbon 1: This Week's Lectures (with social proof) */}
              {weekProducts.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between px-4 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-500" />
                      <span className="text-[13px] font-bold text-navy-900">حاجات الأسبوع ده</span>
                    </div>
                    <span className="text-[12px] text-brand-grey-400">زمايلك في الدفعة طلبوا دول كمان</span>
                  </div>
                  <div
                    ref={weekScrollRef}
                    className="flex gap-2.5 overflow-x-auto no-scrollbar rail-gutter"
                  >
                    {weekProducts.map((product) => (
                      <CompactProductCard
                        key={product.id}
                        product={product}
                        inCart={isInCartStore(product.id)}
                        justAdded={justAddedIds.has(product.id)}
                        onCTA={() => handleCTA(product)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Ribbon 2: Offers / Discounted Products */}
              {offerProducts.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between px-4 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span className="text-[13px] font-bold text-navy-900">
                        وفر مع عروض {storeConfig.label}
                      </span>
                    </div>
                  </div>
                  <div
                    ref={offersScrollRef}
                    className="flex gap-2.5 overflow-x-auto no-scrollbar rail-gutter"
                  >
                    {offerProducts.map((product) => {
                      const savings = product.originalPrice ? (product.originalPrice - product.price).toFixed(0) : '0'
                      return (
                        <OfferCard
                          key={product.id}
                          product={product}
                          savings={savings}
                          inCart={isInCartStore(product.id)}
                          justAdded={justAddedIds.has(product.id)}
                          onCTA={() => handleCTA(product)}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===== 4. Master Storefront — Category Grid Sections ===== */}

          {/* Tools Tab: 3-column grid */}
          {selectedGrade && storeTab === 'أدوات' && currentTabTools.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mt-4"
            >
              {/* Medical Tools */}
              {medicalTools.length > 0 && (
                <div
                  className="mb-5"
                  ref={(el) => { toolSectionRefs.current['أدوات طبية'] = el }}
                  data-tool-category="أدوات طبية"
                >
                  <div className="flex items-center gap-2 px-4 mb-2.5">
                    <Stethoscope className="w-4 h-4 text-sky-500" />
                    <h2 className="text-[13px] font-bold text-navy-900">أدوات طبية</h2>
                    <span className="text-[12px] text-brand-grey-400 sl-num">({medicalTools.length})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-4">
                    {medicalTools.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        inCart={isInCartStore(product.id)}
                        justAdded={justAddedIds.has(product.id)}
                        onCTA={() => handleCTA(product)}
                        gridCols={3}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Stationery */}
              {stationery.length > 0 && (
                <div
                  className="mb-5"
                  ref={(el) => { toolSectionRefs.current['أدوات مكتبية'] = el }}
                  data-tool-category="أدوات مكتبية"
                >
                  <div className="flex items-center gap-2 px-4 mb-2.5">
                    <FileText className="w-4 h-4 text-sky-500" />
                    <h2 className="text-[13px] font-bold text-navy-900">أدوات مكتبية</h2>
                    <span className="text-[12px] text-brand-grey-400 sl-num">({stationery.length})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-4">
                    {stationery.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        inCart={isInCartStore(product.id)}
                        justAdded={justAddedIds.has(product.id)}
                        onCTA={() => handleCTA(product)}
                        gridCols={3}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Lectures Tab: 2-column grid grouped by subject (in-page scroll sections) */}
          {selectedGrade && storeTab === 'محاضرات' && lecturesBySubject.size > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mt-5 space-y-5"
            >
              {Array.from(lecturesBySubject.entries()).map(([subject, prods]) => {
                const hasUnavailable = prods.some((p) => !p.available)
                const allUnavailable = prods.every((p) => !p.available)
                return (
                <div
                  key={subject}
                  ref={(el) => { sectionRefs.current[subject] = el }}
                  data-subject={subject}
                  className={hasUnavailable && allUnavailable ? 'opacity-70' : ''}
                >
                  <div className="flex items-center gap-2 px-4 mb-2.5">
                    <Layers className="w-4 h-4 text-sky-500" />
                    <h2 className="text-[13px] font-bold text-navy-900">{subject}</h2>
                    <span className="text-[12px] text-brand-grey-400 sl-num">({prods.length})</span>
                    {hasUnavailable && (
                      <span className="flex items-center gap-0.5 ms-1 px-1.5 py-0.5 rounded-full bg-amber-100 border border-amber-200/60">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span className="text-[12px] font-semibold text-amber-600">عناصر غير متوفرة</span>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 px-4">
                    {prods.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        inCart={isInCartStore(product.id)}
                        justAdded={justAddedIds.has(product.id)}
                        onCTA={() => handleCTA(product)}
                        gridCols={2}
                      />
                    ))}
                  </div>
                </div>
                )
              })}
            </motion.div>
          )}

          {/* Bottom spacing */}
          <div className="h-4 pb-4" />
        </div>
      </div>

      {/* ===== Bottom Navigation ===== */}
      <div className="flex-shrink-0">
        <BottomNavBar onNavigate={onNavigate} activeTab="lectures" noSticky />
      </div>

      {/* ===== Grade Selection Bottom Sheet (absolute — stays inside PhoneFrame) ===== */}
      <AnimatePresence>
        {showGradeSheet && (
          <GradeSelectionSheet
            onSelect={handleGradeSelect}
            onClose={() => setShowGradeSheet(false)}
          />
        )}
      </AnimatePresence>

      {/* ===== Variant Selection Sheet (absolute — stays inside PhoneFrame) ===== */}
      <AnimatePresence>
        {variantProduct && (
          <VariantSelectionSheet
            product={variantProduct}
            onClose={() => setVariantProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Compact Product Card (Horizontal Ribbon)
   ═══════════════════════════════════════════ */
function CompactProductCard({
  product,
  inCart,
  justAdded,
  onCTA,
}: {
  product: Product
  inCart: boolean
  justAdded: boolean
  onCTA: () => void
}) {
  const outOfStock = !product.available
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPct = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0
  const savingsAmount = hasDiscount ? (product.originalPrice! - product.price).toFixed(0) : '0'

  /* كانت خلفية البطاقة تُختار عشوائيًا: `gradients[charCode(id) % 5]` —
     خمسة تدرّجات لونية مختلفة تُوزَّع على المنتجات بلا أي معنى، فبدا كل رفّ
     كأنه لوحة ألوان. صارت الخلفية تتبع **تصنيف** المنتج، فاللون يحمل معلومة. */
  const cardTint = categoryStyle(product.category).iconBg

  return (
    <motion.div
      variants={cardVariants}
      className={`shrink-0 w-[150px] bg-white rounded-2xl shadow-sm overflow-hidden ${outOfStock ? 'opacity-50' : ''}`}
    >
      {/* Image area */}
      <div className={`relative w-full aspect-[4/3] ${cardTint} overflow-hidden`}>
        {product.image ? (
          <Image src={product.image} alt={product.title} fill className="object-contain p-2" unoptimized />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Store className="w-6 h-6 text-brand-grey-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-1.5 start-1.5 flex flex-col gap-1">
          {product.isBundle && (
            <span className="px-1.5 py-0.5 rounded-md bg-navy-800 text-white text-[12px] font-bold flex items-center gap-0.5">
              <Layers className="w-2.5 h-2.5" />
              باقة
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full px-2 py-0.5 text-[12px] font-bold text-white bg-amber-500">
              خصم {discountPct}%
            </span>
          )}
        </div>

        {/* CTA */}
        {!outOfStock && (
          <div className="absolute bottom-1.5 end-1.5">
            <motion.button aria-label="أضف للسلة" data-tap="44"
              whileTap={{ scale: 0.85 }}
              onClick={(e) => { e.stopPropagation(); onCTA() }}
              className={`tap-44 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                justAdded ? 'bg-teal-500 text-white scale-110'
                : inCart ? 'bg-sky-100 text-sky-500'
                : 'bg-white text-navy-800'
              }`}
              style={{ minWidth: 48, minHeight: 48 }}
            >
              {justAdded || inCart ? (
                <motion.div
                  initial={justAdded ? { scale: 0 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">
        {product.doctor && (
          <p className="text-[12px] text-brand-grey-500 line-clamp-1">{product.doctor}</p>
        )}
        <h3 className="font-bold text-navy-900 line-clamp-2 leading-tight text-[12px] mt-0.5">
          {product.title}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-1">
          {hasDiscount && (
            <span className="text-[12px] text-brand-grey-400 line-through sl-num">
              {product.originalPrice!.toFixed(2)}
            </span>
          )}
          <span className="font-black text-navy-900 sl-num text-[15px]">{product.price.toFixed(2)}</span>
          <span className="text-brand-grey-400 text-[12px]">ج.م</span>
        </div>
        {hasDiscount && (
          <div className="mt-0.5 flex items-center gap-0.5">
            <Check className="w-3 h-3 text-teal-600" />
            <span className="text-[12px] font-semibold text-teal-600">وفرت {savingsAmount} ج.م</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Offer Card (Horizontal Ribbon — Discount)
   ═══════════════════════════════════════════ */
function OfferCard({
  product,
  savings,
  inCart,
  justAdded,
  onCTA,
}: {
  product: Product
  savings: string
  inCart: boolean
  justAdded: boolean
  onCTA: () => void
}) {
  const discountPct = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
  /* نفس المشكلة: ثلاثة تدرّجات تُوزَّع عشوائيًا على بطاقات العروض. */
  const cardTint = categoryStyle(product.category).iconBg

  return (
    <motion.div
      variants={cardVariants}
      className="shrink-0 w-[160px] bg-white rounded-2xl shadow-sm overflow-hidden border border-amber-100"
    >
      {/* Image */}
      <div className={`relative w-full aspect-[4/3] ${cardTint} overflow-hidden`}>
        {product.image ? (
          <Image src={product.image} alt={product.title} fill className="object-contain p-2" unoptimized />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <BadgePercent className="w-6 h-6 text-amber-300" />
          </div>
        )}

        {/* Discount badge */}
        <div className="absolute top-1.5 start-1.5">
          <span className="rounded-full px-2 py-0.5 text-[12px] font-bold text-white bg-amber-500">
            خصم {discountPct}%
          </span>
        </div>

        {/* CTA */}
        <div className="absolute bottom-1.5 end-1.5">
          <motion.button aria-label="أضف للسلة" data-tap="44"
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); onCTA() }}
            className={`tap-44 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
              justAdded ? 'bg-teal-500 text-white scale-110'
              : inCart ? 'bg-sky-100 text-sky-500'
              : 'bg-white text-navy-800'
            }`}
            style={{ minWidth: 48, minHeight: 48 }}
          >
            {justAdded || inCart ? (
              <motion.div
                initial={justAdded ? { scale: 0 } : false}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5">
        {product.doctor && (
          <p className="text-[12px] text-brand-grey-500 line-clamp-1">{product.doctor}</p>
        )}
        <h3 className="font-bold text-navy-900 line-clamp-2 leading-tight text-[12px] mt-0.5">{product.title}</h3>
        <div className="mt-1.5 flex items-baseline gap-1">
          {product.originalPrice && (
            <span className="text-[12px] text-brand-grey-400 line-through sl-num">
              {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="font-black text-navy-900 sl-num text-[16px]">{product.price.toFixed(2)}</span>
          <span className="text-brand-grey-400 text-[12px]">ج.م</span>
        </div>
        <div className="mt-0.5 flex items-center gap-0.5">
          <Check className="w-3 h-3 text-teal-600" />
          <span className="text-[12px] font-semibold text-teal-600">وفرت {savings} ج.م</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Grade Selection Bottom Sheet
   ═══════════════════════════════════════════ */
function GradeSelectionSheet({
  onSelect,
  onClose,
}: {
  onSelect: (grade: GradeType) => void
  onClose: () => void
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-50 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="absolute bottom-0 end-0 start-0 z-[60] bg-white rounded-t-3xl overflow-hidden"
        style={{ boxShadow: '0 -4px 30px rgba(0,0,0,0.15)' }}
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-brand-grey-300" />
        </div>
        <div className="px-4 pb-6 max-h-[60%] overflow-y-auto">
          <div className="text-center mb-4">
            <h3 className="text-[15px] font-bold text-navy-900">حدد فرقتك الدراسية أولاً</h3>
            <p className="text-[12px] text-brand-grey-500 mt-1">عشان نقدر نعرضلك المحتوى المناسب ليك</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {ALL_GRADES.map((grade, i) => (
              <motion.button data-tap="44"
                key={grade}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelect(grade)}
                className="py-3 rounded-xl bg-brand-grey-50 border border-brand-grey-200/60 text-[13px] font-bold text-navy-800 active:bg-sky-50 active:border-sky-300 transition-all hover:border-sky-400"
                style={{ minHeight: 48 }}
              >
                {grade}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ═══════════════════════════════════════════
   Product Card (Grid — 2-col lectures, 3-col tools)
   ═══════════════════════════════════════════ */
function ProductCard({
  product,
  inCart,
  justAdded,
  onCTA,
  gridCols,
}: {
  product: Product
  inCart: boolean
  justAdded: boolean
  onCTA: () => void
  gridCols: 2 | 3
}) {
  const isTool = gridCols === 3
  const outOfStock = !product.available
  const isUnavailableZero = outOfStock && product.price === 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPct = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0
  const savingsAmount = hasDiscount ? (product.originalPrice! - product.price).toFixed(0) : '0'

  /* كانت خلفية البطاقة تُختار عشوائيًا: `gradients[charCode(id) % 5]` —
     خمسة تدرّجات لونية مختلفة تُوزَّع على المنتجات بلا أي معنى، فبدا كل رفّ
     كأنه لوحة ألوان. صارت الخلفية تتبع **تصنيف** المنتج، فاللون يحمل معلومة. */
  const cardTint = categoryStyle(product.category).iconBg

  return (
    <motion.div
      variants={cardVariants}
      className={`relative bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col ${
        isUnavailableZero ? 'opacity-60 ring-1 ring-amber-300/60' : outOfStock ? 'opacity-50' : ''
      }`}
    >
      {/* Product image */}
      <div className={`relative w-full ${isTool ? 'aspect-square' : 'aspect-[4/3]'} ${isUnavailableZero ? 'bg-amber-50' : cardTint} overflow-hidden`}>
        {isUnavailableZero ? (
          <div className="flex items-center justify-center w-full h-full">
            <AlertCircle className="w-8 h-8 text-amber-400/70" />
          </div>
        ) : product.image ? (
          <Image src={product.image} alt={product.title} fill className="object-contain p-2" unoptimized />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Store className="w-6 h-6 text-brand-grey-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-1.5 start-1.5 flex flex-col gap-1">
          {isUnavailableZero && (
            <span className="rounded-full px-2 py-0.5 text-[12px] font-bold text-amber-700 bg-amber-200/80 flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" />
              غير متوفر
            </span>
          )}
          {product.isBundle && !isUnavailableZero && (
            <span className="px-1.5 py-0.5 rounded-md bg-navy-800 text-white text-[12px] font-bold flex items-center gap-0.5">
              <Layers className="w-2.5 h-2.5" />
              باقة
            </span>
          )}
          {hasDiscount && !isUnavailableZero && (
            <span className="rounded-full px-2 py-0.5 text-[12px] font-bold text-white bg-amber-500">
              خصم {discountPct}%
            </span>
          )}
        </div>

        {/* CTA button overlay */}
        {!outOfStock && (
          <div className="absolute bottom-1.5 end-1.5">
            <motion.button aria-label="أضف للسلة" data-tap="44"
              whileTap={{ scale: 0.85 }}
              onClick={(e) => { e.stopPropagation(); onCTA() }}
              className={`tap-44 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                justAdded ? 'bg-teal-500 text-white scale-110'
                : inCart ? 'bg-sky-100 text-sky-500'
                : 'bg-white text-navy-800'
              }`}
              style={{ minWidth: 48, minHeight: 48 }}
            >
              {justAdded || inCart ? (
                <motion.div
                  initial={justAdded ? { scale: 0 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className={`p-2 ${isTool ? 'px-1.5 py-1.5' : 'p-2.5'} flex-1 flex flex-col min-h-0`}>
        {product.doctor && (
          <p className={`line-clamp-1 ${isUnavailableZero ? 'text-[12px] text-amber-500' : 'text-[12px] text-brand-grey-500'}`}>{product.doctor}</p>
        )}
        <h3 className={`font-bold line-clamp-2 leading-tight mt-0.5 ${isUnavailableZero ? 'text-[12px] text-amber-700' : isTool ? 'text-[12px] text-navy-900' : 'text-[12px] text-navy-900'}`}>
          {product.title}
        </h3>
        {isUnavailableZero ? (
          <div className="mt-auto pt-1.5">
            <div className="flex items-baseline gap-1">
              <span className="font-black text-amber-600 sl-num text-[13px]">0.00</span>
              <span className="text-amber-400 text-[12px]">ج.م</span>
            </div>
            <p className="mt-1 text-[12px] text-amber-500 font-medium leading-relaxed">
              غير متوفر في المكتبة والمكتبة هتسعى لتوفيره في اسرع وقت
            </p>
          </div>
        ) : (
          <>
            <div className="mt-auto pt-1.5 flex items-baseline gap-1">
              {hasDiscount && (
                <span className="text-[12px] text-brand-grey-400 line-through sl-num">
                  {product.originalPrice!.toFixed(2)}
                </span>
              )}
              <span className={`font-black text-navy-900 sl-num ${isTool ? 'text-[13px]' : 'text-[13px]'}`}>
                {product.price.toFixed(2)}
              </span>
              <span className={`text-brand-grey-400 ${isTool ? 'text-[12px]' : 'text-[12px]'}`}>ج.م</span>
            </div>
            {hasDiscount && (
              <div className="mt-0.5 flex items-center gap-0.5">
                <Check className="w-3 h-3 text-teal-600" />
                <span className={`font-semibold text-teal-600 ${isTool ? 'text-[12px]' : 'text-[12px]'}`}>وفرت {savingsAmount} ج.م</span>
              </div>
            )}
            {outOfStock && (
              <span className="text-[12px] text-error font-semibold mt-1">غير متوفرة</span>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}