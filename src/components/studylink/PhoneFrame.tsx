'use client'

import { motion } from 'framer-motion'
import DarkModeWrapper from './DarkModeWrapper'

interface PhoneFrameProps {
  children: React.ReactNode
  onNavigate?: (screen: string) => void
  theme?: 'light' | 'dark'
}

export default function PhoneFrame({ children, theme = 'light' }: PhoneFrameProps) {
  const isDark = theme === 'dark'
  const statusBarBg = isDark ? 'bg-[#0E1B2C]' : 'bg-white'
  const statusBarText = isDark ? 'text-[#F2EEE3]' : 'text-navy-800'
  /* كان الحبر ثابتًا على #13253A وهو رمادي محايد لا يخص العلامة. */
  const svgFill = isDark ? '#F2EEE3' : '#13253A'
  const scrollBg = isDark ? 'bg-[#0E1B2C]' : 'bg-brand-grey-100'

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Phone outer shadow/glow */}
      <div className="absolute -inset-4 rounded-[56px] bg-gradient-to-br from-[#0E1B2C]/20 via-sky-500/10 to-[#14243A]/20 blur-xl" />

      <div className="phone-frame relative z-10 flex flex-col" dir="rtl">
        {/* Side Buttons */}
        <div className="phone-btn-left-mute" aria-hidden="true" />
        <div className="phone-btn-left-top" aria-hidden="true" />
        <div className="phone-btn-left-bottom" aria-hidden="true" />
        <div className="phone-btn-right" aria-hidden="true" />

        {/* Dynamic Island */}
        <motion.div
          className="phone-dynamic-island flex-shrink-0"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [1, 0.92, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Status Bar */}
        <div className={'relative z-40 flex items-center justify-between px-8 pt-[14px] pb-1 flex-shrink-0 transition-colors duration-300 ' + statusBarBg}>
          <span className={'text-[12px] font-semibold sl-num ' + statusBarText}>9:41</span>

          <div className="flex items-center gap-[5px]">
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
              <rect x="0" y="8" width="3" height="3" rx="0.75" fill={svgFill}/>
              <rect x="4" y="5.5" width="3" height="5.5" rx="0.75" fill={svgFill}/>
              <rect x="8" y="3" width="3" height="8" rx="0.75" fill={svgFill}/>
              <rect x="12" y="0" width="3" height="11" rx="0.75" fill={svgFill}/>
            </svg>
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
              <path d="M7 9.5a1.25 1.25 0 110-2.5A1.25 1.25 0 017 9.5z" fill={svgFill}/>
              <path d="M4.05 6.55a4 4 0 015.9 0" stroke={svgFill} strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M1.8 4.3a7.25 7.25 0 0110.4 0" stroke={svgFill} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <svg width="24" height="11" viewBox="0 0 24 11" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" stroke={svgFill} strokeWidth="1"/>
              <rect x="2" y="2" width="14" height="7" rx="1.2" fill="#007C50"/>
              <rect x="16.5" y="3.5" width="1.2" height="4" rx="0.4" fill="#28885D" opacity="0.5"/>
              <path d="M21.5 3.5v4a1.75 1.75 0 000-4z" fill={svgFill} opacity="0.6"/>
            </svg>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-1 min-h-0 relative">
          <div className={'phone-scroll flex-1 overflow-y-auto min-h-0 transition-colors duration-300 ' + scrollBg}>
            <DarkModeWrapper theme={theme}>
              {children}
            </DarkModeWrapper>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="phone-home-indicator" style={isDark ? { background: '#F2EEE3' } : undefined} />
      </div>
    </div>
  )
}