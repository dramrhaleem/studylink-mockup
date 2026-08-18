'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Tag,
  Shield,
  Zap,
  RotateCcw,
  X,
  Camera,
  Plus,
  Lock,
  Info,
  Truck,
  ShoppingBag,
  ArrowRightLeft,
  Store,
  Home,
  School,
  Smartphone,
  Landmark,
  type LucideIcon,
} from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  useStudylinkStore,
} from '@/lib/use-studylink-store'
import PricingBreakdown from './PricingBreakdown'
import { computeOrderTotals } from '@/lib/pricing'

// ── Types ────────────────────────────────────────────────────
interface CheckoutScreenProps {
  onNavigate?: (screen: string) => void
}

type PaymentId = 'instapay' | 'vodafone' | 'automation'
type AddressSheetPhase = 'list' | 'form'

interface SavedAddress {
  id: string
  label: string
  icon: LucideIcon
  district: string
  street: string
}

// ── Static data ──────────────────────────────────────────────
const PROMO_CODES: Record<string, { percent: number; label: string }> = {
  STUDY10: { percent: 0.1, label: 'STUDY10' },
  WELCOME20: { percent: 0.2, label: 'WELCOME20' },
  AMBASSADOR: { percent: 0.15, label: 'AMBASSADOR' },
}

const savedAddresses: SavedAddress[] = [
  { id: '1', label: 'البيت', icon: Home, district: 'شارع الجامعة', street: 'المدينة' },
  { id: '2', label: 'السكن الجامعي', icon: School, district: 'مدينة الطلاب', street: 'بلوك 4' },
]

// ── Animation variants ──────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

