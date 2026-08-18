'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { Home, BookOpen, User, Menu, Award, MessageCircle } from 'lucide-react'

/** المعرّفات المسموح بها للتبويب النشط. أي شاشة أخرى تمرّر التبويب الأب. */
export type NavTabId = 'home' | 'lectures' | 'ambassador' | 'gifts' | 'profile' | 'more'

interface BottomNavBarProps {
  activeTab?: NavTabId
  onNavigate?: (screen: string) => void
  /** نقطة تنبيه على «حسابي» حين يكون الملف ناقصًا. */
  showProfileWarning?: boolean
  /** الأب يتحكم في التخطيط — بلا sticky. */
  noSticky?: boolean
}

/* التسميات بلا «SL» لاحقة: الاسم اللاتيني كان يلتف على سطر ثانٍ داخل إطار
   375px فيرفع ارتفاع الزر ويكسر محاذاة الأيقونات مع باقي التبويبات. */
const tabs = [
  { id: 'home', label: 'الرئيسية', icon: Home, hint: 'الصفحة الرئيسية' },
  { id: 'lectures', label: 'المحاضرات', icon: BookOpen, hint: 'المحاضرات والمذكرات' },
  { id: 'ambassador', label: 'السفراء', icon: Award, hint: 'برنامج سفراء StudyLink' },
  { id: 'gifts', label: 'الرسائل', icon: MessageCircle, hint: 'رسائل StudyLink' },
  { id: 'profile', label: 'حسابي', icon: User, hint: 'حسابي' },
] as const

const moreTab = { id: 'more', label: 'المزيد', icon: Menu, hint: 'المزيد من الخيارات' } as const

function MoreIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={isActive ? 'text-sky-600' : 'text-brand-grey-400'}
    >
      <rect x="2" y="3" width="14" height="1.8" rx="0.9" fill="currentColor" />
      <rect x="5" y="8.1" width="8" height="1.8" rx="0.9" fill="currentColor" />
      <rect x="2" y="13.2" width="14" height="1.8" rx="0.9" fill="currentColor" />
    </svg>
  )
}

export default function BottomNavBar({
  activeTab = 'home',
  onNavigate,
  showProfileWarning = false,
  noSticky = false,
}: BottomNavBarProps) {
  /* الشاشات الرئيسية تبقى كلها مركّبة في DOM (تُخفى بـ display:none)، أي أن
     أكثر من شريط تنقّل يعيش في نفس اللحظة. مع layoutId ثابت كان Framer Motion
     يرى عدة عناصر تحمل نفس الهوية فيطيّر الحبّة النشطة بين شريط ظاهر وآخر
     مخفي. useId يعطي كل نسخة هوية خاصة بها. */
  const pillId = useId()

  const allTabs = [...tabs, moreTab]

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className={[
        noSticky ? 'flex-shrink-0' : 'flex-shrink-0 sticky bottom-0',
        'z-40 bg-white/95 backdrop-blur-md border-t border-brand-grey-200',
        'px-1.5 pt-1.5 shadow-[0_-1px_8px_rgba(19,37,58,0.06)]',
      ].join(' ')}
      style={{ paddingBottom: 'max(4px, env(safe-area-inset-bottom, 4px))' }}
    >
      <ul className="flex items-stretch justify-between gap-0.5">
        {allTabs.map(tab => {
          const isActive = activeTab === tab.id
          const isMore = tab.id === 'more'
          const Icon = tab.icon

          return (
            <li key={tab.id} className="flex-1">
              <motion.button data-tap="44"
                type="button"
                onClick={() => onNavigate?.(tab.id)}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
                aria-label={tab.hint}
                aria-current={isActive ? 'page' : undefined}
                className="relative w-full flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-2xl transition-colors duration-200"
                style={{ minHeight: '52px' }}
              >
                {/* الخلفية النشطة — بلا AnimatePresence: الدخول والخروج
                    يتكفّل بهما انتقال layout نفسه، وإضافتهما معًا كانت تُحدث
                    وميضًا عند تبديل التبويب. */}
                {isActive && (
                  <motion.span
                    layoutId={`nav-pill-${pillId}`}
                    className="absolute inset-0 bg-sky-50 rounded-2xl -z-10"
                    transition={{ type: 'spring' as const, stiffness: 350, damping: 28 }}
                  />
                )}

                <span className="relative flex items-center justify-center">
                  {isMore ? (
                    <MoreIcon isActive={isActive} />
                  ) : (
                    <Icon
                      className={`w-[22px] h-[22px] transition-colors duration-200 ${
                        isActive ? 'text-sky-600' : 'text-brand-grey-400'
                      }`}
                      strokeWidth={isActive ? 2.4 : 1.9}
                      aria-hidden="true"
                    />
                  )}

                  {tab.id === 'profile' && showProfileWarning && (
                    <span
                      className="absolute -top-0.5 -end-0.5 w-2.5 h-2.5 bg-amber-200 rounded-full ring-2 ring-white"
                      role="status"
                      aria-label="ملفك ناقص"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' as const }}
                        className="absolute inset-0 rounded-full bg-amber-200"
                      />
                    </span>
                  )}
                </span>

                <span
                  className={`text-[12px] leading-none whitespace-nowrap transition-colors duration-200 ${
                    isActive ? 'text-sky-600 font-semibold' : 'text-brand-grey-400 font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            </li>
          )
        })}
      </ul>

      <div className="flex justify-center mt-1">
        <div className="w-[134px] h-[4px] bg-brand-grey-300/50 rounded-full" aria-hidden="true" />
      </div>
    </nav>
  )
}
