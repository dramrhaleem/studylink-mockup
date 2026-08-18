'use client'

import { cn } from '@/lib/utils'

/* ─── SkeletonCard ──────────────────────────────────────────────── */

interface SkeletonCardProps {
  className?: string
  count?: number
}

export function SkeletonCard({ className, count = 1 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-white rounded-2xl p-3 shadow-sm w-[155px] flex-shrink-0',
            className,
          )}
        >
          {/* Image placeholder */}
          <div className="w-[120px] h-[90px] rounded-xl bg-brand-grey-200 animate-pulse" />

          {/* Text lines */}
          <div className="mt-2.5 space-y-1.5">
            <div className="h-3 rounded bg-brand-grey-200 animate-pulse w-[70%]" />
            <div className="h-3 rounded bg-brand-grey-200 animate-pulse w-[40%]" />
          </div>

          {/* Bottom row */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-brand-grey-200/50">
            <div className="w-4 h-4 rounded-full bg-brand-grey-200 animate-pulse flex-shrink-0" />
            <div className="h-2.5 rounded bg-brand-grey-200 animate-pulse w-[30%]" />
            <div className="h-2.5 rounded bg-brand-grey-200 animate-pulse w-[20%] ml-auto" />
          </div>
        </div>
      ))}
    </>
  )
}

/* ─── SkeletonList ──────────────────────────────────────────────── */

interface SkeletonListProps {
  className?: string
  count?: number
}

export function SkeletonList({ className, count = 3 }: SkeletonListProps) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3 flex items-center gap-3"
        >
          {/* Left thumbnail */}
          <div className="w-12 h-12 rounded-xl bg-brand-grey-200 animate-pulse flex-shrink-0" />

          {/* Right text lines */}
          <div className="flex-1 space-y-2">
            <div className="h-3 rounded bg-brand-grey-200 animate-pulse w-[80%]" />
            <div className="h-3 rounded bg-brand-grey-200 animate-pulse w-[60%]" />
            <div className="h-3 rounded bg-brand-grey-200 animate-pulse w-[40%]" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── SkeletonHeader ────────────────────────────────────────────── */

interface SkeletonHeaderProps {
  className?: string
}

export function SkeletonHeader({ className }: SkeletonHeaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Title line */}
      <div className="h-5 w-32 rounded bg-brand-grey-200 animate-pulse" />

      {/* Pill shapes */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 rounded-full bg-brand-grey-200 animate-pulse" />
        <div className="h-8 w-20 rounded-full bg-brand-grey-200 animate-pulse" />
        <div className="h-8 w-28 rounded-full bg-brand-grey-200 animate-pulse" />
      </div>
    </div>
  )
}

/* ─── SkeletonStats ─────────────────────────────────────────────── */

interface SkeletonStatsProps {
  className?: string
}

export function SkeletonStats({ className }: SkeletonStatsProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl h-16 bg-brand-grey-200 animate-pulse"
        />
      ))}
    </div>
  )
}

/* ─── SkeletonBanner ────────────────────────────────────────────── */

interface SkeletonBannerProps {
  className?: string
}

export function SkeletonBanner({ className }: SkeletonBannerProps) {
  return (
    <div
      className={cn(
        'w-full h-40 rounded-2xl bg-brand-grey-200 animate-pulse relative overflow-hidden',
        className,
      )}
    >
      {/* Centered text line placeholders */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8">
        <div className="h-4 rounded bg-brand-grey-300/60 animate-pulse w-[60%]" />
        <div className="h-3 rounded bg-brand-grey-300/40 animate-pulse w-[40%]" />
      </div>
    </div>
  )
}

/* ─── SkeletonChat ──────────────────────────────────────────────── */

interface SkeletonChatProps {
  className?: string
  variant?: 'user' | 'bot'
}

export function SkeletonChat({
  className,
  variant = 'user',
}: SkeletonChatProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-brand-grey-200',
        variant === 'user'
          ? 'rounded-2xl rounded-tl-sm w-48 h-12'
          : 'rounded-2xl rounded-tr-sm w-56 h-16',
        className,
      )}
    />
  )
}

/* ─── SkeletonProductGrid ───────────────────────────────────── */
/** 3-column grid skeleton for tools / stationery screens */

interface SkeletonProductGridProps {
  className?: string
  count?: number
}

export function SkeletonProductGrid({ className, count = 9 }: SkeletonProductGridProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-brand-grey-200/50"
        >
          {/* Image */}
          <div className="w-full aspect-square bg-brand-grey-200 animate-pulse" />
          {/* Text */}
          <div className="p-2 space-y-1.5">
            <div className="h-2.5 rounded bg-brand-grey-200 animate-pulse w-[85%]" />
            <div className="h-2 rounded bg-brand-grey-200 animate-pulse w-[60%]" />
            {/* Price row */}
            <div className="flex items-center justify-between pt-1">
              <div className="h-3 rounded bg-brand-grey-200 animate-pulse w-[30%]" />
              <div className="w-5 h-5 rounded-full bg-brand-grey-200 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── SkeletonLectureGrid ───────────────────────────────────── */
/** 2-column grid skeleton for lecture cards */

interface SkeletonLectureGridProps {
  className?: string
  count?: number
}

export function SkeletonLectureGrid({ className, count = 6 }: SkeletonLectureGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2.5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50 p-3"
        >
          {/* Image */}
          <div className="w-full h-28 rounded-xl bg-brand-grey-200 animate-pulse mb-2.5" />
          {/* Title */}
          <div className="space-y-1.5">
            <div className="h-3 rounded bg-brand-grey-200 animate-pulse w-[90%]" />
            <div className="h-2.5 rounded bg-brand-grey-200 animate-pulse w-[50%]" />
          </div>
          {/* Bottom row */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-grey-200/50">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-brand-grey-200 animate-pulse" />
              <div className="h-2.5 rounded bg-brand-grey-200 animate-pulse w-[40%]" />
            </div>
            <div className="h-3 rounded bg-brand-grey-200 animate-pulse w-[25%]" />
          </div>
        </div>
      ))}
    </div>
  )
}