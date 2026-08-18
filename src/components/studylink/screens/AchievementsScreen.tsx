'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

interface AchievementsScreenProps {
  onNavigate?: (screen: string) => void
}

/* ── Animation Variants ── */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
}

/* ── Achievement Data ── */
const achievements = [
  {
    id: 'a1',
    icon: '🎯',
    title: 'أول طلب',
    description: 'أكمل أول طلب بنجاح',
    unlocked: true,
    current: 1,
    target: 1,
  },
  {
    id: 'a2',
    icon: '📚',
    title: 'جامعي',
    description: 'اطلب 5 محاضرات مختلفة',
    unlocked: true,
    current: 5,
    target: 5,
  },
  {
    id: 'a3',
    icon: '💰',
    title: 'مُوفر',
    description: 'استخدم كود خصم لأول مرة',
    unlocked: true,
    current: 1,
    target: 1,
  },
  {
    id: 'a4',
    icon: '🤝',
    title: 'سفير',
    description: 'انضم لبرنامج السفراء',
    unlocked: true,
    current: 1,
    target: 1,
  },
  {
    id: 'a5',
    icon: '🔥',
    title: 'مُلتزم',
    description: 'اطلب 7 أيام متتالية',
    unlocked: false,
    current: 5,
    target: 7,
  },
  {
    id: 'a6',
    icon: '👑',
    title: 'VIP',
    description: 'أنفق أكثر من 500 ج.م',
    unlocked: false,
    current: 320,
    target: 500,
  },
  {
    id: 'a7',
    icon: '⭐',
    title: 'مُقيّم',
    description: 'قيم 10 منتجات',
    unlocked: false,
    current: 3,
    target: 10,
  },
  {
    id: 'a8',
    icon: '🎁',
    title: 'هدايا',
    description: 'أرسل 3 هدايا لأصدقائك',
    unlocked: false,
    current: 0,
    target: 3,
  },
]

const stats = [
  { icon: '📦', value: '12', label: 'إجمالي الطلبات', color: 'text-sky-500' },
  { icon: '⭐', value: '4.8', label: 'متوسط التقييم', color: 'text-amber-500' },
  { icon: '🏅', value: '8', label: 'إنجاز مُفتّح', color: 'text-success' },
  { icon: '🔥', value: '7 أيام', label: 'أيام متتالية', color: 'text-orange-500' },
]

const leaderboard = [
  { name: 'أحمد رضا', points: '3,450', medal: '🥇' },
  { name: 'سارة محمد', points: '2,890', medal: '🥈' },
  { name: 'محمد حسن', points: '2,340', medal: '🥉' },
]

