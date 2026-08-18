# دليل نظام التصميم الشامل — ستادي لينك (StudyLink)
## StudyLink Design System — Full Specification

> هذا الدليل يحتوي على كل قواعد التصميم المتفق عليها في التطبيق بالتفصيل.
> أي مصمم يقدر يشتغل من هذا الدليل بشكل مستقل.

---

## ١. نظام الألوان (Color System)

### ١.١ الألوان الأساسية

| الاسم | الكود | الاستخدام |
|------|-------|-----------|
| **Navy-800** | `#132640` | النص الرئيسي، أزرار CTA داكنة، عناوين الأقسام، خلفية الـ badges |
| **Sky-500** | `#2594D2` | الأزرار الرئيسية (CTA)، الحالة النشطة، الـ accents |
| **Sky-400** | `#3DA3D7` | Hover state |
| **Success** | `#2E7D32` | حالة النجاح، زر "تمت الإضافة" |
| **Error** | `#C62828` | الأخطاء، زر الحذف، خصومات |
| **Warning** | `#EF6C00` | التحذيرات |
| **Amber-400** | `#FFB300` | تقييمات النجوم، الـ achievements |

### ١.₂ درجات Navy

| الخطوة | الكود | الاستخدام |
|--------|-------|-----------|
| `navy-50` | `#E8EEF5` | خلفية خفيفة، badges |
| `navy-800` | `#132640` | النص الرئيسي، الأزرار الداكنة |
| `navy-900` | `#0D192B` | عناوين ثانوية، emphasis قوي |

### ١.٣ درجات Sky

| الخطوة | الكود | الاستخدام |
|--------|-------|-----------|
| `sky-50` | `#E9F4FA` | خلفية الـ tabs النشطة، خلفية الـ badges |
| `sky-100` | `#CEE8F5` | خلفيات خفيفة |
| `sky-300` | `#6DBAE1` | shimmer effect |
| `sky-500` | `#2594D2` | اللون الرئيسي للـ CTA |
| `sky-600` | `#1F7CAE` | Active state أغمق |

### ١.٤ درجات Brand-Grey

| الخطوة | الكود | الاستخدام |
|--------|-------|-----------|
| `brand-grey-50` | `#FAFAFA` | خلفية بديلة خفيفة |
| `brand-grey-100` | `#F5F5F5` | خلفية الشاشات، خلفية الأقسام |
| `brand-grey-200` | `#EBEBEB` | الحدود الافتراضية |
| `brand-grey-300` | `#E0E0E0` | الـ dividers، الـ drag handles |
| `brand-grey-400` | `#BDBDBD` | نصوص ثانوية باهتة |
| `brand-grey-500` | `#9E9E9E` | نصوص ثانوية، وصف |
| `brand-grey-600` | `#757575` | نصوص ثانوية معتمدة |
| `brand-grey-700` | `#616161` | نصوص فرعية |
| `brand-grey-800` | `#424242` | نصوص داكنة ثانوية |
| `brand-grey-900` | `#212121` | النص الأساسي |

### ١.٥ ألوان الأقسام (Category Colors)

| القسم | Background | Text | Border |
|-------|-----------|------|--------|
| محاضرات | `bg-navy-800/80` | `text-white` | — |
| أدوات طبية | `bg-teal-50` | `text-teal-900` | `border-teal-200/60` |
| أدوات مكتبية | `bg-amber-50` | `text-amber-900` | `border-amber-200/60` |

### ١.٦ ألوان حالة الطلب

| الحالة | Background | Text |
|--------|-----------|------|
| قيد التحضير | `bg-amber-50` | `text-amber-600` |
| تم الشحن | `bg-sky-50` | `text-sky-600` |
| تم التسليم | `bg-emerald-50` | `text-emerald-600` |
| المتاح | `bg-emerald-50 border border-emerald-200/60` | `text-emerald-600` |

### ١.٧ نظام الـ Dark Mode

التطبيق لا يستخدم `dark:` بل يستخدم CSS Variables مع كلاس `.dark-phone` / `.light-phone`:

| المتغير | Light | Dark |
|---------|-------|------|
| `--phone-bg` | `#F5F5F5` | `#0f172a` |
| `--phone-surface` | `#ffffff` | `#1e293b` |
| `--phone-surface-2` | `#f5f5f5` | `#334155` |
| `--phone-text` | `#132640` | `#f1f5f9` |
| `--phone-text-secondary` | `#6B7280` | `#94a3b8` |
| `--phone-border` | `#e5e7eb` | `#334155` |

### ١.٨ قاعدة ذهبية: ممنوع استخدام الأزرق (Indigo/Blue)

