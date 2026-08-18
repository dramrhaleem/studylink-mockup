/* ============================================================================
 * StudyLink — pricing rules, single source of truth
 * ----------------------------------------------------------------------------
 * Before this file existed, the delivery fee was hard-coded in four places
 * (the store, CartScreen, CheckoutScreen twice) and the service fee in three.
 * They had already drifted. Every money number now lives here, once, with the
 * claim it comes from.
 *
 * Provenance — core/01-source-of-truth.md + core/02-claims-register.md:
 *   C-001  Verified  رسوم الخدمة = **10% من قيمة السلة**، بحدّ أدنى 3 جنيهات
 *                    وحدّ أقصى 8 جنيهات (إفادة المؤسس، 18 أغسطس 2026 — تحلّ محل
 *                    قاعدة «6–12 لكل مكتبة» المسجّلة في 29 يوليو 2026)
 *   C-002  Verified  توصيل الأيام العادية: الطالب يدفع 25 جنيهًا
 *   —      Verified  رسم تنفيذ الاستلام من المكتبة = صفر
 *                    (لا يلغي قيمة المنتجات ولا رسوم الخدمة — راجع C-029)
 *   C-021  Target    خطة الامتحانات: المندوب يأخذ 30، والطالب يظل يدفع 25
 *                    والفرق تتحمله المنصة
 *   C-003  Verified  بوابة الدفع أونلاين: 2.5% + 3 جنيهات
 *   —      Verified  عرض الإطلاق: توصيل مجاني
 *
 * OPEN (core/01، حالة TBD): نطاق رسم التوصيل في طلب المكتبتين — مرة واحدة للطلب
 * أم لكل مجموعة تنفيذ. النموذج هنا يفترض **مرة واحدة**، مطابقًا للافتراض المؤقت
 * المسجّل. لا تُرقّى الحالة قبل قرار في core/08-decisions-change-log.md.
 *
 * نطاق الاحتساب محسوم (إفادة المؤسس، 18 أغسطس 2026): رسم الخدمة يُحتسب على
 * **سلة كل مكتبة على حدة**، ثم تُجمع. طلب من مكتبتين يحمل رسمين مستقلين، كلٌّ
 * محكوم بحدَّيه، فالسقف الفعلي للطلب ثنائي المكتبة هو 16 جنيهًا.
 * ========================================================================== */

export const CURRENCY = 'ج.م' as const

/**
 * رسوم الخدمة — القاعدة السارية (إفادة المؤسس، 18 أغسطس 2026):
 * **10% من قيمة سلة كل مكتبة، بحدّ أدنى 3 جنيهات وحدّ أقصى 8 لكل مكتبة.**
 *
 * أثر الحدّين على سلة المكتبة الواحدة: حتى 30 جنيهًا تدفع الحدّ الأدنى 3،
 * ومن 35 إلى 75 تدفع النسبة، ومن 80 فأعلى تدفع الحدّ الأقصى 8.
 *
 * أثر النطاق: الرسم يُحتسب **لكل مكتبة على حدة ثم يُجمع**. مكتبتان = رسمان
 * مستقلان، كلٌّ محكوم بحدَّيه، فالسقف الفعلي لطلب ثنائي المكتبة 16 جنيهًا.
 * وتقسيم السلة بين مكتبتين قد يرفع الرسم مقابل نفس القيمة الإجمالية — مثال:
 * 60 جنيهًا من مكتبة واحدة = 6، ونفس الـ60 مقسومة 30/30 = 3 + 3 = 6، بينما
 * 20/40 = 3 + 4 = 7. هذا مقصود: كل مكتبة تنفيذ مستقل بتكلفة تجميع مستقلة.
 */
export const SERVICE_FEE = {
  rate: 0.10,
  min: 3,
  max: 8,
  /** 'per-store' = لكل مكتبة مشاركة (المعتمد) · 'per-order' = مرة على الإجمالي. */
  scope: 'per-store' as 'per-order' | 'per-store',
} as const

