'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

function haptic(light = true) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(light ? 10 : 25)
  }
}

interface QuantityControlProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  size?: 'sm' | 'md'
}

export default function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  size = 'md',
}: QuantityControlProps) {
  const isSmall = size === 'sm'
  const btnSize = isSmall ? 'h-7 w-7' : 'h-8 w-8'
  const iconSize = isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'

  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex items-center gap-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Minus button */}
      <button data-tap="44" aria-label="إنقاص"
        onClick={() => {
          haptic()
          onDecrement()
        }}
        className={`flex ${btnSize} shrink-0 items-center justify-center rounded-full bg-sky-500 text-white active:scale-90 transition-all duration-150`}
      >
        <Minus className={iconSize} strokeWidth={2.5} />
      </button>

      {/* Quantity display */}
      <motion.span
        key={quantity}
        initial={{ scale: 1.4, y: -4 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className={`min-w-[20px] text-center sl-num ${isSmall ? 'text-[12px]' : 'text-[13px]'} font-bold text-navy-800 tabular-nums`}
      >
        {quantity}
      </motion.span>

      {/* Plus button */}
      <button data-tap="44" aria-label="زيادة"
        onClick={() => {
          haptic()
          onIncrement()
        }}
        className={`flex ${btnSize} shrink-0 items-center justify-center rounded-full bg-sky-500 text-white active:scale-90 transition-all duration-150 shadow-sm shadow-sky-500/25`}
      >
        <Plus className={iconSize} strokeWidth={2.5} />
      </button>
    </motion.div>
  )
}