'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product, GradeType } from './studylink-data'
import { computeOrderTotals, type DeliveryOption, type OrderTotals } from './pricing'

export interface CartItem {
  product: Product
  quantity: number
  variantKey?: string
}

export interface User {
  name: string
  phone: string
  grade: GradeType | null
  college: string | null
  createdAt: string
}

export interface SavedOrder {
  id: string
  orderNumber: string
  date: string
  status: string
  statusType: 'active' | 'completed'
  items: { title: string; store: string; qty: number; price: number }[]
  subtotal: number
  serviceFee: number
  delivery: number
  total: number
  progress: number
  eta?: string
  /** ISO — مصدر اشتقاق المرحلة في المعاينة. أُضيف بعد الإصدار الأول فهو اختياري. */
  createdAt?: string
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  type: 'order' | 'offer' | 'system'
  read: boolean
  createdAt: string
}

/** الحد الأقصى للكمية للصنف الواحد — يمنع إدخال رقم بلا سقف. */
export const MAX_QTY_PER_ITEM = 20

/** مفتاح مطابقة السطر: المنتج + المتغيّر. */
const lineKey = (productId: string, variantKey?: string) =>
  `${productId}::${variantKey ?? ''}`

const sameLine = (item: CartItem, productId: string, variantKey?: string) =>
  lineKey(item.product.id, item.variantKey) === lineKey(productId, variantKey)

interface StudylinkState {
  /** يصير true بعد قراءة التخزين المحلي — كل واجهة تعتمد على الحالة تنتظره. */
  hasHydrated: boolean
  setHasHydrated: (v: boolean) => void

  // Auth
  user: User | null
  register: (data: Omit<User, 'createdAt'>) => void
  updateUser: (patch: Partial<Omit<User, 'createdAt'>>) => void
  logout: () => void
  isLoggedIn: () => boolean

  // Cart
  cart: CartItem[]
  /** اسم بديل تاريخي — يظل مرآة لـ cart حتى لا يتفرّع مصدران للحقيقة. */
  cartItems: CartItem[]
  addToCart: (product: Product, variantKey?: string, quantity?: number) => void
  removeFromCart: (productId: string, variantKey?: string) => void
  updateQuantity: (productId: string, qty: number, variantKey?: string) => void
  clearCart: () => void
  getTotals: () => OrderTotals
  getCartTotal: () => number
  getCartCount: () => number
  isInCart: (productId: string, variantKey?: string) => boolean
  getCartQuantity: (productId: string, variantKey?: string) => number

  // Orders
  orders: SavedOrder[]
  addOrder: (order: SavedOrder) => void

  // Delivery
  deliveryOption: DeliveryOption
  setDeliveryOption: (option: DeliveryOption) => void

  // Grade
  selectedGrade: GradeType | null
  setSelectedGrade: (grade: GradeType | null) => void

  // Notifications
  notifications: NotificationItem[]
  getUnreadCount: () => number
  markAllNotificationsRead: () => void
  markNotificationRead: (id: string) => void
  addNotification: (notification: Omit<NotificationItem, 'read'>) => void

  // Recently viewed
  recentlyViewed: Product[]
  addToRecentlyViewed: (product: Product) => void
  clearRecentlyViewed: () => void

  resetAll: () => void
}

const syncCart = (cart: CartItem[]) => ({ cart, cartItems: cart })

/* الإشعارات الافتتاحية. قبل هذا كان `notificationCount: 3` مع قائمة فاضية،
   فتظهر شارة «٣» فوق شاشة لا تحتوي شيئًا. العدّاد الآن مشتق من القائمة. */
const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-welcome',
    title: 'أهلًا بك في StudyLink',
    description: 'اختار فرقتك عشان نعرض لك مذكرات مادتك بالظبط.',
    type: 'system',
    read: false,
    createdAt: '2026-08-16T09:00:00.000Z',
  },
  {
    id: 'n-pickup',
    title: 'الاستلام من المكتبة متاح',
    description: 'تقدر تختار تستلم طلبك من هارفرد أو برلين بدل التوصيل.',
    type: 'system',
    read: false,
    createdAt: '2026-08-15T14:30:00.000Z',
  },
]

