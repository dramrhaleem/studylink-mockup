'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Send, MessageSquare, ChevronLeft, Heart } from 'lucide-react'
import { toast } from 'sonner'

interface RateAppScreenProps {
  onNavigate?: (screen: string) => void
}

const ratingLabels: Record<number, string> = {
  1: 'نأسف',
  2: 'نأسف',
  3: 'جيد',
  4: 'رائع',
  5: 'رائع',
}

// Confetti particle component for thank you state
function ConfettiParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  const colors = ['#F59E0B', '#1A70B0', '#007C50', '#EF4444', '#8B5CF6', '#F97316']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const isCircle = Math.random() > 0.5

  return (
    <motion.span
      className="absolute top-0 left-1/2 pointer-events-none"
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, -40, 120],
        x: [0, x, x * 2.5],
        rotate: [0, 180 + Math.random() * 360],
        scale: [0.5, 1, 0.3],
      }}
      transition={{
        duration: 1.8,
        delay,
        ease: 'easeOut',
      }}
      style={{ width: size, height: isCircle ? size : size * 2.5 }}
    >
      <span
        className="block w-full h-full rounded-sm"
        style={{ backgroundColor: color, borderRadius: isCircle ? '50%' : '2px' }}
      />
    </motion.span>
  )
}

// Floating decorative star
function FloatingStar({ size, className, delay, duration }: { 
  size: number; 
  className: string; 
  delay: number; 
  duration: number 
}) {
  return (
    <motion.span
      className={`absolute pointer-events-none ${className}`}
      animate={{
        y: [0, -12, 0],
        x: [0, 6, -4, 0],
        opacity: [0.15, 0.3, 0.15],
        rotate: [0, 15, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <Star size={size} className="text-warning/20 fill-warning/20" />
    </motion.span>
  )
}

export default function RateAppScreen({ onNavigate }: RateAppScreenProps) {
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [starsReady, setStarsReady] = useState(false)

  // Trigger sequential star pop-in after mount
  useEffect(() => {
    const timer = setTimeout(() => setStarsReady(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Reset stars when switching from submitted back to form
  useEffect(() => {
    if (!submitted) {
      /* إعادة تشغيل حركة النجوم عند العودة من شاشة الشكر — توقيت عرضي. */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStarsReady(false)
      const timer = setTimeout(() => setStarsReady(true), 100)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  const displayRating = hoveredStar || rating

  const getRatingLabel = () => {
    const r = displayRating || rating
    if (r === 0) return ''
    return ratingLabels[r] || ''
  }

  const handleSubmit = () => {
    if (rating === 0) return
    setSubmitted(true)
    toast.success('شكراً لتقييمك!')
  }

  const handleLater = () => {
    onNavigate?.('home')
  }

  return (
    <div className="screen-enter min-h-full bg-brand-grey-100 flex flex-col relative overflow-hidden">
      {/* Floating decorative stars with parallax drift */}
      <FloatingStar size={16} className="top-[8%] start-[8%]" delay={0} duration={5} />
      <FloatingStar size={12} className="top-[15%] end-[12%]" delay={0.8} duration={6} />
      <FloatingStar size={20} className="top-[45%] start-[5%]" delay={1.5} duration={5.5} />
      <FloatingStar size={10} className="top-[60%] end-[6%]" delay={0.3} duration={4.5} />
      <FloatingStar size={14} className="bottom-[20%] start-[15%]" delay={2} duration={6.5} />

      {/* Header — gradient navy-800 → sky-900 with animated star decorations */}
      <div className="relative flex items-center justify-center px-4 py-3 bg-gradient-to-l from-navy-800 to-sky-900 overflow-hidden">
        {/* Decorative animated stars in header */}
        <motion.span
          className="absolute top-1 start-8 pointer-events-none"
          animate={{ rotate: [0, 360], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Star size={14} className="text-white/20 fill-white/20" />
        </motion.span>
        <motion.span
          className="absolute bottom-1 end-10 pointer-events-none"
          animate={{ rotate: [0, -360], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          <Star size={10} className="text-white/15 fill-white/15" />
        </motion.span>
        <motion.span
          className="absolute top-2 left-1/3 pointer-events-none"
          animate={{ y: [0, -3, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Star size={8} className="text-white/20 fill-white/20" />
        </motion.span>

        <button data-tap="44"
          onClick={handleLater}
          className="absolute start-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
          aria-label="إغلاق"
        >
          <X size={20} className="text-white/70" />
        </button>
        <h1 className="text-base font-bold text-white">تقييم التطبيق</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-5 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-sm overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-6 flex flex-col items-center gap-5"
              >
                {/* Animated Heart */}
                <motion.div
                  animate={{
                    scale: [1, 1.18, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Heart className="w-12 h-12 text-error fill-error" aria-hidden="true" />
                </motion.div>

                {/* Title */}
                <h2 className="text-lg font-bold text-navy-800 text-center leading-relaxed">
                  شكراً لاستخدامك StudyLink!
                </h2>

                <p className="text-sm text-brand-grey-400 text-center -mt-3">
                  كيف تقيّم تجربتك مع التطبيق؟
                </p>

                {/* Star Rating — sequential pop-in animation */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoveredStar || rating)
                      const isSelected = star <= rating && rating > 0
                      return (
                        <motion.button data-tap="44"
                          key={star}
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ 
                            scale: starsReady ? 1 : 0, 
                            rotate: starsReady ? 0 : -45,
                          }}
                          transition={{ 
                            delay: 0.1 * (star - 1), 
                            duration: 0.35, 
                            type: 'spring', 
                            stiffness: 400, 
                            damping: 12 
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onHoverStart={() => setHoveredStar(star)}
                          onHoverEnd={() => setHoveredStar(0)}
                          onClick={() => setRating(star)}
                          className="p-0.5 focus:outline-none relative"
                          aria-label={`تقييم ${star} نجوم`}
                        >
                          {/* Golden glow pulse for selected stars */}
                          {isSelected && (
                            <motion.span
                              className="absolute inset-0 rounded-full bg-warning/30"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                ease: 'easeInOut',
                                delay: (star - 1) * 0.1,
                              }}
                            />
                          )}
                          <Star
                            size={36}
                            className={`
                              ${isFilled ? 'fill-warning text-warning' : 'text-brand-grey-200 stroke-brand-grey-300'}
                              transition-colors duration-150 relative z-10
                            `}
                            strokeWidth={isFilled ? 0 : 1.5}
                            fill={isFilled ? 'currentColor' : 'none'}
                          />
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Rating Label */}
                  <AnimatePresence mode="wait">
                    {displayRating > 0 && (
                      <motion.span
                        key={displayRating}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-semibold text-navy-800"
                      >
                        {getRatingLabel()}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Feedback Textarea with animated character count */}
                <div className="w-full relative">
                  <div className="relative">
                    <MessageSquare
                      size={16}
                      className="absolute start-3 top-3 text-brand-grey-400 pointer-events-none"
                    />
                    <textarea
                      value={feedback}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setFeedback(e.target.value)
                        }
                      }}
                      placeholder="أخبرنا المزيد..."
                      rows={3}
                      aria-label="رأيك في التطبيق" className="w-full ps-9 pe-3 pt-2.5 pb-6 text-sm bg-brand-grey-100 rounded-xl border-0 text-navy-800 placeholder:text-brand-grey-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-shadow"
                      dir="rtl"
                    />
                  </div>
                  {/* Animated character count */}
                  <motion.span
                    key={feedback.length}
                    initial={{ scale: feedback.length > 0 ? 1.1 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`absolute bottom-2 end-3 text-xs sl-num flex items-center gap-0.5 ${
                      feedback.length >= 190
                        ? 'text-error'
                        : 'text-brand-grey-400'
                    }`}
                  >
                    <span className="sl-num">{feedback.length}</span>
                    <span className="text-brand-grey-400">/</span>
                    <span className="sl-num">200</span>
                    {feedback.length > 0 && (
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: `${(feedback.length / 200) * 40}px` }}
                        className="h-1 rounded-full bg-sky-400 ms-1 inline-block"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.span>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-2.5 mt-1">
                  {/* Submit button with shimmer sweep */}
                  <motion.button data-tap="44"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    /* الحالة المعطّلة كانت نصًّا أبيض على grey-200 = 1.4:1.
                       المواصفة تحدد `bg-grey-300 + text-grey-500` للمعطّل. */
                    className={`w-full h-12 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 relative overflow-hidden transition-colors duration-200 ${
                      rating === 0
                        ? 'bg-brand-grey-300 text-brand-grey-500 cursor-not-allowed'
                        : 'bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900'
                    }`}
                  >
                    {/* Shimmer sweep */}
                    {rating > 0 && (
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                      />
                    )}
                    <Send size={16} className="relative z-10" />
                    <span className="relative z-10">إرسال التقييم</span>
                  </motion.button>

                  <motion.button data-tap="44"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLater}
                    className="w-full py-2.5 rounded-xl text-brand-grey-400 text-sm font-semibold hover:bg-brand-grey-100 transition-colors"
                  >
                    لاحقاً
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 flex flex-col items-center gap-4 relative overflow-hidden"
              >
                {/* Confetti micro-animation */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <ConfettiParticle
                    key={i}
                    delay={0.1 + i * 0.05}
                    x={-80 + Math.random() * 160}
                    size={4 + Math.random() * 6}
                  />
                ))}

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg font-bold text-navy-800 text-center"
                >
                  شكراً لتقييمك!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="text-sm text-brand-grey-400 text-center leading-relaxed"
                >
                  رأيك يهمنا ويساعدنا في تحسين التطبيق لتجربة أفضل
                </motion.p>

                {/* Show selected stars with sequential animation */}
                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center gap-1"
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.div
                        key={s}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: 0.85 + s * 0.08, 
                          type: 'spring', 
                          stiffness: 400, 
                          damping: 15 
                        }}
                      >
                        <Star
                          size={20}
                          className={
                            s <= rating
                              ? 'fill-warning text-warning'
                              : 'text-brand-grey-200'
                          }
                          fill={s <= rating ? 'currentColor' : 'none'}
                          strokeWidth={s <= rating ? 0 : 1.5}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <motion.button data-tap="44"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLater}
                  className="mt-2 flex items-center gap-1.5 text-sm text-sky-500 font-semibold"
                >
                  <ChevronLeft size={16} />
                  العودة للرئيسية
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}