'use client';

import React, { useState } from 'react';
import { 
  PieChart, BarChart3, TrendingUp, Users, DollarSign,
  Calendar, Download, Filter, Search, ChevronRight,
  FileText, Activity, BookOpen, Clock, AlertTriangle, Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-violet-100 to-violet-50 p-3.5 rounded-xl text-violet-600 border border-violet-200/50 shadow-sm shadow-violet-100">
             <PieChart className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">التقارير والتحليلات الذكية</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">مؤشرات الأداء، الإحصائيات، والتقارير الشاملة للنظام</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm transition-all">
             <option>العام الدراسي 2026/2027</option>
          </select>
          <button className="px-5 py-2.5 bg-violet-600 text-white rounded-lg text-[13px] font-bold shadow-sm shadow-violet-600/20 hover:bg-violet-700 transition-colors flex items-center gap-2 border border-transparent">
             <Download className="w-4 h-4" /> تصدير تقرير شامل
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">أنظمة التقارير</h3>
            </div>
            <div className="p-3 space-y-1">
              <NavItem icon={<BarChart3/>} label="لوحة المؤشرات (KPIs)" id="dashboard" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<Users/>} label="تقارير الطلاب والقبول" id="students" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Activity/>} label="تقارير الحضور والانضباط" id="attendance" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<BookOpen/>} label="التقارير الأكاديمية" id="academic" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<DollarSign/>} label="التقارير المالية" id="finance" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardModule key="dashboard" />}
            {activeTab === 'students' && <StudentsReportsModule key="students" />}
            {activeTab === 'attendance' && <AttendanceReportsModule key="attendance" />}
            {activeTab === 'academic' && <AcademicReportsModule key="academic" />}
            {activeTab === 'finance' && <FinanceReportsModule key="finance" />}
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
    <div className={cn("rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all group border bg-white flex flex-col justify-center min-h-[130px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]", 
      dark ? color : "border-slate-200/80 hover:border-slate-300")}>
      <div className={cn("absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity", !dark && color.split(" ")[0])} />
      <div className="flex justify-between items-start mb-3 relative z-10">
         <p className={cn("text-[13px] font-bold tracking-wide", dark ? "text-slate-300" : "text-slate-500")}>{title}</p>
         <div className={cn("p-2 rounded-lg shrink-0 ml-1 border", dark ? "bg-slate-900/30 border-transparent" : color.split(" ")[0] + " border-transparent")}>
            {React.cloneElement(icon, { className: "w-4.5 h-4.5" })}
         </div>
      </div>
      <div className="relative z-10 mt-auto flex items-end justify-between">
        <h3 className={cn("text-3xl font-bold font-mono tracking-tight leading-none", dark ? "text-white" : "text-slate-900")}>{value}</h3>
      </div>
      {subtitle && <p className={cn("text-[11px] font-semibold mt-2.5 relative z-10", dark ? "text-slate-400" : "text-slate-400")}>{subtitle}</p>}
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
          ? "bg-violet-50 text-violet-700 shadow-sm border border-violet-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-violet-600" : "text-slate-400 group-hover:text-violet-500") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-violet-400" />}
    </button>
  );
}

