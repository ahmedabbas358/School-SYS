"use client";

import React, { useState } from "react";
import {
  Settings,
  Globe,
  Users,
  BookOpen,
  Wallet,
  Bell,
  Zap,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  Database,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-3 rounded-lg text-slate-600">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
              إعدادات النظام العامة
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              المعايير، الخيارات الافتراضية، وقواعد النظام التشغيلية
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-sm shadow-slate-900/20 flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> حفظ كافة التغييرات
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                لوحات التحكم
              </h3>
            </div>
            <div className="p-2 space-y-1">
              <NavItem
                icon={<Globe />}
                label="إعدادات المؤسسة"
                id="general"
                active={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon={<BookOpen />}
                label="التقويم والعام الدراسي"
                id="calendar"
                active={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon={<Users />}
                label="اللغة والمنطقة"
                id="locale"
                active={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon={<Database />}
                label="سياسة الترقيم التلقائي"
                id="numbering"
                active={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon={<Bell />}
                label="الإشعارات العامة"
                id="notifications"
                active={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon={<Shield />}
                label="الخصوصية والبيانات"
                id="privacy"
                active={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon={<Lock />}
                label="المصادقة والجلسات"
                id="auth"
                active={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon={<Save />}
                label="الأداء والنسخ الاحتياطي"
                id="backup"
                active={activeTab}
                onClick={setActiveTab}
              />
              <NavItem
                icon={<Zap />}
                label="التكامل الخارجي (API)"
                id="integrations"
                active={activeTab}
                onClick={setActiveTab}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === "general" && <GeneralSettings key="general" />}
              {activeTab === "calendar" && <CalendarSettings key="calendar" />}
              {activeTab === "locale" && <LocaleSettings key="locale" />}
              {activeTab === "numbering" && <NumberingSettings key="numbering" />}
              {activeTab === "notifications" && <NotificationsSettings key="notifications" />}
              {activeTab === "privacy" && <PrivacySettings key="privacy" />}
              {activeTab === "auth" && <AuthSettings key="auth" />}
              {activeTab === "backup" && <BackupSettings key="backup" />}
              {activeTab === "integrations" && <IntegrationsSettings key="integrations" />}

              {![
                "general",
                "calendar",
                "locale",
                "numbering",
                "notifications",
                "privacy",
                "auth",
                "backup",
                "integrations",
              ].includes(activeTab) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="placeholder"
                  className="p-16 text-center text-slate-500 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-100">
                    <Sliders className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    وحدة تحكم - قيد التطوير
                  </h3>
                  <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                    تحتوي هذه الواجهة على مغيرات وقواعد متقدمة للتحكم في هذا
                    الجانب من النظام.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// UI Components
// ----------------------------------------------------

function NavItem({ icon, label, id, active, onClick }: any) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all text-right group",
        isActive
          ? "bg-slate-900 text-white shadow-sm border border-slate-800"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
      )}
    >
      {React.cloneElement(icon, {
        className: cn(
          "w-4 h-4 shrink-0 transition-colors",
          isActive
            ? "text-slate-300"
            : "text-slate-400 group-hover:text-slate-600",
        ),
      })}
      <span>{label}</span>
    </button>
  );
}

// ----------------------------------------------------
// Setting Modules
// ----------------------------------------------------

function SettingField({ label, desc, children }: any) {
  return (
    <div className="border-b border-slate-100 py-6 last:border-0 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
      <div className="lg:w-1/3">
        <h4 className="font-bold text-slate-900 text-sm">{label}</h4>
        {desc && (
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {desc}
          </p>
        )}
      </div>
      <div className="lg:w-2/3 max-w-lg">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={cn(
        "w-12 h-6 rounded-full transition-colors relative flex items-center px-1 border",
        checked
          ? "bg-emerald-500 border-emerald-600"
          : "bg-slate-200 border-slate-300",
      )}
    >
      <span
        className={cn(
          "w-4 h-4 bg-white rounded-full transition-all shadow-sm block",
          checked ? "mr-[22px]" : "mr-0",
        )}
      />
    </button>
  );
}

function GeneralSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">إعدادات المؤسسة</h3>
      </div>
      <div className="space-y-2">
        <SettingField label="اسم المؤسسة (عربي)" desc="الاسم الرسمي المستخدم في التقارير والمطبوعات.">
          <input type="text" defaultValue="مدارس المستقبل الأهلية" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </SettingField>
        <SettingField label="اسم المؤسسة (إنجليزي)">
          <input type="text" defaultValue="Future Schools Intl." className="w-full px-4 py-2 text-left bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" dir="ltr" />
        </SettingField>
        <SettingField label="الرقم الضريبي / السجل التجاري" desc="يظهر في الفواتير والمعاملات المالية.">
          <input type="text" defaultValue="310456128900003" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </SettingField>
        <SettingField label="العنوان الكامل" desc="موقع المدرسة لإدراجه في المطبوعات الرسمية.">
          <textarea rows={2} defaultValue="الرياض، حي العليا، شارع الأمير محمد بن عبداالعزيز" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"></textarea>
        </SettingField>
        <SettingField label="أرقام التواصل والبريد الرسمي" desc="تُستخدم كنقطة اتصال رئيسية.">
          <div className="space-y-3">
             <input type="text" defaultValue="info@futureschools.edu.sa" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-left font-bold focus:outline-none" dir="ltr" />
             <input type="text" defaultValue="+966 50 123 4567" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-left font-bold focus:outline-none" dir="ltr" />
          </div>
        </SettingField>
        <SettingField label="شعار المؤسسة (Logo)" desc="المقاس الموصى به: 256x256 px.">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
              <Globe className="w-8 h-8 text-slate-300" />
            </div>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">تغيير الشعار</button>
          </div>
        </SettingField>
        <SettingField label="الختم الرسمي" desc="يتم إرفاقه آلياً للاعتمادات والمطبوعات (بخلفية شفافة).">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center overflow-hidden">
              <span className="text-[10px] text-slate-400 font-bold p-2 text-center">رفع الختم</span>
            </div>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">تحميل ملف</button>
          </div>
        </SettingField>
      </div>
    </motion.div>
  );
}

function CalendarSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-800">إعدادات العام الدراسي والتقويم</h3>
      </div>
      <div className="space-y-2">
        <SettingField label="العام الدراسي الحالي" desc="من تاريخ إلى تاريخ.">
          <div className="flex items-center gap-2">
             <input type="date" defaultValue="2025-08-20" className="w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg font-bold" />
             <span className="text-slate-400">-</span>
             <input type="date" defaultValue="2026-06-15" className="w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg font-bold" />
          </div>
        </SettingField>
        <SettingField label="الفصول الدراسية" desc="تحديد الفصول الدراسية ومواعيدها">
          <div className="space-y-3">
             <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
               <span className="text-sm font-bold text-slate-700 flex-1">الفصل الدراسي الأول</span>
               <button className="text-xs font-bold text-indigo-600 bg-white border border-slate-200 px-3 py-1 rounded">تعديل التواريخ</button>
             </div>
             <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
               <span className="text-sm font-bold text-slate-700 flex-1">الفصل الدراسي الثاني</span>
               <button className="text-xs font-bold text-indigo-600 bg-white border border-slate-200 px-3 py-1 rounded">تعديل التواريخ</button>
             </div>
             <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg border-dashed text-slate-500 justify-center hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 cursor-pointer transition-colors">
               <span className="text-sm font-bold">+ إضافة فصل جديد</span>
             </div>
          </div>
        </SettingField>
        <SettingField label="بداية الأسبوع ونهايته" desc="يؤثر على توليد الجداول المدرسية">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-xs font-bold text-slate-500 mb-1 block">يوم بدء الأسبوع</label>
               <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"><option>الأحد</option><option>الإثنين</option></select>
             </div>
             <div>
               <label className="text-xs font-bold text-slate-500 mb-1 block">أيام الإجازة الأسبوعية</label>
               <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"><option>الجمعة والسبت</option></select>
             </div>
           </div>
        </SettingField>
      </div>
    </motion.div>
  );
}

function LocaleSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-800">إعدادات اللغة والمنطقة</h3>
      </div>
      <div className="space-y-2">
        <SettingField label="اللغة الافتراضية للنظام" desc="اللغة الأساسية لواجهات المستخدم.">
          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
            <option>العربية (Arabic) - أساسي</option>
            <option>English</option>
          </select>
        </SettingField>
        <SettingField label="تفعيل دعم الاتجاه (RTL)" desc="دعم اتجاه الواجهة من اليمين لليسار بناءً على لغة المستخدم.">
          <Toggle defaultChecked={true} />
        </SettingField>
        <SettingField label="المنطقة الزمنية (Timezone)" desc="لضبط أوقات الحضور والغياب وتسجيل التدقيق.">
          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr">
            <option>Asia/Riyadh (UTC+3)</option>
            <option>Africa/Cairo (UTC+2)</option>
            <option>Asia/Dubai (UTC+4)</option>
          </select>
        </SettingField>
        <SettingField label="العملة الرسمية" desc="تحديد رمز العملة لعرض الفواتير والمعاملات.">
           <div className="flex items-center gap-2">
             <select className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
                <option>ريال سعودي (SAR)</option>
                <option>دولار أمريكي (USD)</option>
             </select>
             <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
                <option>الرمز يساراً</option>
                <option>الرمز يميناً</option>
             </select>
           </div>
        </SettingField>
        <SettingField label="تنسيق التاريخ" desc="تحديد هيئة التاريخ المعروض في النظام">
          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr">
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </SettingField>
      </div>
    </motion.div>
  );
}

function NumberingSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-800">سياسة الترقيم التلقائي</h3>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">يمكّنك هذا القسم من تحديد قواعد وأنماط الترقيم التسلسلي الآلي للكيانات في النظام.</p>
        <SettingField label="رقم الطالب التسلسلي" desc="مثال حي: STU-2025-0012">
          <div className="flex items-center gap-1">
             <input type="text" defaultValue="STU-{YYYY}-{####}" className="w-full font-mono text-left px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
          </div>
        </SettingField>
        <SettingField label="رقم الموظف (الكادر الإداري والتربوي)" desc="مثال حي: EMP-0034">
          <div className="flex items-center gap-1">
             <input type="text" defaultValue="EMP-{####}" className="w-full font-mono text-left px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
          </div>
        </SettingField>
        <SettingField label="ترقيم الفواتير المالية" desc="مثال حي: INV-251015-081">
          <div className="flex items-center gap-1">
             <input type="text" defaultValue="INV-{YYMMDD}-{###}" className="w-full font-mono text-left px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
          </div>
        </SettingField>
        <SettingField label="إعادة تعيين الترقيم التسلسلي السنوي" desc="هل يتم البدء من الرقم 1 مع كل بداية عام دراسي (أو سنة مالية جديدة)؟">
           <Toggle defaultChecked={true} />
        </SettingField>
      </div>
    </motion.div>
  );
}

function NotificationsSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">قواعد الإشعارات والاتصالات</h3>
      </div>
      <div className="space-y-2">
        <SettingField label="إعدادات البريد الإلكتروني (SMTP)" desc="تُستخدم لإرسال التقارير، الفواتير، وإنذارات النظام.">
           <div className="space-y-3">
             <input type="text" placeholder="مثال: smtp.gmail.com" className="w-full text-left font-mono px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
             <div className="flex gap-2">
               <input type="text" placeholder="المنفذ (Port)" className="flex-1 text-left font-mono px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
               <select className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr"><option>TLS</option><option>SSL</option></select>
             </div>
             <input type="text" placeholder="عنوان البريد المُرسل" className="w-full text-left font-mono px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
           </div>
        </SettingField>
        <SettingField label="تكامل بوابات رسائل (SMS)" desc="استبدل بوابتك المفضلة، واضعاً اسم المرسل المصدق.">
           <div className="space-y-3">
             <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"><option>مزود محلي (وطنية، الخ)</option><option>Twilio Global</option></select>
             <input type="text" placeholder="مفتاح API" className="w-full text-left font-mono px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
             <input type="text" placeholder="Sender ID" className="w-full text-left font-mono px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
           </div>
        </SettingField>
        <SettingField label="الإشعارات الداخلية والتطبيقات (Push)" desc="خصائص الإشعارات المنبثقة للأجهزة المتنقلة للموظفين والطلاب.">
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">تنبيهات صوتية للإشعارات الداخلية (In-App)</span>
                <Toggle defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-700">تفعيل إشعارات Push Server عبر OneSignal</span>
                </div>
                <Toggle defaultChecked={false} />
              </div>
           </div>
        </SettingField>
      </div>
    </motion.div>
  );
}

function PrivacySettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-800">إدارة الخصوصية والبيانات</h3>
      </div>
      <div className="space-y-2">
        <SettingField label="سياسة الاحتفاظ بسجلات التدقيق (Audit Logs)" desc="المسار الزمني لمسح سجلات تتبع ومراقبة تصرفات المستخدمين.">
          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
            <option>سنة واحدة (يوصى به)</option>
            <option>سنتان</option>
            <option>7 سنوات (أغراض ضريبية/سيادية)</option>
            <option>حفظ للأبد</option>
          </select>
        </SettingField>
        <SettingField label="أرشفة بيانات الطلاب الخريجين" desc="متى يتم نقل بيانات الخريج إلى الأرشيف الميت؟">
          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
            <option>تلقائياً بعد مرور 5 سنوات على التخرج</option>
            <option>تلقائياً بعد سنة</option>
            <option>نقل للأرشيف يدوياً فقط</option>
          </select>
        </SettingField>
        <SettingField label="سياسة الحذف و GDPR" desc="تفعيل زر يتيح للمستخدم النهائي طلب حذفه من النظام كاملاً ومعالجة الطلب في 30 يوم.">
           <Toggle defaultChecked={false} />
        </SettingField>
        <SettingField label="تصدير البيانات الشخصية لحساب" desc="إتاحة تصدير كافة بيانات الفرد ومساراته وحضوره كملف JSON لمركز البيانات.">
          <button className="px-5 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
            إنشاء نموذج طلب تصدير
          </button>
        </SettingField>
      </div>
    </motion.div>
  );
}

function BackupSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">نسخ احتياطي واستعادة</h3>
        <button className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 rounded-lg text-xs hover:bg-indigo-100">تنفيذ نسخ فوري الآن</button>
      </div>
      <div className="space-y-4">
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-sm font-bold flex items-start gap-3">
           <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
           <p>آخر نسخة احتياطية تم أخذها بنجاح منذ 12 ساعة (الساعة 2:00 ص، بحجم 4.5 GB).</p>
        </div>
        <SettingField label="توقيت وجدولة النسخ" desc="حدد وتيرة وتوقيت النسخ التلقائي للبيانات ومرفقات النظام.">
          <div className="flex gap-2">
            <select className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"><option>يومياً</option><option>أسبوعياً (كل جمعة)</option></select>
            <select className="w-32 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr"><option>02:00 AM</option><option>04:00 AM</option></select>
          </div>
        </SettingField>
        <SettingField label="وجهة تخزين السحابة (Cloud Storage)" desc="المكان الآمن لرفع نسخ الاستعادة.">
          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
            <option>Amazon S3 Bucket</option>
            <option>Google Cloud Storage</option>
            <option>تخزين محلي (تنزيل آلي)</option>
          </select>
        </SettingField>
        <SettingField label="حفظ النسخ واسترجاع الطوارئ (PITR)" desc="كم نسخة تريد إبقاءها לפני الاستبدال؟">
           <div className="space-y-2">
             <div className="flex justify-between text-sm py-2"><span className="font-bold text-slate-700">احتفاظ يومي (آخر 30 يوم)</span> <Toggle defaultChecked={true} /></div>
             <div className="flex justify-between text-sm py-2"><span className="font-bold text-slate-700">احتفاظ شهري (آخر 12 شهر)</span> <Toggle defaultChecked={true} /></div>
           </div>
        </SettingField>
        <SettingField label="التخزين المؤقت وحاويات الذاكرة (Caching)" desc="يتيح استخدام Redis لتسريع عمل النظام، وتقليل الضغط.">
           <div className="flex items-center gap-3">
             <Toggle defaultChecked={true} />
             <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold border border-slate-200">Session TTL: 6 Hours</span>
           </div>
        </SettingField>
      </div>
    </motion.div>
  );
}

function IntegrationsSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-800">التكاملات ومفاتيح الواجهات (Integrations)</h3>
      </div>
      <div className="space-y-2">
        <SettingField label="الربط مع بوابات الدفع الإلكتروني (Payment Gateway)" desc="استقبل الرسوم الدراسية والمبالغ إلكترونياً.">
          <div className="space-y-3">
             <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"><option>منصة Stripe (عالمي)</option><option>منصة الدفع المباشر (PayTabs)</option><option>معطل حالياً</option></select>
             <input type="text" placeholder="Live API Secret Key" className="w-full text-left font-mono px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
          </div>
        </SettingField>
        <SettingField label="الربط الحكومي (Government APIs)" desc="مزامنة بيانات الطلاب والدرجات آلياً مع منصة التعليم الحكومية.">
           <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl space-y-4">
              <div className="flex justify-between gap-2">
                 <div>
                    <h4 className="text-sm font-bold text-slate-800">بوابة نظام &quot;نور&quot; التربوي المركزي</h4>
                    <p className="text-xs text-slate-500 mt-1">يتطلب اعتماد موثق ورقياً لربط Token المزامنة</p>
                 </div>
                 <Toggle defaultChecked={true} />
              </div>
              <input type="text" placeholder="Bearer Authorization Token..." className="w-full text-left font-mono px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" dir="ltr" />
           </div>
        </SettingField>
        <SettingField label="أنظمة الذكاء الاصطناعي (AI Analysis)" desc="مفاتيح تشغيل النماذج التنبؤية المتأصلة لتحليل الانحراف الأكاديمي.">
          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
             <option>Google Gemini Enterprise</option>
             <option>أداة التحليل الداخلي المحدودة</option>
          </select>
        </SettingField>
      </div>
    </motion.div>
  );
}

function AuthSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-800">المصادقة وإدارة الجلسات</h3>
      </div>
      <div className="space-y-4">
        <SettingField label="سياسات كلمة المرور" desc="الحد الأدنى لتعقيد كلمات مرور المستخدمين لحماية الحسابات.">
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2 rounded-lg">
               <span className="text-sm font-bold text-slate-700">تتطلب حروف كبيرة وصغيرة وأرقام</span>
               <Toggle defaultChecked={true} />
            </div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2 rounded-lg">
               <span className="text-sm font-bold text-slate-700">الحد الأدنى للطول</span>
               <select className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-bold"><option>8 أحرف</option><option>12 حرف</option></select>
            </div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2 rounded-lg">
               <span className="text-sm font-bold text-slate-700">صلاحية كلمة المرور (إجبار التغيير)</span>
               <select className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-bold"><option>90 يوماً</option><option>180 يوماً</option><option>أبدية</option></select>
            </div>
          </div>
        </SettingField>
        
        <SettingField label="المصادقة متعددة العوامل (MFA)" desc="تفعيل تسجيل الدخول بخطوتين باستخدام تطبيق Google Authenticator أو SMS">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">تفعيل خيار MFA للمستخدمين</span>
              <Toggle defaultChecked={true} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">إلزام المديرين والمشرفين بالـ MFA</span>
              <Toggle defaultChecked={true} />
            </div>
          </div>
        </SettingField>

        <SettingField label="تسجيل الدخول الموحد (SSO)" desc="السماح للمستخدمين بتسجيل الدخول باستخدام حساباتهم المؤسسية (Azure AD / Google Workspace).">
           <Toggle defaultChecked={false} />
        </SettingField>

        <SettingField label="الجلسات النشطة (Active Sessions)" desc="عرض جميع الجلسات المتصلة حالياً وإنهائها قسرياً عند الحاجة.">
           <button className="px-5 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors flex items-center gap-2">
             <Lock className="w-4 h-4" /> إنهاء كافة الجلسات النشطة لجميع المستخدمين
           </button>
        </SettingField>
      </div>
    </motion.div>
  );
}
