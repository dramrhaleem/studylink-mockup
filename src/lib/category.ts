/**
 * تصنيفات المنتجات — المصدر الوحيد للون والأيقونة والتسمية.
 *
 * لماذا ملف مستقل؟ كانت ألوان التصنيف مكتوبة يدويًا في ٨ ملفات وقد اختلفت فعليًا:
 * «أدوات مكتبية» ظهرت مرة `bg-amber-50 text-amber-700`، ومرة
 * `from-amber-100 to-amber-200` مع إيموجي ✏️، ومرة `text-amber-600`.
 * ثلاثة تعريفات لشيء واحد = ثلاثة مظاهر مختلفة لنفس المنتج في ثلاث شاشات.
 *
 * الأزواج أدناه مأخوذة حرفيًا من مصفوفة شارات البراند بوك، وكلها **AAA (≥7:1)**
 * لأن الشارة نص صغير فوق تعبئة ملوّنة — أقسى حالة تباين في الواجهة.
 *
 *   محاضرات      navy-50  / navy-900   13.0:1
 *   أدوات طبية   teal-50  / teal-800    9.1:1
 *   أدوات مكتبية amber-50 / navy-900   13.6:1   ← الذهبي تعبئة فقط، النص حبر
 *
 * ⚠️ لا تكتب لون تصنيف في ملف شاشة. استورد `categoryStyle()` أو `CATEGORY`.
 */

import { BookOpen, Stethoscope, PenLine, Package, type LucideIcon } from 'lucide-react'

export type CategoryKey = 'محاضرات' | 'أدوات طبية' | 'أدوات مكتبية'

export interface CategoryStyle {
  /** الاسم المعروض — نفسه المفتاح، مصرَّح به لمنع النقحرة العشوائية */
  label: string
  /** اختصار للشارات الضيقة (بطاقة المنتج) */
  short: string
  /** تعبئة الشارة */
  bg: string
  /** نص الشارة — AAA فوق `bg` */
  ink: string
  /** حد الشارة (شفاف جزئيًا كي لا يصير خطًا صارخًا) */
  border: string
  /** خلفية مربّع الأيقونة حين تسقط الصورة */
  iconBg: string
  /** لون الأيقونة داخل `iconBg` */
  iconInk: string
  /** الأيقونة — لا إيموجي: الإيموجي يُرسَم بخط النظام فيختلف بين أندرويد وiOS */
  Icon: LucideIcon
}

export const CATEGORY: Record<CategoryKey, CategoryStyle> = {
  'محاضرات': {
    label: 'محاضرات',
    short: 'مذكرة',
    bg: 'bg-navy-50',
    ink: 'text-navy-900',
    border: 'border-navy-200/60',
    iconBg: 'bg-navy-50',
    iconInk: 'text-navy-800',
    Icon: BookOpen,
  },
  'أدوات طبية': {
    label: 'أدوات طبية',
    short: 'طبي',
    bg: 'bg-teal-50',
    ink: 'text-teal-800',
    border: 'border-teal-200/60',
    iconBg: 'bg-teal-50',
    iconInk: 'text-teal-800',
    Icon: Stethoscope,
  },
  'أدوات مكتبية': {
    label: 'أدوات مكتبية',
    short: 'مكتبي',
    bg: 'bg-amber-50',
    ink: 'text-navy-900',
    border: 'border-amber-200/70',
    iconBg: 'bg-amber-50',
    iconInk: 'text-amber-600',
    Icon: PenLine,
  },
}

/** احتياطي محايد لأي تصنيف غير معروف — لا يُخترع لون جديد أبدًا. */
export const CATEGORY_FALLBACK: CategoryStyle = {
  label: 'منتج',
  short: 'منتج',
  bg: 'bg-brand-grey-50',
  ink: 'text-brand-grey-700',
  border: 'border-brand-grey-200',
  iconBg: 'bg-brand-grey-50',
  iconInk: 'text-brand-grey-400',
  Icon: Package,
}

export function categoryStyle(category: string | undefined): CategoryStyle {
  if (!category) return CATEGORY_FALLBACK
  return CATEGORY[category as CategoryKey] ?? CATEGORY_FALLBACK
}

/** أصناف جاهزة لشارة كاملة — الاستخدام الأشيع، سطر واحد بدل أربعة. */
export function categoryBadgeClass(category: string | undefined): string {
  const c = categoryStyle(category)
  return `${c.bg} ${c.ink} border ${c.border}`
}

/** ترتيب العرض الثابت — يمنع اختلاف ترتيب التصنيفات بين شاشة وأخرى. */
export const CATEGORY_ORDER: CategoryKey[] = ['محاضرات', 'أدوات طبية', 'أدوات مكتبية']
