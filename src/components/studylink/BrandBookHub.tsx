'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  BookOpen, Download, ExternalLink, Copy, Check, HardDriveDownload, Palette,
} from 'lucide-react'
import { asset } from '@/lib/asset'
import {
  NATIVE_ICONS, ASSET_PACKS, DRIVE_FOLDER_URL, BRAND_BOOK_PATH,
} from '@/lib/brand-assets'

/**
 * قسم البراند بوك — يحلّ محلّ «دليل نظام التصميم».
 *
 * القسم السابق كان يعيد بناء نظام التصميم يدويًا في ١٤٢٤ سطرًا من JSX: لوحة
 * ألوان مكتوبة بالـhex، ومقاييس خطوط، وأمثلة أزرار وبطاقات. المشكلة أنه كان
 * **نسخة ثانية من المصدر** — أي تعديل في حزمة الهوية لا يصل إليه، فيصير مع
 * الوقت مرجعًا يناقض المرجع.
 *
 * هذا القسم يقدّم **المصدر نفسه**: البراند بوك الرسمي كما وُلّد من الحزمة،
 * وحزم الأصول جاهزة للتنزيل، والأيقونات الأصلية معروضة وقابلة للنسخ.
 */

const AUDIENCE_STYLE: Record<string, string> = {
  'مطوّر': 'bg-sky-50 text-sky-600 border-sky-200/60',
  'مصمّم': 'bg-navy-50 text-navy-800 border-navy-200/60',
  'تسويق': 'bg-amber-50 text-amber-600 border-amber-200/70',
}