/* طلب نشط افتتاحي — وجوده مقصود.
   شريط «الطلب الجاري» في الرئيسية لا يظهر إلا مع طلب نشط، والسلة تبدأ فارغة،
   فبلا هذا الطلب لا يرى المعاين الحالة أصلًا ولا يعرف أنها موجودة.
   `createdAt` يُضبط عند أول إقلاع (لا هنا) كي يبدأ الخط الزمني من لحظة
   المعاينة — قيمة ثابتة هنا كانت ستجعل الطلب «مسلَّمًا» دائمًا.
   احذف هذا البذر عند الوصل بباك-إند حقيقي. */
const SEED_ACTIVE_ORDER: SavedOrder = {
  id: 'order-seed-demo',
  orderNumber: '#1092',
  date: 'اليوم',
  status: 'تم القبول',
  statusType: 'active',
  items: [
    { title: 'تشريح — أطلس تشريحي ملون', store: 'هارفرد', qty: 1, price: 50 },
    { title: 'سماعة طبية — ليتمان', store: 'برلين', qty: 1, price: 38 },
  ],
  subtotal: 88,
  serviceFee: 9,
  delivery: 25,
  total: 122,
  progress: 20,
}

const INITIAL_STATE = {
  user: null as User | null,
  cart: [] as CartItem[],
  cartItems: [] as CartItem[],
  orders: [SEED_ACTIVE_ORDER] as SavedOrder[],
  deliveryOption: 'delivery' as DeliveryOption,
  selectedGrade: null as GradeType | null,
  notifications: SEED_NOTIFICATIONS,
  recentlyViewed: [] as Product[],
}

