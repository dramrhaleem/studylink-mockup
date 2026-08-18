'use client'

import { asset } from '@/lib/asset'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  RotateCcw,
  Palette,
  Type,
  LayoutGrid,
  Square,
  Layers,
  MousePointerClick,
  CreditCard,
  Tag,
  Grid3X3,
  Hash,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Moon,
  Sun,
} from 'lucide-react'
import {
  useStudylinkStore,
  hydrateStudylinkStore,
  resetStudylinkStore,
} from '@/lib/use-studylink-store'
import Image from 'next/image'
import PhoneFrame from '@/components/studylink/PhoneFrame'
import HomeScreen from '@/components/studylink/screens/HomeScreen'
import LecturesScreen from '@/components/studylink/screens/LecturesScreen'
import AmbassadorScreen from '@/components/studylink/screens/AmbassadorScreen'
import ToolsScreen from '@/components/studylink/screens/ToolsScreen'
import WalletScreen from '@/components/studylink/screens/WalletScreen'
import ProfileScreen from '@/components/studylink/screens/ProfileScreen'
import CartScreen from '@/components/studylink/screens/CartScreen'
import CheckoutScreen from '@/components/studylink/screens/CheckoutScreen'
import OrderSuccessScreen from '@/components/studylink/screens/OrderSuccessScreen'
import SearchScreen from '@/components/studylink/screens/SearchScreen'
import BundleScreen from '@/components/studylink/screens/BundleScreen'
import TrackingScreen from '@/components/studylink/screens/TrackingScreen'
import MyOrdersScreen from '@/components/studylink/screens/MyOrdersScreen'
import WishlistScreen from '@/components/studylink/screens/WishlistScreen'
import NotificationsScreen from '@/components/studylink/screens/NotificationsScreen'
import ChatSupportScreen from '@/components/studylink/screens/ChatSupportScreen'
import FAQScreen from '@/components/studylink/screens/FAQScreen'
import AboutScreen from '@/components/studylink/screens/AboutScreen'
import RateAppScreen from '@/components/studylink/screens/RateAppScreen'
import AchievementsScreen from '@/components/studylink/screens/AchievementsScreen'
import OTPScreen from '@/components/studylink/screens/OTPScreen'
import OnboardingScreen from '@/components/studylink/screens/OnboardingScreen'
import RegisterScreen from '@/components/studylink/screens/RegisterScreen'
import LibraryScreen from '@/components/studylink/screens/LibraryScreen'
import LibraryCategoryScreen from '@/components/studylink/screens/LibraryCategoryScreen'
import MoreScreen from '@/components/studylink/screens/MoreScreen'
import GiftScreen from '@/components/studylink/screens/GiftScreen'
import SplashScreen from '@/components/studylink/SplashScreen'
import DesignSystemShowcase from '@/components/studylink/DesignSystemShowcase'

/* ─── Design System Section Pills ─── */
const dsSections = [
  { id: 'sec-colors', label: 'الألوان', icon: Palette },
  { id: 'sec-typography', label: 'الخطوط', icon: Type },
  { id: 'sec-spacing', label: 'المسافات', icon: LayoutGrid },
  { id: 'sec-radius', label: 'الزوايا', icon: Square },
  { id: 'sec-shadows', label: 'الظلال', icon: Layers },
  { id: 'sec-buttons', label: 'الأزرار', icon: MousePointerClick },
  { id: 'sec-cards', label: 'البطاقات', icon: CreditCard },
  { id: 'sec-badges', label: 'الشارات', icon: Tag },
  { id: 'sec-filters', label: 'الفلاتر', icon: Grid3X3 },
  { id: 'sec-inputs', label: 'الإدخال', icon: Hash },
  { id: 'sec-animations', label: 'الحركة', icon: Sparkles },
  { id: 'sec-patterns', label: 'أنماط', icon: Smartphone },
  { id: 'sec-rules', label: 'القواعد', icon: ShieldCheck },
]

/* ─── Main Component ─── */

/** الشاشات الرئيسية التي تبقى مركّبة دائمًا للحفاظ على موضع التمرير. */
const MAIN_SCREENS = ['home', 'lectures', 'ambassador', 'profile'] as const
type MainScreen = (typeof MAIN_SCREENS)[number]

