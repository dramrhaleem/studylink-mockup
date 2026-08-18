import { asset } from '@/lib/asset'
export type StoreType = "هارفرد" | "برلين";
export type ProductCategory = "محاضرات" | "أدوات طبية" | "أدوات مكتبية";
export type ContentType = "شرح نظري" | "أسئلة MCQs" | "ورق عملي" | "كتب";

export const ALL_CONTENT_TYPES: ContentType[] = ["شرح نظري", "أسئلة MCQs", "ورق عملي", "كتب"];

export const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
  "شرح نظري": "📖",
  "أسئلة MCQs": "✏️",
  "ورق عملي": "🔬",
  "كتب": "📚",
};

export interface Doctor {
  id: string;
  name: string;
  subject: string;
}

export interface ProductVariantOption {
  label: string;
  value: string;
}

export interface ProductVariantColor {
  label: string;
  value: string;
  hex: string;
  priceDiff: number;
}

export interface ProductVariantCombo {
  size: string;
  color: string;
  available: boolean;
}

export interface ProductVariants {
  sizes: ProductVariantOption[];
  colors: ProductVariantColor[];
  availability: ProductVariantCombo[];
}

export type GradeType = 'الفرقة الأولى' | 'الفرقة الثانية' | 'الفرقة الثالثة' | 'الفرقة الرابعة' | 'الفرقة الخامسة' | 'الفرقة السادسة';

export const ALL_GRADES: GradeType[] = [
  'الفرقة الأولى',
  'الفرقة الثانية',
  'الفرقة الثالثة',
  'الفرقة الرابعة',
  'الفرقة الخامسة',
  'الفرقة السادسة',
];

// Which subjects belong to which grade
export const SUBJECT_GRADE_MAP: Record<string, GradeType[]> = {
  'تشريح': ['الفرقة الأولى', 'الفرقة الثانية'],
  'فسيولوجي': ['الفرقة الأولى'],
  'باثولوجي': ['الفرقة الأولى', 'الفرقة الثانية'],
  'هستولوجي': ['الفرقة الأولى'],
  'باطنة': ['الفرقة الثانية', 'الفرقة الرابعة', 'الفرقة الخامسة', 'الفرقة السادسة'],
  'أدوية': ['الفرقة الثانية'],
  'جراحة عامة': ['الفرقة الثالثة', 'الفرقة الرابعة', 'الفرقة الخامسة', 'الفرقة السادسة'],
  'أطفال': ['الفرقة الثالثة', 'الفرقة الرابعة'],
  'نسا وتوليد': ['الفرقة الرابعة', 'الفرقة الخامسة', 'الفرقة السادسة'],
};