لا تستخدم ألوان Indigo أو Blue في أي مكان من التطبيق. استخدم Navy و Sky فقط.

---

## ٢. الخطوط (Typography)

### ٢.١ عائلات الخطوط

| الخط | الاستخدام | التطبيق |
|------|-----------|---------|
| **Cairo** | النص العربي (الافتراضي) | كل النصوص العربية |
| **Inter** | الأرقام والأسعار والنص الإنجليزي | تُطبق عبر `font-[Inter]` |
| **Geist Mono** | النص الأحادي (Monospace) | أكواد السفراء، OTP |

**أوزان Cairo المحملة**: 300, 400, 500, 600, 700, 800
**أوزان Inter المحملة**: 300, 400, 500, 600, 700

### ٢.٢ أحجام الخطوط (بالبكسل)

| الحجم | الاستخدام |
|-------|-----------|
| `text-[8px]` | حالة المتجر "مغلقة" |
| `text-[9px]` | الفئات، المواصفات، badges صغيرة، عدد الـ bundle |
| `text-[10px]` | العناوين الفرعية، بيانات التعريف، روابط "عرض الكل" |
| `text-[11px]` | الوصف، الـ form labels، محتوى ثانوي |
| `text-[12px]` | النص الأساسي، عناوين الأقسام |
| `text-[13px]` | نص الجسم المعياري، حقول الإدخال |
| `text-[14px]` | عناوين الأقسام، عناوين البطاقات، أزرار CTA |
| `text-[15px]` | عناوين الشيتات (Bottom Sheets) |
| `text-[16px]` | عناوين الشاشات |
| `text-[17px]` | لوجو "StudyLink" في الهيدر |
| `text-[18px]` | الأسعار الكبيرة |
| `text-[20px]` | أسعار الـ product detail |
| `text-[28px]` | رصيد المحفظة (Wallet) |

### ٢.٣ أوزان الخطوط

| الوزن | الكلاس | الاستخدام |
|-------|--------|-----------|
| 400 | `font-normal` | النص العادي |
| 500 | `font-medium` | emphasis ثانوي |
| 600 | `font-semibold` | العناوين الفرعية، الحالة المحددة |
| 700 | `font-bold` | العناوين الرئيسية، الأسعار، CTA |
| 800 | `font-extrabold` | الأسعار البارزة في الـ detail |

### ٢.٤ قاعدة: الأرقام والأسعار دايماً Inter

كل رقم أو سعر في التطبيق لازم يكون بـ `font-[Inter]`. مثال:
```
<span className="font-[Inter] text-[20px] font-extrabold text-navy-800">150.00 ج.م</span>
```

### ٢.٥ ارتفاع السطر

| القيمة | الاستخدام |
|--------|-----------|
| `leading-tight` (1.25) | عناوين البانر، عناوين المنتجات |
| `leading-relaxed` (1.625) | الوصف، النصوص الطويلة، FAQ |
| الافتراضي (1.5) | معظم النصوص |

---

## ٣. الـ Spacing والـ Layout

### ٣.₁ الـ Padding المعياري

| القيمة | الاستخدام |
|-------|-----------|
| `px-4` (16px) | الـ padding الأفقي للشاشات |
| `px-5` (20px) | محتوى الـ Bottom Sheets |
| `px-6` (24px) | شيتات الـ Checkout، الـ OTP |
| `py-2.5` | أزرار الـ size selector |
| `py-3` | أزرار CTA قياسية |
| `py-3.5` | أزرار CTA بارزة |
| `p-3` | محتوى البطاقات (Lectures) |
| `p-2.5` | محتوى البطاقات (Tools) |
| `p-4` | أقسام الـ Checkout، محتوى الشيتات |

### ٣.₂ الـ Gap المعياري

| القيمة | الاستخدام |
|-------|-----------|
| `gap-2` (8px) | شبكة المنتجات (Tools 3-col) |
| `gap-2.5` (10px) | شبكة المنتجات (Lectures 2-col)، الـ horizontal scroll |
| `gap-3` (12px) | عناصر قائمة السلة، الفلاتر |

### ٣.₃ الـ Spacing بين الأقسام

| القيمة | الاستخدام |
|-------|-----------|
| `space-y-2` | حقول الـ Forms |
| `space-y-3` | أقسام الـ Checkout، FAQ |
| `space-y-5` | أقسام الشاشة الرئيسية |

### ٣.₄ ارتفاعات الأزرار

