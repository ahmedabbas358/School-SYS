'use client';

import React, { useState } from 'react';
import { 
  UserCheck, AlertCircle, Clock, FileText, CheckCircle2,
  XCircle, Filter, Search, Download, Calendar, ShieldAlert,
  ChevronRight, Award, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('daily');
  const [attendanceData, setAttendanceData] = useState<any>({ stats: {}, attendances: [], positiveBehaviors: [], negativeBehaviors: [] });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch('/api/attendance');
        const json = await res.json();
        if (json.success && json.data) setAttendanceData(json.data);
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
          <div className="bg-gradient-to-br from-rose-100 to-rose-50 p-3.5 rounded-xl text-rose-600 border border-rose-200/50 shadow-sm shadow-rose-100">
             <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">الحضور والانضباط السلوكي</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">إدارة غياب الطلاب، التأخير، والمخالفات السلوكية</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 xl:flex-none">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث عن طالب، صف..." 
              className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-slate-200/80 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-700 shadow-sm transition-all placeholder:text-slate-400"
            />
          </div>
          <button className="px-5 py-2.5 bg-rose-600 text-white rounded-lg text-[13px] font-bold hover:bg-rose-700 shadow-sm shadow-rose-600/20 flex items-center gap-2 transition-colors border border-transparent">
             <Plus className="w-4 h-4" /> تسجيل غياب/مخالفة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="سجل الحضور اليوم" value={attendanceData.stats?.presentCount || 0} subtitle="طالب حاضر" icon={<CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
        <StatCard title="الطلاب الغائبون" value={attendanceData.stats?.absentCount || 0} subtitle="إجمالي الغياب اليوم" icon={<XCircle className="w-4.5 h-4.5 text-rose-500" />} color="bg-rose-50 border-rose-100" />
        <StatCard title="التأخير الصباحي" value={attendanceData.stats?.lateCount || 0} subtitle="طلاب متأخرين اليوم" icon={<Clock className="w-4.5 h-4.5 text-amber-500" />} color="bg-amber-50 border-amber-100" />
        <StatCard title="المخالفات السلوكية" value={attendanceData.stats?.negativeCount || 0} subtitle="هذا الأسبوع" icon={<ShieldAlert className="w-4.5 h-4.5 text-indigo-500" />} color="bg-indigo-50 border-indigo-100" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">وحدات الحضور والانضباط</h3>
            </div>
            <div className="p-3 space-y-1">
              <NavItem icon={<Calendar/>} label="اللوحة اليومية (الحضور)" id="daily" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Clock/>} label="المتأخرين" id="late" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<FileText/>} label="سجل الغياب والأعذار" id="absence" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<ShieldAlert/>} label="الانضباط والمخالفات" id="discipline" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Award/>} label="السلوك الإيجابي" id="positive" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {loading ? (
             <div className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mb-4"></div>
                <h3 className="text-lg font-bold text-slate-800">جاري تحميل بيانات الحضور...</h3>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'daily' && <DailyAttendanceModule key="daily" attendances={attendanceData.attendances} />}
              {activeTab === 'late' && <LateStudentsModule key="late" attendances={attendanceData.attendances} />}
              {activeTab === 'absence' && <AbsenceModule key="absence" attendances={attendanceData.attendances} />}
              {activeTab === 'discipline' && <DisciplineModule key="discipline" behaviors={attendanceData.negativeBehaviors} />}
              {activeTab === 'positive' && <PositiveModule key="positive" behaviors={attendanceData.positiveBehaviors} />}
              
              {!['daily', 'late', 'absence', 'discipline', 'positive'].includes(activeTab) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[400px]">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 text-slate-300 border border-slate-200/60 shadow-inner">
                      <UserCheck className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">وحدة قيد الإنشاء</h3>
                   <p className="text-slate-500 max-w-md text-[13px] font-medium leading-relaxed">سيتم إتاحة وتفعيل هذه الواجهة لاحقاً، الرجاء استخدام لوحة الحضور والانضباط المتاحة الآن.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({ title, value, subtitle, icon, color, dark }: any) {
  return (
    <div className={cn("rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all border bg-white flex flex-col justify-center min-h-[130px] group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]", 
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
          ? "bg-rose-50 text-rose-700 shadow-sm border border-rose-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-rose-600" : "text-slate-400 group-hover:text-rose-500") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-rose-400" />}
    </button>
  );
}

// ------------------------------------------------------------------
// Modules
// ------------------------------------------------------------------

function DailyAttendanceModule({ attendances }: { attendances: any[] }) {
  const students = attendances.length > 0 ? attendances.map(a => ({
    id: a.student?.id?.substring(0, 8),
    name: a.student?.user?.name,
    status: a.status === 'PRESENT' ? 'حاضر' : a.status === 'ABSENT' ? 'غائب' : a.status === 'LATE' ? 'متأخر' : 'مستأذن',
    time: a.date ? new Date(a.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : '-',
    note: a.notes || ''
  })) : [
    { id: '101', name: 'أحمد محمد عبدالعزيز', status: 'حاضر', time: '07:15', note: '' },
    { id: '102', name: 'عمر خالد السعيد', status: 'غائب', time: '-', note: '' },
    { id: '103', name: 'فيصل ياسر', status: 'متأخر', time: '08:05', note: 'ازدحام مروري' },
    { id: '104', name: 'سعد فهد', status: 'حاضر', time: '07:30', note: '' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">لوحة الحضور اليومية</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">الصف السادس - شعبة أ</p>
        </div>
        <div className="flex items-center gap-2.5">
           <input type="date" defaultValue="2026-10-15" className="px-4 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
           <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 border border-transparent transition-colors">حفظ التحضير</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="text-[12px] font-bold bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200/60 shadow-sm">تحديد الجميع حاضر</button>
        <button className="text-[12px] font-bold bg-rose-50 hover:bg-rose-100 transition-colors text-rose-700 px-4 py-2 rounded-lg border border-rose-200/60 shadow-sm">تحديد الجميع غائب</button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0 border-collapse">
             <thead className="bg-slate-50/50 border-b border-slate-200/80">
                <tr>
                   <th className="px-6 py-4 w-16 text-center text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الرقم</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">اسم الطالب</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">وقت التسجيل</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">ملاحظات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {students.map((student, i) => (
                 <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-center font-mono font-bold text-[13px] text-slate-400">{student.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-[14px]">{student.name}</td>
                    <td className="px-6 py-4 text-center">
                       <select 
                         defaultValue={student.status}
                         className={cn("px-3.5 py-2 rounded-lg text-[13px] font-bold outline-none shadow-sm transition-all focus:ring-2 focus:ring-offset-1", 
                           student.status === 'حاضر' && "bg-emerald-50 text-emerald-800 border-emerald-200 border focus:ring-emerald-500/30",
                           student.status === 'غائب' && "bg-rose-50 text-rose-800 border-rose-200 border focus:ring-rose-500/30",
                           student.status === 'متأخر' && "bg-amber-50 text-amber-800 border-amber-200 border focus:ring-amber-500/30"
                         )}
                       >
                         <option value="حاضر">حاضر</option>
                         <option value="غائب">غائب</option>
                         <option value="متأخر">متأخر</option>
                         <option value="مستأذن">مستأذن</option>
                       </select>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-semibold text-[13px] text-slate-500 bg-slate-50/30">{student.time}</td>
                    <td className="px-6 py-4">
                       <input type="text" defaultValue={student.note} placeholder="أضف ملاحظة..." className="w-full text-[13px] px-3.5 py-2 border border-slate-200/80 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700 bg-slate-50/30 focus:bg-white" />
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

function LateStudentsModule({ attendances }: { attendances: any[] }) {
  const lates = attendances.filter(a => a.status === 'LATE');
  const lateStudents = lates.length > 0 ? lates.map(l => ({
    name: l.student?.user?.name,
    grade: l.section?.grade?.name || l.section?.name || 'عام',
    time: new Date(l.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    delay: l.notes || "غير محدد",
    count: 1,
    action: "تنبيه"
  })) : [
    { name: "فيصل ياسر", grade: "السادس - أ", time: "08:05 ص", delay: "20 دقيقة", count: 3, action: "تنبيه" },
    { name: "خالد محمود", grade: "الرابع - ب", time: "08:15 ص", delay: "30 دقيقة", count: 1, action: "لا يوجد" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">سجل المتأخرين اليوم</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">متابعة الطلاب المتأخرين ورصد مرات التكرار</p>
         </div>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">اسم الطالب</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">وقت الحضور</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">مدة التأخير</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">مرات التكرار (هذا الشهر)</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الإجراء المتبع</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {lateStudents.map((s, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                     <span className="font-bold text-[14px] text-slate-900 block">{s.name}</span>
                     <span className="text-[12px] font-semibold text-slate-500">{s.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-mono font-semibold text-slate-600 bg-slate-50/30">{s.time}</td>
                  <td className="px-6 py-4 text-center">
                     <span className="text-[13px] font-bold text-amber-600">{s.delay}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold", s.count > 2 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700")}>{s.count}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className="text-[12px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">{s.action}</span>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function AbsenceModule({ attendances }: { attendances: any[] }) {
  const absents = attendances.filter(a => a.status === 'ABSENT' || a.status === 'EXCUSED');
  const absences = absents.length > 0 ? absents.map(a => ({
    name: a.student?.user?.name,
    date: new Date(a.date).toISOString().split('T')[0],
    reason: a.notes || "-",
    type: a.status === 'EXCUSED' ? "بعذر مبرر" : "بدون عذر",
    attachment: false
  })) : [
    { name: "عمر خالد السعيد", date: "2026-10-15", reason: "موعد طبي", type: "بعذر مبرر", attachment: true },
    { name: "أنس فهد", date: "2026-10-14", reason: "-", type: "بدون عذر", attachment: false },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">إدارة الغياب والأعذار</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">مراجعة أعذار الغياب المرفوعة من أولياء الأمور</p>
         </div>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">اسم الطالب</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">التاريخ</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">السبب</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">التصنيف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">المرفق</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {absences.map((a, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{a.name}</td>
                  <td className="px-6 py-4 text-[13px] font-mono font-semibold text-slate-600 bg-slate-50/30">{a.date}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-700">{a.reason}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-md border", a.type === 'بعذر مبرر' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100")}>{a.type}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     {a.attachment ? (
                       <button className="text-[12px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors">عرض المرفق</button>
                     ) : (
                       <span className="text-slate-300">-</span>
                     )}
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function PositiveModule({ behaviors }: { behaviors: any[] }) {
  const leaderboard = [
    { rank: 1, name: 'أحمد محمد عبدالعزيز', grade: 'السادس - أ', points: 145, badge: '🥇', color: 'from-amber-400 to-yellow-300' },
    { rank: 2, name: 'سارة فهد العلي', grade: 'الخامس - ب', points: 132, badge: '🥈', color: 'from-slate-300 to-slate-200' },
    { rank: 3, name: 'فيصل ياسر الغامدي', grade: 'السادس - أ', points: 118, badge: '🥉', color: 'from-amber-600 to-amber-400' },
    { rank: 4, name: 'نورة سعد الحربي', grade: 'الرابع - أ', points: 95, badge: '⭐', color: '' },
    { rank: 5, name: 'عمر خالد السعيد', grade: 'الرابع - ب', points: 88, badge: '⭐', color: '' },
  ];

  const recentAwards = behaviors.length > 0 ? behaviors.map(b => ({
    student: b.student?.user?.name,
    category: b.category,
    points: b.points,
    date: new Date(b.date).toISOString().split('T')[0],
    teacher: b.recordedBy || 'النظام',
    note: b.note || '-'
  })) : [
    { student: 'أحمد محمد عبدالعزيز', category: 'المشاركة الصفية', points: 10, date: '2026-10-15', teacher: 'أ. سامي محمد', note: 'تفاعل ممتاز في حصة الرياضيات' },
    { student: 'سارة فهد العلي', category: 'مساعدة الزملاء', points: 15, date: '2026-10-14', teacher: 'أ. فاطمة علي', note: 'مساعدة زميلتها في فهم الدرس' },
    { student: 'فيصل ياسر الغامدي', category: 'الالتزام والانضباط', points: 5, date: '2026-10-14', teacher: 'أ. خالد فهد', note: 'حضور مبكر يومي منتظم لمدة أسبوعين' },
    { student: 'نورة سعد الحربي', category: 'التميز الأكاديمي', points: 20, date: '2026-10-13', teacher: 'أ. سناء خليل', note: 'أعلى درجة في اختبار العلوم' },
  ];

  const categories = [
    { name: 'المشاركة الصفية', count: 45, color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { name: 'مساعدة الزملاء', count: 32, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { name: 'الالتزام والانضباط', count: 28, color: 'bg-amber-50 text-amber-700 border-amber-100' },
    { name: 'التميز الأكاديمي', count: 20, color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100' },
    { name: 'الأنشطة اللامنهجية', count: 15, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  ];

  const maxPoints = leaderboard[0]?.points || 1;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">السلوك الإيجابي والتعزيز ⭐</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">نظام نقاط السلوك الإيجابي، المكافآت، ولوحة ترتيب الطلاب المتميزين</p>
        </div>
        <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> منح نقاط إيجابية
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-slate-500 text-[11px] font-bold uppercase mb-1">إجمالي النقاط الممنوحة</h4>
          <div className="text-2xl font-bold text-emerald-600 font-mono">1,240</div>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">هذا الفصل الدراسي</p>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-slate-500 text-[11px] font-bold uppercase mb-1">الطلاب المشاركون</h4>
          <div className="text-2xl font-bold text-blue-600 font-mono">187 <span className="text-sm text-slate-400">/ 820</span></div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-slate-500 text-[11px] font-bold uppercase mb-1">مكافآت صُرفت</h4>
          <div className="text-2xl font-bold text-amber-600 font-mono">23</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-slate-500 text-[11px] font-bold uppercase mb-1">متوسط النقاط لكل طالب</h4>
          <div className="text-2xl font-bold text-fuchsia-600 font-mono">6.6</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-bold text-slate-800 text-[14px]">🏆 لوحة ترتيب الطلاب المتميزين</h3>
          </div>
          <div className="p-5 space-y-4">
            {leaderboard.map((student) => (
              <div key={student.rank} className="flex items-center gap-4">
                <div className="text-2xl w-8 text-center shrink-0">{student.badge}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-bold text-[14px] text-slate-900">{student.name}</span>
                      <span className="text-[12px] text-slate-500 font-semibold mr-2">{student.grade}</span>
                    </div>
                    <span className="font-mono font-bold text-[15px] text-emerald-600 shrink-0">{student.points} <span className="text-[11px] text-slate-400">نقطة</span></span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-emerald-400 transition-all shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      style={{ width: `${(student.points / maxPoints) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-bold text-slate-800 text-[14px]">📊 فئات التعزيز الإيجابي</h3>
          </div>
          <div className="p-5 space-y-3">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
                <span className={cn("text-[12px] font-bold px-3 py-1.5 rounded-lg border", cat.color)}>{cat.name}</span>
                <span className="font-mono font-bold text-[14px] text-slate-700">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Awards Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30">
          <h3 className="font-bold text-slate-800 text-[14px]">🌟 آخر النقاط الممنوحة</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right shrink-0 border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase">الطالب</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase">الفئة</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">النقاط</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase">الملاحظة</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">التاريخ</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase">بواسطة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAwards.map((award, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-[13px] text-slate-900">{award.student}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">{award.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="font-mono font-bold text-[15px] text-emerald-600">+{award.points}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-slate-600 max-w-[200px] truncate">{award.note}</td>
                  <td className="px-5 py-3.5 text-center font-mono text-[12px] text-slate-500">{award.date}</td>
                  <td className="px-5 py-3.5 text-[13px] font-bold text-slate-600">{award.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function DisciplineModule({ behaviors }: { behaviors: any[] }) {
  const records = behaviors.length > 0 ? behaviors.map(b => ({
    name: b.student?.user?.name,
    grade: 'عام',
    violation: b.category,
    date: new Date(b.date).toISOString().split('T')[0],
    teacher: b.recordedBy || 'النظام',
    action: b.note || '-',
    status: 'مغلق'
  })) : [
    { name: 'ماجد العبدल्लाह', grade: 'التاسع', violation: 'تأخر متكرر عن الحصص', date: '2026-10-14', teacher: 'أ. سامي', action: 'تنبيه شفهي', status: 'مغلق' },
    { name: 'سيف فهد', grade: 'الأول الثانوي', violation: 'شجار مع زميل', date: '2026-10-12', teacher: 'أ. خالد', action: 'استدعاء ولي أمر', status: 'مفتوح' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">سجل الانضباط السلوكي</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">رصد المخالفات والعقوبات المسجلة</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
         <div className="overflow-x-auto">
         <table className="w-full text-right shrink-0 border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الطالب</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">نوع المخالفة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">التاريخ</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الإجراء المتخذ</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {records.map((r, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                     <span className="text-[14px] font-bold text-slate-900 block">{r.name}</span>
                     <span className="text-[12px] font-semibold text-slate-500 block mt-0.5">{r.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-bold text-rose-700">{r.violation}</td>
                  <td className="px-6 py-4 text-[13px] font-mono font-semibold text-slate-500 bg-slate-50/30">{r.date}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{r.action}</td>
                  <td className="px-6 py-4 text-center">
                     {r.status === 'مفتوح' ? (
                       <span className="text-[11px] bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md font-bold uppercase border border-amber-200/60 shadow-sm">مفتوح للمتابعة</span>
                     ) : (
                       <span className="text-[11px] bg-slate-50 text-slate-600 px-3 py-1.5 rounded-md font-bold uppercase border border-slate-200/80 shadow-sm">مغلق</span>
                     )}
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
