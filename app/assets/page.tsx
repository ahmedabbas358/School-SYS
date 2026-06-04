'use client';

import React, { useState } from 'react';
import { 
  Building2, PenTool, Wrench, Shield, AlertTriangle, 
  Search, Plus, Download, ChevronRight, Activity,
  MapPin, CheckSquare, Settings, CheckCircle2, History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState('assets_list');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-fuchsia-100 p-3 rounded-lg text-fuchsia-600">
             <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">إدارة الأصول والمرافق</h1>
            <p className="text-slate-500 text-sm mt-1">تتبع الأصول، طلبات الصيانة، وجداول الإهلاك</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 xl:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث برقم الأصل (Barcode)..." 
              className="w-full pl-4 pr-9 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 font-medium text-slate-700"
            />
          </div>
          <button className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg text-sm font-bold hover:bg-fuchsia-700 shadow-sm shadow-fuchsia-600/20 flex items-center gap-2 transition-colors">
             <Plus className="w-4 h-4" /> إضافة أصل
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الأصول" value="8,102" icon={<Building2 className="w-5 h-5 text-fuchsia-500" />} color="bg-fuchsia-50 border-fuchsia-100" />
        <StatCard title="أصول تحت الصيانة" value="14" icon={<Wrench className="w-5 h-5 text-amber-500" />} color="bg-amber-50 border-amber-100" />
        <StatCard title="طلبات صيانة نشطة" value="5" subtitle="2 طلب عاجل" icon={<AlertTriangle className="w-5 h-5 text-rose-500" />} color="bg-rose-50 border-rose-100" />
        <StatCard title="عمليات فحص مجدولة" value="23" subtitle="هذا الأسبوع" icon={<CheckSquare className="w-5 h-5 text-blue-500" />} color="bg-blue-50 border-blue-100" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">الأصول والصيانة</h3>
            </div>
            <div className="p-2 space-y-1">
              <NavItem icon={<Activity/>} label="لوحة الأصول" id="dashboard" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<CheckCircle2/>} label="سجل الأصول" id="assets_list" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<MapPin/>} label="تتبع المواقع" id="locations" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<PenTool/>} label="سجل الصيانة" id="maintenance_log" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<AlertTriangle/>} label="طلبات الأعطال" id="maintenance_requests" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Wrench/>} label="الصيانة الوقائية" id="preventive_maintenance" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<History/>} label="الإهلاك وقيم الأصول" id="depreciation" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Shield/>} label="الأمن والسلامة" id="security" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Settings/>} label="إعدادات المرافق" id="settings" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'assets_list' && <AssetsListModule key="assets_list" />}
            {activeTab === 'maintenance_requests' && <MaintenanceModule key="maintenance_requests" />}
            
            {!['assets_list', 'maintenance_requests'].includes(activeTab) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-100">
                    <Building2 className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">وحدة قيد الإنشاء</h3>
                 <p className="text-slate-500 max-w-md text-sm">واجهة ({activeTab}) سيتم تصميمها ضمن الهيكل المتكامل.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// UI Components
// ----------------------------------------------------

function StatCard({ title, value, subtitle, icon, color, dark }: any) {
  return (
    <div className={cn("rounded-xl p-4 shadow-sm relative overflow-hidden transition-all hover:shadow-md border bg-white flex flex-col justify-center min-h-[110px]", 
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
          ? "bg-fuchsia-50 text-fuchsia-700 shadow-sm border border-fuchsia-100" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-fuchsia-600" : "text-slate-400 group-hover:text-slate-600") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-fuchsia-400" />}
    </button>
  );
}

function AssetsListModule() {
  const assets = [
    { code: 'AST-K921', name: 'جهاز عرض ذكي (Smart Board)', category: 'تقني', location: 'الفصل 4-أ', value: '4,500', status: 'نشط' },
    { code: 'AST-K922', name: 'طابعة ليزر (HP)', category: 'تقني', location: 'مكتب الإدارة', value: '1,200', status: 'صيانة' },
    { code: 'AST-M018', name: 'آلة تصوير مستندات (Canon)', category: 'معدات', location: 'غرفة المدرسين', value: '3,800', status: 'نشط' },
    { code: 'AST-F092', name: 'طاولة اجتماعات', category: 'أثاث', location: 'قاعة الاجتماعات', value: '2,000', status: 'نشط' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">سجل الأصول</h2>
          <p className="text-sm text-slate-500 mt-0.5">سجل شامل لمعلومات ومواقع وأرصدة الأصول</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
             <Download className="w-4 h-4 text-slate-500" /> كشف الإهلاك
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">كود/اسم الأصل</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">التصنيف</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الموقع</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">القيمة الحالية</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {assets.map((asset, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                       <span className="text-sm font-bold text-slate-900 block">{asset.name}</span>
                       <span className="text-[11px] font-bold text-fuchsia-600 bg-fuchsia-50 border border-fuchsia-100 px-1.5 py-0.5 rounded inline-block mt-1 font-mono">{asset.code}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-sm font-semibold">{asset.category}</td>
                    <td className="px-5 py-4 text-slate-600 text-sm font-semibold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {asset.location}</td>
                    <td className="px-5 py-4 text-center">
                       <span className="text-sm font-bold font-mono text-slate-900">{asset.value}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                       {asset.status === 'نشط' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">نشط</span>}
                       {asset.status === 'صيانة' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-100 text-amber-800 border border-amber-200">صيانة</span>}
                    </td>
                    <td className="px-5 py-4 text-left">
                       <button className="text-[11px] font-bold text-slate-600 hover:text-fuchsia-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100">تعديل ونقل</button>
                    </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </motion.div>
  );
}

function MaintenanceModule() {
  const reqs = [
     { id: 'MN-2026-081', issue: 'عطل في التكييف المركزي', location: 'الصالة الرياضية', status: 'جديد', priority: 'عالي', from: 'مدير الصالة' },
     { id: 'MN-2026-080', issue: 'توقف الطابعة عن العمل', location: 'مكتب الإدارة', status: 'قيد العمل', priority: 'متوسط', from: 'السكرتارية' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">طلبات الصيانة والأعطال</h2>
          <p className="text-sm text-slate-500 mt-0.5">تتبع بلاغات الأعطال الواردة من الأقسام</p>
        </div>
      </div>

       <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">رقم التذكرة / المشكلة</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الموقع</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المرسل</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الأولوية</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {reqs.map((req, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-5 py-4">
                          <span className="text-sm font-bold text-slate-900 block truncate max-w-[200px]">{req.issue}</span>
                          <span className="text-[11px] font-bold text-slate-500 font-mono mt-0.5">{req.id}</span>
                       </td>
                       <td className="px-5 py-4 text-slate-700 text-sm font-semibold">{req.location}</td>
                       <td className="px-5 py-4 text-slate-500 text-sm">{req.from}</td>
                       <td className="px-5 py-4 text-center">
                          {req.priority === 'عالي' && <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded">عالي</span>}
                          {req.priority === 'متوسط' && <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded">متوسط</span>}
                       </td>
                       <td className="px-5 py-4 text-center">
                          {req.status === 'جديد' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">جديد</span>}
                          {req.status === 'قيد العمل' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">جاري العمل</span>}
                       </td>
                       <td className="px-5 py-4 text-left">
                          <button className="text-[11px] font-bold text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100 border border-fuchsia-100 px-3 py-1.5 rounded-lg transition-colors">إسناد لفني</button>
                       </td>
                    </tr>
                ))}
             </tbody>
           </table>
        </div>
       </div>
    </motion.div>
  );
}