| الارتفاع | الاستخدام |
|----------|-----------|
| `h-8` (32px) | أزرار صغيرة (+/-)، أزرار close |
| `h-9` (36px) | أزرار الهيدر |
| `h-10` (40px) | أزرار الـ back |
| `h-11` (44px) | أزرار الـ Add to cart |
| `h-12` (48px) | أزرار الـ CTA الرئيسية، حقول الإدخال |

---

## ٤. الـ Border Radius

| القيمة | الكلاس | الاستخدام |
|--------|--------|-----------|
| 4px | `rounded` | — |
| 10px | `rounded-lg` | — |
| 12px | `rounded-xl` | البطاقات، الأزرار، الحقول، الـ inputs |
| 16px | `rounded-2xl` | بطاقات المنتجات، الـ Bottom Sheets |
| 24px | `rounded-3xl` | أعلى الـ Bottom Sheets، الـ Splash logo |
| ∞ | `rounded-full` | الـ pills، الـ badges، الأفاتار، النقاط |

---

## ٥. الظلال (Shadows)

### ٥.١ الظلال القياسية

| الظل | الاستخدام |
|------|-----------|
| `shadow-sm` | البطاقات، العناصر الصغيرة |
| `shadow-md` | الأزرار المحددة |
| `shadow-lg` | الـ grade gate |

### ٥.₂ الظلال المخصصة

| الظل | الاستخدام |
|------|-----------|
| `shadow-sm shadow-sky-500/20` | بطاقات الـ Ambassador، CTAs |
| `shadow-sm shadow-sky-500/25` | زر الـ + |
| `shadow-[0_-1px_8px_rgba(0,0,0,0.04)]` | الـ Bottom Nav Bar |
| `shadow-[0_-4px_30px_rgba(0,0,0,0.15)]` | الـ Bottom Sheets |
| `shadow-[0_1px_4px_rgba(0,0,0,0.04)]` | بطاقات الـ Recently Viewed |
| `shadow-[0_8px_25px_rgba(0,0,0,0.1)]` | hover للبطاقات |

---

## ٦. الـ Z-Index Hierarchy

| Z-Index | العنصر |
|---------|---------|
| `z-10` | المحتوى العادي، البطاقات، الـ badges |
| `z-20` | الـ Grade Gate Overlay، الـ Sticky Headers |
| `z-30` | الـ Sticky Headers الثانوية، الـ Player Bottom Bar |
| `z-40` | الـ Bottom Nav Bar، الـ Product Detail Backdrop |
| `z-50` | الـ Backdrop لكل الـ Modals/Sheets |
| `z-[51]` | الـ Library Closed Sheet |
| `z-[60]` | الـ Bottom Sheets (Variants, More, Profile) |
| `z-[70]` | الـ Nested Backdrop |
| `z-[80]` | الـ Nested Sheet (Logout) |
| `z-[100]` | الـ Splash Screen، الـ Toasts |

---

## ٧. نظام الأيقونات

### ٧.₁ مصدر الأيقونات
- **Lucide React** — الأيقونة الأساسية في كل التطبيق
- لا تستخدم أي مكتبة أيقونات أخرى

### ٧.٢ أحجام الأيقونات

| الحجم | الكلاس | الاستخدام |
|-------|--------|-----------|
| 12px | `w-3 h-3` | أيقونات صغيرة inline |
| 14px | `w-3.5 h-3.5` | أيقونات inline ثانوية |
| 16px | `w-4 h-4` | أيقونات معيارية، أقسام الهيدر |
| 18px | `w-[18px] h-[18px]` | أيقونات الهيدر (cart, search) |
| 22px | `w-[22px] h-[22px]` | أيقونات الـ Bottom Nav |

### ٧.₃ الـ Stroke Width

| القيمة | الاستخدام |
|--------|-----------|
| 1.5 | الافتراضي |
| 2.0 | المعياري |
| 2.5 | الحالة النشطة، أزرار الـ quantity |
| 3.0 | علامة الصح المحددة |

---

## ٨. قواعد الـ RTL

### ٨.١ الاتجاه العام
- التطبيق كله `dir="rtl"` على مستوى `<html>` و `PhoneFrame`
- التطبيق موبايل فقط (375×812px — iPhone 15 Pro)
- **لا يوجد responsive breakpoints** داخل التطبيق نفسه

### ٨.₂ الـ Positioning
- الـ `left`/`right` في الـ absolute positioning بتكون physical (مفيش auto-flip)
- `right-3` في RTL = الجانب الأيسر بصرياً
- `left-3` في RTL = الجانب الأيمن بصرياً

