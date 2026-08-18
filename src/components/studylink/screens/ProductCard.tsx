'use client'

import { asset } from '@/lib/asset'

import { Plus } from 'lucide-react'
import type { Product } from '@/lib/studylink-data'

const subjectImageMap: Record<string, string> = {
  'جراحة عامة': asset('/products/surgery.png'),
  'باطنة': asset('/products/internal-medicine.png'),
  'أطفال': asset('/products/pediatrics.png'),
  'فسيولوجي': asset('/products/pharmacology.png'),
  'تشريح': asset('/products/anatomy-notes.png'),
  'أدوية': asset('/products/medicines.png'),
  'باثولوجي': asset('/products/pathology.png'),
  'نسا وتوليد': asset('/products/obstetrics-gynecology.png'),
}

interface ProductCardProps {
  product: Product
  onAdd?: (product: Product) => void
  variant?: 'lecture' | 'tool'
}

export default function ProductCard({ product, onAdd, variant = 'lecture' }: ProductCardProps) {
  if (variant === 'tool') {
    return (
      <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50 ${!product.available ? 'opacity-60' : ''}`}>
        {/* Image placeholder */}
        <div className="h-20 bg-brand-grey-100 flex items-center justify-center relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            product.category === 'أدوات طبية' ? 'bg-teal-50' : 'bg-amber-50'
          }`}>
            <span className="text-lg">
              {product.category === 'أدوات طبية' ? '🏥' : '✏️'}
            </span>
          </div>
          {/* Category badge */}
          <span className={`absolute top-2 right-2 text-[12px] font-semibold px-2 py-0.5 rounded-full ${
            product.category === 'أدوات طبية' 
              ? 'bg-teal-50 text-teal-900' 
              : 'bg-amber-50 text-amber-900'
          }`}>
            {product.category === 'أدوات طبية' ? 'طبي' : 'مكتبي'}
          </span>
        </div>
        <div className="p-2.5">
          <p className="text-[12px] font-medium text-brand-grey-900 line-clamp-2 leading-relaxed min-h-[30px]">
            {product.title}
          </p>
          {product.specs && (
            <p className="text-[12px] text-brand-grey-500 mt-1">{product.specs}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[13px] font-bold text-navy-800">{product.price} ج.م</span>
            {product.available ? (
              <button data-tap="44" aria-label="زيادة" 
                onClick={() => onAdd?.(product)}
                className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 active:scale-95 transition-all tap-44"
              >
                <Plus className="w-5 h-5" />
              </button>
            ) : (
              <span className="text-[12px] text-brand-grey-500 font-medium">غير متوفرة</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const subjectImage = product.subject ? subjectImageMap[product.subject] : null

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-grey-200/50 flex flex-col ${!product.available ? 'opacity-60' : ''}`}>
      {/* Subject Image */}
      {subjectImage && (
        <div className="relative w-full aspect-square bg-brand-grey-50">
          <img
            src={subjectImage}
            alt={product.subject || ''}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 right-2 text-[12px] font-semibold px-2 py-0.5 rounded-full bg-navy-800/80 text-white backdrop-blur-sm">
            {product.subject}
          </span>
        </div>
      )}
      {/* Category Badge - fallback when no image */}
      {!subjectImage && (
        <span className="inline-block self-start text-[12px] font-semibold px-2 py-0.5 rounded-full bg-navy-800 text-white m-3 mb-0">
          {product.subject}
        </span>
      )}
      
      <div className="p-3 flex flex-col flex-1">
        {/* Store Name */}
        <p className="text-[12px] text-brand-grey-500 font-medium mb-0.5">
          {product.store === 'هارفرد' ? '📚 مكتبة هارفرد' : '📖 مكتبة برلين'}
        </p>
        
        {/* Doctor */}
        {product.doctor && (
          <p className="text-[12px] text-brand-grey-600 mb-1">{product.doctor}</p>
        )}
        
        {/* Title */}
        <p className="text-[13px] font-semibold text-brand-grey-900 line-clamp-2 leading-relaxed flex-1">
          {product.title}
        </p>
        
        {/* Details */}
        <div className="flex items-center gap-2 mt-2 text-[12px] text-brand-grey-500">
          {product.pages && <span>{product.pages} صفحة</span>}
          {product.paperSize && <span>· {product.paperSize}</span>}
        </div>
        
        {/* Price & Add */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-grey-200/50">
          <span className="text-[14px] font-bold text-navy-800 sl-num">{product.price} ج.م</span>
          {product.available ? (
            <button aria-label="زيادة" 
              onClick={() => onAdd?.(product)}
              className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center active:scale-95 transition-all shadow-sm shadow-sky-500/20"
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-[12px] text-brand-grey-500 bg-brand-grey-100 px-3 py-1.5 rounded-xl font-medium">غير متوفرة</span>
          )}
        </div>
      </div>
    </div>
  )
}