'use client'

import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  enabled: boolean
  onToggle: () => void
  label: string
  disabled?: boolean
}

/**
 * مفتاح تبديل صحيح في RTL.
 *
 * الخطأ السابق (كان مكررًا في MoreScreen وProfileScreen وفي shadcn Switch):
 * الحبّة `absolute` بلا مرساة أفقية، فتستقر عند بداية المسار — وبداية المسار
 * في RTL هي **اليمين** — ثم يحرّكها `x: 20` نحو **اليمين** أيضًا، فتخرج من
 * المسار وتختفي. المستخدم يرى مسارًا ملوّنًا بلا حبّة، ولا يعرف حالة المفتاح.
 *
 * `translateX` خاصية فيزيائية لا منطقية، فالإزاحة في RTL يجب أن تكون سالبة.
 */
export default function ToggleSwitch({ enabled, onToggle, label, disabled }: ToggleSwitchProps) {
  return (
    <button data-tap="44"
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
        enabled ? 'bg-sky-600' : 'bg-brand-grey-300'
      } tap-44`}
    >
      <motion.span
        aria-hidden="true"
        animate={{ x: enabled ? -20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 start-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  )
}
