/**
 * مراحل الطلب — المصدر الوحيد لحالة أي طلب في التطبيق.
 *
 * لماذا ملف مستقل؟ كانت المراحل مكتوبة مرتين: مصفوفة `allSteps` داخل
 * `TrackingScreen`، ونصوص حالة حرّة داخل `CheckoutScreen` (`'جاري التحضير'`)
 * و`studylink-data.ts` (`'مع المندوب'`). أي شريط جديد يعرض حالة الطلب كان
 * سيصير التعريف الثالث. الآن كلها تقرأ من هنا.
 *
 * في المنتج الحقيقي: المرحلة تأتي من الباك-إند مع كل تحديث حالة. هنا تُشتقّ
 * من زمن إنشاء الطلب كي يبدو الخط الزمني حيًّا في المعاينة (راجع `demoStage`).
 */

import { Check, Package, PackageCheck, Truck, CircleCheckBig, type LucideIcon } from 'lucide-react'
import type { SavedOrder } from '@/lib/use-studylink-store'

export interface OrderStage {
  key: string
  /** التسمية المعروضة — هي نفسها المخزّنة في `SavedOrder.status` */
  label: string
  /** سطر يشرح ما يحدث الآن، للمستخدم لا للمطوّر */
  hint: string
  Icon: LucideIcon
}

export const ORDER_STAGES: OrderStage[] = [
  { key: 'accepted',  label: 'تم القبول',    hint: 'المكتبة استلمت طلبك',          Icon: Check },
  { key: 'preparing', label: 'بيتجهز',       hint: 'جاري تجهيز الطلب في المكتبة',   Icon: Package },
  { key: 'ready',     label: 'جاهز للتسليم', hint: 'الطلب جاهز في انتظار المندوب',  Icon: PackageCheck },
  { key: 'courier',   label: 'مع المندوب',   hint: 'المندوب في الطريق إليك',        Icon: Truck },
  { key: 'delivered', label: 'تم التسليم',   hint: 'تم التسليم',                    Icon: CircleCheckBig },
]

/** مرادفات نصية وردت في الكود قبل توحيد المراحل — تُقبل ولا تُنتَج. */
const ALIASES: Record<string, string> = {
  'جاري التحضير': 'بيتجهز',
  'قيد التحضير': 'بيتجهز',
  'قيد التجهيز': 'بيتجهز',
  'في الطريق': 'مع المندوب',
  'تم الاستلام': 'تم التسليم',
}

export function stageIndexOf(status: string | undefined): number {
  if (!status) return 0
  const norm = ALIASES[status.trim()] ?? status.trim()
  const i = ORDER_STAGES.findIndex(s => s.label === norm)
  return i === -1 ? 0 : i
}

/** أول طلب نشط — الطلبات مخزَّنة من الأحدث للأقدم. */
export function activeOrder(orders: SavedOrder[]): SavedOrder | null {
  return orders.find(o => o.statusType === 'active') ?? null
}

/**
 * زمن إنشاء الطلب. `createdAt` أُضيف لاحقًا، والطلبات القديمة المحفوظة في
 * `localStorage` لا تحمله — فيُشتقّ من المعرّف `order-<epoch>` كاحتياطي.
 */
export function orderCreatedAt(order: SavedOrder): number | null {
  if (order.createdAt) {
    const t = Date.parse(order.createdAt)
    if (!Number.isNaN(t)) return t
  }
  const m = /^order-(\d{10,})$/.exec(order.id)
  return m ? Number(m[1]) : null
}

/**
 * ⚠️ محاكاة للمعاينة فقط.
 *
 * المرحلة تُشتقّ من الزمن المنقضي منذ إنشاء الطلب، فيتقدّم الخط الزمني وحده
 * أمام من يعاين الموك اب، ويبقى ثابتًا بعد إعادة التحميل (لأنه محسوب لا مخزَّن).
 * الإيقاع مضغوط عمدًا كي تُرى كل المراحل في دقائق.
 *
 * **في المنتج الحقيقي احذف هذه الدالة.** المرحلة تأتي من الباك-إند، ولا يجوز
 * اشتقاق حالة تشغيلية من ساعة العميل.
 */
export const DEMO_STAGE_EVERY_MS = 45_000

export function demoStageIndex(order: SavedOrder, now: number): number {
  const base = stageIndexOf(order.status)
  const created = orderCreatedAt(order)
  if (created === null) return base
  const advanced = Math.floor(Math.max(0, now - created) / DEMO_STAGE_EVERY_MS)
  return Math.min(ORDER_STAGES.length - 1, base + advanced)
}

export function stageProgressPercent(index: number): number {
  return Math.round((index / (ORDER_STAGES.length - 1)) * 100)
}
