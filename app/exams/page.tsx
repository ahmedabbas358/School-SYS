'use client';

import React, { useState } from "react";
import {
  GraduationCap, BookOpen, Users, TrendingUp, AlertTriangle, Award, Search,
  ChevronDown, Calendar, LineChart, AlertCircle, ChevronRight, FileText,
  Download, CheckCircle2, PieChart, Activity, Plus, FileSpreadsheet,
  Printer, ScrollText, History, LayoutTemplate, Star, Filter, Save, FileSignature, UploadCloud, RotateCw, FileArchive, MousePointerSquareDashed
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart as RePieChart, Pie, Cell } from 'recharts';

export default function AcademicResultsPage() {
  const [activeTab, setActiveTab] = useState("progression");
  const [examsData, setExamsData] = useState<any>({ periods: [], stats: {}, scales: [], students: [] });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch('/api/exams');
        const json = await res.json();
        if (json.success && json.data) setExamsData(json.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-3.5 rounded-xl text-indigo-600 border border-indigo-200/50 shadow-sm shadow-indigo-100">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
              النتائج والتدرج الأكاديمي
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              نظام متكامل لإدارة النتائج، الشهادات التراكمية، ومسارات ترحيل الطلاب بذكاء
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className="bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all focus:border-indigo-500">
            <option>العام الحالي (2026 - 2027)</option>
            <option>العام السابق (2025 - 2026)</option>
          </select>
          <div className="relative min-w-[240px] flex-1 xl:flex-none">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث عن سجل طالب..."
              className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-slate-200/80 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700 shadow-sm transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                منظومة النتائج والترحيل
              </h3>
            </div>
            <div className="p-3 space-y-1">
              <NavItem icon={<Award />} label="الترحيل والمسارات" id="progression" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<FileSpreadsheet />} label="رصد وتدقيق الدرجات" id="result_entry" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<CheckCircle2 />} label="مراجعة واعتماد النتائج" id="result_review" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<LayoutTemplate />} label="قوالب الشهادات" id="report_templates" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Printer />} label="الطباعة والإصدار" id="printing" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<History />} label="السجل الأكاديمي التراكمي" id="academic_history" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<TrendingUp />} label="تحليل النتائج والأداء" id="results_analytics" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<FileSignature />} label="إعدادات نظام التقييم" id="grading_setup" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {loading ? (
             <div className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mb-4"></div>
                <h3 className="text-lg font-bold text-slate-800">جاري تحميل بيانات التقييمات...</h3>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "progression" && <ProgressionModule key="progression" students={examsData.students} />}
              {activeTab === "result_entry" && <ResultEntryModule key="result_entry" students={examsData.students} />}
              {activeTab === "result_review" && <ResultReviewModule key="result_review" periods={examsData.periods} />}
              {activeTab === "report_templates" && <ReportTemplatesModule key="report_templates" />}
              {activeTab === "printing" && <PrintingModule key="printing" />}
              {activeTab === "academic_history" && <AcademicHistoryModule key="academic_history" />}
              {activeTab === "results_analytics" && <ResultsAnalyticsModule key="results_analytics" stats={examsData.stats} />}
              {activeTab === "grading_setup" && <GradingSetupModule key="grading_setup" scales={examsData.scales} />}
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

function NavItem({ icon, label, id, active, onClick }: any) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all text-right group",
        isActive
          ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
      )}
    >
      {React.cloneElement(icon, {
        className: cn(
          "w-4.5 h-4.5 shrink-0 transition-colors",
          isActive
            ? "text-indigo-600"
            : "text-slate-400 group-hover:text-indigo-500",
        ),
      })}
      <span>{label}</span>
      {isActive && (
        <ChevronRight className="w-4 h-4 mr-auto text-indigo-400" />
      )}
    </button>
  );
}

// ----------------------------------------------------
// Sub-Modules
// ----------------------------------------------------

