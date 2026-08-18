'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Award, ChevronDown, ChevronLeft, Check, Camera, Phone, Building2, GraduationCap, Save, X, Package, MapPin, Heart, Bell, HelpCircle, MessageCircle, Info, Star, Trophy, LogOut, UserPlus, Sparkles, ShoppingBag, Users, Globe, Pencil, History, FileText, TrendingUp } from 'lucide-react'
import { ALL_GRADES, type GradeType } from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'
import BottomNavBar from '../BottomNavBar'
import ToggleSwitch from '../ToggleSwitch'
import CartHeaderButton from '../CartHeaderButton'

interface ProfileScreenProps {
  onNavigate?: (screen: string) => void
  showProfileWarning?: boolean
}

const colleges = [
  'كلية الطب', 'كلية طب الأسنان', 'كلية الصيدلة',
  'كلية الهندسة', 'كلية الحقوق', 'كلية التجارة',
  'كلية الآداب', 'كلية العلوم',
]

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' as const },
  }),
}


export default function ProfileScreen({ onNavigate, showProfileWarning }: ProfileScreenProps) {
  const user = useStudylinkStore(s => s.user)
  const logout = useStudylinkStore(s => s.logout)
  const orders = useStudylinkStore(s => s.orders)
  const cart = useStudylinkStore(s => s.cart)
  const selectedGrade = useStudylinkStore(s => s.selectedGrade)
  const setSelectedGrade = useStudylinkStore(s => s.setSelectedGrade)

  const [showCollegeSheet, setShowCollegeSheet] = useState(false)
  const [showGradeSheet, setShowGradeSheet] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // ── Guest State ──
  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto phone-scroll bg-brand-grey-100 pb-4">
          <div className="flex items-center justify-between px-4 pt-9 pb-4">
            <div className="w-9" />
            <h1 className="text-[15px] font-bold text-navy-900">حسابي</h1>
            <CartHeaderButton onNavigate={onNavigate} size="sm" />
          </div>

          <div className="flex flex-col items-center justify-center px-6 pt-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-navy-800 to-sky-900 flex items-center justify-center mb-5 shadow-xl shadow-navy-800/20"
            >
              <span className="text-4xl">👋</span>
            </motion.div>

            <h2 className="text-[17px] font-bold text-navy-900 mb-1.5">مرحباً بيك!</h2>
            <p className="text-[13px] text-brand-grey-500 text-center leading-relaxed mb-6 max-w-[250px]">
              سجّل حسابك عشان تقدر تعمل أوردر وتتابعه وتبقي جزء من مجتمع StudyLink
            </p>

            <button data-tap="44"
              onClick={() => onNavigate?.('register')}
              className="w-full max-w-[260px] flex items-center justify-center gap-2 bg-navy-800 text-white text-[14px] font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-transform shadow-lg shadow-navy-800/20 mb-3"
            >
              <UserPlus className="w-4.5 h-4.5" />
              سجّل حساب جديد
            </button>

            <p className="text-[12px] text-brand-grey-400 mb-8">
              التسجيل بيساعدك تعمل أوردر وتتابعه
            </p>

            {/* Quick stats without account */}
            <div className="w-full max-w-[300px] grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-brand-grey-100">
                <ShoppingBag className="w-5 h-5 text-sky-500 mx-auto mb-1" />
                <p className="text-[12px] text-brand-grey-400">السلة</p>
                <p className="text-[16px] font-bold text-navy-800 sl-num">{cart.length}</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-brand-grey-100">
                <Package className="w-5 h-5 text-brand-grey-400 mx-auto mb-1" />
                <p className="text-[12px] text-brand-grey-400">طلباتي</p>
                <p className="text-[16px] font-bold text-brand-grey-400 sl-num">—</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-brand-grey-100">
                <Heart className="w-5 h-5 text-brand-grey-400 mx-auto mb-1" />
                <p className="text-[12px] text-brand-grey-400">المفضلة</p>
                <p className="text-[16px] font-bold text-brand-grey-400 sl-num">—</p>
              </div>
            </div>

            {/* Services without account */}
            <div className="w-full max-w-[300px] mt-6 bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-[13px] font-bold text-navy-800 mb-2">خدمات أخرى</h3>
              {[
                { icon: HelpCircle, label: 'الأسئلة الشائعة', screen: 'faq' },
                { icon: MessageCircle, label: 'الدعم والمساعدة', screen: 'chat' },
                { icon: Info, label: 'عن StudyLink', screen: 'about' },
                { icon: Star, label: 'تقييم التطبيق', screen: 'rate' },
              ].map((item, idx, arr) => (
                <button data-tap="44" aria-label="رجوع"
                  key={item.screen}
                  onClick={() => onNavigate?.(item.screen)}
                  className={`flex items-center justify-between py-3 active:scale-[0.98] transition-transform w-full text-right ${
                    idx < arr.length - 1 ? 'border-b border-brand-grey-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-brand-grey-500" />
                    <span className="text-[13px] text-navy-800">{item.label}</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-brand-grey-400 rotate-180" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <BottomNavBar activeTab="profile" onNavigate={onNavigate} showProfileWarning={showProfileWarning} />
      </div>
    )
  }

  // ── Logged-in State ──
  const menuItems = [
    { icon: Package, label: 'طلباتي', screen: 'my-orders', badge: orders.length > 0 ? `${orders.length}` : undefined },
    { icon: MapPin, label: 'تتبع الطلب', screen: 'tracking' },
    { icon: Heart, label: 'المفضلة', screen: 'wishlist' },
    { icon: Bell, label: 'الإشعارات', screen: 'notifications' },
    { icon: History, label: 'سجل المشتريات', screen: 'purchase-history' },
    { icon: HelpCircle, label: 'الأسئلة الشائعة', screen: 'faq' },
    { icon: MessageCircle, label: 'الدعم والمساعدة', screen: 'chat' },
    { icon: Info, label: 'عن StudyLink', screen: 'about' },
    { icon: Star, label: 'تقييم التطبيق', screen: 'rate' },
    { icon: Trophy, label: 'الإنجازات', screen: 'achievements' },
    { icon: FileText, label: 'الشروط والأحكام', screen: 'terms' },
  ]

  const statsCards = [
    {
      label: 'طلباتي',
      value: `${orders.length}`,
      trend: '+2 هذا الأسبوع',
      trendColor: 'text-emerald-600',
      icon: Package,
      bgFrom: 'from-sky-50',
      bgTo: 'to-white',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      screen: 'my-orders',
    },
    {
      label: 'المحفظة',
      value: '160 ج.م',
      trend: '+50 هذا الشهر',
      trendColor: 'text-emerald-600',
      icon: Wallet,
      bgFrom: 'from-emerald-50',
      bgTo: 'to-white',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      screen: 'wallet',
    },
    {
      label: 'النقاط',
      value: '340 نقطة',
      trend: '+85 هذا الشهر',
      trendColor: 'text-emerald-600',
      icon: Star,
      bgFrom: 'from-amber-50',
      bgTo: 'to-white',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      screen: 'achievements',
    },
    {
      label: 'الإحالات',
      value: '5 إحالة',
      trend: '↑ 12%',
      trendColor: 'text-violet-600',
      icon: Users,
      bgFrom: 'from-violet-50',
      bgTo: 'to-white',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      screen: 'ambassador',
    },
  ]

  const achievements = [
    { emoji: '🎉', label: 'أول طلب', gradient: 'from-sky-100 to-sky-50' },
    { emoji: '⭐', label: 'عميل ذهبي', gradient: 'from-amber-100 to-amber-50' },
    { emoji: '🌟', label: 'سفير', gradient: 'from-violet-100 to-violet-50' },
  ]

  return (
    <div className="screen-enter flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto phone-scroll bg-brand-grey-100 pb-4">

        {/* ===== Enhanced Profile Header ===== */}
        <div className="relative">
          {/* Gradient background strip */}
          <div className="h-24 bg-gradient-to-l from-navy-800 to-sky-900 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />
            {/* Header bar */}
            <div className="relative z-10 flex items-center justify-between px-4 pt-3">
              <div className="w-8" />
              <h1 className="text-[15px] font-bold text-white">حسابي</h1>
              <CartHeaderButton onNavigate={onNavigate} size="sm" light />
            </div>
          </div>

          {/* Avatar overlapping gradient */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col items-center -mt-10 relative z-10"
          >
            <div className="relative mb-3">
              <div className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25 overflow-hidden border-[3px] border-white">
                <span className="text-[32px]">👨‍⚕️</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center border-2 border-white">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>

            <h2 className="text-[18px] font-bold text-navy-900 mb-0.5">{user.name}</h2>
            <p className="text-[13px] text-brand-grey-500 sl-num mb-2" dir="ltr">{user.phone}</p>

            <div className="flex items-center gap-2 mb-3">
              {user.grade && (
                <span className="text-[12px] font-semibold bg-brand-grey-100 text-brand-grey-700 px-2.5 py-1 rounded-lg">
                  {user.grade}
                </span>
              )}
              {user.college && (
                <span className="text-[12px] font-semibold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-lg">
                  {user.college}
                </span>
              )}
            </div>

            {/* Edit Profile button */}
            <button data-tap="44"
              onClick={() => onNavigate?.('edit-profile')}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-sky-600 bg-sky-50 px-4 py-2 rounded-xl active:scale-[0.97] transition-transform"
            >
              <Pencil className="w-3.5 h-3.5" />
              تعديل الحساب
            </button>
          </motion.div>
        </div>

        {/* ===== Stats Dashboard Cards ===== */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-4 mt-5 grid grid-cols-2 gap-3"
        >
          {statsCards.map((stat, idx) => (
            <motion.button data-tap="44"
              key={stat.label}
              custom={idx}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.(stat.screen)}
              className={`relative bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} rounded-2xl p-3.5 text-right shadow-sm border border-brand-grey-200/40 overflow-hidden`}
            >
              {/* Decorative circle */}
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/60 blur-sm pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <stat.icon className={`w-4.5 h-4.5 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-[12px] font-semibold ${stat.trendColor} flex items-center gap-0.5`}>
                    <TrendingUp className="w-2.5 h-2.5" />
                    {stat.trend}
                  </span>
                </div>
                <p className="text-[17px] font-bold text-navy-800 sl-num leading-tight">{stat.value}</p>
                <p className="text-[12px] text-brand-grey-500 mt-0.5">{stat.label}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* ===== Quick Settings Section ===== */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-brand-grey-200/40 overflow-hidden"
        >
          <div className="px-4 pt-4 pb-1">
            <h3 className="text-[13px] font-bold text-navy-800">الإعدادات السريعة</h3>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-brand-grey-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                <Bell className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div>
                <p className="text-[13px] text-navy-800 font-medium">الإشعارات</p>
                <p className="text-[12px] text-brand-grey-400">تلقي تنبيهات الطلبات</p>
              </div>
            </div>
            <ToggleSwitch enabled={notificationsEnabled} onToggle={() => setNotificationsEnabled(!notificationsEnabled)} label="إشعارات الطلبات والعروض" />
          </div>

          {/* Language */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Globe className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[13px] text-navy-800 font-medium">اللغة</p>
                <p className="text-[12px] text-brand-grey-400">العربية</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-brand-grey-400 rotate-180" />
          </div>
        </motion.div>

        {/* ===== Achievements Preview ===== */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-4 mt-4"
        >
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-[13px] font-bold text-navy-800">إنجازاتي</h3>
            <button data-tap="44" onClick={() => onNavigate?.('achievements')} className="text-[12px] text-sky-600 font-semibold">
              عرض الكل
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto phone-scroll pb-1">
            {achievements.map((badge, idx) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.08 }}
                className={`flex-shrink-0 w-[100px] bg-gradient-to-br ${badge.gradient} rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 border border-brand-grey-200/30 shadow-sm`}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <span className="text-[12px] font-semibold text-navy-800 text-center leading-tight">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== Academic Data ===== */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-brand-grey-200/40 overflow-hidden"
        >
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-[13px] font-bold text-navy-800">البيانات الأكاديمية</h3>
          </div>

          <div className="px-4 py-3 border-b border-brand-grey-100">
            <label className="text-[12px] text-brand-grey-500 block mb-1.5">رقم الهاتف</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2.5 bg-brand-grey-50 rounded-xl px-3.5 py-2.5">
                <Phone className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-[13px] text-navy-800 sl-num font-medium" dir="ltr">{user.phone}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-success" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-brand-grey-100">
            <label className="text-[12px] text-brand-grey-500 block mb-1.5">الكلية</label>
            <button data-tap="44" aria-label="توسيع"
              onClick={() => setShowCollegeSheet(true)}
              className="w-full flex items-center justify-between bg-brand-grey-50 rounded-xl px-3.5 py-2.5 active:bg-brand-grey-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span className={`text-[13px] ${user.college ? 'text-navy-800 font-medium' : 'text-brand-grey-400'}`}>
                  {user.college || 'اختر الكلية'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-grey-400" />
            </button>
          </div>

          <div className="px-4 py-3">
            <label className="text-[12px] text-brand-grey-500 block mb-1.5">الفرقة / السنة</label>
            <button data-tap="44" aria-label="توسيع"
              onClick={() => setShowGradeSheet(true)}
              className="w-full flex items-center justify-between bg-brand-grey-50 rounded-xl px-3.5 py-2.5 active:bg-brand-grey-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span className={`text-[13px] ${selectedGrade ? 'text-navy-800 font-medium' : 'text-brand-grey-400'}`}>
                  {selectedGrade || 'اختر الفرقة'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-grey-400" />
            </button>
          </div>
        </motion.div>

        {/* ===== Services Menu ===== */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/40"
        >
          <h3 className="text-[13px] font-bold text-navy-800 mb-2">خدمات أخرى</h3>
          {menuItems.map((item, idx, arr) => (
            <button data-tap="44" aria-label="رجوع"
              key={item.screen}
              onClick={() => onNavigate?.(item.screen)}
              className={`flex items-center justify-between py-3 px-2 -mx-2 rounded-xl active:scale-[0.98] transition-all w-full text-right hover:bg-brand-grey-50 ${
                idx < arr.length - 1 ? 'mb-0.5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-grey-50 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-brand-grey-500" />
                </div>
                <span className="text-[13px] text-navy-800 font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[12px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg">{item.badge}</span>
                )}
                <ChevronLeft className="w-4 h-4 text-brand-grey-400 rotate-180" />
              </div>
            </button>
          ))}
        </motion.div>

        <div className="h-16" />
      </div>

      {/* College Sheet */}
      <AnimatePresence>
        {showCollegeSheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowCollegeSheet(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[60vh] flex flex-col shadow-xl"
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-brand-grey-100">
                <div />
                <h3 className="text-[14px] font-bold text-navy-800">اختر الكلية</h3>
                <button data-tap="44" aria-label="إغلاق" onClick={() => setShowCollegeSheet(false)} className="w-8 h-8 rounded-full bg-brand-grey-100 flex items-center justify-center tap-44">
                  <X className="w-4 h-4 text-brand-grey-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto phone-scroll">
                {colleges.map((college) => (
                  <button data-tap="44"
                    key={college}
                    onClick={() => setShowCollegeSheet(false)}
                    className="w-full text-right px-4 py-3 text-[13px] text-navy-800 hover:bg-brand-grey-50 border-b border-brand-grey-50"
                  >
                    {college}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Grade Sheet */}
      <AnimatePresence>
        {showGradeSheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowGradeSheet(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[60vh] flex flex-col shadow-xl"
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-brand-grey-100">
                <div />
                <h3 className="text-[14px] font-bold text-navy-800">اختر الفرقة</h3>
                <button data-tap="44" aria-label="إغلاق" onClick={() => setShowGradeSheet(false)} className="w-8 h-8 rounded-full bg-brand-grey-100 flex items-center justify-center tap-44">
                  <X className="w-4 h-4 text-brand-grey-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto phone-scroll">
                {ALL_GRADES.map((grade) => (
                  <button data-tap="44" aria-label="تأكيد"
                    key={grade}
                    onClick={() => { setSelectedGrade(grade); setShowGradeSheet(false) }}
                    className={`w-full text-right px-4 py-3 text-[13px] transition-colors border-b border-brand-grey-50 ${
                      selectedGrade === grade ? 'text-sky-500 bg-sky-50 font-semibold' : 'text-navy-800 hover:bg-brand-grey-50'
                    }`}
                  >
                    {selectedGrade === grade && <Check className="w-4 h-4 text-sky-500 inline-block ml-2" />}
                    {grade}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNavBar activeTab="profile" onNavigate={onNavigate} showProfileWarning={showProfileWarning} />
    </div>
  )
}