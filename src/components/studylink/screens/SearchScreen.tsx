'use client'

import { asset } from '@/lib/asset'
import { CATEGORY, type CategoryKey } from '@/lib/category'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock, Plus, Check, Mic, Tag, BookOpen, BookMarked, ClipboardList, Stethoscope, PenTool, Sparkles, Eye, Trash2 } from 'lucide-react'
import { products, type Product, isProductForGrade } from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface SearchScreenProps {
  onNavigate?: (screen: string) => void
}

const categoryBadgeColors: Record<string, string> = {
  'محاضرات': 'bg-sky-500/10 text-sky-600',
  'أدوات طبية': 'bg-teal-50 text-teal-700',
  'أدوات مكتبية': 'bg-amber-50 text-amber-700',
}

const storeColors: Record<string, string> = {
  /* المكتبة ليست حالة نظام — لا تأخذ لون خطأ ولا نجاح.
     الفرق بينهما درجة داخل الحبر، لا لونان مختلفان. */
  'هارفرد': 'bg-navy-50 text-navy-800',
  'برلين': 'bg-brand-grey-100 text-brand-grey-700',
}

/* اللون يتبع **تصنيف** المدخل لا ترتيبه في المصفوفة: «محاضرات جراحة»
   و«ملخصات باطنة» كلاهما محاضرات، فيأخذان نفس اللون. كان الأول سماويًا
   والثاني رماديًا بلا سبب. */
