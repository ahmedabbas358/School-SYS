'use client';

import React, { useState } from 'react';
import { 
  CalendarDays, Clock, Grid3X3, AlertTriangle, Users,
  BookOpen, Building2, ChevronRight, Plus, Search,
  Filter, Play, Settings, RefreshCw, CheckCircle2,
  Download, Printer, FileText, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function TimetablePage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-sky-100 p-3 rounded-lg text-sky-600">
             <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">إدارة الجداول والجدولة الذكية</h1>
            <p className="text-slate-500 text-sm mt-1">بناء الجداول الدراسية، توزيع الحصص، وإدارة التعارضات</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-slate-50 text-slate-700 outline-none">
             <option>العام الدراسي 2026/2027</option>
          </select>
          <div className="relative min-w-[200px] flex-1 xl:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث عن معلم، صف، قاعة..." 
              className="w-full pl-4 pr-9 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-700"
            />
          </div>
          <button className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-sky-700 transition-colors flex items-center gap-2">
             <Play className="w-4 h-4" /> جدولة تلقائية ذكية
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="الصفوف المكتملة" value="24" subtitle="من أصل 30 صف" icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
        <StatCard title="حصص غير مسندة" value="18" subtitle="بحاجة لمعلمين" icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50 border-amber-100" />
        <StatCard title="تعارضات حالية" value="3" subtitle="في جدول المعلمين" icon={<AlertTriangle className="w-5 h-5 text-rose-500" />} color="bg-rose-50 border-rose-100" />
        <StatCard title="استغلال القاعات" value="82%" subtitle="متوسط الاستخدام الأسبوعي" icon={<Building2 className="w-5 h-5 text-indigo-500" />} color="bg-indigo-50 border-indigo-100" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">الجداول الذكية</h3>
            </div>
            <div className="p-2 space-y-1">
              <NavItem icon={<Grid3X3/>} label="لوحة الجداول (Dashboard)" id="dashboard" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Clock/>} label="الهيكل الزمني والفترات" id="time_structure" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<CalendarDays/>} label="بناء الجداول (Timetable Builder)" id="builder" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Settings/>} label="إدارة القيود (Constraints)" id="constraints" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<AlertTriangle/>} label="كشف التعارضات" id="conflicts" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<RefreshCw/>} label="التعديلات اليومية والبدائل" id="daily" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Share2/>} label="النشر والتصدير" id="export" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardModule key="dashboard" />}
            {activeTab === 'builder' && <BuilderModule key="builder" />}
            {activeTab === 'conflicts' && <ConflictsModule key="conflicts" />}
            {activeTab === 'export' && <ExportModule key="export" />}
            {activeTab === 'time_structure' && <TimeStructureModule key="time_structure" />}
            {activeTab === 'constraints' && <ConstraintsModule key="constraints" />}
            {activeTab === 'daily' && <DailyModule key="daily" />}
            
            {!['dashboard', 'builder', 'conflicts', 'export', 'time_structure', 'constraints', 'daily'].includes(activeTab) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-100">
                    <CalendarDays className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">قيد التحديث</h3>
                 <p className="text-slate-500 max-w-md text-sm">سيتم توفير واجهة ({activeTab}) قريباً في التحديث القادم.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, dark }: any) {
  return (
    <div className={cn("rounded-xl p-4 shadow-sm relative overflow-hidden transition-all border bg-white flex flex-col justify-center min-h-[110px]", 
      dark ? color : "border-slate-200")}>
      <div className={cn("absolute inset-0 opacity-10", !dark && color.split(" ")[0])} />
      <div className="flex justify-between items-start mb-2 relative z-10">
         <p className={cn("text-xs font-bold tracking-wide", dark ? "text-slate-300" : "text-slate-600")}>{title}</p>
         <div className={cn("p-1.5 rounded-md shrink-0 ml-1", dark ? "bg-slate-900/30" : color.split(" ")[0])}>
            {React.cloneElement(icon, { className: "w-4 h-4" })}
         </div>
      </div>
      <div className="relative z-10 mt-auto flex items-end justify-between">
        <h3 className={cn("text-3xl font-bold font-mono tracking-tight leading-none", dark ? "text-white" : "text-slate-900")}>{value}</h3>
      </div>
      {subtitle && <p className={cn("text-[10px] font-semibold mt-2 relative z-10", dark ? "text-slate-400" : "text-slate-500")}>{subtitle}</p>}
    </div>
  );
}