export const useStudylinkStore = create<StudylinkState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      // ── Auth ──────────────────────────────────────────────────────────────
      register: (data) =>
        set({
          user: { ...data, createdAt: new Date().toISOString() },
          selectedGrade: data.grade,
        }),

      updateUser: (patch) =>
        set((state) =>
          state.user
            ? {
                user: { ...state.user, ...patch },
                selectedGrade: patch.grade !== undefined ? patch.grade : state.selectedGrade,
              }
            : {}
        ),

      logout: () => set({ user: null }),

      isLoggedIn: () => get().user !== null,

      // ── Cart ──────────────────────────────────────────────────────────────
      addToCart: (product, variantKey, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find(i => sameLine(i, product.id, variantKey))
          if (existing) {
            return syncCart(
              state.cart.map(i =>
                sameLine(i, product.id, variantKey)
                  ? { ...i, quantity: Math.min(MAX_QTY_PER_ITEM, i.quantity + quantity) }
                  : i
              )
            )
          }
          return syncCart([
            ...state.cart,
            { product, quantity: Math.min(MAX_QTY_PER_ITEM, Math.max(1, quantity)), variantKey },
          ])
        })
      },

      removeFromCart: (productId, variantKey) => {
        set((state) => syncCart(state.cart.filter(i => !sameLine(i, productId, variantKey))))
      },

      /** كمية صفر أو أقل = حذف السطر، وليس تجاهلًا صامتًا كما كان. */
      updateQuantity: (productId, qty, variantKey) => {
        set((state) => {
          if (qty < 1) {
            return syncCart(state.cart.filter(i => !sameLine(i, productId, variantKey)))
          }
          const capped = Math.min(MAX_QTY_PER_ITEM, Math.floor(qty))
          return syncCart(
            state.cart.map(i =>
              sameLine(i, productId, variantKey) ? { ...i, quantity: capped } : i
            )
          )
        })
      },

      clearCart: () => set(syncCart([])),

      /** الحساب الكامل من `lib/pricing.ts` — لا أرقام مالية داخل هذا الملف. */
      getTotals: () => {
        const s = get()
        return computeOrderTotals(
          s.cart.map(i => ({
            price: i.product.price,
            quantity: i.quantity,
            store: i.product.store,
          })),
          s.deliveryOption
        )
      },

      getCartTotal: () => get().getTotals().total,

      getCartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      /** يحترم المتغيّر: مقاس A في السلة لا يجعل مقاس B يبدو مضافًا. */
      isInCart: (productId, variantKey) =>
        variantKey === undefined
          ? get().cart.some(i => i.product.id === productId)
          : get().cart.some(i => sameLine(i, productId, variantKey)),

      /** بدون متغيّر: مجموع كل متغيّرات المنتج، لا أوّل سطر يصادفه. */
      getCartQuantity: (productId, variantKey) => {
        const cart = get().cart
        if (variantKey === undefined) {
          return cart
            .filter(i => i.product.id === productId)
            .reduce((sum, i) => sum + i.quantity, 0)
        }
        return cart.find(i => sameLine(i, productId, variantKey))?.quantity ?? 0
      },

      // ── Orders ────────────────────────────────────────────────────────────
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
          cart: [],
          cartItems: [],
          notifications: [
            {
              id: `n-order-${order.orderNumber}`,
              title: 'استلمنا طلبك',
              description: `طلب رقم ${order.orderNumber} — هنبلغك بكل تغيير في حالته.`,
              type: 'order' as const,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),

      // ── Delivery ──────────────────────────────────────────────────────────
      setDeliveryOption: (option) => set({ deliveryOption: option }),

      // ── Grade ─────────────────────────────────────────────────────────────
      setSelectedGrade: (grade) => set({ selectedGrade: grade }),

      // ── Notifications ─────────────────────────────────────────────────────
      /* عدّاد مشتق. النسخة السابقة كانت getter داخل كائن الستور، والـ getter
         يُستدعى عند النشر (`{...state}`) في merge فيتجمّد على قيمة واحدة. */
      getUnreadCount: () => get().notifications.filter(n => !n.read).length,

      markAllNotificationsRead: () =>
        set((state) => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map(n => (n.id === id ? { ...n, read: true } : n)),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [{ ...notification, read: false }, ...state.notifications],
        })),

      // ── Recently viewed ───────────────────────────────────────────────────
      addToRecentlyViewed: (product) =>
        set((state) => ({
          recentlyViewed: [product, ...state.recentlyViewed.filter(p => p.id !== product.id)].slice(0, 20),
        })),

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      // ── Reset ─────────────────────────────────────────────────────────────
      resetAll: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'studylink-store',
      storage: createJSONStorage(() => localStorage),
      /* الترطيب يدوي: الخادم يرسم دائمًا الحالة الابتدائية، ثم نقرأ التخزين
         بعد التركيب. بدون هذا كان React يرمي hydration mismatch على كل تحميل. */
      skipHydration: true,
      version: 2,
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Record<string, unknown>
        // v1 كان يخزّن notificationCount منفصلًا عن القائمة — أُسقِط.
        delete p.notificationCount
        return p
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<StudylinkState>
        const cart = p.cart ?? p.cartItems ?? current.cart
        const notifications = p.notifications ?? current.notifications
        return { ...current, ...p, cart, cartItems: cart, notifications }
      },
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        orders: state.orders,
        deliveryOption: state.deliveryOption,
        selectedGrade: state.selectedGrade,
        notifications: state.notifications,
        recentlyViewed: state.recentlyViewed,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

/** يُستدعى مرة واحدة من مكوّن عميل بعد التركيب. */
export function hydrateStudylinkStore() {
  void useStudylinkStore.persist.rehydrate()

  /* ختم زمن الطلب الافتتاحي عند أول إقلاع.
     `Date.now()` ممنوع في القيمة الابتدائية: تُقيَّم على الخادم أثناء البناء،
     فيبدأ الطلب «مسلَّمًا» عند كل من يفتح الموقع بعد ذلك. الختم هنا يجعل
     الخط الزمني يبدأ من لحظة معاينة كل شخص. */
  const st = useStudylinkStore.getState()
  const seed = st.orders.find(o => o.id === 'order-seed-demo')
  if (seed && !seed.createdAt) {
    useStudylinkStore.setState({
      orders: st.orders.map(o =>
        o.id === 'order-seed-demo' ? { ...o, createdAt: new Date().toISOString() } : o
      ),
    })
  }
}

/** إعادة الضبط الكاملة: تمسح المخزّن ثم تعيد الحالة الابتدائية. */
export function resetStudylinkStore() {
  useStudylinkStore.getState().resetAll()
  try {
    localStorage.removeItem('studylink-store')
  } catch {
    /* التخزين غير متاح — لا شيء نمسحه. */
  }
}
