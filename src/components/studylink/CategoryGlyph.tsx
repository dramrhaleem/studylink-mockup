import { categoryStyle } from '@/lib/category'

/**
 * أيقونة التصنيف. بديلة عن الإيموجي (📚 🏥 ✏️) الذي كان مبعثرًا في ٩ ملفات.
 *
 * لماذا لا إيموجي؟ الإيموجي يُرسَم بخط النظام، فيظهر بألوان وأسلوب مختلف تمامًا
 * على أندرويد وiOS وويندوز — أي أنه لون **خارج** لوحة البراند ولا يمكن ضبطه،
 * ولا يُعتمد عليه في لقطة تصميم يبني عليها مطوّر.
 */
export default function CategoryGlyph({
  category,
  className = 'w-5 h-5',
}: {
  category: string | undefined
  className?: string
}) {
  const c = categoryStyle(category)
  return <c.Icon className={`${className} ${c.iconInk}`} strokeWidth={1.8} aria-hidden="true" />
}
