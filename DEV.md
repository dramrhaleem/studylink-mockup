<div dir="rtl">

# دليل التعديل البرمجي

كل حاجة في المشروع ده ليها **مكان واحد** بتتعدّل منه. الدليل ده بيقولك المكان ده فين.

---

## ١. مرة واحدة

```bash
cd "/media/amro/Data2/StudyLink P/outputs/studylink-mockup-pages"
npm install --legacy-peer-deps
```

## ٢. حلقة الشغل اليومية

```bash
npm run dev
```

افتح <http://localhost:3000> — أي تعديل تحفظه بيظهر فورًا من غير ريفريش.

للانتقال لشاشة بعينها وأنت بتشتغل عليها: `http://localhost:3000/?screen=checkout`

## ٣. النشر

```bash
git add -A
git commit -m "وصف التعديل"
git push
```

خلاص. الـworkflow بيبني وينشر لوحده، والموقع بيتحدّث خلال ~٢ دقيقة على
<https://dramrhaleem.github.io/studylink-mockup/>

تابع البناء من: <https://github.com/dramrhaleem/studylink-mockup/actions>

---

## ٤. خريطة: «عايز أغيّر كذا» ← «روح فين»

### أغيّر لون

`src/app/globals.css` — بس. كله جوه `@theme`.

```css
--color-navy-800: #13253A;   /* اللون الأساسي — العناوين والأزرار */
--color-sky-500:  #17699F;   /* الأزرق التفاعلي */
--color-brand-grey-100: #F2EEE3;  /* خلفية التطبيق */
```

**ممنوع** تكتب لون في ملف شاشة. لو محتاج لون مش موجود، ضيفه هنا الأول.
حتى `emerald` و`violet` وباقي ألوان Tailwind معرّفة هنا وبتشاور على ألوان البراند —
فمفيش لون ممكن يخرج بره النظام بالغلط.

بعد أي تغيير لون: `npm run audit:ui` — لو رقم «off-brand colours» طلع فوق صفر يبقى في لون خارج اللوحة.

### أغيّر سعر أو رسم

`src/lib/pricing.ts` — الملف ده هو **المصدر الوحيد** لأي رقم مالي.

```ts
export const SERVICE_FEE = {
  rate: 0.10,        // النسبة
  min: 3,            // الحد الأدنى
  max: 8,            // الحد الأقصى
  scope: 'per-store' // لكل مكتبة | 'per-order' لمرة واحدة على الإجمالي
}

export const PRICING = {
  deliveryFee: 25,   // التوصيل
  pickupFee: 0,      // الاستلام
  ...
}
```

غيّر الرقم هنا، وكل الشاشات (السلة، الدفع، نجاح الطلب) بتتحدّث لوحدها.
**ما تحسبش أي مبلغ جوه شاشة** — كله بيعدّي على `computeOrderTotals()`.

**عروض:**
```ts
export const PRICING_FLAGS = {
  launchFreeDelivery: false,  // خلّيها true = توصيل مجاني
  examSeason: false,          // خلّيها true = لافتة فترة الامتحانات
}
```

### أضيف أو أعدّل منتج

`src/lib/studylink-data.ts` — مصفوفة `products`.

```ts
{
  id: 'p-101',
  title: 'تشريح — أطلس ملون',
  store: 'هارفرد',              // 'هارفرد' | 'برلين'
  category: 'محاضرات',           // 'محاضرات' | 'أدوات طبية' | 'أدوات مكتبية'
  price: 50,
  available: true,
  doctor: 'د. نورهان السيد',
  subject: 'تشريح',
  year: 'الفرقة الأولى',
  pages: 48,
  image: asset('/products/anatomy-notes.png'),   // لازم asset()
}
```

⚠️ **أي مسار صورة لازم يتلفّ في `asset()`** وإلا هيبقى 404 على الموقع المنشور.

### أعدّل شاشة

`src/components/studylink/screens/<اسم الشاشة>.tsx`

| الشاشة | الملف |
|---|---|
| الرئيسية | `HomeScreen.tsx` |
| السلة | `CartScreen.tsx` |
| الدفع | `CheckoutScreen.tsx` |
| المحاضرات | `LecturesScreen.tsx` |
| تتبع الطلب | `TrackingScreen.tsx` |
| حسابي | `ProfileScreen.tsx` |
| المحفظة | `WalletScreen.tsx` |
| السفراء | `AmbassadorScreen.tsx` |
| المزيد | `MoreScreen.tsx` |

### أضيف شاشة جديدة

1. اعمل الملف في `src/components/studylink/screens/MyScreen.tsx`
2. سجّلها في `src/app/page.tsx`: `import` فوق، و`case 'my-screen': return <MyScreen onNavigate={navigate} />` جوه `renderSecondaryScreen`
3. تبقى شغّالة على `/?screen=my-screen`

### أعدّل شريط التنقّل السفلي