### ٨.₃ الـ Gradient Direction
- في RTL، الـ gradient العكسي: `bg-gradient-to-l` (لأنه من اليمين لليسار)
- الأمثلة: `from-sky-400 via-sky-500 to-sky-600`

---

## ٩. قواعد الـ Touch Targets

### ٩.₁ الحد الأدنى
- **الحد الأدنى للعناصر التفاعلية**: `48×48px` (عبر inline `style={{ minWidth: 48, minHeight: 48 }}`)
- **أزرار الـ Bottom Nav**: `52×48px`
- **عناصر القوائم**: `minHeight: 56px`

### ٩.₂ الاستثناءات
- الأزرار الصغيرة (close, filter): `32×32px` (`w-8 h-8`) — معتمدة على `active:scale` كـ feedback
- أزرار الـ quantity في البطاقات: `44×44px` (`w-11 h-11`)

---

## ١٠. نظام الحركة والـ Animation

### ١٠.₁ الـ Bottom Sheet Animation
```
initial: { y: '100%' }
animate: { y: 0 }
exit: { y: '100%' }
transition: { type: 'spring', damping: 28-30, stiffness: 300 }
```

### ١٠.₂ الـ whileTap Scale (حسب الأهمية)

| Scale | الاستخدام |
|-------|-----------|
| `0.85` | أزرار الـ +/-، الحذف، أزرار صغيرة |
| `0.9` | الـ Nav tabs، الهيدر، الـ back |
| `0.93` | أزرار الـ size selector |
| `0.95` | معظم الأزرار والبطاقات |
| `0.97` | الـ product detail، الـ checkout |
| `0.98` | عناصر الـ cart، الـ bundle |

### ١٠.₃ الـ Spring Configs الشائعة

| Stiffness | Damping | الاستخدام |
|-----------|---------|-----------|
| 300 | 20 | الـ Bottom Nav، الـ stagger items |
| 350 | 25 | الـ active tab pill |
| 400 | 20 | الـ quantity number |
| 500 | 30 | الـ price animations |
| 400 | 15 | الـ cart badge، الـ color circle |

### ١٠.٤ الـ Stagger Pattern
```ts
staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05-0.08, delayChildren: 0.05 } }
}
staggerItem = {
  hidden: { opacity: 0, y: 10-12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25-0.3 } }
}
```

### ١٠.٥ الـ CSS Animations الرئيسية

| الاسم | المدة | الاستخدام |
|-------|-------|-----------|
| `shimmer` | 1.5s | الـ Skeleton loading |
| `slideUp` | 0.35s | دخول الـ Bottom Sheet |
| `screenSlideIn` | 0.3s | دخول الشاشات |
| `pulse` | 2s | الـ delivery status dot |
| `float` | 3s | العناصر العائمة |
| `ctaShimmer` | 2.5s | تأثير الـ sweep على الـ CTA |
| `badgeBounce` | 0.5s | bounce للـ badges |

### ١٠.٦ الـ Banner Auto-Scroll
- الفاصل: `4000ms`
- الانتقال: `duration: 0.4, ease: 'easeInOut'`

---

## ١١. الـ Feedback (الردود)

### ١١.₁ الاهتزاز (Haptic)

| المدة | الحدث |
|-------|-------|
| 10ms (خفيف) | +/- quantity، حذف من السلة |
| 25ms (متوسط) | الـ quantity control |
| 30ms (قياسي) | إضافة للسلة، toggle الـ wishlist، اختيار عنصر |

### ١١.₂ الـ Toast (ممنوع في الـ Product Detail)

الـ toasts تستخدم فقط في العمليات التي محتاجة تأكيد واضح. في الـ Product Detail نستخدم:
- **Haptic vibration** + **Visual flash** (تغيّر الزر للأخضر "تمت الإضافة")

### ١١.₃ الـ Toast Style
```ts
{ fontFamily: "'Cairo', sans-serif", direction: 'rtl', fontSize: '12px', duration: 2000 }
```

---

## ١٢. نظام الـ Bottom Sheet

### ١٢.١ الهيكل التشريحي
```
fixed inset-0 z-50 bg-black/40          ← Backdrop
fixed bottom-0 left-0 right-0 z-[60]    ← Sheet
  └─ rounded-t-3xl bg-white
     └─ shadow-[0_-4px_30px_rgba(0,0,0,0.15)]
        └─ pt-2.5 pb-1                  ← Drag Handle: w-10 h-1 rounded-full bg-brand-grey-300
        └─ px-4 / px-5 / px-6           ← Content padding
        └─ overflow-y-auto phone-scroll ← Scrollable content
```