export const PRICING = {
  /** ما يدفعه الطالب مقابل التوصيل في الأيام العادية (C-002). */
  deliveryFee: 25,

  /** الاستلام من المكتبة: رسم التنفيذ صفر — ورسوم الخدمة تظل مستحقة. */
  pickupFee: 0,

  /** ما تدفعه المنصة للمندوب في فترة الامتحانات (C-021، Target). */
  examCourierPayout: 30,

  /** رسوم بوابة الدفع الإلكتروني (C-003). تُخصم من المنصة لا من الطالب. */
  onlineGateway: { percent: 0.025, fixed: 3 },

  /** خسارة إلغاء/رفض الاستلام — عمولة المندوب. */
  cancellationLoss: 15,
} as const

/** مفاتيح تشغيل. تُقرأ من الباك-إند في الإنتاج؛ ثابتة هنا لأغراض الموك اب. */
export const PRICING_FLAGS = {
  /** عرض الإطلاق: توصيل مجاني. Verified كعرض، مطفأ افتراضيًا في المعاينة. */
  launchFreeDelivery: false,
  /** فترة الامتحانات فعّالة — تُظهر لافتة الشرح دون تغيير ما يدفعه الطالب. */
  examSeason: false,
} as const

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/**
 * رسم الخدمة لمبلغ أساس واحد. لا تستدعِها مباشرة من الواجهة —
 * استخدم `computeOrderTotals`.
 */
export function serviceFeeFor(base: number): number {
  if (base <= 0) return 0
  return clamp(Math.round(base * SERVICE_FEE.rate), SERVICE_FEE.min, SERVICE_FEE.max)
}

export type DeliveryOption = 'delivery' | 'pickup'

export interface PricedLine {
  /** سعر الوحدة الرسمي من المكتبة. */
  price: number
  quantity: number
  /** اسم المكتبة المصدر — يحدد تجميع الطلب وعرضه. */
  store?: string
}

export interface OrderTotals {
  /** إجمالي قيمة المنتجات. */
  subtotal: number
  /** عدد المكتبات المشاركة في الطلب. */
  storeCount: number
  /** رسوم الخدمة = مجموع (10% من سلة كل مكتبة، مقصوصة بين 3 و8) — C-001. */
  serviceFee: number
  /** رسم التنفيذ فعليًا بعد العروض. */
  fulfillmentFee: number
  /** الرسم قبل تطبيق أي عرض — لعرض الشطب بأمانة. */
  fulfillmentFeeBeforeOffer: number
  /** الفرق الذي تتحمله المنصة في فترة الامتحانات، صفر خارجها. */
  platformAbsorbs: number
  total: number
}

const round = (n: number) => Math.round(n * 100) / 100

/** عدد المكتبات المتميزة في السلة — يُعرض للطالب، ويصير أساس الاحتساب
    لو ضُبط `SERVICE_FEE.scope` على 'per-store'. */
export function countStores(lines: PricedLine[]): number {
  const stores = new Set(
    lines.map(l => (l.store ?? '').trim()).filter(Boolean)
  )
  // سلة فيها منتجات بلا مصدر محدد تُعامل كمكتبة واحدة على الأقل.
  if (stores.size === 0) return lines.length > 0 ? 1 : 0
  return stores.size
}

/**
 * الحساب الوحيد المعتمد للطلب. لا تُعِد اشتقاق أي رقم من هذه خارج هذا الملف.
 */