const NAV_TAB_IDS = ['home', 'lectures', 'ambassador', 'gifts', 'profile', 'more'] as const

export default function StudyLinkDesignPage() {
  const [activeScreen, setActiveScreen] = useState<string>('home')
  const [activeDsSection, setActiveDsSection] = useState('')
  /* الترطيب: الخادم يرسم دائمًا الحالة الابتدائية. أي شيء يعتمد على
     localStorage ينتظر هذه الراية، وإلا اختلف رسم الخادم عن العميل. */
  const [mounted, setMounted] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const user = useStudylinkStore(s => s.user)

  /* كان `getInitialScreen()` يُستدعى أثناء الرسم وينفّذ `register()` داخل
     الستور — تأثير جانبي في مرحلة الرسم، وهو ما كان يفجّر تحذير React
     ويصنع اختلاف ترطيب. نُقل بالكامل إلى ما بعد التركيب. */
  useEffect(() => {
    hydrateStudylinkStore()
    setMounted(true)

    const screen = new URLSearchParams(window.location.search).get('screen')
    if (!screen) return

    const store = useStudylinkStore.getState()
    if (!store.user) {
      store.register({
        name: 'أحمد المنصور',
        phone: '01012345678',
        grade: 'الفرقة الأولى',
        college: 'كلية الطب',
      })
    }
    setActiveScreen(screen)
    setShowSplash(false)
  }, [])

  const navigate = useCallback((screen: string) => {
    setActiveScreen(screen)
    // إرجاع التمرير لأعلى الشاشة الجديدة — كان الانتقال يحتفظ بموضع القديمة.
    requestAnimationFrame(() => {
      document.querySelector('.phone-scroll')?.scrollTo({ top: 0, behavior: 'auto' })
    })
  }, [])

  const handleReset = useCallback(() => {
    resetStudylinkStore()
    setActiveScreen('home')
  }, [])

  const handleSplashComplete = useCallback(() => setShowSplash(false), [])

  const scrollToDsSection = useCallback((sectionId: string) => {
    setActiveDsSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // الملف ناقص = مسجّل دخول لكن بلا فرقة أو كلية. لا يُقيَّم قبل الترطيب.
  const showProfileWarning = mounted && !!user && (!user.grade || !user.college)

  const mainScreens = useMemo(() => ({
    home: <HomeScreen onNavigate={navigate} />,
    lectures: <LecturesScreen onNavigate={navigate} />,
    ambassador: <AmbassadorScreen onNavigate={navigate} />,
    profile: <ProfileScreen onNavigate={navigate} showProfileWarning={showProfileWarning} />,
  }), [navigate, showProfileWarning])

  const renderSecondaryScreen = () => {
    switch (activeScreen) {
      case 'cart': return <CartScreen onNavigate={navigate} />
      case 'wallet': return <WalletScreen onNavigate={navigate} />
      case 'checkout': return <CheckoutScreen onNavigate={navigate} />
      case 'order-success': case 'success': return <OrderSuccessScreen onNavigate={navigate} />
      case 'search': return <SearchScreen onNavigate={navigate} />
      case 'bundle': return <BundleScreen onNavigate={navigate} />
      case 'tracking': return <TrackingScreen onNavigate={navigate} />
      case 'my-orders': return <MyOrdersScreen onNavigate={navigate} />
      case 'wishlist': return <WishlistScreen onNavigate={navigate} />
      case 'notifications': return <NotificationsScreen onNavigate={navigate} />
      case 'chat': return <ChatSupportScreen onNavigate={navigate} />
      case 'faq': return <FAQScreen onNavigate={navigate} />
      case 'about': return <AboutScreen onNavigate={navigate} />
      case 'tools': return <ToolsScreen onNavigate={navigate} />
      case 'more': return <MoreScreen onNavigate={navigate} />
      case 'gifts': return <GiftScreen onNavigate={navigate} />
      case 'rate': return <RateAppScreen onNavigate={navigate} />
      case 'achievements': return <AchievementsScreen onNavigate={navigate} />
      case 'otp': return <OTPScreen onNavigate={navigate} />
      case 'onboarding': return <OnboardingScreen onNavigate={navigate} />
      case 'register': return <RegisterScreen onNavigate={navigate} />
      case 'library-harvard': return <LibraryScreen storeName="هارفرد" onNavigate={navigate} />
      case 'library-berlin': return <LibraryScreen storeName="برلين" onNavigate={navigate} />
      default: {
        if (activeScreen.startsWith('library-cat-')) {
          const colonIdx = activeScreen.indexOf(':', 12)
          if (colonIdx > -1) {
            const storeSlug = activeScreen.slice(12, colonIdx)
            const subjectName = decodeURIComponent(activeScreen.slice(colonIdx + 1))
            const storeMap: Record<string, 'هارفرد' | 'برلين'> = { harvard: 'هارفرد', berlin: 'برلين' }
            const store = storeMap[storeSlug]
            if (store && subjectName) {
              return <LibraryCategoryScreen storeName={store} subject={subjectName} onNavigate={navigate} />
            }
          }
        }
        /* شاشة غير معروفة (رابط قديم أو ?screen= بقيمة خطأ). سابقًا كانت
           تُرجِع null فيظهر إطار فاضي بلا أي مخرج. */
        return (
          <div className="h-full flex flex-col items-center justify-center gap-3 px-8 text-center bg-brand-grey-100">
            <div className="w-14 h-14 rounded-2xl bg-white border border-brand-grey-200 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-brand-grey-400" aria-hidden="true" />
            </div>
            <p className="text-[15px] font-semibold text-navy-800">الشاشة دي مش موجودة</p>
            <p className="text-[13px] text-brand-grey-500 leading-relaxed">
              الرابط اللي فتحته بيشير لشاشة اسمها
              {' '}<span className="sl-num">{activeScreen}</span>{' '}
              وإحنا مش لاقيينها.
            </p>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="mt-1 h-11 px-6 rounded-xl bg-navy-800 text-white text-[14px] font-semibold hover:bg-navy-700 active:bg-navy-900 transition-colors"
            >
              ارجع للرئيسية
            </button>
          </div>
        )
      }
    }
  }

  const isMainScreen = ['home', 'lectures', 'ambassador', 'profile'].includes(activeScreen)

  return (
    <main className="min-h-screen relative" dir="rtl">
      <SplashScreen active={showSplash} onComplete={handleSplashComplete} />

      <div className="relative z-10">
        {/* ===== DARK PHONE SHOWCASE AREA ===== */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-sky-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-[0.03] -z-10 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-sky-500/5 blur-[100px] animate-pulse hidden lg:block -z-10" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-sky-600/5 blur-[100px] animate-pulse hidden lg:block -z-10" style={{ animationDelay: '2s' }} />

          {/* HEADER */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? -10 : 0 }}
            transition={{ duration: 0.4 }}
            className="text-center pt-6 pb-3 px-4"
          >
            {/* الأصل الرسمي من 01-logo، بدل مربع متدرّج وحروف SL. */}
            <div className="flex flex-col items-center gap-1.5">
              <h1 className="sr-only">StudyLink</h1>
              <Image
                src={asset('/brand/lockup-horizontal-on-dark.svg')}
                alt="StudyLink"
                width={200}
                height={50}
                priority
                className="h-9 w-auto"
              />
              <p className="text-[13px] text-sky-200/80 font-medium leading-none">
                سوق أكاديمي لطلبة جامعة المنصورة
              </p>
            </div>
          </motion.header>

          {/* ===== PHONE SHOWCASE ===== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 20 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center px-4"
          >
            {/* Phone */}
            {/* الهاتف يُصغَّر بـ transform، والـ transform لا يقلّل المساحة
                المحجوزة. كان الكود يعوّض بهامش سالب محسوب من حالة React مع
                مستمع resize — وهو ما ينتج قفزة عند أول رسم. الحاوية الآن
                تحجز الارتفاع الصحيح لكل مقاس بـ CSS خالص. */}
            <div className="h-[560px] sm:h-[640px] md:h-[698px] lg:h-[820px] flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: showSplash ? 0 : 1, scale: showSplash ? 0.95 : 1 }}
              transition={{ duration: 0.5, delay: showSplash ? 0 : 0.1 }}
              className="scale-[0.68] sm:scale-[0.78] md:scale-[0.85] lg:scale-100 origin-top"
            >
              <PhoneFrame onNavigate={navigate} theme={theme}>
                {(['home', 'lectures', 'ambassador', 'profile'] as const).map(screen => (
                  <div
                    key={screen}
                    className="h-full"
                    style={{ display: activeScreen === screen ? 'block' : 'none' }}
                  >
                    {mainScreens[screen]}
                  </div>
                ))}
                {!isMainScreen && renderSecondaryScreen()}
              </PhoneFrame>
            </motion.div>
            </div>

            {/* ── Reset Button + Auth Status ── */}
            <div className="flex items-center justify-center gap-2 mt-2 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-400' : 'bg-white/30'}`} />
                <span className="text-[12px] text-white/75">
                  {user ? user.name : 'زائر'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
                aria-pressed={theme === 'dark'}
                aria-label="تبديل الوضع الداكن"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[12px] text-white/70 hover:text-sky-200 hover:border-sky-300/40 transition-all duration-200 backdrop-blur-sm"
              >
                {theme === 'dark'
                  ? <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                  : <Moon className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{theme === 'dark' ? 'فاتح' : 'داكن'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                aria-label="إعادة ضبط بيانات المعاينة"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[12px] text-white/70 hover:text-rose-300 hover:border-rose-300/40 transition-all duration-200 backdrop-blur-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>ريسيت</span>
              </button>
            </div>
          </motion.section>

          {/* ===== DESIGN SYSTEM SECTION PILLS (in dark area) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 10 : 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="pb-6 px-4"
          >
            <p className="text-[12px] font-bold text-white/60 mb-3 text-center">دليل نظام التصميم — أقسام</p>
            <div className="flex gap-2 justify-center flex-wrap max-w-4xl mx-auto">
              {dsSections.map(({ id, label, icon: Icon }) => {
                const isActive = activeDsSection === id
                return (
                  <button
                    key={id}
                    onClick={() => scrollToDsSection(id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-white'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="ds-section-pill-active"
                        className="absolute inset-0 bg-white/15 border border-white/20 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3 h-3" />
                      <span>{label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
        {/* ===== END DARK PHONE AREA ===== */}

        {/* ===== DESIGN SYSTEM SHOWCASE (has its own hero + footer) ===== */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: showSplash ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <DesignSystemShowcase />
        </motion.section>

        {/* ===== FEATURE HIGHLIGHTS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 15 : 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="bg-gradient-to-b from-white to-brand-grey-50/50 py-10 sm:py-14"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <p className="text-[12px] font-bold text-sky-500 uppercase mb-1.5">لماذا StudyLink؟</p>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900">تجربة أكاديمية متكاملة</h2>
              <p className="text-[13px] text-brand-grey-500 mt-2 max-w-md mx-auto leading-relaxed">من المحاضرات للأدوات الطبية — كل ما تحتاجيه في مكان واحد مع توصيل سريع</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: <Sparkles className="w-5 h-5 text-sky-500" />,
                  title: '240+ مذكرة',
                  desc: 'محاضرات مسجلة ومراجعات شاملة لكل فرق كلية الطب',
                  color: 'bg-sky-50 border-sky-100',
                },
                {
                  icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
                  title: 'مكتبات معتمدة',
                  desc: 'هارفرد وبرلين — شركاء أكاديميون موثوقين منذ 2018',
                  color: 'bg-emerald-50 border-emerald-100',
                },
                {
                  icon: <Smartphone className="w-5 h-5 text-amber-500" />,
                  title: 'رسائل ذكية',
                  desc: 'عروض وتحديثات وتنبيهات طلباتك في مكان واحد — كل حاجة تخصك هنا',
                  color: 'bg-amber-50 border-amber-100',
                },
                {
                  icon: <Layers className="w-5 h-5 text-violet-500" />,
                  title: 'محفظة ذكية',
                  desc: 'ادفع وأكسب عمولة وشارك مع زمايلك بسهولة وسرية',
                  color: 'bg-violet-50 border-violet-100',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  className={`rounded-2xl border p-4 ${feature.color} hover:shadow-md transition-shadow duration-300`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center mb-3 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-[14px] font-bold text-navy-900 mb-1">{feature.title}</h3>
                  <p className="text-[13px] text-brand-grey-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}