### ١٢.₂ الـ Animation
- `initial: { y: '100%' }`, `animate: { y: 0 }`, `exit: { y: '100%' }`
- Spring: `damping: 28-30, stiffness: 300`

### ١٢.₃ زر الإغلاق
- `absolute top-4 left-4 w-8 h-8 rounded-full bg-brand-grey-100`
- Icon: `X` `w-4 h-4 text-brand-grey-600`

### ١٢.₄ أنواع الـ Backdrop
- `bg-black/30` — خفيف (VariantSelection, Register)
- `bg-black/40` — معياري (معظم الشيتات)
- `bg-black/50` — ثقيل (Radix UI)

---

## ١٣. الـ Bottom Navigation Bar

### ١٣.₁ الهيكل
```
sticky bottom-0 z-40
bg-white/95 backdrop-blur-md
border-t border-brand-grey-200/60
px-2 pt-1.5
shadow-[0_-1px_8px_rgba(0,0,0,0.04)]
paddingBottom: max(4px, env(safe-area-inset-bottom, 4px))
```

### ١٣.٢ التبويبات
- الرئيسية (Home) | المحاضرات (BookOpen) | سفراء SL (Users) | حسابي (User) | المزيد (Menu ☰)
- `minWidth: 52px, minHeight: 48px`
- `py-2 px-3.5 rounded-2xl`

### ١٣.٣ الحالة النشطة
- **خلفية**: `bg-sky-50 rounded-2xl -z-10` مع `layoutId="active-tab-pill"`
- **الأيقونة**: `text-sky-500`, `strokeWidth={2.5}`, `scale: 1.1`
- **النص**: `text-[10px] font-medium text-sky-500`

### ١٣.٤ الحالة غير النشطة
- **الأيقونة**: `text-brand-grey-400`, `strokeWidth={2}`
- **النص**: `text-[10px] font-medium text-brand-grey-400`

### ١٣.٥ الفاصل
- `w-px h-6 bg-brand-grey-200/60 mx-1` قبل "المزيد"

### ١٣.٦ الـ Home Indicator
- `w-[134px] h-[4px] bg-gradient-to-l from-brand-grey-300/40 to-transparent rounded-full`

### ١٣.٧ نقطة التحذير على البروفايل
- `w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-white` مع pulse

---

## ١٤. نظام البطاقات (Cards)

### ١٤.₁ البطاقة القياسية
```
bg-white rounded-2xl overflow-hidden
shadow-sm border border-brand-grey-200/50
```

### ١٤.₂ بطاقة المحاضرة (2-col Grid)
- الصورة: `aspect-[4/3]` أو `aspect-square`
- المحتوى: `p-3`
- السعر: `mt-3 pt-2 border-t border-brand-grey-200/50`
- زر الإضافة: `w-12 h-12 rounded-xl bg-sky-500 text-white`

### ١٤.₃ بطاقة الأداة (3-col Grid)
- الصورة: `aspect-square bg-brand-grey-50`
- المحتوى: `p-2.5`
- الـ category badge: `absolute top-1 right-1 text-[7px]`
- زر الإضافة: `w-8 h-8 rounded-full bg-sky-500`

### ١٤.٤ الـ Skeleton Card
- `bg-white rounded-2xl p-3 shadow-sm w-[155px]`
- الصورة: `w-[120px] h-[90px] rounded-xl bg-brand-grey-200 animate-pulse`

---

## ١٥. نظام الأزرار

### ١٥.١ CTA أساسي (Sky)
```
bg-sky-500 text-white font-bold text-[14px]
py-3.5 rounded-xl
active:scale-[0.98] transition-transform
shadow-lg shadow-sky-500/25
```

### ١٥.₂ CTA أساسي (Navy)
```
bg-navy-800 text-white font-bold text-[14px]
py-3.5 rounded-2xl
active:scale-[0.98]
shadow-lg shadow-navy-800/20
```

### ١٥.₃ CTA معطل
```
bg-brand-grey-200 text-brand-grey-400 cursor-not-allowed
```

### ١٥.٤ زر ثانوي (Outline)
```
border border-brand-grey-200/60 rounded-xl
px-3 py-2 text-[11px] font-bold
bg-white text-navy-800
hover:border-sky-400 hover:text-sky-700
```

### ١٥.٥ زر إجراء صغير
```
w-8 h-8 rounded-full bg-brand-grey-100 text-navy-800
active:scale-95 transition-transform
```

### ١٥.٦ زر الـ Header
```
w-9 h-9 rounded-full bg-brand-grey-100
```

---

## ١٦. نظام الـ Badges والـ Pills

