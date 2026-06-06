'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, FileText, Calendar, Clock, CreditCard, 
  TrendingUp, Award, FolderOpen, Bell, BarChart3, Search, 
  Plus, MoreVertical, Shield, CheckCircle2, AlertCircle, 
  Download, UserPlus, FileSignature, Activity, ChevronRight, 
  CalendarDays, Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function HRPage() {
  const [activeTab, setActiveTab] = useState('registry');
  const [hrData, setHrData] = useState<any>({ employees: [], stats: {}, leaves: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch('/api/hr');
        const json = await res.json();
        if (json.success && json.data) setHrData(json.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-50 p-3.5 rounded-xl text-blue-600 border border-blue-200/50 shadow-sm shadow-blue-100">
             <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">إدارة الموارد البشرية</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">السنة المالية: <span className="font-bold text-slate-700">2026</span> • الشهر الحالي: <span className="font-bold text-slate-700">أكتوبر</span></p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters */}
          <select className="bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 hidden md:block shadow-sm">
             <option>القسم (الكل)</option>
             <option>أكاديمي</option>
             <option>إداري</option>
             <option>خدمات مساندة</option>
          </select>
          <select className="bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 hidden md:block shadow-sm">
             <option>نوع العقد (الكل)</option>
             <option>دوام كامل</option>
             <option>جزئي</option>
             <option>مؤقت</option>
          </select>
          <select className="bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 hidden md:block shadow-sm">
             <option>الحالة (نشط)</option>
             <option>إجازة</option>
             <option>منتهي العقد</option>
          </select>
          
          <div className="relative min-w-[240px] flex-1 xl:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث عن موظف، رقم وظيفي..." 
              className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200/80 bg-slate-50 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700 shadow-sm transition-all focus:bg-white"
            />
          </div>
          
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 flex items-center gap-2 mr-auto xl:mr-2 border border-transparent">
             <Plus className="w-4 h-4" /> إضافة موظف
          </button>
        </div>
      </div>

      {/* Stats Cards - 8 Cards required */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">
        <StatCard title="إجمالي الكادر النشط" value={hrData.stats?.totalActive || 0} icon={<Users className="w-4.5 h-4.5 text-blue-500" />} color="bg-blue-50 border-blue-100" />
        <StatCard title="معلمون" value={hrData.stats?.teachers || 0} icon={<Briefcase className="w-4.5 h-4.5 text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
        <StatCard title="إداريون" value={hrData.stats?.admins || 0} icon={<Shield className="w-4.5 h-4.5 text-indigo-500" />} color="bg-indigo-50 border-indigo-100" />
        <StatCard title="إجازات معلقة" value={hrData.stats?.pendingLeaves || 0} icon={<CalendarDays className="w-4.5 h-4.5 text-amber-500" />} color="bg-amber-50 border-amber-100" />
        <StatCard title="متوسط الأداء" value="89%" icon={<TrendingUp className="w-4.5 h-4.5 text-purple-500" />} color="bg-purple-50 border-purple-100" />
        <StatCard title="كتلة الرواتب" value={hrData.stats?.monthlyPayroll ? (hrData.stats.monthlyPayroll / 1000).toFixed(1) + 'k' : "0"} subtitle="الشهرية" icon={<CreditCard className="w-4.5 h-4.5 text-slate-300" />} color="bg-slate-900 border-slate-800 text-white" dark />
        <StatCard title="عقود تنتهي" value={hrData.stats?.expiringSoon || 0} subtitle="قريباً" icon={<FileSignature className="w-4.5 h-4.5 text-rose-500" />} color="bg-rose-50 border-rose-100" />
        <StatCard title="موظفون للتقييم" value={Math.floor((hrData.stats?.totalActive || 0) * 0.1)} icon={<Activity className="w-4.5 h-4.5 text-orange-500" />} color="bg-orange-50 border-orange-100" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">القائمة الجانبية للـ HR</h3>
            </div>
            <div className="p-3 space-y-1">
              <NavItem icon={<Users/>} label="سجل الموظفين" id="registry" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Network/>} label="الهيكل التنظيمي" id="org" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<FileSignature/>} label="العقود والتعيينات" id="contracts" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<Clock/>} label="الحضور والانصراف" id="attendance" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<CalendarDays/>} label="الإجازات" id="leaves" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<CreditCard/>} label="الرواتب والاستحقاقات" id="payroll" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<Award/>} label="التقييم والأداء" id="performance" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<TrendingUp/>} label="التدريب والتطوير" id="training" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<FolderOpen/>} label="الوثائق والملفات" id="documents" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Bell/>} label="التنبيهات الإدارية" id="alerts" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<BarChart3/>} label="التقارير" id="reports" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {loading ? (
             <div className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-bold text-slate-800">جاري تحميل بيانات الموارد البشرية...</h3>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'registry' && <RegistryModule key="registry" employeesData={hrData.employees} />}
              {activeTab === 'leaves' && <LeavesModule key="leaves" leavesData={hrData.leaves} />}
              {activeTab === 'attendance' && <AttendanceModule key="attendance" employeesData={hrData.employees} />}
              {activeTab === 'performance' && <PerformanceModule key="performance" />}
              {activeTab === 'training' && <TrainingModule key="training" />}
              {activeTab === 'org' && <OrgModule key="org" />}
              {activeTab === 'contracts' && <ContractsModule key="contracts" />}
              {activeTab === 'payroll' && <PayrollModule key="payroll" employeesData={hrData.employees} />}
              {activeTab === 'documents' && <DocumentsModule key="documents" />}
              {activeTab === 'alerts' && <AlertsModule key="alerts" />}
              {activeTab === 'reports' && <ReportsModule key="reports" />}
              
              {!['registry', 'leaves', 'attendance', 'performance', 'training', 'org', 'contracts', 'payroll', 'documents', 'alerts', 'reports'].includes(activeTab) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col items-center justify-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 border border-slate-200/60 shadow-inner">
                      <Briefcase className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">مسار غير معرف في الموارد البشرية</h3>
                   <p className="text-slate-500 max-w-md mx-auto text-[13px] font-medium leading-relaxed">المفتاح ({activeTab}) غير مرتبط بتبويب نشط، استخدم وحدات الموارد البشرية من القائمة الجانبية.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
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
    <div className={cn("rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all group border bg-white flex flex-col justify-center min-h-[120px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]", 
      dark ? color : "border-slate-200/80 hover:border-slate-300")}>
      <div className={cn("absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity", !dark && color.split(" ")[0])} />
      <div className="flex justify-between items-start mb-2.5 relative z-10">
         <p className={cn("text-[11px] font-bold uppercase tracking-wider line-clamp-1", dark ? "text-slate-300" : "text-slate-500")}>{title}</p>
         <div className={cn("p-1.5 rounded-lg shrink-0 ml-1 border", dark ? "bg-slate-900/30 border-transparent" : color.split(" ")[0] + " border-transparent")}>
            {React.cloneElement(icon, { className: "w-4 h-4" })}
         </div>
      </div>
      <div className="relative z-10 mt-auto">
        <h3 className={cn("text-2xl font-bold font-mono tracking-tight leading-none", dark ? "text-white" : "text-slate-900")}>{value}</h3>
        {subtitle && <p className={cn("text-[10px] font-semibold mt-2", dark ? "text-slate-400" : "text-slate-400")}>{subtitle}</p>}
      </div>
    </div>
  );
}

function NavItem({ icon, label, id, active, onClick }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all text-right group",
        isActive 
          ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-blue-400" />}
    </button>
  );
}

