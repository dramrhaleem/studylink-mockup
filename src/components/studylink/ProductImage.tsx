'use client'

import { asset } from '@/lib/asset'

import { useState } from 'react'
import Image from 'next/image'
import { BookOpen, Stethoscope, PenLine, Package } from 'lucide-react'

interface ProductImageProps {
  category: string
  title?: string
  image?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** true عندما يقع بجانب عنوان المنتج نفسه — الصورة زخرفية فلا تُكرَّر للقارئ. */
  decorative?: boolean
}

/* الصور موجودة فعليًا في public/products (تُولَّد من scripts/gen-product-art.mjs).
   قبل ذلك كانت كل هذه المسارات تُرجع 404، فتظهر أيقونة صورة مكسورة في كل
   بطاقة على كل شاشة. */
const categoryImages: Record<string, string> = {
  'محاضرات': asset('/products/lectures.png'),
  'أدوات طبية': asset('/products/stethoscope.png'),
  'أدوات مكتبية': asset('/products/stationery.png'),
}

const subjectImages: Record<string, string> = {
  'تشريح': asset('/products/anatomy-notes.png'),
  'فسيولوجي': asset('/products/pharmacology.png'),
  'أطفال': asset('/products/pediatrics.png'),
  'جراحة': asset('/products/surgery.png'),
  'باطنة': asset('/products/internal-medicine.png'),
  'أدوية': asset('/products/medicines.png'),
  'باثولوجي': asset('/products/pathology.png'),
  'نسا': asset('/products/obstetrics-gynecology.png'),
}

const categoryFallback: Record<string, { bg: string; fg: string; Icon: typeof BookOpen }> = {
  'محاضرات':       { bg: 'bg-navy-50', fg: 'text-navy-800', Icon: BookOpen },
  'أدوات طبية':    { bg: 'bg-teal-50', fg: 'text-teal-800', Icon: Stethoscope },
  'أدوات مكتبية':  { bg: 'bg-amber-50', fg: 'text-amber-600', Icon: PenLine },
}

const sizeMap = {
  sm: { container: 'h-[52px]', image: 44, icon: 'w-6 h-6' },
  md: { container: 'h-[80px]', image: 64, icon: 'w-8 h-8' },
  lg: { container: 'h-[200px]', image: 132, icon: 'w-14 h-14' },
}

export default function ProductImage({
  category,
  title,
  image,
  size = 'sm',
  className = '',
  decorative = true,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const config = sizeMap[size]

  let src = image || null
  if (!src && title) {
    for (const [key, val] of Object.entries(subjectImages)) {
      if (title.includes(key)) { src = val; break }
    }
  }
  if (!src) src = categoryImages[category] ?? null

  const fb = categoryFallback[category] ?? { bg: 'bg-brand-grey-50', fg: 'text-brand-grey-400', Icon: Package }
  const FallbackIcon = fb.Icon

  /* الاحتياطي أصبح أيقونة براند بدل إيموجي: الإيموجي يُرسم بخط النظام فيختلف
     شكله بين أندرويد وiOS والويب، ولا يخضع لأي قاعدة في نظام التصميم. */
  if (!src || failed) {
    return (
      <div
        className={`relative ${config.container} ${fb.bg} flex items-center justify-center overflow-hidden ${className}`}
        role={decorative ? 'presentation' : 'img'}
        aria-label={decorative ? undefined : `${category}${title ? ` — ${title}` : ''}`}
      >
        <FallbackIcon className={`${config.icon} ${fb.fg} opacity-45`} strokeWidth={1.6} aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className={`relative ${config.container} bg-brand-grey-50 flex items-center justify-center overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={decorative ? '' : (title || category)}
        aria-hidden={decorative || undefined}
        width={config.image}
        height={config.image}
        className="object-contain relative z-10"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  )
}
