'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  CheckCheck,
  Sparkles,
  Package,
  GraduationCap,
  Info,
  MessageSquare,
  Megaphone,
  Star,
  Clock,
  X,
} from 'lucide-react'
import BottomNavBar from '../BottomNavBar'

/* ───────────── Types ───────────── */

type MessageCategory = 'all' | 'promos' | 'orders' | 'study'

interface SLMessage {
  id: string
  category: 'promo' | 'order' | 'study' | 'system'
  title: string
  preview: string
  body: string
  time: string
  timestamp: number
  read: boolean
  iconBg: string
  iconColor: string
  Icon: typeof MessageSquare
  highlight?: string
}

/* ───────────── Data ───────────── */

const NOW = Date.now()
const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

const messagesData: SLMessage[] = [
  {
    id: 'm1',
    category: 'promo',
    title: 'عرض خاص — خصم 20% على كل المحاضرات',
    preview: 'يلا نراجع مع بعض! استخدم كود EXAM20 عند الطلب وخصّص على أي محاضرة في الموقع...',
    body: 'عرض حصري لعملاء StudyLink!\n\nخصم 20% على جميع المحاضرات المسجلة لكل الفرق.\n\nاستخدم الكود: EXAM20\n\nالعرض صالح حتى نهاية الأسبوع.\n\n• ينطبق على محاضرات هارفرد وبرلين\n• يشمل المراجعات الشاملة\n• يمكن استخدامه أكثر من مرة\n\nيلا بندأ نراجع مع بعض!',
    time: 'الآن',
    timestamp: NOW - 3 * MINUTE,
    read: false,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500',
    Icon: Megaphone,
    highlight: 'خصم 20%',
  },
  {
    id: 'm2',
    category: 'order',
    title: 'طلبك #1092 في الطريق إليك',
    preview: 'تم شحن طلبك (مذكرات التشريح + فسيولوجيا) عن طريق مندوبنا. التوصيل المتوقع خلال ساعة...',
    body: 'تحديث الشحن\n\nتم شحن طلبك بنجاح!\n\nرقم الطلب: #1092\nالمحتويات: مذكرات التشريح + فسيولوجيا\nالمندوب: محمود\n\nالوقت التقديري للوصول في صفحة التتبع\n\nيمكنك تتبع الطلب من صفحة طلباتي.',
    time: '30 دقيقة',
    timestamp: NOW - 30 * MINUTE,
    read: false,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    Icon: Package,
    highlight: 'في الطريق',
  },
  {
    id: 'm3',
    category: 'study',
    title: 'ملخص الإسعاف — نسخة محدّثة متاحة',
    preview: 'تم رفع نسخة جديدة من ملخص الإسعاف والطوارئ تشمل آخر التحديثات. حملها دلوقتي مجاناً...',
    body: 'ملخص جديد متاح!\n\nملخص الإسعاف والطوارئ — نسخة 2024 المحدّثة\n\nيشمل:\n• حالات الطوارئ الأكثر شيوعاً\n• بروتوكولات ACLS و BLS\n• أسئلة امتحانية مع الحل\n\nمتاح دلوقتي من صفحة المحاضرات.',
    time: 'ساعتين',
    timestamp: NOW - 2 * HOUR,
    read: false,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    Icon: GraduationCap,
    highlight: 'مجاناً',
  },
  {
    id: 'm4',
    category: 'promo',
    title: 'ورشة التشريح العملي — تسجيل مفتوح',
    preview: 'ورشة عملية في قاعة التشريح مع د. أحمد. أماكن محدودة — سجّل دلوقتي واحجز مكانك...',
    body: 'ورشة التشريح العملي\n\nمع د. أحمد المنصور\n\nالميعاد: السبت 3 مساءً\nالمكان: قاعة التشريح — الدور الثالث\n\nمحتوى الورشة:\n• مراجعة عملية على الأعضاء\n• توقعات أسئلة الامتحان\n• ورقة عمل مجانية\n\nالأماكن محدودة — سجّل دلوقتي!',
    time: '4 ساعات',
    timestamp: NOW - 4 * HOUR,
    read: true,
    iconBg: 'bg-brand-grey-50',
    iconColor: 'text-brand-grey-500',
    Icon: Sparkles,
    highlight: 'تسجيل مفتوح',
  },
  {
    id: 'm5',
    category: 'order',
    title: 'تم تسليم طلبك #1087 بنجاح',
    preview: 'تم تسليم طلبك (أدوات فحص طبية) بنجاح. لو في أي مشكلة، تواصل معانا...',
    body: 'تم التسليم بنجاح!\n\nطلب #1087 — أدوات فحص طبية\n\nتم التسليم في 2:30 مساءً\n\nولو في أي مشكلة، تواصل معانا على الواتساب.',
    time: 'أمس',
    timestamp: NOW - DAY - 3 * HOUR,
    read: true,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    Icon: CheckCheck,
  },
  {
    id: 'm6',
    category: 'study',
    title: 'نصائح قبل الامتحان — من د. سارة',
    preview: '5 نصائح ذهبية من د. سارة حسن عشان تذاكر بذكاء وما ترهقش نفسك قبل الامتحان...',
    body: '5 نصائح ذهبية قبل الامتحان\n\nمن د. سارة حسن\n\n1. ذاكر في بلوكات — 50 دقيقة ذاكرة، 10 دقائق راحة\n2. راجع بالأسئلة مش بالقراءة بس\n3. نم 7 ساعات على الأقل\n4. ابدأ بالمادة الأصعب وأنت نشيط\n5. اشرب مية كتير وخد وجبات خفيفة\n\nبالتوفيق لكم جميعاً!',
    time: 'أمس',
    timestamp: NOW - DAY - 8 * HOUR,
    read: true,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    Icon: Star,
  },
  {
    id: 'm7',
    category: 'system',
    title: 'مرحباً بك في StudyLink!',
    preview: 'أهلاً بيك في StudyLink — سوقك الأكاديمي الأول. هنا تلاقي كل محتاجك من مذكرات وأدوات...',
    body: 'أهلاً بيك في StudyLink!\n\nStudyLink سوق أكاديمي لطلبة جامعة المنصورة.\n\nالمميزات:\n• مذكرات وملخصات لكل الفرق\n• أدوات طبية من المكتبات الشريكة\n• توصيل لباب البيت أو استلام من المكتبة\n• محفظة ذكية للدفع والعمولة\n\nلو محتاج أي مساعدة، تواصل معانا من صفحة "تواصل مع الدعم".\n\nبالتوفيق في رحلتك الأكاديمية!',
    time: 'من أسبوع',
    timestamp: NOW - 5 * DAY,
    read: true,
    iconBg: 'bg-brand-grey-100',
    iconColor: 'text-navy-600',
    Icon: Info,
  },
]

