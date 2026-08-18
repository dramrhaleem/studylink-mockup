'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  ChevronLeft,
  Bot,
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
} from 'lucide-react'

interface ChatSupportScreenProps {
  onNavigate?: (screen: string) => void
}

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  time: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
  icon: React.ReactNode
}

const quickReplies = [
  'أسعار المحاضرات',
  'مواعيد التوصيل',
  'كود خصم',
  'سياسة الاسترجاع',
  'التحدث مع موظف',
]

const botResponses: Record<string, string> = {
  'أسعار المحاضرات':
    'أسعار المحاضرات تبدأ من 45 ج.م، وفيه باقات اقتصادية وباقات شاملة. أكواد الخصم بتتحط في صفحة الدفع.',
  'مواعيد التوصيل':
    'الوقت المتوقع للتوصيل بيظهر مع طلبك وبيتحدّث مع حالته، وتقدر تتابعه من «طلباتي».',
  'كود خصم':
    'أكواد الخصم بتتحط في صفحة الدفع قبل التأكيد.\nلو معاك كود سفير هتلاقيه في صفحة السفراء جاهز للنسخ.',
  'سياسة الاسترجاع':
    'لو في مشكلة في المنتج اللي وصلك، ابعتلنا من هنا وهنرجعلك بالخطوة اللي تحل المشكلة.',
  'التحدث مع موظف':
    'تقدر تتواصل مع الفريق عبر:\n• واتساب: 9 ص — 11 م\n• إيميل: support@studylink.com',
}

const faqItems: FAQItem[] = [
  {
    id: 'faq1',
    question: 'إزاي أقدر أطلب أول مرة؟',
    answer:
      'اختار المنتج، اضغط «أضف للسلة»، وادخل بيانات الاستلام. تقدر تدفع عند الاستلام أو من المحفظة، وتتابع الطلب من «طلباتي».',
    icon: <MessageCircle size={18} className="text-sky-500" />,
  },
  {
    id: 'faq2',
    question: 'التوصيل بكام؟',
    answer:
      'التوصيل 25 ج.م لكل طلب، والاستلام من المكتبة بدون رسوم. الوقت تقديري وبيظهر في صفحة التتبع بعد التأكيد.',
    icon: <ArrowLeft size={18} className="text-sky-500" />,
  },
  {
    id: 'faq3',
    question: 'إزاي أرجع منتج؟',
    answer:
      'تقدر ترجع أي منتج خلال 24 ساعة من الاستلام لو مش مستخدم. ابعت طلب الاسترجاع من صفحة الطلب، وهنرجعلك الفلوس لمحفظتك خلال 48 ساعة.',
    icon: <ArrowLeft size={18} className="text-sky-500" />,
  },
  {
    id: 'faq4',
    question: 'ما هي طرق الدفع المتاحة؟',
    answer:
      'ندعم: الدفع عند الاستلام، المحفظة الإلكترونية، وفودافون كاش. تقدر تشحن محفظتك من أي فرع فودافون كاش أو أفرول بأقل من 5 دقائق.',
    icon: <MessageCircle size={18} className="text-sky-500" />,
  },
  {
    id: 'faq5',
    question: 'هل فيه ضمان على المنتجات؟',
    answer:
      'أيوا طبعاً! كل المنتجات عليها ضمان. لو وصلك منتج فيه أي مشكلة أو مختلف عن الوصف، هنبدله فوراً أو نرجعلك فلوسك بالكامل.',
    icon: <Mail size={18} className="text-sky-500" />,
  },
  {
    id: 'faq6',
    question: 'إزاي أشحن محفظتي؟',
    answer:
      'ادخل صفحة المحفظة واضغط "شحن الرصيد". تقدر تشحن من فودافون كاش أو أفرول. الرصيد بيضاف فوراً وتقدر تستخدمه في أي طلب.',
    icon: <Phone size={18} className="text-sky-500" />,
  },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

// Spring entrance for user messages (slide from left in RTL = from right visually)
const userMessageVariant = {
  hidden: { opacity: 0, x: -30, scale: 0.8 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { 
      type: 'spring' as const, 
      stiffness: 300, 
      damping: 22,
      mass: 0.8,
    },
  },
}

// Bot messages slide in from right in RTL
const botMessageVariant = {
  hidden: { opacity: 0, x: 30, scale: 0.8 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { 
      type: 'spring' as const, 
      stiffness: 300, 
      damping: 22,
      mass: 0.8,
    },
  },
}

// Timestamp fade-in variant
const timestampVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delay: 0.3, duration: 0.3 },
  },
}

