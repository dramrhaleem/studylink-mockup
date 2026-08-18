'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, GraduationCap, BookOpen, Stethoscope, FileText, Smartphone, Scissors, Send, Star } from 'lucide-react'

interface OnboardingScreenProps {
  onNavigate?: (screen: string) => void
}

const slides = [
  {
    id: 1,
    emoji: GraduationCap,
    secondaryEmojis: [BookOpen, Stethoscope],
    title: 'مرحباً بك في StudyLink',
    subtitle: 'سوقك الأكاديمي الأول',
    description: 'منصة متكاملة لطلاب الطب تجمع بين المحاضرات والأدوات الطبية وكل ما تحتاجه لرحلتك الأكاديمية.',
    gradientBg: 'from-sky-100 via-white to-sky-50',
    gradientCircle: 'from-sky-200 to-sky-100',
    accentColor: 'bg-sky-500',
  },
  {
    id: 2,
    emoji: FileText,
    secondaryEmojis: [Smartphone],
    title: 'اطلب محاضراتك بضغطة زر',
    subtitle: 'محاضرات من أفضل الدكاترة',
    description: 'مذكرات وملخصات من المكتبات الشريكة، توصلك لحد باب البيت أو تستلمها من المكتبة.',
    gradientBg: 'from-navy-50 via-white to-navy-50/50',
    gradientCircle: 'from-navy-100 to-navy-50',
    accentColor: 'bg-navy-800',
  },
  {
    id: 3,
    emoji: Stethoscope,
    secondaryEmojis: [Scissors],
    title: 'أدوات طبية ومكتبية',
    subtitle: 'كل ما تحتاجه في مكان واحد',
    description: 'سماعات ومعاطف وأدوات مكتبية — بسعر المكتبة الرسمي، ومصدر كل منتج مكتوب قدامك.',
    gradientBg: 'from-teal-50 via-white to-sky-50',
    gradientCircle: 'from-teal-100 to-teal-50',
    accentColor: 'bg-teal-600',
  },
  {
    id: 4,
    emoji: Send,
    secondaryEmojis: [Star],
    title: 'ابدأ رحلتك الآن',
    subtitle: 'اختار فرقتك وابدأ',
    description: 'حدّد فرقتك مرة واحدة، وهنعرض لك مذكرات وأدوات موادك أنت بس.',
    gradientBg: 'from-navy-50 via-sky-50 to-white',
    gradientCircle: 'from-navy-100 to-sky-100',
    accentColor: 'bg-sky-500',
  },
]

const textStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const textStaggerItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