function SectionHeader({ title, description, actions }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div>
        <h2 className="text-[17px] font-bold text-slate-900 font-display">{title}</h2>
        {description && <p className="text-[13px] text-slate-500 mt-1 font-medium">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ----------------------------------------------------
// Modules
// ----------------------------------------------------

function DashboardModule() {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <p className="font-bold text-slate-900 mb-2 font-display">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-[13px] font-bold flex items-center justify-between gap-4" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const enrollmentData = [
    { name: '2022', طلاب: 850 },
    { name: '2023', طلاب: 920 },
    { name: '2024', طلاب: 1050 },
    { name: '2025', طلاب: 1180 },
    { name: '2026', طلاب: 1250 },
  ];

  const attendanceData = [
    { name: 'الأحد', حضور: 95, غياب: 5 },
    { name: 'الإثنين', حضور: 96, غياب: 4 },
    { name: 'الثلاثاء', حضور: 94, غياب: 6 },
    { name: 'الأربعاء', حضور: 97, غياب: 3 },
    { name: 'الخميس', حضور: 92, غياب: 8 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionHeader title="المؤشرات الرئيسية (KPIs)" description="نظرة عامة على الأداء العام للمدرسة عبر السنوات والمراحل المستهدفة" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="إجمالي الطلاب" value="1,250" subtitle="نمو 6% عن العام السابق" icon={<Users className="w-4.5 h-4.5 text-indigo-500" />} color="bg-indigo-50 border-indigo-100" />
        <StatCard title="متوسط الحضور" value="94.8%" subtitle="استقرار هذا الشهر" icon={<Activity className="w-4.5 h-4.5 text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
        <StatCard title="اكتظاظ الفصول" value="28" subtitle="طالب لكل فصل (متوسط)" icon={<BookOpen className="w-4.5 h-4.5 text-amber-500" />} color="bg-amber-50 border-amber-100" />
        <StatCard title="نسبة التحصيل" value="82%" subtitle="جيد جداً" icon={<DollarSign className="w-4.5 h-4.5 text-rose-500" />} color="bg-rose-50 border-rose-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-[400px]">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><TrendingUp className="w-4.5 h-4.5 text-indigo-500"/> نمو أعداد الطلاب (٥ سنوات)</h3>
           <div className="flex-1 w-full" dir="ltr">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <RechartsTooltip content={customTooltip} />
                  <Area type="monotone" dataKey="طلاب" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-[400px]">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Activity className="w-4.5 h-4.5 text-emerald-500"/> معدلات الحضور الأسبوعية (%)</h3>
           <div className="flex-1 w-full" dir="ltr">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'inherit' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <RechartsTooltip content={customTooltip} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px', fontWeight: 'bold' }} />
                  <Bar dataKey="حضور" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={28} />
                  <Bar dataKey="غياب" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function StudentsReportsModule() {
  const genderData = [
    { name: 'ذكور', value: 650 },
    { name: 'إناث', value: 600 },
  ];
  
  const stageData = [
    { name: 'رياض الأطفال', طلاب: 200 },
    { name: 'الابتدائي', طلاب: 600 },
    { name: 'المتوسط', طلاب: 300 },
    { name: 'الثانوي', طلاب: 150 },
  ];
  
  const COLORS = ['#3b82f6', '#ec4899'];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionHeader 
        title="تقارير الطلاب" 
        description="توزيع الطلاب حسب المراحل، الجنس، وحالة القبول" 
        actions={
          <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4"/> تصفية
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
           <h3 className="font-bold text-slate-900 mb-6 font-display">التوزيع حسب المرحلة الدراسية</h3>
           <div className="h-[300px]" dir="ltr">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageData} layout="vertical" margin={{ left: 50, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'inherit', fontWeight: 'bold' }} dx={-10} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontFamily: 'inherit', fontWeight: 'bold' }} />
                  <Bar dataKey="طلاب" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
           <h3 className="font-bold text-slate-900 mb-6 self-start font-display">التوزيع حسب الجنس</h3>
           <div className="h-[300px] w-full" dir="ltr">
             <ResponsiveContainer width="100%" height="100%">
               <RechartsPieChart>
                 <Pie
                   data={genderData}
                   cx="50%"
                   cy="50%"
                   innerRadius={70}
                   outerRadius={100}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {genderData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <RechartsTooltip formatter={(value: any) => `${value} طالب`} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontFamily: 'inherit', fontWeight: 'bold' }} />
                 <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 'bold', paddingTop: '20px' }} />
               </RechartsPieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function AttendanceReportsModule() {
  const monthData = [
    { name: 'سبتمبر', نسبة_الغياب: 4.2 },
    { name: 'أكتوبر', نسبة_الغياب: 5.1 },
    { name: 'نوفمبر', نسبة_الغياب: 6.8 },
    { name: 'ديسمبر', نسبة_الغياب: 8.5 },
    { name: 'يناير', نسبة_الغياب: 4.5 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionHeader title="تقارير الحضور والانضباط" description="تحليل غياب وتأخر الطلاب والمعلمين" />
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <div className="flex justify-between items-center mb-8">
           <h3 className="font-bold text-slate-900 font-display">معدل الغياب الشهري (%)</h3>
           <select className="bg-slate-50 border border-slate-200/80 text-[13px] font-bold rounded-lg px-3 py-2 outline-none text-slate-700 shadow-sm focus:ring-2 focus:ring-violet-500/20">
             <option>غياب الطلاب</option>
             <option>غياب المعلمين</option>
           </select>
         </div>
         <div className="h-[350px]" dir="ltr">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontFamily: 'inherit', fontWeight: 'bold' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} dx={-10} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontFamily: 'inherit', fontWeight: 'bold' }} />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '20px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="نسبة_الغياب" stroke="#f59e0b" strokeWidth={4} dot={{ r: 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
           </ResponsiveContainer>
         </div>
      </div>
    </motion.div>
  );
}

