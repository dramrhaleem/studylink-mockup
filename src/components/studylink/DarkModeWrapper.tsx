'use client'

/**
 * كان هذا المكوّن غلافًا فارغًا اسمه يوحي بأنه يدير الوضع الداكن بينما لا
 * يفعل شيئًا، ولا توجد أصلًا متغيّرات داكنة في الـCSS. الآن يطبّق فعلًا صنف
 * `dark` الذي تلتقطه طبقة التوكنز في `globals.css`، والقيم الداكنة مأخوذة
 * حرفيًا من `02-color/tokens.css` في حزمة الهوية.
 */
export default function DarkModeWrapper({
  children,
  theme = 'light',
}: {
  children: React.ReactNode
  theme?: 'light' | 'dark'
}) {
  return (
    <div
      className={`h-full flex flex-col ${theme === 'dark' ? 'dark' : ''}`}
      data-theme={theme}
    >
      {children}
    </div>
  )
}
