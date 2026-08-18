'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md'
  showCount?: boolean
  count?: number
}

export default function StarRating({
  rating,
  size = 'sm',
  showCount = false,
  count,
}: StarRatingProps) {
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const textSize = size === 'sm' ? 'text-[12px]' : 'text-[13px]'
  const countTextSize = size === 'sm' ? 'text-[12px]' : 'text-[13px]'
  const clampedRating = Math.max(0, Math.min(5, rating))

  const stars: React.JSX.Element[] = []
  for (let i = 1; i <= 5; i++) {
    if (clampedRating >= i) {
      // Full star
      stars.push(
        <Star
          key={i}
          className={`${starSize} text-amber-400 fill-amber-400`}
        />
      )
    } else if (clampedRating >= i - 0.5) {
      // Half star — use half opacity to simulate
      stars.push(
        <span key={i} className="relative inline-flex">
          <Star className={`${starSize} text-amber-400/50`} />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className={`${starSize} text-amber-400 fill-amber-400`} />
          </span>
        </span>
      )
    } else {
      // Empty star
      stars.push(
        <Star
          key={i}
          className={`${starSize} text-brand-grey-200`}
        />
      )
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      <div className="flex items-center gap-px">{stars}</div>
      <span className={`${textSize} font-semibold sl-num text-brand-grey-700 ml-0.5`}>
        {clampedRating.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className={`${countTextSize} text-brand-grey-400`}>
          ({count} تقييم)
        </span>
      )}
    </div>
  )
}