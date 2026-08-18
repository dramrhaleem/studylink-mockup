'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Phone, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface OTPScreenProps {
  onNavigate?: (screen: string) => void
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

const scaleOnFocus = {
  idle: { scale: 1 },
  focused: { scale: 1.08, transition: { type: 'spring' as const, stiffness: 400, damping: 20 } },
}

export default function OTPScreen({ onNavigate }: OTPScreenProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', ''])
  const [focusedIndex, setFocusedIndex] = useState<number>(0)
  const [countdown, setCountdown] = useState(59)
  const [isVerified, setIsVerified] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    timerRef.current = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [countdown])

  // Auto-verify when all 4 digits are entered
  useEffect(() => {
    const allFilled = otp.every((digit) => digit !== '')
    if (allFilled && otp.join('').length === 4 && !isVerified) {
      const timer = setTimeout(() => {
        setIsVerified(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [otp, isVerified])

  // Navigate to home after successful verification
  useEffect(() => {
    if (!isVerified) return
    const timer = setTimeout(() => {
      onNavigate?.('home')
    }, 1500)
    return () => clearTimeout(timer)
  }, [isVerified, onNavigate])

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      // Only accept digits
      if (value && !/^\d$/.test(value)) return

      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value !== '' && index < 3) {
        inputRefs.current[index + 1]?.focus()
        setFocusedIndex(index + 1)
      }
    },
    [otp]
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (otp[index] === '' && index > 0) {
          // Move to previous input and clear it
          const newOtp = [...otp]
          newOtp[index - 1] = ''
          setOtp(newOtp)
          inputRefs.current[index - 1]?.focus()
          setFocusedIndex(index - 1)
        }
      }
    },
    [otp]
  )

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index)
  }, [])

  const handleResend = useCallback(() => {
    if (countdown > 0) {
      toast.error('يرجى الانتظار حتى انتهاء العداد')
      return
    }
    setOtp(['', '', '', ''])
    setCountdown(59)
    setIsVerified(false)
    inputRefs.current[0]?.focus()
    setFocusedIndex(0)
    toast.success('تم إعادة إرسال رمز التحقق')
  }, [countdown])

  return (
    <div className="screen-enter flex flex-col min-h-full bg-brand-grey-100">
      {/* Header with back button */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <motion.button data-tap="44" aria-label="رجوع"
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate?.('register')}
          className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center border border-brand-grey-200/50 tap-44"
        >
          <ChevronLeft className="w-5 h-5 text-navy-800 rotate-180" />
        </motion.button>
        <div className="w-9" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-6">
        {/* Illustration - gradient circle with Phone icon */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30 relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-2 -start-2 w-8 h-8 rounded-full bg-sky-300/40 blur-sm"
            />
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-2 -end-2 w-10 h-10 rounded-full bg-sky-300/30 blur-sm"
            />
            <Phone className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-navy-800 mb-2"
        >
          تأكيد رقم الهاتف
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="text-sm text-brand-grey-400 text-center mb-8 max-w-[260px] leading-relaxed"
        >
          أدخل رمز التحقق المُرسل إلى{' '}
          <span className="text-navy-800 font-semibold sl-num" dir="ltr">
            01xxxxxxxxx
          </span>
        </motion.p>

        {/* OTP Input Boxes */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8" dir="ltr"
        >
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              variants={scaleOnFocus}
              animate={focusedIndex === index ? 'focused' : 'idle'}
            >
              <input
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => handleFocus(index)}
                className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-navy-800 text-navy-800 bg-white focus:border-sky-500 focus:outline-none transition-colors shadow-sm sl-num"
                aria-label={`OTP digit ${index + 1}`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Resend code section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          {countdown > 0 ? (
            <p className="text-sm text-brand-grey-400 text-center">
              أعد الإرسال بعد{' '}
              <span className="text-navy-800 font-semibold sl-num">
                {formatTime(countdown)}
              </span>
            </p>
          ) : (
            <button data-tap="44"
              onClick={handleResend}
              className="text-sm text-sky-500 font-semibold hover:text-sky-600 transition-colors"
            >
              لم تستلم الكود؟ أعد الإرسال
            </button>
          )}
        </motion.div>

        {/* Verify Button */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            {!isVerified ? (
              <motion.button
                key="verify-btn"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const code = otp.join('')
                  if (code.length < 4) {
                    toast.error('يرجى إدخال رمز التحقق كاملاً')
                    return
                  }
                }}
                className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-[15px] transition-colors shadow-lg shadow-sky-500/25"
              >
                تأكيد
              </motion.button>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex flex-col items-center justify-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  <CheckCircle2 className="w-16 h-16 text-success" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-bold text-success mt-3"
                >
                  تم التحقق بنجاح!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* "Didn't receive?" label (always visible above the timer) */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.24 }}
          className="text-xs text-brand-grey-400 mt-4 text-center"
        >
          لم تستلم الكود؟ تحقق من مجلد الرسائل غير المرغوب فيها
        </motion.p>
      </div>
    </div>
  )
}