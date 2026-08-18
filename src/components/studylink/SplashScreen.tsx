'use client'

import { asset } from '@/lib/asset'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SplashScreenProps {
  /** حين تكون false تُتخطّى الشاشة تمامًا — مثلًا عند فتح رابط ?screen=. */
  active?: boolean
  onComplete: () => void
}

export default function SplashScreen({ active = true, onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'done'>('logo')

  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete })

  /* كانت الشاشة تعمل مؤقّتها دائمًا حتى مع الروابط المباشرة، فتغطّي محتوى
     ظاهرًا بالفعل لثانيتين. صارت تحترم `active`. */
  useEffect(() => {
    /* الشاشة تحترم `active`: عند الروابط المباشرة تُنهي نفسها فورًا بدل تغطية محتوى ظاهر. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!active) { setPhase('done'); return }
    const t1 = setTimeout(() => setPhase('text'), 800)
    const t2 = setTimeout(() => { setPhase('done'); onCompleteRef.current() }, 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [active])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-800"
          dir="rtl"
          role="status"
          aria-label="جارٍ فتح StudyLink"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <AnimatePresence mode="wait">
              {phase === 'logo' && (
                <motion.div
                  key="logo"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 flex items-center justify-center"
                >
                  <Image
                    src={asset('/brand/mark-full-on-dark.svg')}
                    alt=""
                    width={80}
                    height={80}
                    priority
                    className="w-20 h-20"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {phase === 'text' && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <p className="text-2xl font-bold text-white mb-1">StudyLink</p>
                  <p className="text-[14px] text-sky-200 font-medium">سوق أكاديمي لطلبة جامعة المنصورة</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-sky-400"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}