function IconTile({ file, label }: { file: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const copyName = async () => {
    try {
      await navigator.clipboard.writeText(`${file}.svg`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* الحافظة غير متاحة (سياق غير آمن) — التنزيل المباشر يبقى متاحًا. */
    }
  }

  return (
    <div className="group relative flex flex-col items-center gap-1.5 rounded-xl border border-brand-grey-200/60 bg-white p-3 transition-colors hover:border-sky-300">
      <Image
        src={asset(`/brand/icons/${file}.svg`)}
        alt=""
        width={24}
        height={24}
        aria-hidden
        className="h-6 w-6"
        unoptimized
      />
      <span className="text-[12px] text-brand-grey-600 text-center leading-tight">{label}</span>
      <code dir="ltr" className="text-[11px] font-mono text-brand-grey-400">{file}</code>

      <div className="absolute inset-x-1 bottom-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={copyName}
          aria-label={`نسخ اسم ملف أيقونة ${label}`}
          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-navy-800 py-1 text-[11px] font-semibold text-white"
        >
          {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
          {copied ? 'تم' : 'نسخ'}
        </button>
        <a
          href={asset(`/brand/icons/${file}.svg`)}
          download
          aria-label={`تنزيل أيقونة ${label}`}
          className="flex items-center justify-center rounded-lg bg-brand-grey-100 px-2 py-1 text-navy-800"
        >
          <Download className="h-3 w-3" aria-hidden />
        </a>
      </div>
    </div>
  )
}

export default function BrandBookHub() {
  return (
    <section id="brand-book" className="bg-brand-grey-100 py-12 px-4" dir="rtl">
      <div className="mx-auto max-w-5xl">

        {/* ── العنوان ─────────────────────────────────────────────────── */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-3 py-1 text-[12px] font-semibold text-navy-800">
            <Palette className="h-3.5 w-3.5" aria-hidden />
            studylink-identity-v1
          </span>
          <h2 className="mt-3 text-[22px] font-bold text-navy-900">البراند بوك</h2>
          <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-relaxed text-brand-grey-500">
            المرجع البصري المعتمد للهوية. كل ما في هذه الصفحة مأخوذ كما هو من حزمة الهوية،
            لا مُعاد رسمه — فما تراه هنا هو ما يجب أن يُبنى عليه.
          </p>
        </div>

        {/* ── المدخلان الأساسيان ──────────────────────────────────────── */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={asset(BRAND_BOOK_PATH)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-2xl bg-navy-800 p-4 text-white shadow-sm shadow-navy-800/20 transition-transform active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
              <BookOpen className="h-5 w-5 text-amber-200" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[14px] font-bold">
                افتح البراند بوك الكامل
                <ExternalLink className="h-3.5 w-3.5 text-white/50" aria-hidden />
              </span>
              <span className="mt-1 block text-[12px] leading-relaxed text-white/70">
                الألوان والخطوط والشعار والمساحات والاستخدامات الممنوعة — صفحة واحدة مكتفية بذاتها.
              </span>
            </span>
          </a>

          <a
            href={DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-2xl border border-brand-grey-200 bg-white p-4 shadow-sm transition-colors hover:border-sky-300"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50">
              <HardDriveDownload className="h-5 w-5 text-sky-500" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[14px] font-bold text-navy-900">
                مجلد الأصول على Google Drive
                <ExternalLink className="h-3.5 w-3.5 text-brand-grey-400" aria-hidden />
              </span>
              <span className="mt-1 block text-[12px] leading-relaxed text-brand-grey-500">
                نسخة سحابية من الحزمة لمن لا يفتح المستودع.
              </span>
            </span>
          </a>
        </div>

        {/* ── حزم التنزيل ─────────────────────────────────────────────── */}
        <h3 className="mt-10 text-[15px] font-bold text-navy-900">حزم الأصول</h3>
        <p className="mt-1 text-[12px] text-brand-grey-500">
          تنزيل مباشر — بلا تسجيل دخول ولا صلاحيات.
        </p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {ASSET_PACKS.map(pack => (
            <motion.a
              key={pack.file}
              href={asset(`/brand/downloads/${pack.file}`)}
              download
              whileTap={{ scale: 0.98 }}
              className="flex flex-col rounded-2xl border border-brand-grey-200 bg-white p-4 shadow-sm transition-colors hover:border-sky-300"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-bold text-navy-900">{pack.title}</span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${AUDIENCE_STYLE[pack.audience]}`}
                >
                  {pack.audience}
                </span>
              </div>
              <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-brand-grey-500">{pack.desc}</p>
              <div className="mt-3 flex items-center justify-between border-t border-brand-grey-100 pt-2.5">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-sky-600">
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  تنزيل
                </span>
                <span dir="ltr" className="sl-num text-[11px] text-brand-grey-400">{pack.size}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── الأيقونات ───────────────────────────────────────────────── */}
        <h3 className="mt-10 text-[15px] font-bold text-navy-900">أيقونات النظام</h3>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-brand-grey-500">
          <span className="sl-num">{NATIVE_ICONS.length}</span> أيقونة أصلية. كلها{' '}
          <code dir="ltr" className="rounded bg-brand-grey-200/60 px-1 py-px font-mono text-[11px]">24×24</code>{' '}
          و<code dir="ltr" className="rounded bg-brand-grey-200/60 px-1 py-px font-mono text-[11px]">stroke-width: 2</code>{' '}
          وتستخدم{' '}
          <code dir="ltr" className="rounded bg-brand-grey-200/60 px-1 py-px font-mono text-[11px]">currentColor</code>،
          فتأخذ لونها من الصنف المحيط بلا تعديل على الملف.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
          {NATIVE_ICONS.map(icon => (
            <IconTile key={icon.file} {...icon} />
          ))}
        </div>

        {/* ── ملاحظة للمطوّر ──────────────────────────────────────────── */}
        <div className="mt-10 rounded-2xl border border-dashed border-brand-grey-300 bg-brand-grey-50 p-4">
          <p className="text-[13px] font-bold text-navy-900">لماذا لا يوجد «دليل نظام تصميم» هنا؟</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-brand-grey-600">
            كان في هذا المكان قسم يعيد بناء نظام التصميم يدويًا — لوحة ألوان مكتوبة بالـhex،
            ومقاييس خطوط، وأمثلة أزرار. المشكلة أنه كان <strong className="font-bold">نسخة ثانية من المصدر</strong>،
            وأي تعديل في حزمة الهوية لا يصل إليه، فيصير مع الوقت مرجعًا يناقض المرجع.
            استُبدل بالبراند بوك نفسه وبحزم الأصول أعلاه.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-brand-grey-600">
            أما <strong className="font-bold">متى</strong> يُستخدم كل لون — وهو قيد مستقل عن اللوحة —
            فمكانه{' '}
            <code dir="ltr" className="rounded bg-brand-grey-200/60 px-1 py-px font-mono text-[11px]">
              DESIGN-SYSTEM-COLOR.md
            </code>{' '}
            في المستودع، وتوكنز التطبيق كلها في{' '}
            <code dir="ltr" className="rounded bg-brand-grey-200/60 px-1 py-px font-mono text-[11px]">
              src/app/globals.css
            </code>.
          </p>
        </div>
      </div>
    </section>
  )
}