// ── Component ────────────────────────────────────────────────
export default function CheckoutScreen({ onNavigate }: CheckoutScreenProps) {
  const cart = useStudylinkStore((s) => s.cart)
  const deliveryOption = useStudylinkStore((s) => s.deliveryOption)
  const setDeliveryOption = useStudylinkStore((s) => s.setDeliveryOption)
  const user = useStudylinkStore((s) => s.user)
  const addOrder = useStudylinkStore((s) => s.addOrder)

  // ── Local state ──────────────────────────────────────────
  const [selectedPayment, setSelectedPayment] = useState<PaymentId>('instapay')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [addressLabel, setAddressLabel] = useState('')
  const [addressSaved, setAddressSaved] = useState(false)
  const [notes, setNotes] = useState('')

  // Address bottom sheet
  const [addressSheetOpen, setAddressSheetOpen] = useState(false)
  const [addressSheetPhase, setAddressSheetPhase] = useState<AddressSheetPhase>('list')
  const [newDistrict, setNewDistrict] = useState('')
  const [newStreet, setNewStreet] = useState('')
  const [newBuilding, setNewBuilding] = useState('')
  const [newLabel, setNewLabel] = useState('')

  // Promo code
  const [showDiscount, setShowDiscount] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [appliedCodeName, setAppliedCodeName] = useState('')
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')

  // Screenshot upload
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [phoneTouched, setPhoneTouched] = useState(false)
  const phoneValid = /^\d{9}$/.test(phone)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Price calculations ────────────────────────────────────
  /* كل الأرقام من `lib/pricing.ts`.
     ما أُزيل هنا عمدًا:
     · `originalDeliveryFee = 30` — سعر مرجعي مُختلَق لإظهار شطب و«وفّرت 5».
       StudyLink لم تتقاضَ 30 يومًا، و«المنافس 30–35» ادعاء بحالة Assumption
       مصنّف «لا يُنشر» (C-004). عرض السعر مشطوبًا يوحي بتخفيض لم يحدث.
     · `multiStoreFee = 5` — كان بندًا منفصلًا يقلّد «رسم لكل مكتبة»، وهو ما
       يحسبه رسم الخدمة نفسه الآن (رسم × عدد المكتبات، C-001). بندان لنفس
       التكلفة = تحصيل مزدوج ظاهريًا. */
  const totals = useMemo(
    () => computeOrderTotals(
      cart.map(i => ({ price: i.product.price, quantity: i.quantity, store: i.product.store })),
      deliveryOption
    ),
    [cart, deliveryOption]
  )
  const { subtotal, serviceFee, fulfillmentFee: deliveryFee, storeCount } = totals
  const discountAmount = discountApplied ? Math.round(subtotal * appliedDiscountPercent) : 0
  const total = Math.max(0, totals.total - discountAmount)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const canPlaceOrder = cart.length > 0

  // ── Payment method config ─────────────────────────────────
  const getPaymentMethods = useCallback((): { id: PaymentId; label: string; icon: LucideIcon; desc: string; needsUpload: boolean }[] => {
    const isDelivery = deliveryOption === 'delivery'
    return [
      {
        id: 'instapay',
        label: 'إنستاباي',
        icon: Smartphone,
        desc: isDelivery ? 'ادفع الوقتي أو لما مندوبنا يوصلك' : 'ادفع دلوقتي أو لما تستلم أوردرك!',
        needsUpload: true,
      },
      {
        id: 'vodafone',
        label: 'فودافون كاش',
        icon: Landmark,
        desc: isDelivery ? 'ادفع الوقتي أو لما مندوبنا يوصلك' : 'ادفع دلوقتي أو لما تستلم أوردرك!',
        needsUpload: true,
      },
      {
        id: 'automation',
        label: 'أوتوميشن SMS/OCP',
        icon: Zap,
        desc: 'ادفع دلوقتي أو لما تستلم أوردرك!',
        needsUpload: false,
      },
    ]
  }, [deliveryOption])

  const paymentMethods = getPaymentMethods()
  const activePayment = paymentMethods.find((m) => m.id === selectedPayment)!

  // ── Handlers ──────────────────────────────────────────────
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase()
    setPromoError('')
    if (!code) return
    const promo = PROMO_CODES[code]
    if (promo) {
      setDiscountApplied(true)
      setAppliedCodeName(promo.label)
      setAppliedDiscountPercent(promo.percent)
      setPromoError('')
      toast.success('تم تطبيق كود الخصم بنجاح')
    } else {
      setPromoError('كود غير صالح')
    }
  }

  const handleRemoveDiscount = () => {
    setDiscountApplied(false)
    setAppliedCodeName('')
    setAppliedDiscountPercent(0)
    setDiscountCode('')
    setPromoError('')
  }

  const handleSelectAddress = (addr: SavedAddress) => {
    const fullAddr = `${addr.district}، المدينة`
    setAddress(fullAddr)
    setAddressLabel(addr.label)
    setAddressSheetOpen(false)
    setAddressSheetPhase('list')
  }

  const handleSaveNewAddress = () => {
    if (!newDistrict.trim() && !newStreet.trim()) return
    const parts = [newDistrict.trim(), newStreet.trim()].filter(Boolean)
    const fullAddr = parts.length > 0 ? `${parts.join('، ')}، المدينة` : 'المدينة'
    setAddress(fullAddr)
    setAddressLabel(newLabel.trim() || 'عنوان جديد')
    setAddressSaved(true)
    setAddressSheetOpen(false)
    setAddressSheetPhase('list')
    // Reset form
    setNewDistrict('')
    setNewStreet('')
    setNewBuilding('')
    setNewLabel('')
    // Clear green flash after 3 seconds
    setTimeout(() => setAddressSaved(false), 3000)
    toast.success('تم حفظ العنوان')
  }

  const handleOpenAddressSheet = () => {
    setAddressSheetPhase('list')
    setAddressSheetOpen(true)
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveScreenshot = () => {
    setScreenshotPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // ── Shared styles ─────────────────────────────────────────
  /* `sl-num` كان مطبّقًا على **كل** حقول الإدخال، بما فيها حقول النص العربي
     الحر (الملاحظات، الشارع). خط الأرقام لاتيني أحادي المسافة ولا يشكّل العربية،
     فتظهر الحروف منفصلة ومتباعدة. صار مقصورًا على الحقول الرقمية. */
  const inputClass =
    'w-full bg-white border border-brand-grey-200 rounded-lg px-4 h-11 text-[14px] text-brand-grey-900 placeholder:text-brand-grey-400 outline-none focus:border-2 focus:border-sky-600 transition-colors'
  const numInputClass = inputClass + ' sl-num'
  const labelClass = 'text-[12px] font-semibold text-brand-grey-700 mb-1.5 block'

  return (
    <div className="min-h-full bg-brand-grey-100 flex flex-col">
      {/* ═══════════════ Header ═══════════════ */}
      <div className="bg-navy-800 px-4 pt-3 pb-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button data-tap="44"
            onClick={() => onNavigate?.('cart')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors tap-44"
            aria-label="رجوع"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[16px] font-bold text-white">إتمام الطلب</h1>
          <div className="w-8" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mt-4">
          {['السلة', 'العنوان', 'الدفع'].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold sl-num ${
                    idx < 2
                      ? 'bg-success text-white'
                      : idx === 2
                        ? 'bg-sky-500 text-white'
                        : 'bg-white/20 text-white/60'
                  }`}
                >
                  {idx < 2 ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] mt-1 font-medium ${idx === 2 ? 'text-sky-300' : 'text-white/50'}`}
                >
                  {label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`w-12 h-0.5 mx-1.5 mt-[-10px] rounded-full ${idx < 2 ? 'bg-success/60' : 'bg-white/20'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ Scrollable Content ═══════════════ */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 p-4 space-y-3 pb-48 overflow-y-auto"
      >
        {/* ─── Delivery / Pickup Toggle ─── */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
        >
          <h3 className="text-[14px] font-bold text-navy-800 mb-3">طريقة الاستلام</h3>
          <div className="grid grid-cols-2 gap-2">
            <button data-tap="44"
              onClick={() => setDeliveryOption('delivery')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-[13px] font-semibold ${
                deliveryOption === 'delivery'
                  ? 'border-sky-500 bg-sky-50 text-sky-600'
                  : 'border-brand-grey-200 text-brand-grey-500 hover:border-brand-grey-300'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>توصيل</span>
            </button>
            <button data-tap="44"
              onClick={() => setDeliveryOption('pickup')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-[13px] font-semibold ${
                deliveryOption === 'pickup'
                  ? 'border-sky-500 bg-sky-50 text-sky-600'
                  : 'border-brand-grey-200 text-brand-grey-500 hover:border-brand-grey-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>استلام</span>
            </button>
          </div>
          {deliveryOption === 'pickup' && (
            <p className="text-[12px] text-brand-grey-500 mt-2.5 leading-relaxed">
              الاستلام من المكتبة من غير رسم تنفيذ. رسوم الخدمة وقيمة المنتجات زي ما هي.
            </p>
          )}
        </motion.div>

        {/* ─── بيانات الاستلام ─── */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
        >
          <h3 className="text-[14px] font-bold text-navy-800">بيانات الاستلام</h3>

          <div className="mt-3 space-y-3">
            {/* Phone */}
            <div>
              <label className={labelClass} htmlFor="checkout-phone">رقم الهاتف</label>
              {/* كان الحقل نفسه dir="ltr" والبادئة «01» في مقطع RTL منفصل،
                  فتظهر البادئة في ناحية والأرقام في الناحية المقابلة بفجوة
                  بينهما. الصف كله الآن مقطع LTR واحد، فالرقم يُقرأ متصلًا. */}
              <div
                dir="ltr"
                className={`relative h-11 flex items-center gap-1 rounded-lg border bg-white px-4 transition-colors focus-within:border-2 focus-within:border-sky-600 ${
                  phoneTouched && !phoneValid ? 'border-2 border-error' : 'border-brand-grey-200'
                }`}
              >
                <span className="text-[14px] text-brand-grey-400 sl-num select-none">01</span>
                <input
                  id="checkout-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={9}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  onBlur={() => setPhoneTouched(true)}
                  aria-invalid={phoneTouched && !phoneValid}
                  aria-describedby="checkout-phone-hint"
                  placeholder="1XX XXX XXXX"
                  className="flex-1 h-full bg-transparent text-[14px] text-brand-grey-900 sl-num placeholder:text-brand-grey-400 outline-none"
                />
              </div>
              <p
                id="checkout-phone-hint"
                className={`text-[12px] mt-1 ${phoneTouched && !phoneValid ? 'text-error' : 'text-brand-grey-400'}`}
              >
                {phoneTouched && !phoneValid
                  ? 'اكتب باقي الرقم — 9 أرقام بعد 01'
                  : 'هنستخدمه للتواصل معاك بخصوص الطلب'}
              </p>
            </div>

            {/* Address — opens Bottom Sheet on tap */}
            <div>
              <label className={labelClass}>{deliveryOption === 'delivery' ? 'عنوان التوصيل' : 'عنوان الاستلام'}</label>
              <button
                type="button"
                onClick={handleOpenAddressSheet}
                className={`w-full h-12 rounded-xl px-3 text-start transition-all flex items-center gap-2 ${
                  addressSaved
                    ? 'border-2 border-success ring-1 ring-success/30'
                    : address
                      ? 'border border-sky-300 ring-1 ring-sky-500/20'
                      : 'border border-brand-grey-200 hover:border-brand-grey-300'
                }`}
              >
                {address ? (
                  <span className="text-[13px] text-navy-800 font-medium truncate">
                    {address}
                  </span>
                ) : (
                  <span className="text-[13px] text-brand-grey-400 truncate">
                    اختر عنوان الاستلام...
                  </span>
                )}
                <ArrowRightLeft className="w-4 h-4 text-brand-grey-400 flex-shrink-0 ms-auto" />
              </button>
              {/* Green confirmation flash */}
              <AnimatePresence>
                {addressSaved && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[12px] text-success font-medium mt-1.5 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>تم حفظ العنوان</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Notes for delivery person */}
            {deliveryOption === 'delivery' && (
              <div>
                <label className={labelClass}>ملاحظات للمندوب (اختياري)</label>
                <input
                  aria-label="ملاحظات للمندوب"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="رقم العمارة، بجوار..."
                  className={inputClass}
                />
              </div>
            )}

            {/* Confirmation note */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <Info className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
              <span className="text-[12px] text-sky-500">سيتم إرسال رمز تأكيد على رقمك</span>
            </div>
          </div>

          {/* حقيقة قابلة للتحقق بدل عدد توصيلات مُختلَق.
              كان: «تم التوصيل لـ 1,250 طالب هذا الشهر» — رقم لا يولّده النظام،
              وبوابة الادعاءات في core/07 §4 تمنعه. */}
          <div className="mt-3 pt-3 border-t border-brand-grey-100">
            <span className="text-[12px] text-brand-grey-500 font-medium flex items-center gap-1.5">
              <Check className="w-3 h-3 flex-shrink-0 text-success" aria-hidden="true" />
              كل بند في الحساب معروض قبل التأكيد — بلا رسوم مخفية
            </span>
          </div>
        </motion.div>

        {/* ─── بيانات الدفع ─── */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
        >
          <h3 className="text-[14px] font-bold text-navy-800">بيانات الدفع</h3>

          <div className="mt-3 space-y-2">
            {paymentMethods.map((method) => {
              const isSelected = selectedPayment === method.id
              return (
                <button data-tap="44" aria-label="تأكيد"
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-start gap-2.5 p-3 rounded-xl transition-all border text-start ${
                    isSelected
                      ? 'bg-sky-50 border-sky-200'
                      : 'bg-white border-brand-grey-200/50 hover:border-brand-grey-300'
                  }`}
                >
                  {/* Radio circle */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'bg-navy-800' : 'border-[1.5px] border-brand-grey-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <method.icon className="w-4 h-4 text-brand-grey-500" aria-hidden="true" />
                      <span
                        className={`text-[13px] font-medium ${isSelected ? 'text-navy-800' : 'text-brand-grey-700'}`}
                      >
                        {method.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-brand-grey-500 mt-1 ms-6 leading-relaxed">
                      {method.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Screenshot upload area — shown only for InstaPay / Vodafone Cash */}
          <AnimatePresence>
            {activePayment.needsUpload && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-brand-grey-100">
                  <label className="text-[12px] font-semibold text-brand-grey-700 mb-2 block">
                    إثبات الدفع (سكرين شوت)
                  </label>

                  {screenshotPreview ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-brand-grey-200 group">
                      <img
                        src={screenshotPreview}
                        alt="إثبات الدفع"
                        className="w-full h-full object-cover"
                      />
                      <button data-tap="44" aria-label="إغلاق"
                        onClick={handleRemoveScreenshot}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-brand-grey-300 hover:border-sky-400 hover:bg-sky-50/50 transition-colors cursor-pointer gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-brand-grey-100 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-brand-grey-400" />
                      </div>
                      <span className="text-[12px] text-brand-grey-500">
                        اضغط لرفع صورة إثبات الدفع
                      </span>
                      <span className="text-[12px] text-brand-grey-400">JPG, PNG</span>
                      <input
                        aria-label="رفع صورة إيصال التحويل"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleScreenshotChange}
                      />
                    </label>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Promo Code — Modeless inline ─── */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-2xl overflow-hidden border border-brand-grey-200/50 shadow-sm"
        >
          <button data-tap="44"
            onClick={() => setShowDiscount(!showDiscount)}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-sky-500" />
              <span className="text-[13px] font-bold text-navy-800">تطبيق كود خصم</span>
              {discountApplied && (
                <span className="text-[12px] bg-success/10 text-success font-semibold px-2 py-0.5 rounded-full">
                  {appliedCodeName}
                </span>
              )}
            </div>
            <svg
              className={`w-4 h-4 text-brand-grey-400 transition-transform duration-200 ${showDiscount || discountApplied ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {(showDiscount || discountApplied) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  {discountApplied ? (
                    /* Applied state — green border + checkmark + discount amount + remove */
                    <div>
                      <div className="flex gap-2">
                        <input
                          aria-label="كود الخصم المُطبَّق"
                          type="text"
                          value={appliedCodeName}
                          readOnly
                          className="flex-1 h-10 bg-teal-50 border-2 border-success rounded-xl px-3 text-[13px] text-teal-800 sl-num font-semibold outline-none cursor-default"
                        />
                        <button data-tap="44"
                          onClick={handleRemoveDiscount}
                          className="h-10 px-3 bg-error-bg text-error border border-error/30 text-[13px] font-semibold rounded-xl transition-colors hover:bg-error-bg flex items-center gap-1.5 tap-44"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>إزالة</span>
                        </button>
                      </div>
                      <p className="text-[12px] text-success font-medium mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        <span>تم تطبيق كود الخصم — وفر {discountAmount}.00 ج.م</span>
                      </p>
                    </div>
                  ) : (
                    /* Unapplied state */
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          aria-label="كود الخصم"
                          value={discountCode}
                          onChange={(e) => { setDiscountCode(e.target.value); setPromoError('') }}
                          placeholder="أدخل كود الخصم"
                          className="flex-1 h-10 bg-brand-grey-50 border border-brand-grey-200 rounded-xl px-3 text-[13px] text-brand-grey-900 sl-num placeholder:text-brand-grey-400 outline-none focus:border-sky-500 transition-colors"
                        />
                        <button data-tap="44"
                          onClick={handleApplyDiscount}
                          className="h-10 px-4 bg-sky-500 text-white text-[13px] font-semibold rounded-xl transition-colors hover:bg-sky-600 tap-44"
                        >
                          تطبيق
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[12px] text-error font-medium mt-1.5 flex items-center gap-1">
                          <X className="w-3 h-3 text-error" />
                          <span>{promoError}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── ملخص الطلب — بطاقة الحساب المعتمدة ─── */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
        >
          <h3 className="text-[14px] font-semibold text-navy-800">ملخص الطلب</h3>
          <p className="text-[12px] text-brand-grey-500 mt-0.5">
            <span className="sl-num">{cartCount}</span> منتج
            {storeCount > 1 ? <> من <span className="sl-num">{storeCount}</span> مكتبات</> : null}
          </p>

          <PricingBreakdown
            totals={totals}
            deliveryOption={deliveryOption}
            lines={cart.map(i => ({ price: i.product.price, quantity: i.quantity, store: i.product.store }))}
            flush
            className="mt-2"
          />

          {discountApplied && discountAmount > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-success-bg px-3 py-2">
              <span className="text-[13px] text-success font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                خصم ({appliedCodeName})
              </span>
              <span className="text-[13px] text-success sl-num font-semibold">
                −{discountAmount} ج.م
              </span>
            </div>
          )}

          {discountApplied && discountAmount > 0 && (
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-brand-grey-300/70">
              <span className="text-[15px] font-bold text-navy-800">بعد الخصم</span>
              <span className="sl-num text-[17px] font-bold text-navy-800">{total} ج.م</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ═══════════════ Sticky CTA ═══════════════ */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-brand-grey-200/50 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex-shrink-0">
        {/* «استرجاع» أُزيل: core/07 يمنع الإعلان عن سياسة إرجاع قبل وجود مستند
            نافذ، و«سريع» وعد زمني بلا سجل P50/P90. الباقي حقيقة قابلة للإثبات. */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-[12px] text-brand-grey-500">
            <Shield className="w-3.5 h-3.5 text-success" aria-hidden="true" />
            <span>الدفع عند الاستلام متاح</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-brand-grey-500">
            <Store className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
            <span>سعر المكتبة الرسمي</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!canPlaceOrder}
          className="w-full h-12 bg-navy-800 text-white text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-navy-700 active:bg-navy-900 disabled:bg-brand-grey-300 disabled:text-brand-grey-500 disabled:cursor-not-allowed"
          onClick={() => {
            /* السلة الفاضية كانت تصل لهنا وتنشئ طلبًا بإجمالي 0.00. */
            if (!canPlaceOrder) {
              toast.error('السلة فاضية — ضيف منتج الأول')
              onNavigate?.('home')
              return
            }
            if (!user) {
              toast.error('سجّل دخولك الأول عشان تقدر تعمل أوردر')
              onNavigate?.('register')
              return
            }
            if (!address && deliveryOption === 'delivery') {
              toast.error('يرجى اختيار عنوان التوصيل')
              return
            }
            // Save order
            const orderNum = `#${1000 + Math.floor(Math.random() * 900)}`
            const now = new Date()
            const dateStr = `اليوم ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'م' : 'ص'}`
            addOrder({
              id: `order-${Date.now()}`,
              orderNumber: orderNum,
              date: dateStr,
              status: 'جاري التحضير',
              statusType: 'active',
              items: cart.map(item => ({
                title: item.product.title,
                store: item.product.store,
                qty: item.quantity,
                price: item.product.price * item.quantity,
              })),
              subtotal,
              serviceFee,
              delivery: deliveryFee,
              total,
              progress: 20,
            })
            onNavigate?.('success')
          }}
        >
          <span>تأكيد الطلب</span>
          <span aria-hidden="true" className="text-white/50">·</span>
          <span className="sl-num font-bold">{total} ج.م</span>
        </button>
        <p className="text-center text-[12px] text-brand-grey-400 mt-2">
          بالضغط على تأكيد الطلب، أنت موافق على{' '}
          <span className="text-sky-600 underline">شروط الاستخدام</span> و{' '}
          <span className="text-sky-600 underline">سياسة الخصوصية</span>
        </p>
      </div>

      {/* ═══════════════ Address Bottom Sheet ═══════════════ */}
      <Drawer
        open={addressSheetOpen}
        onOpenChange={(open) => {
          setAddressSheetOpen(open)
          if (!open) setAddressSheetPhase('list')
        }}
      >
        <DrawerContent className="max-h-[85vh]">
          {/* Accessibility: hidden titles for vaul */}
          <DrawerTitle className="sr-only">
            {addressSheetPhase === 'list' ? 'اختر عنوان التوصيل' : 'إضافة عنوان جديد'}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {addressSheetPhase === 'list' ? 'اختر عنوان محفوظ أو أضف عنوان جديد' : 'أدخل بيانات العنوان الجديد'}
          </DrawerDescription>

          {/* Custom header with close button */}
          <div className="flex items-center justify-between px-4 pt-2 pb-1">
            <h2 className="text-[15px] font-bold text-navy-800">
              {addressSheetPhase === 'list' ? 'اختر عنوان التوصيل' : 'إضافة عنوان جديد'}
            </h2>
            <DrawerClose asChild>
              <button data-tap="44"
                className="w-8 h-8 rounded-full bg-brand-grey-100 flex items-center justify-center text-brand-grey-500 hover:text-brand-grey-700 hover:bg-brand-grey-200 transition-colors tap-44"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </DrawerClose>
          </div>

          <div className="px-4 pb-4 overflow-y-auto">
            <AnimatePresence mode="wait">
              {addressSheetPhase === 'list' ? (
                /* ═══ Phase 1: Saved Addresses List ═══ */
                <motion.div
                  key="address-list"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <p className="text-[13px] text-brand-grey-500 mb-2">
                    اختر عنوان محفوظ أو أضف عنوان جديد
                  </p>

                  {/* Saved address cards */}
                  {savedAddresses.map((addr) => (
                    <button data-tap="44" aria-label="تأكيد"
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-start ${
                        address === `${addr.district}، المدينة`
                          ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-500/20'
                          : 'bg-white border-brand-grey-200/50 hover:border-brand-grey-300'
                      }`}
                    >
                      <addr.icon className="w-5 h-5 text-brand-grey-500 flex-shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-semibold text-navy-800 block">
                          {addr.label}
                        </span>
                        <span className="text-[12px] text-brand-grey-500 block truncate">
                          {addr.district}، المدينة
                        </span>
                      </div>
                      {address === `${addr.district}، المدينة` && (
                        <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}

                  {/* Divider */}
                  <div className="border-t border-brand-grey-200/60 my-2" />

                  {/* Add new address — prominent button */}
                  <button data-tap="44"
                    onClick={() => setAddressSheetPhase('form')}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-sky-300 text-sky-500 hover:bg-sky-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[13px] font-semibold">إضافة عنوان جديد</span>
                  </button>
                </motion.div>
              ) : (
                /* ═══ Phase 2: New Address Form ═══ */
                <motion.div
                  key="address-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* Back to list */}
                  <button data-tap="44"
                    onClick={() => setAddressSheetPhase('list')}
                    className="flex items-center gap-1.5 text-[13px] text-sky-500 font-medium hover:text-sky-600 transition-colors mb-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>العودة للعناوين المحفوظة</span>
                  </button>

                  {/* Address label (optional) */}
                  <div>
                    <label className={labelClass}>تسمية العنوان (اختياري)</label>
                    <input
                      aria-label="اسم العنوان"
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="مثال: البيت، السكن، المكتبة..."
                      className={inputClass}
                    />
                  </div>

                  {/* City — LOCKED to المدينة */}
                  <div>
                    <label className={labelClass}>المدينة</label>
                    <div className="relative">
                      <input
                        aria-label="المدينة"
                        type="text"
                        value="المدينة"
                        disabled
                        readOnly
                        className="w-full bg-brand-grey-100 border border-brand-grey-200 rounded-xl px-3 h-12 text-[13px] text-brand-grey-500 outline-none cursor-not-allowed pe-9"
                      />
                      <Lock className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey-400" />
                    </div>
                    <p className="text-[12px] text-brand-grey-400 mt-1">المدينة محددة تلقائياً — المدينة</p>
                  </div>

                  {/* الحي */}
                  <div>
                    <label className={labelClass}>الحي</label>
                    <input
                      aria-label="الحي"
                      type="text"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      placeholder="مثال: شارع الجامعة، حي الجمهورية..."
                      className={inputClass}
                    />
                  </div>

                  {/* الشارع */}
                  <div>
                    <label className={labelClass}>الشارع / تفاصيل إضافية</label>
                    <input
                      aria-label="الشارع"
                      type="text"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="مثال: أمام مستشفى جامعة المدينة..."
                      className={inputClass}
                    />
                  </div>

                  {/* رقم العمارة — numeric keyboard */}
                  <div>
                    <label className={labelClass}>رقم العمارة (اختياري)</label>
                    <input
                      aria-label="رقم العمارة"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={newBuilding}
                      onChange={(e) => setNewBuilding(e.target.value)}
                      placeholder="مثال: 5"
                      className={inputClass}
                      dir="ltr"
                    />
                  </div>

                  {/* Sticky CTA above keyboard */}
                  <button
                    onClick={handleSaveNewAddress}
                    className="w-full h-12 bg-sky-500 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-sky-600 active:scale-[0.98] mt-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>حفظ واستخدام هذا العنوان</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}