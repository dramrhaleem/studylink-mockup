'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Copy,
  Check,
  MessageCircle,
  Send,
  Wallet,
  Trophy,
  ArrowLeft,
  X,
  Lock,
  Smartphone,
  Camera,
  CheckCircle2,
  CircleCheckBig,
  Clock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Users,
  TrendingUp,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'
import BottomNavBar from '../BottomNavBar'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface AmbassadorScreenProps {
  onNavigate?: (screen: string) => void
}

/* ─── Tier Configuration ─── */
const tiers = [
  { name: 'برونزي', emoji: '🥉', earning: 15, minReferrals: 0, color: '#CD7F32', bgLight: 'bg-amber-50', borderColor: 'border-amber-300/50', textColor: 'text-amber-800', progressColor: 'bg-amber-400' },
  { name: 'فضي', emoji: '🥈', earning: 20, minReferrals: 5, color: '#A0A0B0', bgLight: 'bg-slate-50', borderColor: 'border-slate-300/50', textColor: 'text-slate-700', progressColor: 'bg-slate-400' },
  { name: 'ذهبي', emoji: '🥇', earning: 25, minReferrals: 15, color: '#FFD700', bgLight: 'bg-yellow-50', borderColor: 'border-yellow-400/50', textColor: 'text-yellow-800', progressColor: 'bg-yellow-400' },
]

/* ─── Mock Data ─── */
const MOCK_AMBASSADOR = {
  code: 'AMR2026',
  currentTier: 0 as const, // index into tiers
  successfulReferrals: 12,
  totalEarnings: 180,
  pendingReferrals: 3,
}

/* ─── Referral History ─── */
interface ReferralRecord {
  id: string
  accountName: string
  date: string
  amount: number
  status: 'مكتمل' | 'معلّق' | 'ملغي'
}

const referralRecords: ReferralRecord[] = [
  { id: 'r1', accountName: 'محمد علي', date: '15 يناير', amount: 15, status: 'مكتمل' },
  { id: 'r2', accountName: 'أحمد حسن', date: '12 يناير', amount: 15, status: 'مكتمل' },
  { id: 'r3', accountName: 'سارة أحمد', date: '8 يناير', amount: 15, status: 'مكتمل' },
  { id: 'r4', accountName: 'يوسف كمال', date: '28 ديسمبر', amount: 15, status: 'مكتمل' },
  { id: 'r5', accountName: 'فاطمة علي', date: '22 ديسمبر', amount: 15, status: 'مكتمل' },
  { id: 'r6', accountName: 'عمر محمود', date: '18 ديسمبر', amount: 15, status: 'معلّق' },
  { id: 'r7', accountName: 'نور الدين', date: '25 نوفمبر', amount: 15, status: 'مكتمل' },
  { id: 'r8', accountName: 'مريم خالد', date: '14 نوفمبر', amount: 15, status: 'ملغي' },
]

/* ─── Animation ─── */
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

/* ─── KYC States ─── */
type KycState = 'none' | 'phone_verified' | 'card_uploaded' | 'card_reviewing' | 'approved'

