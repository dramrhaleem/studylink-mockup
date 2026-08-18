import type { NextConfig } from "next";

/**
 * وضعان للبناء:
 *
 * - الافتراضي: `standalone` — خادم Node للتشغيل المحلي أو على أي استضافة.
 * - `STATIC_EXPORT=1`: تصدير ثابت (HTML + أصول فقط) للنشر على GitHub Pages.
 *
 * `NEXT_PUBLIC_BASE_PATH` يضبط بادئة المسار حين ينشر الموقع داخل مجلد مستودع
 * (`https://<user>.github.io/<repo>/`). يضبطها ملف `.github/workflows/deploy.yml`
 * تلقائيًا من اسم المستودع، فلا يحتاج أحد لتعديل هذا الملف يدويًا.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  /* GitHub Pages يخدم `/x/` لا `/x`. */
  trailingSlash: isStaticExport,

  /* كان `ignoreBuildErrors: true` يخفي أخطاء أنواع حقيقية (وكانت موجودة
     فعلًا: أسعار `undefined` تدخل عمليات حسابية، ونوع مكتبة خاطئ في قائمة
     الأمنيات). المشروع الآن نظيف، فالبوابة مفتوحة. */
  typescript: {
    ignoreBuildErrors: false,
  },

  reactStrictMode: true,

  /* لا خادم لتحسين الصور في التصدير الثابت. */
  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ["*"],
};

export default nextConfig;