export interface Product {
  id: string;
  title: string;
  store: StoreType;
  category: ProductCategory;
  doctor?: string;
  subject?: string;
  year?: GradeType;
  price: number;
  originalPrice?: number;
  pages?: number;
  paperSize?: string;
  specs?: string;
  image?: string;
  images?: string[];
  available: boolean;
  isBundle?: boolean;
  bundleCount?: number;
  bundlePrice?: number;
  hasVariants?: boolean;
  description?: string;
  contentType?: ContentType;
  week?: number;
  rating?: number;
  reviewCount?: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface OrderTracking {
  id: string;
  orderNumber: string;
  status: "تم القبول" | "بيتجهز" | "جاهز للتسليم" | "مع المندوب" | "تم التسليم";
  stores: StoreType[];
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  eta?: string;
}

export const stores: { name: StoreType; emoji: string }[] = [
  { name: "هارفرد", emoji: "📚" },
  { name: "برلين", emoji: "📖" },
];

export const doctors: Doctor[] = [
  { id: "d1", name: "د. أحمد محمود", subject: "جراحة عامة" },
  { id: "d2", name: "د. سارة حسن", subject: "جراحة عامة" },
  { id: "d3", name: "د. محمد علي", subject: "باطنة" },
  { id: "d4", name: "د. فاطمة أحمد", subject: "أطفال" },
  { id: "d5", name: "د. خالد إبراهيم", subject: "فسيولوجي" },
  { id: "d6", name: "د. نورهان السيد", subject: "تشريح" },
  { id: "d7", name: "د. أحمد رضا", subject: "أدوية" },
  { id: "d8", name: "د. منى عبدالله", subject: "باثولوجي" },
  { id: "d9", name: "د. هالة محمود", subject: "نسا وتوليد" },
  { id: "d10", name: "د. ياسر حسين", subject: "باطنة" },
  { id: "d11", name: "د. أمل السعيد", subject: "جراحة عامة" },
  { id: "d12", name: "د. عمر فاروق", subject: "أطفال" },
  { id: "d13", name: "د. رانيا عادل", subject: "نسا وتوليد" },
  { id: "d14", name: "د. حسام الدين", subject: "باطنة" },
  { id: "d15", name: "د. إيمان الشافعي", subject: "جراحة عامة" },
];

export const subjects = [
  "جراحة عامة", "باطنة", "أطفال", "فسيولوجي", "تشريح", "أدوية", "باثولوجي", "نسا وتوليد", "هستولوجي"
];

// Kept for backward compatibility
export const years = ALL_GRADES.map(g => g + ' طب');

export const products: Product[] = [
  // ═══════════════════════════════════════════════════════════════════
  // ─── هارفرد: الفرقة الأولى (تشريح، فسيولوجي، باثولوجي) ───
  // ═══════════════════════════════════════════════════════════════════

  // تشريح - الفرقة الأولى
  { id: "p8", title: "تشريح - أطلس تشريحي ملون", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الأولى", price: 50, pages: 60, paperSize: "A3", image: asset('/products/anatomy-notes.png'), available: true, week: 1, rating: 5.0, reviewCount: 88, description: "أطلس تشريحي ملون بالكامل يغطي جميع أجزاء الجسم مع رسومات توضيحية عالية الدقة" },
  { id: "p8b", title: "تشريح - شرح نظري الأسبوع الأول", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الأولى", price: 38, pages: 44, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: true, week: 1, rating: 4.8, reviewCount: 72, description: "شرح تفصيلي للتشريح العضلي والعظمي مع رسومات توضيحية" },
  { id: "p8c", title: "تشريح - ورق عملي", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الأولى", price: 28, pages: 22, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: true, week: 1, description: "ورق عملي للتشريح يشمل تمارين تشريحية ورسومات للتلخيص" },
  { id: "p8d", title: "تشريح - MCQs + بنك أسئلة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الأولى", price: 22, pages: 26, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: true, week: 2, rating: 4.4, reviewCount: 55, description: "بنك أسئلة تشريح شامل مع إجابات محلولة وشرح لكل سؤال" },
  { id: "p8e", title: "باقة تشريح الفرقة الأولى الكاملة", store: "هارفرد", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الأولى", price: 120, originalPrice: 150, pages: 152, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: true, isBundle: true, bundleCount: 5, week: 1, rating: 4.9, reviewCount: 130, description: "باقة شاملة لكل محاضرات التشريح: شرح نظري + ورق عملي + MCQs + ملخصات" },

  // فسيولوجي - الفرقة الأولى
  { id: "p7", title: "فسيولوجي - محاضرات مراجعة شاملة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. خالد إبراهيم", subject: "فسيولوجي", year: "الفرقة الأولى", price: 38, pages: 44, paperSize: "A4", image: asset('/products/lectures.png'), available: true, week: 1, rating: 4.7, reviewCount: 63, description: "مراجعة شاملة لفسيولوجي الجسم البشري مع أمثلة سريرية" },
  { id: "p7b", title: "فسيولوجي - كتاب مرجعي", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. خالد إبراهيم", subject: "فسيولوجي", year: "الفرقة الأولى", price: 55, pages: 80, paperSize: "A4", image: asset('/products/lectures.png'), available: true, week: 2, rating: 4.6, reviewCount: 48, description: "كتاب مرجعي مفصل في علم وظائف الأعضاء مع رسومات بيانية" },
  { id: "p7c", title: "فسيولوجي - MCQs محلولة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. خالد إبراهيم", subject: "فسيولوجي", year: "الفرقة الأولى", price: 25, pages: 32, paperSize: "A4", image: asset('/products/lectures.png'), available: true, week: 2, description: "أسئلة فسيولوجي متدرجة الصعوبة مع إجابات وشرح مفصل" },
  { id: "p7d", title: "فسيولوجي - ورق عملي", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. خالد إبراهيم", subject: "فسيولوجي", year: "الفرقة الأولى", price: 20, pages: 18, paperSize: "A4", image: asset('/products/lectures.png'), available: false, week: 3, description: "تجارب معملية في الفسيولوجي مع أوراق تسجيل" },

  // باثولوجي - الفرقة الأولى
  { id: "p10", title: "باثولوجي - ملخص الفاينال", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. منى عبدالله", subject: "باثولوجي", year: "الفرقة الأولى", price: 42, originalPrice: 55, pages: 52, paperSize: "A4", image: asset('/products/pathology.png'), available: true, week: 1, rating: 4.5, reviewCount: 67, description: "ملخص شامل لباثولوجي الفرقة الأولى مركز على أسئلة الفاينال" },
  { id: "p10b", title: "باثولوجي - ورق عملي", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. منى عبدالله", subject: "باثولوجي", year: "الفرقة الأولى", price: 20, pages: 18, paperSize: "A4", image: asset('/products/pathology.png'), available: true, week: 2, description: "أوراق عمل باثولوجي مع صور مجهرية توضيحية" },
  { id: "p10c", title: "باثولوجي - MCQs + نموذج إجابات", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. منى عبدالله", subject: "باثولوجي", year: "الفرقة الأولى", price: 25, pages: 30, paperSize: "A4", image: asset('/products/pathology.png'), available: true, week: 1, rating: 4.3, reviewCount: 45, description: "أسئلة باثولوجي متنوعة مع إجابات مفصلة" },

  // هستولوجي - الفرقة الأولى (مادة غير متوفرة — عنصر واحد فقط)
  { id: "p_hist1", title: "هستولوجي - أطلس الأنسجة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. منى عبدالله", subject: "هستولوجي", year: "الفرقة الأولى", price: 0, pages: 0, paperSize: "A4", available: false, week: 1, description: "غير متوفر في المكتبة والمكتبة هتسعى لتوفيره في اسرع وقت" },

  // ═══════════════════════════════════════════════════════════════════
  // ─── هارفرد: الفرقة الثانية (تشريح، باثولوجي، أدوية، باطنة) ───
  // ═══════════════════════════════════════════════════════════════════

  // تشريح - الفرقة الثانية
  { id: "p21", title: "تشريح - الأعصاب والرأس", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الثانية", price: 40, pages: 48, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: true, week: 1, rating: 4.7, reviewCount: 58, description: "شرح تشريح الجهاز العصبي المركزي والمحيطي مع رسومات توضيحية" },
  { id: "p21b", title: "تشريح - أطلس الرأس والعنق", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الثانية", price: 55, pages: 70, paperSize: "A3", image: asset('/products/anatomy-notes.png'), available: true, week: 2, description: "أطلس ملون لتشريح الرأس والعنق" },
  { id: "p21c", title: "تشريح - MCQs الفرقة الثانية", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الثانية", price: 22, pages: 28, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: true, week: 3, description: "أسئلة تشريح للفرقة الثانية مع حلول" },

  // باثولوجي - الفرقة الثانية
  { id: "p10d", title: "باثولوجي - شرح نظري الأسبوع الثاني", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. منى عبدالله", subject: "باثولوجي", year: "الفرقة الثانية", price: 38, pages: 42, paperSize: "A4", image: asset('/products/pathology.png'), available: false, week: 2, description: "باثولوجي عامة - الأورام والالتهابات (غير متوفر حالياً)" },
  { id: "p10e", title: "باثولوجي - MCQs الفرقة الثانية", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. منى عبدالله", subject: "باثولوجي", year: "الفرقة الثانية", price: 28, pages: 34, paperSize: "A4", image: asset('/products/pathology.png'), available: true, week: 1, rating: 4.2, reviewCount: 38, description: "أسئلة باثولوجي للفرقة الثانية مع شرح مفصل" },
  { id: "p10f", title: "باثولوجي - ورق عملي الفرقة الثانية", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. منى عبدالله", subject: "باثولوجي", year: "الفرقة الثانية", price: 22, pages: 20, paperSize: "A4", image: asset('/products/pathology.png'), available: true, week: 2, description: "أوراق عمل باثولوجي مع صور مجهرية للأورام" },

  // أدوية - الفرقة الثانية
  { id: "p9", title: "أدوية - تصنيف الأدوية", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد رضا", subject: "أدوية", year: "الفرقة الثانية", price: 28, pages: 28, paperSize: "A4", image: asset('/products/pharmacology.png'), available: true, week: 1, rating: 4.3, reviewCount: 34, description: "تصنيف شامل للأدوية حسب المجموعات الدوائية مع جرعات" },
  { id: "p9b", title: "أدوية - MCQs", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد رضا", subject: "أدوية", year: "الفرقة الثانية", price: 22, pages: 30, paperSize: "A4", image: asset('/products/pharmacology.png'), available: true, week: 1, rating: 4.1, reviewCount: 29, description: "أسئلة أدوية متنوعة مع حلول وشرح" },
  { id: "p9c", title: "أدوية - كتاب مرجعي", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد رضا", subject: "أدوية", year: "الفرقة الثانية", price: 48, pages: 90, paperSize: "A4", image: asset('/products/pharmacology.png'), available: true, week: 2, rating: 4.5, reviewCount: 52, description: "كتاب مرجعي شامل في علم الأدوية" },
  { id: "p9d", title: "أدوية - ورق عملي", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد رضا", subject: "أدوية", year: "الفرقة الثانية", price: 20, pages: 18, paperSize: "A4", image: asset('/products/pharmacology.png'), available: true, week: 2, description: "أوراق عمل أدوية مع حالات سريرية" },
  { id: "p9e", title: "باقة أدوية الفرقة الثانية", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد رضا", subject: "أدوية", year: "الفرقة الثانية", price: 85, originalPrice: 105, pages: 166, paperSize: "A4", image: asset('/products/pharmacology.png'), available: true, isBundle: true, bundleCount: 4, week: 1, rating: 4.7, reviewCount: 76, description: "باقة أدوية كاملة: شرح + MCQs + ورق عملي + مرجع" },

  // باطنة - الفرقة الثانية
  { id: "p2", title: "الباطنة الإكلينيكية — أسئلة MCQs محلولة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. ياسر حسين", subject: "باطنة", year: "الفرقة الثانية", price: 30, pages: 32, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 1, rating: 4.7, reviewCount: 78, description: "أسئلة باطنة إكلينيكية محلولة مع شرح مفصل لكل سؤال" },
  { id: "p22", title: "باطنة - شرح نظري الفرقة الثانية", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. ياسر حسين", subject: "باطنة", year: "الفرقة الثانية", price: 38, pages: 44, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 2, rating: 4.6, reviewCount: 61, description: "شرح نظري مفصل للباطنة الإكلينيكية للفرقة الثانية" },

  // ═══════════════════════════════════════════════════════════════════
  // ─── هارفرد: الفرقة الثالثة (جراحة عامة، أطفال) ───
  // ═══════════════════════════════════════════════════════════════════

  // جراحة عامة - الفرقة الثالثة
  { id: "p1", title: "محاضرات الجراحة العامة — الجزء الأول", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد سمير", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 40, pages: 48, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, rating: 4.8, reviewCount: 95, description: "محاضرات جراحة عامة شاملة - الجزء الأول: مبادئ الجراحة والتعقيم" },
  { id: "p3", title: "جراحة عامة - ورق عملي", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. سارة حسن", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 30, pages: 24, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, rating: 4.5, reviewCount: 42, description: "ورق عملي جراحة مع حالات وتمارين تطبيقية" },
  { id: "p1b", title: "جراحة عامة - شرح نظري الأسبوع الثاني", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد سمير", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 42, pages: 50, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 2, rating: 4.7, reviewCount: 68, description: "الجراحة العامة - الجزء الثاني: جراحة البطن والصدر" },
  { id: "p1c", title: "جراحة عامة - MCQs الأسبوع الثالث", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. سارة حسن", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 28, pages: 32, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 3, description: "أسئلة جراحة عامة متنوعة مع إجابات محلولة" },
  { id: "p1d", title: "جراحة عامة - MCQs الأسبوع الأول", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. سارة حسن", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 25, pages: 28, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, description: "أسئلة جراحة أساسية مع حلول مفصلة" },
  { id: "p1e", title: "جراحة عامة - ورق عملي الأسبوع الثاني", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. سارة حسن", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 28, pages: 22, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 2, description: "تمارين جراحية تطبيقية" },
  { id: "p11", title: "باقة الجراحة كاملة — 4 مذكرات", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد سمير", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 120, originalPrice: 145, pages: 120, paperSize: "A4", image: asset('/products/surgery.png'), available: true, isBundle: true, bundleCount: 4, week: 1, rating: 4.8, reviewCount: 112, description: "باقة جراحة عامة كاملة: شرح نظري + ورق عملي + MCQs + ملخصات" },
  { id: "p1f", title: "جراحة عامة - كتاب مرجعي", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. أحمد سمير", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 65, pages: 110, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 3, rating: 4.6, reviewCount: 44, description: "مرجع جراحة عامة شامل للفرقة الثالثة" },

  // أطفال - الفرقة الثالثة
  { id: "p6", title: "ملخصات الأطفال + بنك الأسئلة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. فاطمة أحمد", subject: "أطفال", year: "الفرقة الثالثة", price: 100, originalPrice: 120, pages: 36, paperSize: "A4", image: asset('/products/pediatrics.png'), available: true, isBundle: true, bundleCount: 4, rating: 4.6, reviewCount: 56, week: 1, description: "باقة أطفال كاملة: ملخصات + شرح + أسئلة + ورق عملي" },
  { id: "p6b", title: "أطفال - شرح نظري", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. فاطمة أحمد", subject: "أطفال", year: "الفرقة الثالثة", price: 35, pages: 40, paperSize: "A4", image: asset('/products/pediatrics.png'), available: true, week: 1, rating: 4.5, reviewCount: 48, description: "شرح نظري طب الأطفال مع حالات سريرية" },
  { id: "p6c", title: "أطفال - MCQs", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. فاطمة أحمد", subject: "أطفال", year: "الفرقة الثالثة", price: 25, pages: 28, paperSize: "A4", image: asset('/products/pediatrics.png'), available: true, week: 2, description: "أسئلة طب أطفال متنوعة مع حلول" },
  { id: "p6d", title: "أطفال - ورق عملي", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. فاطمة أحمد", subject: "أطفال", year: "الفرقة الثالثة", price: 28, pages: 20, paperSize: "A4", image: asset('/products/pediatrics.png'), available: true, week: 1, description: "أوراق عمل أطفال مع حالات تطبيقية" },
  { id: "p6e", title: "أطفال - كتاب مرجعي", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. فاطمة أحمد", subject: "أطفال", year: "الفرقة الثالثة", price: 50, pages: 80, paperSize: "A4", image: asset('/products/pediatrics.png'), available: false, week: 3, description: "كتاب مرجعي في طب الأطفال (غير متوفر حالياً)" },

  // ═══════════════════════════════════════════════════════════════════
  // ─── هارفرد: الفرقة الرابعة (باطنة، جراحة عامة، نسا وتوليد، أطفال) ───
  // ═══════════════════════════════════════════════════════════════════

  // باطنة - الفرقة الرابعة
  { id: "p4", title: "باطنة - شرح نظري متقدم", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. محمد علي", subject: "باطنة", year: "الفرقة الرابعة", price: 45, pages: 56, paperSize: "A4", image: asset('/products/medicines.png'), available: true, week: 1, rating: 4.9, reviewCount: 128, description: "شرح نظري متقدم للباطنة الإكلينيكية مع حالات" },
  { id: "p5", title: "باطنة - أسئلة MCQs", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. محمد علي", subject: "باطنة", year: "الفرقة الرابعة", price: 30, pages: 40, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 2, rating: 4.7, reviewCount: 92, description: "أسئلة باطنة متقدمة للفرقة الرابعة" },
  { id: "p4b", title: "باطنة - كتاب مرجعي", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. محمد علي", subject: "باطنة", year: "الفرقة الرابعة", price: 65, pages: 120, paperSize: "A4", image: asset('/products/medicines.png'), available: true, week: 1, rating: 4.8, reviewCount: 105, description: "كتاب مرجعي شامل في الباطنة للفرقة الرابعة" },
  { id: "p4c", title: "باطنة - ورق عملي الأسبوع الثالث", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. محمد علي", subject: "باطنة", year: "الفرقة الرابعة", price: 25, pages: 20, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 3, description: "أوراق عمل باطنة مع حالات سريرية" },
  { id: "p4d", title: "باطنة - ملخص سريع للفاينال", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. محمد علي", subject: "باطنة", year: "الفرقة الرابعة", price: 35, originalPrice: 45, pages: 30, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 4, rating: 4.8, reviewCount: 140, description: "ملخص سريع مركز على أسئلة الفاينال" },

  // جراحة عامة - الفرقة الرابعة
  { id: "p23", title: "جراحة عامة - شرح نظري الفرقة الرابعة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. أمل السعيد", subject: "جراحة عامة", year: "الفرقة الرابعة", price: 42, pages: 52, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, rating: 4.7, reviewCount: 65, description: "جراحة عامة متقدمة للفرقة الرابعة" },
  { id: "p23b", title: "جراحة عامة - MCQs الفرقة الرابعة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. أمل السعيد", subject: "جراحة عامة", year: "الفرقة الرابعة", price: 28, pages: 34, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 2, description: "أسئلة جراحة للفرقة الرابعة مع حلول" },
  { id: "p23c", title: "جراحة عامة - ورق عملي الفرقة الرابعة", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. أمل السعيد", subject: "جراحة عامة", year: "الفرقة الرابعة", price: 30, pages: 22, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 3, description: "تمارين جراحية للفرقة الرابعة" },

  // نسا وتوليد - الفرقة الرابعة
  { id: "p16", title: "نسا وتوليد - شرح نظري", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. هالة محمود", subject: "نسا وتوليد", year: "الفرقة الرابعة", price: 42, pages: 52, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, rating: 4.6, reviewCount: 72, description: "شرح نظري شامل لطب النساء والتوليد" },
  { id: "p16b", title: "نسا وتوليد - ورق عملي", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. هالة محمود", subject: "نسا وتوليد", year: "الفرقة الرابعة", price: 30, pages: 24, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, description: "أوراق عمل نسا وتوليد مع حالات" },
  { id: "p16c", title: "نسا وتوليد - MCQs", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. هالة محمود", subject: "نسا وتوليد", year: "الفرقة الرابعة", price: 26, pages: 30, paperSize: "A4", image: asset('/products/surgery.png'), available: false, week: 2, description: "أسئلة نسا وتوليد (غير متوفر حالياً)" },
  { id: "p16d", title: "نسا وتوليد - كتاب مرجعي", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. هالة محمود", subject: "نسا وتوليد", year: "الفرقة الرابعة", price: 58, pages: 95, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 3, rating: 4.5, reviewCount: 60, description: "كتاب مرجعي في النساء والتوليد" },

  // أطفال - الفرقة الرابعة
  { id: "p24", title: "أطفال - شرح نظري الفرقة الرابعة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. عمر فاروق", subject: "أطفال", year: "الفرقة الرابعة", price: 38, pages: 46, paperSize: "A4", image: asset('/products/pediatrics.png'), available: true, week: 1, rating: 4.5, reviewCount: 40, description: "شرح أطفال متقدم للفرقة الرابعة" },
  { id: "p24b", title: "أطفال - MCQs الفرقة الرابعة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. عمر فاروق", subject: "أطفال", year: "الفرقة الرابعة", price: 25, pages: 30, paperSize: "A4", image: asset('/products/pediatrics.png'), available: true, week: 2, description: "أسئلة أطفال للفرقة الرابعة" },
  { id: "p24c", title: "أطفال - ورق عملي الفرقة الرابعة", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. عمر فاروق", subject: "أطفال", year: "الفرقة الرابعة", price: 25, pages: 18, paperSize: "A4", image: asset('/products/pediatrics.png'), available: true, week: 3, description: "تمارين أطفال تطبيقية" },

  // ═══════════════════════════════════════════════════════════════════
  // ─── هارفرد: الفرقة الخامسة (باطنة، جراحة عامة، نسا وتوليد) ───
  // ═══════════════════════════════════════════════════════════════════

  // باطنة - الفرقة الخامسة
  { id: "p30", title: "باطنة - شرح نظري الفرقة الخامسة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة الخامسة", price: 45, pages: 58, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 1, rating: 4.8, reviewCount: 82, description: "باطنة متقدمة: أمراض القلب والجهاز التنفسي" },
  { id: "p30b", title: "باطنة - MCQs الفرقة الخامسة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة الخامسة", price: 30, pages: 38, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 2, rating: 4.6, reviewCount: 55, description: "أسئلة باطنة متقدمة للفرقة الخامسة مع حلول" },
  { id: "p30c", title: "باطنة - ورق عملي الفرقة الخامسة", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة الخامسة", price: 25, pages: 22, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 3, description: "حالات باطنة سريرية للفرقة الخامسة" },
  { id: "p30d", title: "باطنة - كتاب مرجعي الفرقة الخامسة", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة الخامسة", price: 70, originalPrice: 85, pages: 130, paperSize: "A4", image: asset('/products/medicines.png'), available: true, week: 1, rating: 4.7, reviewCount: 68, description: "مرجع باطنة متقدم للفرقة الخامسة" },
  { id: "p30e", title: "باقة باطنة الفرقة الخامسة الكاملة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة الخامسة", price: 130, originalPrice: 165, pages: 248, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, isBundle: true, bundleCount: 5, week: 1, rating: 4.9, reviewCount: 95, description: "باقة باطنة الخامسة كاملة: كل المذكرات في باقة واحدة" },

  // جراحة عامة - الفرقة الخامسة
  { id: "p31", title: "جراحة عامة - شرح نظري الفرقة الخامسة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة الخامسة", price: 42, pages: 54, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, rating: 4.7, reviewCount: 58, description: "جراحة متقدمة: جراحة الأوعية والصدر" },
  { id: "p31b", title: "جراحة عامة - MCQs الفرقة الخامسة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة الخامسة", price: 28, pages: 34, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 2, rating: 4.5, reviewCount: 42, description: "أسئلة جراحة متقدمة مع حلول" },
  { id: "p31c", title: "جراحة عامة - ورق عملي الفرقة الخامسة", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة الخامسة", price: 30, pages: 20, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 3, description: "حالات جراحية تطبيقية" },

  // نسا وتوليد - الفرقة الخامسة
  { id: "p32", title: "نسا وتوليد - شرح نظري الفرقة الخامسة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة الخامسة", price: 40, pages: 50, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, rating: 4.6, reviewCount: 48, description: "نسا وتوليد متقدم: الأمراض النسائية وطب التوليد" },
  { id: "p32b", title: "نسا وتوليد - MCQs الفرقة الخامسة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة الخامسة", price: 26, pages: 32, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 2, description: "أسئلة نسا وتوليد متقدمة" },
  { id: "p32c", title: "نسا وتوليد - ورق عملي الفرقة الخامسة", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة الخامسة", price: 28, pages: 20, paperSize: "A4", image: asset('/products/surgery.png'), available: false, week: 3, description: "أوراق عمل نسا وتوليد (غير متوفر حالياً)" },

  // ═══════════════════════════════════════════════════════════════════
  // ─── هارفرد: الفرقة السادسة (باطنة، جراحة عامة، نسا وتوليد) ───
  // ═══════════════════════════════════════════════════════════════════

  // باطنة - الفرقة السادسة
  { id: "p40", title: "باطنة - شرح نظري الفرقة السادسة (ماستر)", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة السادسة", price: 50, pages: 62, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 1, rating: 4.9, reviewCount: 95, description: "باطنة الفرقة السادسة: أمراض الكلى والجهاز الهضمي والغدد" },
  { id: "p40b", title: "باطنة - MCQs الفرقة السادسة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة السادسة", price: 32, pages: 40, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 2, rating: 4.7, reviewCount: 72, description: "أسئلة باطنة سادسة مع حلول تفصيلية" },
  { id: "p40c", title: "باطنة - ملخص ماستر الفاينال", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة السادسة", price: 55, originalPrice: 70, pages: 48, paperSize: "A4", image: asset('/products/medicines.png'), available: true, week: 3, rating: 4.9, reviewCount: 120, description: "ملخص ماستر باطنة مركز على الفاينال" },
  { id: "p40d", title: "باطنة - كتاب مرجعي الفرقة السادسة", contentType: "كتب", store: "هارفرد", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة السادسة", price: 75, pages: 140, paperSize: "A4", image: asset('/products/medicines.png'), available: true, week: 1, rating: 4.8, reviewCount: 88, description: "مرجع باطنة شامل للفرقة السادسة" },

  // جراحة عامة - الفرقة السادسة
  { id: "p41", title: "جراحة عامة - شرح نظري الفرقة السادسة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة السادسة", price: 45, pages: 56, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, rating: 4.8, reviewCount: 62, description: "جراحة عامة الفرقة السادسة: جراحة متخصصة" },
  { id: "p41b", title: "جراحة عامة - MCQs الفرقة السادسة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة السادسة", price: 30, pages: 36, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 2, rating: 4.6, reviewCount: 48, description: "أسئلة جراحة سادسة مع حلول" },
  { id: "p41c", title: "جراحة عامة - ورق عملي الفرقة السادسة", contentType: "ورق عملي", store: "هارفرد", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة السادسة", price: 30, pages: 22, paperSize: "A4", image: asset('/products/surgery.png'), available: false, week: 3, description: "حالات جراحية متقدمة (غير متوفر حالياً)" },
  { id: "p41d", title: "باقة جراحة الفرقة السادسة الكاملة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة السادسة", price: 140, originalPrice: 180, pages: 200, paperSize: "A4", image: asset('/products/surgery.png'), available: true, isBundle: true, bundleCount: 4, week: 1, rating: 4.9, reviewCount: 85, description: "باقة جراحة سادسة كاملة" },

  // نسا وتوليد - الفرقة السادسة
  { id: "p42", title: "نسا وتوليد - شرح نظري الفرقة السادسة", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة السادسة", price: 42, pages: 52, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, rating: 4.7, reviewCount: 55, description: "نسا وتوليد الفرقة السادسة: حالات متقدمة" },
  { id: "p42b", title: "نسا وتوليد - MCQs الفرقة السادسة", contentType: "أسئلة MCQs", store: "هارفرد", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة السادسة", price: 28, pages: 34, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 2, rating: 4.5, reviewCount: 38, description: "أسئلة نسا وتوليد متقدمة مع حلول" },
  { id: "p42c", title: "نسا وتوليد - ملخص ماستر", contentType: "شرح نظري", store: "هارفرد", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة السادسة", price: 38, originalPrice: 50, pages: 40, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 3, rating: 4.8, reviewCount: 70, description: "ملخص نسا وتوليد للماستر" },

  // ═══════════════════════════════════════════════════════════════════
  // ─── برلين: محاضرات (معظمها available=false لأن المكتبة مغلقة) ───
  // ═══════════════════════════════════════════════════════════════════

  // جراحة عامة - برلين
  { id: "p12", title: "جراحة عامة - MCQs + نموذج إجابات", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. سارة حسن", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 28, pages: 36, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, description: "أسئلة جراحة برلين مع نماذج إجابات" },
  { id: "p12b", title: "جراحة عامة - شرح نظري برلين", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. أحمد سمير", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 38, pages: 46, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, description: "شرح جراحة برلين بأسلوب مبسط" },
  { id: "p12c", title: "جراحة عامة - ورق عملي برلين", contentType: "ورق عملي", store: "برلين", category: "محاضرات", doctor: "د. سارة حسن", subject: "جراحة عامة", year: "الفرقة الثالثة", price: 32, pages: 22, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 2, description: "ورق عملي جراحة من مكتبة برلين" },
  { id: "p50", title: "جراحة عامة - شرح برلين (الرابعة)", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. أمل السعيد", subject: "جراحة عامة", year: "الفرقة الرابعة", price: 40, pages: 50, paperSize: "A4", image: asset('/products/surgery.png'), available: false, week: 1, description: "جراحة برلين للفرقة الرابعة (غير متوفر حالياً)" },
  { id: "p51", title: "جراحة عامة - MCQs برلين (الخامسة)", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة الخامسة", price: 30, pages: 32, paperSize: "A4", image: asset('/products/surgery.png'), available: false, week: 2, description: "أسئلة جراحة متقدمة (غير متوفر حالياً)" },
  { id: "p51b", title: "جراحة عامة - شرح برلين (السادسة)", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. إيمان الشافعي", subject: "جراحة عامة", year: "الفرقة السادسة", price: 42, pages: 54, paperSize: "A4", image: asset('/products/surgery.png'), available: false, week: 1, description: "جراحة برلين للسادسة (غير متوفر حالياً)" },

  // باطنة - برلين
  { id: "p13", title: "باقة الباطنة — نظري + عملي", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. ياسر حسين", subject: "باطنة", year: "الفرقة الرابعة", price: 90, originalPrice: 108, pages: 86, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, isBundle: true, bundleCount: 3, week: 1, rating: 4.7, reviewCount: 85, description: "باقة باطنة برلين: شرح + عملي + MCQs" },
  { id: "p13b", title: "باطنة - MCQs برلين", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. محمد علي", subject: "باطنة", year: "الفرقة الرابعة", price: 28, pages: 34, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 2, description: "أسئلة باطنة برلين مع حلول" },
  { id: "p13c", title: "باطنة - كتب مرجعية برلين", contentType: "كتب", store: "برلين", category: "محاضرات", doctor: "د. محمد علي", subject: "باطنة", year: "الفرقة الرابعة", price: 58, pages: 100, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: true, week: 3, description: "كتاب باطنة مرجعي من مكتبة برلين" },
  { id: "p52", title: "باطنة - شرح برلين (الثانية)", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. ياسر حسين", subject: "باطنة", year: "الفرقة الثانية", price: 35, pages: 42, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: false, week: 1, description: "باطنة برلين للثانية (غير متوفر حالياً)" },
  { id: "p53", title: "باطنة - MCQs برلين (الخامسة)", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة الخامسة", price: 32, pages: 38, paperSize: "A4", image: asset('/products/internal-medicine.png'), available: false, week: 2, description: "أسئلة باطنة متقدمة (غير متوفر حالياً)" },
  { id: "p54", title: "باطنة - ملخص برلين (السادسة)", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. حسام الدين", subject: "باطنة", year: "الفرقة السادسة", price: 45, pages: 45, paperSize: "A4", image: asset('/products/medicines.png'), available: false, week: 1, description: "ملخص باطنة برلين للسادسة (غير متوفر حالياً)" },

  // فسيولوجي - برلين
  { id: "p14", title: "فسيولوجي - ملخص سريع", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. خالد إبراهيم", subject: "فسيولوجي", year: "الفرقة الأولى", price: 32, pages: 30, paperSize: "A4", image: asset('/products/lectures.png'), available: true, week: 1, rating: 3.5, reviewCount: 12, description: "ملخص فسيولوجي سريع من مكتبة برلين" },
  { id: "p55", title: "فسيولوجي - MCQs برلين", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. خالد إبراهيم", subject: "فسيولوجي", year: "الفرقة الأولى", price: 22, pages: 26, paperSize: "A4", image: asset('/products/lectures.png'), available: false, week: 2, description: "أسئلة فسيولوجي برلين (غير متوفر حالياً)" },

  // تشريح - برلين
  { id: "p15", title: "تشريح - أسئلة سابقة محلولة", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الأولى", price: 30, pages: 35, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: true, week: 1, description: "أسئلة تشريح سنوات سابقة محلولة" },
  { id: "p15b", title: "تشريح - ورق عملي", contentType: "ورق عملي", store: "برلين", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الأولى", price: 24, pages: 20, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: true, week: 2, description: "ورق عملي تشريح من برلين" },
  { id: "p56", title: "تشريح - شرح برلين (الثانية)", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. نورهان السيد", subject: "تشريح", year: "الفرقة الثانية", price: 36, pages: 44, paperSize: "A4", image: asset('/products/anatomy-notes.png'), available: false, week: 1, description: "تشريح برلين للثانية (غير متوفر حالياً)" },

  // أدوية - برلين
  { id: "p57", title: "أدوية - MCQs برلين", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. أحمد رضا", subject: "أدوية", year: "الفرقة الثانية", price: 20, pages: 26, paperSize: "A4", image: asset('/products/pharmacology.png'), available: true, week: 1, description: "أسئلة أدوية برلين مع حلول" },
  { id: "p58", title: "أدوية - شرح برلين", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. أحمد رضا", subject: "أدوية", year: "الفرقة الثانية", price: 30, pages: 34, paperSize: "A4", image: asset('/products/pharmacology.png'), available: false, week: 2, description: "شرح أدوية برلين (غير متوفر حالياً)" },

  // باثولوجي - برلين
  { id: "p59", title: "باثولوجي - MCQs برلين (الأولى)", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. منى عبدالله", subject: "باثولوجي", year: "الفرقة الأولى", price: 22, pages: 28, paperSize: "A4", image: asset('/products/pathology.png'), available: true, week: 1, description: "أسئلة باثولوجي برلين للفرقة الأولى" },
  { id: "p60", title: "باثولوجي - شرح برلين (الثانية)", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. منى عبدالله", subject: "باثولوجي", year: "الفرقة الثانية", price: 35, pages: 40, paperSize: "A4", image: asset('/products/pathology.png'), available: false, week: 2, description: "باثولوجي برلين للثانية (غير متوفر حالياً)" },

  // أطفال - برلين
  { id: "p61", title: "أطفال - MCQs برلين (الثالثة)", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. عمر فاروق", subject: "أطفال", year: "الفرقة الثالثة", price: 24, pages: 28, paperSize: "A4", image: asset('/products/pediatrics.png'), available: true, week: 1, description: "أسئلة أطفال برلين مع حلول" },
  { id: "p62", title: "أطفال - شرح برلين (الرابعة)", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. عمر فاروق", subject: "أطفال", year: "الفرقة الرابعة", price: 35, pages: 42, paperSize: "A4", image: asset('/products/pediatrics.png'), available: false, week: 2, description: "أطفال برلين للرابعة (غير متوفر حالياً)" },

  // نسا وتوليد - برلين
  { id: "p63", title: "نسا وتوليد - MCQs برلين (الرابعة)", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة الرابعة", price: 24, pages: 30, paperSize: "A4", image: asset('/products/surgery.png'), available: true, week: 1, description: "أسئلة نسا وتوليد برلين مع حلول" },
  { id: "p64", title: "نسا وتوليد - شرح برلين (الخامسة)", contentType: "شرح نظري", store: "برلين", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة الخامسة", price: 38, pages: 48, paperSize: "A4", image: asset('/products/surgery.png'), available: false, week: 2, description: "نسا وتوليد برلين للخامسة (غير متوفر حالياً)" },
  { id: "p64b", title: "نسا وتوليد - MCQs برلين (السادسة)", contentType: "أسئلة MCQs", store: "برلين", category: "محاضرات", doctor: "د. رانيا عادل", subject: "نسا وتوليد", year: "الفرقة السادسة", price: 26, pages: 32, paperSize: "A4", image: asset('/products/surgery.png'), available: false, week: 1, description: "نسا وتوليد برلين للسادسة (غير متوفر حالياً)" },

  // ═══════════════════════════════════════════════════════════════════
  // ─── أدوات طبية ───
  // ═══════════════════════════════════════════════════════════════════
  { id: "t1", title: "سماعة ليتمان كلاسيك III", store: "هارفرد", category: "أدوات طبية", price: 850, specs: "ألومنيوم | أصلية 100%", image: asset('/products/stethoscope-pro.png'), available: true, description: "سماعة ليتمان كلاسيك III أصلية - أفضل سماعة لطلاب الطب" },
  { id: "t2", title: "بالطو طبي أبيض - قطن معالج", store: "هارفرد", category: "أدوات طبية", price: 150, specs: "قطن معالج", image: asset('/products/labcoat-pro.png'), available: true, hasVariants: true, description: "بالطو طبي من القطن المعالج عالي الجودة، مريح للارتداء الطويل أثناء الدوام. يأتي بمقاسات وألوان متعددة." },
  { id: "t3", title: "بالطو طبي أبيض - مقاس L", store: "هارفرد", category: "أدوات طبية", price: 180, specs: "قطن معالج | مقاس L", image: asset('/products/labcoat-pro.png'), available: true, description: "بالطو طبي مقاس L مع جيوب عملية" },
  { id: "t8", title: "ميزان طبي رقمي - دقة عالية", store: "هارفرد", category: "أدوات طبية", price: 250, originalPrice: 300, specs: "رقمي | دقة 0.1 جم | بطارية", image: asset('/products/stethoscope-pro.png'), available: true, description: "ميزان طبي رقمي دقيق، مناسب للصيدليات والمعامل" },
  { id: "t9", title: "جهاز قياس ضغط الدم - ساعد", store: "هارفرد", category: "أدوات طبية", price: 220, specs: "أوتوماتيك | عرض رقمي", image: asset('/products/stethoscope-pro.png'), available: true, description: "جهاز قياس ضغط الدم الأوتوماتيك على الساعد" },
  { id: "t10", title: "جهاز قياس السكر - مع أشرطة", store: "برلين", category: "أدوات طبية", price: 120, specs: "رقمي | 50 شريط مجاني", image: asset('/products/stethoscope.png'), available: false, description: "جهاز قياس السكر في الدم مع 50 شريط (غير متوفر حالياً)" },
  { id: "t11", title: "طقم أشواط جراحي - 5 قطع", store: "هارفرد", category: "أدوات طبية", price: 85, specs: "ستانلس ستيل | 5 أحجام", image: asset('/products/reflex-hammer.png'), available: true, description: "طقم أشواط جراحية من الستانلس ستيل بأحجام مختلفة" },
  { id: "t12", title: "مقص جراحي - استريل", store: "هارفرد", category: "أدوات طبية", price: 45, specs: "ستانلس ستيل | معقّم", image: asset('/products/reflex-hammer.png'), available: true, description: "مقص جراحي من الستانلس ستيل معقّم" },
  { id: "t13", title: "منظار أذن طبي", store: "برلين", category: "أدوات طبية", price: 75, specs: "معدني | مع إضاءة", image: asset('/products/stethoscope.png'), available: true, description: "منظار أذن طبي مع مصباح إضاءة LED" },
  { id: "t14", title: "شريط قياس الطول - قابل للطي", store: "هارفرد", category: "أدوات طبية", price: 35, specs: "بلاستيك | 2 متر", image: asset('/products/tuning-fork.png'), available: true, description: "شريط قياس طبي قابل للطي" },
  { id: "t15", title: "قميص سريري طبي - قطن", store: "برلين", category: "أدوات طبية", price: 55, specs: "قطن | مقاسات S-XXL", image: asset('/products/labcoat-pro.png'), available: true, hasVariants: true, description: "قميص سريري مريح للمرضى، يأتي بمقاسات متعددة" },
  { id: "t16", title: "كرة ضغط يدوية - تدريب", store: "هارفرد", category: "أدوات طبية", price: 25, specs: "سيليكون | 3 مستويات", image: asset('/products/tuning-fork.png'), available: true, description: "كرة ضغط يدوية لتقوية قبضة اليد" },
  { id: "t17", title: "جهاز حرارة طبي رقمي", store: "برلين", category: "أدوات طبية", price: 40, specs: "رقمي | دقة 0.1°", image: asset('/products/stethoscope.png'), available: false, description: "جهاز حرارة طبي رقمي سريع (غير متوفر حالياً)" },
  { id: "t4", title: "كشاف فحص طبي - معدني", store: "برلين", category: "أدوات طبية", price: 65, specs: "ألمنيوم | LED", image: asset('/products/stethoscope.png'), available: true, description: "كشاف طبي LED للفحص السريري" },
  { id: "t5", title: "مطرق طبي تايلور", store: "برلين", category: "أدوات طبية", price: 45, specs: "فولاذ مقاوم للصدأ", image: asset('/products/reflex-hammer.png'), available: true, description: "مطرق طبي تايلور لاختبار المنعكسات" },
  { id: "t6", title: "شوكة رنانة 512 هرتز", store: "هارفرد", category: "أدوات طبية", price: 35, specs: "ألمنيوم نظيف", image: asset('/products/tuning-fork.png'), available: true, description: "شوكة رنانة 512 هرتز لفحص السمع" },
  { id: "t7", title: "حامل بطاقات هوية طبي", store: "هارفرد", category: "أدوات طبية", price: 25, specs: "بلاستيك مقوى | شفاف", image: asset('/products/id-holder.png'), available: true, description: "حامل بطاقات الهوية الطبية" },
  { id: "t18", title: "حقيبة أدوات طبية - محمولة", store: "هارفرد", category: "أدوات طبية", price: 180, originalPrice: 220, specs: "جلد صناعي | عدة جيوب", image: asset('/products/labcoat-pro.png'), available: true, description: "حقيبة أدوات طبية محمولة مع جيوب متعددة" },

  // ═══════════════════════════════════════════════════════════════════
  // ─── أدوات مكتبية ───
  // ═══════════════════════════════════════════════════════════════════
  { id: "s1", title: "قلم نحاس أحمر - صنعة يدوية", store: "هارفرد", category: "أدوات مكتبية", price: 15, specs: "نحاس أصفر | حبر أزرق", image: asset('/products/stationery-set.png'), available: true, description: "قلم نحاس أنيق صناعة يدوية للحبر الأزرق" },
  { id: "s2", title: "دفتر ملاحظات A5 - غلاف كتان", store: "برلين", category: "أدوات مكتبية", price: 22, specs: "كتان أزرق | 80 صفحة", image: asset('/products/stationery-set.png'), available: true, description: "دفتر ملاحظات أنيق بغلاف كتان" },
  { id: "s3", title: "قلم رصاص ميكانيكي", store: "برلين", category: "أدوات مكتبية", price: 12, specs: "هيكل معدني | 0.5mm", image: asset('/products/stationery-set.png'), available: true, description: "قلم رصاص ميكانيكي 0.5mm بهيكل معدني" },
  { id: "s4", title: "أقلام تحديد ألوان - 6 قطع", store: "هارفرد", category: "أدوات مكتبية", price: 18, specs: "6 ألوان | فيبرو تيب", image: asset('/products/stationery-set.png'), available: true, description: "طقم أقلام تحديد 6 ألوان لتحديد النصوص" },
  { id: "s5", title: "مسطرة معدنية 30 سم", store: "برلين", category: "أدوات مكتبية", price: 10, specs: "ستانلس ستيل | مقسمة", image: asset('/products/stationery.png'), available: true, description: "مسطرة مقسمة 30 سم من الستانلس ستيل" },
  { id: "s6", title: "ورقة رسم بياني A4 - 100 ورقة", store: "هارفرد", category: "أدوات مكتبية", price: 8, specs: "A4 | مربعات 5mm", image: asset('/products/stationery.png'), available: true, description: "ورقة رسم بياني A4 مربعات للرسم العلمي" },
  { id: "s7", title: "ملصقات تشريحية - 200 ملصق", store: "هارفرد", category: "أدوات مكتبية", price: 20, specs: "ذاتية اللزق | ملونة", image: asset('/products/stationery-set.png'), available: true, description: "ملصقات تشريحية ملونة لتنظيم الملاحظات" },
  { id: "s8", title: "دفتر رسم تشريحي A4", store: "هارفرد", category: "أدوات مكتبية", price: 25, specs: "A4 | 60 صفحة | ورق سميك", image: asset('/products/stationery.png'), available: true, description: "دفتر رسم تشريحي بورق سميك مناسب للرسم بالألوان" },
  { id: "s9", title: "ممحاة طبية - مطاطية ناعمة", store: "برلين", category: "أدوات مكتبية", price: 8, specs: "مطاط | لا تترك أثر", image: asset('/products/stationery.png'), available: true, description: "ممحاة ناعمة لا تترك أثر على الورق" },
  { id: "s10", title: "أقلام جل ألوان - 12 قطعة", store: "هارفرد", category: "أدوات مكتبية", price: 35, originalPrice: 45, specs: "12 لون | جل | 0.5mm", image: asset('/products/stationery-set.png'), available: true, description: "طقم أقلام جل 12 لون للكتابة والرسم" },
  { id: "s11", title: "فهرس مفكرات A5 - 100 صفحة", store: "برلين", category: "أدوات مكتبية", price: 28, specs: "A5 | خطوط | غلاف مقوى", image: asset('/products/stationery-set.png'), available: true, description: "فهرس مفكرات بصفحات خطوط لتنظيم المهام" },
  { id: "s12", title: "شريط لاصق شفاف - 3 قطع", store: "هارفرد", category: "أدوات مكتبية", price: 10, specs: "شفاف | 18mm × 33m", image: asset('/products/stationery.png'), available: true, description: "شريط لاصق شفاف عالي الجودة" },
  { id: "s13", title: "دباسة مع 1000 مشبك", store: "برلين", category: "أدوات مكتبية", price: 18, specs: "معدنية | مشابك 24/6", image: asset('/products/stationery.png'), available: true, description: "دباسة معدنية مع 1000 مشبك ورق" },
  { id: "s14", title: "مجموعة أقلام حبر جاف - 4 قطع", store: "هارفرد", category: "أدوات مكتبية", price: 22, specs: "أسود | أزرق | أحمر | أخضر", image: asset('/products/stationery-set.png'), available: true, description: "مجموعة أقلام حبر جاف 4 ألوان" },
  { id: "s15", title: "لوحة ملاحظات ذكية - مغناطيسية", store: "برلين", category: "أدوات مكتبية", price: 45, specs: "A4 | قابلة للمسح | مغناطيسية", image: asset('/products/stationery.png'), available: false, description: "لوحة ملاحظات ذكية قابلة للمسح (غير متوفر حالياً)" },
];

export const sampleOrder: OrderTracking = {
  id: "o1",
  orderNumber: "#1092",
  status: "مع المندوب",
  stores: ["هارفرد", "برلين"],
  items: [
    { product: products[0], quantity: 1 },
    { product: products[3], quantity: 1 },
    { product: products[5], quantity: 1 },
    { product: products[12], quantity: 1 },
    { product: products[14], quantity: 1 },
  ],
  subtotal: 192,
  serviceFee: 5,
  deliveryFee: 25,
  total: 227,
  createdAt: "2025-01-15T14:30:00",
  eta: "30-45 دقيقة",
};

export const sampleTrackingSteps = [
  { label: "تم القبول", time: "2:30 م", completed: true, store: "هارفرد" },
  { label: "بيتجهز", time: "2:35 م", completed: true, store: "هارفرد" },
  { label: "جاهز للتسليم", time: "2:50 م", completed: true, store: "هارفرد" },
  { label: "تم القبول", time: "2:32 م", completed: true, store: "برلين" },
  { label: "بيتجهز", time: null, completed: false, store: "برلين" },
  { label: "مع المندوب", time: null, completed: false, store: null },
  { label: "تم التسليم", time: null, completed: false, store: null },
];

/* ─── Variant Configuration for products with hasVariants ─── */
export const productVariants: Record<string, ProductVariants> = {
  t2: {
    sizes: [
      { label: 'S', value: 'S' },
      { label: 'M', value: 'M' },
      { label: 'L', value: 'L' },
      { label: 'XL', value: 'XL' },
    ],
    colors: [
      { label: 'أبيض', value: 'white', hex: '#FFFFFF', priceDiff: 0 },
      { label: 'أسود', value: 'black', hex: '#1a1a2e', priceDiff: 20 },
      { label: 'أزرق فاتح', value: 'lightblue', hex: '#93C5FD', priceDiff: 10 },
    ],
    availability: [
      { size: 'S', color: 'white', available: true },
      { size: 'S', color: 'black', available: true },
      { size: 'S', color: 'lightblue', available: false },
      { size: 'M', color: 'white', available: true },
      { size: 'M', color: 'black', available: true },
      { size: 'M', color: 'lightblue', available: true },
      { size: 'L', color: 'white', available: true },
      { size: 'L', color: 'black', available: true },
      { size: 'L', color: 'lightblue', available: true },
      { size: 'XL', color: 'white', available: true },
      { size: 'XL', color: 'black', available: false },
      { size: 'XL', color: 'lightblue', available: false },
    ],
  },
  t15: {
    sizes: [
      { label: 'S', value: 'S' },
      { label: 'M', value: 'M' },
      { label: 'L', value: 'L' },
      { label: 'XL', value: 'XL' },
      { label: 'XXL', value: 'XXL' },
    ],
    colors: [
      { label: 'أبيض', value: 'white', hex: '#FFFFFF', priceDiff: 0 },
      { label: 'أزرق فاتح', value: 'lightblue', hex: '#93C5FD', priceDiff: 5 },
    ],
    availability: [
      { size: 'S', color: 'white', available: true },
      { size: 'S', color: 'lightblue', available: true },
      { size: 'M', color: 'white', available: true },
      { size: 'M', color: 'lightblue', available: true },
      { size: 'L', color: 'white', available: true },
      { size: 'L', color: 'lightblue', available: true },
      { size: 'XL', color: 'white', available: true },
      { size: 'XL', color: 'lightblue', available: false },
      { size: 'XXL', color: 'white', available: true },
      { size: 'XXL', color: 'lightblue', available: false },
    ],
  },
}

export function getProductVariants(productId: string): ProductVariants | null {
  return productVariants[productId] || null
}

/** Filter products that belong to a specific grade based on their subject */
export function getProductsForGrade(grade: GradeType): Product[] {
  const relevantSubjects = Object.entries(SUBJECT_GRADE_MAP)
    .filter(([, grades]) => grades.includes(grade))
    .map(([subject]) => subject)
  return products.filter(p => p.category === 'محاضرات' && p.subject && relevantSubjects.includes(p.subject))
}

/** Get subjects relevant to a specific grade */
export function getSubjectsForGrade(grade: GradeType): string[] {
  return Object.entries(SUBJECT_GRADE_MAP)
    .filter(([, grades]) => grades.includes(grade))
    .map(([subject]) => subject)
}

/** Check if a product is relevant to a specific grade */
export function isProductForGrade(product: Product, grade: GradeType): boolean {
  if (!product.subject || product.category !== 'محاضرات') return false
  return SUBJECT_GRADE_MAP[product.subject]?.includes(grade) ?? false
}

export function getDescription(product: Product): string {
  if (product.description) return product.description
  if (product.category === 'محاضرات') {
    return 'مذكرة شاملة تغطي المنهج كامل مع أمثلة توضيحية وأسئلة مراجعة'
  }
  if (product.category === 'أدوات طبية') {
    return 'أداة طبية عالية الجودة من مصادر موثوقة، مناسبة لطلاب الطب'
  }
  return 'منتج عالي الجودة مناسب للاستخدام الأكاديمي'
}