export default function AmbassadorScreen({ onNavigate }: AmbassadorScreenProps) {
  const user = useStudylinkStore(s => s.user)

  const [kycState, setKycState] = useState<KycState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('verified') === '1') return 'approved'
    }
    return user?.phone ? 'phone_verified' : 'none'
  })

  // 3-second auto-revert: if entered via ?verified=1, revert to phone_verified
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('verified') === '1') {
        revertTimer.current = setTimeout(() => {
          setKycState('phone_verified')
          toast.info('تم التراجع المؤقت عن حالة التفعيل', {
            style: { direction: 'rtl', fontSize: '12px' },
          })
        }, 3000)
      }
    }
    return () => {
      if (revertTimer.current) clearTimeout(revertTimer.current)
    }
  }, [])
  const [uploadingCard, setUploadingCard] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  // Auto-approve after 3 seconds from card_reviewing state
  const reviewingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (kycState === 'card_reviewing') {
      reviewingTimer.current = setTimeout(() => {
        setKycState('approved')
        toast.success('تم قبول الكارنيه بنجاح! ✓', {
          style: { direction: 'rtl', fontSize: '12px' },
        })
      }, 3000)
    }
    return () => {
      if (reviewingTimer.current) clearTimeout(reviewingTimer.current)
    }
  }, [kycState])

  const isVerified = kycState === 'approved'
  const isReviewing = kycState === 'card_reviewing'
  const isCardUploaded = kycState === 'card_uploaded' || kycState === 'card_reviewing' || kycState === 'approved'

  /* ─── Tier calculations ─── */
  const currentTier = tiers[MOCK_AMBASSADOR.currentTier]
  const nextTier = tiers[MOCK_AMBASSADOR.currentTier + 1]

  const referralsForNext = useMemo(() => {
    if (!nextTier) return 0
    return nextTier.minReferrals - MOCK_AMBASSADOR.successfulReferrals
  }, [nextTier])

  const progressPercent = useMemo(() => {
    if (!nextTier) return 100
    const currentMin = currentTier.minReferrals
    const nextMin = nextTier.minReferrals
    const progress = ((MOCK_AMBASSADOR.successfulReferrals - currentMin) / (nextMin - currentMin)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }, [nextTier, currentTier])

  /* ─── Handlers ─── */
  const handlePhoneVerify = () => {
    toast.success('تم تأكيد رقم الموبايل بنجاح ✓', {
      style: { direction: 'rtl', fontSize: '12px' },
    })
    setKycState('phone_verified')
  }

  const handleUploadCard = () => {
    setUploadingCard(true)
    setTimeout(() => {
      setUploadingCard(false)
      toast.success('تم رفع الكارنيه بنجاح ✓', {
        style: { direction: 'rtl', fontSize: '12px' },
      })
      setKycState('card_reviewing')
    }, 1500)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_AMBASSADOR.code)
      setCodeCopied(true)
      toast.success('تم نسخ الكود!', {
        style: { direction: 'rtl', fontSize: '12px' },
      })
      setTimeout(() => setCodeCopied(false), 2000)
    } catch {
      toast.error('فشل النسخ، حاول مرة أخرى', {
        style: { direction: 'rtl', fontSize: '12px' },
      })
    }
  }

  const handleShareWhatsApp = () => {
    const msg = `🚀 استخدم كود خصم ${MOCK_AMBASSADOR.code} على StudyLink واحصل على خصم حصري!`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleShareTelegram = () => {
    const msg = `🚀 استخدم كود خصم ${MOCK_AMBASSADOR.code} على StudyLink واحصل على خصم حصري!`
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://studylink.com')}&text=${encodeURIComponent(msg)}`, '_blank')
  }

  const statusColor: Record<string, string> = {
    'مكتمل': 'bg-emerald-50 text-emerald-700',
    'معلّق': 'bg-amber-50 text-amber-700',
    'ملغي': 'bg-red-50 text-red-600',
  }

  const cardBg = 'bg-white'
  const textPrimary = 'text-navy-900'
  const textSecondary = 'text-brand-grey-500'
  const headerBg = 'bg-white/95'
  const dividerColor = 'border-brand-grey-200/60'

  return (
    <div className={'h-full flex flex-col overflow-hidden ' + 'bg-brand-grey-100'} dir="rtl">
      {/* ═══════════════════════════════════════════════════════════════
          1. HEADER & TRUST BADGE — منطقة الرأس والتتويج
      ═══════════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={'flex-shrink-0 z-30 backdrop-blur-md border-b ' + headerBg + ' ' + dividerColor + ' px-4 pb-2.5 pt-9'}
      >
        <div className="flex items-center justify-center relative">
          {/* Back arrow — right side in RTL */}
          <button data-tap="44" aria-label="رجوع"
            onClick={() => onNavigate?.('home')}
            className={'absolute right-3 top-0 flex h-9 w-9 items-center justify-center rounded-full active:scale-95 transition-transform bg-brand-grey-100 text-navy-800'}
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Centered title */}
          <div className="flex flex-col items-center">
            <h1 className={'text-[15px] font-bold ' + textPrimary}>
              سفراء StudyLink
            </h1>

            {/* Trust Badge — shown after verification */}
            {isVerified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="mt-0.5 flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5"
              >
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-2 w-2 text-white" />
                </div>
                <span className="text-[12px] font-bold text-emerald-700">✔️ سفير معتمد</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto min-h-0 phone-scroll">

      {/* ═══════════════════════════════════════════════════════════════
          PRE-VERIFICATION FLOW (KYC Gatekeeper)
      ═══════════════════════════════════════════════════════════════ */}
      {!isVerified && (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 px-4 pt-4"
        >
          {/* Hook Card */}
          <motion.div variants={fadeUp}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-navy-800 via-navy-900 to-sky-900 p-4 shadow-lg">
              <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-sky-500/10" />
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-sky-400/5" />

              <h2 className="relative text-center text-[18px] font-extrabold leading-tight text-white">
                حوّل علاقاتك لفلوس{' '}
                <span className="text-sky-400">مع StudyLink!</span>
              </h2>
              <p className="relative mt-2 text-center text-[12px] leading-relaxed text-sky-200/80">
                اكسب 15 جنيه كبداية عن كل صاحب تدعيه، ووصّل أرباحك لـ 25 جنيه مع ترقية مستواك
              </p>
              <div className="relative mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-400/70" />
                <span className="text-[12px] text-sky-300/60">نظام السفراء متاح فقط للطلاب الحقيقيين</span>
              </div>
            </div>
          </motion.div>

          {/* KYC Stepper */}
          <motion.div variants={fadeUp}>
            <div className={'relative overflow-hidden rounded-2xl border border-sky-200/50 bg-gradient-to-br from-sky-50/80 via-white to-brand-grey-50/50 p-4 shadow-sm ' + cardBg}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-800">
                  <Lock className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-[13px] font-bold text-navy-900 leading-tight">
                  خطوتين بس لتفعيل كود السفير بتاعك:
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Step 1: Phone */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      kycState !== 'none' ? 'border-emerald-500 bg-emerald-500' : 'border-sky-300 bg-white'
                    }`}>
                      {kycState !== 'none' ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Smartphone className="h-4 w-4 text-sky-500" />}
                    </div>
                    <div className={`w-0.5 h-6 mt-1 rounded-full transition-colors duration-300 ${isCardUploaded ? 'bg-emerald-400' : 'bg-brand-grey-200'}`} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[13px] font-bold text-navy-900">تأكيد الموبايل (OTP)</p>
                    <p className="mt-0.5 text-[12px] text-brand-grey-500 leading-relaxed">هنرسللك كود على رقمك عشان نتأكد إنك أنت</p>
                    {kycState === 'none' ? (
                      <button data-tap="44" onClick={handlePhoneVerify} className="mt-2 flex items-center gap-1.5 rounded-lg border border-sky-300 bg-white px-3 py-2 text-[12px] font-bold text-sky-600 shadow-sm active:scale-95 transition-all">
                        <Smartphone className="h-3.5 w-3.5" />
                        تأكيد الموبايل
                      </button>
                    ) : (
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-2">
                        <CircleCheckBig className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[12px] font-bold text-emerald-700">تم التحقق ✓</span>
                        {user?.phone && <span className="text-[12px] text-emerald-600/70 mr-auto sl-num">{user.phone}</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Card Upload */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isCardUploaded ? 'border-emerald-500 bg-emerald-500' : kycState === 'phone_verified' ? 'border-sky-400 bg-sky-50' : 'border-brand-grey-200 bg-brand-grey-100'
                    }`}>
                      {isCardUploaded ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Camera className={`h-4 w-4 ${kycState === 'phone_verified' ? 'text-sky-500' : 'text-brand-grey-400'}`} />}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[13px] font-bold text-navy-900">🪪 رفع كارنيه الكلية</p>
                    <p className="mt-0.5 text-[12px] text-brand-grey-500 leading-relaxed">وثّق إنك طالب حقيقي</p>
                    {!isCardUploaded ? (
                      <button data-tap="44" onClick={kycState === 'phone_verified' ? handleUploadCard : undefined} disabled={kycState !== 'phone_verified'} className={`mt-2 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-bold shadow-sm transition-all ${kycState === 'phone_verified' ? 'border-navy-800 bg-white text-navy-800 active:scale-95' : 'border-brand-grey-200 bg-brand-grey-50 text-brand-grey-400 cursor-not-allowed'}`}>
                        <Camera className="h-3.5 w-3.5" />صوّر الكارنيه وارفع دلوقتي
                      </button>
                    ) : isReviewing ? (
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200/60 px-3 py-2">
                        <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                        <span className="text-[12px] font-bold text-amber-700">⏳ الكارنيه بيتراجع حالياً..</span>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-2">
                        <CircleCheckBig className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[12px] font-bold text-emerald-700">تم قبول الكارنيه ✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload overlay */}
              <AnimatePresence>
                {uploadingCard && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
                      <span className="text-[12px] font-bold text-navy-800">بيترفع دلوقتي...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Tiers Preview (blurred) */}
          <motion.div variants={fadeUp}>
            <div className={'rounded-2xl p-4 shadow-sm border border-brand-grey-200/50 ' + cardBg}>
              <h3 className={'text-[13px] font-bold mb-3 flex items-center gap-1.5 ' + textPrimary}>
                <span className="text-base">🏆</span>مستويات الأرباح
              </h3>
              <div className="relative grid grid-cols-3 gap-2">
                {tiers.map((tier, idx) => (
                  <div key={tier.name} className={`flex flex-col items-center gap-1.5 rounded-xl bg-gradient-to-b ${tier.bgLight} border ${tier.borderColor} p-3 text-center`}>
                    <span className="text-2xl">{tier.emoji}</span>
                    <span className={`text-[12px] font-bold ${tier.textColor}`}>{tier.name}</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[16px] font-extrabold text-navy-900 sl-num">{tier.earning}</span>
                      <span className="text-[12px] text-brand-grey-500">ج.م/إحالة</span>
                    </div>
                  </div>
                ))}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[6px]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800/90 shadow-lg">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <p className="mt-3 max-w-[180px] text-center text-[12px] font-bold text-navy-900 leading-relaxed">
                    وثق حسابك عشان تفتح المستويات دي
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info notice */}
          <motion.div variants={fadeUp}>
            <div className="flex items-start gap-2.5 rounded-xl bg-sky-50 border border-sky-200/50 p-3">
              <AlertCircle className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
              <p className="text-[12px] text-sky-800 leading-relaxed">وثّق حسابك بـ تأكيد رقمك ورفع كارنيه الكلية عشان ننشئ الكود الخاص بك</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          POST-VERIFICATION — Ambassador Dashboard (Atomic Blueprint)
      ═══════════════════════════════════════════════════════════════ */}
      {isVerified && (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 px-4 pt-4"
        >
          {/* ═══════════════════════════════════════════════════════════
              CARD 1: GAMIFICATION DASHBOARD — لوحة التلعيب والتقدم
          ═══════════════════════════════════════════════════════════ */}
          <motion.div variants={fadeUp}>
            <div className={'rounded-2xl p-4 shadow-sm border ' + cardBg + ' border-brand-grey-200/50'}>
              {/* Level indicator row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-300/50 shadow-sm">
                  <span className="text-2xl">{currentTier.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className={'text-[13px] font-bold ' + textPrimary}>أنت الآن في المستوى {currentTier.name}</p>
                  <p className={'mt-0.5 text-[12px] ' + textSecondary}>
                    {MOCK_AMBASSADOR.successfulReferrals} دعوة ناجحة حتى الآن
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={'text-[12px] font-bold ' + textPrimary}>{currentTier.emoji} {currentTier.name}</span>
                  {nextTier && (
                    <span className={'text-[12px] font-bold ' + textSecondary}>{nextTier.emoji} {nextTier.name}</span>
                  )}
                  {!nextTier && (
                    <span className="text-[12px] font-bold text-emerald-600">🏆 المستوى الأقصى</span>
                  )}
                </div>
                <div className={'h-2.5 w-full rounded-full overflow-hidden bg-brand-grey-200'}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-l from-amber-400 to-amber-500 relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer" />
                  </motion.div>
                </div>
              </div>

              {/* Nudge text */}
              {nextTier && (
                <div className={'flex items-start gap-2 rounded-xl p-3 bg-amber-50/80'}>
                  <TrendingUp className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className={'text-[12px] leading-relaxed text-amber-800'}>
                    <span className="font-bold">باقٍ لك {referralsForNext} دعوات</span> للترقية للمستوى {nextTier.name} {nextTier.emoji} وكسب{' '}
                    <span className="font-bold">{nextTier.earning} جنيهاً</span> عن كل دعوة!
                  </p>
                </div>
              )}

              {/* Max tier celebration */}
              {!nextTier && (
                <div className={'flex items-start gap-2 rounded-xl p-3 bg-emerald-50/80'}>
                  <Trophy className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className={'text-[12px] leading-relaxed text-emerald-800'}>
                    <span className="font-bold">وصلت لأعلى مستوى! 🎉</span> أنت من أفضل سفراء StudyLink. استمر في الدعوة بدون أي حد أقصى للأرباح.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════
              CARD 2: REFERRAL ENGINE — محرك الدعوات (Focal Point)
          ═══════════════════════════════════════════════════════════ */}
          <motion.div variants={fadeUp}>
            <div className={'rounded-2xl p-4 shadow-sm border ' + cardBg + ' border-brand-grey-200/50'}>
              {/* Subtitle */}
              <p className={'text-[12px] font-bold mb-3 flex items-center gap-1.5 ' + textSecondary}>
                <span className="text-sm">🏷️</span>
                كود الخصم الخاص بك
              </p>

              {/* Code field */}
              <div className={'relative flex items-center justify-between rounded-xl px-4 py-3.5 border-2 border-dashed border-sky-300/50 bg-sky-50/50'}>
                <span className="text-[20px] font-extrabold text-navy-900 sl-num select-all">
                  {MOCK_AMBASSADOR.code}
                </span>
                <button aria-label="تمت الإضافة" data-tap="44"
                  onClick={handleCopyCode}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-90 ${
                    codeCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-sky-100 text-sky-600'
                  } tap-44`}
                >
                  {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* Share buttons — Contextual Actions */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button data-tap="44"
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-3 text-[13px] font-bold text-white active:scale-[0.97] transition-transform shadow-sm"
                  style={{ minHeight: 48 }}
                >
                  <MessageCircle className="h-4 w-4" />
                  واتساب
                </button>
                <button data-tap="44"
                  onClick={handleShareTelegram}
                  className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-3 py-3 text-[13px] font-bold text-white active:scale-[0.97] transition-transform shadow-sm"
                  style={{ minHeight: 48 }}
                >
                  <Send className="h-4 w-4" />
                  تيليجرام
                </button>
              </div>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════
              CARD 3: FINANCIAL SNAPSHOT — الملخص المالي والشفافية
          ═══════════════════════════════════════════════════════════ */}
          <motion.div variants={fadeUp}>
            <div className={'rounded-2xl p-4 shadow-sm border ' + cardBg + ' border-brand-grey-200/50'}>
              {/* 2-Column Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Right: Successful Referrals */}
                <div className={'flex flex-col items-center rounded-xl p-3.5 bg-brand-grey-50'}>
                  <Users className="h-4 w-4 text-sky-500 mb-1.5" />
                  <span className="text-[26px] font-extrabold text-navy-900 sl-num leading-none">
                    {MOCK_AMBASSADOR.successfulReferrals}
                  </span>
                  <span className={'mt-1.5 text-[12px] font-bold text-center leading-relaxed ' + textSecondary}>
                    الدعوات الناجحة
                  </span>
                </div>

                {/* Left: Total Earnings */}
                <div className={'flex flex-col items-center rounded-xl p-3.5 bg-brand-grey-50'}>
                  <Wallet className="h-4 w-4 text-emerald-500 mb-1.5" />
                  <span className="text-[26px] font-extrabold text-navy-900 sl-num leading-none">
                    {MOCK_AMBASSADOR.totalEarnings}
                  </span>
                  <span className="mt-1 text-[12px] text-brand-grey-500 font-bold">ج.م</span>
                  <span className={'text-[12px] font-bold text-center leading-relaxed ' + textSecondary}>
                    الأرباح الكلية
                  </span>
                </div>
              </div>

              {/* Wallet gateway link */}
              <button data-tap="44"
                onClick={() => onNavigate?.('wallet')}
                className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl border border-sky-200/50 bg-sky-50/50 py-2.5 text-[12px] font-bold text-sky-600 active:scale-[0.98] transition-transform"
              >
                <Wallet className="h-3.5 w-3.5" />
                اذهب للمحفظة لسحب أرباحك
                <ArrowLeft className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════
              REFERRAL HISTORY TABLE
          ═══════════════════════════════════════════════════════════ */}
          <motion.div variants={fadeUp}>
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className={'text-[13px] font-bold ' + textPrimary}>سجل الدعوات</h3>
              <span className={'text-[12px] sl-num ' + textSecondary}>{referralRecords.length} إحالة</span>
            </div>
            <div className="flex flex-col gap-2">
              {referralRecords.map((record, idx) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className={'flex items-center gap-3 rounded-xl p-3 shadow-sm border ' + cardBg + ' border-brand-grey-200/50'}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-sky-200">
                    <span className="text-[13px] font-bold text-sky-700">{record.accountName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={'text-[13px] font-bold truncate ' + textPrimary}>{record.accountName}</p>
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[12px] font-bold ${statusColor[record.status]}`}>{record.status}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={'text-[12px] ' + textSecondary}>{record.date}</span>
                      <span className={`text-[13px] font-extrabold sl-num ${record.status === 'ملغي' ? 'text-brand-grey-400 line-through' : 'text-emerald-600'}`}>
                        {record.status === 'ملغي' ? '0' : `+${record.amount}`} ج.م
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="h-4" />
      </div>{/* end scrollable content */}

      {/* ═══════════════════════════════════════════════════════════════
          3. FOOTER / CTAs — منطقة التذييل والإجراءات
      ═══════════════════════════════════════════════════════════════ */}
      <div className={'flex-shrink-0 z-40 backdrop-blur-md border-t px-4 pt-2.5 ' + headerBg + ' ' + dividerColor}>
        <AnimatePresence mode="wait">
          {/* Pre-verification states */}
          {kycState === 'none' && (
            <motion.button data-tap="44" key="disabled" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} disabled className="w-full rounded-xl bg-brand-grey-200 py-3.5 text-[13px] font-bold text-brand-grey-400 cursor-not-allowed">
              ابدأ اكسب فلوس دلوقتي
            </motion.button>
          )}

          {kycState === 'phone_verified' && (
            <motion.button data-tap="44" key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} whileTap={{ scale: 0.97 }} onClick={handleUploadCard} className="w-full rounded-xl bg-sky-500 py-3.5 text-[13px] font-bold text-white shadow-sm shadow-sky-500/25 active:shadow-md transition-shadow">
              ابدأ اكسب فلوس دلوقتي
            </motion.button>
          )}

          {(kycState === 'card_uploaded' || kycState === 'card_reviewing') && (
            <motion.div key="reviewing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="w-full rounded-xl bg-amber-50 border border-amber-200/60 py-3.5 text-center">
              <p className="text-[13px] font-bold text-amber-700 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 animate-pulse" />الكارنيه بيتراجع دلوقتي..
              </p>
            </motion.div>
          )}

          {/* Post-verification: Pinned CTA */}
          {isVerified && (
            <motion.div key="verified-cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col gap-2">
              {/* Main CTA — 56dp min touch target */}
              <motion.button data-tap="44"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  handleCopyCode()
                  handleShareWhatsApp()
                }}
                className="w-full rounded-xl bg-gradient-to-l from-sky-500 to-sky-600 py-4 text-[14px] font-bold text-white shadow-md shadow-sky-500/30 active:shadow-lg transition-shadow"
                style={{ minHeight: '56px' }}
              >
                🚀 شارك كودك الآن واكسب {currentTier.earning} جنيهاً
              </motion.button>

              {/* Utility Link — How does it work? */}
              <button data-tap="44"
                onClick={() => setShowHowItWorks(true)}
                className="flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-bold text-sky-500 active:opacity-70 transition-opacity"
              >
                <Info className="h-3.5 w-3.5" />
                كيف يعمل النظام؟
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>{/* end CTA footer */}

      {/* Bottom Nav — outside scrollable area, always visible */}
      <div className="flex-shrink-0">
        <BottomNavBar onNavigate={onNavigate} activeTab="ambassador" noSticky />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM SHEET: How It Works — ورقة تشرح مستويات الأرباح
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showHowItWorks && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHowItWorks(false)}
              className="fixed inset-0 z-50 bg-black/40"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={'fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-4 pb-8 max-h-[80vh] overflow-y-auto bg-white'}
            >
              {/* Handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-brand-grey-300" />

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className={'text-[15px] font-bold ' + textPrimary}>كيف يعمل نظام السفراء؟</h3>
                <button data-tap="44" aria-label="إغلاق" onClick={() => setShowHowItWorks(false)} className={'flex h-8 w-8 items-center justify-center rounded-full bg-brand-grey-100 text-navy-800'}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tier explanations */}
              <div className="flex flex-col gap-3">
                {tiers.map((tier, idx) => {
                  const isActive = idx === MOCK_AMBASSADOR.currentTier
                  const isPast = idx < MOCK_AMBASSADOR.currentTier
                  const isLocked = idx > MOCK_AMBASSADOR.currentTier
                  return (
                    <div key={tier.name} className={`flex items-center gap-3 rounded-xl p-3.5 border ${isActive ? 'border-sky-300 bg-sky-50/80' : isPast ? 'border-emerald-200/50 bg-emerald-50/50' : isLocked ? 'border-brand-grey-200/50 bg-brand-grey-50/50' : 'border-brand-grey-200/50 bg-white'}`}>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b text-2xl" style={{ background: `${tier.color}20` }}>
                        {tier.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={'text-[13px] font-bold ' + (isActive ? 'text-sky-700' : textPrimary)}>{tier.name}</span>
                          {isActive && <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-bold text-white">مستواك الحالي</span>}
                          {isPast && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">تم تجاوزه</span>}
                          {isLocked && <Lock className="h-3 w-3 text-brand-grey-400" />}
                        </div>
                        <p className={'mt-0.5 text-[12px] leading-relaxed ' + textSecondary}>
                          {idx === 0 && `ابدأ فوراً — اكسب ${tier.earning} جنيه عن كل دعوة ناجحة`}
                          {idx === 1 && `${tier.minReferrals}+ دعوة — اكسب ${tier.earning} جنيه عن كل دعوة`}
                          {idx === 2 && `${tier.minReferrals}+ دعوة — اكسب ${tier.earning} جنيه عن كل دعوة (المستوى الأقصى!)`}
                        </p>
                      </div>
                      <span className="text-[18px] font-extrabold text-navy-900 sl-num">{tier.earning}<span className="text-[12px] font-bold text-brand-grey-500 mr-0.5">ج.م</span></span>
                    </div>
                  )
                })}
              </div>

              {/* Summary note */}
              <div className={'mt-4 flex items-start gap-2 rounded-xl p-3 bg-brand-grey-50'}>
                <Info className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                <p className={'text-[12px] leading-relaxed ' + textSecondary}>
                  كل ما ترفع مستواك، مكافأتك هتزيد <span className="font-bold text-navy-800">5 جنيه زيادة</span> على كل إحالة. بدون أي حد أقصى للأرباح!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}