`src/components/studylink/BottomNavBar.tsx` — مصفوفة `tabs` في أول الملف.

### أضيف صورة منتج

الصور **متولّدة من كود** مش مرفوعة:

```bash
node scripts/gen-product-art.mjs     # منتجات
node scripts/gen-banner-art.mjs      # بانرات + علامات المكتبات
```

ضيف مدخل جديد في `ART` جوه السكريبت وشغّله. لو عايز ترفع صورة حقيقية بدل الرسم،
حطها في `public/products/` وأشّر عليها من `studylink-data.ts` بـ`asset('/products/اسمها.png')`.

---

## ٥. ١٠ قواعد لو كسرتها هتلاقي باج غريب

هي مش تفضيلات — كل واحدة فيهم كانت باج حقيقي اتصلّح.

1. **أي رقم معروض يتلفّ في `.sl-num`.**
   ```jsx
   <span className="sl-num">{price}</span> ج.م
   ```
   من غيرها الخوارزمية ثنائية الاتجاه بتقلب ترتيب الرقم والعملة في الجملة العربية.
   ⚠️ وما تحطهاش على حقل نص عربي حر — خط الأرقام لاتيني أحادي المسافة وما بيوصّلش الحروف.

2. **أي أصل من `public/` يعدّي على `asset()`.** المسار المطلق ما بيحترمش
   `basePath`، فكل الصور بتقع بصمت بعد النشر بس شغّالة محليًا.

3. **أرقام غربية `0-9` دايمًا.** ممنوع `toLocaleString('ar-EG')`.

4. **ممنوع `tracking-*` على العربي.** أي `letter-spacing` موجب بيفتح فجوة جوه
   الوصل ويكسر الكلمة.

5. **RTL بخصائص منطقية:** `ms-*` `me-*` `ps-*` `pe-*` `start-*` `end-*` —
   مش `ml-*` `mr-*` `left-*` `right-*`.

6. **`translateX` فيزيائية مش منطقية.** في RTL الحركة للأمام **سالبة**:
   `animate={{ x: on ? -20 : 0 }}`.

7. **الحد الأدنى للخط:** 12px لعناصر الواجهة، 13px للمتن.

8. **الأزرار الصغيرة تاخد `data-tap="44"`** — بيوسّع منطقة اللمس من غير ما يغيّر الشكل.

9. **الشرائط الأفقية تاخد `rail-gutter`** — حشو نهاية حاوية التمرير بيتلغي من محرّك
   التخطيط، فآخر كارت بيتقص على حافة الشاشة.

10. **الاسم المعروض `StudyLink` باللاتيني دايمًا.** «ستادي لينك» مرفوضة.

---

## ٦. قبل ما تدفع — تحقّق

```bash
npm run audit:ui     # لازم npm run dev شغّال في تيرمنال تاني
```

القيم المرجعية:

```
contrast failures : 6
touch < 44px      : 7
unnamed controls  : 18
horizontal overflow: 0
off-brand colours : 0
```

**أي رقم يعلى عن ده = انحدار في تعديلك.** الاتنين الأخرانيين لازم يفضلوا صفر.

```bash
npx tsc --noEmit                  # أخطاء الأنواع
STATIC_EXPORT=1 npm run build     # بناء زي اللي على GitHub بالظبط
npm run shots                     # لقطة لكل الشاشات للمقارنة البصرية
```

---

## ٧. لو حاجة وقعت

| العرض | السبب غالبًا |
|---|---|
| الصور شغّالة محليًا ومش شغّالة على الموقع | مسار من غير `asset()` |
| العربي بيتقطّع أو حروفه منفصلة | `sl-num` على نص عربي، أو `tracking-*` |
| الرقم والعملة مقلوبين | نسيت `.sl-num` |
| حاجة اتحركت للناحية الغلط | `translateX` موجب في RTL |
| البناء بيفشل على GitHub وشغّال محليًا | جرّب `STATIC_EXPORT=1 npm run build` — التصدير الثابت أصرم |
| كل الملفات باينة معدّلة في git | `git config core.fileMode false` (القرص الخارجي بيجبر وضع 755) |

---

## ٨. لو عايز ترجع لورا

```bash
git log --oneline           # تاريخ التعديلات
git diff                    # اللي غيّرته ولسه ما عملتش commit
git checkout -- <ملف>       # ارجع الملف لآخر commit
git revert <hash>           # الغِ commit اتنشر خلاص
```

---

## ٩. الملفات المرجعية

| الملف | فيه إيه |
|---|---|
| `UPGRADE-REPORT.md` | كل باج اتصلّح وليه — اقراه قبل ما تعدّل في حاجة أساسية |
| `DESIGN-SYSTEM.md` | نظام التصميم بالتفصيل |
| `TAILWIND-NOTE.md` | ليه مفيش `tailwind.config.ts` |
| `README.md` | نظرة عامة والتشغيل |

</div>
