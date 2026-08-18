'use client'

import { categoryStyle } from '@/lib/category'
import { useState, useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Search,
  Plus,
  Check,
  ShoppingCart,
  Store,
  Layers,
  X,
  BookOpen,
  AlertCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import BottomNavBar from '@/components/studylink/BottomNavBar'
import CartHeaderButton from '@/components/studylink/CartHeaderButton'
import VariantSelectionSheet from '@/components/studylink/VariantSelectionSheet'
import {
  products,
  type StoreType,
  type Product,
  type GradeType,
  isProductForGrade,
} from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface LibraryCategoryScreenProps {
  storeName: StoreType
  subject: string
  onNavigate?: (screen: string) => void
}

const STORE_CONFIG: Record<StoreType, { open: boolean; label: string }> = {
  'هارفرد': { open: true, label: 'مكتبة هارفرد' },
  'برلين': { open: false, label: 'مكتبة برلين' },
}

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

export default function LibraryCategoryScreen({ storeName, subject, onNavigate }: LibraryCategoryScreenProps) {
  const storeConfig = STORE_CONFIG[storeName]

  // ─── Store state ───
  const selectedGrade = useStudylinkStore((s) => s.selectedGrade)
  const addToCartStore = useStudylinkStore((s) => s.addToCart)
  const isInCartStore = useStudylinkStore((s) => s.isInCart)

  // ─── Local state ───
  const [searchQuery, setSearchQuery] = useState('')
  const [variantProduct, setVariantProduct] = useState<Product | null>(null)
  const [justAddedIds, setJustAddedIds] = useState<Set<string>>(new Set())

  // ─── Derived: products for this store + subject ───
  const categoryProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.store !== storeName) return false
      if (p.category === 'محاضرات') {
        if (selectedGrade && !isProductForGrade(p, selectedGrade)) return false
        return p.subject === subject
      }
      return false // Only lectures have subjects; tools are shown on main library page
    })
  }, [storeName, subject, selectedGrade])

  // Filtered by search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return categoryProducts
    const q = searchQuery.trim().toLowerCase()
    return categoryProducts.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(q)
      const doctorMatch = p.doctor ? p.doctor.toLowerCase().includes(q) : false
      return titleMatch || doctorMatch
    })
  }, [categoryProducts, searchQuery])

  // Check if any product is unavailable (for yellow indicator)
  const hasUnavailable = useMemo(() => filteredProducts.some((p) => !p.available), [filteredProducts])
  const allUnavailable = useMemo(() => filteredProducts.length > 0 && filteredProducts.every((p) => !p.available), [filteredProducts])

  // ─── Add to cart with modeless feedback ───
  const handleAddToCart = useCallback((product: Product) => {
    if (!product.available) return
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
  }, [addToCartStore])

  // CTA handler
  const handleCTA = useCallback((product: Product) => {
    if (!product.available) return
    if (product.hasVariants) {
      setVariantProduct(product)
    } else {
      handleAddToCart(product)
    }
  }, [handleAddToCart])

  return (
    <div className="h-full flex flex-col overflow-hidden bg-brand-grey-100 relative" dir="rtl">
      {/* ===== Sticky Header ===== */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-md">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 pt-9 pb-2.5">
          <button data-tap="44" aria-label="رجوع"
            onClick={() => onNavigate?.(`library-${storeName === 'هارفرد' ? 'harvard' : 'berlin'}`)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey-100 active:scale-90 transition-transform tap-44"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <ArrowRight className="w-[18px] h-[18px] text-navy-800" />
          </button>

          <h1 className="text-[15px] font-bold text-navy-900 flex items-center gap-1.5">
            <span className="text-sky-500">{subject}</span>
            <span className="text-brand-grey-400 text-[13px]">—</span>
            <span className="text-[13px] text-brand-grey-600">{storeConfig.label}</span>
            {hasUnavailable && (
              <span className="flex items-center gap-0.5 ms-1 px-1.5 py-0.5 rounded-full bg-amber-100 border border-amber-200/60">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span className="text-[12px] font-semibold text-amber-600">غير متوفر</span>
              </span>
            )}
          </h1>

          <CartHeaderButton onNavigate={onNavigate} />
        </div>

        {/* Search bar */}
        <div className="px-4 pb-2.5">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`ابحث في ${subject}...`}
              className="w-full h-10 pe-3 ps-9 rounded-xl bg-brand-grey-100 border-none outline-none text-[13px] text-navy-900 placeholder:text-brand-grey-400 focus:ring-2 focus:ring-sky-500/30 transition-shadow"
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
      </div>

      {/* ===== Scrollable Content ===== */}
      <div className="flex-1 overflow-y-auto min-h-0 phone-scroll">
        <div className="pb-4">
          {/* Subject info banner */}
          <div className="mx-4 mt-3 mb-4">
            <div className={`rounded-2xl p-4 shadow-sm border ${allUnavailable ? 'bg-amber-50 border-amber-200/60' : 'bg-white border-brand-grey-200/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${allUnavailable ? 'bg-amber-100' : 'bg-sky-50'}`}>
                  {allUnavailable ? (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-sky-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[14px] font-bold text-navy-900">{subject}</h2>
                  {allUnavailable ? (
                    <p className="text-[12px] text-amber-600 mt-0.5">
                      جميع العناصر غير متوفرة حالياً — المكتبة هتسعى لتوفيرهم في اسرع وقت
                    </p>
                  ) : (
                    <p className="text-[12px] text-brand-grey-500 mt-0.5">
                      {filteredProducts.length} منتج{filteredProducts.length !== 1 ? 'ات' : ''} في {storeConfig.label}
                    </p>
                  )}
                </div>
                {storeConfig.open && !allUnavailable && (
                  <div className="px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60">
                    <span className="text-[12px] font-semibold text-teal-600">مفتوحة</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-2.5 px-4"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  inCart={isInCartStore(product.id)}
                  justAdded={justAddedIds.has(product.id)}
                  onCTA={() => handleCTA(product)}
                  gridCols={2}
                />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-grey-100 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-brand-grey-400" />
              </div>
              <p className="text-[13px] font-semibold text-brand-grey-500 text-center">
                مفيش نتائج مطابقة
              </p>
              {searchQuery && (
                <button data-tap="44"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-[13px] font-semibold text-sky-500 active:opacity-70 transition-opacity"
                  style={{ minHeight: 48 }}
                >
                  مسح البحث
                </button>
              )}
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-4 pb-4" />
        </div>
      </div>

      {/* ===== Bottom Navigation ===== */}
      <div className="flex-shrink-0">
        <BottomNavBar onNavigate={onNavigate} activeTab="lectures" noSticky />
      </div>

      {/* ===== Variant Selection Sheet ===== */}
      {variantProduct && (
        <VariantSelectionSheet
          product={variantProduct}
          onClose={() => setVariantProduct(null)}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   Product Card (same as LibraryScreen)
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
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-2"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Store className="w-6 h-6 text-brand-grey-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-1.5 start-1.5 flex flex-col gap-1">
          {isUnavailableZero && (
            <span className="rounded-full px-2 py-0.5 text-[11px] font-bold text-amber-700 bg-amber-200/80 flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" />
              غير متوفر
            </span>
          )}
          {product.isBundle && !isUnavailableZero && (
            <span className="px-1.5 py-0.5 rounded-md bg-navy-800 text-white text-[11px] font-bold flex items-center gap-0.5">
              <Layers className="w-2.5 h-2.5" />
              باقة
            </span>
          )}
          {hasDiscount && !isUnavailableZero && (
            <span className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white bg-amber-500">
              خصم {discountPct}%
            </span>
          )}
        </div>

        {/* CTA button overlay */}
        {!outOfStock && (
          <div className="absolute bottom-1.5 end-1.5">
            <motion.button aria-label="أضف للسلة" data-tap="44"
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation()
                onCTA()
              }}
              className={`tap-44 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                justAdded
                  ? 'bg-teal-500 text-white scale-110'
                  : inCart
                  ? 'bg-sky-100 text-sky-500'
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
        {/* Doctor name */}
        {product.doctor && (
          <p className={`line-clamp-1 ${isUnavailableZero ? 'text-[12px] text-amber-500' : 'text-[12px] text-brand-grey-500'}`}>
            {product.doctor}
          </p>
        )}
        {/* Title */}
        <h3
          className={`font-bold line-clamp-2 leading-tight mt-0.5 ${
            isUnavailableZero ? 'text-[12px] text-amber-700' : isTool ? 'text-[12px] text-navy-900' : 'text-[12px] text-navy-900'
          }`}
        >
          {product.title}
        </h3>

        {isUnavailableZero ? (
          <div className="mt-auto pt-1.5">
            <div className="flex items-baseline gap-1">
              <span className="font-black text-amber-600 sl-num text-[13px]">0.00</span>
              <span className="text-amber-400 text-[12px]">ج.م</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-500 font-medium leading-relaxed">
              غير متوفر في المكتبة والمكتبة هتسعى لتوفيره في اسرع وقت
            </p>
          </div>
        ) : (
          <>
            {/* Price */}
            <div className="mt-auto pt-1.5 flex items-baseline gap-1">
              {hasDiscount && (
                <span className="text-[12px] text-brand-grey-400 line-through sl-num">
                  {product.originalPrice!.toFixed(2)}
                </span>
              )}
              <span className={`font-black text-navy-900 sl-num ${isTool ? 'text-[13px]' : 'text-[13px]'}`}>
                {product.price.toFixed(2)}
              </span>
              <span className={`text-brand-grey-400 ${isTool ? 'text-[11px]' : 'text-[12px]'}`}>ج.م</span>
            </div>
            {hasDiscount && (
              <div className="mt-0.5 flex items-center gap-0.5">
                <Check className="w-3 h-3 text-teal-600" />
                <span className={`font-semibold text-teal-600 ${isTool ? 'text-[11px]' : 'text-[12px]'}`}>وفرت {savingsAmount} ج.م</span>
              </div>
            )}

            {/* Out of stock label */}
            {outOfStock && (
              <span className="text-[12px] text-error font-semibold mt-1">
                غير متوفرة
              </span>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}