function AcademicReportsModule() {
  const gradesData = [
    { name: 'ممتاز', count: 450 },
    { name: 'جيد جداً', count: 320 },
    { name: 'جيد', count: 210 },
    { name: 'مقبول', count: 90 },
    { name: 'ضعيف', count: 30 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionHeader title="التقارير الأكاديمية" description="توزيع الدرجات والمستويات الأكاديمية والمواد" />
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <h3 className="font-bold text-slate-900 mb-8 font-display">التوزيع العام لدرجات الطلاب (الفصل الأول)</h3>
         <div className="h-[400px]" dir="ltr">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontFamily: 'inherit', fontWeight: 'bold' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} dx={-10} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontFamily: 'inherit', fontWeight: 'bold' }} />
                <Bar dataKey="count" name="عدد الطلاب" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={48} />
              </BarChart>
           </ResponsiveContainer>
         </div>
      </div>
    </motion.div>
  );
}

function FinanceReportsModule() {
  const COLORS = ['#10b981', '#f43f5e', '#facc15', '#6366f1'];
  const pieData = [
    { name: 'إيرادات محصلة', value: 850000 },
    { name: 'إيرادات متأخرة', value: 150000 },
    { name: 'منح وخصومات', value: 80000 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionHeader 
        title="التقارير المالية" 
        description="إحصائيات الرسوم، الإيرادات، والمستحقات" 
        actions={
          <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors">
            <Printer className="w-4 h-4"/> طباعة التقرير
          </button>
        }
      />
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 h-[380px]" dir="ltr">
           <h3 className="font-bold text-slate-900 mb-2 text-right font-display text-[17px]">توزيع الحالة المالية (إجمالي الرسوم)</h3>
           <ResponsiveContainer width="100%" height="100%">
             <RechartsPieChart>
               <Pie
                 data={pieData}
                 cx="50%"
                 cy="50%"
                 innerRadius={80}
                 outerRadius={120}
                 paddingAngle={5}
                 dataKey="value"
                 stroke="none"
               >
                 {pieData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <RechartsTooltip formatter={(value: any) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontFamily: 'inherit', fontWeight: 'bold' }} />
               <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 'bold' }} />
             </RechartsPieChart>
           </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
           {pieData.map((item, i) => (
             <div key={i} className="flex items-center justify-between p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 shadow-sm transition-colors hover:bg-slate-50">
                <div className="flex items-center gap-3">
                   <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                   <span className="font-bold text-[15px] text-slate-700">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-lg tracking-wide">${item.value.toLocaleString()}</span>
             </div>
           ))}
           <div className="mt-8 pt-5 border-t border-slate-200/80 flex justify-between items-center px-4 bg-slate-900 text-white rounded-xl py-4 shadow-md">
              <span className="font-bold text-[15px] text-slate-300">الإجمالي المتوقع</span>
              <span className="font-mono font-black text-white text-2xl tracking-wide">${(1080000).toLocaleString()}</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
