'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Package, Check, Clock, Truck, Store, ChevronDown, ChevronUp, ShoppingCart, Inbox } from 'lucide-react'
import { useStudylinkStore, type SavedOrder } from '@/lib/use-studylink-store'
import BottomNavBar from '../BottomNavBar'

interface MyOrdersScreenProps {
  onNavigate?: (screen: string) => void
}

type FilterType = 'all' | 'active' | 'completed'

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Clock }> = {
  'جاري التحضير': { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  'مع المندوب': { color: 'text-sky-600', bg: 'bg-sky-50', icon: Truck },
  'تم التسليم': { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Check },
}

export default function MyOrdersScreen({ onNavigate }: MyOrdersScreenProps) {
  const orders = useStudylinkStore(s => s.orders)
  const user = useStudylinkStore(s => s.user)
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredOrders = orders.filter(o => {
    if (filter === 'active') return o.statusType === 'active'
    if (filter === 'completed') return o.statusType === 'completed'
    return true
  })

  if (!user) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center gap-3 px-4 pt-3 pb-4 bg-white border-b border-brand-grey-100">
          <button data-tap="44" aria-label="رجوع" onClick={() => onNavigate?.('profile')} className="w-9 h-9 rounded-full bg-brand-grey-50 flex items-center justify-center active:scale-95 transition-transform tap-44">
            <ChevronLeft className="w-4 h-4 text-navy-800" />
          </button>
          <h1 className="text-[15px] font-bold text-navy-900">طلباتي</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 bg-brand-grey-50">
          <div className="w-16 h-16 rounded-2xl bg-brand-grey-100 flex items-center justify-center mb-4">
            <Inbox className="w-7 h-7 text-brand-grey-400" />
          </div>
          <p className="text-[14px] font-bold text-navy-800 mb-1">سجّل دخولك الأول</p>
          <p className="text-[13px] text-brand-grey-400 text-center mb-5">عشان تشوف طلباتك وتتابعهم</p>
          <button data-tap="44"
            onClick={() => onNavigate?.('register')}
            className="bg-navy-800 text-white text-[13px] font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform"
          >
            سجّل الآن
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-brand-grey-100">
      <div className="flex-1 overflow-y-auto phone-scroll bg-brand-grey-50 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-3 bg-white border-b border-brand-grey-100">
          <button data-tap="44" aria-label="رجوع" onClick={() => onNavigate?.('profile')} className="w-9 h-9 rounded-full bg-brand-grey-50 flex items-center justify-center active:scale-95 transition-transform tap-44">
            <ChevronLeft className="w-4 h-4 text-navy-800" />
          </button>
          <h1 className="text-[15px] font-bold text-navy-900">طلباتي</h1>
          <div className="flex-1" />
          <span className="text-[12px] text-brand-grey-400 font-medium">{orders.length} طلب</span>
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-4 py-3 bg-white">
          {([['all', 'الكل'], ['active', 'نشطة'], ['completed', 'مكتملة']] as const).map(([key, label]) => (
            <button data-tap="44"
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${
                filter === key
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-white text-brand-grey-600 border border-brand-grey-200 active:bg-brand-grey-50'
              }`}
              style={{ minHeight: 48 }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="px-4 pt-2 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-brand-grey-100 flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-brand-grey-400" />
              </div>
              <p className="text-[13px] text-brand-grey-600 font-semibold mb-1">لا توجد طلبات</p>
              <p className="text-[12px] text-brand-grey-400 mb-4">شوف المحاضرات والأدوات واعمل أوردرك الأول!</p>
              <button data-tap="44"
                onClick={() => onNavigate?.('lectures')}
                className="bg-sky-500 text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-500/20 active:scale-95 transition-transform"
              >
                تصفح المحاضرات
              </button>
            </div>
          ) : (
            filteredOrders.map(order => {
              const cfg = statusConfig[order.status] || statusConfig['جاري التحضير']
              const StatusIcon = cfg.icon
              const isExpanded = expandedId === order.id

              return (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-white rounded-2xl shadow-sm border border-brand-grey-100 overflow-hidden"
                >
                  {/* Order Header */}
                  <button data-tap="44"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full px-4 py-3.5 flex items-start gap-3 text-right"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-grey-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShoppingCart className="w-5 h-5 text-brand-grey-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[12px] font-bold sl-num ${cfg.color} ${cfg.bg} px-2 py-0.5 rounded-md`}>
                          {order.status}
                        </span>
                        <span className="text-[12px] text-brand-grey-400 sl-num">{order.orderNumber}</span>
                      </div>
                      <p className="text-[13px] text-navy-800 font-medium mb-0.5">
                        {order.items.length} منتج
                      </p>
                      <p className="text-[12px] text-brand-grey-400">{order.date}</p>
                    </div>
                    <div className="text-left flex-shrink-0 pt-1">
                      <p className="text-[14px] font-extrabold text-navy-800 sl-num">{order.total}</p>
                      <p className="text-[12px] text-brand-grey-400">ج.م</p>
                    </div>
                  </button>

                  {/* Progress bar */}
                  <div className="px-4 pb-2">
                    <div className="h-1.5 bg-brand-grey-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${order.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${order.statusType === 'completed' ? 'bg-emerald-500' : 'bg-sky-500'}`}
                      />
                    </div>
                    {order.eta && (
                      <p className="text-[12px] text-brand-grey-400 mt-1">{order.eta}</p>
                    )}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-brand-grey-100 px-4 py-3 space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[12px] text-brand-grey-400 sl-num">×{item.qty}</span>
                                <span className="text-[13px] text-navy-800 truncate">{item.title}</span>
                              </div>
                              <span className="text-[13px] font-bold text-navy-800 sl-num flex-shrink-0">{item.price} ج.م</span>
                            </div>
                          ))}
                          <div className="border-t border-brand-grey-100 pt-2 flex items-center justify-between">
                            <span className="text-[12px] text-brand-grey-400">المجموع الفرعي</span>
                            <span className="text-[13px] font-bold text-navy-800 sl-num">{order.subtotal} ج.م</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-brand-grey-400">التوصيل</span>
                            <span className="text-[13px] font-bold text-navy-800 sl-num">{order.delivery} ج.م</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold text-navy-800">الإجمالي</span>
                            <span className="text-[14px] font-extrabold text-navy-800 sl-num">{order.total} ج.م</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}