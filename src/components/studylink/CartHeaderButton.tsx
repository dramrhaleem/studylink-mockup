'use client'

import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface CartHeaderButtonProps {
  onNavigate?: (screen: string) => void
  /** Override the default size — 'sm' for compact headers */
  size?: 'default' | 'sm'
  /** Light variant for dark/gradient backgrounds */
  light?: boolean
}

export default function CartHeaderButton({ onNavigate, size = 'default', light = false }: CartHeaderButtonProps) {
  const cartCount = useStudylinkStore(s => s.cart.reduce((sum, item) => sum + item.quantity, 0))

  const isSm = size === 'sm'
  const btnClass = isSm
    ? 'w-8 h-8'
    : 'w-9 h-9'
  const iconClass = isSm
    ? 'w-[16px] h-[16px]'
    : 'w-[18px] h-[18px]'
  const badgeClass = isSm
    ? 'min-w-[14px] h-[14px] text-[11px]'
    : 'min-w-[16px] h-[16px] text-[12px]'

  return (
    <motion.button data-tap="44"
      aria-label="السلة"
      onClick={() => onNavigate?.('cart')}
      whileTap={{ scale: 0.9 }}
      className={`relative flex items-center justify-center rounded-full active:scale-95 transition-colors ${
        light
          ? `${btnClass} bg-white/15 text-white`
          : `${btnClass} bg-brand-grey-100 text-navy-800`
      }`}
    >
      <ShoppingCart className={iconClass} />
      {cartCount > 0 && (
        <motion.span
          key={cartCount}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 500, damping: 15 }}
          className={`absolute -top-0.5 -start-0.5 flex items-center justify-center rounded-full bg-sky-500 text-white font-bold sl-num px-0.5 shadow-sm shadow-sky-500/30 ${badgeClass}`}
        >
          {cartCount}
        </motion.span>
      )}
    </motion.button>
  )
}