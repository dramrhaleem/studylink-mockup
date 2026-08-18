'use client'

import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { ALL_GRADES, type GradeType } from '@/lib/studylink-data'

interface GradeGateOverlayProps {
  onSelectGrade: (grade: GradeType) => void
  subtitle?: string
}

export default function GradeGateOverlay({ onSelectGrade, subtitle }: GradeGateOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      }}
    >
      {/* Animated gradient background overlay (frosted glass light catch) */}
      <div
        className="absolute inset-0 frosted-gradient-shift opacity-60"
        style={{
          background: 'linear-gradient(135deg, rgba(109,186,225,0.12) 0%, rgba(245,245,245,0.55) 25%, rgba(167,139,250,0.10) 50%, rgba(255,255,255,0.65) 75%, rgba(251,191,36,0.08) 100%)',
        }}
      />

      {/* Floating decorative shapes for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="float-shape-1 absolute top-[12%] right-[15%] w-14 h-14 rounded-full bg-sky-300/20 blur-sm" />
        <div className="float-shape-2 absolute top-[28%] left-[10%] w-10 h-10 rounded-full bg-violet-300/20 blur-sm" />
        <div className="float-shape-3 absolute bottom-[30%] right-[8%] w-12 h-12 rounded-full bg-amber-300/20 blur-sm" />
        <div className="float-shape-4 absolute top-[55%] left-[20%] w-8 h-8 rounded-full bg-sky-300/15 blur-sm" />
        <div className="float-shape-5 absolute bottom-[18%] right-[35%] w-16 h-16 rounded-full bg-violet-300/10 blur-md" />
        <div className="float-shape-6 absolute top-[8%] left-[45%] w-6 h-6 rounded-full bg-amber-300/15 blur-sm" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.05 }}
        className="relative flex flex-col items-center text-center w-full px-6"
      >
        {/* Icon container — larger with gradient + glow + breathing */}
        <div className="icon-breathe w-16 h-16 mb-4 rounded-3xl bg-gradient-to-br from-navy-800 to-sky-900 shadow-lg shadow-black/10 flex items-center justify-center border border-white/10">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>

        {/* Text card — right border accent (RTL), better shadow, more padding */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-5 mb-5 w-full max-w-[280px] shadow-xl shadow-black/5 border border-brand-grey-200/40 border-r-4 border-r-sky-400">
          <p className="text-[13px] font-bold text-navy-900 mb-1.5 leading-relaxed">
            قولنا على دفعتك عشان نقدر نقدملك تجربة أفضل!
          </p>
          <p className="text-[12px] text-brand-grey-600 leading-relaxed">
            {subtitle || 'اختار فرقتك وهنعرضلك المحاضرات المناسبة لك'}
          </p>
        </div>

        {/* Grade buttons — gradient hover, better shadow, decorative dot, larger padding */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[260px]">
          {ALL_GRADES.map((grade, i) => (
            <motion.button data-tap="44"
              key={grade}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04 }}
              onClick={() => onSelectGrade(grade)}
              className="bg-white/90 backdrop-blur-sm border border-brand-grey-200/60 rounded-xl px-2 py-4 text-[12px] font-bold text-navy-800 shadow-lg shadow-black/5 active:scale-95 transition-all duration-200 hover:shadow-xl hover:border-sky-400/70 hover:text-sky-700 hover:bg-gradient-to-br hover:from-white hover:to-sky-50 flex flex-col items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-sky-300/60" />
              {grade.replace('الفرقة ', '')}
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-6 text-[12px] text-brand-grey-400 select-none">
          StudyLink © 2025
        </p>
      </motion.div>
    </motion.div>
  )
}