'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronDown, Search, X, MessageCircle, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

interface FAQScreenProps {
  onNavigate: (screen: string) => void
}

type Category = 'all' | 'orders' | 'payment' | 'delivery' | 'account'

interface FAQItem {
  id: number
  question: string
  answer: string
  bullets: string[]
  category: Category
}

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'orders', label: 'الطلبات' },
  { id: 'payment', label: 'الدفع' },
  { id: 'delivery', label: 'التوصيل' },
  { id: 'account', label: 'الحساب' },
]

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'كيف أطلب محاضرة؟',
    answer: 'طلب محاضرة من StudyLink سهل جداً وبياخد ثواني:',
    bullets: [
      'اختار الفرقة والمادة من القائمة',
      'اختار المحاضرة المناسبة واضغط "أضف للسلة"',
      'ادخل على السلة واتمم عملية الدفع',
      'هيوصلك المندوب في أسرع وقت',
    ],
    category: 'orders',
  },
  {
    id: 2,
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'ندعم أكتر من طريقة دفع عشان نسهل عليك:',
    bullets: [
      'فودافون كاش',
      'إنستاباي — سريع وآمن',
      'محفظة StudyLink — استخدم رصيدك',
      'كاش عند الاستلام — من المندوب مباشرة',
    ],
    category: 'payment',
  },
  {
    id: 3,
    question: 'كم مدة التوصيل؟',
    answer: 'مدة التوصيل بتختلف حسب نوع الطلب:',
    bullets: [
      'المحاضرات الرقمية: فوري بعد الدفع',
      'المذكرات المطبوعة: الوقت المتوقع بيظهر مع الطلب وبيتحدّث مع حالته',
      'الأدوات الطبية: 1-2 يوم عمل',
      'الشحن للمدن التانية: 2-4 أيام عمل',
    ],
    category: 'delivery',
  },
  {
    id: 4,
    question: 'هل يمكنني استرجاع المبلغ؟',
    answer: 'بالتأكيد! عندنا سياسة استرجاع مرنة:',
    bullets: [
      'استرجاع كامل خلال 24 ساعة من الطلب',
      'المحاضرات الرقمية: لا يمكن استرجاعها بعد التحميل',
      'المذكرات المطبوعة: استرجاع إذا ما تم استخدامها',
      'المبلغ يرجع لنفس طريقة الدفع أو محفظتك',
    ],
    category: 'payment',
  },
  {
    id: 5,
    question: 'كيف أتابع طلبي؟',
    answer: 'تقدر تتابع طلبك بسهولة من التطبيق:',
    bullets: [
      'ادخل على "طلباتي" من الملف الشخصي',
      'اختار الطلب اللي عايز تتابعه',
      'هتلاقي خط زمني مفصل بكل المراحل',
      'تقدر تتواصل مع المندوب مباشرة',
    ],
    category: 'orders',
  },
  {
    id: 6,
    question: 'ما هي باقة الأسبوع؟',
    answer: 'باقة الأسبوع عرض مميز من StudyLink:',
    bullets: [
      '5 مذكرات بـ 85 جنيه بس (بدل 175 جنيه)',
      'وفر 51% من سعر الشراء العادي',
      'الباقة بتتغير كل أسبوع بمواد جديدة',
      'متاحة لفرق ومواد محددة — لسه تعرفهم',
    ],
    category: 'orders',
  },
  {
    id: 7,
    question: 'كيف أصبح سفيراً؟',
    answer: 'برنامج سفراء StudyLink فرصة رائعة:',
    bullets: [
      'قدم طلب الانضمام من صفحة السفراء',
      'اربح عمولة من كل طلب عن طريق رابطك',
      'وصول مبكر للعروض والمحتوى الجديد',
      'نقاط إضافية ومكافآت شهرية',
    ],
    category: 'account',
  },
  {
    id: 8,
    question: 'كيف أستخدم المحفظة؟',
    answer: 'محفظة StudyLink بطريقة سهلة وآمنة:',
    bullets: [
      'شحن المحفظة عبر فودافون كاش أو إنستاباي',
      'استخدم رصيدك في أي طلب على التطبيق',
      'ارجع المبالغ المسترجعة للمحفظة',
      'تابع رصيدك وكافة العمليات في أي وقت',
    ],
    category: 'account',
  },
  {
    id: 9,
    question: 'هل يمكنني تغيير الفرقة؟',
    answer: 'طبعاً! تقدر تغير الفرقة في أي وقت:',
    bullets: [
      'ادخل على صفحة "حسابي"',
      'اضغط على اسم الفرقة الحالية',
      'اختار الفرقة الجديدة من القائمة',
      'المحتوى هيعدل تلقائياً حسب فرقتك',
    ],
    category: 'account',
  },
  {
    id: 10,
    question: 'كيف أتواصل مع الدعم؟',
    answer: 'فريق الدعم متاح ليك 24/7 عشان نساعدك:',
    bullets: [
      'دردشة مباشرة من داخل التطبيق',
      'واتساب: متاح على مدار الساعة',
      'إيميل: support@studylink.com',
      'الرد بيكون خلال دقائق معدودة',
    ],
    category: 'delivery',
  },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

