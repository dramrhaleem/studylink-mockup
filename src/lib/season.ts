/**
 * الموسم الأكاديمي — يحكم محتوى بطاقة «العملي في الجيب» في الشاشة الرئيسية.
 *
 * لماذا ملف مستقل؟ لأن هذه البطاقة **الوحيدة** في التطبيق التي يتغيّر محتواها
 * بتغيّر الوقت لا بتغيّر المستخدم. المطوّر يحتاج مكانًا واحدًا واضحًا يبدّل منه
 * الموسم، لا شرطًا مدفونًا داخل JSX.
 *
 * في المنتج الحقيقي: `activeSeason` يأتي من إعداد على الخادم (feature flag أو
 * جدول تقويم أكاديمي)، لا من ثابت هنا. الثابت أدناه هو ما يجعل الموك اب قابلًا
 * للعرض في أي موسم بتغيير سطر واحد.
 */

export type SeasonKey = 'practical' | 'midterm' | 'final' | 'newTerm'

export interface Season {
  key: SeasonKey
  /** اسم البطاقة — يتغيّر مع الموسم، وهذا هو بيت القصيد */
  title: string
  /** الشارة الصغيرة أعلى البطاقة */
  chip: string
  /** سطر الشرح */
  subtitle: string
  /** الشاشة التي تفتحها البطاقة */
  screen: string
}

export const SEASONS: Record<SeasonKey, Season> = {
  practical: {
    key: 'practical',
    title: 'العملي في الجيب',
    chip: 'موسم العملي',
    subtitle: 'ورق العملي وحالات الامتحان للأسابيع الجارية، مجمّعة في مكان واحد.',
    screen: 'lectures',
  },
  midterm: {
    key: 'midterm',
    title: 'مراجعة الميدتيرم',
    chip: 'موسم الميدتيرم',
    subtitle: 'ملخصات وبنوك أسئلة للمقررات التي دخلت الميدتيرم.',
    screen: 'lectures',
  },
  final: {
    key: 'final',
    title: 'ملخصات الفاينال',
    chip: 'موسم الفاينال',
    subtitle: 'الملخصات المركّزة وأسئلة السنوات السابقة قبل الامتحان النهائي.',
    screen: 'lectures',
  },
  newTerm: {
    key: 'newTerm',
    title: 'بداية الترم',
    chip: 'ترم جديد',
    subtitle: 'مذكرات الأسابيع الأولى وأدوات الترم الجديد.',
    screen: 'lectures',
  },
}

/**
 * الموسم النشط. **هذا هو السطر الذي يبدّله المطوّر.**
 * غيّره إلى `'final'` مثلًا، فيتغيّر عنوان البطاقة وشارتها ووصفها معًا.
 */
export const ACTIVE_SEASON: SeasonKey = 'practical'

export const activeSeason: Season = SEASONS[ACTIVE_SEASON]