function NavItem({ icon, label, id, active, onClick }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-right group",
        isActive 
          ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-sky-400" />}
    </button>
  );
}

// ------------------------------------------------------------------
// Modules
// ------------------------------------------------------------------

function DashboardModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
         <Grid3X3 className="w-12 h-12 text-sky-300 mx-auto mb-4" />
         <h3 className="text-xl font-bold text-slate-800 mb-2">استعراض الجداول المجمعة</h3>
         <p className="text-slate-500 text-sm">حدد نوع الجدول من الأعلى (صف، معلم، قاعة) لاستعراضه وطباعته.</p>
      </div>
    </motion.div>
  );
}

function BuilderModule() {
  const schedule = [
    { day: 'الأحد', periods: ['رياضيات', 'علوم', 'عربية', 'استراحة', 'إنجليزي', 'حاسب', 'تربية فنية'] },
    { day: 'الاثنين', periods: ['قرآن', 'رياضيات', 'إنجليزي', 'استراحة', 'علوم', 'عربية', 'رياضة'] },
    { day: 'الثلاثاء', periods: ['عربية', 'إنجليزي', 'تاريخ', 'استراحة', 'رياضيات', 'علوم', 'مختبر'] },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Timetable Builder (بناء الجداول)</h2>
          <p className="text-sm text-slate-500 mt-0.5">الصف السادس - شعبة أ</p>
        </div>
        <button className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors">
            حفظ التعديلات
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
         <table className="w-full text-center shrink-0 min-w-[800px]">
           <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                 <th className="px-3 py-4 text-xs font-bold text-slate-500 border-l border-slate-200">اليوم \ الحصة</th>
                 {[1,2,3,4,5,6,7].map(n => (
                   <th key={n} className="px-3 py-4 text-xs font-bold text-slate-500">{n === 4 ? `استراحة (${n})` : `الحصة ${n}`}</th>
                 ))}
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {schedule.map((row, i) => (
               <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-3 py-4 font-bold text-slate-800 text-sm border-l border-slate-200 bg-slate-50/50 w-24">
                    {row.day}
                  </td>
                  {row.periods.map((period, j) => (
                    <td key={j} className={cn("px-2 py-3", j === 3 ? "bg-slate-100 text-slate-400 font-mono text-xs" : "")}>
                       {j === 3 ? (
                         <span>-</span>
                       ) : (
                         <div className="bg-sky-50 border border-sky-100 text-sky-800 rounded p-2 text-xs font-bold hover:shadow-md cursor-pointer transition-shadow">
                           {period}
                           <div className="text-[10px] text-sky-600 mt-1 font-semibold">أ. محمد</div>
                         </div>
                       )}
                    </td>
                  ))}
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </motion.div>
  );
}

function ConflictsModule() {
  const conflicts = [
    { type: 'تعارض معلم', desc: 'المعلم (خالد السيد) مسند لديه حصتين في نفس الوقت (الحصة 2 - يوم الأحد).', level: 'حرج', resolution: 'مفتوح' },
    { type: 'حمل زائد', desc: 'المعلمة (سارة محمد) تجاوزت الحد الأقصى الأسبوعي (24 حصة بدلاً من 20).', level: 'تحذير', resolution: 'مفتوح' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">كشف التعارضات (Conflict Detection)</h2>
          <p className="text-sm text-slate-500 mt-0.5">النظام يكتشف تعارضات الجدول آلياً لمنع الأخطاء</p>
      </div>

      <div className="space-y-3">
        {conflicts.map((c, i) => (
          <div key={i} className={cn("p-4 rounded-xl border shadow-sm flex items-start gap-3", 
            c.level === 'حرج' ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"
          )}>
             <AlertTriangle className={cn("w-5 h-5 mt-0.5 shrink-0", c.level === 'حرج' ? "text-rose-500" : "text-amber-500")} />
             <div className="flex-1">
               <h4 className={cn("font-bold text-sm", c.level === 'حرج' ? "text-rose-800" : "text-amber-800")}>{c.type}</h4>
               <p className={cn("text-sm mt-1 leading-relaxed", c.level === 'حرج' ? "text-rose-700" : "text-amber-700")}>{c.desc}</p>
             </div>
             <button className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border shrink-0 bg-white",
               c.level === 'حرج' ? "text-rose-700 border-rose-200" : "text-amber-700 border-amber-200"
             )}>
               حل التعارض
             </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ExportModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">النشر والتصدير (Publish & Export)</h2>
          <p className="text-sm text-slate-500 mt-0.5">تصدير وطباعة الجداول الدراسية بتنسيقات متعددة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export Options */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4">خيارات التقرير</h3>
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">نوع الجدول</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                    <option>جدول صف دراسي</option>
                    <option>جدول معلم</option>
                    <option>جدول قاعة دراسية</option>
                    <option>الجدول العام المجمع</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">التحديد</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                    <option>الصف السادس - شعبة أ</option>
                    <option>الصف السادس - شعبة ب</option>
                    <option>الصف الخامس - شعبة أ</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">التنسيق</label>
                  <div className="grid grid-cols-2 gap-3">
                     <button className="flex items-center justify-center gap-2 py-2 border-2 border-slate-200 rounded-lg text-sm font-bold hover:border-sky-500 hover:text-sky-600 transition-colors bg-white">
                        <FileText className="w-4 h-4" /> PDF
                     </button>
                     <button className="flex items-center justify-center gap-2 py-2 border-2 border-slate-200 rounded-lg text-sm font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors bg-white hover:bg-emerald-50">
                        <Grid3X3 className="w-4 h-4" /> Excel
                     </button>
                  </div>
               </div>
             </div>
             
             <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <button className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                   <Download className="w-4 h-4" /> تصدير الآن
                </button>
                <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                   <Printer className="w-4 h-4" /> طباعة مباشرة
                </button>
             </div>
          </div>
        </div>

        {/* Preview */}
        <div className="col-span-1 md:col-span-2">
           <div className="h-full min-h-[400px] bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                 <FileText className="w-10 h-10 text-sky-400" />
              </div>
              <h3 className="relative z-10 font-bold text-slate-800 text-lg mb-2">معاينة التقرير</h3>
              <p className="relative z-10 text-slate-500 text-sm max-w-sm">قم باختيار نوع الجدول والتحديد من القائمة الجانبية لمعاينة شكل التقرير قبل الطباعة أو التصدير.</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function TimeStructureModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
         <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4 text-sky-500 border border-sky-100">
            <Clock className="w-8 h-8" />
         </div>
         <h3 className="text-xl font-bold text-slate-900 mb-2">الهيكل الزمني والفترات (Time Structure)</h3>
         <p className="text-slate-500 text-sm max-w-md text-center">إدارة فترات الحصص اليومية وأوقات الفسح.</p>
      </div>
    </motion.div>
  );
}

function ConstraintsModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
         <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4 text-sky-500 border border-sky-100">
            <Settings className="w-8 h-8" />
         </div>
         <h3 className="text-xl font-bold text-slate-900 mb-2">إدارة القيود (Constraints)</h3>
         <p className="text-slate-500 text-sm max-w-md text-center">تحديد حدود حصص المعلمين، الأيام التفرغية، وتوزيع الحصص المزدوجة.</p>
      </div>
    </motion.div>
  );
}

function DailyModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
         <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4 text-sky-500 border border-sky-100">
            <RefreshCw className="w-8 h-8" />
         </div>
         <h3 className="text-xl font-bold text-slate-900 mb-2">التعديلات اليومية وإدارة الغياب</h3>
         <p className="text-slate-500 text-sm max-w-md text-center">إسناد الحصص الاحتياطية للمعلمين وتغطية غيابات الكادر.</p>
      </div>
    </motion.div>
  );
}