export default function OnboardingScreen({ onNavigate }: OnboardingScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, clientWidth } = scrollRef.current
    const index = Math.round(scrollLeft / clientWidth)
    if (index !== currentSlide) {
      setCurrentSlide(index)
    }
  }, [currentSlide])

  const goToSlide = (index: number) => {
    if (!scrollRef.current) return
    const { clientWidth } = scrollRef.current
    scrollRef.current.scrollTo({ left: index * clientWidth, behavior: 'smooth' })
  }

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1)
    }
  }

  const handleGetStarted = () => {
    onNavigate?.('home')
  }

  const handleSkip = () => {
    onNavigate?.('home')
  }

  const handleLoginLater = () => {
    onNavigate?.('home')
  }

  const isLastSlide = currentSlide === slides.length - 1
  const progress = ((currentSlide + 1) / slides.length) * 100
  const slide = slides[currentSlide]

  return (
    <div className="screen-enter min-h-full bg-white flex flex-col relative overflow-hidden" dir="rtl">
      {/* Animated gradient progress bar at top */}
      <div className="absolute top-0 end-0 start-0 z-30 h-1 bg-brand-grey-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-sky-500 via-navy-800 to-sky-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Shimmer on progress bar */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>

      {/* Skip button - top right */}
      <div className="absolute top-4 end-4 z-20">
        <motion.button data-tap="44"
          onClick={handleSkip}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-1 text-brand-grey-500 text-[13px] sl-num hover:text-brand-grey-700 transition-colors px-3 py-1.5 rounded-full hover:bg-brand-grey-100"
          aria-label="تخطي"
        >
          <span>تخطي</span>
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Slides container with AnimatePresence transitions */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slides.map((s, index) => {
          const isActive = currentSlide === index
          return (
            <AnimatePresence key={s.id} mode="wait">
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: 'easeOut' as const }}
                  className={`w-full flex-shrink-0 snap-center flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-b ${s.gradientBg}`}
                >
                  {/* Illustration area with gradient circle background + floating/bobbing */}
                  <div className="relative mb-8 flex items-center justify-center" style={{ width: 180, height: 180 }}>
                    {/* Gradient background circle */}
                    <motion.div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${s.gradientCircle} opacity-70`}
                      style={{ transform: 'scale(1.1)' }}
                      animate={{ 
                        scale: [1.1, 1.15, 1.1],
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: 'easeInOut' 
                      }}
                    />
                    {/* Decorative outer ring */}
                    <div
                      className={`absolute inset-[-8px] rounded-full bg-gradient-to-br ${s.gradientBg} opacity-40`}
                    />
                    {/* Main icon — floating/bobbing animation */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
                      transition={{
                        scale: { duration: 0.5, type: 'spring', stiffness: 200 },
                        opacity: { duration: 0.3 },
                        y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
                      }}
                      className="relative z-10 flex items-center justify-center"
                    >
                      <s.emoji className="w-16 h-16 text-navy-800" aria-hidden />
                    </motion.div>
                    {/* Secondary icons floating around with bobbing */}
                    {s.secondaryEmojis.map((Icon, ei) => (
                      <motion.span
                        key={ei}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          y: [0, -6, 0],
                        }}
                        transition={{ 
                          opacity: { delay: 0.35 + ei * 0.12, duration: 0.4 },
                          scale: { delay: 0.35 + ei * 0.12, duration: 0.4, type: 'spring' },
                          y: { duration: 3.5 + ei * 0.5, repeat: Infinity, ease: 'easeInOut', delay: ei * 0.3 },
                        }}
                        className="absolute z-10"
                        style={{
                          top: ei === 0 ? 8 : 'auto',
                          bottom: ei === 0 ? 'auto' : 12,
                          right: ei === 0 ? -4 : 'auto',
                          left: ei === 0 ? 'auto' : 4,
                        }}
                      >
                        <Icon className="w-7 h-7 text-navy-800" aria-hidden />
                      </motion.span>
                    ))}
                    {/* Slide 2 specific: phone mockup CSS art */}
                    {index === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, rotate: [0, 2, -2, 0] }}
                        transition={{ 
                          opacity: { delay: 0.5, duration: 0.4 },
                          y: { delay: 0.5, duration: 0.4 },
                          rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                        }}
                        className="absolute z-10 top-[-12px] left-[-10px]"
                      >
                        <div className="w-12 h-20 rounded-xl bg-white/90 shadow-md border border-brand-grey-200/50 flex flex-col items-center pt-1.5 gap-1">
                          <div className="w-5 h-5 rounded-md bg-sky-100 flex items-center justify-center">
                            <FileText className="w-3 h-3 text-sky-600" aria-hidden />
                          </div>
                          <div className="w-8 h-1 rounded-full bg-brand-grey-200" />
                          <div className="w-6 h-1 rounded-full bg-brand-grey-100" />
                          <div className="w-8 h-1 rounded-full bg-brand-grey-200" />
                        </div>
                      </motion.div>
                    )}
                    {/* Slide 3 specific: tool card CSS art */}
                    {index === 2 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
                        transition={{ 
                          opacity: { delay: 0.5, duration: 0.4 },
                          scale: { delay: 0.5, duration: 0.4 },
                          y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
                        }}
                        className="absolute z-10 bottom-[-8px] right-[-8px]"
                      >
                        <div className="w-14 h-8 rounded-lg bg-navy-800 shadow-lg flex items-center justify-center gap-1 px-1.5">
                          <Scissors className="w-3 h-3 text-white" aria-hidden />
                          <Stethoscope className="w-3 h-3 text-white" aria-hidden />
                        </div>
                      </motion.div>
                    )}
                    {/* Slide 4 specific: star accent */}
                    {index === 3 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0, rotate: -30 }}
                        animate={{ opacity: 1, scale: 1, rotate: [0, 15, -15, 0] }}
                        transition={{
                          opacity: { delay: 0.45, duration: 0.5 },
                          scale: { delay: 0.45, duration: 0.5, type: 'spring' },
                          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                        }}
                        className="absolute z-10 top-[-4px] end-[30%]"
                      >
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" aria-hidden />
                      </motion.span>
                    )}
                  </div>

                  {/* Text content — staggered entrance per slide */}
                  <motion.div
                    key={`text-${index}`}
                    variants={textStaggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="text-center max-w-[280px]"
                  >
                    <motion.h2
                      variants={textStaggerItem}
                      className="text-[20px] font-bold text-navy-800 leading-relaxed mb-2"
                    >
                      {s.title}
                    </motion.h2>
                    <motion.p
                      variants={textStaggerItem}
                      className="text-[14px] font-semibold text-sky-500 mb-2"
                    >
                      {s.subtitle}
                    </motion.p>
                    <motion.p
                      variants={textStaggerItem}
                      className="text-[13px] text-brand-grey-500 leading-relaxed"
                    >
                      {s.description}
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )
        })}
      </div>

      {/* Bottom section: dots + button */}
      <div className="flex-shrink-0 px-6 pb-8 pt-4">
        {/* Dot indicators with layoutId animated indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 h-2">
          {slides.map((_, index) => (
            <div key={index} className="relative w-6 h-2 flex items-center justify-center">
              {currentSlide === index && (
                <motion.span
                  layoutId="activeDot"
                  className={`absolute inset-0 rounded-full ${slide.accentColor}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                className={`w-2 h-2 rounded-full transition-colors duration-300 relative z-10 ${
                  currentSlide === index ? 'bg-white' : 'bg-brand-grey-300'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {isLastSlide ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
            className="flex flex-col gap-3"
          >
            {/* Final CTA with glow pulse effect */}
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="relative w-full h-12 rounded-2xl bg-sky-500 text-white font-bold text-[16px] flex items-center justify-center gap-2 overflow-hidden"
            >
              {/* Glow pulse ring */}
              <motion.span
                className="absolute inset-0 rounded-2xl bg-sky-400"
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(37, 148, 210, 0)',
                    '0 0 20px rgba(37, 148, 210, 0.4)',
                    '0 0 0px rgba(37, 148, 210, 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Shimmer sweep */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
              <Sparkles className="w-4.5 h-4.5 relative z-10" />
              <span className="relative z-10">ابدأ الآن</span>
            </motion.button>
            <motion.button data-tap="44"
              onClick={handleLoginLater}
              whileTap={{ scale: 0.96 }}
              className="w-full h-10 rounded-2xl text-brand-grey-400 font-medium text-[14px] hover:text-brand-grey-600 transition-all tap-44"
            >
              تسجيل دخول لاحقاً
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key={currentSlide}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            onClick={goNext}
            whileTap={{ scale: 0.96 }}
            className="relative w-full h-12 rounded-2xl bg-navy-800 text-white font-bold text-[16px] overflow-hidden"
          >
            {/* Shimmer sweep on Next button */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            />
            <span className="relative z-10">التالي</span>
          </motion.button>
        )}
      </div>

      {/* Webkit scrollbar hide */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}