const trendingCategories: { label: string; category: CategoryKey; count: string }[] = [
  { label: 'محاضرات جراحة', category: 'محاضرات', count: '24' },
  { label: 'أدوات تشريح', category: 'أدوات طبية', count: '18' },
  { label: 'ملخصات باطنة', category: 'محاضرات', count: '31' },
  { label: 'أدوات مكتبية', category: 'أدوات مكتبية', count: '12' },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

/* كانت خمسة تدرّجات لخمس مراتب: خمسة ألوان بلا معنى في قائمة واحدة.
   المرتبة ليست تصنيفًا — هي ترتيب. الأول يأخذ اللهجة، والباقي يتدرّج حياديًا. */
const trendingRankTint = [
  'bg-sky-500',
  'bg-navy-700',
  'bg-brand-grey-600',
  'bg-brand-grey-500',
  'bg-brand-grey-500',
]

export default function SearchScreen({ onNavigate }: SearchScreenProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'محاضرات جراحة',
    'سماعة ليتمان',
    'د. أحمد محمود',
    'بالطو طبي',
  ])
  const [voiceActive, setVoiceActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cart = useStudylinkStore(s => s.cart)
  const selectedGrade = useStudylinkStore(s => s.selectedGrade)
  const recentlyViewed = useStudylinkStore(s => s.recentlyViewed)
  const clearRecentlyViewed = useStudylinkStore(s => s.clearRecentlyViewed)
  const isInCart = useCallback((productId: string) => cart.some(i => i.product.id === productId), [cart])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const trendingSearches = [
    'محاضرات جراحة',
    'سماعة ليتمان',
    'بالطو طبي',
    'ملخص باطنة',
    'فسيولوجي هارفرد',
    'أدوات تشريح',
  ]

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const fields = [p.title, p.doctor, p.subject, p.specs, p.store, p.category].filter(Boolean).map(String)
      return fields.some((f) => f.toLowerCase().includes(q))
    }).slice(0, 10)
  }, [query])

  const results = useMemo(() => {
    let res = filtered
    if (selectedGrade) {
      const gradeMatch = res.filter(p => p.category !== 'محاضرات' || isProductForGrade(p, selectedGrade))
      const gradeOther = res.filter(p => p.category === 'محاضرات' && !isProductForGrade(p, selectedGrade))
      res = [...gradeMatch, ...gradeOther]
    }
    return res
  }, [filtered, selectedGrade])

  const hasResults = results.length > 0
  const isSearching = query.trim().length > 0

  const handleRemoveRecent = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search))
  }

  const handleRecentTap = (search: string) => {
    setQuery(search)
    setRecentSearches(prev => {
      if (!prev.includes(search)) {
        return [search, ...prev].slice(0, 5)
      }
      return prev
    })
  }

  const handleTrendingTap = (search: string) => {
    setQuery(search)
    setRecentSearches(prev => {
      if (!prev.includes(search)) {
        return [search, ...prev].slice(0, 5)
      }
      return prev
    })
  }

  const handleClearQuery = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const handleAddToCart = (product: Product) => {
    useStudylinkStore.getState().addToCart(product)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }

  const handleVoiceSearch = () => {
    setVoiceActive(true)
    setTimeout(() => {
      setVoiceActive(false)
      setQuery('محاضرات جراحة عامة')
    }, 1500)
  }

  const handleClearRecent = () => {
    setRecentSearches([])
  }

  return (
    <div className="h-full flex flex-col bg-brand-grey-100" dir="rtl">
      {/* Gradient Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-800/95 via-navy-800/60 to-transparent pointer-events-none z-0" />
        <div className="absolute -top-12 -start-12 w-32 h-32 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-navy-800/40 backdrop-blur-sm px-4 pt-3 pb-3">
          {/* Search Bar */}
          <div
            className={`relative flex items-center gap-2.5 bg-white/95 backdrop-blur-sm rounded-2xl px-3.5 py-2.5 transition-all duration-300 ${
              isFocused ? 'shadow-lg shadow-sky-500/10' : 'shadow-sm'
            }`}
          >
            {/* Shimmer border on focus */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl border-2 border-sky-400 pointer-events-none"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent rounded-2xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Search className="w-[18px] h-[18px] text-sky-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="ابحث عن مذكرة، أداة، أو دكتور..."
              aria-label="ابحث عن مذكرة أو أداة" className="flex-1 bg-transparent text-[13px] text-navy-800 placeholder:text-brand-grey-400 outline-none relative z-10"
            />
            {/* Voice search button */}
            <motion.button data-tap="44"
              aria-label="البحث الصوتي"
              whileTap={{ scale: 0.9 }}
              onClick={handleVoiceSearch}
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors relative z-10 ${
                voiceActive ? 'bg-error text-white' : 'bg-brand-grey-200/80 text-brand-grey-500 hover:text-navy-800'
              } tap-44`}
            >
              {voiceActive ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <Mic className="w-4 h-4" />
                </motion.div>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </motion.button>
            {query.length > 0 && (
              <motion.button data-tap="44" aria-label="إغلاق"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleClearQuery}
                className="shrink-0 w-5 h-5 rounded-full bg-brand-grey-300 flex items-center relative z-10 tap-44"
              >
                <X className="w-3 h-3 text-white" />
              </motion.button>
            )}
          </div>
          {/* Voice search feedback */}
          <AnimatePresence>
            {voiceActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 16, 8, 14, 4] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1, ease: 'easeInOut' }}
                        className="w-[3px] rounded-full bg-sky-500"
                      />
                    ))}
                  </div>
                  <span className="text-[12px] text-sky-300 font-medium">جاري الاستماع...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        {!isSearching ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {/* Category Icons with animated entrance */}
            <motion.section variants={staggerItem} className="mb-6">
              <div className="flex items-center gap-1.5 mb-3">
                <Tag className="w-3.5 h-3.5 text-sky-500" />
                <h3 className="text-[13px] font-bold text-navy-800">تصفح حسب القسم</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {trendingCategories.map((cat, idx) => {
                  const cs = CATEGORY[cat.category]
                  return (
                  <motion.button data-tap="44"
                    key={cat.label}
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleTrendingTap(cat.label)}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.1 + idx * 0.07, duration: 0.3, ease: 'easeOut' }}
                    className="bg-white rounded-2xl p-3.5 border border-brand-grey-200/50 text-start hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2.5">
                      <motion.div
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4 }}
                        className={`w-10 h-10 rounded-xl ${cs.iconBg} border ${cs.border} flex items-center justify-center`}
                      >
                        <cs.Icon className={`w-5 h-5 ${cs.iconInk}`} aria-hidden />
                      </motion.div>
                      <div>
                        <p className="text-[13px] font-bold text-navy-800 leading-tight">{cat.label}</p>
                        <p className="text-[12px] text-brand-grey-400 mt-0.5"><span className="sl-num">{cat.count}</span> منتج</p>
                      </div>
                    </div>
                  </motion.button>
                  )
                })}
              </div>
            </motion.section>

            {/* Recent Searches with animated clear button */}
            {recentSearches.length > 0 && (
              <motion.section variants={staggerItem} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-grey-400" />
                    <h3 className="text-[13px] font-bold text-navy-800">عمليات بحث سابقة</h3>
                  </div>
                  <motion.button data-tap="44"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearRecent}
                    className="text-[12px] text-sky-500 font-semibold flex items-center gap-1"
                  >
                    <motion.span
                      animate={{ x: [0, -2, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <X className="w-3 h-3" />
                    </motion.span>
                    مسح الكل
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, idx) => (
                    <motion.button data-tap="44" aria-label="إغلاق"
                      key={search}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.04, duration: 0.2 }}
                      whileHover={{ scale: 1.03, borderColor: 'rgba(37, 148, 210, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRecentTap(search)}
                      className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-brand-grey-200/60 hover:border-sky-500/30 transition-colors group shadow-sm"
                    >
                      <Clock className="w-3 h-3 text-brand-grey-400" />
                      <span className="text-[12px] text-navy-800">{search}</span>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => { e.stopPropagation(); handleRemoveRecent(search) }}
                        className="w-4 h-4 rounded-full bg-brand-grey-200 group-hover:bg-error-bg flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5 text-brand-grey-400 group-hover:text-error" />
                      </motion.span>
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Recently Viewed Products */}
            {recentlyViewed.length > 0 && (
              <motion.section variants={staggerItem} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-sky-500" />
                    <h3 className="text-[13px] font-bold text-navy-800">شوهدت مؤخراً</h3>
                  </div>
                  <motion.button data-tap="44"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearRecentlyViewed}
                    className="text-[12px] text-brand-grey-400 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    مسح
                  </motion.button>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  <AnimatePresence>
                    {recentlyViewed.map((p) => (
                      <motion.button data-tap="44" aria-label="صورة"
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileTap={{ scale: 0.97 }}
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
                  </AnimatePresence>
                </div>
              </motion.section>
            )}

            {/* Trending Searches with numbered rank badges */}
            <motion.section variants={staggerItem}>
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
                <h3 className="text-[13px] font-bold text-navy-800">الأكثر بحثاً</h3>
              </div>
              <div className="space-y-2">
                {trendingSearches.map((search, idx) => (
                  <motion.button aria-label="زيادة الكمية" data-tap="44"
                    key={search}
                    whileHover={{ x: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTrendingTap(search)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05, duration: 0.25 }}
                    className="w-full flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-brand-grey-200/40 hover:border-sky-500/20 transition-all text-start"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05, type: 'spring', stiffness: 200, damping: 15 }}
                      className={`w-6 h-6 rounded-lg ${trendingRankTint[idx] || trendingRankTint[4]} text-white flex items-center justify-center text-[12px] font-bold sl-num shadow-sm`}
                    >
                      {idx + 1}
                    </motion.span>
                    <span className="text-[13px] text-navy-800 flex-1">{search}</span>
                    {idx < 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                      >
                        <TrendingUp className="w-3 h-3 text-sky-400" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          </motion.div>
        ) : hasResults ? (
          /* Search Results */
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            key={query}
          >
            {selectedGrade && (
              <div className="flex items-center gap-1.5 px-1 mb-2">
                <span className="text-[12px] font-semibold text-navy-800 bg-navy-50 px-2 py-0.5 rounded-md">
                  {selectedGrade}
                </span>
                <span className="text-[12px] text-brand-grey-400">— النتائج مرتبة حسب فرقتك</span>
              </div>
            )}
            <p className="text-[12px] text-brand-grey-400 mb-3">
              {results.length} نتيجة لـ &quot;{query}&quot;
            </p>
            <div className="flex flex-col gap-3">
              {results.map((product, idx) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <ResultCard product={product} isInCart={isInCart(product.id)} index={idx} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : (
          /* Empty State with animated icon */
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center pt-16"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, -3, 3, 0],
              }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-grey-200/60 to-brand-grey-300/30 flex items-center justify-center mb-4 shadow-inner"
            >
              <Search className="w-8 h-8 text-brand-grey-400" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[16px] font-bold text-navy-800 mb-1.5"
            >
              لا توجد نتائج
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[13px] text-brand-grey-400 text-center leading-relaxed max-w-[220px] mb-4"
            >
              جرب كلمات بحث مختلفة أو تصفح الأقسام
            </motion.p>
            <motion.button data-tap="44"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('lectures')}
              className="bg-sky-500 text-white text-[13px] font-semibold px-5 py-2 rounded-xl shadow-sm shadow-sky-500/20 active:scale-95 transition-transform"
            >
              تصفح المحاضرات
            </motion.button>
          </motion.section>
        )}
      </div>

      {/* Bottom safe area */}
      <div className="h-20" />
    </div>
  )
}

function ResultCard({ product, isInCart, index }: { product: Product; isInCart: boolean; index: number }) {
  const badgeColor = categoryBadgeColors[product.category] || 'bg-brand-grey-100 text-brand-grey-600'
  const storeColor = storeColors[product.store] || 'bg-brand-grey-100 text-brand-grey-600'

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-3.5 flex gap-3 items-start border border-brand-grey-200/50 shadow-sm transition-all cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 shrink-0 flex items-center justify-center">
        {product.category === 'محاضرات' ? (
          <BookOpen className="w-6 h-6 text-sky-600" aria-hidden />
        ) : product.category === 'أدوات طبية' ? (
          <Stethoscope className="w-6 h-6 text-sky-600" aria-hidden />
        ) : (
          <PenTool className="w-6 h-6 text-sky-600" aria-hidden />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {product.category}
          </span>
          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${storeColor}`}>
            {product.store}
          </span>
        </div>

        {product.doctor && (
          <p className="text-[12px] text-brand-grey-400 mb-0.5 truncate">{product.doctor}</p>
        )}

        <h4 className="text-[14px] font-bold text-navy-800 leading-snug truncate">{product.title}</h4>

        {(product.specs || product.subject) && (
          <p className="text-[12px] text-brand-grey-400 mt-0.5 truncate">
            {product.specs || product.subject}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-navy-800 sl-num">{product.price}</span>
            <span className="text-[12px] text-brand-grey-400">ج.م</span>
            {product.originalPrice && (
              <span className="text-[12px] text-brand-grey-400 sl-num line-through ms-1">{product.originalPrice}</span>
            )}
          </div>
          <motion.button aria-label="أضف للسلة" data-tap="44"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => useStudylinkStore.getState().addToCart(product)}
            className={`tap-44 w-8 h-8 rounded-full flex items-center transition-all duration-200 ${
              isInCart
                ? 'bg-success text-white'
                : 'bg-sky-500 text-white active:scale-90 shadow-sm shadow-sky-500/20'
            }`}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}