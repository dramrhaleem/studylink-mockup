/**
 * أصول الهوية القابلة للتنزيل — المصدر الوحيد لما يُعرض في قسم البراند بوك.
 *
 * كل ما هنا **مأخوذ كما هو** من حزمة الهوية المعتمدة
 * `deliverables/brand/studylink-identity-v1` (القرار `D-033`). لا يُعاد رسمه
 * ولا يُقارَب: القسم السابق كان يعيد بناء نظام التصميم يدويًا في ١٤٢٤ سطرًا،
 * فصار نسخة ثانية تختلف عن المصدر بمرور الوقت. الآن الصفحة تُقدّم المصدر نفسه.
 */

/** أيقونات النظام الأصلية — ٣٥ أيقونة، كلها `currentColor` و`stroke-width: 2`. */
export const NATIVE_ICONS: { file: string; label: string }[] = [
  { file: 'alert',      label: 'تنبيه' },
  { file: 'back',       label: 'رجوع' },
  { file: 'bag',        label: 'حقيبة' },
  { file: 'book',       label: 'مذكرة' },
  { file: 'card',       label: 'بطاقة' },
  { file: 'cash',       label: 'نقدًا' },
  { file: 'category',   label: 'تصنيف' },
  { file: 'chat',       label: 'محادثة' },
  { file: 'check',      label: 'تم' },
  { file: 'clock',      label: 'وقت' },
  { file: 'close',      label: 'إغلاق' },
  { file: 'courier',    label: 'مندوب' },
  { file: 'delivery',   label: 'توصيل' },
  { file: 'filter',     label: 'فلتر' },
  { file: 'library',    label: 'مكتبة' },
  { file: 'link',       label: 'رابط' },
  { file: 'minus',      label: 'نقصان' },
  { file: 'notes',      label: 'ملخصات' },
  { file: 'out',        label: 'نفد' },
  { file: 'partial',    label: 'مكتمل جزئيًا' },
  { file: 'partner',    label: 'شريك' },
  { file: 'pending',    label: 'قيد الانتظار' },
  { file: 'phone',      label: 'هاتف' },
  { file: 'pickup',     label: 'استلام' },
  { file: 'plus',       label: 'زيادة' },
  { file: 'price',      label: 'سعر' },
  { file: 'qr',         label: 'كود QR' },
  { file: 'receipt',    label: 'إيصال' },
  { file: 'refund',     label: 'استرداد' },
  { file: 'search',     label: 'بحث' },
  { file: 'share',      label: 'مشاركة' },
  { file: 'stationery', label: 'أدوات مكتبية' },
  { file: 'student',    label: 'طالب' },
  { file: 'wallet',     label: 'محفظة' },
  { file: 'zone',       label: 'منطقة' },
]

export interface AssetPack {
  file: string
  title: string
  desc: string
  size: string
  /** لمن هذه الحزمة — يمنع المطوّر من تنزيل ما لا يخصّه */
  audience: 'مطوّر' | 'مصمّم' | 'تسويق'
}

export const ASSET_PACKS: AssetPack[] = [
  {
    file: 'studylink-native-icons-svg.zip',
    title: 'أيقونات النظام',
    desc: '35 أيقونة SVG تستخدم currentColor وسمك خط 2 — تأخذ لونها من الصنف مباشرة.',
    size: '13 KB',
    audience: 'مطوّر',
  },
  {
    file: 'studylink-color-tokens.zip',
    title: 'توكنز الألوان',
    desc: 'tokens.css و tokens.scss و palette.json و tokens.dtcg.json — نفس القيم التي يقرأها التطبيق.',
    size: '7.5 KB',
    audience: 'مطوّر',
  },
  {
    file: 'studylink-fonts.zip',
    title: 'الخطوط',
    desc: 'StudyLink Arabic + StudyLink Mono بترخيص SIL OFL 1.1، ومصفوفة الترخيص.',
    size: '522 KB',
    audience: 'مطوّر',
  },
  {
    file: 'studylink-logo-pack.zip',
    title: 'حزمة الشعار',
    desc: 'SVG وPNG بكل المقاسات: العلامة، اللوكاب الأفقي والمكدّس، أيقونات التطبيق والـfavicon وPWA.',
    size: '639 KB',
    audience: 'مصمّم',
  },
  {
    file: 'studylink-verbal-arabic-rtl.zip',
    title: 'اللغة والعربية وRTL',
    desc: 'قواعد الطباعة العربية والاتجاهية، قاموس المصطلحات، كتل النصوص، ونماذج المستندات القانونية.',
    size: '20 KB',
    audience: 'مطوّر',
  },
  {
    file: 'studylink-print-templates.zip',
    title: 'قوالب الطباعة',
    desc: 'كروت العمل، الإيصال الحراري، لافتات الرف، حقيبة المندوب، الأوراق الرسمية، أكواد QR.',
    size: '1.8 MB',
    audience: 'تسويق',
  },
  {
    file: 'studylink-social-appstore.zip',
    title: 'السوشيال ومتاجر التطبيقات',
    desc: 'أغلفة وقوالب منشورات وستوريز، ولقطات App Store وGoogle Play بالمقاسات الرسمية.',
    size: '2.1 MB',
    audience: 'تسويق',
  },
]

/** مجلد الدرايف — نسخة سحابية من الحزمة لمن لا يفتح المستودع. */
export const DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1BX9YVdAvYwxu-eWqCweIvsKJKMwOcDYZ'

export const BRAND_BOOK_PATH = '/brand/studylink-brand-book.html'
