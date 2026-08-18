import localFont from 'next/font/local'

/**
 * الخطوط تُحمَّل عبر `next/font/local` لا عبر `@font-face` بمسار مطلق.
 *
 * السبب: النشر على GitHub Pages داخل مجلد المستودع يعني `basePath` مثل
 * `/studylink-mockup`. مسار مطلق مكتوب داخل CSS (`url('/fonts/…')`) **لا**
 * يُعاد كتابته بالبادئة، فيسقط الخط بصمت ويعود المتصفح لخط النظام — والعربية
 * تبدو مختلفة تمامًا بلا أي خطأ ظاهر. مُحمِّل الخطوط في Next يُخرج الملفات
 * تحت `_next/static/media/` ويولّد `@font-face` بالبادئة الصحيحة تلقائيًا،
 * ويضيف `preload` بنفسه.
 *
 * المصدر والرخص: deliverables/brand/studylink-identity-v1/03-type
 * (IBM Plex Sans Arabic و IBM Plex Mono — SIL OFL 1.1، الاسم مُعاد تسميته
 * لأن «Plex» اسم خط محجوز والاشتقاق يُعد تعديلًا).
 */
export const studylinkArabic = localFont({
  src: [
    { path: './fonts/StudyLinkArabic-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/StudyLinkArabic-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/StudyLinkArabic-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-studylink-arabic',
  display: 'swap',
  fallback: ['IBM Plex Sans Arabic', 'Segoe UI Arabic', 'system-ui', 'sans-serif'],
})

export const studylinkMono = localFont({
  src: [
    { path: './fonts/StudyLinkMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/StudyLinkMono-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-studylink-mono',
  display: 'swap',
  fallback: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
})
