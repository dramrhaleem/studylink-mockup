'use client'

import { asset } from '@/lib/asset'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Shield, Zap, Heart, BookOpen, Truck, Clock, Target, Award, Mail, MessageCircle, Instagram, Twitter, ExternalLink, Store, Receipt, Bell } from 'lucide-react'
import Image from 'next/image'

interface AboutScreenProps {
  onNavigate?: (screen: string) => void
}

/* الأرقام السابقة (2,000+ طالب · 8,500+ مذكرة · 5,000+ توصيلة · 4.8/5) كانت
   مُختلقة بالكامل. الحالة المسجّلة في core: 270 عضو تيليجرام، 50 تنزيلًا،
   13 تسجيلًا، وصفر طلبات من خارج المعارف. وcore/07 §4 يمنع نصًا عرض «عدد
   مستخدمين أو طلبات أو نسبة نجاح غير مولّدة من النظام».
   البديل: حقائق عن كيفية عمل المنصة — صحيحة اليوم، ولا تحتاج بيانات لإثباتها.
   حين يصير للنظام أرقام حقيقية، تُوصل هذه البطاقات بمصدرها. */
const facts = [
  { icon: Store, title: 'مكتبتان شريكتان', desc: 'هارفرد وبرلين — الطلب بيتجمّع من المكتبة نفسها', color: 'text-sky-600', bg: 'bg-sky-50' },
  { icon: Truck, title: 'توصيل أو استلام', desc: 'تختار اللي يناسبك، والمساران واضحان بنفس القدر', color: 'text-navy-800', bg: 'bg-navy-50' },
  { icon: Receipt, title: 'كل بند مكتوب', desc: 'سعر المكتبة ورسوم الخدمة والتوصيل — كلٌ على حدة', color: 'text-success', bg: 'bg-success-bg' },
  { icon: Bell, title: 'حالة الطلب لحظية', desc: 'كل تغيير في الطلب بيوصلك، وقت التأخير كمان', color: 'text-amber-600', bg: 'bg-amber-50' },
]

const values = [
  { icon: Target, title: 'الوصول السريع', desc: 'طلبك يتجمّع من المكتبة ويوصلك، أو تستلمه بنفسك', color: 'from-sky-500 to-sky-400' },
  { icon: Shield, title: 'الشفافية والجودة', desc: 'حالة المنتج ومصدره مكتوبان قبل ما تطلب', color: 'from-violet-500 to-violet-400' },
  { icon: Zap, title: 'الأسعار الشفافة', desc: 'سعر المكتبة ورسوم المنصة والتوصيل — بنود منفصلة قبل الدفع', color: 'from-amber-500 to-amber-400' },
  { icon: Heart, title: 'صُمم للطلاب', desc: 'تجربة مصممة خصيصاً لطلاب الطب', color: 'from-error to-red-400' },
  { icon: Clock, title: 'التوصيل المرن', desc: 'تتبع طلبك لحظة لحظة حتى يوصلك', color: 'from-teal-500 to-teal-400' },
  { icon: Award, title: 'سفراء الإحالة', desc: 'اكسب 20 جنيه عن كل طالب تسجل من كودك', color: 'from-navy-700 to-navy-600' },
]

const team = [
  { role: 'مؤسس ورئيس تنفيذي', name: 'أحمد الشريف', emoji: '👨‍💼', gradient: 'from-sky-100 to-sky-50' },
  { role: 'مدير العمليات', name: 'محمود عادل', emoji: '👨‍💻', gradient: 'from-violet-100 to-violet-50' },
  { role: 'مدير التسويق', name: 'فاطمة السيد', emoji: '👩‍🎨', gradient: 'from-amber-100 to-amber-50' },
]