export function computeOrderTotals(
  lines: PricedLine[],
  deliveryOption: DeliveryOption,
  flags: { launchFreeDelivery?: boolean; examSeason?: boolean } = {}
): OrderTotals {
  const launchFreeDelivery = flags.launchFreeDelivery ?? PRICING_FLAGS.launchFreeDelivery
  const examSeason = flags.examSeason ?? PRICING_FLAGS.examSeason

  const subtotal = round(
    lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
  )

  if (lines.length === 0) {
    return {
      subtotal: 0,
      storeCount: 0,
      serviceFee: 0,
      fulfillmentFee: 0,
      fulfillmentFeeBeforeOffer: 0,
      platformAbsorbs: 0,
      total: 0,
    }
  }

  const storeCount = countStores(lines)

  /* 10% من سلة كل مكتبة، مقصوصة بين 3 و8، ثم تُجمع الرسوم. */
  const serviceFee =
    SERVICE_FEE.scope === 'per-store'
      ? [...new Set(lines.map(l => (l.store ?? '').trim()))].reduce((sum, store) => {
          const storeSubtotal = lines
            .filter(l => (l.store ?? '').trim() === store)
            .reduce((t, l) => t + l.price * l.quantity, 0)
          return sum + serviceFeeFor(storeSubtotal)
        }, 0)
      : serviceFeeFor(subtotal)

  // TBD في core/01: رسم التوصيل يُحصَّل مرة واحدة للطلب مهما كان عدد المكتبات.
  const baseFulfillment =
    deliveryOption === 'delivery' ? PRICING.deliveryFee : PRICING.pickupFee

  const fulfillmentFee =
    deliveryOption === 'delivery' && launchFreeDelivery ? 0 : baseFulfillment

  // في الامتحانات يرتفع ما تدفعه المنصة للمندوب، ولا يتغير ما يدفعه الطالب.
  const platformAbsorbs =
    examSeason && deliveryOption === 'delivery'
      ? Math.max(0, PRICING.examCourierPayout - PRICING.deliveryFee)
      : 0

  return {
    subtotal,
    storeCount,
    serviceFee,
    fulfillmentFee,
    fulfillmentFeeBeforeOffer: baseFulfillment,
    platformAbsorbs,
    total: round(subtotal + serviceFee + fulfillmentFee),
  }
}

/**
 * تنسيق مبلغ للعرض. الأرقام غربية دائمًا (10-arabic §5) وتُلَفّ في `.sl-num`
 * عند العرض حتى لا تعكسها الخوارزمية ثنائية الاتجاه داخل جملة عربية.
 */
export function formatEGP(amount: number, withCurrency = true): string {
  const n = Number.isInteger(amount) ? String(amount) : amount.toFixed(2)
  return withCurrency ? `${n} ${CURRENCY}` : n
}

/** نص شرح رسوم الخدمة — يقول القاعدة بدل ترك الطالب يخمّن من أين جاء الرقم. */
export function serviceFeeNote(subtotal: number, storeCount = 1): string {
  if (subtotal <= 0) return 'رسم تشغيل وتأمين الطلب'
  const pct = Math.round(SERVICE_FEE.rate * 100)
  if (storeCount > 1) return `${pct}% من سلة كل مكتبة، بحدّ أدنى ${SERVICE_FEE.min} وأقصى ${SERVICE_FEE.max}`
  const raw = Math.round(subtotal * SERVICE_FEE.rate)
  if (raw <= SERVICE_FEE.min) return `الحدّ الأدنى لرسم الخدمة — ${SERVICE_FEE.min} ${CURRENCY}`
  if (raw >= SERVICE_FEE.max) return `الحدّ الأقصى لرسم الخدمة — ${SERVICE_FEE.max} ${CURRENCY}`
  return `${pct}% من قيمة الطلب`
}

/** تفصيل رسم كل مكتبة — لعرضه للطالب حين يكون الطلب من أكثر من مكتبة. */
export function serviceFeeByStore(lines: PricedLine[]): { store: string; subtotal: number; fee: number }[] {
  const stores = [...new Set(lines.map(l => (l.store ?? '').trim()).filter(Boolean))]
  return stores.map(store => {
    const subtotal = lines
      .filter(l => (l.store ?? '').trim() === store)
      .reduce((t, l) => t + l.price * l.quantity, 0)
    return { store, subtotal, fee: serviceFeeFor(subtotal) }
  })
}

/** لافتة فترة الامتحانات — الصياغة من design_system_specification §5.D. */
export const EXAM_SEASON_NOTE =
  `في فترة الامتحانات بيرتفع اللي بندفعه للمندوب عشان الطلبات توصل بسرعة. ` +
  `الفرق بتتحمله StudyLink، وتكلفة التوصيل عليك تفضل ${PRICING.deliveryFee} ${CURRENCY} زي ما هي.`
