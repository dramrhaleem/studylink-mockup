'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Send, Gift, Clock, Star, TrendingUp, Tag, X, CreditCard, History, ArrowLeftRight } from 'lucide-react'
import BottomNavBar from '../BottomNavBar'

interface WalletScreenProps {
  onNavigate?: (screen: string) => void
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

const weeklySpending = [
  { day: 'السبت', amount: 65 },
  { day: 'الأحد', amount: 0 },
  { day: 'الاثنين', amount: 120 },
  { day: 'الثلاثاء', amount: 45 },
  { day: 'الأربعاء', amount: 0 },
  { day: 'الخميس', amount: 90 },
  { day: 'الجمعة', amount: 35 },
]

const transactions = [
  {
    id: 't1',
    description: 'إحالة - محمد علي',
    date: 'اليوم 3:45 م',
    dateGroup: 'اليوم' as const,
    amount: '+20.00',
    rawAmount: 20,
    type: 'credit' as const,
    icon: '🎁',
    iconBg: 'bg-success/10',
  },
  {
    id: 't2',
    description: 'طلب #1024',
    date: 'اليوم 1:20 م',
    dateGroup: 'اليوم' as const,
    amount: '-45.00',
    rawAmount: -45,
    type: 'debit' as const,
    icon: '📦',
    iconBg: 'bg-error/10',
  },
  {
    id: 't3',
    description: 'استبدال نقاط',
    date: 'أمس 6:00 م',
    dateGroup: 'أمس' as const,
    amount: '+10.00',
    rawAmount: 10,
    type: 'credit' as const,
    icon: '⭐',
    iconBg: 'bg-amber-50',
  },
  {
    id: 't4',
    description: 'إحالة - سارة أحمد',
    date: 'أمس 10:15 ص',
    dateGroup: 'أمس' as const,
    amount: '+20.00',
    rawAmount: 20,
    type: 'credit' as const,
    icon: '🎁',
    iconBg: 'bg-success/10',
  },
  {
    id: 't5',
    description: 'طلب #1018',
    date: '14 يناير',
    dateGroup: 'سابقاً' as const,
    amount: '-65.00',
    rawAmount: -65,
    type: 'debit' as const,
    icon: '📦',
    iconBg: 'bg-error/10',
  },
  {
    id: 't6',
    description: 'شحن الرصيد',
    date: '12 يناير',
    dateGroup: 'سابقاً' as const,
    amount: '+200.00',
    rawAmount: 200,
    type: 'credit' as const,
    icon: '💳',
    iconBg: 'bg-sky-50',
  },
]

const quickActions = [
  {
    id: 'topup',
    label: 'شحن الرصيد',
    icon: CreditCard,
    gradient: 'from-sky-500 to-sky-600',
    shadowColor: 'shadow-sky-500/20',
  },
  {
    id: 'history',
    label: 'سجل العمليات',
    icon: History,
    gradient: 'from-navy-800 to-navy-700',
    shadowColor: 'shadow-navy-800/20',
  },
  {
    id: 'transfer',
    label: 'تحويل',
    icon: ArrowLeftRight,
    gradient: 'from-success to-emerald-600',
    shadowColor: 'shadow-success/20',
  },
]

const topUpAmounts = [50, 100, 200, 500]

/** Animated progress ring for points conversion */
function ProgressRing({ progress, size = 72, strokeWidth = 6, color = '#1A70B0' }: {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        className="text-brand-grey-100"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
      />
    </svg>
  )
}

/** Generate smooth SVG path for the area chart */
function buildChartPath(data: { amount: number }[], width: number, height: number, padding: { top: number; bottom: number; left: number; right: number }) {
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxVal = Math.max(...data.map(d => d.amount), 1)
  const step = chartW / (data.length - 1)

  const points = data.map((d, i) => ({
    x: padding.left + i * step,
    y: padding.top + chartH - (d.amount / maxVal) * chartH,
  }))

  // Build smooth cubic bezier path
  let linePath = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    linePath += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`
  }

  // Area path: same line but close at bottom
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

  return { linePath, areaPath, points }
}

/** Spending Area Chart Component */
function SpendingChart() {
  const totalSpending = weeklySpending.reduce((sum, d) => sum + d.amount, 0)
  const { linePath, areaPath, points } = useMemo(
    () => buildChartPath(weeklySpending, 300, 120, { top: 10, bottom: 25, left: 10, right: 10 }),
    []
  )

  return (
    <motion.div variants={staggerItem}>
      <div className="bg-white rounded-2xl shadow-sm border border-brand-grey-200/50 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <p className="text-[12px] text-brand-grey-500">إنفاق الأسبوع</p>
              <p className="text-[16px] font-bold text-navy-800 sl-num leading-tight">
                {totalSpending} <span className="text-[12px] text-brand-grey-500 font-normal">ج.م</span>
              </p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-[12px] text-brand-grey-400">آخر 7 أيام</p>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative" dir="ltr">
          <svg viewBox="0 0 300 120" className="w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A70B0" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1A70B0" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.5, 1].map((ratio) => {
              const y = 10 + (95 - 25) * (1 - ratio)
              return (
                <line
                  key={ratio}
                  x1={10}
                  y1={y}
                  x2={290}
                  y2={y}
                  stroke="#DAD7CF"
                  strokeWidth={0.5}
                  strokeDasharray="4 3"
                />
              )
            })}

            {/* Area fill */}
            <motion.path
              d={areaPath}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* Line */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="#1A70B0"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />

            {/* Data points */}
            {points.map((pt, i) => (
              <g key={i}>
                {/* Outer glow ring */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r={6}
                  fill="#1A70B0"
                  fillOpacity={0.1}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 6, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                />
                {/* Dot */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r={3}
                  fill="#1A70B0"
                  stroke="white"
                  strokeWidth={2}
                  initial={{ r: 0 }}
                  animate={{ r: 3 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                />
              </g>
            ))}
          </svg>

          {/* Day labels */}
          <div className="flex justify-between px-0 mt-1">
            {weeklySpending.map((d, i) => (
              <span
                key={i}
                className={`text-[12px] flex-1 text-center ${d.amount > 0 ? 'text-brand-grey-600 font-semibold' : 'text-brand-grey-400'}`}
              >
                {d.day.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/** Top Up Bottom Sheet */
function TopUpSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-w-[375px] mx-auto"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-brand-grey-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="text-[16px] font-bold text-navy-800">شحن الرصيد</h3>
              <button data-tap="44" aria-label="إغلاق"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-brand-grey-100 flex items-center justify-center hover:bg-brand-grey-200 transition-colors tap-44"
                style={{ minWidth: 48, minHeight: 48 }}
              >
                <X className="w-4 h-4 text-brand-grey-600" />
              </button>
            </div>

            {/* Current balance hint */}
            <div className="px-5 pb-4">
              <p className="text-[13px] text-brand-grey-400">اختر مبلغ الشحن</p>
            </div>

            {/* Amount cards */}
            <div className="grid grid-cols-2 gap-3 px-5 pb-6">
              {topUpAmounts.map((amount, i) => (
                <motion.button data-tap="44"
                  key={amount}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative overflow-hidden rounded-2xl border-2 border-brand-grey-200/80 bg-white p-5 flex flex-col items-center gap-1.5 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 transition-all group"
                >
                  {/* Subtle gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-50/0 to-sky-50/0 group-hover:from-sky-50/60 group-hover:to-transparent transition-all duration-300" />
                  
                  <span className="text-[24px] font-bold text-navy-800 sl-num relative z-10">
                    {amount}
                  </span>
                  <span className="text-[13px] text-brand-grey-400 font-semibold relative z-10">
                    ج.م
                  </span>

                  {/* Decorative corner accent */}
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-sky-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-sky-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>

            {/* Custom amount input */}
            <div className="px-5 pb-6">
              <div className="flex items-center gap-2 bg-brand-grey-100 rounded-xl px-4 py-3 border border-brand-grey-200/50">
                <span className="text-[13px] text-brand-grey-500">مبلغ آخر:</span>
                <input
                  type="number"
                  placeholder="أدخل المبلغ"
                  dir="ltr"
                  className="flex-1 bg-transparent text-[14px] font-semibold text-navy-800 outline-none placeholder:text-brand-grey-400 sl-num"
                />
                <span className="text-[13px] text-brand-grey-500">ج.م</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function WalletScreen({ onNavigate }: WalletScreenProps) {
  const [showTopUp, setShowTopUp] = useState(false)

  // Compute running balances (transactions listed newest first)
  const transactionsWithBalance = useMemo(() => {
    const currentBalance = 160.00
    const runningBalances: number[] = []
    let bal = currentBalance
    // Go through transactions newest → oldest, compute balance BEFORE each tx
    for (const tx of transactions) {
      runningBalances.push(bal)
      // Subtract the tx effect to get the balance before this tx
      bal = bal - tx.rawAmount
    }
    return transactions.map((tx, i) => ({
      ...tx,
      balanceAfter: runningBalances[i],
    }))
  }, [])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { label: string; items: typeof transactionsWithBalance }[] = []
    let currentGroup = ''

    for (const tx of transactionsWithBalance) {
      if (tx.dateGroup !== currentGroup) {
        currentGroup = tx.dateGroup
        groups.push({ label: currentGroup, items: [] })
      }
      groups[groups.length - 1].items.push(tx)
    }

    return groups
  }, [transactionsWithBalance])

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'topup') {
      setShowTopUp(true)
    } else if (actionId === 'history') {
      onNavigate?.('wallet')
    }
  }

  return (
    <div className="screen-enter flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto phone-scroll bg-brand-grey-100 pb-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-navy-800 px-4 pt-9 pb-4">
        <div className="flex items-center justify-between">
          <div className="w-8" />
          <h1 className="text-[15px] font-bold text-white">محفظتي</h1>
          <button data-tap="44" aria-label="رجوع"
            onClick={() => onNavigate?.('profile')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors tap-44"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="px-4 space-y-4 -mt-1"
      >
        {/* ── Premium Wallet Balance Card ── */}
        <motion.div variants={staggerItem}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-navy-800 via-navy-900 to-black p-5 shadow-xl shadow-navy-900/30">
            {/* Glassmorphism inner layer */}
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-[2px]" />

            {/* Shimmer/sweep light animation */}
            <motion.div
              animate={{ x: ['-150%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none"
            />

            {/* Decorative credit-card circles */}
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/[0.04]" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/[0.03]" />
            <div className="absolute top-2 right-8 w-24 h-24 rounded-full bg-sky-400/[0.06]" />
            <div className="absolute bottom-8 left-12 w-16 h-16 rounded-full bg-sky-300/[0.04]" />
            <div className="absolute -top-4 right-1/3 w-8 h-8 rounded-full bg-white/[0.05]" />

            {/* StudyLink watermark */}
            <p className="absolute top-4 left-4 text-[13px] font-bold text-white/[0.08]" style={{ fontFamily: 'Inter, sans-serif' }}>
              StudyLink
            </p>

            {/* Animated wave pattern at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden pointer-events-none">
              <motion.svg
                viewBox="0 0 400 40"
                preserveAspectRatio="none"
                className="w-full h-full"
                animate={{ x: [0, -200] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <path
                  d="M0 20 Q50 5 100 20 T200 20 T300 20 T400 20 L400 40 L0 40 Z"
                  fill="white/[0.04]"
                />
                <path
                  d="M0 25 Q50 10 100 25 T200 25 T300 25 T400 25 L400 40 L0 40 Z"
                  fill="white/[0.03]"
                />
              </motion.svg>
            </div>

            <div className="relative z-10">
              {/* Label: رصيدك الحالي */}
              <div className="flex items-center gap-1.5 mb-2">
                <WalletIcon className="w-3.5 h-3.5 text-sky-300" />
                <p className="text-[13px] text-white/50 font-medium">رصيدك الحالي</p>
              </div>

              {/* Balance with premium typography */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
                className="text-[36px] font-extrabold text-white leading-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  160.00
                </motion.span>{' '}
                <span className="text-[15px] text-white/60 font-normal mr-0.5">ج.م</span>
              </motion.p>

              {/* Points + Referral badge */}
              <div className="flex items-center gap-3 mt-4 mb-5">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[13px] font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>340</span>
                  <span className="text-[12px] text-white/60">نقطة</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Gift className="w-3.5 h-3.5 text-green-300" />
                  <span className="text-[12px] text-white/60">أرباح الإحالة</span>
                  <TrendingUp className="w-3 h-3 text-green-300" />
                </div>
              </div>

              {/* CTA Button */}
              <button data-tap="44" className="w-full relative overflow-hidden bg-white text-navy-800 font-bold text-[13px] py-3 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-sm">
                استخدم في طلب
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Spending Chart ── */}
        <SpendingChart />

        {/* ── Promo Code Card ── */}
        <motion.div variants={staggerItem}>
          <div className="bg-gradient-to-l from-amber-50 via-white to-amber-50/30 rounded-2xl p-4 border border-amber-100/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shadow-sm">
                <Gift className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-navy-800">لديك كود خصم!</p>
                <p className="text-[12px] text-brand-grey-500 mt-0.5">أدخل كود برومو واستمتع بخصم خاص</p>
              </div>
              <Tag className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* ── Enhanced Quick Actions ── */}
        <motion.div variants={staggerItem}>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <motion.button data-tap="44"
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.08, duration: 0.3 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleQuickAction(action.id)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50 flex flex-col items-center gap-3 hover:shadow-md transition-shadow active:scale-[0.97]"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg ${action.shadowColor}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[12px] font-bold text-navy-800">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* ── Recent Transactions with grouping, colored bars, running balance ── */}
        <motion.div variants={staggerItem}>
          <div className="bg-white rounded-2xl shadow-sm border border-brand-grey-200/50 overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-500" />
                <h2 className="text-[13px] font-bold text-navy-800">آخر العمليات</h2>
              </div>
              <span className="text-[12px] text-sky-500 font-semibold">عرض الكل</span>
            </div>

            {/* Grouped Transactions */}
            <div>
              {groupedTransactions.map((group, groupIdx) => (
                <div key={group.label}>
                  {/* Date group header */}
                  <div className="px-4 pt-3 pb-1.5 bg-brand-grey-50/60">
                    <p className="text-[12px] font-bold text-brand-grey-500 uppercase">{group.label}</p>
                  </div>

                  <div className="divide-y divide-brand-grey-100">
                    {group.items.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-brand-grey-50/50 transition-colors relative"
                      >
                        {/* Colored bar on right side (RTL) */}
                        <div className={`absolute right-0 top-2 bottom-2 w-[3px] rounded-full ${
                          tx.type === 'credit' ? 'bg-success' : 'bg-error'
                        }`} />

                        {/* Icon with colored border accent */}
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-xl ${tx.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-lg">{tx.icon}</span>
                          </div>
                          {/* Colored arrow indicator */}
                          <div className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                            tx.type === 'credit' ? 'bg-success' : 'bg-error'
                          }`}>
                            {tx.type === 'credit' ? (
                              <ArrowDownLeft className="w-2.5 h-2.5 text-white" />
                            ) : (
                              <ArrowUpRight className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-navy-800 truncate">{tx.description}</p>
                          <p className="text-[12px] text-brand-grey-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{tx.date}</p>
                        </div>

                        {/* Amount + Running balance */}
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span
                            className={`text-[13px] font-bold ${
                              tx.type === 'credit' ? 'text-success' : 'text-error'
                            }`}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {tx.type === 'credit' ? '+' : ''}{tx.amount} ج.م
                          </span>
                          <span
                            className="text-[12px] text-brand-grey-400 mt-0.5"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            الرصيد: {tx.balanceAfter.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Points to Cash Card with animated progress ring ── */}
        <motion.div variants={staggerItem}>
          <div className="bg-white rounded-2xl shadow-sm border border-brand-grey-200/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-navy-800">تحويل النقاط إلى رصيد</p>
                <p className="text-[12px] text-brand-grey-400">كل 20 نقطة = 1.00 ج.م</p>
              </div>
            </div>

            <div className="flex items-center gap-5 mb-4">
              {/* Animated progress ring */}
              <div className="relative flex-shrink-0">
                <ProgressRing progress={68} size={72} strokeWidth={6} color="#1A70B0" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[16px] font-bold text-navy-800" style={{ fontFamily: 'Inter, sans-serif' }}>340</span>
                  <span className="text-[11px] text-brand-grey-500">نقطة</span>
                </div>
              </div>

              <div className="flex-1 space-y-2.5">
                <div>
                  <p className="text-[12px] text-brand-grey-500">رصيدك الحالي</p>
                  <p className="text-[20px] font-bold text-navy-800 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    340 <span className="text-[12px] text-brand-grey-500 font-normal">نقطة</span>
                  </p>
                </div>
                <div className="h-px bg-brand-grey-100" />
                <div>
                  <p className="text-[12px] text-brand-grey-500">يساوي</p>
                  <p className="text-[20px] font-bold text-success leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    17.00 <span className="text-[12px] text-brand-grey-500 font-normal">ج.م</span>
                  </p>
                </div>
              </div>
            </div>

            <button data-tap="44" className="w-full bg-navy-800 text-white font-bold text-[13px] py-3 rounded-xl hover:bg-navy-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              تحويل
            </button>
          </div>
        </motion.div>
      </motion.div>
      </div>

      {/* Top Up Bottom Sheet */}
      <TopUpSheet isOpen={showTopUp} onClose={() => setShowTopUp(false)} />

      <BottomNavBar activeTab="profile" onNavigate={onNavigate} />
    </div>
  )
}