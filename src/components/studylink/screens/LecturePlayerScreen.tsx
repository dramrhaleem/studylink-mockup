'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  ArrowRight,
  Bookmark,
  Subtitles,
  Check,
  Eye,
  FileText,
  Star,
  Download,
  Heart,
  Clock,
} from 'lucide-react'

interface LecturePlayerScreenProps {
  onNavigate: (screen: string) => void
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

const chapters = [
  { id: 1, title: 'مقدمة في التشريح', duration: '5:30', status: 'completed' as const },
  { id: 2, title: 'الجهاز الهيكلي', duration: '8:15', status: 'completed' as const },
  { id: 3, title: 'الجهاز العضلي', duration: '7:45', status: 'completed' as const },
  { id: 4, title: 'الجهاز الدوري', duration: '6:20', status: 'current' as const },
  { id: 5, title: 'الجهاز التنفسي', duration: '9:10', status: 'upcoming' as const },
  { id: 6, title: 'الجهاز العصبي', duration: '8:00', status: 'upcoming' as const },
]

const speeds = ['1x', '1.5x', '2x']

export default function LecturePlayerScreen({ onNavigate }: LecturePlayerScreenProps) {
  const [activeSpeed, setActiveSpeed] = useState('1x')
  const [subtitlesOn, setSubtitlesOn] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div className="screen-enter flex flex-col min-h-full bg-brand-grey-100">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto phone-scroll pb-2">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* ========== 1. VIDEO PLAYER AREA ========== */}
          <motion.div variants={staggerItem} className="relative w-full h-[240px] bg-navy-800 overflow-hidden">
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)',
                backgroundSize: '18px 18px',
              }}
            />

            {/* Decorative subtle shapes */}
            <div className="absolute top-8 left-1/4 w-32 h-32 rounded-full bg-sky-500/5" />
            <div className="absolute bottom-4 right-1/3 w-20 h-20 rounded-full bg-sky-400/5" />

            {/* Top gradient overlay with controls */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent z-10 px-3 pt-3 pb-6 flex items-center justify-between">
              <motion.button data-tap="44" aria-label="رجوع"
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate('lectures')}
                className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center tap-44"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.button>
              <p className="text-[13px] font-semibold text-white truncate mx-3 max-w-[180px]">
                تشريح الإنسان - المحاضرة الرابعة
              </p>
              <motion.button data-tap="44" aria-label="حفظ"
                whileTap={{ scale: 0.9 }}
                onClick={() => setBookmarked(b => !b)}
                className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center tap-44"
              >
                <Bookmark
                  className={`w-4 h-4 transition-colors ${bookmarked ? 'text-amber-400 fill-amber-400' : 'text-white'}`}
                />
              </motion.button>
            </div>

            {/* Center Play Button with Pulse Glow */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(37, 148, 210, 0.5)',
                    '0 0 0 18px rgba(37, 148, 210, 0)',
                    '0 0 0 0 rgba(37, 148, 210, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center cursor-pointer"
              >
                <Play className="w-7 h-7 text-white fill-white mr-[-2px]" />
              </motion.div>
            </div>

            {/* Bottom gradient overlay with progress */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent z-10 px-3 pb-3 pt-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] text-white/80 sl-num tabular-nums">12:35</span>
                <div className="flex-1 h-[5px] rounded-full bg-white/20 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' as const }}
                    className="h-full rounded-full relative"
                  >
                    {/* Animated gradient on progress bar */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-l from-sky-300 via-sky-400 to-sky-500" />
                    <motion.div
                      animate={{ x: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-l from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                  {/* Scrubber dot */}
                  <motion.div
                    initial={{ left: 0 }}
                    animate={{ left: '65%' }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' as const }}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md border-2 border-sky-400"
                    style={{ marginLeft: '-6px' }}
                  />
                </div>
                <span className="text-[12px] text-white/80 sl-num tabular-nums">45:00</span>
              </div>
            </div>

            {/* Speed Controls + Subtitle Toggle Row */}
            <div className="absolute -bottom-7 left-0 right-0 z-20 flex items-center justify-center gap-2 px-4">
              {speeds.map(speed => (
                <motion.button data-tap="44"
                  key={speed}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveSpeed(speed)}
                  className={`px-2.5 py-1 rounded-full text-[12px] font-semibold sl-num transition-all shadow-sm ${
                    activeSpeed === speed
                      ? 'bg-sky-500 text-white shadow-sky-500/30'
                      : 'bg-white text-brand-grey-600 border border-brand-grey-200/60'
                  }`}
                >
                  {speed}
                </motion.button>
              ))}
              <motion.button data-tap="44"
                whileTap={{ scale: 0.9 }}
                onClick={() => setSubtitlesOn(s => !s)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium transition-all shadow-sm ${
                  subtitlesOn
                    ? 'bg-sky-500 text-white shadow-sky-500/30'
                    : 'bg-white text-brand-grey-600 border border-brand-grey-200/60'
                }`}
              >
                <Subtitles className="w-3 h-3" />
                <span>ترجمة</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Space below speed controls */}
          <div className="h-6" />

          {/* ========== 2. LECTURE INFO SECTION ========== */}
          <motion.div variants={staggerItem} className="px-4 mt-4">
            {/* Doctor info row */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-800 to-navy-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-[14px] font-bold">د.أ</span>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-navy-800">د. أحمد محمود</p>
                <span className="inline-block text-[12px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 mt-0.5">
                  تشريح الإنسان
                </span>
              </div>
            </div>

            {/* Lecture title */}
            <h1 className="text-[16px] font-bold text-navy-800 leading-relaxed mb-2.5">
              المحاضرة الرابعة: الجهاز الدوري والقلب
            </h1>

            {/* Stats row */}
            <div className="flex items-center gap-1.5 flex-wrap text-[12px] text-brand-grey-500">
              <div className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                <span className="sl-num">1.2K</span>
                <span className="mr-0.5">مشاهدة</span>
              </div>
              <span className="text-brand-grey-400">·</span>
              <div className="flex items-center gap-0.5">
                <FileText className="w-3 h-3" />
                <span className="sl-num">48</span>
                <span className="mr-0.5">صفحة</span>
              </div>
              <span className="text-brand-grey-400">·</span>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="sl-num">4.8</span>
              </div>
            </div>
          </motion.div>

          {/* ========== 3. CHAPTER / TIMELINE LIST ========== */}
          <motion.div variants={staggerItem} className="mt-5 px-4">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1 h-4 rounded-full bg-sky-500" />
              <h3 className="text-[14px] font-bold text-navy-800">محتويات المحاضرة</h3>
            </div>

            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  variants={slideFromRight}
                  custom={index}
                  className={`relative flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    chapter.status === 'current'
                      ? 'bg-sky-50 border-r-[3px] border-r-sky-500'
                      : chapter.status === 'completed'
                        ? 'bg-white/60'
                        : 'bg-white/40'
                  }`}
                >
                  {/* Active chapter shimmer */}
                  {chapter.status === 'current' && (
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-l from-sky-100/40 via-transparent to-transparent pointer-events-none"
                    />
                  )}

                  {/* Chapter number circle */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      chapter.status === 'completed'
                        ? 'bg-success text-white'
                        : chapter.status === 'current'
                          ? 'bg-sky-500 text-white'
                          : 'bg-brand-grey-200 text-brand-grey-400'
                    }`}
                  >
                    {chapter.status === 'completed' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-[12px] font-bold sl-num">{chapter.id}</span>
                    )}

                    {/* Pulsing ring for current chapter */}
                    {chapter.status === 'current' && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full border-2 border-sky-400"
                      />
                    )}
                  </div>

                  {/* Chapter info */}
                  <div className="flex-1 relative z-10">
                    <p
                      className={`text-[13px] font-semibold leading-relaxed ${
                        chapter.status === 'current'
                          ? 'text-navy-800'
                          : chapter.status === 'completed'
                            ? 'text-brand-grey-700'
                            : 'text-brand-grey-400'
                      }`}
                    >
                      {chapter.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-brand-grey-400" />
                      <span className="text-[12px] text-brand-grey-400 sl-num tabular-nums">
                        {chapter.duration}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="relative z-10">
                    {chapter.status === 'completed' ? (
                      <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                        مكتمل
                      </span>
                    ) : chapter.status === 'current' ? (
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600"
                      >
                        الآن
                      </motion.div>
                    ) : (
                      <span className="text-[12px] font-medium px-2 py-0.5 rounded-full bg-brand-grey-200/60 text-brand-grey-400">
                        قادم
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom spacer for safe area + sticky actions */}
          <div className="h-24" />
        </motion.div>
      </div>

      {/* ========== 4. STICKY BOTTOM ACTIONS BAR ========== */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-brand-grey-200/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <motion.button data-tap="44"
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-sky-500 text-white py-2.5 rounded-xl shadow-md shadow-sky-500/20"
          >
            <Download className="w-4 h-4" />
            <span className="text-[13px] font-semibold">تحميل المذكرة</span>
          </motion.button>
          <motion.button data-tap="44" aria-label="المفضلة"
            whileTap={{ scale: 0.95 }}
            onClick={() => setSaved(s => !s)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-colors ${
              saved
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-brand-grey-200/60 text-navy-800'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-all ${saved ? 'fill-red-500 text-red-500' : ''}`}
            />
            <span className="text-[13px] font-semibold">
              {saved ? 'محفوظ' : 'حفظ في المفضلة'}
            </span>
          </motion.button>
        </div>
        {/* h-20 bottom spacer for safe area */}
        <div className="h-20" />
      </div>
    </div>
  )
}