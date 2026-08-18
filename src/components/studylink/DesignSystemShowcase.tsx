'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Palette, Type, LayoutGrid, Square, Layers,
  MousePointerClick, Sparkles, MessageSquare,
  PanelBottom, Navigation, CreditCard,
  Tag, Grid3X3, Smartphone,
  BookOpen, ShieldCheck, ArrowUp, X, Check,
  ShoppingBag, Heart, Package, Search,
  Star, Bell, Users, ChevronDown,
  CheckCircle2, XCircle, AlertTriangle,
  Clock, Truck, CircleCheck, CircleDot,
  Home, User, Menu, Plus, Minus, Eye, EyeOff,
  Loader2, Copy, Hash, Ruler, Box, Zap, Info
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════
    UTILITIES
═══════════════════════════════════════════════════════════════ */

function useScrollSpy(sectionIds: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          )
          setActive(top.target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sectionIds])
  return active
}

function Section({ id, number, title, icon, children, description }: {
  id: string; number: string; title: string;
  icon: ReactNode; children: ReactNode; description?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 text-sky-500">
          {icon}
        </div>
        <div>
          <p className="text-[12px] font-bold text-sky-500 uppercase sl-num">{number}</p>
          <h2 className="text-lg font-bold text-navy-800 leading-tight">{title}</h2>
        </div>
      </div>
      {description && (
        <p className="text-[13px] text-brand-grey-500 leading-relaxed mb-6 mr-12">{description}</p>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </motion.section>
  )
}

function PreviewBox({ label, children, className = '' }: {
  label?: string; children: ReactNode; className?: string
}) {
  return (
    <div className={`bg-brand-grey-50/80 rounded-2xl border border-brand-grey-200/60 p-5 ${className}`}>
      {label && (
        <p className="text-[12px] font-bold text-brand-grey-400 uppercase mb-3 flex items-center gap-1.5">
          <Eye className="w-3 h-3" />
          {label}
        </p>
      )}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {children}
      </div>
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="relative group">
      <pre className="bg-navy-900 rounded-xl p-4 text-[12px] leading-[1.8] font-mono text-sky-300 overflow-x-auto" dir="ltr">
        {children}
      </pre>
      <button data-tap="44" aria-label="نسخ"
        onClick={() => navigator.clipboard.writeText(children)}
        className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/50 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 tap-44"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[14px] font-bold text-navy-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-sky-500" />
        {title}
      </h3>
      {children}
    </div>
  )
}

function InfoCard({ type = 'info', children }: { type?: 'info' | 'success' | 'error' | 'warning'; children: ReactNode }) {
  const styles = {
    info: { bg: 'bg-sky-50', border: 'border-sky-100', icon: <Info className="w-4 h-4 text-sky-500" />, text: 'text-sky-700' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, text: 'text-emerald-700' },
    error: { bg: 'bg-red-50', border: 'border-red-100', icon: <XCircle className="w-4 h-4 text-red-500" />, text: 'text-red-700' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-100', icon: <AlertTriangle className="w-4 h-4 text-amber-600" />, text: 'text-amber-700' },
  }
  const s = styles[type]
  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl ${s.bg} border ${s.border}`}>
      <div className="mt-0.5 flex-shrink-0">{s.icon}</div>
      <div className={`text-[13px] leading-relaxed ${s.text}`}>{children}</div>
    </div>
  )
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 186
}

function ColorSwatch({ name, hex, usage }: { name: string; hex: string; usage: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const light = isLightColor(hex)
  return (
    <button data-tap="44" aria-label="تأكيد"
      onClick={handleCopy}
      className="group flex flex-col items-center gap-2 text-center min-w-[85px] transition-transform hover:scale-[1.03]"
    >
      <div
        className={`w-full aspect-square rounded-xl shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden ${light ? 'border border-brand-grey-300' : 'border border-black/10'}`}
        style={{ backgroundColor: hex }}
      >
        {copied && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div>
        <p className="text-[12px] font-bold text-navy-800">{name}</p>
        <p className="text-[12px] font-mono text-brand-grey-600 sl-num">{hex}</p>
      </div>
      <p className="text-[11px] text-brand-grey-500 leading-snug max-w-[90px]">{usage}</p>
    </button>
  )
}

function ColorRow({ colors }: { colors: { name: string; hex: string; usage: string }[] }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-grey-200/80 p-5 shadow-sm">
      <div className="flex items-start gap-5 overflow-x-auto no-scrollbar pb-1">
        {colors.map(c => <ColorSwatch key={c.hex} {...c} />)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
    TABLE OF CONTENTS
═══════════════════════════════════════════════════════════════ */

const tocItems = [
  { id: 'sec-colors', label: 'نظام الألوان', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'sec-typography', label: 'الخطوط', icon: <Type className="w-3.5 h-3.5" /> },
  { id: 'sec-spacing', label: 'المسافات', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { id: 'sec-radius', label: 'الزوايا المستديرة', icon: <Square className="w-3.5 h-3.5" /> },
  { id: 'sec-shadows', label: 'الظلال', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'sec-buttons', label: 'الأزرار', icon: <MousePointerClick className="w-3.5 h-3.5" /> },
  { id: 'sec-cards', label: 'البطاقات', icon: <CreditCard className="w-3.5 h-3.5" /> },
  { id: 'sec-badges', label: 'الشارات والأقراص', icon: <Tag className="w-3.5 h-3.5" /> },
  { id: 'sec-filters', label: 'الفلاتر والتبويبات', icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  { id: 'sec-inputs', label: 'حقول الإدخال', icon: <Hash className="w-3.5 h-3.5" /> },
  { id: 'sec-animations', label: 'الحركة', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'sec-patterns', label: 'أنماط التصميم', icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'sec-rules', label: 'القواعد العامة', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
]

/* ═══════════════════════════════════════════════════════════════
    MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function DesignSystemShowcase() {
  const activeSection = useScrollSpy(tocItems.map(i => i.id))
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [isInViewport, setIsInViewport] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="min-h-screen bg-white">
      {/* ══════ HERO ══════ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 pb-20 pt-12 px-4">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        {/* Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-600/8 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10 mb-6">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[12px] font-semibold text-sky-300">Design System v1.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              دليل نظام التصميم
            </h1>
            <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              كل قواعد التصميم المتفق عليها مُوثّقة هنا — أي مصمم يقدر يشتغل من هذا الدليل بشكل مستقل
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10"
          >
            {[
              { value: '26', label: 'قسم' },
              { value: '7', label: 'ألوان أساسية' },
              { value: '8', label: 'أنواع أزرار' },
              { value: '375×812', label: 'iPhone 15 Pro' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-extrabold text-sky-400 sl-num">{stat.value}</p>
                <p className="text-[12px] text-white/40 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════ CONTENT AREA ══════ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 bg-white rounded-t-3xl pt-8 pb-4 shadow-[0_-8px_40px_rgba(0,0,0,0.08)]">
        <div className="flex gap-8">
          {/* ─── SIDEBAR (Desktop) ─── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-brand-grey-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04)] p-3">
                <p className="text-[12px] font-bold text-brand-grey-400 uppercase px-2.5 mb-2">المحتويات</p>
                <nav className="space-y-0.5 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-sky-50 text-sky-600 shadow-sm'
                          : 'text-brand-grey-500 hover:text-navy-800 hover:bg-brand-grey-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* ─── MOBILE TOC BUTTON (hidden while phone mockup is visible) ─── */}
          <div className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <button data-tap="44"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="flex items-center gap-2 bg-navy-800 text-white px-5 py-3 rounded-2xl shadow-lg shadow-navy-800/30 text-[13px] font-bold"
            >
              <Menu className="w-4 h-4" />
              الفهرس
            </button>
          </div>
          <AnimatePresence>
            {mobileTocOpen && (
              <div className="lg:hidden fixed inset-0 z-[60]">
                <div className="absolute inset-0 bg-black/40" onClick={() => setMobileTocOpen(false)} />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 pb-8 max-h-[60vh] overflow-y-auto"
                >
                  <div className="w-10 h-1 rounded-full bg-brand-grey-300 mx-auto mb-4" />
                  <nav className="grid grid-cols-2 gap-2">
                    {tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setMobileTocOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-[13px] font-medium bg-brand-grey-50 text-navy-800 hover:bg-sky-50 transition-colors"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </nav>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ─── MAIN CONTENT ─── */}
          <main className="flex-1 min-w-0 pb-20 space-y-16">

            {/* ═══════════════════════════════════════════════════
                1. COLOR SYSTEM
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-colors"
              number="01"
              title="نظام الألوان"
              icon={<Palette className="w-4.5 h-4.5" />}
              description="لوحة الألوان الكاملة لتطبيق StudyLink — مبنية على Navy و Sky كلونين أساسيين"
            >
              {/* Primary Colors */}
              <SubSection title="الألوان الأساسية">
                <ColorRow colors={[
                  { name: 'Navy 800', hex: '#13253A', usage: 'النص الرئيسي، عناوين الأقسام' },
                  { name: 'Sky 500', hex: '#1A70B0', usage: 'الأزرار الرئيسية، CTA' },
                  { name: 'Sky 400', hex: '#5998CF', usage: 'Hover State' },
                  { name: 'Success', hex: '#007C50', usage: 'حالة النجاح' },
                  { name: 'Error', hex: '#B4122E', usage: 'الأخطاء، الخصومات' },
                  { name: 'Warning', hex: '#9C5E00', usage: 'التحذيرات' },
                  { name: 'Amber 400', hex: '#FFE24B', usage: 'التقييمات، Achievement' },
                ]} />
              </SubSection>

              {/* Navy Scale */}
              <SubSection title="درجات Navy">
                <div className="bg-white rounded-2xl border border-brand-grey-200/80 p-4 shadow-sm">
                  <div className="flex gap-1.5 rounded-xl overflow-hidden h-16 border border-brand-grey-200/50">
                    {[
                      { hex: '#EEF6FF', label: '50' },
                      { hex: '#DCE6F1', label: '100' },
                      { hex: '#C4CFDC', label: '200' },
                      { hex: '#A6B2C1', label: '300' },
                      { hex: '#8694A4', label: '400' },
                      { hex: '#677688', label: '500' },
                      { hex: '#495A6D', label: '600' },
                      { hex: '#304156', label: '700' },
                      { hex: '#13253A', label: '800' },
                      { hex: '#08192C', label: '900' },
                    ].map(s => {
                      const light = isLightColor(s.hex)
                      return (
                        <div key={s.label} className="flex-1 flex flex-col items-center justify-center cursor-pointer group relative" style={{ backgroundColor: s.hex }}>
                          <span className={`text-[12px] font-bold sl-num transition-opacity ${light ? 'text-navy-800' : 'text-white/90'}`}>{s.label}</span>
                          <span className={`text-[11px] font-mono sl-num opacity-0 group-hover:opacity-100 transition-opacity ${light ? 'text-navy-700' : 'text-white/70'}`}>{s.hex}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </SubSection>

              {/* Sky Scale */}
              <SubSection title="درجات Sky">
                <div className="bg-white rounded-2xl border border-brand-grey-200/80 p-4 shadow-sm">
                  <div className="flex gap-1.5 rounded-xl overflow-hidden h-16 border border-brand-grey-200/50">
                    {[
                      { hex: '#EDF6FF', label: '50' },
                      { hex: '#CFE8FF', label: '100' },
                      { hex: '#A4D4FF', label: '200' },
                      { hex: '#82B7E7', label: '300' },
                      { hex: '#5998CF', label: '400' },
                      { hex: '#1A70B0', label: '500' },
                      { hex: '#0A5C94', label: '600' },
                      { hex: '#00426F', label: '700' },
                      { hex: '#00426F', label: '800' },
                      { hex: '#002D4E', label: '900' },
                    ].map(s => {
                      const light = isLightColor(s.hex)
                      return (
                        <div key={s.label} className="flex-1 flex flex-col items-center justify-center cursor-pointer group relative" style={{ backgroundColor: s.hex }}>
                          <span className={`text-[12px] font-bold sl-num transition-opacity ${light ? 'text-navy-800' : 'text-white/90'}`}>{s.label}</span>
                          <span className={`text-[11px] font-mono sl-num opacity-0 group-hover:opacity-100 transition-opacity ${light ? 'text-navy-700' : 'text-white/70'}`}>{s.hex}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </SubSection>

              {/* Brand Grey Scale */}
              <SubSection title="درجات Brand Grey">
                <div className="bg-white rounded-2xl border border-brand-grey-200/80 p-4 shadow-sm">
                  <div className="flex gap-1.5 rounded-xl overflow-hidden h-16 border border-brand-grey-200/50">
                    {[
                      { hex: '#FBF9F4', label: '50' },
                      { hex: '#F2EEE3', label: '100' },
                      { hex: '#DAD7CF', label: '200' },
                      { hex: '#BEBAB1', label: '300' },
                      { hex: '#BEBAB1', label: '400' },
                      { hex: '#6B6860', label: '500' },
                      { hex: '#5A5852', label: '600' },
                      { hex: '#42403A', label: '700' },
                      { hex: '#2D2B27', label: '800' },
                      { hex: '#13253A', label: '900' },
                    ].map(s => {
                      const light = isLightColor(s.hex)
                      return (
                        <div key={s.label} className="flex-1 flex flex-col items-center justify-center cursor-pointer group relative" style={{ backgroundColor: s.hex }}>
                          <span className={`text-[12px] font-bold sl-num transition-opacity ${light ? 'text-navy-800' : 'text-white/90'}`}>{s.label}</span>
                          <span className={`text-[11px] font-mono sl-num opacity-0 group-hover:opacity-100 transition-opacity ${light ? 'text-navy-700' : 'text-white/70'}`}>{s.hex}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </SubSection>

              {/* Category Colors */}
              <SubSection title="ألوان الأقسام">
                <PreviewBox label="مباشر">
                  <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-navy-800/80 text-white">محاضرات</span>
                  <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200/60">أدوات طبية</span>
                  <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60">أدوات مكتبية</span>
                </PreviewBox>
              </SubSection>

              {/* Status Colors */}
              <SubSection title="ألوان حالة الطلب">
                <PreviewBox label="مباشر">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Clock className="w-3.5 h-3.5" /> قيد التحضير
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600">
                    <Truck className="w-3.5 h-3.5" /> تم الشحن
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    <CircleCheck className="w-3.5 h-3.5" /> تم التسليم
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    <CircleDot className="w-3.5 h-3.5" /> متاح
                  </span>
                </PreviewBox>
              </SubSection>

              {/* Golden Rule */}
              <InfoCard type="warning">
                <strong>قاعدة ذهبية:</strong> ممنوع استخدام ألوان Indigo أو Blue في أي مكان من التطبيق. استخدم Navy و Sky فقط.
              </InfoCard>
            </Section>

            {/* ═══════════════════════════════════════════════════
                2. TYPOGRAPHY
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-typography"
              number="02"
              title="الخطوط"
              icon={<Type className="w-4.5 h-4.5" />}
              description="خطوط العلامة: StudyLink Arabic للعربي، وStudyLink Mono للأرقام والأكواد والمبالغ"
            >
              {/* Font Families */}
              <SubSection title="عائلات الخطوط">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'StudyLink Arabic', desc: 'المتن والعناوين — 400 · 600 · 700', sample: 'StudyLink — سوق أكاديمي لطلبة المنصورة', className: 'font-sans text-navy-800' },
                    { name: 'StudyLink Mono', desc: 'الأرقام والمبالغ — أرقام جدولية', sample: '1,111.11  ·  1,250.00  ·  25 ج.م', className: 'sl-num text-navy-800' },
                    { name: 'Geist Mono', desc: 'النص الأحادي', sample: 'SL-AMB-2024X', className: 'font-mono text-navy-800' },
                  ].map(f => (
                    <div key={f.name} className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm">
                      <p className="text-[12px] font-bold text-brand-grey-400 uppercase mb-2 sl-num">{f.name}</p>
                      <p className={`text-[15px] ${f.className} mb-2 leading-relaxed`}>{f.sample}</p>
                      <p className="text-[12px] text-brand-grey-500">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </SubSection>

              {/* Font Sizes */}
              <SubSection title="مقاسات الخطوط">
                <div className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm space-y-4">
                  {[
                    { size: '8px', cls: 'text-[11px]', sample: 'مكتبة مغلقة', usage: 'حالة المتجر "مغلقة"' },
                    { size: '9px', cls: 'text-[12px]', sample: 'تشريح — الفئة', usage: 'الفئات، المواصفات، badges صغيرة' },
                    { size: '10px', cls: 'text-[12px]', sample: 'عرض الكل', usage: 'العناوين الفرعية، بيانات التعريف' },
                    { size: '11px', cls: 'text-[12px]', sample: 'الوصف والتفاصيل', usage: 'الوصف، form labels، محتوى ثانوي' },
                    { size: '12px', cls: 'text-[13px]', sample: 'النص الأساسي للتطبيق', usage: 'النص الأساسي، عناوين الأقسام' },
                    { size: '13px', cls: 'text-[13px]', sample: 'نص الجسم المعياري', usage: 'نص الجسم، حقول الإدخال' },
                    { size: '14px', cls: 'text-[14px]', sample: 'عناوين الأقسام والبطاقات', usage: 'عناوين، CTA buttons' },
                    { size: '16px', cls: 'text-[16px]', sample: 'عناوين الشاشات', usage: 'عناوين الشاشات الرئيسية' },
                    { size: '18px', cls: 'text-[18px]', sample: '150.00 ج.م', usage: 'الأسعار الكبيرة', inter: true },
                    { size: '20px', cls: 'text-[20px]', sample: '350.00 ج.م', usage: 'أسعار Product Detail', inter: true },
                    { size: '28px', cls: 'text-[28px]', sample: '1,250.00 ج.م', usage: 'رصيد المحفظة', inter: true },
                  ].map(f => (
                    <div key={f.size} className="flex items-baseline gap-4">
                      <span className="text-[12px] font-mono text-brand-grey-400 w-12 flex-shrink-0 sl-num">{f.size}</span>
                      <span className={`${f.cls} text-navy-800 ${f.inter ? 'sl-num font-extrabold' : ''} flex-shrink-0`}>{f.sample}</span>
                      <span className="text-[12px] text-brand-grey-400 hidden sm:block">{f.usage}</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              {/* Font Weights */}
              <SubSection title="أوزان الخطوط">
                <div className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm space-y-3">
                  {[
                    { w: '400', cls: 'font-normal', label: 'Normal — النص العادي' },
                    { w: '500', cls: 'font-medium', label: 'Medium — emphasis ثانوي' },
                    { w: '600', cls: 'font-semibold', label: 'Semibold — العناوين الفرعية' },
                    { w: '700', cls: 'font-bold', label: 'Bold — العناوين والأسعار' },
                    { w: '800', cls: 'font-extrabold', label: 'Extra Bold — الأسعار البارزة' },
                  ].map(f => (
                    <div key={f.w} className="flex items-baseline gap-4">
                      <span className="text-[12px] font-mono text-brand-grey-400 w-8 sl-num">{f.w}</span>
                      <span className={`text-[15px] text-navy-800 ${f.cls}`}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              <InfoCard type="info">
                <strong>قاعدة:</strong> كل رقم أو سعر في التطبيق لازم يكون بـ <code className="bg-navy-800 text-sky-300 text-[12px] px-1.5 py-0.5 rounded font-mono">sl-num</code> — مثال: <span className="sl-num font-extrabold text-navy-800">150.00 ج.م</span>
              </InfoCard>
            </Section>

            {/* ═══════════════════════════════════════════════════
                3. SPACING
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-spacing"
              number="03"
              title="المسافات والـ Layout"
              icon={<LayoutGrid className="w-4.5 h-4.5" />}
              description="نظام المسافات المعياري يضمن تناسق بصري عبر كل الشاشات"
            >
              <SubSection title="الـ Padding المعياري">
                <div className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm">
                  <div className="space-y-3">
                    {[
                      { token: 'px-4', px: '16px', usage: 'الـ padding الأفقي للشاشات' },
                      { token: 'px-5', px: '20px', usage: 'محتوى الـ Bottom Sheets' },
                      { token: 'px-6', px: '24px', usage: 'شيتات الـ Checkout، الـ OTP' },
                      { token: 'p-3', px: '12px', usage: 'محتوى البطاقات (Lectures)' },
                      { token: 'p-2.5', px: '10px', usage: 'محتوى البطاقات (Tools)' },
                      { token: 'p-4', px: '16px', usage: 'أقسام الـ Checkout' },
                    ].map(s => (
                      <div key={s.token} className="flex items-center gap-4">
                        <code className="text-[12px] font-mono bg-navy-800 text-sky-300 px-2.5 py-1 rounded-lg min-w-[56px] text-center sl-num">{s.token}</code>
                        <div className="h-3 bg-brand-grey-200 rounded" style={{ width: s.px }} />
                        <span className="text-[12px] font-mono text-brand-grey-400 sl-num">{s.px}</span>
                        <span className="text-[13px] text-brand-grey-600">{s.usage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SubSection>

              <SubSection title="ارتفاعات الأزرار">
                <PreviewBox label="مباشر">
                  {[
                    { h: 'h-8', px: '32px', label: 'صغير' },
                    { h: 'h-9', px: '36px', label: 'هيدر' },
                    { h: 'h-10', px: '40px', label: 'رجوع' },
                    { h: 'h-11', px: '44px', label: 'إضافة' },
                    { h: 'h-12', px: '48px', label: 'CTA' },
                  ].map(b => (
                    <div key={b.h} className="flex flex-col items-center gap-1.5">
                      <div className={`${b.h} w-20 bg-brand-grey-100 rounded-xl border border-brand-grey-200 flex items-center justify-center`}>
                        <span className="text-[12px] font-mono text-brand-grey-500 sl-num">{b.px}</span>
                      </div>
                      <span className="text-[12px] text-brand-grey-400">{b.label}</span>
                    </div>
                  ))}
                </PreviewBox>
              </SubSection>
            </Section>

            {/* ═══════════════════════════════════════════════════
                4. BORDER RADIUS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-radius"
              number="04"
              title="الزوايا المستديرة"
              icon={<Square className="w-4.5 h-4.5" />}
            >
              <PreviewBox label="مباشر">
                {[
                  { cls: 'rounded', px: '4px', label: 'rounded' },
                  { cls: 'rounded-lg', px: '10px', label: 'rounded-lg' },
                  { cls: 'rounded-xl', px: '12px', label: 'rounded-xl' },
                  { cls: 'rounded-2xl', px: '16px', label: 'rounded-2xl' },
                  { cls: 'rounded-3xl', px: '24px', label: 'rounded-3xl' },
                  { cls: 'rounded-full', px: '∞', label: 'rounded-full' },
                ].map(r => (
                  <div key={r.cls} className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 bg-sky-500 ${r.cls} shadow-sm`} />
                    <span className="text-[12px] font-mono text-brand-grey-500 sl-num">{r.label}</span>
                    <span className="text-[11px] text-brand-grey-400 sl-num">{r.px}</span>
                  </div>
                ))}
              </PreviewBox>
            </Section>

            {/* ═══════════════════════════════════════════════════
                5. SHADOWS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-shadows"
              number="05"
              title="الظلال"
              icon={<Layers className="w-4.5 h-4.5" />}
            >
              <PreviewBox label="مباشر">
                {[
                  { cls: 'shadow-sm', label: 'sm — بطاقات' },
                  { cls: 'shadow-md', label: 'md — أزرار محددة' },
                  { cls: 'shadow-lg shadow-sky-500/20', label: 'lg — Grade Gate' },
                  { cls: 'shadow-[0_8px_25px_rgba(0,0,0,0.1)]', label: 'hover — بطاقات' },
                  { cls: 'shadow-[0_-4px_30px_rgba(0,0,0,0.15)]', label: '— Bottom Sheets' },
                ].map(s => (
                  <div key={s.label} className="flex flex-col items-center gap-2">
                    <div className={`w-20 h-20 bg-white rounded-2xl border border-brand-grey-200/50 ${s.cls}`} />
                    <span className="text-[12px] text-brand-grey-500 text-center max-w-[100px]">{s.label}</span>
                  </div>
                ))}
              </PreviewBox>
            </Section>

            {/* ═══════════════════════════════════════════════════
                6. BUTTONS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-buttons"
              number="06"
              title="نظام الأزرار"
              icon={<MousePointerClick className="w-4.5 h-4.5" />}
              description="كل الأزرار التفاعلية لازم يكون فيها whileTap أو active:scale كـ feedback"
            >
              {/* CTA Sky */}
              <SubSection title="CTA أساسي — Sky">
                <PreviewBox label="مباشر">
                  <button data-tap="44" className="bg-sky-500 text-white font-bold text-[14px] px-8 py-3.5 rounded-xl shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-transform relative overflow-hidden">
                    <span className="relative z-10">أضف للسلة</span>
                    <div className="absolute inset-0 bg-gradient-to-l from-sky-400 via-sky-500 to-sky-600 cta-shimmer" />
                  </button>
                </PreviewBox>
                <CodeBlock>{`bg-sky-500 text-white font-bold text-[14px]
py-3.5 rounded-xl
active:scale-[0.98] transition-transform
shadow-lg shadow-sky-500/25`}</CodeBlock>
              </SubSection>

              {/* CTA Navy */}
              <SubSection title="CTA أساسي — Navy">
                <PreviewBox label="مباشر">
                  <button data-tap="44" className="bg-navy-800 text-white font-bold text-[14px] px-8 py-3.5 rounded-2xl shadow-lg shadow-navy-800/20 active:scale-[0.98] transition-transform">
                    إتمام الطلب
                  </button>
                </PreviewBox>
                <CodeBlock>{`bg-navy-800 text-white font-bold text-[14px]
py-3.5 rounded-2xl
active:scale-[0.98]
shadow-lg shadow-navy-800/20`}</CodeBlock>
              </SubSection>

              {/* Disabled */}
              <SubSection title="CTA معطل">
                <PreviewBox label="مباشر">
                  <button data-tap="44" className="bg-brand-grey-200 text-brand-grey-400 font-bold text-[14px] px-8 py-3.5 rounded-xl cursor-not-allowed" disabled>
                    غير متاح
                  </button>
                </PreviewBox>
              </SubSection>

              {/* Outline */}
              <SubSection title="زر ثانوي — Outline">
                <PreviewBox label="مباشر">
                  <button data-tap="44" className="border border-brand-grey-200/60 rounded-xl px-4 py-2 text-[12px] font-bold bg-white text-navy-800 hover:border-sky-400 hover:text-sky-700 transition-colors active:scale-[0.98]">
                    عرض التفاصيل
                  </button>
                </PreviewBox>
              </SubSection>

              {/* Small action */}
              <SubSection title="أزرار الإجراء الصغيرة">
                <PreviewBox label="مباشر">
                  <div className="flex items-center gap-3">
                    <button data-tap="44" aria-label="زيادة" className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm shadow-sky-500/25 active:scale-95 transition-transform tap-44">
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button data-tap="44" aria-label="إنقاص" className="w-8 h-8 rounded-full bg-brand-grey-100 text-navy-800 flex items-center justify-center active:scale-95 transition-transform tap-44">
                      <Minus className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button data-tap="44" aria-label="إغلاق" className="w-8 h-8 rounded-full bg-brand-grey-100 text-navy-800 flex items-center justify-center active:scale-95 transition-transform tap-44">
                      <X className="w-4 h-4" />
                    </button>
                    <button data-tap="44" aria-label="بحث" className="w-9 h-9 rounded-full bg-brand-grey-100 text-navy-800 flex items-center justify-center active:scale-95 transition-transform tap-44">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </PreviewBox>
              </SubSection>

              {/* Success State */}
              <SubSection title="حالة النجاح">
                <PreviewBox label="مباشر">
                  <button data-tap="44" className="bg-success text-white font-bold text-[14px] px-8 py-3.5 rounded-xl shadow-lg shadow-success/25 active:scale-[0.98] transition-transform flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    تمت الإضافة ✓
                  </button>
                </PreviewBox>
              </SubSection>
            </Section>

            {/* ═══════════════════════════════════════════════════
                7. CARDS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-cards"
              number="07"
              title="نظام البطاقات"
              icon={<CreditCard className="w-4.5 h-4.5" />}
              description="البطاقة القياسية: bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50"
            >
              {/* Lecture Card */}
              <SubSection title="بطاقة المحاضرة (2-col)">
                <PreviewBox label="مباشر" className="items-start justify-start">
                  <div className="w-[155px] bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50">
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-sky-100 to-sky-50 relative">
                      <span className="absolute top-1.5 right-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-navy-800/80 text-white backdrop-blur-sm">تشريح</span>
                      <span className="absolute top-1.5 left-1.5 text-[11px] font-bold sl-num bg-[#B4122E] text-white px-1.5 py-px rounded">-20%</span>
                    </div>
                    <div className="p-3">
                      <p className="text-[12px] font-bold text-navy-800 leading-tight line-clamp-2 mb-1.5">ملخص تشريح الفصل الأول — شرح مبسط</p>
                      <p className="text-[12px] text-brand-grey-500 mb-2">د. أحمد المنصور</p>
                      <div className="flex items-center justify-between pt-2 border-t border-brand-grey-200/50">
                        <span className="text-[13px] font-extrabold text-navy-800 sl-num">120.00 ج.م</span>
                        <button data-tap="44" aria-label="زيادة" className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm shadow-sky-500/25 tap-44">
                          <Plus className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </PreviewBox>
                <CodeBlock>{`bg-white rounded-2xl overflow-hidden
shadow-sm border border-brand-grey-200/50
الصورة: aspect-[4/3]
المحتوى: p-3
السعر: mt-3 pt-2 border-t
زر الإضافة: w-12 h-12 rounded-xl bg-sky-500`}</CodeBlock>
              </SubSection>

              {/* Tool Card */}
              <SubSection title="بطاقة الأداة (3-col)">
                <PreviewBox label="مباشر" className="items-start justify-start">
                  <div className="w-[105px] bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50">
                    <div className="w-full aspect-square bg-brand-grey-50 flex items-center justify-center relative">
                      <div className="w-8 h-8 rounded-lg bg-brand-grey-200/60 flex items-center justify-center">
                        <Box className="w-4 h-4 text-brand-grey-400" />
                      </div>
                      <span className="absolute top-1 right-1 text-[11px] font-semibold px-1.5 py-px rounded bg-teal-50 text-teal-900 border border-teal-200/60">طبي</span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[12px] font-bold text-navy-800 leading-tight line-clamp-2 mb-1">سماعة طبية</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-extrabold text-navy-800 sl-num">45 ج.م</span>
                        <button data-tap="44" aria-label="زيادة" className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center tap-44">
                          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </PreviewBox>
              </SubSection>

              {/* Skeleton Card */}
              <SubSection title="بطاقة الـ Skeleton">
                <PreviewBox label="مباشر" className="items-start justify-start">
                  <div className="w-[155px] bg-white rounded-2xl p-3 shadow-sm">
                    <div className="w-full h-[90px] rounded-xl bg-brand-grey-200 animate-pulse mb-2.5" />
                    <div className="h-2.5 w-3/4 bg-brand-grey-200 rounded animate-pulse mb-2" />
                    <div className="h-2 w-1/2 bg-brand-grey-100 rounded animate-pulse" />
                  </div>
                </PreviewBox>
              </SubSection>
            </Section>

            {/* ═══════════════════════════════════════════════════
                8. BADGES & PILLS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-badges"
              number="08"
              title="الشارات والأقراص"
              icon={<Tag className="w-4.5 h-4.5" />}
            >
              {/* Badge types */}
              <SubSection title="أنواع الشارات">
                <PreviewBox label="مباشر">
                  <div className="flex flex-col items-start gap-4">
                    {/* Subject Badge */}
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-navy-800/80 text-white backdrop-blur-sm">تشريح</span>
                      <span className="text-[12px] text-brand-grey-500">badge المادة</span>
                    </div>
                    {/* Category Badges */}
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200/60">أدوات طبية</span>
                      <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60">أدوات مكتبية</span>
                      <span className="text-[12px] text-brand-grey-500">badge القسم</span>
                    </div>
                    {/* Discount Badge */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold sl-num bg-[#B4122E] text-white px-1.5 py-px rounded">-20%</span>
                      <span className="text-[12px] text-brand-grey-500">badge الخصم</span>
                    </div>
                    {/* Bundle Badge */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-navy-800 text-white inline-flex items-center gap-0.5">
                        <Layers className="w-2.5 h-2.5" />
                        Bundle
                      </span>
                      <span className="text-[12px] text-brand-grey-500">badge الـ Bundle</span>
                    </div>
                    {/* New Badge */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500 text-white">جديد</span>
                      <span className="text-[12px] text-brand-grey-500">badge الجديد</span>
                    </div>
                    {/* Cart Badge */}
                    <div className="flex items-center gap-3">
                      <span className="relative inline-flex">
                        <ShoppingBag className="w-5 h-5 text-navy-800" />
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-sky-500 text-white text-[12px] font-bold sl-num px-1 rounded-full shadow-sm shadow-sky-500/30 flex items-center justify-center">3</span>
                      </span>
                      <span className="text-[12px] text-brand-grey-500">Cart Count Badge</span>
                    </div>
                  </div>
                </PreviewBox>
              </SubSection>
            </Section>

            {/* ═══════════════════════════════════════════════════
                9. FILTERS & TABS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-filters"
              number="09"
              title="الفلاتر والتبويبات"
              icon={<Grid3X3 className="w-4.5 h-4.5" />}
            >
              {/* Filter Pills */}
              <SubSection title="فلاتر الأقسام (Pills)">
                <PreviewBox label="مباشر">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-navy-800 text-white shadow-sm rounded-full px-3.5 py-1.5 text-[12px] font-semibold">الكل</span>
                    <span className="bg-brand-grey-100 text-brand-grey-500 rounded-full px-3.5 py-1.5 text-[12px] font-semibold">تشريح</span>
                    <span className="bg-brand-grey-100 text-brand-grey-500 rounded-full px-3.5 py-1.5 text-[12px] font-semibold">فسيولوجي</span>
                    <span className="bg-brand-grey-100 text-brand-grey-500 rounded-full px-3.5 py-1.5 text-[12px] font-semibold">باتولوجي</span>
                  </div>
                </PreviewBox>
              </SubSection>

              {/* Subject Chips */}
              <SubSection title="Subject Chips (المكتبة)">
                <PreviewBox label="مباشر">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-navy-800 text-white border-navy-800 rounded-xl px-3.5 py-1.5 text-[12px]">تشريح</span>
                    <span className="bg-white border border-brand-grey-200/60 rounded-xl px-3.5 py-1.5 text-[12px] text-navy-800">فسيولوجي</span>
                    <span className="bg-white border border-brand-grey-200/60 rounded-xl px-3.5 py-1.5 text-[12px] text-navy-800">باتولوجي</span>
                  </div>
                </PreviewBox>
              </SubSection>

              {/* FAQ Tabs */}
              <SubSection title="FAQ Tabs">
                <PreviewBox label="مباشر">
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-500 text-white rounded-full px-3.5 py-1.5 text-[12px] font-semibold">الأكثر شيوعاً</span>
                    <span className="bg-brand-grey-100 text-brand-grey-500 rounded-full px-3.5 py-1.5 text-[12px] font-semibold">الطلبات</span>
                    <span className="bg-brand-grey-100 text-brand-grey-500 rounded-full px-3.5 py-1.5 text-[12px] font-semibold">الدفع</span>
                  </div>
                </PreviewBox>
              </SubSection>

              {/* Bottom Nav */}
              <SubSection title="شريط التنقل السفلي">
                <PreviewBox label="مباشر" className="p-0 overflow-hidden">
                  <div className="w-full bg-white/95 backdrop-blur-md border-t border-brand-grey-200/60 px-2 pt-1.5 pb-2 flex items-center justify-around" style={{ boxShadow: '0 -1px 8px rgba(0,0,0,0.04)' }}>
                    {[
                      { icon: <Home className="w-[22px] h-[22px]" strokeWidth={2.5} />, label: 'الرئيسية', active: true },
                      { icon: <BookOpen className="w-[22px] h-[22px]" strokeWidth={2} />, label: 'المحاضرات', active: false },
                      { icon: <Users className="w-[22px] h-[22px]" strokeWidth={2} />, label: 'سفراء', active: false },
                      { icon: <User className="w-[22px] h-[22px]" strokeWidth={2} />, label: 'حسابي', active: false },
                    ].map((tab, i) => (
                      <div key={i} className="flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-3.5 relative">
                        {tab.active && (
                          <div className="absolute inset-0 bg-sky-50 rounded-2xl -z-10" />
                        )}
                        <div className={tab.active ? 'text-sky-500' : 'text-brand-grey-400'}>
                          {tab.icon}
                        </div>
                        <span className={`text-[12px] font-medium ${tab.active ? 'text-sky-500' : 'text-brand-grey-400'}`}>{tab.label}</span>
                      </div>
                    ))}
                    {/* Separator */}
                    <div className="w-px h-6 bg-brand-grey-200/60 mx-1" />
                    <div className="flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-3.5">
                      <Menu className="w-[22px] h-[22px] text-brand-grey-400" strokeWidth={2} />
                      <span className="text-[12px] font-medium text-brand-grey-400">المزيد</span>
                    </div>
                  </div>
                </PreviewBox>
              </SubSection>
            </Section>

            {/* ═══════════════════════════════════════════════════
                10. INPUTS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-inputs"
              number="10"
              title="حقول الإدخال"
              icon={<Hash className="w-4.5 h-4.5" />}
            >
              {/* Standard Input */}
              <SubSection title="الحقل القياسي">
                <PreviewBox label="مباشر" className="flex-col items-start gap-3">
                  <div className="w-full max-w-xs">
                    <label className="text-[12px] font-semibold text-brand-grey-700 mb-1.5 block">اسم العميل</label>
                    <input
                      type="text"
                      placeholder="أدخل اسمك"
                      className="w-full bg-white border border-brand-grey-200 rounded-xl px-3 h-12 text-[13px] text-brand-grey-900 sl-num placeholder:text-brand-grey-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-colors"
                      readOnly
                    />
                  </div>
                  <div className="w-full max-w-xs">
                    <label className="text-[12px] font-semibold text-brand-grey-700 mb-1.5 block">حقل مع أيقونة</label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey-400" />
                      <input
                        type="text"
                        placeholder="ابحث..."
                        className="w-full bg-brand-grey-50 border border-brand-grey-200/60 rounded-xl pr-10 pl-4 py-3 text-[13px] text-navy-900 placeholder:text-brand-grey-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-colors"
                        readOnly
                      />
                    </div>
                  </div>
                </PreviewBox>
              </SubSection>

              {/* OTP Input */}
              <SubSection title="حقل الـ OTP">
                <PreviewBox label="مباشر">
                  <div className="flex items-center gap-2" dir="ltr">
                    {['1', '2', '3', '4'].map(d => (
                      <input
                        key={d}
                        type="text"
                        value={d}
                        readOnly
                        className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-navy-800 text-navy-800 bg-white sl-num focus:outline-none"
                      />
                    ))}
                  </div>
                </PreviewBox>
              </SubSection>

              {/* Toggle */}
              <SubSection title="Toggle Switch">
                <PreviewBox label="مباشر">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-6 rounded-full bg-brand-grey-300 relative cursor-pointer">
                      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 right-0.5 shadow-sm" />
                    </div>
                    <span className="text-[13px] text-brand-grey-500">إيقاف</span>
                    <div className="w-11 h-6 rounded-full bg-sky-500 relative cursor-pointer">
                      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 shadow-sm" />
                    </div>
                    <span className="text-[13px] text-brand-grey-500">تشغيل</span>
                  </div>
                </PreviewBox>
              </SubSection>
            </Section>

            {/* ═══════════════════════════════════════════════════
                11. ANIMATIONS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-animations"
              number="11"
              title="نظام الحركة"
              icon={<Sparkles className="w-4.5 h-4.5" />}
              description="الحركات المعتمدة في التطبيق — Spring configs و CSS animations"
            >
              {/* Live Demos */}
              <SubSection title="معاينة حية">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Shimmer */}
                  <div className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm">
                    <p className="text-[12px] font-bold text-brand-grey-600 mb-3">Skeleton Shimmer — 1.5s</p>
                    <div className="w-full h-16 rounded-xl bg-brand-grey-200 animate-pulse" />
                  </div>
                  {/* Pulse */}
                  <div className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm">
                    <p className="text-[12px] font-bold text-brand-grey-600 mb-3">Delivery Pulse — 2s</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[13px] text-brand-grey-600">تم التسليم</span>
                    </div>
                  </div>
                  {/* Float */}
                  <div className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm">
                    <p className="text-[12px] font-bold text-brand-grey-600 mb-3">Float — 3s</p>
                    <div className="flex items-center justify-center h-16">
                      <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-200 flex items-center justify-center float-animation">
                        <Star className="w-5 h-5 text-sky-500" />
                      </div>
                    </div>
                  </div>
                  {/* CTA Shimmer */}
                  <div className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm">
                    <p className="text-[12px] font-bold text-brand-grey-600 mb-3">CTA Shimmer — 2.5s</p>
                    <div className="flex items-center justify-center h-16">
                      <div className="bg-sky-500 text-white font-bold text-[13px] px-6 py-3 rounded-xl relative overflow-hidden">
                        <span className="relative z-10">أضف للسلة</span>
                        <div className="absolute inset-0 cta-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              </SubSection>

              {/* Spring Configs Table */}
              <SubSection title="Spring Configs">
                <div className="overflow-x-auto rounded-xl border border-brand-grey-200/80 shadow-sm">
                  <table className="w-full text-[13px]">
                    <thead className="bg-navy-800">
                      <tr>
                        <th className="text-right px-4 py-3 font-semibold text-white/90 text-[12px]">Stiffness</th>
                        <th className="text-right px-4 py-3 font-semibold text-white/90 text-[12px]">Damping</th>
                        <th className="text-right px-4 py-3 font-semibold text-white/90 text-[12px]">الاستخدام</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { s: '300', d: '20', u: 'Bottom Nav، stagger items' },
                        { s: '350', d: '25', u: 'Active tab pill' },
                        { s: '400', d: '20', u: 'Quantity number' },
                        { s: '500', d: '30', u: 'Price animations' },
                        { s: '400', d: '15', u: 'Cart badge، color circle' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-brand-grey-100 last:border-b-0 hover:bg-sky-50/40 transition-colors">
                          <td className="px-4 py-2.5 text-navy-800 font-mono sl-num">{row.s}</td>
                          <td className="px-4 py-2.5 text-navy-800 font-mono sl-num">{row.d}</td>
                          <td className="px-4 py-2.5 text-brand-grey-600">{row.u}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SubSection>

              {/* WhileTap Scale */}
              <SubSection title="whileTap Scale">
                <PreviewBox label="اضغط على العناصر">
                  {[
                    { scale: '0.85', label: '0.85', desc: 'أزرار صغيرة' },
                    { scale: '0.90', label: '0.90', desc: 'Tabs, Header' },
                    { scale: '0.95', label: '0.95', desc: 'معظم الأزرار' },
                    { scale: '0.97', label: '0.97', desc: 'Product Detail' },
                    { scale: '0.98', label: '0.98', desc: 'CTA Buttons' },
                  ].map(item => (
                    <motion.button data-tap="44"
                      key={item.scale}
                      whileTap={{ scale: parseFloat(item.scale) }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brand-grey-100 border border-brand-grey-200/60 flex items-center justify-center">
                        <span className="text-[12px] font-mono text-navy-800 sl-num">{item.label}</span>
                      </div>
                      <span className="text-[11px] text-brand-grey-400">{item.desc}</span>
                    </motion.button>
                  ))}
                </PreviewBox>
              </SubSection>
            </Section>

            {/* ═══════════════════════════════════════════════════
                12. DESIGN PATTERNS
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-patterns"
              number="12"
              title="أنماط التصميم"
              icon={<Smartphone className="w-4.5 h-4.5" />}
              description="أنماط التصميم المعمارية والهيكلية للتطبيق"
            >
              {/* Bottom Sheet Anatomy */}
              <SubSection title="هيكل الـ Bottom Sheet">
                <div className="bg-white rounded-2xl border border-brand-grey-200/60 overflow-hidden shadow-sm">
                  {/* Drag Handle */}
                  <div className="bg-brand-grey-50 border-b border-brand-grey-200/60 px-5 pt-2.5 pb-2 flex justify-center">
                    <div className="w-10 h-1 rounded-full bg-brand-grey-300" />
                  </div>
                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[15px] font-bold text-navy-800">تفاصيل المنتج</h4>
                      <button data-tap="44" aria-label="إغلاق" className="w-8 h-8 rounded-full bg-brand-grey-100 flex items-center justify-center tap-44">
                        <X className="w-4 h-4 text-brand-grey-600" />
                      </button>
                    </div>
                    {/* Image placeholder */}
                    <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50" />
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[20px] font-extrabold text-navy-800 sl-num">150.00 ج.م</p>
                        <p className="text-[12px] text-brand-grey-400 line-through sl-num">200.00 ج.م</p>
                      </div>
                      <button data-tap="44" className="bg-sky-500 text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-sm shadow-sky-500/25">
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                </div>
                <CodeBlock>{`fixed inset-0 z-50 bg-black/40          ← Backdrop
fixed bottom-0 left-0 right-0 z-[60]    ← Sheet
  └─ rounded-t-3xl bg-white
     └─ shadow-[0_-4px_30px_rgba(0,0,0,0.15)]
        └─ pt-2.5 pb-1  ← Drag Handle
        └─ px-4/px-5/px-6  ← Content padding
Spring: damping: 28-30, stiffness: 300`}</CodeBlock>
              </SubSection>

              {/* Empty States */}
              <SubSection title="Empty States">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <ShoppingBag className="w-16 h-16 text-brand-grey-400" />, title: 'السلة فاضية', desc: 'ابدأ بإضافة محاضرات وأدوات لسلتك', bg: 'bg-white' },
                    { icon: <Heart className="w-9 h-9 text-brand-grey-400" />, title: 'لا توجد مفضلات', desc: 'المحاضرات اللي هتعجبك هتظهر هنا', bg: 'bg-white', iconWrap: true },
                    { icon: <Package className="w-7 h-7 text-brand-grey-400" />, title: 'لا توجد طلبات', desc: 'طلباتك هتظهر هنا', bg: 'bg-white', iconWrap: 'rounded-2xl' },
                    { icon: <Search className="w-8 h-8 text-brand-grey-400" />, title: 'لا توجد نتائج', desc: 'جرب كلمات بحث مختلفة', bg: 'bg-white', iconWrap: 'rounded-2xl' },
                  ].map((state, i) => (
                    <div key={i} className={`${state.bg} rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm flex flex-col items-center text-center gap-3`}>
                      {state.iconWrap === true ? (
                        <div className="w-20 h-20 rounded-full bg-brand-grey-100 flex items-center justify-center">{state.icon}</div>
                      ) : state.iconWrap === 'rounded-2xl' ? (
                        <div className="w-14 h-14 rounded-2xl bg-brand-grey-100 flex items-center justify-center">{state.icon}</div>
                      ) : (
                        state.icon
                      )}
                      <div>
                        <p className="text-[13px] font-bold text-navy-800 mb-1">{state.title}</p>
                        <p className="text-[12px] text-brand-grey-500">{state.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SubSection>

              {/* Chat Bubbles */}
              <SubSection title="فقاعات الدردشة">
                <PreviewBox label="مباشر" className="flex-col items-end gap-3">
                  <div className="max-w-[75%]">
                    <div className="rounded-2xl rounded-bl-md bg-sky-500 text-white px-4 py-3 text-[13px] leading-relaxed">
                      عايز أسأل عن محاضرات التشريح
                    </div>
                    <p className="text-[12px] text-brand-grey-400 mt-1 mr-1">9:30 م</p>
                  </div>
                  <div className="max-w-[75%] self-start">
                    <div className="rounded-2xl rounded-br-md bg-white px-4 py-3 text-[13px] leading-relaxed shadow-sm border border-brand-grey-200/50">
                      أهلاً بيك! محاضرات التشريح متوفرة في مكتبة هارفرد وبرلين. تقدر توصل ليها من الشاشة الرئيسية 👍
                    </div>
                    <p className="text-[12px] text-brand-grey-400 mt-1 ml-1">9:30 م • StudyLink Bot</p>
                  </div>
                  <div className="self-start flex items-center gap-1 px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </PreviewBox>
              </SubSection>

              {/* Phone Frame Specs */}
              <SubSection title="مواصفات الـ Phone Frame">
                <div className="bg-navy-900 rounded-2xl p-6 text-white">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'الأبعاد', value: '375×812px' },
                      { label: 'الجهاز', value: 'iPhone 15 Pro' },
                      { label: 'Border Radius', value: '52px' },
                      { label: 'الحد', value: '8px solid' },
                      { label: 'Dynamic Island', value: '120×36px' },
                      { label: 'Home Indicator', value: '140×4px' },
                      { label: 'الخلفية', value: '#F2EEE3' },
                      { label: 'الاتجاه', value: 'RTL' },
                    ].map(spec => (
                      <div key={spec.label}>
                        <p className="text-[12px] text-white/40 uppercase">{spec.label}</p>
                        <p className="text-[14px] font-bold sl-num mt-0.5">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </SubSection>

              {/* Z-Index */}
              <SubSection title="Z-Index Hierarchy">
                <div className="bg-white rounded-2xl border border-brand-grey-200/60 p-5 shadow-sm space-y-2">
                  {[
                    { z: 'z-10', label: 'المحتوى العادي، البطاقات، Badges', color: 'bg-brand-grey-100' },
                    { z: 'z-20', label: 'Grade Gate Overlay، Sticky Headers', color: 'bg-brand-grey-200' },
                    { z: 'z-30', label: 'Sticky Headers ثانوية، Player Bottom Bar', color: 'bg-sky-100' },
                    { z: 'z-40', label: 'Bottom Nav Bar، Product Detail Backdrop', color: 'bg-sky-200' },
                    { z: 'z-50', label: 'Backdrop لكل Modals/Sheets', color: 'bg-sky-300' },
                    { z: 'z-[60]', label: 'Bottom Sheets (Variants, More, Profile)', color: 'bg-sky-400' },
                    { z: 'z-[100]', label: 'Splash Screen، Toasts', color: 'bg-sky-500' },
                  ].map(item => (
                    <div key={item.z} className="flex items-center gap-3">
                      <code className="text-[12px] font-mono bg-navy-800 text-sky-300 px-2 py-1 rounded min-w-[52px] text-center sl-num">{item.z}</code>
                      <div className={`flex-1 h-5 rounded ${item.color}`} />
                      <span className="text-[12px] text-brand-grey-500 hidden sm:block max-w-[200px]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </SubSection>
            </Section>

            {/* ═══════════════════════════════════════════════════
                13. GENERAL RULES
            ═══════════════════════════════════════════════════ */}
            <Section
              id="sec-rules"
              number="13"
              title="القواعد العامة"
              icon={<ShieldCheck className="w-4.5 h-4.5" />}
              description="قواعد لازم تتبعها وممنوع تتجاوزها أبداً"
            >
              {/* Don'ts */}
              <SubSection title="ممنوع ❌">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'استخدام Indigo/Blue كألوان',
                    'فتح Bottom Sheet فوق Bottom Sheet',
                    'استخدام Toast/Modal كـ feedback في الـ Product Detail',
                    'استخدام h-full في الـ DarkModeWrapper (استخدم min-h-full)',
                    'أزرار أقل من 32×32px بدون active:scale feedback',
                    'استخدام أي مكتبة أيقونات غير Lucide',
                    'الـ centered modals — استخدم Bottom Sheet دائمًا',
                  ].map(rule => (
                    <div key={rule} className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/60 border border-red-100/60">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[13px] text-red-800/80 leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              {/* Musts */}
              <SubSection title="لازم ✅">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'كل الأرقام والأسعار بـ sl-num',
                    'كل الشاشات dir="rtl"',
                    'كل الـ Bottom Sheets لازم يكون فيها Drag Handle و Backdrop',
                    'كل الأزرار التفاعلية لازم يكون فيها whileTap أو active:scale',
                    'كل الـ CTA buttons ارتفاعها h-12 (48px)',
                    'الـ Footer لازم يكون sticky للأسفل',
                    'الحد الأدنى للعناصر التفاعلية: 48×48px',
                    'كل الـ Backdrops لازم تستخدم bg-black/30 أو /40 أو /50',
                  ].map(rule => (
                    <div key={rule} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-[13px] text-emerald-800/80 leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              {/* Tech Stack */}
              <SubSection title="التقنيات المستخدمة">
                <div className="flex flex-wrap gap-2">
                  {[
                    'Next.js 16', 'TypeScript 5', 'Tailwind CSS 4', 'Framer Motion',
                    'shadcn/ui', 'Lucide React', 'Zustand', 'Prisma (SQLite)',
                    'StudyLink Arabic + Mono', '375×812px', 'Arabic RTL', 'WCAG AA+',
                  ].map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-navy-800/5 text-navy-800 rounded-lg text-[12px] font-semibold border border-navy-800/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </SubSection>
            </Section>

          </main>
        </div>
      </div>

      {/* ══════ FOOTER ══════ */}
      <footer className="bg-navy-900 mt-16 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-sky-500/5 rounded-full blur-[100px] -z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top section with logo and description */}
          <div className="flex flex-col items-center text-center pt-12 pb-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-white leading-none">Study<span className="text-sky-400">Link</span></p>
                <p className="text-[12px] text-sky-300/60 font-medium">Design System v1.0</p>
              </div>
            </div>
            <p className="text-[13px] text-white/40 max-w-md leading-relaxed">
              دليل تصميم شامل لـ StudyLink — مبنى على مبادئ Nielsen و Fitts's Law و Gestalt.
              <br />كل قاعدة موثّقة بأمثلة حقيقية من التطبيق.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 py-8 border-b border-white/[0.06]">
            {[
              { value: '30+', label: 'شاشة مُصممة' },
              { value: '12', label: 'قاعدة تصميم' },
              { value: 'AAA', label: 'معيار الوصول' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-[20px] font-extrabold text-white sl-num">{stat.value}</p>
                <p className="text-[12px] text-white/30 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tech stack badges */}
          <div className="py-6 border-b border-white/[0.06]">
            <p className="text-[12px] font-bold text-white/20 uppercase mb-3 text-center">Built With</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Next.js 16', 'TypeScript 5', 'Tailwind CSS 4', 'Framer Motion', 'shadcn/ui', 'Lucide Icons', 'Zustand', 'Prisma'].map(tech => (
                <span key={tech} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[12px] text-white/40 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="py-6 text-center">
            <p className="text-[12px] text-white/20">
              © 2025 StudyLink — سوقك الأكاديمي. جميع القواعد مُوثّقة ومُطبّقة.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <motion.button data-tap="44" aria-label="لأعلى"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-navy-800 text-white shadow-lg shadow-navy-800/20 flex items-center justify-center hover:bg-navy-900 transition-colors tap-44"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>
    </div>
  )
}