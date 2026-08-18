'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Package,
  Clock,
  TrendingUp,
  Bell,
  X,
  ShoppingBag,
  Sparkles,
  Settings,
  CheckCircle2,
  Truck,
  Tag,
  Info,
  BellRing,
  CheckCheck,
} from 'lucide-react'

interface NotificationsScreenProps {
  onNavigate?: (screen: string) => void
}

type TabType = 'all' | 'orders' | 'offers' | 'system'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  timestamp: number
  iconBg: string
  iconColor: string
  unread?: boolean
  group: 'today' | 'yesterday' | 'week'
  type: 'order' | 'offer' | 'system'
  subType?: 'confirmed' | 'shipped' | 'delivered' | 'rate'
}

interface OrderSummary {
  id: string
  orderNumber: string
  itemCount: string
  status: string
  statusType: 'active' | 'completed'
  total: string
  date: string
  storeItems: { store: string; items: string }[]
}

const NOW = Date.now()
const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'تأكيد الطلب',
    description: 'تم تأمين طلبك بنجاح! رقم الطلب #1092. تم حجز مذكرتك رسمياً في مكتبة هارفرد',
    time: '5 دقائق',
    timestamp: NOW - 5 * MINUTE,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500',
    unread: true,
    group: 'today',
    type: 'order',
    subType: 'confirmed',
  },
  {
    id: 'n2',
    title: 'في الطريق',
    description: 'مذكرتك جاهزة والمندوب في الطريق إليك. الوقت التقديري للوصول في صفحة التتبع.',
    time: '25 دقيقة',
    timestamp: NOW - 25 * MINUTE,
    iconBg: 'bg-brand-grey-50',
    iconColor: 'text-brand-grey-500',
    unread: true,
    group: 'today',
    type: 'order',
    subType: 'shipped',
  },
  {
    id: 'n3',
    title: 'عرض خاص',
    description: 'باقة الأسبوع الحالي متاحة الآن! 5 مذكرات بـ 85 جنيهاً بسعر خاص',
    time: '1 ساعة',
    timestamp: NOW - 1 * HOUR,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    unread: true,
    group: 'today',
    type: 'offer',
    subType: undefined,
  },
  {
    id: 'n4',
    title: 'تم التسليم',
    description: 'تم تسليم طلبك #1085 بنجاح! نأمل إن المذكرات كانت مفيدة',
    time: 'أمس 3:15 م',
    timestamp: NOW - 1 * DAY - 2 * HOUR,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    group: 'yesterday',
    type: 'order',
    subType: 'delivered',
  },
  {
    id: 'n5',
    title: 'تنبيه توفر',
    description: 'وفرت 5 جنيه في التوصيل! سعر التوصيل مع StudyLink 25 ج.م بدل 30 ج.م',
    time: 'أمس 9:00 ص',
    timestamp: NOW - 1 * DAY - 6 * HOUR,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    group: 'yesterday',
    type: 'system',
    subType: undefined,
  },
  {
    id: 'n6',
    title: 'رأيك في التجربة',
    description: 'قول لنا رأيك في تجربة الطلب — دقيقة واحدة بس',
    time: 'الاثنين',
    timestamp: NOW - 3 * DAY,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    group: 'week',
    type: 'order',
    subType: 'rate',
  },
]