### ١٦.₁ Badge المادة
```
text-[9px] font-semibold px-2 py-0.5 rounded-full
bg-navy-800/80 text-white backdrop-blur-sm
```

### ١٦.₂ Badge القسم
```
text-[9px] font-semibold px-2 py-0.5 rounded-full
bg-teal-50 text-teal-900  (أدوات طبية)
bg-amber-50 text-amber-900  (أدوات مكتبية)
```

### ١٦.₃ Badge الخصم
```
text-[8px] font-bold font-[Inter] bg-error text-white
px-1 py-px rounded  (في الـ Tools)
```

### ١٦.₄ Badge الـ Bundle
```
text-[8px] font-bold px-1.5 py-0.5 rounded-md
bg-navy-800 text-white  +  أيقونة Layers
```

### ١٦.٥ Badge الجديد
```
text-[8px] font-bold px-1.5 py-0.5 rounded-md
bg-emerald-500 text-white
```

### ١٦.٦ Cart Count Badge
```
absolute -top-0.5 -right-0.5
min-w-[16px] h-[16px]
bg-sky-500 text-white text-[9px]
font-bold font-[Inter] px-0.5
rounded-full shadow-sm shadow-sky-500/30
```

---

## ١٧. نظام الـ Filters والـ Tabs

### ١٧.₁ النمط المعياري (Pills)

**غير نشط:**
```
bg-brand-grey-100 text-brand-grey-500
rounded-full px-3 py-1.5 text-[10px] font-semibold
```

**نشط:**
```
bg-navy-800 text-white shadow-sm
rounded-full px-3 py-1.5 text-[10px] font-semibold
```

### ١٧.٢ الـ Subject Chips (المكتبة)

**غير نشط:**
```
bg-white border border-brand-grey-200/60
rounded-xl px-3.5 py-1.5 text-[11px] text-navy-800
```

**نشط:**
```
bg-navy-800 text-white border-navy-800
```

### ١٧.٣ الـ FAQ Tabs

**نشط:**
```
bg-sky-500 text-white rounded-full
px-3.5 py-1.5 text-[11px] font-semibold
```

---

## ١٨. نظام حقول الإدخال (Inputs)

### ١٨.١ الحقل القياسي
```
w-full bg-white border border-brand-grey-200 rounded-xl
px-3 h-12 text-[13px] text-brand-grey-900 font-[Inter]
placeholder:text-brand-grey-300
outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20
transition-colors
```

### ١٨.٢ حقل مع أيقونة
```
bg-brand-grey-50 border border-brand-grey-200/60 rounded-xl
pr-10 pl-4 py-3 text-[13px] text-navy-900
focus:border-sky-400 focus:ring-2 focus:ring-sky-100
```

### ١٨.٣ حقل الـ OTP
```
w-14 h-14 text-center text-2xl font-bold
rounded-xl border-2 border-navy-800
text-navy-800 bg-white focus:border-sky-500
font-[Inter]
```

### ١٨.٤ الـ Form Label
```
text-[11px] font-semibold text-brand-grey-700 mb-1.5 block
```

---

## ١٩. نظام الـ Empty States

| الحقل | الحاوية | العنوان | الوصف | CTA |
|-------|---------|---------|-------|-----|
| السلة | أيقونة `ShoppingBag w-16 h-16 text-brand-grey-300` | `text-[15px] font-bold` | `text-[12px] text-brand-grey-500` | `bg-sky-500 text-white text-[13px] px-6 py-2.5 rounded-xl` |
| المفضلة | قلب `w-9 h-9` في دائرة `w-20 h-20 rounded-full bg-brand-grey-100` | `text-[15px] font-bold` | `text-[12px] text-brand-grey-500` | نفس نمط السلة |
| الطلبات | `Package w-7 h-7` في `w-14 h-14 rounded-2xl bg-brand-grey-100` | `text-[13px] font-semibold` | `text-[11px] text-brand-grey-400` | `bg-sky-500 text-white text-[12px] px-5 py-2.5 rounded-xl` |
| البحث | `Search w-8 h-8` في `w-20 h-20 rounded-2xl bg-brand-grey-200/50` | `text-[16px] font-bold` | `text-[12px] text-brand-grey-400` | `bg-sky-500 text-white text-[12px] px-5 py-2 rounded-xl` |

---

## ٢٠. نظام الـ Scroll

### ٢٠.١ `phone-scroll` (الشريط الرفيع)
- عرض: `3px`
- لون: `#BDBDBD`، hover `#9E9E9E`
- يُستخدم في كل المناطق القابلة للتمرير داخل التطبيق

