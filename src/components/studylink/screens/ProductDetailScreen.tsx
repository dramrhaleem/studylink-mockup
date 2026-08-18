'use client'

import { asset } from '@/lib/asset'

import { useState, useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { X, Plus, Check, Minus, Share2, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { products, type Product, getDescription, getProductVariants, isProductForGrade } from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface ProductDetailScreenProps {
  product: Product
  onClose: () => void
}

function getCategoryConfig(category: string) {
  switch (category) {
    case 'محاضرات':
      return { badgeBg: 'bg-navy-800', badgeText: 'text-white' }
    case 'أدوات طبية':
      return { badgeBg: 'bg-teal-900', badgeText: 'text-white' }
    case 'أدوات مكتبية':
      return { badgeBg: 'bg-amber-900', badgeText: 'text-white' }
    default:
      return { badgeBg: 'bg-brand-grey-600', badgeText: 'text-white' }
  }
}

function getStoreName(store: string) {
  return store === 'هارفرد' ? 'مكتبة هارفرد' : 'مكتبة برلين'
}

export default function ProductDetailScreen({ product, onClose }: ProductDetailScreenProps) {
  const [quantity, setQuantity] = useState(1)
  const [liked, setLiked] = useState(false)
  const [addedVariantKey, setAddedVariantKey] = useState<string | null>(null)

  // Inline variant selection state
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const addToCart = useStudylinkStore((s) => s.addToCart)
  const removeFromCart = useStudylinkStore((s) => s.removeFromCart)
  const updateQuantity = useStudylinkStore((s) => s.updateQuantity)
  const cart = useStudylinkStore((s) => s.cart)
  const selectedGrade = useStudylinkStore((s) => s.selectedGrade)
  const addToRecentlyViewed = useStudylinkStore((s) => s.addToRecentlyViewed)

  useEffect(() => {
    addToRecentlyViewed(product)
  }, [product, addToRecentlyViewed])

  const catConfig = getCategoryConfig(product.category)
  const description = getDescription(product)
  const variants = getProductVariants(product.id)
  const hasVariants = product.hasVariants && variants

  // ─── Variant logic (inline) ───
  const availableColors = useMemo(() => {
    if (!variants || !selectedSize) return []
    return variants.availability
      .filter((c) => c.size === selectedSize && c.available)
      .map((c) => c.color)
  }, [variants, selectedSize])

  const isColorAvailable = useCallback(
    (colorValue: string) => {
      if (!variants || !selectedSize) return false
      return variants.availability.some(
        (c) => c.size === selectedSize && c.color === colorValue && c.available
      )
    },
    [variants, selectedSize]
  )

  const currentColorDiff = useMemo(() => {
    if (!variants || !selectedColor) return 0
    const color = variants.colors.find((c) => c.value === selectedColor)
    return color?.priceDiff || 0
  }, [variants, selectedColor])

  const currentVariantPrice = product.price + currentColorDiff
  const variantTotalPrice = currentVariantPrice * quantity
  const canAddVariant = selectedSize !== null && selectedColor !== null

  // Check if this specific variant combo is already in cart
  const variantKey = hasVariants && selectedSize && selectedColor
    ? `${product.id}-${selectedSize}-${selectedColor}`
    : null
  const variantCartItem = variantKey
    ? cart.find((i) => i.product.id === product.id && i.variantKey === variantKey)
    : null
  const isVariantInCart = !!variantCartItem

  // ─── Non-variant cart state ───
  const cartQuantity = cart.find((i) => i.product.id === product.id && !i.variantKey)?.quantity ?? 0
  const isInCart = cartQuantity > 0

  // ─── Similar products ───
  const similarProducts = useMemo(() => {
    let similar = products
      .filter((p) => p.category === product.category && p.id !== product.id && p.available)
      .slice(0, 5)
    if (selectedGrade) {
      const gradeMatch = similar.filter(p => p.category !== 'محاضرات' || isProductForGrade(p, selectedGrade))
      if (gradeMatch.length >= 2) similar = gradeMatch
    }
    return similar
  }, [product.category, product.id, selectedGrade])

  const totalPrice = product.price * quantity

  // ─── Handlers ───
  const handleVariantAddToCart = useCallback(() => {
    if (!canAddVariant || !variants) return

    const sizeLabel = variants.sizes.find((s) => s.value === selectedSize)?.label || selectedSize!
    const colorLabel = variants.colors.find((c) => c.value === selectedColor)?.label || selectedColor!
    const key = `${product.id}-${selectedSize}-${selectedColor}`

    const variantProduct: Product = {
      ...product,
      title: `${product.title} (${sizeLabel} - ${colorLabel})`,
      price: currentVariantPrice,
    }

    addToCart(variantProduct, key)
    if (quantity > 1) {
      updateQuantity(variantProduct.id, quantity, key)
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }

    setAddedVariantKey(key)
    setTimeout(() => setAddedVariantKey(null), 1500)
  }, [canAddVariant, variants, selectedSize, selectedColor, product, currentVariantPrice, quantity, addToCart, updateQuantity])

  const handleVariantQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)))
  }, [])

  const handleSizeSelect = useCallback((size: string) => {
    if (navigator.vibrate) navigator.vibrate(10)
    setSelectedSize(size)
    setSelectedColor(null)
  }, [])

  const handleColorSelect = useCallback((color: string) => {
    if (navigator.vibrate) navigator.vibrate(10)
    setSelectedColor(color)
  }, [])

  const handleAddToCart = useCallback(() => {
    addToCart(product)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }, [addToCart, product])

  const handleSimilarAdd = useCallback(
    (p: Product) => {
      addToCart(p)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(30)
      }
    },
    [addToCart]
  )

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)))
  }, [])

  const handleIncrease = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(10)
    updateQuantity(product.id, cartQuantity + 1)
  }, [cartQuantity, updateQuantity, product.id])

  const handleDecrease = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(10)
    if (cartQuantity <= 1) {
      removeFromCart(product.id)
      return
    }
    updateQuantity(product.id, cartQuantity - 1)
  }, [cartQuantity, removeFromCart, updateQuantity, product.id])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed bottom-0 end-0 start-0 z-50 bg-white rounded-t-3xl max-h-[85%] flex flex-col overflow-hidden"
        style={{ boxShadow: '0 -4px 30px rgba(0,0,0,0.15)' }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-brand-grey-300" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto phone-scroll">
          {/* Product Image */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-brand-grey-50 rounded-t-2xl">
            <Image
              src={product.image || asset('/studylink-icon.png')}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />

            {/* Close button (top-left) */}
            <motion.button data-tap="44" aria-label="إغلاق"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onClick={onClose}
              className="absolute top-3 end-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform tap-44"
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>

            {/* Share + Like (top-right) */}
            <div className="absolute top-3 start-3 z-10 flex gap-2">
              <motion.button data-tap="44" aria-label="مشاركة"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform tap-44"
              >
                <Share2 className="w-3.5 h-3.5 text-white" />
              </motion.button>
              <motion.button data-tap="44" aria-label="المفضلة"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => setLiked(!liked)}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center tap-44"
              >
                <motion.div
                  key={liked ? 'filled' : 'empty'}
                  initial={liked ? { scale: 0, rotate: -30 } : { scale: 1 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-colors ${
                      liked ? 'text-error fill-error' : 'text-white'
                    }`}
                  />
                </motion.div>
              </motion.button>
            </div>

            {/* Bundle badge */}
            {product.isBundle && (
              <span className="absolute bottom-3 start-3 text-[12px] font-bold text-white bg-navy-800/80 backdrop-blur-sm px-2 py-1 rounded-lg z-10">
                باقة {product.bundleCount} مذكرات
              </span>
            )}

            {/* Discount badge */}
            {product.originalPrice && !product.isBundle && (
              <span className="absolute bottom-3 end-3 text-[12px] font-bold text-white bg-error px-2 py-1 rounded-lg z-10">
                خصم {Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Content */}
          <div className="px-4 pt-3.5 pb-2">
            {/* Store name */}
            <span className="text-[12px] text-brand-grey-500">
              {getStoreName(product.store)}
            </span>

            {/* Doctor name */}
            {product.doctor && (
              <p className="text-[13px] font-semibold text-navy-800 mt-1">{product.doctor}</p>
            )}

            {/* Product title */}
            <h1 className="text-[16px] font-bold text-navy-800 leading-relaxed mt-1.5 line-clamp-2">
              {product.title}
            </h1>

            {/* Separator */}
            <div className="h-px bg-brand-grey-100 mt-3" />

            {/* Subject badge, Category, Rating */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {product.subject && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-navy-50 text-[12px] font-semibold text-navy-800">
                  {product.subject}
                </span>
              )}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${catConfig.badgeBg} ${catConfig.badgeText}`}
              >
                {product.category}
              </span>
            </div>

            {/* Separator */}
            <div className="h-px bg-brand-grey-100 mt-3" />

            {/* Price — dynamic for variants */}
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <motion.span
                  key={hasVariants ? currentVariantPrice : product.price}
                  initial={{ y: -4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="text-[20px] font-extrabold text-navy-800 sl-num"
                >
                  {(hasVariants ? currentVariantPrice : product.price).toFixed(2)} ج.م
                </motion.span>
                {product.originalPrice && (
                  <span className="text-[13px] text-brand-grey-400 line-through sl-num">
                    {product.originalPrice.toFixed(2)} ج.م
                  </span>
                )}
                {hasVariants && currentColorDiff > 0 && (
                  <span className="text-[12px] text-sky-500 font-semibold">
                    (+{currentColorDiff} ج.م للون)
                  </span>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-3 text-[12px] text-brand-grey-500 mt-2">
              {product.pages && <span>{product.pages} صفحة</span>}
              {product.paperSize && <span>· {product.paperSize}</span>}
              {product.specs && <span>· {product.specs}</span>}
            </div>

            {/* Description */}
            <p className="text-[12px] text-brand-grey-500 mt-2.5 leading-relaxed">
              {description}
            </p>

            {/* ─── Inline Variant Selection ─── */}
            {hasVariants && variants && (
              <>
                <div className="h-px bg-brand-grey-100 mt-3" />

                {/* Size Selection */}
                <div className="mt-3.5">
                  <span className="text-[13px] font-bold text-navy-800 mb-2 block">
                    المقاس:
                  </span>
                  <div className="flex gap-2">
                    {variants.sizes.map((size) => {
                      const isSelected = selectedSize === size.value
                      return (
                        <motion.button data-tap="44"
                          key={size.value}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleSizeSelect(size.value)}
                          className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all border duration-200 ${
                            isSelected
                              ? 'bg-navy-800 text-white border-navy-800 shadow-md shadow-navy-800/20'
                              : 'bg-white text-navy-800 border-brand-grey-200 active:border-sky-400'
                          }`}
                        >
                          {size.label}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mt-4">
                  <span className="text-[13px] font-bold text-navy-800 mb-2 block">
                    اللون:
                  </span>
                  <div className="flex gap-3 items-center">
                    {variants.colors.map((color) => {
                      const available = !selectedSize || isColorAvailable(color.value)
                      const isSelected = selectedColor === color.value

                      return (
                        <motion.button data-tap="44"
                          key={color.value}
                          whileTap={available ? { scale: 0.9 } : undefined}
                          onClick={() => available && handleColorSelect(color.value)}
                          className={`relative flex flex-col items-center gap-1 ${
                            !available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          disabled={!available}
                        >
                          {/* Color circle */}
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-sky-500 ring-2 ring-sky-500/30'
                                : 'border-brand-grey-200'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {color.hex === '#FFFFFF' && (
                              <div className="w-full h-full rounded-full border border-brand-grey-200" />
                            )}
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className={`w-5 h-5 rounded-full border-2 border-white ${
                                  color.hex === '#FFFFFF' ? 'bg-navy-800' : 'bg-white/30'
                                }`}
                              />
                            )}
                          </div>
                          {/* Color label + price diff */}
                          <span
                            className={`text-[12px] font-semibold ${
                              isSelected ? 'text-navy-800' : 'text-brand-grey-500'
                            }`}
                          >
                            {color.label}
                          </span>
                          {color.priceDiff > 0 && (
                            <span className="text-[11px] text-brand-grey-400 sl-num">
                              +{color.priceDiff} ج
                            </span>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Hint when no size selected */}
                  {!selectedSize && (
                    <p className="text-[12px] text-brand-grey-400 mt-2">
                      اختر المقاس أولاً لعرض الألوان المتاحة
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Separator */}
            <div className="h-px bg-brand-grey-100 mt-3" />

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div className="mt-3 mb-2">
                <h3 className="text-[13px] font-bold text-navy-800 mb-2.5">
                  {product.category === 'محاضرات'
                    ? 'محاضرات مشابهة'
                    : 'منتجات مشابهة'}
                </h3>
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 rail-gutter">
                  {similarProducts.map((p) => (
                    <SimilarProductCard
                      key={p.id}
                      product={p}
                      onAdd={handleSimilarAdd}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        {hasVariants ? (
          /* Variant flow: inline size/color + quantity + CTA */
          <div className="shrink-0 bg-white border-t border-brand-grey-200/50 px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-0.5 bg-brand-grey-100 rounded-xl px-1 py-0.5">
              <motion.button data-tap="44" aria-label="إنقاص"
                whileTap={{ scale: 0.85 }}
                onClick={() => handleVariantQuantityChange(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-navy-800 active:bg-brand-grey-200 transition-colors tap-44"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <motion.span
                key={quantity}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-8 text-center text-[14px] font-bold text-navy-800 sl-num select-none"
              >
                {quantity}
              </motion.span>
              <motion.button data-tap="44" aria-label="زيادة"
                whileTap={{ scale: 0.85 }}
                onClick={() => handleVariantQuantityChange(1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-navy-800 active:bg-brand-grey-200 transition-colors tap-44"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            {isVariantInCart || addedVariantKey ? (
              /* Variant added: green confirmation */
              <motion.button data-tap="44"
                key={addedVariantKey || 'in-cart'}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="flex-1 h-11 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 bg-success text-white tap-44"
              >
                <Check className="w-4 h-4" strokeWidth={3} />
                <span>تمت الإضافة</span>
              </motion.button>
            ) : (
              <motion.button data-tap="44"
                whileTap={{ scale: 0.97 }}
                onClick={handleVariantAddToCart}
                className={`flex-1 h-11 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  canAddVariant
                    ? 'bg-sky-500 text-white'
                    : 'bg-brand-grey-200 text-brand-grey-400 cursor-not-allowed'
                } tap-44`}
              >
                {canAddVariant ? (
                  <>
                    <span>أضف للسلة</span>
                    <span className="text-white/60">—</span>
                    <span className="sl-num">{variantTotalPrice.toFixed(2)} ج.م</span>
                  </>
                ) : (
                  <span>اختر المقاس واللون</span>
                )}
              </motion.button>
            )}
          </div>
        ) : isInCart ? (
          /* Post-add: green button (visual right in RTL) + quantity counter (visual left in RTL) */
          <div className="shrink-0 bg-white border-t border-brand-grey-200/50 px-4 py-3 flex items-center gap-3">
            <motion.button data-tap="44"
              whileTap={{ scale: 0.97 }}
              className="flex-1 h-11 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 bg-success text-white tap-44"
            >
              <Check className="w-4 h-4" strokeWidth={3} />
              <span>تمت الإضافة</span>
            </motion.button>
            <div className="flex items-center gap-0.5 bg-brand-grey-100 rounded-xl px-1 py-0.5">
              <motion.button data-tap="44" aria-label="إنقاص"
                whileTap={{ scale: 0.85 }}
                onClick={handleDecrease}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-navy-800 active:bg-brand-grey-200 transition-colors tap-44"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <motion.span
                key={cartQuantity}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-8 text-center text-[14px] font-bold text-navy-800 sl-num select-none"
              >
                {cartQuantity}
              </motion.span>
              <motion.button data-tap="44" aria-label="زيادة"
                whileTap={{ scale: 0.85 }}
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-navy-800 active:bg-brand-grey-200 transition-colors tap-44"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        ) : (
          /* Pre-add: full-width add button with price */
          <div className="shrink-0 bg-white border-t border-brand-grey-200/50 px-4 py-3">
            <motion.button data-tap="44"
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="w-full h-11 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 bg-sky-500 text-white tap-44"
            >
              <span>أضف للسلة</span>
              <span className="text-white/60">—</span>
              <span className="sl-num">{totalPrice.toFixed(2)} ج.م</span>
            </motion.button>
          </div>
        )}
      </motion.div>
    </>
  )
}

/* ─── Similar Product Card ─── */
function SimilarProductCard({
  product,
  onAdd,
}: {
  product: Product
  onAdd: (p: Product) => void
}) {
  const cart = useStudylinkStore((s) => s.cart)
  const isInCart = cart.some((i) => i.product.id === product.id)

  return (
    <div className="flex-shrink-0 w-[120px] bg-white rounded-xl border border-brand-grey-200/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-brand-grey-50">
        <Image
          src={product.image || asset('/studylink-icon.png')}
          alt={product.title}
          fill
          className="object-cover"
          unoptimized
        />
        {product.isBundle && (
          <span className="absolute top-1 start-1 text-[11px] font-bold text-white bg-navy-800/80 backdrop-blur-sm px-1 py-0.5 rounded">
            باقة
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-2">
        <p className="text-[12px] font-bold text-navy-900 line-clamp-1 leading-tight">
          {product.title}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="sl-num text-[13px] font-bold text-navy-800">
            {product.price.toFixed(2)} ج.م
          </span>
          <button aria-label="أضف للسلة" data-tap="44"
            onClick={(e) => {
              e.stopPropagation()
              if (!isInCart) onAdd(product)
            }}
            className={`tap-44 flex h-6 w-6 items-center justify-center rounded-full transition-transform active:scale-90 ${
              isInCart
                ? 'bg-success text-white'
                : 'bg-sky-500 text-white shadow-sm shadow-sky-500/25'
            }`}
          >
            {isInCart ? (
              <Check className="h-3 w-3" strokeWidth={3} />
            ) : (
              <Plus className="h-3 w-3" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}