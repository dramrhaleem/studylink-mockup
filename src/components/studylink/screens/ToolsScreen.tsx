'use client'

import { asset } from '@/lib/asset'

import { useState, useCallback } from 'react'
import { Plus, ChevronLeft, Search, Check } from 'lucide-react'
import BottomNavBar from '@/components/studylink/BottomNavBar'
import CartHeaderButton from '../CartHeaderButton'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'
import { products, type Product } from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'
import ProductDetailScreen from '@/components/studylink/screens/ProductDetailScreen'
import QuantityControl from '@/components/studylink/QuantityControl'

interface ToolsScreenProps {
  onNavigate?: (screen: string) => void
}

type ToolFilter = 'الكل' | 'أدوات طبية' | 'أدوات مكتبية'

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' as const } },
}

function getFilterCount(filter: ToolFilter) {
  return products.filter(p => {
    if (p.category !== 'أدوات طبية' && p.category !== 'أدوات مكتبية') return false
    if (filter !== 'الكل' && p.category !== filter) return false
    return true
  }).length
}

export default function ToolsScreen({ onNavigate }: ToolsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<ToolFilter>('الكل')
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)

  const cart = useStudylinkStore(s => s.cart)
  const addToCartStore = useStudylinkStore(s => s.addToCart)
  const updateQuantity = useStudylinkStore(s => s.updateQuantity)
  const removeFromCart = useStudylinkStore(s => s.removeFromCart)

  const getCartQuantity = useCallback((productId: string) => {
    const item = cart.find(i => i.product.id === productId)
    return item ? item.quantity : 0
  }, [cart])

  const addToCart = useCallback((productId: string, title: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      addToCartStore(product)
    }
    toast.success(`تمت الإضافة للسلة`, {
      description: title,
      duration: 2000,
      style: { direction: 'rtl', fontSize: '12px' },
    })
  }, [addToCartStore])

  const handleIncrement = useCallback((productId: string) => {
    updateQuantity(productId, getCartQuantity(productId) + 1)
  }, [updateQuantity, getCartQuantity])

  const handleDecrement = useCallback((productId: string) => {
    if (getCartQuantity(productId) <= 1) removeFromCart(productId)
    else updateQuantity(productId, getCartQuantity(productId) - 1)
  }, [updateQuantity, getCartQuantity, removeFromCart])

  const filteredProducts = products.filter(p => {
    if (p.category !== 'أدوات طبية' && p.category !== 'أدوات مكتبية') return false
    if (activeFilter !== 'الكل' && p.category !== activeFilter) return false
    return true
  })

  return (
    <div className="flex flex-col h-full overflow-hidden bg-brand-grey-100">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white px-4 pt-9 pb-2.5 border-b border-brand-grey-200/60">
        <div className="flex items-center justify-between mb-2.5">
          <button data-tap="44" aria-label="رجوع"
            onClick={() => onNavigate?.('home')}
            className="w-10 h-10 rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-95 transition-transform tap-44"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <ChevronLeft className="w-4 h-4 text-navy-800 rotate-180" />
          </button>
          <h1 className="text-[16px] font-bold text-navy-900">الأدوات الطبية والمكتبية</h1>
          <CartHeaderButton onNavigate={onNavigate} />
          <button data-tap="44" aria-label="بحث"
            onClick={() => onNavigate?.('search')}
            className="w-10 h-10 rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-95 transition-transform tap-44"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <Search className="w-4 h-4 text-navy-800" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {([['الكل', '📦'], ['أدوات طبية', '🏥'], ['أدوات مكتبية', '✏️']] as const).map(([label, emoji]) => {
            const count = getFilterCount(label)
            const isActive = activeFilter === label
            return (
              <button data-tap="44"
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 flex items-center gap-1 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                    : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
                }`}
                style={{ minHeight: 48 }}
              >
                <span>{emoji}</span>
                <span>{label}</span>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[11px] font-bold sl-num bg-white/20 px-1.5 py-px rounded-full min-w-[16px] text-center"
                  >
                    {count}
                  </motion.span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 phone-scroll">
      {/* Product Grid — 3 columns */}
      <div className="px-4 pt-2.5 pb-4">
        <motion.div
          key={activeFilter}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2.5"
        >
          {filteredProducts.map((product) => {
            const isMedical = product.category === 'أدوات طبية'
            const qty = getCartQuantity(product.id)
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
                variants={staggerItem}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50 ${
                  !product.available ? 'opacity-50' : 'cursor-pointer'
                } hover:shadow-md transition-shadow duration-200`}
                onClick={() => product.available && setDetailProduct(product)}
              >
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-brand-grey-50">
                  <Image
                    src={product.image || asset('/studylink-icon.png')}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Category badge */}
                  <span className={`absolute top-1 right-1 text-[11px] font-semibold px-1.5 py-px rounded-full border z-20 ${
                    isMedical
                      ? 'bg-white/90 text-teal-900 border-teal-200/60'
                      : 'bg-white/90 text-amber-900 border-amber-200/60'
                  }`}>
                    {isMedical ? 'طبي' : 'مكتبي'}
                  </span>
                  {hasDiscount && (
                    <span className="absolute top-1 left-1 text-[11px] font-bold sl-num bg-amber-500 text-white px-1.5 py-px rounded-full z-20">
                      🔥 خصم {discountPct}%
                    </span>
                  )}
                  {/* Has variants indicator */}
                  {product.hasVariants && (
                    <span className="absolute bottom-1 right-1 text-[11px] font-semibold bg-navy-800/80 text-white px-1.5 py-px rounded z-20">
                      خيارات متعددة
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[12px] font-medium text-navy-900 line-clamp-2 leading-[1.3] min-h-[24px]">
                    {product.title}
                  </p>
                  {product.specs && (
                    <p className="text-[11px] text-brand-grey-500 mt-0.5 truncate">{product.specs}</p>
                  )}
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-0.5">
                        {hasDiscount && (
                          <span className="text-[11px] text-brand-grey-400 line-through sl-num">
                            {product.originalPrice}
                          </span>
                        )}
                        <span className="text-[12px] font-black text-navy-900 sl-num">{product.price}</span>
                        <span className="text-[11px] text-brand-grey-400">ج.م</span>
                      </div>
                      {hasDiscount && (
                        <div className="flex items-center gap-0.5 mt-px">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span className="text-[11px] font-semibold text-emerald-600">وفرت {savingsAmt} ج.م</span>
                        </div>
                      )}
                    </div>
                    {product.available ? (
                      qty > 0 ? (
                        <QuantityControl
                          quantity={qty}
                          onIncrement={() => handleIncrement(product.id)}
                          onDecrement={() => handleDecrement(product.id)}
                          size="sm"
                        />
                      ) : (
                        <button data-tap="44" aria-label="زيادة"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(product.id, product.title)
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white active:scale-90 transition-transform shadow-sm shadow-sky-500/25 tap-44"
                          style={{ minWidth: 48, minHeight: 48 }}
                        >
                          <Plus className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                      )
                    ) : (
                      <span className="text-[11px] text-brand-grey-500 font-medium">غير متوفرة</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
      </div>

      <BottomNavBar activeTab="lectures" onNavigate={onNavigate} noSticky />

      {/* ===== Product Detail Bottom Sheet ===== */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailScreen
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}