### ٢٠.₂ `no-scrollbar` (بدون شريط)
- يُستخدم في الـ horizontal scroll carousels
- `overflow-x-auto no-scrollbar`

### ٢٠.₃ الـ Snap Scroll
- يُستخدم فقط في الـ Onboarding
- `snap-x snap-mandatory` مع `snap-center`

---

## ٢١. الـ Phone Frame

### ٢١.١ المواصفات
- **الأبعاد**: 375×812px (iPhone 15 Pro)
- **Border Radius**: 52px
- **الحد**: 8px solid مع gradient
- **الخلفية**: `#F5F5F5`

### ٢١.٢ الـ Dynamic Island
- `120×36px`، `top: 12px`، `border-radius: 9999px`، `z-index: 50`

### ٢١.٣ الـ Home Indicator
- `140×4px`، `bottom: 8px`، `bg: #212121`، `border-radius: 9999px`

---

## ٢٢. قواعد كل شاشة بالتفصيل

### ٢٢.١ الشاشة الرئيسية (HomeScreen)
- **الهيدر**: `sticky top-0 z-20 bg-white px-4 pb-2.5 pt-9 border-b`
- **البانر**: `w-full h-[152px] rounded-2xl overflow-hidden`
- **تبديل المكتبة**: `bg-brand-grey-100 rounded-xl p-1`، النشط: `bg-navy-800 text-white rounded-lg`
- **عنوان القسم**: `text-[14px] font-bold text-navy-800` + شريط `w-1 h-4 rounded-full bg-sky-500`
- **شبكة المحاضرات**: `grid grid-cols-2 gap-2.5`
- **الأسفل**: BottomNavBar + `pb-20`

### ٢٢.₂ شاشة المكتبة (LibraryScreen)
- **الهيدر**: `sticky top-0 z-20 bg-white/95 backdrop-blur-md`
- **أزرار المادة**: `bg-white border border-brand-grey-200/60 rounded-xl px-3.5 py-1.5 text-[11px]`
- **شبكة المحاضرات**: `grid grid-cols-2 gap-2.5 px-4`
- **شبكة الأدوات**: `grid grid-cols-3 gap-2.5 px-4`
- **Scroll Spy**: الـ pills بتتتبع القسم اللي واصل للمستخدم

### ٢٢.٣ شاشة المحاضرات (LecturesScreen)
- **الهيدر**: `sticky top-0 z-30 bg-white px-4 pt-9 pb-2.5`
- **أزرار نوع المحتوى**: `rounded-full px-3 py-1.5 text-[10px] font-semibold`
- **النشط مع العداد**: `bg-white/20 px-1.5 py-px rounded-full text-[8px] font-bold font-[Inter]`
- **الشبكة**: `grid grid-cols-2 gap-2.5`

### ٢٢.٤ شاشة الأدوات (ToolsScreen)
- **الهيدر**: نفس المحاضرات
- **الشبكة**: `grid grid-cols-3 gap-2.5`
- **الـ category badge**: `absolute top-1 right-1 text-[7px] font-semibold`
- **غير متوفر**: `opacity-50`

### ٢٢.٥ شاشة السلة (CartScreen)
- **الهيدر**: `sticky top-0 z-30 bg-white px-4 pt-9 pb-3`
- **عنصر السلة**: `p-3.5 flex gap-3`، صورة `w-14 h-14 rounded-xl`
- **الشريط السفلي**: `sticky bottom-0 bg-white border-t p-4`
- **CTA**: `h-12 bg-sky-500 text-white text-[14px] font-semibold rounded-xl`

### ٢٢.٦ شاشة الدفع (CheckoutScreen)
- **قسم**: `bg-white rounded-2xl shadow-sm border border-brand-grey-200/50`
- **طريقة الدفع**: `h-12 rounded-xl border-2`، المحدد: `border-sky-500 bg-sky-50`
- **CTA**: `w-full h-12 bg-sky-500 text-white text-[14px] font-bold rounded-xl`

### ٢٢.٧ شاشة الـ Product Detail (Bottom Sheet)
- **الصورة**: `aspect-[4/3] rounded-t-2xl`
- **السعر**: `text-[20px] font-extrabold text-navy-800 font-[Inter]`
- **اختيار المقاس**: `flex-1 py-2.5 rounded-xl text-[13px] font-semibold border`، المحدد: `bg-navy-800 text-white`
- **دائرة اللون**: `w-10 h-10 rounded-full border-2`، المحدد: `border-sky-500 ring-2 ring-sky-500/30`
- **الـ CTA**: إذا variants — inline size/color في المحتوى + زر في الـ sticky bar

