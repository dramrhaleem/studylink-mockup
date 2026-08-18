'use client'

import { asset } from '@/lib/asset'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Plus, Minus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  type Product,
  type ProductVariants,
  getProductVariants,
} from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface VariantSelectionSheetProps {
  product: Product
  onClose: () => void
}

export default function VariantSelectionSheet({
  product,
  onClose,
}: VariantSelectionSheetProps) {
  const variants = getProductVariants(product.id)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const addToCart = useStudylinkStore((s) => s.addToCart)
  const updateQuantity = useStudylinkStore((s) => s.updateQuantity)

  // Get available colors for the currently selected size
  const availableColors = useMemo(() => {
    if (!variants || !selectedSize) return []
    return variants.availability
      .filter((c) => c.size === selectedSize && c.available)
      .map((c) => c.color)
  }, [variants, selectedSize])

  // Check if a specific color is available for the selected size
  const isColorAvailable = useCallback(
    (colorValue: string) => {
      if (!variants || !selectedSize) return false
      return variants.availability.some(
        (c) => c.size === selectedSize && c.color === colorValue && c.available
      )
    },
    [variants, selectedSize]
  )

  // Current selected color price diff
  const currentColorDiff = useMemo(() => {
    if (!variants || !selectedColor) return 0
    const color = variants.colors.find((c) => c.value === selectedColor)
    return color?.priceDiff || 0
  }, [variants, selectedColor])

  // Dynamic price
  const currentPrice = product.price + currentColorDiff
  const totalPrice = currentPrice * quantity

  // Check if the CTA should be enabled
  const canAdd = selectedSize !== null && selectedColor !== null

  const handleAddToCart = useCallback(() => {
    if (!canAdd) return

    // Create a modified product with the variant info in the title
    const sizeLabel = variants?.sizes.find((s) => s.value === selectedSize)?.label || selectedSize
    const colorLabel = variants?.colors.find((c) => c.value === selectedColor)?.label || selectedColor
    const variantProduct: Product = {
      ...product,
      title: `${product.title} (${sizeLabel} - ${colorLabel})`,
      price: currentPrice,
    }

    addToCart(variantProduct)
    if (quantity > 1) {
      updateQuantity(variantProduct.id, quantity)
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }

    toast.success('تمت الإضافة للسلة', {
      description: `${sizeLabel} - ${colorLabel}`,
      duration: 2000,
      style: {

        direction: 'rtl',
        fontSize: '12px',
      },
    })

    // Close both sheets smoothly
    onClose()
  }, [
    canAdd,
    variants,
    selectedSize,
    selectedColor,
    product,
    currentPrice,
    quantity,
    addToCart,
    updateQuantity,
    onClose,
  ])

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size)
    // Reset color when size changes (new availability)
    setSelectedColor(null)
  }, [])

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)))
  }, [])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 z-50 bg-black/30"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="absolute bottom-0 end-0 start-0 z-[60] bg-white rounded-t-3xl overflow-hidden"
        style={{ boxShadow: '0 -4px 30px rgba(0,0,0,0.15)' }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-brand-grey-300" />
        </div>

        <div className="px-4 pb-4">
          {/* Close button */}
          <button data-tap="44" aria-label="إغلاق"
            onClick={onClose}
            className="absolute top-4 end-4 w-8 h-8 rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-90 transition-transform z-10 tap-44"
          >
            <X className="w-4 h-4 text-brand-grey-600" />
          </button>

          {/* Product Image */}
          <div className="relative w-full h-[100px] bg-brand-grey-50 rounded-xl overflow-hidden mb-3">
            <Image
              src={product.image || asset('/studylink-icon.png')}
              alt={product.title}
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>

          {/* Product name */}
          <h3 className="text-[14px] font-bold text-navy-800 line-clamp-1">
            {product.title}
          </h3>

          {/* Dynamic price */}
          <motion.div
            key={currentPrice}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="mt-1"
          >
            <span className="text-[18px] font-extrabold text-navy-800 sl-num">
              {currentPrice.toFixed(2)} ج.م
            </span>
          </motion.div>

          {/* Size Selection */}
          {variants && (
            <div className="mt-4">
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
                          : 'bg-white text-navy-800 border-brand-grey-200 hover:border-sky-400'
                      }`}
                    >
                      {size.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {variants && (
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
                      onClick={() => available && setSelectedColor(color.value)}
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
          )}

          {/* Quantity */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-[13px] font-bold text-navy-800">الكمية:</span>
            <div className="flex items-center gap-0.5 bg-brand-grey-100 rounded-xl px-1 py-0.5">
              <motion.button data-tap="44" aria-label="إنقاص"
                whileTap={{ scale: 0.85 }}
                onClick={() => handleQuantityChange(-1)}
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
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-navy-800 active:bg-brand-grey-200 transition-colors tap-44"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className={`w-full h-12 mt-4 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
              canAdd
                ? 'bg-sky-500 text-white active:bg-sky-600'
                : 'bg-brand-grey-200 text-brand-grey-400 cursor-not-allowed'
            }`}
          >
            {canAdd ? (
              <>
                <span>أضف للسلة</span>
                <span className="text-white/60">—</span>
                <span className="sl-num">{totalPrice.toFixed(2)} ج.م</span>
              </>
            ) : (
              <span>اختر المقاس واللون</span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}