/* ── Progress Ring Component ── */
function LevelProgressRing({ progress, size = 100, strokeWidth = 8 }: {
  progress: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Animated progress stroke */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#ringGradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
      />
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── XP Bar with shimmer ── */
function XPBar() {
  const currentXP = 1250
  const maxXP = 2000
  const percentage = (currentXP / maxXP) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] text-white/70">نقاط الخبرة</span>
        <span className="text-[12px] font-bold text-white sl-num">
          {currentXP.toLocaleString('en-US')} / {maxXP.toLocaleString('en-US')}
        </span>
      </div>
      <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden relative">
        {/* Animated fill */}
        <motion.div
          className="absolute top-0 right-0 h-full rounded-full bg-gradient-to-l from-sky-300 to-white/90"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
        />
        {/* Shimmer sweep */}
        <motion.div
          animate={{ x: ['-200%', '300%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-transparent via-white/40 to-transparent pointer-events-none"
          style={{ transformOrigin: 'right' }}
        />
      </div>
      <span className="text-[12px] text-white/50 mt-1 block">نقطة خبرة</span>
    </div>
  )
}

export default function AchievementsScreen({ onNavigate }: AchievementsScreenProps) {
  return (
    <div className="screen-enter min-h-full bg-brand-grey-100">
      {/* ── Gradient Header ── */}
      <div className="relative bg-gradient-to-l from-navy-800 via-navy-800 to-sky-900 px-4 pt-3 pb-6 overflow-hidden">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -right-6 bottom-2 h-24 w-24 rounded-full bg-sky-500/10" />

        {/* Header bar */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <div className="w-8" />
          <h1 className="text-[15px] font-bold text-white">إنجازاتي 🏆</h1>
          <button data-tap="44" aria-label="رجوع"
            onClick={() => onNavigate?.('profile')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors tap-44"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Subtitle with floating trophy */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {/* Floating trophy */}
          <motion.span
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-2xl"
          >
            🏆
          </motion.span>
          <p className="text-[13px] text-white/90 font-semibold">مستوى الطالب المتفوق</p>
        </div>
      </div>

      {/* ── Content Area ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="px-4 -mt-3 pb-6 space-y-4"
      >
        {/* ── Level Progress Card ── */}
        <motion.div variants={staggerItem}>
          <div className="bg-white rounded-2xl shadow-sm border border-brand-grey-200/50 p-5">
            <div className="flex items-center gap-5">
              {/* Circular Progress Ring */}
              <div className="relative flex-shrink-0">
                <LevelProgressRing progress={60} size={100} strokeWidth={8} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-bold text-navy-800 sl-num leading-none">3</span>
                  <span className="text-[11px] text-brand-grey-500 mt-0.5">من 5</span>
                </div>
              </div>

              {/* Level Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-bold text-navy-800">طالب متميز</span>
                    <span className="text-[12px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-semibold">المستوى 3</span>
                  </div>
                  <p className="text-[12px] text-brand-grey-500">المستوى التالي: الطالب المثالي</p>
                </div>

                {/* Next level locked badge */}
                <div className="flex items-center gap-2 bg-brand-grey-50 rounded-xl px-3 py-2">
                  <span className="text-sm grayscale opacity-50">👑</span>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-brand-grey-400">الطالب المثالي</p>
                    <p className="text-[11px] text-brand-grey-400">🔒 مقفل</p>
                  </div>
                  <span className="text-[12px] text-brand-grey-400 sl-num">Lv.4</span>
                </div>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-4">
              <XPBar />
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid (2×2) ── */}
        <motion.div variants={staggerItem}>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-brand-grey-200/50 text-center hover:shadow-md transition-shadow cursor-default"
              >
                <span className="text-xl block mb-1">{stat.icon}</span>
                <span className={`block text-[20px] font-bold sl-num leading-tight ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="block text-[12px] text-brand-grey-500 mt-0.5">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Achievements Grid ── */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-navy-800">الإنجازات</h2>
            <span className="text-[12px] text-sky-500 font-semibold bg-sky-50 px-2.5 py-0.5 rounded-full sl-num">
              4/8
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const progressPercent = achievement.target > 0
                ? (achievement.current / achievement.target) * 100
                : 0

              return (
                <motion.div
                  key={achievement.id}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className={`relative rounded-2xl p-3.5 shadow-sm border transition-shadow cursor-default overflow-hidden ${
                    achievement.unlocked
                      ? 'bg-sky-50/80 border-sky-100 hover:shadow-md'
                      : 'bg-white border-brand-grey-200/50 hover:shadow-md'
                  }`}
                >
                  {/* Checkmark badge for unlocked */}
                  {achievement.unlocked && (
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* Lock badge for locked */}
                  {!achievement.unlocked && (
                    <div className="absolute top-2 left-2 text-[12px]">
                      🔒
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`text-2xl mb-2 ${!achievement.unlocked ? 'grayscale opacity-40' : ''}`}>
                    {achievement.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-[13px] font-bold mb-0.5 ${
                    achievement.unlocked ? 'text-navy-800' : 'text-brand-grey-400'
                  }`}>
                    {achievement.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[12px] text-brand-grey-500 leading-relaxed mb-2 line-clamp-2">
                    {achievement.description}
                  </p>

                  {/* Status label */}
                  <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                    achievement.unlocked
                      ? 'bg-success/10 text-success'
                      : 'bg-brand-grey-100 text-brand-grey-400'
                  }`}>
                    {achievement.unlocked ? '✅ مُفتّح' : 'مقفل'}
                  </span>

                  {/* Progress bar for locked achievements with partial progress */}
                  {!achievement.unlocked && achievement.current > 0 && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-brand-grey-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-l from-amber-400 to-amber-300"
                          initial={{ width: '0%' }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
                        />
                      </div>
                      <p className="text-[11px] text-brand-grey-400 mt-0.5 sl-num">
                        {achievement.current}/{achievement.target}
                      </p>
                    </div>
                  )}

                  {/* Locked overlay for zero-progress items */}
                  {!achievement.unlocked && achievement.current === 0 && (
                    <div className="absolute inset-0 bg-brand-grey-100/30 pointer-events-none rounded-2xl" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ── Leaderboard Preview ── */}
        <motion.div variants={staggerItem}>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-bold text-navy-800">المتصدرون هذا الأسبوع</h2>
              <button data-tap="44" className="text-[12px] text-sky-500 font-semibold hover:text-sky-600 transition-colors">
                عرض الكل
              </button>
            </div>

            <div className="space-y-2.5">
              {leaderboard.map((entry, idx) => (
                <motion.div
                  key={entry.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.08, duration: 0.35, ease: 'easeOut' }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl ${
                    idx === 0 ? 'bg-amber-50/60' : idx === 1 ? 'bg-brand-grey-50' : 'bg-brand-grey-50/50'
                  }`}
                >
                  {/* Medal */}
                  <span className="text-[18px] flex-shrink-0">{entry.medal}</span>

                  {/* Avatar placeholder */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[14px] font-bold text-white ${
                    idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-brand-grey-400' : 'bg-amber-700'
                  }`}>
                    {entry.name.charAt(0)}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-navy-800 truncate">{entry.name}</p>
                    <p className="text-[12px] text-brand-grey-400">نقطة</p>
                  </div>

                  {/* Points */}
                  <span className="text-[13px] font-bold text-navy-800 sl-num flex-shrink-0">
                    {entry.points}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Reward Banner ── */}
        <motion.div variants={staggerItem}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sky-500 via-sky-500 to-sky-600 p-5 shadow-lg shadow-sky-500/20">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/5" />

            {/* Shimmer sweep */}
            <motion.div
              animate={{ x: ['-150%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            />

            <div className="relative z-10">
              <p className="text-[15px] font-bold text-white mb-1">
                🎁 كسبت 50 نقطة هذا الأسبوع!
              </p>
              <p className="text-[12px] text-white/80 mb-4">
                استبدلها بخصم 10 ج.م في المحفظة
              </p>
              <button data-tap="44" className="bg-white text-sky-600 font-bold text-[13px] px-6 py-2.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-sm">
                استبدال النقاط
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Safe area spacer */}
      <div className="h-20" />
    </div>
  )
}