### ٢٢.٨ شاشة الدردشة (ChatSupportScreen)
- **رسالة المستخدم**: `rounded-2xl rounded-bl-md bg-sky-500 text-white px-4 py-3`
- **رسالة البوت**: `rounded-2xl rounded-br-md bg-white px-4 py-3 shadow-sm`
- **الـ typing indicator**: 3 نقاط `w-2 h-2 rounded-full bg-sky-400` متحركة

### ٢٢.٩ شاشة الـ Profile
- **الأفاتار**: `w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-sky-600`
- **الـ Toggle**: `w-11 h-6 rounded-full`، on: `bg-sky-500`، off: `bg-brand-grey-300`
- **قائمة**: `mx-4 rounded-2xl bg-white shadow-sm border`، صف: `minHeight: 56`

### ٢٢.١٠ شاشة السفراء (Ambassador)
- **الهيدر**: `bg-gradient-to-l from-navy-800 to-sky-900 px-4 pt-9 pb-6`
- **كود الإحالة**: `bg-navy-800 text-white rounded-xl px-4 py-2.5 font-mono text-[15px]`

---

## ٢٣. الـ Navigation Architecture

### ٢٣.₁ التبويبات الرئيسية (dائمًا مركبة)
| ID | الاسم | الأيقونة |
|----|-------|---------|
| `home` | الرئيسية | Home |
| `lectures` | المحاضرات | BookOpen |
| `ambassador` | سفراء SL | Users |
| `profile` | حسابي | User |
| `more` | المزيد | Menu (hamburger) |

### ٢٣.٢ الشاشات الثانوية (تُعرض عند الطلب)
`cart`, `wallet`, `checkout`, `success`, `search`, `bundle`, `tracking`, `my-orders`, `wishlist`, `notifications`, `chat`, `faq`, `about`, `tools`, `rate`, `achievements`, `otp`, `onboarding`, `register`

### ٢٣.٣ التوجيه الديناميكي
- `library-harvard` → LibraryScreen (مكتبة هارفرد)
- `library-berlin` → LibraryScreen (مكتبة برلين)
- `library-cat-{storeSlug}:{subjectName}` → LibraryCategoryScreen

---

## ٢٤. الـ State Management (Zustand)

### ٢٤.١ الـ Slices المُخزّنة
- `user` — بيانات المستخدم
- `cart` — عناصر السلة (مع `variantKey` للمنتجات ذات المتغيرات)
- `orders` — الطلبات المحفوظة
- `darkMode` — الوضع الليلي
- `deliveryOption` — `delivery` أو `pickup`
- `selectedGrade` — الفرقة المحددة
- `notifications` — الإشعارات
- `recentlyViewed` — آخر المنتجات المُشاهدة (حد أقصى 20)

### ٢٤.₂ الرسوم
- **رسوم الخدمة**: 5 ج.م (ثابت)
- **رسوم التوصيل**: 25 ج.م (لو `deliveryOption === 'delivery'`)

---

## ٢٥. الـ Safe Area

- `paddingBottom: max(4px, env(safe-area-inset-bottom, 4px))` — الـ Bottom Nav
- لا يوجد `safe-area-inset-top` — الـ phone frame بيتعامل مع المنطقة يدويًا

---

## ٢٦. قواعد عامة يجب اتباعها

### ٢٦.١ ممنوع
- ❌ استخدام Indigo/Blue كألوان
- ❌ فتح Bottom Sheet فوق Bottom Sheet (الـ variants تكون inline)
- ❌ استخدام Toast/Modal كـ feedback في الـ Product Detail (استخدم Haptic + Visual)
- ❌ استخدام `h-full` في الـ DarkModeWrapper (استخدم `min-h-full`)
- ❌ أزرار أقل من 32×32px بدون `active:scale` feedback
- ❌ استخدام أي مكتبة أيقونات غير Lucide
- ❌ الـ centered modals — استخدم Bottom Sheet دائمًا

### ٢٦.٢ لازم
- ✅ كل الأرقام والأسعار بـ `font-[Inter]`
- ✅ كل الشاشات `dir="rtl"`
- ✅ كل الـ Bottom Sheets لازم يكون فيها Drag Handle و Backdrop
- ✅ كل الأزرار التفاعلية لازم يكون فيها `whileTap` أو `active:scale`
- ✅ كل الـ CTA buttons ارتفاعها `h-12` (48px)
- ✅ الـ Footer لازم يكون sticky للأسفل
- ✅ الـ Sticky Footer يتم تحقيقه بـ `min-h-screen flex flex-col` + `mt-auto` على الـ footer