function getTimestamp(): string {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const period = hours >= 12 ? 'م' : 'ص'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes} ${period}`
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex items-start gap-2 mb-3"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy-800 to-sky-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm shadow-navy-800/30">
        <Bot className="w-4 h-4 text-white" aria-hidden />
      </div>
      <div className="bg-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-sky-400"
              animate={{ 
                y: [0, -7, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Floating bot icon for empty state
function FloatingBotIcon() {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-navy-800 to-sky-900 flex items-center justify-center shadow-lg shadow-navy-800/30"
      >
        <Bot size={28} className="text-white" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[13px] text-brand-grey-400"
      >
        مساعدك الذكي جاهز لمساعدتك
      </motion.p>
    </div>
  )
}

export default function ChatSupportScreen({ onNavigate }: ChatSupportScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'مرحباً! أنا مساعد StudyLink. كيف أقدر أساعدك؟',
      sender: 'bot',
      time: getTimestamp(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const [quickRepliesVisible, setQuickRepliesVisible] = useState(true)
  const [inputFocused, setInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleQuickReply = (reply: string) => {
    setQuickRepliesVisible(false)

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text: reply,
      sender: 'user',
      time: getTimestamp(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponses[reply] || 'شكرًا لرسالتك — الفريق هيرد عليك في أقرب وقت.',
        sender: 'bot',
        time: getTimestamp(),
      }
      setMessages((prev) => [...prev, botMsg])
    }, 1500)
  }

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text || isTyping) return

    setInputValue('')
    setQuickRepliesVisible(false)

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      time: getTimestamp(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false)
      let response =
        'شكرًا لرسالتك. الفريق متاح يوميًا من 9 ص إلى 11 م، ولو محتاج مساعدة فورية ابعت على support@studylink.com.'

      // Smart keyword matching
      const lowerText = text
      if (lowerText.includes('سعر') || lowerText.includes('كم')) {
        response = 'أسعار المحاضرات تبدأ من 45 ج.م، وفيه باقات اقتصادية وباقات شاملة.\n\nكل الأسعار معروضة في صفحة المحاضرات قبل الإضافة للسلة.'
      } else if (lowerText.includes('توصيل') || lowerText.includes('شحن')) {
        response = 'عندك اختيارين:\n• توصيل لباب البيت — 25 ج.م\n• استلام من المكتبة — بدون رسوم\n\nوقت التوصيل بيختلف حسب المكتبة والزحمة، وبيظهر مُقدَّرًا في صفحة التتبع بعد تأكيد الطلب.'
      } else if (lowerText.includes('استرجاع') || lowerText.includes('ارجاع')) {
        response = 'الاسترجاع لسه تحت التفعيل ومش متاح دلوقتي.\n\nلو وصلك منتج غلط أو تالف، كلّم الدعم في نفس اليوم وهنتصرف مع المكتبة حالة بحالة.'
      } else if (lowerText.includes('خصم') || lowerText.includes('كود')) {
        response = 'أكواد الخصم بتتحط في صفحة الدفع قبل التأكيد.\n\nلو معاك كود سفير، هتلاقيه في صفحة السفراء جاهز للنسخ.'
      } else if (lowerText.includes('مرحبا') || lowerText.includes('هاي') || lowerText.includes('سلام')) {
        response = 'أهلًا بيك. تقدر تسألني عن:\n• أسعار المحاضرات\n• التوصيل والاستلام\n• أكواد الخصم\n• حالة طلبك\n\nأو اختار من الاقتراحات السريعة بالأسفل.'
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: response,
        sender: 'bot',
        time: getTimestamp(),
      }
      setMessages((prev) => [...prev, botMsg])
    }, 1500)
  }

  const toggleFAQ = (id: string) => {
    setOpenFAQ((prev) => (prev === id ? null : id))
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="screen-enter min-h-full bg-brand-grey-100 flex flex-col"
    >
      {/* Sticky Header — gradient navy-800 → sky-900 with animated bot avatar */}
      <motion.div
        variants={staggerItem}
        className="sticky top-0 z-20 bg-gradient-to-l from-navy-800 to-sky-900 px-4 py-3 flex items-center gap-3 shadow-lg shadow-navy-800/20"
      >
        <button data-tap="44"
          onClick={() => onNavigate?.('home')}
          className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform border border-white/20 tap-44"
          aria-label="رجوع"
        >
          <ChevronLeft size={20} className="text-white rotate-180" />
        </button>
        <div className="flex-1 flex items-center gap-2.5">
          <motion.div
            animate={{ 
              scale: [1, 1.08, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20"
          >
            <Bot size={18} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-white font-semibold text-[15px] leading-tight">الدعم الذكي</h1>
            <div className="flex items-center gap-1">
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-success"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
              />
              <span className="text-sky-200 text-[12px]">متصل الآن</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2"
        style={{
          maxHeight: 'calc(100% - 180px)',
          minHeight: '300px',
        }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={msg.sender === 'user' ? userMessageVariant : botMessageVariant}
              initial="hidden"
              animate="show"
              layout
              className={`flex items-end gap-2 mb-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {msg.sender === 'bot' && (
                <motion.div 
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-navy-800 to-sky-600 flex items-center justify-center flex-shrink-0 mb-5 shadow-sm shadow-navy-800/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                >
                  <Bot className="w-3.5 h-3.5 text-white" aria-hidden />
                </motion.div>
              )}
              <div className="max-w-[78%]">
                <motion.div
                  className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-2xl rounded-bl-md shadow-md shadow-sky-500/20'
                      : 'bg-white text-navy-800 rounded-2xl rounded-br-md shadow-sm'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </motion.div>
                <motion.div
                  variants={timestampVariant}
                  initial="hidden"
                  animate="show"
                  className={`flex items-center gap-1 mt-1 mb-1 ${
                    msg.sender === 'user' ? 'justify-start' : 'justify-start'
                  }`}
                >
                  <Clock size={10} className="text-brand-grey-400" />
                  <span className="text-[12px] text-brand-grey-400 sl-num">{msg.time}</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        {/* Quick Reply Chips — shown in chat area when visible */}
        <AnimatePresence>
          {quickRepliesVisible && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex flex-wrap gap-2 mt-2 mb-2"
            >
              {quickReplies.map((reply, idx) => (
                <motion.button data-tap="44"
                  key={reply}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.08, duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickReply(reply)}
                  className="rounded-full bg-sky-50 text-sky-600 border border-sky-200/50 px-4 py-2 text-[13px] font-medium transition-colors hover:bg-sky-100/80 hover:shadow-sm"
                >
                  {reply}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating bot icon when no messages (besides welcome) */}
        {messages.length <= 1 && !isTyping && !quickRepliesVisible && (
          <FloatingBotIcon />
        )}

        {/* FAQ Toggle */}
        <motion.div variants={staggerItem} className="mt-4 mb-2">
          <button data-tap="44"
            onClick={() => setShowFAQ(!showFAQ)}
            className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-sky-500" />
              <span className="text-navy-800 font-semibold text-[13px]">الأسئلة الشائعة</span>
            </div>
            <motion.div
              animate={{ rotate: showFAQ ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown size={18} className="text-brand-grey-400" />
            </motion.div>
          </button>
        </motion.div>

        {/* FAQ Accordion */}
        <AnimatePresence>
          {showFAQ && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mt-2 pb-2">
                {faqItems.map((faq, idx) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <button data-tap="44" aria-label="توسيع"
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform"
                    >
                      <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                        {faq.icon}
                      </div>
                      <span className="flex-1 text-start text-navy-800 text-[13px] font-medium">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-brand-grey-400 flex-shrink-0" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-brand-grey-100 rounded-b-xl px-4 py-3 -mt-1 mx-1">
                            <p className="text-navy-800/80 text-[13px] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Contact Options */}
      <motion.div
        variants={staggerItem}
        className="bg-white border-t border-brand-grey-200/50 px-4 py-2"
      >
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex items-center gap-1.5 text-brand-grey-400">
            <Phone size={12} />
            <span className="text-[12px]">واتساب</span>
          </div>
          <span className="text-brand-grey-200">|</span>
          <div className="flex items-center gap-1.5 text-brand-grey-400">
            <Mail size={12} />
            <span className="text-[12px] sl-num">support@studylink.com</span>
          </div>
          <span className="text-brand-grey-200">|</span>
          <div className="flex items-center gap-1.5 text-brand-grey-400">
            <Clock size={12} />
            <span className="text-[12px]">9ص - 11م</span>
          </div>
        </div>
      </motion.div>

      {/* Message Input — animated focus ring */}
      <motion.div
        variants={staggerItem}
        className="bg-white border-t border-brand-grey-200/50 px-4 py-3"
      >
        <div className="flex items-center gap-2.5">
          <motion.div 
            className="flex-1 relative"
            animate={{ 
              scale: inputFocused ? 1.01 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute -inset-[3px] rounded-2xl bg-gradient-to-l from-sky-500 to-navy-800 opacity-0"
              animate={{ opacity: inputFocused ? 0.15 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="اكتب رسالتك..."
              aria-label="اكتب رسالتك" className="relative w-full min-h-11 bg-brand-grey-100 rounded-xl px-4 py-2.5 text-[13px] text-navy-800 placeholder:text-brand-grey-400 outline-none transition-shadow"
              dir="rtl"
            />
          </motion.div>
          {/* Send button with pulse glow animation */}
          <motion.button data-tap="44"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            whileTap={{ scale: 0.88 }}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              inputValue.trim() && !isTyping
                ? 'bg-sky-500 text-white'
                : 'bg-brand-grey-100 text-brand-grey-400'
            } tap-44`}
            aria-label="إرسال"
          >
            {/* Pulse glow ring when active */}
            {inputValue.trim() && !isTyping && (
              <motion.span
                className="absolute inset-0 rounded-xl bg-sky-400"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
              />
            )}
            <Send size={18} className="-rotate-90 relative z-10" />
          </motion.button>
        </div>

        {/* Quick Reply Chips — always visible below input */}
        <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {quickReplies.map((reply) => (
            <motion.button data-tap="44"
              key={reply}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickReply(reply)}
              className="flex-shrink-0 rounded-full bg-sky-50 text-sky-600 border border-sky-200/50 px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-sky-100/80 hover:shadow-sm whitespace-nowrap"
            >
              {reply}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}