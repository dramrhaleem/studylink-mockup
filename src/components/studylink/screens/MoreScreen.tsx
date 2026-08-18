'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronLeft,
  HelpCircle,
  FileText,
  MessageCircle,
  Bell,
  Info,
  FileCheck,
  Lock,
  LogOut,
  Trash2,
  X,
} from 'lucide-react'
import BottomNavBar from '@/components/studylink/BottomNavBar'
import ToggleSwitch from '@/components/studylink/ToggleSwitch'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface MoreScreenProps {
  onNavigate?: (screen: string) => void
}

export default function MoreScreen({ onNavigate }: MoreScreenProps) {
  const user = useStudylinkStore(s => s.user)
  const logout = useStudylinkStore(s => s.logout)
  const resetAll = useStudylinkStore(s => s.resetAll)

  const [notifications, setNotifications] = useState(true)
  const [sheet, setSheet] = useState<'faq' | 'return' | 'terms' | 'privacy' | 'logout' | null>(null)

  const handleLogout = useCallback(() => {
    logout()
    resetAll()
    setSheet(null)
    onNavigate?.('home')
  }, [logout, resetAll, onNavigate])

  const handleWhatsApp = useCallback(() => {
    const msg = encodeURIComponent('السلام عليكم، عندي استفسار بخصوص...')
    window.open(`https://wa.me/201000000000?text=${msg}`, '_blank')
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden bg-brand-grey-100" dir="rtl">
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 pt-9 pb-3">
          <button data-tap="44" aria-label="التالي"
            onClick={() => onNavigate?.('home')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey-100 active:scale-90 transition-transform tap-44"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <ArrowLeft className="w-[18px] h-[18px] text-navy-800" />
          </button>
          <h1 className="text-[17px] font-bold text-navy-900">المزيد</h1>
          <div className="w-12" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 phone-scroll">
        <div className="py-3 space-y-3">

          {/* Card 1: Support & Policies */}
          <div className="mx-4 rounded-2xl bg-white shadow-sm border border-brand-grey-200/50 overflow-hidden">
            <button data-tap="44"
              onClick={() => setSheet('faq')}
              className="w-full flex items-center gap-3 px-4 active:bg-brand-grey-50 transition-colors text-start"
              style={{ minHeight: 56 }}
            >
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-[18px] h-[18px] text-sky-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-navy-900">الأسئلة الشائعة (FAQ)</p>
                <p className="text-[12px] text-brand-grey-400 mt-0.5">مواعيد المكتبات والدفع والتوصيل</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-brand-grey-400 flex-shrink-0" />
            </button>
            <div className="h-px bg-brand-grey-100 mx-4" />
            <button data-tap="44"
              onClick={() => setSheet('return')}
              className="w-full flex items-center gap-3 px-4 active:bg-brand-grey-50 transition-colors text-start"
              style={{ minHeight: 56 }}
            >
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-[18px] h-[18px] text-sky-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-navy-900">سياسة الاسترجاع والتعويض</p>
                <p className="text-[12px] text-brand-grey-400 mt-0.5">شروط الإلغاء والاسترجاع</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-brand-grey-400 flex-shrink-0" />
            </button>
            <div className="h-px bg-brand-grey-100 mx-4" />
            <button data-tap="44"
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-4 active:bg-brand-grey-50 transition-colors text-start"
              style={{ minHeight: 56 }}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-[18px] h-[18px] text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-navy-900">تواصل مع الدعم (WhatsApp)</p>
                <p className="text-[12px] text-brand-grey-400 mt-0.5">دعم StudyLink</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-brand-grey-400 flex-shrink-0" />
            </button>
          </div>

          {/* Card 2: Settings */}
          <div className="mx-4 rounded-2xl bg-white shadow-sm border border-brand-grey-200/50 overflow-hidden">
            <div
              className="flex items-center gap-3 px-4"
              style={{ minHeight: 56 }}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-grey-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-[18px] h-[18px] text-navy-800" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-navy-900">الإشعارات</p>
              </div>
              <ToggleSwitch
                enabled={notifications}
                onToggle={() => setNotifications(!notifications)}
                label="إشعارات الطلبات والعروض"
              />
            </div>
          </div>

          {/* Card 3: Legal */}
          <div className="mx-4 rounded-2xl bg-white shadow-sm border border-brand-grey-200/50 overflow-hidden">
            <button data-tap="44"
              onClick={() => onNavigate?.('about')}
              className="w-full flex items-center gap-3 px-4 active:bg-brand-grey-50 transition-colors text-start"
              style={{ minHeight: 56 }}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-grey-100 flex items-center justify-center flex-shrink-0">
                <Info className="w-[18px] h-[18px] text-navy-800" />
              </div>
              <p className="flex-1 text-[13px] font-semibold text-navy-900 text-start">عن StudyLink</p>
              <ChevronLeft className="w-4 h-4 text-brand-grey-400 flex-shrink-0" />
            </button>
            <div className="h-px bg-brand-grey-100 mx-4" />
            <button data-tap="44"
              onClick={() => setSheet('terms')}
              className="w-full flex items-center gap-3 px-4 active:bg-brand-grey-50 transition-colors text-start"
              style={{ minHeight: 56 }}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-grey-100 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-[18px] h-[18px] text-navy-800" />
              </div>
              <p className="flex-1 text-[13px] font-semibold text-navy-900 text-start">الشروط والأحكام</p>
              <ChevronLeft className="w-4 h-4 text-brand-grey-400 flex-shrink-0" />
            </button>
            <div className="h-px bg-brand-grey-100 mx-4" />
            <button data-tap="44"
              onClick={() => setSheet('privacy')}
              className="w-full flex items-center gap-3 px-4 active:bg-brand-grey-50 transition-colors text-start"
              style={{ minHeight: 56 }}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-grey-100 flex items-center justify-center flex-shrink-0">
                <Lock className="w-[18px] h-[18px] text-navy-800" />
              </div>
              <p className="flex-1 text-[13px] font-semibold text-navy-900 text-start">سياسة الخصوصية</p>
              <ChevronLeft className="w-4 h-4 text-brand-grey-400 flex-shrink-0" />
            </button>
          </div>

          {/* Footer: Destructive */}
          <div className="mx-4 mt-2">
            <button
              onClick={() => setSheet('logout')}
              className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-white border border-brand-grey-200/50 shadow-sm active:bg-brand-grey-50 transition-colors"
            >
              <LogOut className="w-[18px] h-[18px] text-brand-grey-600" />
              <span className="text-[13px] font-semibold text-brand-grey-700">تسجيل الخروج</span>
            </button>

            {user && (
              <button data-tap="44"
                className="w-full flex items-center justify-center gap-1.5 py-3 mt-2 active:opacity-70 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-error" aria-hidden="true" />
                <span className="text-[13px] font-semibold text-error">حذف الحساب</span>
              </button>
            )}

            <p className="text-center text-[12px] text-brand-grey-400 mt-3 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              V 1.0.2
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex-shrink-0">
        <BottomNavBar onNavigate={onNavigate} activeTab="more" noSticky />
      </div>

      {/* FAQ Bottom Sheet */}
      <AnimatePresence>
        {sheet === 'faq' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setSheet(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl"
              style={{ boxShadow: '0 -4px 30px rgba(0,0,0,0.15)', maxHeight: '75vh' }}
            >
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="w-10 h-1 rounded-full bg-brand-grey-200" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3 border-b border-brand-grey-100">
                <h3 className="text-[15px] font-bold text-navy-900">الأسئلة الشائعة (FAQ)</h3>
                <button data-tap="44" aria-label="إغلاق" onClick={() => setSheet(null)} className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey-100 active:scale-90 transition-transform tap-44" style={{ minWidth: 48, minHeight: 48 }}>
                  <X className="w-4 h-4 text-brand-grey-500" />
                </button>
              </div>
              <div className="overflow-y-auto phone-scroll px-5 pb-6" style={{ maxHeight: 'calc(75vh - 60px)' }}>
                <div className="py-3.5 border-b border-brand-grey-100">
                  <p className="text-[13px] font-semibold text-navy-900">مواعيد المكتبات إيه؟</p>
                  <p className="text-[13px] text-brand-grey-600 mt-1.5 leading-relaxed">مكتبة هارفرد: مفتوحة يومياً من 9 صباحاً لـ 10 مساءً.{'\n'}مكتبة برلين: حالياً مغلقة للصيانة — تابعوا الإعلانات.</p>
                </div>
                <div className="py-3.5 border-b border-brand-grey-100">
                  <p className="text-[13px] font-semibold text-navy-900">طرق الدفع المتاحة إيه؟</p>
                  <p className="text-[13px] text-brand-grey-600 mt-1.5 leading-relaxed">كاش عند الاستلام · فودافون كاش · انستاباي · تحويل بنكي.</p>
                </div>
                <div className="py-3.5 border-b border-brand-grey-100">
                  <p className="text-[13px] font-semibold text-navy-900">التوصيل بياخد قد إيه؟</p>
                  <p className="text-[13px] text-brand-grey-600 mt-1.5 leading-relaxed">من 30 لـ 45 دقيقة. التوصيل بـ 25 ج.م للطلبات تحت 200 ج.م، ومجاني فوق كده.</p>
                </div>
                <div className="py-3.5 border-b border-brand-grey-100">
                  <p className="text-[13px] font-semibold text-navy-900">لو العميل ده مع المندوب أقدر ألغي الأوردر؟</p>
                  <p className="text-[13px] text-brand-grey-600 mt-1.5 leading-relaxed">لو الأوردر اتحول لحالة &quot;مع المندوب&quot;، مش هينفع نلغيه عشان المندوب بيكون اتحرك فعلاً. طلباتكم أمانة فخلينا نقدر وقت بعض ❤️</p>
                </div>
                <div className="py-3.5">
                  <p className="text-[13px] font-semibold text-navy-900">إزاي أتأكد إن الأوردر وصل؟</p>
                  <p className="text-[13px] text-brand-grey-600 mt-1.5 leading-relaxed">هتلاقي حالة الأوردر متحدثة في تبويب &quot;طلباتي&quot;. كمان هيوصلك إشعار لما المندوب يوصل.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return Policy Bottom Sheet */}
      <AnimatePresence>
        {sheet === 'return' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setSheet(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl"
              style={{ boxShadow: '0 -4px 30px rgba(0,0,0,0.15)', maxHeight: '75vh' }}
            >
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="w-10 h-1 rounded-full bg-brand-grey-200" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3 border-b border-brand-grey-100">
                <h3 className="text-[15px] font-bold text-navy-900">سياسة الاسترجاع والتعويض</h3>
                <button data-tap="44" aria-label="إغلاق" onClick={() => setSheet(null)} className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey-100 active:scale-90 transition-transform tap-44" style={{ minWidth: 48, minHeight: 48 }}>
                  <X className="w-4 h-4 text-brand-grey-500" />
                </button>
              </div>
              <div className="overflow-y-auto phone-scroll px-5 pb-6 space-y-3" style={{ maxHeight: 'calc(75vh - 60px)' }}>
                <div className="rounded-xl bg-brand-grey-50 p-3.5">
                  <p className="text-[13px] font-bold text-navy-800 mb-1">استرجاع قبل الاستلام</p>
                  <p className="text-[12px] text-brand-grey-600 leading-relaxed">تقدر تلغي الأوردر مجاناً قبل ما يتم تحويله للمندوب.</p>
                </div>
                <div className="rounded-xl bg-brand-grey-50 p-3.5">
                  <p className="text-[13px] font-bold text-navy-800 mb-1">بعد الاستلام</p>
                  <p className="text-[12px] text-brand-grey-600 leading-relaxed">المنتجات الرقمية (مذكرات PDF) مسترجعة مش متاحة بعد التسليم لأنها ملكية فكرية.</p>
                </div>
                <div className="rounded-xl bg-brand-grey-50 p-3.5">
                  <p className="text-[13px] font-bold text-navy-800 mb-1">الأدوات الطبية</p>
                  <p className="text-[12px] text-brand-grey-600 leading-relaxed">تقدر ترجع الأدوات الطبية خلال 24 ساعة من الاستلام شرط المنتج يكون في حالته الأصلية.</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200/40">
                  <p className="text-[13px] font-bold text-amber-800 mb-1">إلغاء بعد تحرك المندوب</p>
                  <p className="text-[12px] text-amber-700 leading-relaxed">لو تم الإلغاء والمندوب في الطريق، سنتحمل نحن تكلفة مشواره، لذا نرجو التأكد من الطلب قبل تأكيده تقديراً لوقتنا ووقتك ❤️</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms Bottom Sheet */}
      <AnimatePresence>
        {sheet === 'terms' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40" onClick={() => setSheet(null)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl"
              style={{ boxShadow: '0 -4px 30px rgba(0,0,0,0.15)', maxHeight: '75vh' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-2.5 pb-1"><div className="w-10 h-1 rounded-full bg-brand-grey-200" /></div>
              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-brand-grey-100">
                <h3 className="text-[15px] font-bold text-navy-900">الشروط والأحكام</h3>
                <button data-tap="44" aria-label="إغلاق" onClick={() => setSheet(null)} className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey-100 active:scale-90 transition-transform tap-44" style={{ minWidth: 48, minHeight: 48 }}>
                  <X className="w-4 h-4 text-brand-grey-500" />
                </button>
              </div>
              <div className="overflow-y-auto phone-scroll px-5 pb-6 space-y-3" style={{ maxHeight: 'calc(75vh - 60px)' }}>
                <p className="text-[13px] text-brand-grey-600 leading-relaxed">بتستخدم تطبيق StudyLink بقبولك للشروط دي. المنصة مش مسؤولة عن أي استخدام خاطئ للمحتوى الأكاديمي. المحتوى محموي بحقوق الملكية الفكرية وبيع أي ملف من غير إذن يعتبر مخالفة.</p>
                <div className="rounded-xl bg-brand-grey-50 p-3.5">
                  <p className="text-[13px] font-bold text-navy-800 mb-1">حقوق الملكية</p>
                  <p className="text-[12px] text-brand-grey-600 leading-relaxed">كل المحتوى (مذكرات، ملخصات، تسجيلات) ملك للمكتبات الشريكة وStudyLink. يمنع منعاً باتاً إعادة النشر أو البيع أو التوزيع.</p>
                </div>
                <div className="rounded-xl bg-brand-grey-50 p-3.5">
                  <p className="text-[13px] font-bold text-navy-800 mb-1">المسؤولية</p>
                  <p className="text-[12px] text-brand-grey-600 leading-relaxed">المحتوى الأكاديمي للاستخدام الشخصي فقط. StudyLink مش مسؤولة عن أداء الامتحانات الناتج عن الاعتماد على المحتوى.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Bottom Sheet */}
      <AnimatePresence>
        {sheet === 'privacy' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40" onClick={() => setSheet(null)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl"
              style={{ boxShadow: '0 -4px 30px rgba(0,0,0,0.15)', maxHeight: '75vh' }}
            >
              <div className="flex justify-center pt-2.5 pb-1"><div className="w-10 h-1 rounded-full bg-brand-grey-200" /></div>
              <div className="flex items-center justify-between px-5 pb-3 border-b border-brand-grey-100">
                <h3 className="text-[15px] font-bold text-navy-900">سياسة الخصوصية</h3>
                <button data-tap="44" aria-label="إغلاق" onClick={() => setSheet(null)} className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey-100 active:scale-90 transition-transform tap-44" style={{ minWidth: 48, minHeight: 48 }}>
                  <X className="w-4 h-4 text-brand-grey-500" />
                </button>
              </div>
              <div className="overflow-y-auto phone-scroll px-5 pb-6 space-y-3" style={{ maxHeight: 'calc(75vh - 60px)' }}>
                <p className="text-[13px] text-brand-grey-600 leading-relaxed">بياناتك عندنا أمان. بنستخدم رقم التليفون بس للتواصل بخصوص الطلبات ومشاركة التحديثات.</p>
                <div className="rounded-xl bg-brand-grey-50 p-3.5">
                  <p className="text-[13px] font-bold text-navy-800 mb-1">البيانات المجمعة</p>
                  <p className="text-[12px] text-brand-grey-600 leading-relaxed">الاسم، رقم الهاتف، الفرقة، والكلية. مش بنجمع بيانات مالية أو بطاقات.</p>
                </div>
                <div className="rounded-xl bg-brand-grey-50 p-3.5">
                  <p className="text-[13px] font-bold text-navy-800 mb-1">مشاركة البيانات</p>
                  <p className="text-[12px] text-brand-grey-600 leading-relaxed">مش بنشارك بياناتك مع أي طرف تالت. البيانات بتتستخدم داخلياً بس لتحسين خدمتك.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Action Sheet */}
      <AnimatePresence>
        {sheet === 'logout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40"
            onClick={() => setSheet(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sheet === 'logout' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[80] px-4"
            style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))' }}
          >
            <div className="rounded-2xl bg-white overflow-hidden shadow-xl">
              <div className="px-5 pt-5 pb-3 text-center">
                <h3 className="text-[15px] font-bold text-navy-900">تسجيل الخروج</h3>
                <p className="text-[13px] text-brand-grey-500 mt-1.5 leading-relaxed">هل أنت متأكد إنك عايز تسجل خروج؟ هتحتاج تدخل بياناتك تاني.</p>
              </div>
              <button
                onClick={() => setSheet(null)}
                className="w-full h-12 bg-brand-grey-100 text-[14px] font-bold text-navy-900 active:bg-brand-grey-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleLogout}
                className="w-full h-12 bg-red-500 text-[14px] font-bold text-white active:opacity-80 transition-opacity"
              >
                تسجيل الخروج
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}