'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, LayoutGrid, Layers, FileText,
  Settings, ChevronRight, Plus, Search, Filter,
  Share2, Save, GraduationCap, CheckCircle2, Calendar,
  BarChart3, Clock, UserCheck, Target, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState('structure');
  const [academicData, setAcademicData] = useState<any>({ structure: [], subjects: [], years: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await fetch('/api/academic');
        const res = await response.json();
        if (res.success && res.data) {
          setAcademicData(res.data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 p-3.5 rounded-xl text-fuchsia-600 border border-fuchsia-200/50 shadow-sm shadow-fuchsia-100">
             <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">الشؤون الأكاديمية</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">إعدادات الهيكل التعليمي، المراحل، الفصول، وتوزيع المواد</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 outline-none shadow-sm focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all">
             <option>العام الدراسي 2026/2027</option>
          </select>
          <div className="relative min-w-[240px] flex-1 xl:flex-none">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث عن مادة، صف..." 
              className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-slate-200/80 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 font-medium text-slate-700 shadow-sm transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">لوحة تحكم الهيكل الأساسي</h3>
            </div>
            <div className="p-3 space-y-1">
              <NavItem icon={<Layers/>} label="الهيكل الأكاديمي العام" id="structure" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<GraduationCap/>} label="المراحل الدراسية" id="stages" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<LayoutGrid/>} label="الصفوف والشعب" id="classes" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<FileText/>} label="المقرات والمواد الدراسية" id="subjects" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Users/>} label="توزيع المعلمين" id="teachers" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<Settings/>} label="إعدادات العام الدراسي" id="settings" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {loading ? (
             <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 rounded bg-slate-100 animate-pulse" />
                    <div className="h-3 w-72 max-w-full rounded bg-slate-100 animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4].map((item) => <div key={item} className="h-28 rounded-2xl bg-slate-100/80 animate-pulse" />)}
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-12 rounded-xl bg-slate-100/70 animate-pulse" />)}
                </div>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'structure' && <StructureModule key="structure" structure={academicData.structure} />}
              {activeTab === 'classes' && <ClassesModule key="classes" structure={academicData.structure} />}
              {activeTab === 'stages' && <StagesModule key="stages" structure={academicData.structure} />}
              {activeTab === 'subjects' && <SubjectsModule key="subjects" subjects={academicData.subjects} />}
              {activeTab === 'teachers' && <TeachersModule key="teachers" subjects={academicData.subjects} />}
              {activeTab === 'settings' && <SettingsModule key="settings" years={academicData.years} />}
              
              {!['structure', 'classes', 'stages', 'subjects', 'teachers', 'settings'].includes(activeTab) && (
                <OperationalFallback key="fallback" activeTab={activeTab} />
              )}
            </AnimatePresence>
          )}
        </div>
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
          ? "bg-fuchsia-50 text-fuchsia-700 shadow-sm border border-fuchsia-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-fuchsia-600" : "text-slate-400 group-hover:text-fuchsia-500") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-fuchsia-400" />}
    </button>
  );
}

