# لماذا لا يوجد `tailwind.config.ts`

المشروع على **Tailwind v4** (`@tailwindcss/postcss`, `tailwindcss@4`). في الإصدار الرابع
الإعداد كله في CSS داخل `@theme` في `src/app/globals.css`، ولا يُقرأ ملف الإعداد
الجافاسكريبتي إلا لو استُدعي صراحةً بـ `@config`.

الملف القديم `tailwind.config.ts` كان **ميتًا تمامًا**: كُتب بصيغة v3، ومسارات
`content` فيه تشير إلى `./pages` و`./components` و`./app` — وهي مجلدات غير موجودة
(الكود كله تحت `./src`). أي مطور يعدّل فيه لن يرى أي أثر. حُذف لهذا السبب.

**كل التوكنز الآن في `src/app/globals.css`** — الألوان والخطوط والزوايا والظلال
والمسافات. مصدرها `deliverables/brand/studylink-identity-v1/02-color/tokens.css`.
