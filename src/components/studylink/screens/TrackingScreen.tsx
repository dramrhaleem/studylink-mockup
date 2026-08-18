'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Phone, Info, MapPin, Clock, Truck, MessageCircle, ChevronLeft, Share2 } from 'lucide-react'
import { sampleOrder, sampleTrackingSteps, type StoreType } from '@/lib/studylink-data'

interface TrackingScreenProps {
  onNavigate?: (screen: string) => void
}

const allSteps = ['تم القبول', 'بيتجهز', 'جاهز للتسليم', 'مع المندوب', 'تم التسليم']

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const staggerItem = {
  hidden: { opacity: 0, x: 10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

/* ---------- Flip Digit Component for ETA ---------- */
function FlipDigit({ value, label }: { value: string; label?: string }) {
  const [display, setDisplay] = useState(value)
  const flipping = display !== value

  useEffect(() => {
    if (display !== value) {
      const t = setTimeout(() => {
        setDisplay(value)
      }, 150)
      return () => clearTimeout(t)
    }
  }, [value, display])

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative overflow-hidden"
        animate={flipping ? { rotateX: [0, -90, 0] } : {}}
        transition={{ duration: 0.3 }}
        style={{ perspective: 200 }}
      >
        <div className="bg-navy-800 text-white text-[18px] font-bold sl-num w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
          {display}
        </div>
      </motion.div>
      {label && <span className="text-[12px] text-brand-grey-400 mt-1">{label}</span>}
    </div>
  )
}

/* ---------- Animated Gradient Connecting Line for Timeline ---------- */
function GradientTimelineLine({ completedCount, totalSteps, direction = 'rtl' }: {
  completedCount: number
  totalSteps: number
  direction?: 'rtl' | 'ltr'
}) {
  const progress = completedCount / (totalSteps - 1)

  return (
    <div className="absolute top-[9px] bottom-[9px] w-0 right-[9px] z-0">
      {/* Background line (dashed) */}
      <div className="w-full h-full border-r-[2px] border-dashed border-brand-grey-200" />
      {/* Gradient fill line */}
      <motion.div
        className="absolute top-0 w-full bg-gradient-to-b from-success via-sky-400 to-sky-500 rounded-full"
        style={{
          height: '2px',
          right: 0,
          width: '2px',
        }}
        initial={{ height: '0%' }}
        animate={{ height: `${progress * 100}%` }}
        transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  )
}

/* ---------- Shimmer Button for Actions ---------- */
function ActionButton({ children, className, onClick, shimmer = true }: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  shimmer?: boolean
}) {
  return (
    <motion.button data-tap="44"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative overflow-hidden active:scale-[0.98] transition-transform ${className || ''}`}
    >
      {shimmer && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          }}
        />
      )}
      {children}
    </motion.button>
  )
}

export default function TrackingScreen({ onNavigate }: TrackingScreenProps) {
  const order = sampleOrder
  const [showMap, setShowMap] = useState(false)

  const getStoreSteps = (store: StoreType) => {
    return sampleTrackingSteps
      .filter(s => s.store === store)
      .sort((a, b) => allSteps.indexOf(a.label) - allSteps.indexOf(b.label))
  }

  const getGlobalSteps = () => {
    return sampleTrackingSteps.filter(s => s.store === null)
  }

  const getStepStatus = (store: StoreType, stepLabel: string): 'completed' | 'current' | 'pending' => {
    const steps = getStoreSteps(store)
    const stepIndex = steps.findIndex(s => s.label === stepLabel)
    if (stepIndex === -1) return 'pending'
    if (steps[stepIndex].completed) return 'completed'
    const prevCompleted = steps
      .filter(s => allSteps.indexOf(s.label) < allSteps.indexOf(stepLabel))
      .every(s => s.completed)
    return prevCompleted ? 'current' : 'pending'
  }

  const completedSteps = allSteps.filter(s => getStepStatus('هارفرد', s) === 'completed').length
  const progressPercent = Math.round((completedSteps / allSteps.length) * 100)

  /* Extract ETA digits for flip animation */
  const etaParts = (order.eta || '30').match(/(\d+)/g) || ['30']

  return (
    <div className="screen-enter min-h-full bg-brand-grey-100">
      {/* Navy→Sky Gradient Header with decorative blurs */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-navy-800 to-sky-900 px-4 pt-3 pb-5 relative overflow-hidden">
        {/* Decorative blur circles */}
        <motion.div
          className="absolute -left-12 -top-12 w-36 h-36 rounded-full bg-sky-500/8 pointer-events-none blur-xl"
          animate={{ x: [0, 8, 0], y: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none blur-lg"
          animate={{ x: [0, -6, 0], y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-20 h-20 rounded-full bg-sky-400/5 pointer-events-none blur-md"
          animate={{ x: [0, 4, 0], y: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <motion.button data-tap="44" aria-label="رجوع"
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate?.('home')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors tap-44"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-[15px] font-bold text-white">تتبع الطلب</h1>
            <div className="w-8" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-[13px] text-white/70">رقم الطلب</p>
              <p className="text-[16px] font-bold text-white sl-num">{order.orderNumber}</p>
            </div>
            <motion.div
              className="bg-sky-500/20 px-3 py-1.5 rounded-xl"
              animate={{ boxShadow: ['0 0 0 0px rgba(37,148,210,0.3)', '0 0 0 4px rgba(37,148,210,0.1)', '0 0 0 0px rgba(37,148,210,0)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* كان <div> داخل <p> — HTML غير صالح يكسر الترطيب في React 19. */}
              <p className="text-[12px] text-sky-300 font-semibold flex items-center gap-1">
                <motion.span
                  className="inline-flex"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Truck className="w-3 h-3" aria-hidden="true" />
                </motion.span>
                {order.status}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Progress Bar with improved dots */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 -mt-1 bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-navy-800">تقدم الطلب</span>
          <motion.span
            className="text-[13px] font-bold sl-num text-sky-500"
            key={progressPercent}
            initial={{ scale: 1.3, color: '#1A70B0' }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {progressPercent}%
          </motion.span>
        </div>
        <div className="h-2 bg-brand-grey-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-l from-sky-400 to-sky-500 rounded-full relative"
          >
            {/* Shimmer on progress bar */}
            <motion.div
              className="absolute inset-0"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              }}
            />
          </motion.div>
        </div>
        {/* Step dots with checkmark for completed, pulsing for current */}
        <div className="flex justify-between mt-3 px-1 relative">
          {/* Animated gradient connecting line */}
          <div className="absolute top-[6px] left-[6px] right-[6px] h-[2px] bg-brand-grey-200 rounded-full">
            <motion.div
              className="h-full bg-gradient-to-l from-success to-sky-400 rounded-full"
              initial={{ width: '0%', originX: 0 }}
              animate={{ width: `${(completedSteps / (allSteps.length - 1)) * 100}%`, originX: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
            />
          </div>

          {allSteps.map((step, idx) => {
            const status = getStepStatus('هارفرد', step)
            return (
              <div key={step} className="flex flex-col items-center gap-1 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1, type: 'spring', stiffness: 300 }}
                  className={`w-[14px] h-[14px] rounded-full flex items-center justify-center relative ${
                    status === 'completed' ? 'bg-success' :
                    status === 'current' ? 'bg-sky-500' :
                    'bg-brand-grey-200'
                  }`}
                >
                  {/* Completed: spring checkmark */}
                  {status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 12, delay: 0.3 + idx * 0.1 }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}

                  {/* Current: pulsing dot + glow ring */}
                  {status === 'current' && (
                    <>
                      <motion.div
                        className="w-2 h-2 rounded-full bg-white"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      />
                      {/* Pulsing glow ring */}
                      <motion.div
                        className="absolute inset-[-4px] rounded-full border-2 border-sky-400"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      />
                    </>
                  )}
                </motion.div>
                <span className={`text-[11px] leading-tight text-center max-w-[60px] ${
                  status === 'pending' ? 'text-brand-grey-400' : 'text-brand-grey-600'
                }`}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Map Placeholder with subtle pan animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-4 mt-3"
      >
        <motion.button data-tap="44"
          onClick={() => setShowMap(!showMap)}
          whileTap={{ scale: 0.98 }}
          className="w-full relative overflow-hidden rounded-2xl bg-navy-50 h-[160px] transition-transform"
        >
          {/* Map pattern with pan animation */}
          <motion.div
            className="absolute inset-[-10px] opacity-[0.06]"
            animate={{
              x: [0, 3, 0, -3, 0],
              y: [0, -2, 0, 2, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #13253A 1px, transparent 0)`,
              backgroundSize: '12px 12px',
            }}
          />
          {/* Fake map roads with pan */}
          <motion.div
            className="absolute inset-0"
            animate={{
              x: [0, 2, 0, -2, 0],
              y: [0, -1.5, 0, 1.5, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-navy-800/10" />
            <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-navy-800/10" />
            <div className="absolute top-0 bottom-0 left-2/3 w-[2px] bg-navy-800/10" />
            <div className="absolute top-1/4 left-0 right-0 h-px bg-navy-800/5" />
            <div className="absolute top-3/4 left-0 right-0 h-px bg-navy-800/5" />
            {/* Diagonal road */}
            <div className="absolute top-[20%] left-[10%] w-[50%] h-px bg-navy-800/8 rotate-[25deg] origin-right" />
          </motion.div>

          {/* Building silhouettes */}
          <motion.div
            className="absolute bottom-[30%] left-[5%] flex items-end gap-1"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-4 h-7 bg-navy-800/8 rounded-t-sm" />
            <div className="w-3 h-5 bg-navy-800/6 rounded-t-sm" />
            <div className="w-5 h-9 bg-navy-800/7 rounded-t-sm" />
            <div className="w-3 h-4 bg-navy-800/5 rounded-t-sm" />
          </motion.div>
          <motion.div
            className="absolute bottom-[25%] right-[10%] flex items-end gap-1"
            animate={{ y: [0, 1, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <div className="w-3 h-6 bg-navy-800/7 rounded-t-sm" />
            <div className="w-4 h-8 bg-navy-800/8 rounded-t-sm" />
            <div className="w-2 h-4 bg-navy-800/6 rounded-t-sm" />
          </motion.div>

          {/* Road names in Arabic */}
          <div className="absolute top-[18%] left-[15%]">
            <span className="text-[11px] text-navy-800/25 font-medium">شارع الجامعة</span>
          </div>
          <div className="absolute top-[52%] right-[12%]">
            <span className="text-[11px] text-navy-800/25 font-medium">عبد الرحمن</span>
          </div>
          <div className="absolute bottom-[18%] left-[40%]">
            <span className="text-[11px] text-navy-800/20 font-medium">شارع النيل</span>
          </div>

          {/* Location markers */}
          <motion.div
            className="absolute top-[30%] left-[22%]"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <span className="text-[12px]">📚</span>
            </div>
          </motion.div>
          <motion.div
            className="absolute top-[50%] left-[58%]"
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <span className="text-[12px]">📖</span>
            </div>
          </motion.div>

          {/* Delivery person with improved animation */}
          <motion.div
            animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute top-[42%] left-[40%]"
          >
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <motion.div
              className="w-10 h-10 rounded-full bg-success/20 absolute -top-1 -left-1"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Destination with glow */}
          <motion.div
            className="absolute bottom-4 right-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center shadow-lg">
              <MapPin className="w-4 h-4 text-white" />
            </div>
          </motion.div>

          {/* Overlay text */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
            <p className="text-[12px] text-brand-grey-600 flex items-center gap-1">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-success"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              المندوب في الطريق
            </p>
          </div>
        </motion.button>
      </motion.div>

      {/* Quick Actions with shimmer and whileTap scale */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex gap-2.5 px-4 mt-3"
      >
        <ActionButton
          className="flex-1 flex items-center justify-center gap-2 bg-success text-white rounded-2xl p-3 shadow-sm"
          shimmer
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 4 }}
          >
            <Phone className="w-4 h-4" />
          </motion.div>
          <span className="text-[13px] font-semibold">اتصل بالمندوب</span>
        </ActionButton>
        <ActionButton
          className="flex-1 flex items-center justify-center gap-2 bg-white text-navy-800 rounded-2xl p-3 shadow-sm border border-brand-grey-200/50"
          shimmer
        >
          <MessageCircle className="w-4 h-4 text-sky-500" />
          <span className="text-[13px] font-semibold">رسالة</span>
        </ActionButton>
        <ActionButton
          className="w-12 flex items-center justify-center bg-white text-navy-800 rounded-2xl p-3 shadow-sm border border-brand-grey-200/50 flex-shrink-0"
          shimmer={false}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Share2 className="w-4 h-4 text-navy-600" />
          </motion.div>
        </ActionButton>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="p-4 space-y-3 pb-4"
      >
        {/* Multi-Store Timeline with animated gradient connecting line */}
        {order.stores.map(store => {
          const storeCompleted = allSteps.filter(s => getStepStatus(store, s) === 'completed').length
          return (
            <motion.div
              key={store}
              variants={staggerItem}
              className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.span
                  className="text-lg"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                >
                  {store === 'هارفرد' ? '📚' : '📖'}
                </motion.span>
                <h3 className="text-[13px] font-bold text-navy-800">مكتبة {store}</h3>
                <span className="mr-auto text-[12px] text-brand-grey-400 bg-brand-grey-100 px-2 py-0.5 rounded-full">
                  {store === 'هارفرد' ? '2 مذكرات' : '1 مذكرة'}
                </span>
              </div>

              <div className="relative pr-6">
                {/* Animated gradient connecting line */}
                <GradientTimelineLine
                  completedCount={storeCompleted}
                  totalSteps={allSteps.length}
                />

                {allSteps.map((stepLabel, stepIdx) => {
                  const status = getStepStatus(store, stepLabel)
                  const stepData = getStoreSteps(store).find(s => s.label === stepLabel)

                  return (
                    <div key={stepLabel} className="relative flex items-start gap-3 mb-4 last:mb-0">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: status === 'completed' ? 'spring' : 'tween',
                          stiffness: 500,
                          damping: 15,
                          delay: 0.2 + stepIdx * 0.08,
                        }}
                        className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          status === 'completed' ? 'bg-success' :
                          status === 'current' ? 'bg-sky-500' :
                          'bg-brand-grey-200'
                        }`}>
                        {/* Completed: spring checkmark */}
                        {status === 'completed' && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 600, damping: 15, delay: 0.3 + stepIdx * 0.08 }}
                          >
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </motion.div>
                        )}

                        {/* Current: pulsing dot + glow */}
                        {status === 'current' && (
                          <>
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-white"
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                            {/* Pulsing ring/glow */}
                            <motion.div
                              className="absolute inset-[-5px] rounded-full border-2 border-sky-400/60"
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                            />
                          </>
                        )}
                      </motion.div>

                      <div className="flex-1 -mt-0.5">
                        <motion.p
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + stepIdx * 0.08, duration: 0.3 }}
                          className={`text-[13px] font-medium ${
                            status === 'pending' ? 'text-brand-grey-400' : 'text-brand-grey-900'
                          }`}
                        >
                          {stepLabel}
                        </motion.p>
                        {stepData?.time && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + stepIdx * 0.08 }}
                            className="text-[12px] text-brand-grey-500 mt-0.5 flex items-center gap-1"
                          >
                            <Clock className="w-2.5 h-2.5" />
                            {stepData.time}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}

        {/* Global Steps */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
        >
          <h3 className="text-[13px] font-bold text-navy-800 mb-3">حالة التوصيل</h3>
          <div className="relative pr-6">
            <div className="absolute right-[9px] top-1 bottom-1 w-0">
              <div className="w-full h-full border-r-[2px] border-dashed border-brand-grey-200" />
            </div>
            {getGlobalSteps().map((step, idx) => {
              const isCompleted = step.completed
              return (
                <div key={step.label} className="relative flex items-start gap-3 mb-4 last:mb-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, delay: 0.4 + idx * 0.1 }}
                    className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-success' : 'bg-brand-grey-200'
                    }`}>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.5 + idx * 0.1 }}
                      >
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.div>
                  <motion.div
                    className="flex-1 -mt-0.5"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <p className={`text-[13px] font-medium ${
                      !isCompleted ? 'text-brand-grey-400' : 'text-brand-grey-900'
                    }`}>
                      {step.label}
                    </p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Delivery Fee Info */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
        >
          <div className="space-y-3">
            <motion.div
              className="flex items-center justify-between"
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-grey-500" />
                <span className="text-[13px] text-brand-grey-900">تكلفة التوصيل</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-brand-grey-900 sl-num">25 ج.م</span>
                <motion.span
                  className="text-[12px] bg-success-bg text-success px-2 py-0.5 rounded-full font-semibold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  وفرت 5 ج.م
                </motion.span>
              </div>
            </motion.div>
            <div className="border-t border-brand-grey-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-brand-grey-400" />
                  <span className="text-[13px] text-brand-grey-500">رسوم تشغيل المنصة</span>
                </div>
                <span className="text-[13px] font-semibold text-brand-grey-900 sl-num">5 ج.م</span>
              </div>
            </div>
            <div className="border-t border-brand-grey-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-brand-grey-600">الشراء من {order.stores.length} مكتبات</span>
                  <Info className="w-3 h-3 text-brand-grey-400" />
                </div>
                <span className="text-[13px] font-semibold text-brand-grey-900 sl-num">+5 ج.م</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ETA Card with flip/count animation and wave avatar */}
        <motion.div
          variants={staggerItem}
          className="relative overflow-hidden"
        >
          {/* Pulse glow background */}
          <motion.div
            className="absolute inset-0 bg-sky-50 rounded-2xl"
            animate={{
              boxShadow: ['0 0 0 0px rgba(37,148,210,0.15)', '0 0 0 6px rgba(37,148,210,0.05)', '0 0 0 0px rgba(37,148,210,0.15)'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative z-10 bg-sky-50 rounded-2xl p-4 flex items-center gap-3">
            {/* Delivery person avatar with wave animation */}
            <div className="relative flex-shrink-0">
              <motion.div
                className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Clock className="w-5 h-5 text-white" />
              </motion.div>
              {/* Wave ring */}
              <motion.div
                className="absolute -inset-1 rounded-full border-2 border-sky-300/40"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-navy-800">الوصول المتوقع</p>
              <p className="text-[13px] text-sky-600 font-medium">{order.eta || 'الوقت المتوقع بيتحدّث مع حالة الطلب'}</p>
            </div>
            {/* Flip digit for minutes */}
            <div className="flex items-center gap-1">
              <FlipDigit value={etaParts[0] || '30'} label="دقيقة" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}