/* ───────────── Category Tabs ───────────── */

const categoryTabs: { id: MessageCategory; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'promos', label: 'عروض' },
  { id: 'orders', label: 'طلبات' },
  { id: 'study', label: 'أكاديمي' },
]

/* ───────────── Component ───────────── */

interface GiftScreenProps {
  onNavigate?: (screen: string) => void
}

export default function GiftScreen({ onNavigate }: GiftScreenProps) {
  const [activeTab, setActiveTab] = useState<MessageCategory>('all')
  const [selectedMessage, setSelectedMessage] = useState<SLMessage | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const filteredMessages = useMemo(() => {
    let msgs = messagesData
    if (activeTab === 'promos') msgs = msgs.filter(m => m.category === 'promo')
    else if (activeTab === 'orders') msgs = msgs.filter(m => m.category === 'order')
    else if (activeTab === 'study') msgs = msgs.filter(m => m.category === 'study' || m.category === 'system')
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      msgs = msgs.filter(m => m.title.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q))
    }
    return msgs
  }, [activeTab, searchQuery])

  const unreadCount = messagesData.filter(m => !m.read).length

  const markAsRead = (msgId: string) => {
    const msg = messagesData.find(m => m.id === msgId)
    if (msg && !msg.read) {
      msg.read = true
    }
  }

  const markAllRead = () => {
    messagesData.forEach(m => { m.read = true })
  }

  /* ─── Message Detail View ─── */
  if (selectedMessage) {
    const MIcon = selectedMessage.Icon
    return (
      <div dir="rtl" className="flex flex-col h-full bg-white">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-grey-200/60 pt-9 pb-2.5 px-4">
          <div className="flex items-center gap-3">
            <button data-tap="44"
              onClick={() => { setSelectedMessage(null) }}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-95 transition-transform tap-44"
              aria-label="رجوع"
            >
              <ChevronLeft className="w-5 h-5 text-navy-800" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl ${selectedMessage.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <MIcon className={`w-4 h-4 ${selectedMessage.iconColor}`} />
                </div>
                <h1 className="text-[15px] font-bold text-navy-900 truncate">
                  رسائل SL
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Message Content */}
        <div className="flex-1 overflow-y-auto min-h-0 phone-scroll bg-brand-grey-50">
          <div className="p-4">
            {/* Message Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-brand-grey-200/50 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 pb-3 border-b border-brand-grey-100">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${selectedMessage.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <MIcon className={`w-5 h-5 ${selectedMessage.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[14px] font-bold text-navy-900 leading-snug">
                      {selectedMessage.title}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock className="w-3 h-3 text-brand-grey-400" />
                      <span className="text-[12px] text-brand-grey-400">
                        {selectedMessage.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="text-[13px] text-navy-700 leading-[1.8] whitespace-pre-line">
                  {selectedMessage.body}
                </div>
              </div>
            </motion.div>

            {/* Action area */}
            {selectedMessage.category === 'promo' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-4"
              >
                <button
                  onClick={() => {
                    onNavigate?.('home')
                  }}
                  className="w-full h-12 rounded-2xl bg-gradient-to-l from-sky-500 to-sky-600 text-white text-[14px] font-bold shadow-md shadow-sky-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                 
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تصفّح العروض</span>
                </button>
              </motion.div>
            )}

            {selectedMessage.category === 'order' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-4 flex gap-3"
              >
                <button
                  onClick={() => { onNavigate?.('my-orders') }}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-l from-sky-500 to-sky-600 text-white text-[14px] font-bold shadow-md shadow-sky-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                 
                >
                  <Package className="w-4 h-4" />
                  <span>طلباتي</span>
                </button>
                <button
                  onClick={() => { onNavigate?.('chat') }}
                  className="h-12 px-5 rounded-2xl bg-brand-grey-100 text-navy-800 text-[14px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                 
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>الدعم</span>
                </button>
              </motion.div>
            )}
          </div>
          <div className="h-4" />
        </div>

        <BottomNavBar activeTab="gifts" onNavigate={onNavigate} noSticky />
      </div>
    )
  }

  /* ─── Main Messages List ─── */
  return (
    <div dir="rtl" className="flex flex-col h-full bg-white">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-grey-200/60 pt-9 pb-0">
        <div className="px-4 pb-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20">
                <MessageSquare className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <h1 className="text-[17px] font-bold text-navy-900 leading-tight">
                  رسائل SL
                </h1>
                {unreadCount > 0 && (
                  <p className="text-[12px] text-sky-500 font-medium">
                    {unreadCount} رسائل جديدة
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button data-tap="44"
                onClick={() => { setShowSearch(!showSearch); setSearchQuery('') }}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-brand-grey-100 flex items-center justify-center active:scale-95 transition-transform tap-44"
                aria-label="بحث"
              >
                {showSearch
                  ? <X className="w-4 h-4 text-navy-700" />
                  : <svg className="w-4 h-4 text-navy-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                }
              </button>

              {/* Mark all read */}
              {unreadCount > 0 && (
                <motion.button data-tap="44"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={markAllRead}
                  className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-sky-50 flex items-center justify-center active:scale-95 transition-transform tap-44"
                  aria-label="قراءة الكل"
                >
                  <CheckCheck className="w-4 h-4 text-sky-500" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3">
                <input
                  type="text"
                  placeholder="ابحث في الرسائل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-brand-grey-200 bg-brand-grey-50 text-[13px] text-navy-900 placeholder:text-brand-grey-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all"
                 
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Tabs */}
        <div className="flex gap-2 pb-2.5 overflow-x-auto no-scrollbar rail-gutter">
          {categoryTabs.map(tab => {
            const isActive = activeTab === tab.id
            const count = tab.id === 'all'
              ? messagesData.length
              : tab.id === 'promos'
                ? messagesData.filter(m => m.category === 'promo').length
                : tab.id === 'orders'
                  ? messagesData.filter(m => m.category === 'order').length
                  : messagesData.filter(m => m.category === 'study' || m.category === 'system').length
            return (
              <button data-tap="44"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'text-white'
                    : 'text-brand-grey-500 bg-brand-grey-100 hover:bg-brand-grey-200/80'
                }`}
               
              >
                {isActive && (
                  <motion.span
                    layoutId="msg-tab-active"
                    className="absolute inset-0 bg-navy-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span className={`relative z-10 text-[12px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-white/60'
                }`}>{count}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* ─── Messages List ─── */}
      <div className="flex-1 overflow-y-auto min-h-0 phone-scroll bg-brand-grey-50">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-grey-100 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-brand-grey-400" />
            </div>
            <p className="text-[14px] font-semibold text-brand-grey-500">
              {searchQuery ? 'مفيش نتائج' : 'مفيش رسائل'}
            </p>
            <p className="text-[13px] text-brand-grey-400 mt-1 text-center">
              {searchQuery ? 'جرّب كلمة بحث تانية' : 'الرسائل الجديدة هتظهر هنا'}
            </p>
          </div>
        ) : (() => {
          const unreadMsgs = filteredMessages.filter(m => !m.read)
          const readMsgs = filteredMessages.filter(m => m.read)
          let msgIndex = 0
          return (
            <div className="p-3 space-y-2">
              {/* Unread Section */}
              {unreadMsgs.length > 0 && (
                <>
                  <div className="px-2 pt-1 pb-1">
                    <span className="text-[12px] font-bold text-brand-grey-400">
                      جديدة
                    </span>
                  </div>
                  {unreadMsgs.map(msg => {
                    const MIcon = msg.Icon
                    const idx = msgIndex++
                    return (
                      <motion.button data-tap="44"
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.04 }}
                        onClick={() => { setSelectedMessage(msg); markAsRead(msg.id) }}
                        className="w-full text-start bg-white rounded-2xl border border-sky-100 p-3.5 active:scale-[0.99] transition-all duration-150 hover:shadow-sm relative overflow-hidden"
                      >
                        <div className="absolute top-0 start-0 w-1 h-full bg-sky-500 rounded-s-full" />
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl ${msg.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <MIcon className={`w-[18px] h-[18px] ${msg.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-[13px] leading-snug line-clamp-1 text-navy-900 font-bold">
                                {msg.title}
                              </h3>
                              <span className="text-[12px] text-brand-grey-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                                {msg.time}
                              </span>
                            </div>
                            <p className="text-[13px] line-clamp-2 mt-1 leading-relaxed text-brand-grey-500">
                              {msg.preview}
                            </p>
                            {msg.highlight && (
                              <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-md bg-sky-50 text-[12px] font-bold text-sky-600">
                                {msg.highlight}
                              </span>
                            )}
                          </div>
                          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 mt-2 flex-shrink-0 ring-2 ring-sky-500/20" />
                        </div>
                      </motion.button>
                    )
                  })}
                </>
              )}

              {/* Read Section */}
              {readMsgs.length > 0 && unreadMsgs.length > 0 && (
                <div className="px-2 pt-3 pb-1">
                  <span className="text-[12px] font-bold text-brand-grey-400">
                    سابقة
                  </span>
                </div>
              )}
              {readMsgs.map(msg => {
                const MIcon = msg.Icon
                const idx = msgIndex++
                return (
                  <motion.button data-tap="44"
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    onClick={() => { setSelectedMessage(msg); markAsRead(msg.id) }}
                    className="w-full text-start bg-white rounded-2xl border border-brand-grey-200/50 p-3.5 active:scale-[0.99] transition-all duration-150 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${msg.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <MIcon className={`w-[18px] h-[18px] ${msg.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[13px] leading-snug line-clamp-1 text-brand-grey-600 font-semibold">
                            {msg.title}
                          </h3>
                          <span className="text-[12px] text-brand-grey-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-[13px] line-clamp-2 mt-1 leading-relaxed text-brand-grey-400">
                          {msg.preview}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )
        })()}

        {/* Bottom spacer for scroll clearance */}
        <div className="h-4" />
      </div>

      {/* ─── Bottom Navigation ─── */}
      <BottomNavBar activeTab="gifts" onNavigate={onNavigate} noSticky />
    </div>
  )
}