const orders: OrderSummary[] = [
  {
    id: 'o1',
    orderNumber: '#1092',
    itemCount: '3 مذكرات',
    status: 'مع المندوب',
    statusType: 'active',
    total: '120 ج.م',
    date: 'اليوم 2:30 م',
    storeItems: [
      { store: 'هارفرد', items: '2 مذكرة' },
      { store: 'برلين', items: '1 مذكرة' },
    ],
  },
  {
    id: 'o2',
    orderNumber: '#1085',
    itemCount: '2 أداة طبية',
    status: 'تم التسليم',
    statusType: 'completed',
    total: '85 ج.م',
    date: 'أمس 11:00 ص',
    storeItems: [
      { store: 'هارفرد', items: 'سماعة ليتمان + بالطو' },
    ],
  },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

const tabs: { id: TabType; label: string; icon: typeof Clock }[] = [
  { id: 'all', label: 'الكل', icon: Clock },
  { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
  { id: 'offers', label: 'العروض', icon: Sparkles },
  { id: 'system', label: 'النظام', icon: Settings },
]

const groupLabels: Record<string, string> = {
  today: 'اليوم',
  yesterday: 'أمس',
  week: 'هذا الأسبوع',
}

const groupColors: Record<string, string> = {
  today: 'bg-sky-500',
  yesterday: 'bg-brand-grey-400',
  week: 'bg-brand-grey-300',
}

function getTypeIcon(type: 'order' | 'offer' | 'system', subType?: string) {
  if (type === 'order') {
    switch (subType) {
      case 'confirmed': return <CheckCircle2 className="w-4.5 h-4.5" />
      case 'shipped': return <Truck className="w-4.5 h-4.5" />
      case 'delivered': return <Package className="w-4.5 h-4.5" />
      case 'rate': return <Tag className="w-4.5 h-4.5" />
      default: return <ShoppingBag className="w-4.5 h-4.5" />
    }
  }
  if (type === 'offer') return <Tag className="w-4.5 h-4.5" />
  return <Info className="w-4.5 h-4.5" />
}

function getTypeBgColor(type: 'order' | 'offer' | 'system', subType?: string): string {
  if (type === 'order') {
    switch (subType) {
      case 'confirmed': return 'bg-sky-50'
      case 'shipped': return 'bg-brand-grey-50'
      case 'delivered': return 'bg-teal-50'
      case 'rate': return 'bg-amber-50'
      default: return 'bg-sky-50'
    }
  }
  if (type === 'offer') return 'bg-amber-50'
  return 'bg-teal-50'
}

function getTypeTextColor(type: 'order' | 'offer' | 'system', subType?: string): string {
  if (type === 'order') {
    switch (subType) {
      case 'confirmed': return 'text-sky-500'
      case 'shipped': return 'text-brand-grey-500'
      case 'delivered': return 'text-teal-500'
      case 'rate': return 'text-amber-500'
      default: return 'text-sky-500'
    }
  }
  if (type === 'offer') return 'text-amber-500'
  return 'text-teal-500'
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / MINUTE)
  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `منذ ${minutes} د`
  const hours = Math.floor(diff / HOUR)
  if (hours < 24) return `منذ ${hours} س`
  const days = Math.floor(diff / DAY)
  if (days === 1) return 'أمس'
  if (days < 7) return `منذ ${days} أيام`
  return `منذ ${Math.floor(days / 7)} أسبوع`
}

export default function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [notifications, setNotifications] = useState(initialNotifications)
  const [markingAll, setMarkingAll] = useState(false)
  const unreadCount = notifications.filter(n => n.unread).length

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleMarkAllRead = useCallback(() => {
    setMarkingAll(true)
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    setTimeout(() => setMarkingAll(false), 600)
  }, [])

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true
    if (activeTab === 'orders') return n.type === 'order'
    if (activeTab === 'offers') return n.type === 'offer'
    if (activeTab === 'system') return n.type === 'system'
    return true
  })

  const groups = ['today', 'yesterday', 'week'] as const

  return (
    <div className="screen-enter min-h-full bg-brand-grey-100">
      {/* Gradient Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-800/95 to-navy-800/80 pointer-events-none z-0" />
        <div className="absolute -top-16 -end-16 w-40 h-40 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -start-8 w-32 h-32 rounded-full bg-sky-400/8 blur-2xl pointer-events-none" />

        <div className="relative z-10 px-4 pt-3 pb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="w-8" />
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <BellRing className="w-4 h-4 text-sky-300" />
              </motion.div>
              <h1 className="text-[15px] font-bold text-white">الإشعارات</h1>
              {unreadCount > 0 && (
                <motion.span
                  key={unreadCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="bg-error text-white text-[12px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 relative"
                >
                  {unreadCount}
                  <motion.span
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-error"
                  />
                </motion.span>
              )}
            </div>
            <button data-tap="44" aria-label="رجوع"
              onClick={() => onNavigate?.('home')}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors tap-44"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mark all as read + Filter Tabs */}
      <div className="bg-white px-4 pb-3 border-b border-brand-grey-200/50 shadow-sm">
        {/* Mark all as read button */}
        {unreadCount > 0 && activeTab === 'all' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-end mb-2"
          >
            <motion.button data-tap="44"
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-sky-500 hover:text-sky-600 transition-colors px-2.5 py-1 rounded-full hover:bg-sky-50"
            >
              <motion.div
                animate={markingAll ? { rotate: [0, 360] } : {}}
                transition={{ duration: 0.5 }}
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </motion.div>
              تعيين الكل كمقروء
            </motion.button>
          </motion.div>
        )}

        {/* Filter Tabs with animated underline */}
        <div className="relative flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button data-tap="44"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-3 text-[13px] font-semibold text-center transition-colors relative"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-sky-500' : 'text-brand-grey-400'}`} />
                  <span className={activeTab === tab.id ? 'text-navy-800' : 'text-brand-grey-500'}>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 end-2 start-2 h-[2.5px] bg-gradient-to-r from-sky-500 to-sky-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-6">
        {activeTab === 'all' ? (
          notifications.length === 0 ? (
            /* Enhanced empty state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-50 to-brand-grey-100 flex items-center justify-center mb-5 shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                  <Bell className="w-8 h-8 text-brand-grey-400" />
                </div>
              </motion.div>
              <h3 className="text-[16px] font-bold text-navy-800 mb-1.5">لا توجد إشعارات</h3>
              <p className="text-[13px] text-brand-grey-400 text-center max-w-[200px] leading-relaxed">
                الإشعارات الجديدة هتظهر هنا، تابع العروض وتحديثات طلباتك
              </p>
            </motion.div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" key="all">
              {groups.map(group => {
                const groupNotifs = filteredNotifications.filter(n => n.group === group)
                if (groupNotifs.length === 0) return null
                return (
                  <div key={group} className="mb-4 last:mb-0">
                    <span className="text-[12px] text-brand-grey-400 font-medium mb-2 flex items-center gap-1.5 block">
                      <span className={`w-1 h-3 rounded-full ${groupColors[group]} inline-block`} />
                      {groupLabels[group]}
                    </span>
                    <div className="space-y-2.5">
                      <AnimatePresence mode="popLayout">
                        {groupNotifs.map((notification) => (
                          <motion.div
                            key={notification.id}
                            variants={staggerItem}
                            exit={{ x: -300, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
                            layout
                            className="relative"
                          >
                            <motion.div
                              whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                              className={`bg-white rounded-2xl p-3.5 shadow-sm border relative overflow-hidden ${
                                notification.unread
                                  ? 'border-sky-100'
                                  : 'border-brand-grey-200/50'
                              }`}
                            >
                              {/* Unread indicator bar */}
                              {notification.unread && (
                                <motion.div
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: 1 }}
                                  transition={{ delay: 0.1, duration: 0.3 }}
                                  className="absolute top-0 start-0 bottom-0 w-[3px] bg-sky-500 rounded-s-full origin-top"
                                />
                              )}

                              <div className="flex items-start gap-3">
                                {/* Type-based icon */}
                                <motion.div
                                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                                  transition={{ duration: 0.3 }}
                                  className={`w-10 h-10 rounded-xl ${getTypeBgColor(notification.type, notification.subType)} ${getTypeTextColor(notification.type, notification.subType)} flex items-center justify-center flex-shrink-0`}
                                >
                                  {getTypeIcon(notification.type, notification.subType)}
                                </motion.div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-[13px] font-bold text-navy-800 mb-1 leading-snug ${notification.unread ? '' : 'opacity-80'}`}>
                                      {notification.title}
                                    </p>
                                    <span className="text-[12px] text-brand-grey-400 flex-shrink-0 pt-0.5 whitespace-nowrap">
                                      {formatTimeAgo(notification.timestamp)}
                                    </span>
                                  </div>
                                  <p className={`text-[12px] text-brand-grey-500 leading-relaxed line-clamp-2 ${notification.unread ? '' : 'opacity-70'}`}>
                                    {notification.description}
                                  </p>

                                  {/* Type badge */}
                                  <div className="mt-1.5 flex items-center gap-1.5">
                                    <span className={`text-[12px] font-medium px-1.5 py-0.5 rounded-full ${
                                      notification.type === 'order'
                                        ? 'bg-sky-50 text-sky-600'
                                        : notification.type === 'offer'
                                          ? 'bg-amber-50 text-amber-600'
                                          : 'bg-teal-50 text-teal-600'
                                    }`}>
                                      {notification.type === 'order'
                                        ? 'طلب'
                                        : notification.type === 'offer'
                                          ? 'عرض'
                                          : 'نظام'}
                                    </span>
                                    {notification.unread && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Dismiss button */}
                              <motion.button data-tap="44" aria-label="إغلاق"
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.1)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDismiss(notification.id)}
                                className="absolute top-2 end-2 w-6 h-6 rounded-full bg-brand-grey-100 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 tap-44"
                              >
                                <X className="w-3 h-3 text-brand-grey-400" />
                              </motion.button>
                            </motion.div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
            {/* Active Order */}
            {orders.filter(o => o.statusType === 'active').map((order) => (
              <motion.div
                key={order.id}
                variants={staggerItem}
              >
                <motion.button data-tap="44"
                  whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.('tracking')}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-sky-200/50 text-start"
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2 h-2 rounded-full bg-success"
                      />
                      <span className="text-[12px] font-semibold text-success">{order.status}</span>
                    </div>
                    <p className="text-[13px] text-brand-grey-500">
                      طلب <span className="sl-num font-bold text-navy-800">{order.orderNumber}</span>
                    </p>
                  </div>

                  {/* Store items breakdown */}
                  <div className="space-y-1.5 mb-3">
                    {order.storeItems.map((si, i) => (
                      <div key={i} className="flex items-center justify-between text-[12px]">
                        <span className="text-brand-grey-600">مكتبة {si.store}: {si.items}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom */}
                  <div className="flex items-center justify-between pt-2 border-t border-brand-grey-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-brand-grey-700">{order.itemCount}</span>
                      <span className="text-brand-grey-400">·</span>
                      <span className="text-[12px] text-brand-grey-400">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-navy-800 sl-num">{order.total}</span>
                      <ChevronLeft className="w-4 h-4 text-brand-grey-400 rotate-180" />
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            ))}

            {/* Completed Orders */}
            <span className="text-[12px] text-brand-grey-400 font-medium flex items-center gap-1.5 block">
              <span className="w-1 h-3 rounded-full bg-brand-grey-300 inline-block" />
              مكتملة
            </span>
            {orders.filter(o => o.statusType === 'completed').map((order) => (
              <motion.div
                key={order.id}
                variants={staggerItem}
              >
                <motion.button data-tap="44"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.('tracking')}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50 text-start opacity-80"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-brand-grey-100 text-brand-grey-500">
                      {order.status}
                    </div>
                    <p className="text-[13px] text-brand-grey-500">
                      طلب <span className="sl-num font-bold text-navy-800">{order.orderNumber}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-brand-grey-700">{order.itemCount}</span>
                      <span className="text-brand-grey-400">·</span>
                      <span className="text-[12px] text-brand-grey-400">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-navy-800 sl-num">{order.total}</span>
                      <ChevronLeft className="w-4 h-4 text-brand-grey-400 rotate-180" />
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            ))}

            {/* Stats */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-brand-grey-200/50"
            >
              <p className="text-[13px] font-bold text-navy-800 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
                إحصائيات الطلبات
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <span className="text-[16px] font-bold sl-num text-navy-800">{orders.length}</span>
                  <p className="text-[12px] text-brand-grey-500">إجمالي الطلبات</p>
                </div>
                <div className="text-center">
                  <span className="text-[16px] font-bold sl-num text-sky-500">1</span>
                  <p className="text-[12px] text-brand-grey-500">نشط</p>
                </div>
                <div className="text-center">
                  <span className="text-[16px] font-bold sl-num text-success">205 ج.م</span>
                  <p className="text-[12px] text-brand-grey-500">إجمالي المنفق</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Bottom safe area */}
      <div className="h-20" />
    </div>
  )
}