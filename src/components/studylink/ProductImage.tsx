'use client'

import { asset } from '@/lib/asset'

import { useState } from 'react'
import Image from 'next/image'
import { categoryStyle } from '@/lib/category'

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

  const fb = categoryStyle(category)
  const FallbackIcon = fb.Icon

  /* الاحتياطي أصبح أيقونة براند بدل إيموجي: الإيموجي يُرسم بخط النظام فيختلف
     شكله بين أندرويد وiOS والويب، ولا يخضع لأي قاعدة في نظام التصميم. */
  if (!src || failed) {
    return (
      <div
        className={`relative ${config.container} ${fb.iconBg} flex items-center justify-center overflow-hidden ${className}`}
        role={decorative ? 'presentation' : 'img'}
        aria-label={decorative ? undefined : `${category}${title ? ` — ${title}` : ''}`}
      >
        <FallbackIcon className={`${config.icon} ${fb.iconInk} opacity-45`} strokeWidth={1.6} aria-hidden="true" />
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