// ----------------------------------------------------
// Sub-Modules
// ----------------------------------------------------

function RegistryModule({ employeesData }: { employeesData: any[] }) {

  const defaultEmployees = [
    { id: 'EMP-1001', name: 'أحمد محمود العبدالله', role: 'معلم رياضيات', dept: 'القسم الأكاديمي', status: 'نشط', image: 'أ' },
    { id: 'EMP-1002', name: 'سناء خليل', role: 'نائب أكاديمي', dept: 'الإدارة الأكاديمية', status: 'نشط', image: 'س' },
    { id: 'EMP-1003', name: 'خالد الفهد', role: 'محاسب', dept: 'المالية', status: 'نشط', image: 'خ' },
    { id: 'EMP-1004', name: 'فاطمة سعد', role: 'معلمة روضة', dept: 'الروضة', status: 'إجازة أمومة', image: 'ف' },
    { id: 'EMP-1005', name: 'طارق زياد', role: 'سائق حافلة', dept: 'الخدمات والنقل', status: 'منهى خدماته', image: 'ط' },
  ];

  const employees = employeesData.length > 0 ? employeesData.map(e => ({
    id: e.employeeNumber || e.id,
    name: e.user?.name || 'بدون اسم',
    role: e.position || 'غير محدد',
    dept: e.department?.name || 'غير محدد',
    status: e.status === 'ACTIVE' ? 'نشط' : e.status === 'ON_LEAVE' ? 'إجازة أمومة' : 'منهى خدماته',
    image: e.user?.name ? e.user.name.charAt(0) : 'ع'
  })) : defaultEmployees;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">سجل الموظفين (Employee Registry)</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">إدارة بيانات الكادر الأكاديمي، الإداري، والخدمات</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 border border-slate-200/80 text-slate-700 bg-white rounded-lg text-[13px] font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
             <Download className="w-4 h-4 text-slate-500" /> تصدير السجل
           </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 flex flex-wrap gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         {['حسب المرحلة', 'حسب نوع الوظيفة', 'حسب الجنس', 'حسب نوع العقد', 'سنوات الخبرة', 'الجنسية'].map((filter, i) => (
             <button key={i} className="text-[12px] font-bold text-slate-600 bg-white border border-slate-200/80 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-sm">
                 {filter}
             </button>
         ))}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0 border-collapse">
             <thead className="bg-slate-50/50 border-b border-slate-200/80">
                <tr>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الموظف والرقم الوظيفي</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الوظيفة</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">القسم</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {employees.map((emp, i) => (
                 <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                         <div className={cn(
                             "w-11 h-11 rounded-full flex items-center justify-center shrink-0 border text-[15px] font-bold shadow-sm",
                             emp.status === 'منهى خدماته' ? "bg-slate-100 text-slate-500 border-slate-200/80" : "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 border-blue-100/80"
                         )}>
                           {emp.image}
                         </div>
                         <div>
                            <span className="text-[14px] font-bold text-slate-900 block">{emp.name}</span>
                            <span className="text-[12px] font-semibold text-slate-500 font-mono mt-0.5 block">{emp.id}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[14px] font-bold text-slate-700">{emp.role}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-block bg-slate-100/80 border border-slate-200/60 text-slate-600 px-3 py-1.5 rounded-md text-[12px] font-bold">{emp.dept}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       {emp.status === 'نشط' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 tracking-wider shadow-sm">نشط</span>}
                       {emp.status === 'إجازة أمومة' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] uppercase font-bold bg-amber-50 text-amber-800 border border-amber-200/60 tracking-wider shadow-sm">إجازة طويلة</span>}
                       {emp.status === 'منهى خدماته' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] uppercase font-bold bg-rose-50 text-rose-800 border border-rose-200/60 tracking-wider shadow-sm">مخالصة</span>}
                    </td>
                    <td className="px-6 py-4 text-left">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-[12px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 shadow-sm transition-colors">عرض الملف</button>
                          <button className="text-[12px] font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-lg border border-slate-200/80 shadow-sm transition-colors hidden xl:block">تعديل</button>
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><MoreVertical className="w-4 h-4" /></button>
                       </div>
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

function LeavesModule({ leavesData }: { leavesData: any[] }) {
  const leaves = leavesData.length > 0 ? leavesData : [
    { employee: { user: { name: "محمد عبدالله راشد" } }, employeeId: "EMP-1021", type: "إجازة سنوية", days: 5, status: "PENDING", startDate: "2026-05-12", endDate: "2026-05-16", remaining: 14 },
    { employee: { user: { name: "سارة الفهد" } }, employeeId: "EMP-1022", type: "إجازة مرضية", days: 2, status: "APPROVED", startDate: "2026-06-01", endDate: "2026-06-02", remaining: 13 },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 justify-between items-center">
         <div>
           <h2 className="text-[17px] font-bold text-slate-900 mb-1 flex items-center gap-2 font-display">
             <CalendarDays className="w-5 h-5 text-blue-600" /> إدارة الإجازات
           </h2>
           <p className="text-[13px] text-slate-500 font-medium">طلبات الإجازة، أرصدة الموظفين، والموافقات.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-colors border border-transparent">
               <Plus className="w-4 h-4" /> تقديم طلب إجازة
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
         {leaves.map((leave, i) => (
           <div key={i} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all relative overflow-hidden group">
              <div className={cn("absolute top-0 right-0 w-1.5 h-full opacity-80 group-hover:opacity-100 transition-opacity", leave.status === 'PENDING' ? "bg-amber-400" : (leave.status === 'APPROVED' ? "bg-emerald-400" : "bg-rose-400"))}></div>
              <div className="flex justify-between items-start mb-5">
                 <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200/80 shadow-sm text-[15px]">
                      {leave.employee?.user?.name ? leave.employee.user.name.charAt(0) : 'م'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[14px]">{leave.employee?.user?.name || "بدون اسم"}</h4>
                      <p className="text-[12px] text-slate-500 mt-0.5 font-mono font-semibold">{leave.employee?.employeeNumber || leave.employeeId}</p>
                    </div>
                 </div>
                 <span className={cn("px-3 py-1 rounded-md text-[11px] font-bold border shadow-sm", 
                   leave.status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200/60" : 
                   (leave.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" : "bg-rose-50 text-rose-700 border-rose-200/60")
                 )}>
                   {leave.status === 'PENDING' ? "معلق" : (leave.status === 'APPROVED' ? "مقبول" : "مرفوض")}
                 </span>
              </div>
              <div className="space-y-3 mb-5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                 <div className="flex justify-between text-[12px]"><span className="text-slate-500 font-semibold">نوع الإجازة</span><span className="text-slate-800 font-bold">{leave.type === 'ANNUAL' ? 'إجازة سنوية' : leave.type === 'SICK' ? 'إجازة مرضية' : leave.type || 'إجازة طارئة'}</span></div>
                 <div className="flex justify-between text-[12px]"><span className="text-slate-500 font-semibold">المدة</span><span className="text-slate-800 font-bold">{leave.days} أيام ({new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()})</span></div>
                 <div className="flex justify-between text-[12px]"><span className="text-slate-500 font-semibold">الرصيد المتبقي</span><span className="text-emerald-600 font-bold">{leave.remaining || '--'} يوم</span></div>
              </div>
              {leave.status === 'PENDING' && (
                <div className="flex gap-3 border-t border-slate-100 pt-4">
                   <button className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold text-[13px] rounded-lg hover:bg-emerald-100 transition-colors shadow-sm">موافقة</button>
                   <button className="flex-1 py-2 bg-rose-50 text-rose-700 border border-rose-200/60 font-bold text-[13px] rounded-lg hover:bg-rose-100 transition-colors shadow-sm">رفض</button>
                </div>
              )}
           </div>
         ))}
      </div>
    </motion.div>
  );
}

function AttendanceModule({ employeesData }: { employeesData: any[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">الحضور والانصراف</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">سجل الحضور اليومي وتتبع التأخيرات والغياب للموظفين</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2 border border-transparent">
          <Download className="w-4 h-4" /> تصدير السجل
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
           <h4 className="text-slate-500 text-[12px] font-bold mb-1">الحاضرون اليوم</h4>
           <div className="text-2xl font-bold text-slate-900">{employeesData.length > 0 ? Math.floor(employeesData.length * 0.9) : 128} <span className="text-sm font-medium text-slate-400">/ {employeesData.length || 142}</span></div>
        </div>
        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
           <h4 className="text-amber-600 text-[12px] font-bold mb-1">المتأخرون</h4>
           <div className="text-2xl font-bold text-slate-900">{employeesData.length > 0 ? Math.floor(employeesData.length * 0.05) : 11}</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
           <h4 className="text-rose-600 text-[12px] font-bold mb-1">الغياب</h4>
           <div className="text-2xl font-bold text-slate-900">{employeesData.length > 0 ? Math.floor(employeesData.length * 0.05) : 3}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الموظف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">وقت الحضور</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">وقت الانصراف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحالة</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {employeesData.length > 0 ? employeesData.slice(0, 5).map((emp, i) => {
               const rand = ((i * 7) % 10) / 10;
               const isAbsent = rand > 0.9;
               const isLate = rand > 0.7 && rand <= 0.9;
               return (
                 <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{emp.user?.name || emp.employeeNumber}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 font-mono">{isAbsent ? '--:--' : (isLate ? '08:15 ص' : '07:15 ص')}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 font-mono">--:--</td>
                    <td className="px-6 py-4 text-center">
                       {isAbsent ? (
                         <span className="px-2.5 py-1 rounded text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-100">غائب</span>
                       ) : isLate ? (
                         <span className="px-2.5 py-1 rounded text-[11px] font-bold border bg-amber-50 text-amber-700 border-amber-100">متأخر</span>
                       ) : (
                         <span className="px-2.5 py-1 rounded text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">حاضر</span>
                       )}
                    </td>
                 </tr>
               )
             }) : (
               <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">أحمد محمود العبدالله</td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-mono">07:15 ص</td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-mono">--:--</td>
                  <td className="px-6 py-4 text-center">
                     <span className="px-2.5 py-1 rounded text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">حاضر</span>
                  </td>
               </tr>
             )}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function PerformanceModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">التقييم والأداء</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">إدارة التقييمات الدورية ومؤشرات قياس الأداء (KPIs)</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> إنشاء دورة تقييم
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
           <h3 className="text-[15px] font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">تقييم شهر أكتوبر (قيد التنفيذ)</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <div>
                    <h4 className="font-bold text-[14px] text-slate-800">أحمد محمود العبدالله</h4>
                    <p className="text-[12px] text-slate-500 font-medium">القسم الأكاديمي</p>
                 </div>
                 <button className="text-[12px] font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors">بدء التقييم</button>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <div>
                    <h4 className="font-bold text-[14px] text-slate-800">سناء خليل</h4>
                    <p className="text-[12px] text-slate-500 font-medium">الإدارة الأكاديمية</p>
                 </div>
                 <button className="text-[12px] font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors">بدء التقييم</button>
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
           <h3 className="text-[15px] font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">أفضل الموظفين (الربع الثالث)</h3>
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[18px]">1</div>
                 <div>
                    <h4 className="font-bold text-[14px] text-slate-800">خالد الفهد</h4>
                    <p className="text-[12px] text-slate-500 font-medium">تقييم: 98% (ممتاز)</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-[18px]">2</div>
                 <div>
                    <h4 className="font-bold text-[14px] text-slate-800">محمد عبدالله راشد</h4>
                    <p className="text-[12px] text-slate-500 font-medium">تقييم: 95% (ممتاز)</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrainingModule() {
  const trainings = [
    { title: "مهارات الإدارة الصفية الحديثة", target: "المعلمين الجدد", date: "2026-11-05", status: "مجدولة" },
    { title: "استخدام أدوات الذكاء الاصطناعي في التعليم", target: "كافة المعلمين", date: "2026-10-15", status: "منجزة" },
    { title: "نظام التقييم المتطور", target: "الإدارة الأكاديمية", date: "2026-10-20", status: "مجدولة" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">التدريب والتطوير</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">إدارة الدورات التدريبية وتتبع سجل التطور المهني</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> إضافة دورة
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">اسم الدورة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الفئة المستهدفة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">التاريخ</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحالة</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {trainings.map((t, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{t.title}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{t.target}</td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-500 font-mono">{t.date}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold border", t.status === "مجدولة" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100")}>{t.status}</span>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function OrgModule() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const orgTree = {
    id: "root",
    name: "د. عبد الرحمن السديري",
    role: "المدير العام",
    dept: "الإدارة العامة",
    avatar: "ع",
    color: "from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/20",
    children: [
      {
        id: "acad",
        name: "أ. سناء خليل",
        role: "النائب الأكاديمي",
        dept: "الإدارة الأكاديمية",
        avatar: "س",
        color: "from-fuchsia-500 to-pink-500 text-white hover:shadow-fuchsia-500/20",
        children: [
          {
            id: "math",
            name: "أ. أحمد محمود",
            role: "رئيس قسم الرياضيات",
            dept: "قسم الرياضيات",
            avatar: "أ",
            color: "from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/20",
          },
          {
            id: "kg",
            name: "أ. فاطمة سعد",
            role: "رئيسة قسم الروضة",
            dept: "قسم الروضة",
            avatar: "ف",
            color: "from-amber-500 to-orange-500 text-white hover:shadow-amber-500/20",
          }
        ]
      },
      {
        id: "fin",
        name: "أ. سليمان الرويشد",
        role: "المدير المالي",
        dept: "الإدارة المالية",
        avatar: "س",
        color: "from-sky-500 to-blue-500 text-white hover:shadow-sky-500/20",
        children: [
          {
            id: "acc",
            name: "أ. خالد الفهد",
            role: "رئيس الحسابات",
            dept: "قسم المحاسبة",
            avatar: "خ",
            color: "from-cyan-500 to-teal-500 text-white hover:shadow-cyan-500/20",
          }
        ]
      },
      {
        id: "ops",
        name: "أ. طارق زياد",
        role: "مدير الخدمات المساندة",
        dept: "العمليات والنقل",
        avatar: "ط",
        color: "from-slate-700 to-slate-800 text-white hover:shadow-slate-700/20",
      }
    ]
  };

  const renderNode = (node: any) => {
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div 
          onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
          className={cn(
            "p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:scale-[1.03] select-none w-56 text-center bg-gradient-to-br",
            node.color,
            selectedNode === node.id ? "ring-4 ring-blue-500/30 border-blue-500" : "border-slate-200"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-lg font-bold text-white shadow-inner">
            {node.avatar}
          </div>
          <h4 className="font-bold text-sm text-white">{node.name}</h4>
          <p className="text-[11px] font-semibold text-white/90 mt-0.5">{node.role}</p>
          <p className="text-[10px] font-medium text-white/70 mt-1 bg-black/10 rounded px-1.5 py-0.5 inline-block">{node.dept}</p>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center mt-6 w-full">
            {/* Connection Line */}
            <div className="w-0.5 h-6 bg-slate-200"></div>
            
            {/* Children grid */}
            <div className="relative flex justify-center gap-8 w-full mt-2">
              {/* Horizontal connecting bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-slate-200" style={{ width: `calc(100% - ${100 / node.children.length}%)` }}></div>
              
              {node.children.map((child: any) => (
                <div key={child.id} className="relative pt-4">
                  {/* Small vertical line for child */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-200"></div>
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">الهيكل التنظيمي التفاعلي</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">عرض الهيكل الإداري والتبعيات الوظيفية للمؤسسة</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> إضافة منصب
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-10 shadow-sm overflow-x-auto min-h-[500px] flex justify-center items-start">
        <div className="min-w-[800px] pt-4 flex justify-center">
          {renderNode(orgTree)}
        </div>
      </div>

      {selectedNode && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-[14px]">تفاصيل الهيكل لـ: {
              selectedNode === 'root' ? 'الإدارة العامة' :
              selectedNode === 'acad' ? 'الإدارة الأكاديمية' :
              selectedNode === 'math' ? 'قسم الرياضيات' :
              selectedNode === 'kg' ? 'قسم الروضة' :
              selectedNode === 'fin' ? 'الإدارة المالية' :
              selectedNode === 'acc' ? 'قسم المحاسبة' : 'العمليات والنقل'
            }</h3>
            <button onClick={() => setSelectedNode(null)} className="text-[12px] font-bold text-slate-400 hover:text-slate-600">إغلاق</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-slate-500 text-xs font-semibold block">المشرف المسؤول</span>
              <span className="text-slate-800 font-bold text-sm mt-1 block">
                {selectedNode === 'root' ? 'د. عبد الرحمن السديري' :
                 selectedNode === 'acad' ? 'أ. سناء خليل' :
                 selectedNode === 'math' ? 'أ. أحمد محمود' :
                 selectedNode === 'kg' ? 'أ. فاطمة سعد' :
                 selectedNode === 'fin' ? 'أ. سليمان الرويشد' :
                 selectedNode === 'acc' ? 'أ. خالد الفهد' : 'أ. طارق زياد'}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-slate-500 text-xs font-semibold block">عدد الموظفين المقيدين</span>
              <span className="text-slate-800 font-bold text-sm mt-1 block">
                {selectedNode === 'root' ? '142 موظف' :
                 selectedNode === 'acad' ? '87 موظف' :
                 selectedNode === 'math' ? '14 معلم' :
                 selectedNode === 'kg' ? '18 معلمة' :
                 selectedNode === 'fin' ? '8 موظفين' :
                 selectedNode === 'acc' ? '3 محاسبين' : '22 سائق ومرافق'}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-slate-500 text-xs font-semibold block">الميزانية الشهرية المقدرة</span>
              <span className="text-emerald-600 font-bold text-sm mt-1 block font-mono">
                {selectedNode === 'root' ? '1,200,000 ر.س' :
                 selectedNode === 'acad' ? '650,000 ر.س' :
                 selectedNode === 'math' ? '112,000 ر.س' :
                 selectedNode === 'kg' ? '98,000 ر.س' :
                 selectedNode === 'fin' ? '85,000 ر.س' :
                 selectedNode === 'acc' ? '28,000 ر.س' : '120,000 ر.س'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ContractsModule() {
  const contracts = [
    { id: "CONT-201", employee: "أحمد محمود", type: "دوام كامل", startDate: "2023-09-01", endDate: "2027-08-31", salary: "8,500" },
    { id: "CONT-202", employee: "سناء خليل", type: "دوام كامل", startDate: "2020-09-01", endDate: "2025-08-31", salary: "12,000" },
    { id: "CONT-203", employee: "طارق زياد", type: "دوام جزئي", startDate: "2025-01-01", endDate: "2025-12-31", salary: "4,000" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">العقود والتعيينات</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">سجل عقود العمل وتاريخ الاستحقاق والتجديد</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> إنشاء عقد جديد
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">رقم العقد</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الموظف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">نوع العقد</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">تاريخ البداية والنهاية</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الراتب الأساسي</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-left">إجراءات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {contracts.map((c, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[13px] text-slate-500">{c.id}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{c.employee}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold border", c.type === "دوام كامل" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-100 text-slate-600 border-slate-200")}>{c.type}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-[12px] font-semibold text-slate-600">
                     {c.startDate} <span className="text-slate-400 mx-1">إلى</span> {c.endDate}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-[14px] text-emerald-600">{c.salary}</td>
                  <td className="px-6 py-4 text-left">
                     <button className="text-[12px] font-bold text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-slate-200 hover:border-blue-200 shadow-sm transition-colors">عرض</button>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function PayrollModule({ employeesData }: { employeesData: any[] }) {
  const payrolls = [
    { employee: "أحمد محمود", basic: 8500, allowances: 1500, deductions: 200, net: 9800 },
    { employee: "سناء خليل", basic: 12000, allowances: 2000, deductions: 0, net: 14000 },
    { employee: "خالد الفهد", basic: 7000, allowances: 1000, deductions: 500, net: 7500 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">الرواتب والاستحقاقات</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">مسير رواتب شهر أكتوبر (غير معتمد)</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center gap-2 border border-transparent">
            <CheckCircle2 className="w-4 h-4" /> اعتماد المسير
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الموظف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الراتب الأساسي</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">البدلات</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الاستقطاعات</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الصافي</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {payrolls.map((p, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{p.employee}</td>
                  <td className="px-6 py-4 text-center font-semibold text-[13px] text-slate-700">{p.basic}</td>
                  <td className="px-6 py-4 text-center font-semibold text-[13px] text-blue-600">+{p.allowances}</td>
                  <td className="px-6 py-4 text-center font-semibold text-[13px] text-rose-600">-{p.deductions}</td>
                  <td className="px-6 py-4 text-center font-bold text-[15px] text-emerald-600">{p.net}</td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function DocumentsModule() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const folders = [
    { id: 'contracts', name: 'عقود العمل', count: 142, color: 'hover:border-blue-200 hover:bg-blue-50/50 text-blue-500', iconColor: 'text-blue-500' },
    { id: 'ids', name: 'الهويات والإقامات', count: 130, color: 'hover:border-amber-200 hover:bg-amber-50/50 text-amber-500', iconColor: 'text-amber-500' },
    { id: 'health', name: 'الشهادات الصحية', count: 87, color: 'hover:border-emerald-200 hover:bg-emerald-50/50 text-emerald-500', iconColor: 'text-emerald-500' },
    { id: 'degrees', name: 'المؤهلات العلمية', count: 140, color: 'hover:border-fuchsia-200 hover:bg-fuchsia-50/50 text-fuchsia-500', iconColor: 'text-fuchsia-500' },
  ];

  const filesByFolder: Record<string, any[]> = {
    contracts: [
      { name: 'عقد توظيف - أحمد محمود.pdf', emp: 'أحمد محمود العبدالله', date: '2025-05-12', size: '1.2 MB', uploader: 'سناء خليل' },
      { name: 'عقد توظيف - سناء خليل.pdf', emp: 'سناء خليل', date: '2025-04-10', size: '1.5 MB', uploader: 'سليمان الرويشد' },
      { name: 'عقد توظيف - خالد الفهد.pdf', emp: 'خالد الفهد', date: '2025-06-20', size: '1.1 MB', uploader: 'سليمان الرويشد' },
    ],
    ids: [
      { name: 'بطاقة الهوية الوطنية - أحمد محمود.pdf', emp: 'أحمد محمود العبدالله', date: '2025-05-12', size: '450 KB', uploader: 'سناء خليل' },
      { name: 'بطاقة الهوية الوطنية - خالد الفهد.pdf', emp: 'خالد الفهد', date: '2025-06-20', size: '500 KB', uploader: 'سليمان الرويشد' },
    ],
    health: [
      { name: 'شهادة لياقة طبية - فاطمة سعد.pdf', emp: 'فاطمة سعد', date: '2025-08-11', size: '880 KB', uploader: 'أحمد محمود' },
    ],
    degrees: [
      { name: 'وثيقة تخرج بكالوريوس - أحمد محمود.pdf', emp: 'أحمد محمود العبدالله', date: '2025-05-12', size: '2.1 MB', uploader: 'سناء خليل' },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">
            {selectedFolder ? `الوثائق والملفات / ${folders.find(f => f.id === selectedFolder)?.name}` : 'الوثائق والملفات'}
          </h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            {selectedFolder ? `قائمة الملفات المرفقة بقسم ${folders.find(f => f.id === selectedFolder)?.name}` : 'مستودع المستندات الرسمية، الهويات، والجوازات'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedFolder && (
            <button 
              onClick={() => setSelectedFolder(null)}
              className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-[13px] font-bold shadow-sm transition-colors"
            >
              رجوع للمجلدات
            </button>
          )}
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2 border border-transparent">
            <Plus className="w-4 h-4" /> رفع وثيقة
          </button>
        </div>
      </div>

      {!selectedFolder ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <div 
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={cn(
                "border border-slate-200/80 rounded-xl p-5 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center",
                folder.color
              )}
            >
              <FolderOpen className={cn("w-12 h-12 mb-3 group-hover:scale-110 transition-transform", folder.iconColor)} />
              <h4 className="font-bold text-slate-800 text-sm">{folder.name}</h4>
              <p className="text-[11px] text-slate-500 mt-1">{folder.count} ملف</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">اسم المستند</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الموظف المعني</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">تاريخ الرفع</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحجم</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">بواسطة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filesByFolder[selectedFolder]?.map((file, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                      <span className="font-bold text-sm text-slate-800">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{file.emp}</td>
                  <td className="px-6 py-4 text-center font-mono text-[13px] font-medium text-slate-600">{file.date}</td>
                  <td className="px-6 py-4 text-center font-mono text-[13px] text-slate-500">{file.size}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-slate-600">{file.uploader}</td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[12px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm transition-colors flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> تحميل
                      </button>
                      <button className="text-[12px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 shadow-sm transition-colors">
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filesByFolder[selectedFolder]?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm font-semibold">
                    لا توجد ملفات في هذا المجلد بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

function AlertsModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="text-[17px] font-bold text-slate-900 font-display mb-1">التنبيهات الإدارية الذكية</h2>
        <p className="text-[13px] text-slate-500 font-medium">متابعة تلقائية لانتهاء الوثائق والعقود والتأخيرات</p>
      </div>
      <div className="space-y-3">
         <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-4 flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
            <div>
               <h4 className="font-bold text-rose-800 text-[14px]">عقود تنتهي قريباً (أقل من 30 يوم)</h4>
               <p className="text-[13px] text-rose-600 mt-1 font-medium">هناك 5 موظفين تنتهي عقودهم بنهاية الشهر الحالي، يرجى اتخاذ الإجراء المناسب.</p>
               <button className="mt-3 text-[12px] font-bold bg-white text-rose-700 px-3 py-1.5 rounded border border-rose-200 shadow-sm hover:bg-rose-100">عرض الموظفين</button>
            </div>
         </div>
         <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
               <h4 className="font-bold text-amber-800 text-[14px]">غياب متكرر غير مبرر</h4>
               <p className="text-[13px] text-amber-600 mt-1 font-medium">تجاوز الموظف (طارق زياد) الحد الأقصى للغياب الشهري (3 أيام متتالية).</p>
               <button className="mt-3 text-[12px] font-bold bg-white text-amber-700 px-3 py-1.5 rounded border border-amber-200 shadow-sm hover:bg-amber-100">إصدار إنذار</button>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function ReportsModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="text-[17px] font-bold text-slate-900 font-display mb-1">التقارير التحليلية</h2>
        <p className="text-[13px] text-slate-500 font-medium">تقارير جاهزة وقابلة للتصدير للقرارات الإدارية</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
         {['تقرير كفاءة المعلمين', 'تقرير الغياب والتأخير الشهري', 'تحليل الرواتب والمصروفات', 'تقرير الإجازات المستهلكة', 'معدل دوران العمالة (Turnover)', 'تقرير انتهاء الوثائق'].map((rep, i) => (
           <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <BarChart3 className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-bold text-slate-800 text-[14px] group-hover:text-blue-700 transition-colors">{rep}</h4>
              <p className="text-[12px] text-slate-500 mt-1">اضغط لاستعراض وتصدير التقرير PDF/Excel</p>
           </div>
         ))}
      </div>
    </motion.div>
  );
}
