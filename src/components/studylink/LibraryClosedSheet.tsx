'use client'

import { X, ShoppingBag, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LibraryClosedSheetProps {
  storeName: string
  reopenTime: string
  onClose: () => void
  onPreOrder: () => void
}

export default function LibraryClosedSheet({
  storeName,
  reopenTime,
  onClose,
  onPreOrder,
}: LibraryClosedSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* Bottom Sheet Panel */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[51] bg-white rounded-t-3xl shadow-[0_-4px_32px_rgba(0,0,0,0.10)] px-6 pt-3 pb-8"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-brand-grey-300" />
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center">
            <span className="text-3xl">🌙</span>
          </div>
        </div>

        {/* Dynamic Text */}
        <h2 className="text-center text-[15px] font-bold text-navy-800 leading-relaxed px-2">
          مكتبة{' '}
          <span className="text-sky-500">{storeName}</span>{' '}
          مغلقة الآن، وتعاود العمل{' '}
          <span className="text-brand-grey-700">{reopenTime}</span>
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[13px] text-brand-grey-400 mt-2 mb-6 leading-relaxed">
          ممكن تطلب وقتي وهجهز لك الطلب قبل ما يفتحوا
        </p>

        {/* Pre-Order CTA */}
        <button data-tap="44"
          onClick={onPreOrder}
          className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white font-semibold text-[14px] py-3.5 px-6 rounded-xl active:scale-[0.98] transition-transform shadow-md shadow-sky-500/20"
        >
          <ShoppingBag className="w-4 h-4" />
          اطلب الوقتي واستلم بكرا
        </button>

        {/* Close Option */}
        <button data-tap="44"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-1 text-brand-grey-400 text-[13px] font-medium mt-3 py-2"
        >
          <ChevronDown className="w-4 h-4" />
          إغلاق
        </button>
      </motion.div>
    </>
  )
}