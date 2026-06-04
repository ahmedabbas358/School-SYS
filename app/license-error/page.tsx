import React from 'react';
import { ShieldAlert, Key } from 'lucide-react';

export default function LicenseErrorPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-rose-100">
        <div className="bg-rose-50 p-6 text-center border-b border-rose-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">نظام غير مرخص</h1>
          <p className="text-rose-600 font-medium text-sm mt-1">عذراً، لا يمكن تشغيل النظام لعدم وجود رخصة صالحة.</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-500" /> سبب المشكلة:
            </h3>
            <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
              <li>مفتاح الترخيص (License Key) مفقود في ملف البيئة.</li>
              <li>مفتاح الترخيص المدخل غير صالح أو منتهي الصلاحية.</li>
              <li>تم محاولة نقل النظام إلى نطاق (Domain) غير مصرح به.</li>
            </ul>
          </div>
          
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              لحل هذه المشكلة، يرجى التواصل مع مزود النظام أو إضافة المتغير <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">SCHOOL_ERP_LICENSE_KEY</code> إلى بيئة التشغيل.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