export default function FAQScreen({ onNavigate }: FAQScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [openId, setOpenId] = useState<number | null>(null)
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<number, 'up' | 'down' | null>>({})

  const filteredFAQs = useMemo(() => {
    return faqData.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesSearch = searchQuery === '' ||
        item.question.includes(searchQuery) ||
        item.answer.includes(searchQuery) ||
        item.bullets.some(b => b.includes(searchQuery))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const handleHelpful = (id: number, type: 'up' | 'down') => {
    setHelpfulFeedback(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }))
  }

  return (
    <div className="screen-enter min-h-full bg-brand-grey-100 relative overflow-hidden">
      {/* Gradient Header */}
      <div className="sticky top-0 z-30 bg-navy-800 px-4 pt-3 pb-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-800/95 to-sky-900/40 pointer-events-none" />
        {/* Decorative blur circles */}
        <div className="absolute -top-20 -start-20 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -end-16 w-40 h-40 rounded-full bg-sky-400/8 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <div className="w-8" />
            <h1 className="text-[15px] font-bold text-white">الأسئلة الشائعة</h1>
            <button data-tap="44" aria-label="رجوع"
              onClick={() => onNavigate('profile')}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors tap-44"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto phone-scroll pb-24 relative">
        {/* Search FAQ Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="px-4 mt-4"
        >
          <div
            className={`relative flex items-center bg-white rounded-xl border-2 transition-all duration-300 ${
              searchFocused ? 'border-sky-500 shadow-md shadow-sky-500/10' : 'border-brand-grey-200/60'
            }`}
          >
            {/* Shimmer border effect on focus */}
            {searchFocused && (
              <motion.div
                layoutId="search-shimmer"
                className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
              >
                <motion.div
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-sky-400/20 to-transparent skew-x-[-12deg]"
                />
              </motion.div>
            )}
            <Search className="w-4 h-4 text-brand-grey-400 ms-3 me-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="ابحث في الأسئلة..."
              aria-label="ابحث في الأسئلة الشائعة" className="flex-1 min-h-11 py-2.5 text-[13px] text-navy-800 placeholder:text-brand-grey-400 bg-transparent outline-none text-start"
              dir="rtl"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button data-tap="44" aria-label="إغلاق"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-grey-200/60 me-2 ms-2 flex-shrink-0 tap-44"
                >
                  <X className="w-3 h-3 text-brand-grey-500" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mt-4 px-4"
        >
          <div className="relative flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button data-tap="44"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="relative flex-shrink-0 py-1.5 px-4 rounded-full text-[13px] font-semibold transition-colors duration-200"
              >
                <motion.span
                  animate={{
                    backgroundColor: activeCategory === cat.id ? '#1A70B0' : '#ffffff',
                    color: activeCategory === cat.id ? '#ffffff' : '#5A5852',
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 px-2 py-1 rounded-full"
                >
                  {cat.label}
                </motion.span>
                {/* Animated underline for active chip */}
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute bottom-0 end-2 start-2 h-[3px] rounded-full bg-sky-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Count */}
        <div className="px-4 mt-3 mb-2">
          <span className="text-[12px] text-brand-grey-500">
            <span className="sl-num font-bold text-navy-800">{filteredFAQs.length}</span> سؤال
          </span>
        </div>

        {/* FAQ Accordion List */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="px-4 space-y-2.5"
        >
          {filteredFAQs.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              className="bg-white rounded-2xl shadow-sm border border-brand-grey-200/50 overflow-hidden"
              whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
            >
              {/* Question Row */}
              <button data-tap="44" aria-label="توسيع"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-start"
              >
                <div className="flex-1">
                  <span className="text-[13px] font-semibold text-navy-800 leading-relaxed">
                    {item.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-grey-100 flex items-center justify-center"
                >
                  <ChevronDown className="w-4 h-4 text-brand-grey-500" />
                </motion.div>
              </button>

              {/* Answer Section - AnimatePresence for smooth expand/collapse */}
              <AnimatePresence initial={false}>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3">
                      {/* Divider */}
                      <div className="h-px bg-brand-grey-200/60 mb-3" />

                      {/* Answer text */}
                      <p className="text-[13px] text-brand-grey-600 leading-relaxed mb-2.5">
                        {item.answer}
                      </p>

                      {/* Bullet points */}
                      <ul className="space-y-1.5 mb-4">
                        {item.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: bIdx * 0.05, type: 'spring', stiffness: 400, damping: 15 }}
                              className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sky-500 mt-[7px]"
                            />
                            <span className="text-[12px] text-brand-grey-600 leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Helpful Rating */}
                      <div className="flex items-center justify-between bg-brand-grey-100/60 rounded-xl px-3 py-2.5">
                        <span className="text-[12px] text-brand-grey-500">هل كان هذا مفيداً؟</span>
                        <div className="flex items-center gap-2">
                          <motion.button data-tap="44"
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleHelpful(item.id, 'up')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                              helpfulFeedback[item.id] === 'up'
                                ? 'bg-success/15 text-success'
                                : 'bg-white text-brand-grey-400 border border-brand-grey-200/60'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="sl-num">{helpfulFeedback[item.id] === 'up' ? '1' : ''}</span>
                          </motion.button>
                          <motion.button data-tap="44"
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleHelpful(item.id, 'down')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                              helpfulFeedback[item.id] === 'down'
                                ? 'bg-error/15 text-error'
                                : 'bg-white text-brand-grey-400 border border-brand-grey-200/60'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="sl-num">{helpfulFeedback[item.id] === 'down' ? '1' : ''}</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        <AnimatePresence>
          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-16 px-4 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-brand-grey-200/50 flex items-center justify-center mx-auto mb-3"
              >
                <HelpCircle className="w-8 h-8 text-brand-grey-400" />
              </motion.div>
              <p className="text-[14px] font-semibold text-brand-grey-600 mb-1">مفيش نتائج</p>
              <p className="text-[13px] text-brand-grey-400">جرب تغير كلمة البحث أو اختار قسم تاني</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Still Need Help Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mx-4 mt-6"
        >
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-l from-sky-500 to-sky-600 shadow-lg shadow-sky-500/20">
            {/* Shimmer sweep effect */}
            <motion.div
              animate={{ x: ['100%', '-200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] pointer-events-none"
            />
            {/* Decorative circle */}
            <div className="absolute -top-8 -end-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-6 -start-6 w-20 h-20 rounded-full bg-white/8 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-1">محتاج مساعدة إضافية؟</h3>
                <p className="text-[13px] text-white/80">فريق الدعم جاهز يساعدك في أي وقت</p>
              </div>
              <motion.button data-tap="44"
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('chat')}
                className="bg-white text-sky-600 text-[13px] font-bold px-6 py-2.5 rounded-xl shadow-md active:scale-95 transition-transform"
              >
                تواصل معنا عبر الدردشة
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom safe area spacer */}
        <div className="h-20" />
      </div>

      {/* Floating question mark decoration */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-28 end-2 opacity-[0.07] pointer-events-none select-none z-0"
        style={{ position: 'absolute' }}
      >
        <HelpCircle className="w-8 h-8 text-navy-800" aria-hidden="true" />
      </motion.div>
    </div>
  )
}