function ProgressionModule({ students: apiStudents = [] }: { students?: any[] }) {
  const students = apiStudents && apiStudents.length > 0 ? apiStudents.map(s => ({
    id: s.studentNumber,
    name: s.user?.name || 'مجهول',
    curentClass: 'عام',
    status: s.status === 'ACTIVE' ? 'ناجح' : (s.status === 'GRADUATED' ? 'متخرج' : 'نجاح مشروط'),
    missing: 0,
    nextDefault: s.status === 'ACTIVE' ? 'المرحلة التالية' : 'خريج'
  })) : [
    { id: "S100", name: "أحمد الماجد", curentClass: "الأول الثانوي", status: "ناجح", missing: 0, nextDefault: "الثاني الثانوي (علمي)" },
    { id: "S101", name: "سعيد القحطاني", curentClass: "الأول الثانوي", status: "رسوب (مادتين)", missing: 2, nextDefault: "توصية إعادة" },
    { id: "S102", name: "عمر خالد", curentClass: "الأول الثانوي", status: "نجاح مشروط", missing: 1, nextDefault: "الثاني الثانوي (مشروط)" },
    { id: "S103", name: "ياسر الشمري", curentClass: "الثالث الثانوي", status: "متخرج", missing: 0, nextDefault: "خريج" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">ترحيل الطلاب والمسارات الأكاديمية (Progression Engine)</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">المعالجة الآلية لنهاية العام وتحديد المسار القادم لكل طالب بناءً على النتائج</p>
         </div>
         <div className="flex items-center gap-2">
            <select className="bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2 font-bold outline-none">
              <option>الأول الثانوي</option>
              <option>الثاني الثانوي</option>
            </select>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> تنفيذ الترحيل الدفعي (Batch Promote)
            </button>
         </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الطالب</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الصف الحالي</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">النتيجة النهائية</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">القرار الأكاديمي والتوجيه</th>
                <th className="px-6 py-4"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {students.map((student, idx) => (
               <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                     <p className="font-bold text-[14px] text-slate-900 mb-0.5">{student.name}</p>
                     <p className="text-[12px] font-mono font-bold text-slate-400">{student.id}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{student.curentClass}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold border whitespace-nowrap", 
                        student.status === "ناجح" || student.status === "متخرج" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        student.status.includes("رسوب") ? "bg-rose-50 text-rose-700 border-rose-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                     )}>{student.status}</span>
                  </td>
                  <td className="px-6 py-4">
                      <select className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-[12px] font-bold text-slate-700 focus:outline-none focus:border-indigo-500" defaultValue={student.nextDefault}>
                         <option>الثاني الثانوي (علمي)</option>
                         <option>الثاني الثانوي (أدبي)</option>
                         <option>توصية إعادة</option>
                         <option>الثاني الثانوي (مشروط)</option>
                         <option>خريج</option>
                         <option>منسحب / نقل</option>
                      </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all shadow-sm">دليل الملف</button>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ResultEntryModule({ students: apiStudents = [] }: { students?: any[] }) {
  const students = apiStudents && apiStudents.length > 0 ? apiStudents.map((s, i) => {
    const total = ((i * 13) % 40) + 60; // 60-100 pseudo random score
    return {
      id: s.studentNumber,
      name: s.user?.name || 'مجهول',
      ca1: Math.floor(total * 0.2),
      ca2: Math.floor(total * 0.2),
      exam: Math.floor(total * 0.6),
      total,
      grade: total >= 90 ? "A+" : total >= 80 ? "B" : total >= 70 ? "C" : "D"
    };
  }) : [
    { id: "S100", name: "أحمد الماجد", ca1: 15, ca2: 12, exam: 60, total: 87, grade: "B+" },
    { id: "S101", name: "سعيد القحطاني", ca1: 18, ca2: 19, exam: 58, total: 95, grade: "A+" },
    { id: "S102", name: "فارس الشهري", ca1: 10, ca2: 8, exam: 40, total: 58, grade: "D" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display mb-2">رصد وتدقيق الدرجات (Spreadsheet Entry)</h3>
            <div className="flex gap-2">
               <span className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[12px] rounded">الصف: الثاني الثانوي</span>
               <span className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[12px] rounded">المادة: الفيزياء المتقدمة</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold shadow-sm shadow-emerald-600/10 hover:bg-emerald-100 transition-colors flex items-center gap-2">
               <UploadCloud className="w-4 h-4" /> استيراد Excel
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center">
               <Save className="w-4 h-4" /> حفظ وإرسال للاعتماد
            </button>
         </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[700px]">
             <thead className="bg-slate-50/50 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase sticky right-0 bg-slate-50/90 backdrop-blur">اسم الطالب</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center w-28 border-r border-slate-200">الأعمال الفصلية 1 (20)</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center w-28 border-r border-slate-200">الأعمال الفصلية 2 (20)</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center w-28 border-r border-slate-200">الاختبار النهائي (60)</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center w-28 border-r border-slate-200">المجموع (100)</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center w-24">التقدير</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {students.map((student, idx) => (
                 <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-slate-50/80 transition-colors border-l border-slate-100">
                       <p className="font-bold text-[14px] text-slate-900">{student.name}</p>
                       <p className="text-[11px] font-mono text-slate-400 font-bold mt-1">{student.id}</p>
                    </td>
                    <td className="px-6 py-2 text-center border-r border-slate-100">
                       <input type="number" defaultValue={student.ca1} className="w-full max-w-[4rem] mx-auto text-center border border-slate-300 rounded pb-1 pt-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[14px] font-bold font-mono" />
                    </td>
                    <td className="px-6 py-2 text-center border-r border-slate-100">
                       <input type="number" defaultValue={student.ca2} className="w-full max-w-[4rem] mx-auto text-center border border-slate-300 rounded pb-1 pt-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[14px] font-bold font-mono" />
                    </td>
                    <td className="px-6 py-2 text-center border-r border-slate-100">
                       <input type="number" defaultValue={student.exam} className="w-full max-w-[4rem] mx-auto text-center border border-slate-300 rounded pb-1 pt-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[14px] font-bold font-mono" />
                    </td>
                    <td className="px-6 py-4 text-center border-r border-slate-100 bg-slate-100">
                       <span className="font-mono font-bold text-[15px]">{student.total}</span>
                    </td>
                    <td className="px-6 py-4 text-center border-r border-slate-100">
                       <span className={cn("px-2 py-1 rounded text-[13px] font-bold", 
                          student.grade.includes("A") || student.grade === "B+" ? "bg-emerald-100 text-emerald-800" :
                          student.grade === "D" ? "bg-rose-100 text-rose-800" :
                          "bg-amber-100 text-amber-800"
                       )}>{student.grade}</span>
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

function ResultReviewModule({ periods = [] }: { periods?: any[] }) {
  const reviews = periods && periods.length > 0 ? periods.map(p => ({
    title: p.name,
    submittedBy: p.approvedBy || "النظام الآلي",
    date: p.createdAt ? p.createdAt.split('T')[0] : "",
    status: p.status === 'APPROVED' ? 'معتمد' : (p.status === 'ACTIVE' ? 'نشط للتعديل' : 'بانتظار الاعتماد')
  })) : [
    { title: "كشف درجات الفيزياء - الثاني الثانوي", submittedBy: "أ. محمد الخالدي", date: "2026-05-20", status: "بانتظار الاعتماد" },
    { title: "كشف درجات الأحياء - الأول الثانوي", submittedBy: "أ. سعد الحسن", date: "2026-05-19", status: "معتمد" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">مراجعة واعتماد النتائج الدورية</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">المصادقة الإدارية على نتائج المعلمين قبل النشر</p>
         </div>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">مستند التقييم</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">مقدم السجل</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">تاريخ الرفع</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الإجراء وحالة السجل</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {reviews.map((r, idx) => (
               <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{r.title}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-bold text-slate-600">{r.submittedBy}</td>
                  <td className="px-6 py-4 text-center font-mono text-[13px] font-bold text-slate-500">{r.date}</td>
                  <td className="px-6 py-4 text-center flex items-center justify-center gap-3">
                     <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold border", 
                        r.status === "معتمد" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                     )}>{r.status}</span>
                     {r.status !== "معتمد" && (
                       <button className="text-[12px] font-bold text-white bg-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded-md shadow-sm transition-all">مراجعة والتصديق</button>
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

function ReportTemplatesModule() {
  const [selectedTemplate, setSelectedTemplate] = useState('ministry');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [showLogo, setShowLogo] = useState(true);
  const [showQR, setShowQR] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [fontSize, setFontSize] = useState('medium');

  const templates = [
    { id: 'ministry', name: 'القالب الوزاري العام', desc: 'تنسيق رسمي معتمد لمعظم المدارس والثانويات' },
    { id: 'kg_colored', name: 'قالب الروضة الملون', desc: 'مظهر ملون وتصميم يناسب الأطفال والشهادات التقديرية' },
    { id: 'appreciation', name: 'شهادة شكر وتقدير', desc: 'مخصصة للطلاب المتفوقين والأنشطة اللامنهجية' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 font-display">محرك تصميم الشهادات (Report Template Studio)</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">تخصيص وتصميم قوالب الشهادات والتقارير الأكاديمية</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2">
          <Save className="w-4 h-4" /> حفظ القالب الحالي
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side - Configuration controls */}
        <div className="xl:col-span-1 space-y-6">
          {/* Template Select */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">قالب البداية</h4>
            <div className="space-y-2">
              {templates.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    if(t.id === 'kg_colored') setPrimaryColor('#ec4899');
                    else if(t.id === 'appreciation') setPrimaryColor('#eab308');
                    else setPrimaryColor('#4f46e5');
                  }}
                  className={cn(
                    "p-3 rounded-xl border text-right cursor-pointer transition-colors",
                    selectedTemplate === t.id ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <span className="font-bold text-sm text-slate-800 block">{t.name}</span>
                  <span className="text-xs text-slate-500 font-medium mt-1 block">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Element toggles */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">عناصر التصميم</h4>
            
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">شعار المدرسة الرسمي</span>
              <input type="checkbox" checked={showLogo} onChange={e => setShowLogo(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">الرمز المربع للتحقق (QR Code)</span>
              <input type="checkbox" checked={showQR} onChange={e => setShowQR(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">التوقيع الإلكتروني والختم</span>
              <input type="checkbox" checked={showSignature} onChange={e => setShowSignature(e.target.checked)} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
            </div>

            <div className="h-px bg-slate-100 my-2"></div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">اللون الرئيسي للشهادة</label>
              <div className="flex gap-2.5">
                {['#4f46e5', '#3b82f6', '#10b981', '#ec4899', '#eab308', '#6366f1'].map(color => (
                  <button 
                    key={color} 
                    onClick={() => setPrimaryColor(color)}
                    style={{ backgroundColor: color }}
                    className={cn(
                      "w-7 h-7 rounded-full border-2",
                      primaryColor === color ? "border-slate-800 scale-110 shadow-sm" : "border-transparent"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[13px] font-semibold text-slate-700">حجم الخط</label>
              <select 
                value={fontSize} 
                onChange={e => setFontSize(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] rounded-lg px-3 py-2 font-bold outline-none"
              >
                <option value="small">صغير</option>
                <option value="medium">متوسط</option>
                <option value="large">كبير</option>
              </select>
            </div>
          </div>
        </div>

        {/* Center / Right Side - Interactive A4 Preview paper */}
        <div className="xl:col-span-2 flex justify-center">
          <div className="bg-slate-100 p-8 rounded-2xl w-full border border-slate-200 flex justify-center min-h-[600px] overflow-hidden">
            <div className="bg-white rounded shadow-2xl p-8 w-full max-w-[595px] min-h-[842px] border-8 flex flex-col justify-between text-right relative" style={{ borderColor: primaryColor }}>
              
              {/* Decorative corner borders */}
              <div className="absolute top-2 right-2 w-10 h-10 border-t-2 border-r-2" style={{ borderColor: primaryColor }}></div>
              <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2" style={{ borderColor: primaryColor }}></div>
              <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2" style={{ borderColor: primaryColor }}></div>
              <div className="absolute bottom-2 left-2 w-10 h-10 border-b-2 border-l-2" style={{ borderColor: primaryColor }}></div>

              {/* Certificate Header */}
              <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                <div className="text-right">
                  <h4 className="font-bold text-slate-700 text-sm">مؤسسة المدرسة الذكية الأهلية</h4>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold">ترخيص وزارة التعليم رقم ١٢/٣٤٥</p>
                </div>
                {showLogo && (
                  <div className="w-14 h-14 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-8 h-8" style={{ color: primaryColor }} />
                  </div>
                )}
              </div>

              {/* Title Content */}
              <div className="my-6 text-center space-y-4">
                <h2 className="text-xl font-bold tracking-tight" style={{ color: primaryColor }}>
                  {selectedTemplate === 'appreciation' ? 'شـهـادة شـكـر وتـقـديـر' : 'إشـعـار بـنـتـائـج الـطـالـب الأكـاديـمـيـة'}
                </h2>
                <p className="text-slate-500 text-xs font-semibold">للفصل الدراسي الثاني من العام ٢٠٢٦ / ٢٠٢٧</p>
              </div>

              {/* Student Metadata Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-2 gap-4 text-xs">
                <div><span className="text-slate-500 font-semibold ml-2">اسم الطالب:</span><span className="font-bold text-slate-800">أحمد الماجد</span></div>
                <div><span className="text-slate-500 font-semibold ml-2">الصف الدراسي:</span><span className="font-bold text-slate-800">الثاني الثانوي (علمي)</span></div>
                <div><span className="text-slate-500 font-semibold ml-2">الرقم الأكاديمي:</span><span className="font-bold text-slate-800">S100</span></div>
                <div><span className="text-slate-500 font-semibold ml-2">الترتيب في الصف:</span><span className="font-bold text-slate-800">الأول مكرر</span></div>
              </div>

              {/* Grades Table */}
              <div className="my-6 overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-right border-collapse text-[11px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 font-bold text-slate-700">المادة الدراسية</th>
                      <th className="px-4 py-2 font-bold text-slate-700 text-center">أعمال السنة</th>
                      <th className="px-4 py-2 font-bold text-slate-700 text-center">النهائي</th>
                      <th className="px-4 py-2 font-bold text-slate-700 text-center">المجموع</th>
                      <th className="px-4 py-2 font-bold text-slate-700 text-center">التقدير</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-2 font-bold text-slate-800">الرياضيات والمنطق المتقدم</td>
                      <td className="px-4 py-2 text-center font-semibold font-mono">٣٨</td>
                      <td className="px-4 py-2 text-center font-semibold font-mono">٥٨</td>
                      <td className="px-4 py-2 text-center font-bold font-mono">٩٦</td>
                      <td className="px-4 py-2 text-center font-bold text-emerald-600">A+</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-slate-800">الفيزياء التجريبية</td>
                      <td className="px-4 py-2 text-center font-semibold font-mono">٣٥</td>
                      <td className="px-4 py-2 text-center font-semibold font-mono">٥٥</td>
                      <td className="px-4 py-2 text-center font-bold font-mono">٩٠</td>
                      <td className="px-4 py-2 text-center font-bold text-emerald-600">A</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-slate-800">كيمياء المركبات العضوية</td>
                      <td className="px-4 py-2 text-center font-semibold font-mono">٣٦</td>
                      <td className="px-4 py-2 text-center font-semibold font-mono">٥٢</td>
                      <td className="px-4 py-2 text-center font-bold font-mono">٨٨</td>
                      <td className="px-4 py-2 text-center font-bold text-indigo-600">B+</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Row: Signatures and QR Code */}
              <div className="flex justify-between items-end border-t border-slate-200 pt-6 mt-auto">
                {showQR ? (
                  <div className="border border-slate-200 p-1.5 rounded bg-white w-16 h-16 flex items-center justify-center shadow-sm">
                    {/* Placeholder QR */}
                    <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-70">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className={cn("w-full h-full", (i*7) % 3 === 0 ? "bg-slate-800" : "bg-transparent")} />
                      ))}
                    </div>
                  </div>
                ) : <div />}

                {showSignature && (
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold mb-1">توقيع مدير المدرسة والختم الرسمي</p>
                    <div className="relative inline-block">
                      {/* Fake stamp */}
                      <div className="w-14 h-14 rounded-full border-2 border-indigo-600/30 absolute left-1/2 -translate-x-1/2 -top-4 flex items-center justify-center text-[7px] text-indigo-600/40 rotate-12 font-bold select-none leading-none pointer-events-none">
                        مدرسة نكسس الأهلية
                      </div>
                      <div className="w-24 h-6 border-b border-slate-300 font-mono text-[9px] text-slate-400 italic">عبد الرحمن السديري</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PrintingModule() {
  const prints = [
    { name: "شهادات نهاية العام (الثالث الثانوي)", target: "دفعة كاملة (142 طالب)", date: "2026-05-22", template: "القالب الوزاري المعتمد" },
    { name: "كشف علامات نصفي - الفصل الثاني", target: "شعبة الأول ب (30 طالب)", date: "2026-03-15", template: "قالب الإشعار النصفي" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">الطباعة الضخمة وإصدار الشهادات بطابور الطباعة</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">توليد شهادات مجمعة (PDF) وتصديرها للطابعات المحلية بضغطة زر</p>
         </div>
         <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold shadow-sm border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-2">
            <Printer className="w-4 h-4" /> طلب طباعة جديد
         </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">العملية / الموضوع</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">النطاق والعدد المستهدف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">تاريخ الطلب</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">القالب المستخدم</th>
                <th className="px-6 py-4"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {prints.map((p, idx) => (
               <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-center font-bold text-[13px] text-indigo-600 bg-indigo-50/30">{p.target}</td>
                  <td className="px-6 py-4 text-center font-mono text-[13px] font-bold text-slate-500">{p.date}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-bold text-slate-700">{p.template}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[12px] font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2 m-auto">
                       <Download className="w-4 h-4" /> تحميل الكشف الكامل
                    </button>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function AcademicHistoryModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">السجل الأكاديمي التراكمي (Longitudinal History)</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">مسار الطالب الأكاديمي الشامل منذ التسجيل وحتى التخرج</p>
         </div>
         <div className="relative w-64">
           <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
           <input type="text" placeholder="أدخل رقم الطالب أو اسمه..." className="w-full pl-4 pr-11 py-2 rounded-lg border border-slate-300 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700 shadow-sm" />
         </div>
      </div>

       <div className="bg-white p-12 border border-slate-200/80 rounded-2xl shadow-sm min-h-[400px]">
          <div className="max-w-2xl mx-auto border-r-2 border-indigo-100 pr-8 relative pb-8 space-y-10">
             {/* Timeline Node 1 */}
             <div className="relative">
                <div className="absolute w-4 h-4 bg-indigo-500 rounded-full right-[-39px] top-1 ring-4 ring-white shadow-sm" />
                <h4 className="text-lg font-bold text-slate-900 font-display tracking-tight">2026 - الثاني الثانوي (علمي) - معدل 94.5%</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">حالة الترحيل المعلقة: إتمام العام بامتياز وتم التمهيد للترحيل إلى الثالث الثانوي.</p>
                <div className="mt-3 flex gap-2">
                   <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-bold border border-slate-200">الترتيب: الثالث على الدفعة</span>
                   <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[11px] font-bold border border-indigo-100">تحميل كشف الدرجات للعام الحالي</span>
                </div>
             </div>
             {/* Timeline Node 2 */}
             <div className="relative">
                <div className="absolute w-4 h-4 bg-emerald-500 rounded-full right-[-39px] top-1 ring-4 ring-white shadow-sm" />
                <h4 className="text-lg font-bold text-slate-900 font-display tracking-tight">2025 - الأول الثانوي - معدل 92.1%</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">مسار علمي، قرار الإدارة: ناجح ومنقول للثاني الثانوي.</p>
                <button className="mt-3 px-3 py-1 text-[11px] font-bold bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors">مراجعة أرشيف السنة</button>
             </div>
             {/* Timeline Node 3 */}
             <div className="relative">
                <div className="absolute w-4 h-4 bg-emerald-500 rounded-full right-[-39px] top-1 ring-4 ring-white shadow-sm" />
                <h4 className="text-lg font-bold text-slate-900 font-display tracking-tight">2024 - الثالث المتوسط - معدل 89.0%</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">إتمام المرحلة المتوسطة. مسار الالتحاق بالثانوي معتمد.</p>
             </div>
          </div>
       </div>
    </motion.div>
  );
}

const analyticsData = [
  { name: 'الأول الثانوي', a: 120, b: 200, c: 50, fail: 15 },
  { name: 'الثاني الثانوي', a: 150, b: 250, c: 40, fail: 10 },
  { name: 'الثالث الثانوي', a: 210, b: 180, c: 30, fail: 5 },
];

function ResultsAnalyticsModule({ stats }: { stats?: any }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className="h-full flex items-center justify-center p-12 text-slate-400">جاري تحميل التحليلات...</div>;
  }

  const totalEntries = stats?.totalEntries || 0;
  const successRate = stats?.successRate || 92;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-[17px] font-bold text-slate-900 font-display mb-5">معدلات التقدير والتحصيل عبر المستويات</h3>
            <div className="h-[300px] w-full" dir="ltr">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={analyticsData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 'bold' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                   <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                   <Bar dataKey="a" name="ممتاز (A)" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                   <Bar dataKey="b" name="جيد جداً (B)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                   <Bar dataKey="c" name="تحت المتوسط (C+)" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                   <Bar dataKey="fail" name="تدخل أكاديمي (رسوب)" fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={20} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
         
         <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-[17px] font-bold text-slate-900 font-display mb-5">توزيع قرارات الترحيل الحالية (للمدرسة)</h3>
            <div className="h-[250px] w-full flex justify-center items-center" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={[{name: 'ناجح ومنقول', value: 85}, {name: 'إعادة السنة', value: 8}, {name: 'نجاح مشروط', value: 7}]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#10B981" />
                      <Cell fill="#F43F5E" />
                      <Cell fill="#F59E0B" />
                    </Pie>
                    <RechartsTooltip />
                  </RePieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-2">
               <div className="flex justify-between text-sm font-bold"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>ناجح ومنقول ضمنياً</span><span className="text-slate-600">85%</span></div>
               <div className="flex justify-between text-sm font-bold"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div>نجاح بقرار مشروط</span><span className="text-slate-600">7%</span></div>
               <div className="flex justify-between text-sm font-bold"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div>إعادة تسجيل (رسوب)</span><span className="text-slate-600">8%</span></div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function GradingSetupModule({ scales }: { scales?: any }) {
  const [ca1, setCa1] = useState(20);
  const [ca2, setCa2] = useState(20);
  const [finalExam, setFinalExam] = useState(60);
  const [minPass, setMinPass] = useState(50);
  const [maxConditional, setMaxConditional] = useState(2);
  const [earlyAlert, setEarlyAlert] = useState(true);

  const totalSum = ca1 + ca2 + finalExam;

  const gradingScales = [
    { grade: 'A+', minScore: '95', desc: 'ممتاز مرتفع' },
    { grade: 'A', minScore: '90', desc: 'ممتاز' },
    { grade: 'B+', minScore: '85', desc: 'جيد جداً مرتفع' },
    { grade: 'B', minScore: '80', desc: 'جيد جداً' },
    { grade: 'C+', minScore: '75', desc: 'جيد مرتفع' },
    { grade: 'C', minScore: '70', desc: 'جيد' },
    { grade: 'D', minScore: '60', desc: 'مقبول' },
    { grade: 'F', minScore: 'تحت 60', desc: 'ضعيف (رسوب)' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 font-display">إعدادات نظام التقييم (GPA Configs)</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">تهيئة أوزان الدرجات وقواعد النجاح والرسوب للعام الدراسي</p>
        </div>
        <button 
          disabled={totalSum !== 100}
          className={cn(
            "px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-sm transition-all flex items-center gap-2",
            totalSum === 100 ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer" : "bg-slate-400 cursor-not-allowed"
          )}
        >
          <Save className="w-4 h-4" /> حفظ الضوابط
        </button>
      </div>

      {totalSum !== 100 && (
        <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-4 flex items-center gap-3 text-rose-700 text-xs font-bold shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>تنبيه: مجموع أوزان التقييمات الحالية ({totalSum}%) لا يساوي ١٠٠٪. يجب ضبط القيم لتتطابق تماماً.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Weightings & thresholds */}
        <div className="space-y-6">
          {/* Assessment weights */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-500" /> توزيع أوزان التقييم
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>الأعمال الفصلية الأولى (CA1)</span>
                  <span className="font-mono text-indigo-600">{ca1}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" value={ca1} 
                  onChange={e => setCa1(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>الأعمال الفصلية الثانية (CA2)</span>
                  <span className="font-mono text-indigo-600">{ca2}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" value={ca2} 
                  onChange={e => setCa2(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>الاختبار النهائي (Final Exam)</span>
                  <span className="font-mono text-indigo-600">{finalExam}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" value={finalExam} 
                  onChange={e => setFinalExam(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>
            </div>
          </div>

          {/* Thresholds */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Filter className="w-4.5 h-4.5 text-indigo-500" /> ضوابط النجاح والترحيل
            </h4>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">درجة النجاح الصغرى للمادة (%)</label>
                <input 
                  type="number" value={minPass} onChange={e => setMinPass(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-sm rounded-lg px-4 py-2 font-mono font-bold outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">الحد الأقصى للمواد المتعثرة المسموح بترحيلها</label>
                <input 
                  type="number" value={maxConditional} onChange={e => setMaxConditional(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200/80 text-slate-700 text-sm rounded-lg px-4 py-2 font-mono font-bold outline-none" 
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" id="early-alert" checked={earlyAlert} onChange={e => setEarlyAlert(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                />
                <label htmlFor="early-alert" className="text-[13px] font-semibold text-slate-700">تفعيل نظام التنبيه المبكر لأولياء الأمور عند تدني التحصيل</label>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Grading scale */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-indigo-500" /> قواعد تقييم الحروف والمعدلات
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-bold text-slate-500">الحرف / التقدير</th>
                    <th className="px-4 py-2.5 text-xs font-bold text-slate-500 text-center">الحد الأدنى للنسبة</th>
                    <th className="px-4 py-2.5 text-xs font-bold text-slate-500">الوصف العام</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradingScales.map((scale, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-slate-800">{scale.grade}</td>
                      <td className="px-4 py-2.5 text-center font-mono font-bold text-indigo-600">{scale.minScore}%</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500 font-semibold">{scale.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
