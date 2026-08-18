'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, GraduationCap, Building2, ArrowLeft, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { ALL_GRADES, type GradeType } from '@/lib/studylink-data'
import { useStudylinkStore } from '@/lib/use-studylink-store'

interface RegisterScreenProps {
  onNavigate?: (screen: string) => void
}

const colleges = [
  'كلية الطب',
  'كلية طب الأسنان',
  'كلية الصيدلة',
  'كلية الهندسة',
  'كلية الحقوق',
  'كلية التجارة',
  'كلية الآداب',
  'كلية العلوم',
]

export default function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<GradeType | null>(null)
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null)
  const [showCollegeSheet, setShowCollegeSheet] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const register = useStudylinkStore(s => s.register)
  const setStoreGrade = useStudylinkStore(s => s.setSelectedGrade)

  const canProceedStep1 = name.trim().length >= 3 && phone.trim().length >= 11
  const canSubmit = canProceedStep1 && selectedGrade

  const handleRegister = () => {
    if (!canSubmit) return
    register({
      name: name.trim(),
      phone: phone.trim(),
      grade: selectedGrade,
      college: selectedCollege,
    })
    if (selectedGrade) setStoreGrade(selectedGrade)
    toast.success('تم إنشاء حسابك بنجاح! 🎉', {
      style: { direction: 'rtl', fontSize: '12px' },
      duration: 2500,
    })
    onNavigate?.('home')
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 overflow-y-auto phone-scroll bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-4 border-b border-brand-grey-100">
          <button data-tap="44" aria-label="التالي"
            onClick={() => step === 1 ? onNavigate?.('profile') : setStep(1)}
            className="w-9 h-9 rounded-full bg-brand-grey-50 flex items-center justify-center active:scale-95 transition-transform tap-44"
          >
            <ArrowLeft className="w-4 h-4 text-navy-800" />
          </button>
          <div>
            <h1 className="text-[16px] font-bold text-navy-900">حساب جديد</h1>
            <p className="text-[12px] text-brand-grey-400">
              {step === 1 ? 'البيانات الأساسية' : 'اختر فرقتك'}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex gap-2">
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-sky-500' : 'bg-brand-grey-200'}`} />
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-sky-500' : 'bg-brand-grey-200'}`} />
          </div>
        </div>

        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 pt-4 space-y-4"
          >
            {/* Name */}
            <div>
              <label className="text-[13px] font-semibold text-navy-800 mb-1.5 block">اسمك الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="أحمد محمد"
                  className="w-full bg-brand-grey-50 border border-brand-grey-200/60 rounded-xl pr-10 pl-4 py-3 text-[13px] text-navy-900 placeholder:text-brand-grey-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-[13px] font-semibold text-navy-800 mb-1.5 block">رقم الموبايل</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="01012345678"
                  maxLength={11}
                  className="w-full bg-brand-grey-50 border border-brand-grey-200/60 rounded-xl pr-10 pl-4 py-3 text-[13px] text-navy-900 placeholder:text-brand-grey-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all sl-num"
                  dir="ltr"
                />
              </div>
            </div>

            {/* College (optional) */}
            <div>
              <label className="text-[13px] font-semibold text-navy-800 mb-1.5 block">
                الكلية <span className="text-brand-grey-400 font-normal">(اختياري)</span>
              </label>
              <button data-tap="44"
                onClick={() => setShowCollegeSheet(true)}
                className="w-full flex items-center justify-between bg-brand-grey-50 border border-brand-grey-200/60 rounded-xl px-4 py-3 text-[13px] active:scale-[0.99] transition-transform"
              >
                <span className={selectedCollege ? 'text-navy-900 font-medium' : 'text-brand-grey-400'}>
                  {selectedCollege || 'اختار الكلية'}
                </span>
                <Building2 className="w-4 h-4 text-brand-grey-400" />
              </button>
            </div>

            {/* College Sheet */}
            {showCollegeSheet && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-end"
              >
                <div className="absolute inset-0 bg-black/30" onClick={() => setShowCollegeSheet(false)} />
                <motion.div
                  initial={{ y: 200 }}
                  animate={{ y: 0 }}
                  className="relative z-10 bg-white rounded-t-3xl w-full max-w-[390px] mx-auto p-4 pb-8 max-h-[60vh] overflow-y-auto"
                >
                  <div className="w-10 h-1 bg-brand-grey-200 rounded-full mx-auto mb-4" />
                  <h3 className="text-[15px] font-bold text-navy-900 mb-3">اختار الكلية</h3>
                  <div className="space-y-1">
                    {colleges.map(c => (
                      <button data-tap="44"
                        key={c}
                        onClick={() => { setSelectedCollege(c); setShowCollegeSheet(false) }}
                        className={`w-full text-right px-4 py-3 rounded-xl text-[13px] font-medium transition-all ${
                          selectedCollege === c
                            ? 'bg-sky-50 text-sky-600 border border-sky-200'
                            : 'text-navy-800 active:bg-brand-grey-50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Next button */}
            <button data-tap="44"
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className={`w-full py-3.5 rounded-2xl text-[14px] font-bold transition-all mt-4 ${
                canProceedStep1
                  ? 'bg-navy-800 text-white active:scale-[0.98] shadow-lg shadow-navy-800/20'
                  : 'bg-brand-grey-100 text-brand-grey-400 cursor-not-allowed'
              }`}
            >
              التالي
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 pt-4 space-y-4"
          >
            <p className="text-[13px] text-brand-grey-600 leading-relaxed">
              اختار فرقتك وهنعدللك تجربة التطبيق حسب موادك 📚
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {ALL_GRADES.map((grade) => (
                <button data-tap="44"
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`py-4 px-3 rounded-2xl border-2 text-center transition-all active:scale-[0.97] ${
                    selectedGrade === grade
                      ? 'border-sky-500 bg-sky-50 shadow-sm'
                      : 'border-brand-grey-200/60 bg-white hover:border-brand-grey-300'
                  }`}
                >
                  <GraduationCap className={`w-6 h-6 mx-auto mb-1.5 ${selectedGrade === grade ? 'text-sky-500' : 'text-brand-grey-400'}`} />
                  <span className={`text-[13px] font-bold block ${selectedGrade === grade ? 'text-sky-700' : 'text-navy-800'}`}>
                    {grade}
                  </span>
                </button>
              ))}
            </div>

            <button data-tap="44"
              onClick={handleRegister}
              disabled={!canSubmit}
              className={`w-full py-3.5 rounded-2xl text-[14px] font-bold transition-all mt-2 ${
                canSubmit
                  ? 'bg-sky-500 text-white active:scale-[0.98] shadow-lg shadow-sky-500/25'
                  : 'bg-brand-grey-100 text-brand-grey-400 cursor-not-allowed'
              }`}
            >
              سجّل حسابي
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}