function StructureModule({ structure }: { structure: any[] }) {
  const colors = [
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    "bg-rose-50 text-rose-700 border-rose-200"
  ];

  const stages = structure.length > 0 ? structure.map((s, i) => ({
    title: s.name,
    grades: s.grades ? s.grades.map((g: any) => g.name) : [],
    color: colors[i % colors.length]
  })) : [
    { title: "رياض الأطفال", grades: ["KG1", "KG2"], color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { title: "المرحلة الابتدائية", grades: ["الصف الأول", "الصف الثاني", "الصف السادس"], color: "bg-blue-50 text-blue-700 border-blue-200" }
  ];

  const totalStages = structure.length || stages.length;
  const totalGrades = structure.length > 0 ? structure.reduce((acc, stage) => acc + (stage.grades?.length || 0), 0) : stages.reduce((acc, stage) => acc + stage.grades.length, 0);
  const totalSections = structure.length > 0
    ? structure.reduce((acc, stage) => acc + (stage.grades || []).reduce((gradeAcc: number, grade: any) => gradeAcc + (grade.sections?.length || 0), 0), 0)
    : 5;
  const linkedGrades = structure.length > 0
    ? structure.reduce((acc, stage) => acc + (stage.grades || []).filter((grade: any) => (grade.sections?.length || 0) > 0).length, 0)
    : totalGrades;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">الهيكل الأكاديمي الشجري</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">العام الدراسي 2026/2027</p>
        </div>
        <button className="px-5 py-2.5 bg-fuchsia-600 text-white rounded-lg text-[13px] font-bold shadow-sm shadow-fuchsia-600/20 hover:bg-fuchsia-700 transition-colors border border-transparent">
           استنساخ هيكل العام السابق
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AcademicMetric title="المراحل النشطة" value={totalStages} subtitle="مسارات تعليمية معتمدة" icon={<Layers />} tone="fuchsia" />
        <AcademicMetric title="الصفوف المعرفة" value={totalGrades} subtitle="صفوف مرتبطة بالمراحل" icon={<GraduationCap />} tone="blue" />
        <AcademicMetric title="الشعب الجاهزة" value={totalSections} subtitle="قاعات وشعب تشغيلية" icon={<LayoutGrid />} tone="emerald" />
        <AcademicMetric title="اكتمال الربط" value={`${totalGrades ? Math.round((linkedGrades / totalGrades) * 100) : 0}%`} subtitle="صفوف لديها شعب" icon={<Target />} tone="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {stages.map((stage, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
               <h3 className="font-bold text-slate-800 text-[15px]">{stage.title}</h3>
               <button className="text-[12px] font-bold text-slate-400 hover:text-fuchsia-600 bg-slate-50 hover:bg-fuchsia-50 px-2.5 py-1 rounded-md transition-colors border border-slate-200 hover:border-fuchsia-200">إدارة</button>
             </div>
             
             <div className="flex flex-wrap gap-2.5">
                {stage.grades.map((grade, j) => (
                   <span key={j} className={cn("px-3.5 py-1.5 rounded-lg text-[12px] font-bold border shadow-sm", stage.color)}>
                     {grade}
                   </span>
                ))}
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ClassesModule({ structure }: { structure: any[] }) {
  // Extract all sections from structure
  const allSections = structure.flatMap(stage => 
    (stage.grades || []).flatMap((grade: any) => 
      (grade.sections || []).map((sec: any) => ({
        grade: grade.name,
        name: sec.name,
        capacity: sec.capacity,
        students: sec._count?.enrollments || 0,
        teacher: 'غير معين', // Update with real data if available in schema
        room: 'قاعة عامة'
      }))
    )
  );

  const sections = allSections.length > 0 ? allSections : [
    { grade: 'الصف السادس', name: 'شعبة أ', capacity: 30, students: 28, teacher: 'أ. سامي محمد', room: 'قاعة 101' },
    { grade: 'الصف السادس', name: 'شعبة ب', capacity: 30, students: 29, teacher: 'أ. خالد فهد', room: 'قاعة 102' },
    { grade: 'الصف السادس', name: 'شعبة ج', capacity: 30, students: 30, teacher: 'أ. ياسر حسين', room: 'قاعة 103' },
  ];
  const totalStudents = sections.reduce((acc, section) => acc + section.students, 0);
  const totalCapacity = sections.reduce((acc, section) => acc + section.capacity, 0);
  const fullSections = sections.filter((section) => section.students >= section.capacity).length;
  const averageOccupancy = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">إدارة الشعب الدراسية</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">توزيع الطلاب على القاعات والشعب</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <button className="px-4 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-sm rounded-lg text-[13px] font-bold transition-colors">
              توزيع تلقائي للطلاب
           </button>
           <button className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-colors flex items-center gap-2 border border-transparent">
              <Plus className="w-4 h-4" /> إضافة شعبة
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AcademicMetric title="إجمالي الشعب" value={sections.length} subtitle="شعب قابلة للإدارة" icon={<LayoutGrid />} tone="fuchsia" />
        <AcademicMetric title="الطلاب المسجلون" value={totalStudents} subtitle="ضمن الشعب الحالية" icon={<Users />} tone="blue" />
        <AcademicMetric title="متوسط الإشغال" value={`${averageOccupancy}%`} subtitle="سعة الطلاب مقابل المقاعد" icon={<BarChart3 />} tone={averageOccupancy > 95 ? "rose" : "emerald"} />
        <AcademicMetric title="شعب مكتملة" value={fullSections} subtitle="تحتاج متابعة السعة" icon={<AlertCircle />} tone={fullSections > 0 ? "amber" : "slate"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {["كل المراحل", "كل الصفوف", "حالة السعة", "رائد الشعبة"].map((label) => (
          <select key={label} className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2.5 font-bold outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500">
            <option>{label}</option>
          </select>
        ))}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
         <table className="w-full text-right shrink-0 border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الصف</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الشعبة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الطلاب (الحالي/الأقصى)</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الرائد/المشرف</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">القاعة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الإجراءات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {sections.map((sec, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-[14px] font-bold text-slate-800">{sec.grade}</td>
                   <td className="px-6 py-4 font-bold text-fuchsia-700 text-[14px]">{sec.name}</td>
                   <td className="px-6 py-4 text-center">
                     <CapacityBar value={sec.students} max={sec.capacity} tone={sec.students >= sec.capacity ? "rose" : "emerald"} />
                   </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{sec.teacher}</td>
                  <td className="px-6 py-4 text-[13px] font-mono font-semibold text-slate-500 bg-slate-50/50">{sec.room}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[12px] font-bold text-fuchsia-600 hover:text-white bg-fuchsia-50 hover:bg-fuchsia-600 px-4 py-2 rounded-lg border border-fuchsia-100 hover:border-fuchsia-600 transition-all shadow-sm">إدارة الطلاب</button>
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

function StagesModule({ structure }: { structure: any[] }) {
  const colors = [
    "bg-emerald-50 text-emerald-700",
    "bg-blue-50 text-blue-700",
    "bg-fuchsia-50 text-fuchsia-700",
    "bg-rose-50 text-rose-700"
  ];

  const stagesList = structure.length > 0 ? structure.map((s, i) => {
    const classesCount = (s.grades || []).reduce((acc: number, g: any) => acc + (g.sections?.length || 0), 0);
    const gradesCount = s.grades?.length || 0;
    return {
      name: s.name,
      code: `STG-${s.order}`,
      manager: s.manager?.user?.name || s.managerName || `مشرف ${s.name}`,
      classesCount,
      gradesCount,
      status: 'نشط',
      color: colors[i % colors.length]
    };
  }) : [
    { name: "رياض الأطفال", code: "KG", manager: "نورة السعد", classesCount: 2, gradesCount: 2, status: "نشط", color: "bg-emerald-50 text-emerald-700" },
    { name: "المرحلة الابتدائية", code: "PRI", manager: "عبدالله العتيبي", classesCount: 6, gradesCount: 6, status: "نشط", color: "bg-blue-50 text-blue-700" },
    { name: "المرحلة المتوسطة", code: "MID", manager: "ياسر الحمد", classesCount: 3, gradesCount: 3, status: "نشط", color: "bg-fuchsia-50 text-fuchsia-700" },
    { name: "المرحلة الثانوية", code: "SEC", manager: "محمد الفارس", classesCount: 3, gradesCount: 3, status: "تهيئة", color: "bg-rose-50 text-rose-700" },
  ];
  const activeStages = stagesList.filter((stage) => stage.status === "نشط").length;
  const totalClasses = stagesList.reduce((acc, stage) => acc + stage.classesCount, 0);
  const totalGrades = stagesList.reduce((acc, stage) => acc + stage.gradesCount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">إدارة المراحل الدراسية</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">التحكم في المراحل، المدراء المسؤولين، والحالة التشغيلية</p>
        </div>
        <button className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> إضافة مرحلة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AcademicMetric title="المراحل العاملة" value={`${activeStages}/${stagesList.length}`} subtitle="جاهزة للتسجيل والتوزيع" icon={<CheckCircle2 />} tone="emerald" />
        <AcademicMetric title="الصفوف ضمن المراحل" value={totalGrades} subtitle="صفوف معرفة في الهيكل" icon={<GraduationCap />} tone="blue" />
        <AcademicMetric title="الشعب المرتبطة" value={totalClasses} subtitle="شعب داخل هذه المراحل" icon={<LayoutGrid />} tone="fuchsia" />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">سجل المراحل المعتمدة</h3>
            <p className="text-[12px] text-slate-500 mt-1 font-medium">تحديث المدير والحالة وعدد الشعب من مكان واحد</p>
          </div>
          <button className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 hover:text-fuchsia-700 hover:border-fuchsia-200 transition-colors flex items-center gap-2 w-fit">
            <Filter className="w-4 h-4" /> تصفية الحالات
          </button>
        </div>
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">اسم المرحلة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الرمز</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">المدير المسؤول</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">عدد الصفوف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحالة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-left">إجراءات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {stagesList.map((stage, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                     <span className={cn("px-3 py-1.5 rounded-lg text-[13px] font-bold border border-transparent", stage.color)}>
                        {stage.name}
                     </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-[13px] text-slate-500">{stage.code}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-700">{stage.manager}</td>
                  <td className="px-6 py-4 text-center font-bold text-[14px] text-slate-900">{stage.classesCount}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold border", stage.status === "نشط" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100")}>{stage.status}</span>
                  </td>
                   <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-[12px] font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-1.5 rounded-md border border-blue-100 hover:border-blue-600 shadow-sm transition-colors">تعديل</button>
                        <button className="text-[12px] font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 px-3 py-1.5 rounded-md border border-rose-100 hover:border-rose-600 shadow-sm transition-colors">حذف</button>
                      </div>
                   </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function SubjectsModule({ subjects: apiSubjects }: { subjects: any[] }) {
  const subjects = apiSubjects.length > 0 ? apiSubjects.map(s => ({
    code: s.code,
    name: s.name,
    grade: s.grade?.name || 'غير محدد',
    credits: s.weeklyPeriods || 0,
    type: s.passScore > 0 ? "إلزامي" : "اختياري"
  })) : [
    { code: "SUB-101", name: "الرياضيات العامة", grade: "الأول المتوسط", credits: 4, type: "إلزامي" },
    { code: "SUB-102", name: "العلوم", grade: "الأول المتوسط", credits: 4, type: "إلزامي" },
    { code: "SUB-103", name: "المهارات الحياتية", grade: "المرحلة المتوسطة", credits: 2, type: "اختياري" },
  ];
  const requiredSubjects = subjects.filter((subject) => subject.type === "إلزامي").length;
  const totalWeeklyPeriods = subjects.reduce((acc, subject) => acc + subject.credits, 0);
  const coveredGrades = new Set(subjects.map((subject) => subject.grade)).size;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">المقررات والمواد الدراسية</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">سجل المواد الدراسية، الساعات المعتمدة، وأنواع المواد</p>
          </div>
          <button className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-colors flex items-center gap-2 border border-transparent w-fit">
            <Plus className="w-4 h-4" /> إضافة مادة
          </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AcademicMetric title="إجمالي المواد" value={subjects.length} subtitle="مادة ضمن الخطة" icon={<BookOpen />} tone="fuchsia" />
        <AcademicMetric title="مواد إلزامية" value={requiredSubjects} subtitle="تدخل في معدل النجاح" icon={<CheckCircle2 />} tone="emerald" />
        <AcademicMetric title="حصص أسبوعية" value={totalWeeklyPeriods} subtitle="إجمالي العبء التعليمي" icon={<Clock />} tone="blue" />
        <AcademicMetric title="صفوف مغطاة" value={coveredGrades} subtitle="مرتبطة بالمقررات" icon={<Target />} tone="amber" />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">رمز المادة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">اسم المادة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">المرحلة / الصف المستهدف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الساعات/الحصص</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">النوع</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {subjects.map((sub, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-center font-mono font-bold text-[13px] text-slate-500 bg-slate-50/50">{sub.code}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{sub.name}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-700">{sub.grade}</td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-[14px] text-fuchsia-600">{sub.credits}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold border", sub.type === "إلزامي" ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100" : "bg-slate-100 text-slate-600 border-slate-200")}>{sub.type}</span>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function TeachersModule({ subjects: apiSubjects }: { subjects: any[] }) {
  // Map teacher assignments from subject.teacherSubjects
  const allAssignments = apiSubjects.flatMap(sub => 
    (sub.teacherSubjects || []).map((ts: any) => ({
      teacher: ts.employee?.user?.name || 'مجهول',
      subject: sub.name,
      stage: sub.grade?.stage?.name || '',
      grade: sub.grade?.name || '',
      section: 'عام',
      hours: sub.weeklyPeriods || 0
    }))
  );

  const assignments = allAssignments.length > 0 ? allAssignments : [
    { teacher: "أحمد محمود", subject: "الرياضيات", stage: "المتوسطة", grade: "الأول المتوسط", section: "شعبة أ, شعبة ب", hours: 12 },
    { teacher: "سناء خليل", subject: "العلوم", stage: "الابتدائية", grade: "الصف السادس", section: "أ, ب, ج", hours: 18 },
    { teacher: "خالد الفهد", subject: "اللغة العربية", stage: "المتوسطة", grade: "الثاني المتوسط", section: "شعبة أ", hours: 8 },
  ];
  const uniqueTeachers = Array.from(new Set(assignments.map((item) => item.teacher)));
  const totalTeacherHours = assignments.reduce((acc, item) => acc + item.hours, 0);
  const overloadedTeachers = assignments.filter((item) => item.hours >= 18).length;
  const subjectOptions = apiSubjects.length > 0 ? apiSubjects.map((subject) => subject.name) : Array.from(new Set(assignments.map((item) => item.subject)));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">توزيع المعلمين (Teacher Assignment)</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">ربط: معلم ← مادة ← صف ← شعبة</p>
        </div>
        <button className="px-4 py-2.5 bg-fuchsia-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-fuchsia-600/20 hover:bg-fuchsia-700 transition-colors flex items-center gap-2 border border-transparent">
          <Save className="w-4 h-4" /> حفظ التوزيعات
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AcademicMetric title="المعلمون المرتبطون" value={uniqueTeachers.length} subtitle="ضمن جدول التوزيع" icon={<UserCheck />} tone="blue" />
        <AcademicMetric title="التكليفات النشطة" value={assignments.length} subtitle="مادة / صف / شعبة" icon={<Share2 />} tone="fuchsia" />
        <AcademicMetric title="إجمالي الحصص" value={totalTeacherHours} subtitle="حصص أسبوعية موزعة" icon={<Clock />} tone="emerald" />
        <AcademicMetric title="أحمال مرتفعة" value={overloadedTeachers} subtitle="تحتاج مراجعة الجدول" icon={<AlertCircle />} tone={overloadedTeachers > 0 ? "amber" : "slate"} />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">نموذج التوزيع السريع</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-slate-600">المعلم</label>
            <select className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-fuchsia-500/20">
               <option>اختر المعلم...</option>
               {uniqueTeachers.map((teacher) => <option key={teacher}>{teacher}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-slate-600">المادة</label>
            <select className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-fuchsia-500/20">
               <option>اختر المادة...</option>
               {subjectOptions.map((subject) => <option key={subject}>{subject}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-slate-600">الصف</label>
            <select className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-fuchsia-500/20">
               <option>اختر الصف...</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-slate-600">الشعبة</label>
            <select className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-fuchsia-500/20">
               <option>اختر الشعبة...</option>
            </select>
          </div>
          <button className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-sm h-[38px] flex justify-center items-center gap-2">
            <Plus className="w-4 h-4" /> إضافة
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">اسم المعلم</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">المادة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">المرحلة / الصف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الشعبة</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحصص</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحمل</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-left">إجراءات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {assignments.map((item, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{item.teacher}</td>
                  <td className="px-6 py-4 font-bold text-[13px] text-fuchsia-700">{item.subject}</td>
                   <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{item.stage} - {item.grade}</td>
                   <td className="px-6 py-4 text-[13px] font-medium text-slate-700">{item.section}</td>
                   <td className="px-6 py-4 text-center font-mono font-bold text-[14px] text-slate-800">{item.hours}</td>
                   <td className="px-6 py-4 text-center">
                     <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold border", item.hours >= 18 ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100")}>
                       {item.hours >= 18 ? "مرتفع" : "متوازن"}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-left">
                     <button className="text-[12px] font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 px-3 py-1.5 rounded-md border border-rose-100 shadow-sm transition-colors">إزالة</button>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function SettingsModule({ years }: { years: any[] }) {
  const currentYear = years.find(y => y.isCurrent) || years[0];
  const startDate = currentYear?.startDate ? currentYear.startDate.split('T')[0] : "2026-09-01";
  const endDate = currentYear?.endDate ? currentYear.endDate.split('T')[0] : "2027-06-15";
  const yearName = currentYear?.name || "2026/2027";
  const configuredYears = years.length || 1;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">إعدادات العام الدراسي</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">الضوابط الأكاديمية ونظام التقييم</p>
        </div>
        <button className="px-4 py-2.5 bg-fuchsia-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-fuchsia-600/20 hover:bg-fuchsia-700 transition-colors flex items-center gap-2 border border-transparent">
          <Save className="w-4 h-4" /> حفظ التعديلات
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AcademicMetric title="العام الحالي" value={yearName} subtitle="مستخدم في كل الوحدات" icon={<Calendar />} tone="fuchsia" />
        <AcademicMetric title="سنوات معرفة" value={configuredYears} subtitle="سجلات أكاديمية متاحة" icon={<FileText />} tone="blue" />
        <AcademicMetric title="سياسة الترقية" value="مفعلة" subtitle="للطلاب الناجحين" icon={<CheckCircle2 />} tone="emerald" />
        <AcademicMetric title="حالة الإعداد" value="جاهز" subtitle="قابل للربط مع النتائج" icon={<Settings />} tone="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
               <Calendar className="w-4 h-4 text-fuchsia-500" /> إعدادات التقويم
            </h3>
            <div className="space-y-4">
               <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700">تاريخ بداية العام الدراسي</label>
                 <input type="date" className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-4 py-2.5 font-medium outline-none focus:ring-2 focus:ring-fuchsia-500/20" defaultValue={startDate} />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700">تاريخ نهاية العام الدراسي</label>
                 <input type="date" className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-4 py-2.5 font-medium outline-none focus:ring-2 focus:ring-fuchsia-500/20" defaultValue={endDate} />
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
               <CheckCircle2 className="w-4 h-4 text-fuchsia-500" /> ضوابط التقييم
            </h3>
            <div className="space-y-4">
               <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700">نظام العلامات المعتمد</label>
                 <select className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-fuchsia-500/20">
                    <option>نسبة مئوية (100%)</option>
                    <option>أحرف (A, B, C)</option>
                    <option>نقاط (GPA 4.0)</option>
                 </select>
               </div>
               <div className="flex items-center gap-3 mt-6">
                 <input type="checkbox" id="auto-promote" className="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-500 border-slate-300" defaultChecked />
                 <label htmlFor="auto-promote" className="text-[13px] font-medium text-slate-700">تفعيل الترقية التلقائية للطلاب الناجحين بنهاية العام</label>
               </div>
               <div className="flex items-center gap-3">
                 <input type="checkbox" id="allow-edit" className="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-500 border-slate-300" />
                 <label htmlFor="allow-edit" className="text-[13px] font-medium text-slate-700">السماح للمعلمين بتعديل درجات الفترات السابقة</label>
               </div>
            </div>
          </div>
       </div>

       <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
             <BarChart3 className="w-4 h-4 text-fuchsia-500" /> بوابات الاعتماد الأكاديمي
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
            {[
              { label: "اعتماد الهيكل", status: "مكتمل", tone: "emerald" },
              { label: "ربط المواد", status: "جاهز للمراجعة", tone: "blue" },
              { label: "فتح الرصد", status: "بانتظار التقويم", tone: "amber" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
                <p className="text-[12px] font-bold text-slate-500">{item.label}</p>
                <span className={cn(
                  "inline-flex mt-2 px-2.5 py-1 rounded-md text-[11px] font-bold border",
                  item.tone === "emerald" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                  item.tone === "blue" && "bg-blue-50 text-blue-700 border-blue-100",
                  item.tone === "amber" && "bg-amber-50 text-amber-700 border-amber-100"
                )}>{item.status}</span>
              </div>
            ))}
          </div>
       </div>
    </motion.div>
  );
}

function AcademicMetric({ title, value, subtitle, icon, tone }: any) {
  const tones: Record<string, string> = {
    fuchsia: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100",
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold text-slate-500">{title}</p>
          <p className="text-2xl font-black text-slate-900 mt-1 font-display">{value}</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", tones[tone] || tones.slate)}>
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
      </div>
    </div>
  );
}

function CapacityBar({ value, max, tone = "fuchsia" }: { value: number; max: number; tone?: string }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const fill = tone === "rose" ? "bg-rose-500" : tone === "emerald" ? "bg-emerald-500" : "bg-fuchsia-500";

  return (
    <div className="space-y-1.5 min-w-[130px]">
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", fill)} style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between text-[11px] font-bold text-slate-400">
        <span>{percent}%</span>
        <span>{value}/{max}</span>
      </div>
    </div>
  );
}

function OperationalFallback({ activeTab }: { activeTab: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border border-slate-200/80 rounded-2xl p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[360px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">مسار غير معرف في لوحة الشؤون الأكاديمية</h3>
            <p className="text-[13px] text-slate-500 font-medium mt-1">المفتاح الحالي: <span className="font-mono text-slate-700">{activeTab}</span></p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["الهيكل الأكاديمي", "الصفوف والشعب", "المواد والمعلمون"].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-2" />
              <p className="text-[13px] font-bold text-slate-700">{item}</p>
              <p className="text-[12px] text-slate-500 mt-1">متاح ضمن القائمة الجانبية</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
