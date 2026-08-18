/**
 * يبني مسار أصل من `public/` مع احترام `basePath`.
 *
 * لماذا هذا موجود: `basePath` في Next يُطبَّق تلقائيًا على `_next/*` وعلى
 * `next/link`، لكنه **لا يُطبَّق** على مسار `/…` تمرّره لـ`next/image` (خاصة
 * مع `unoptimized`) ولا على مسارات الأيقونات في `metadata`. عند النشر داخل
 * مجلد مستودع على GitHub Pages تصير كل صورة 404 بينما يعمل باقي الموقع —
 * عطل صامت يظهر فقط بعد النشر.
 *
 * القاعدة: أي مسار يبدأ بـ`/` ويشير لملف في `public/` يمرّ من هنا.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string): string {
  if (!path.startsWith('/')) return path
  return `${BASE}${path}`
}