const socialLinks = [
  { label: 'واتساب', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50', hoverBg: 'bg-green-100', description: 'تواصل سريع' },
  { label: 'إنستجرام', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50', hoverBg: 'bg-pink-100', description: '@studylink' },
  { label: 'تويتر', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50', hoverBg: 'bg-sky-100', description: '@studylink' },
  { label: 'البريد الإلكتروني', icon: Mail, color: 'text-navy-700', bg: 'bg-navy-50', hoverBg: 'bg-navy-100', description: 'support@studylink.app' },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

function CountUpNumber({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1500
    const steps = 30
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [target])

  return (
    <span ref={ref} className="sl-num">
      {prefix}{typeof count === 'number' && count >= 1000 ? count.toLocaleString() : count}{suffix}
    </span>
  )
}

function GradientDivider() {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-grey-300/50 to-transparent" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 opacity-40"
      />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-grey-300/50 to-transparent" />
    </div>
  )
}

export default function AboutScreen({ onNavigate }: AboutScreenProps) {
  return (
    <div className="screen-enter min-h-full bg-brand-grey-100 relative overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute top-32 right-2 w-3 h-3 rounded-full bg-sky-200/40 pointer-events-none z-0"
      />
      <motion.div
        animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
        className="absolute top-56 left-4 w-2 h-2 rounded-full bg-violet-200/40 pointer-events-none z-0"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-64 right-8 w-4 h-4 rounded-full bg-amber-200/30 pointer-events-none z-0"
      />
      <motion.div
        animate={{ y: [0, 12, 0], x: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-96 left-6 w-2.5 h-2.5 rounded-full bg-teal-200/40 pointer-events-none z-0"
      />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <motion.button data-tap="44" aria-label="رجوع"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate?.('home')}
            className="w-8 h-8 rounded-full bg-brand-grey-100 flex items-center justify-center tap-44"
          >
            <ChevronLeft className="w-4 h-4 text-navy-800 rotate-180" />
          </motion.button>
          <h1 className="text-[15px] font-bold text-navy-800">عن StudyLink</h1>
          <div className="w-8" />
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 p-4 space-y-4 pb-6"
      >
        {/* Hero */}
        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-navy-800 via-navy-700 to-sky-900 p-5 text-white"
        >
          {/* Decorative circles */}
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/5"
          />
          <motion.div
            animate={{ x: [0, -8, 0], y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
            className="pointer-events-none absolute -right-6 bottom-[-16px] h-24 w-24 rounded-full bg-white/5"
          />
          {/* Small decorative dots */}
          <div className="pointer-events-none absolute top-3 right-6 flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                className="w-1 h-1 rounded-full bg-white/40"
              />
            ))}
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/10"
            >
              <Image src={asset('/studylink-icon.png')} alt="SL" width={40} height={40} className="rounded-xl" />
            </motion.div>
            <h2 className="text-[20px] font-bold text-center leading-tight">StudyLink</h2>
            <p className="text-[13px] text-white/80 text-center leading-relaxed max-w-[280px]">
              سوق أكاديمي لطلبة جامعة المنصورة — محاضراتك وأدواتك في مكان واحد
            </p>
            <p className="text-[12px] text-sky-300 text-center bg-white/10 px-3 py-1 rounded-full mt-1">
              الإصدار v1.0.2
            </p>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div variants={staggerItem} className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50">
          <h3 className="text-[14px] font-bold text-navy-800 mb-2 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-sky-500 to-sky-400" />
            رسالتنا
          </h3>
          <p className="text-[13px] text-brand-grey-600 leading-[1.9]">
            نجمع حل مشكلة حقيقية بيع الطالب محاضراتهم وأدواتهم من المكتبات المختلفة. بدل ما يروحوا من مكتبة لمكتبة، StudyLink يجمع كل المحاضرات في مكان واحد مع توصيل سريع وأسعار شفافة.
          </p>
          <p className="text-[13px] text-brand-grey-500 leading-[1.9] mt-2">
            بنينا التطبيق ليكون سهل الاستخدام قدر الإمكان — لأن وقت الطالب غالي وكل دقيقة بتعني حاجة.
          </p>
        </motion.div>

        <GradientDivider />

        {/* Stats Grid with count-up */}
        <motion.div variants={staggerItem}>
          <h3 className="text-[14px] font-bold text-navy-800 mb-3">إزاي StudyLink بتشتغل</h3>
          <div className="grid grid-cols-2 gap-3">
            {facts.map((fact, idx) => {
              const Icon = fact.icon
              return (
                <motion.div
                  key={fact.title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + idx * 0.07, duration: 0.3 }}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-brand-grey-200/50"
                >
                  <div className={`w-9 h-9 ${fact.bg} rounded-xl flex items-center justify-center mb-2`}>
                    <Icon className={`w-4 h-4 ${fact.color}`} aria-hidden="true" />
                  </div>
                  <p className="text-[13px] font-bold text-navy-800 leading-tight">{fact.title}</p>
                  <p className="text-[12px] text-brand-grey-500 mt-1 leading-relaxed">{fact.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <GradientDivider />

        {/* Values with icon animations */}
        <motion.div variants={staggerItem}>
          <h3 className="text-[14px] font-bold text-navy-800 mb-3">لما StudyLink؟</h3>
          <div className="space-y-2">
            {values.map((v, idx) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  whileHover={{ x: -4, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05, duration: 0.25 }}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-brand-grey-200/50 flex items-start gap-3 cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${v.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-[13px] font-bold text-navy-800">{v.title}</p>
                    <p className="text-[12px] text-brand-grey-500 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <GradientDivider />

        {/* How it Works */}
        <motion.div variants={staggerItem} className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50">
          <h3 className="text-[14px] font-bold text-navy-800 mb-3">إزاي بتعمل؟</h3>
          <div className="space-y-4">
            {[
              { step: 1, title: 'الطالب يتصفح ويتسوق', desc: 'يختار المحاضرات والأدوات من مكتبات هارفرد وبرلين ويضيفها للسلة' },
              { step: 2, title: 'StudyLink يوصل الطلبات', desc: 'يتم التأكيد مع المكتبات وتجهيز الطلبات للتوصيل' },
              { step: 3, title: 'التوصيل أو الاستلام', desc: 'مندوب StudyLink يوصّل الطلب، أو تستلمه من المكتبة بنفسك' },
            ].map((s, idx) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.08 }}
                className="flex items-start gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-navy-800 to-navy-700 text-white flex items-center justify-center flex-shrink-0 text-[13px] font-bold sl-num shadow-sm"
                >
                  {s.step}
                </motion.div>
                <div>
                  <p className="text-[13px] font-bold text-navy-800">{s.title}</p>
                  <p className="text-[12px] text-brand-grey-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <GradientDivider />

        {/* Team with hover effects */}
        <motion.div variants={staggerItem} className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50">
          <h3 className="text-[14px] font-bold text-navy-800 mb-3">الفريق</h3>
          <div className="space-y-3">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                whileHover={{ x: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.08 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-grey-50 transition-colors cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-2xl shadow-sm`}
                >
                  {member.emoji}
                </motion.div>
                <div>
                  <p className="text-[13px] font-semibold text-navy-800">{member.name}</p>
                  <p className="text-[12px] text-brand-grey-400">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <GradientDivider />

        {/* Social Media Link Cards */}
        <motion.div variants={staggerItem}>
          <h3 className="text-[14px] font-bold text-navy-800 mb-3">تواصل معنا</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {socialLinks.map((link, idx) => {
              const Icon = link.icon
              return (
                <motion.button data-tap="44"
                  key={link.label}
                  whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + idx * 0.06, duration: 0.25 }}
                  className="bg-white rounded-2xl p-3.5 border border-brand-grey-200/50 shadow-sm text-right hover:bg-brand-grey-50 transition-all group"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className={`w-9 h-9 ${link.bg} rounded-xl flex items-center justify-center mb-2`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${link.color}`} />
                  </motion.div>
                  <p className="text-[13px] font-bold text-navy-800 mb-0.5">{link.label}</p>
                  <p className="text-[12px] text-brand-grey-400 truncate">{link.description}</p>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-4 text-center border border-sky-100"
        >
          <p className="text-[13px] font-bold text-navy-800 mb-1">عندك سؤال أو اقتراح؟</p>
          <p className="text-[12px] text-brand-grey-600 mb-3">تواصل معانا على:</p>
          <div className="flex justify-center gap-3">
            <motion.button data-tap="44"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-sky-600 text-[12px] font-semibold px-4 py-2 rounded-xl shadow-sm"
            >
              📧 support@studylink.app
            </motion.button>
            <motion.button data-tap="44"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-sky-600 text-[12px] font-semibold px-4 py-2 rounded-xl shadow-sm"
            >
              📱 واتسابنا
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom safe area */}
      <div className="h-20" />
    </div>
  )
}