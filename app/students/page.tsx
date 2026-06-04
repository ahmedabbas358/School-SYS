"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  Fingerprint,
  Activity,
  ChevronDown,
  MapPin,
  Phone,
  MessageSquare,
  Briefcase,
  FileText,
  ChevronRight,
  Save,
  UserPlus,
  Image as ImageIcon,
  FileBadge,
  Calendar,
  BookOpen,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

// Data definitions
const studentsList = [
  {
    id: "STU-1001",
    name: "أحمد طارق محمد",
    nId: "1098273645",
    grade: "الأول المتوسط",
    classroom: "1/أ",
    status: "نشط",
    gpa: "98%",
    attendance: "99%",
    risk: "low",
    tags: ["موهوب", "يتيم"],
  },
  {
    id: "STU-1002",
    name: "سارة خالد عبدالله",
    nId: "1098273646",
    grade: "الثاني المتوسط",
    classroom: "2/ب",
    status: "نشط",
    gpa: "95%",
    attendance: "97%",
    risk: "low",
    tags: [],
  },
  {
    id: "STU-1003",
    name: "عمر فهد العتيبي",
    nId: "1098273647",
    grade: "الثالث المتوسط",
    classroom: "3/أ",
    status: "إنذار",
    gpa: "75%",
    attendance: "82%",
    risk: "high",
    tags: ["متابعة سلوكية", "صعوبات تعلم"],
  },
  {
    id: "STU-1004",
    name: "فاطمة محمد السالم",
    nId: "1098273648",
    grade: "الأول الثانوي",
    classroom: "1/ج",
    status: "نشط",
    gpa: "99%",
    attendance: "100%",
    risk: "low",
    tags: ["المركز الأول"],
  },
  {
    id: "STU-1005",
    name: "عبدالرحمن الدوسري",
    nId: "1098273649",
    grade: "الثاني الثانوي",
    classroom: "2/أ",
    status: "إعادة",
    gpa: "60%",
    attendance: "70%",
    risk: "severe",
    tags: ["إعادة سنة"],
  },
  {
    id: "STU-1006",
    name: "ريم علي العمري",
    nId: "1098273650",
    grade: "الثالث الثانوي",
    classroom: "3/ب",
    status: "نشط",
    gpa: "88%",
    attendance: "95%",
    risk: "low",
    tags: [],
  },
  {
    id: "STU-1007",
    name: "خالد وليد الشمري",
    nId: "1098273651",
    grade: "الأول الابتدائي",
    classroom: "1/أ",
    status: "منسحب",
    gpa: "-",
    attendance: "-",
    risk: "none",
    tags: ["نقل دولي"],
  },
];

export default function StudentsPage() {
  const [currentModule, setCurrentModule] = useState<"profiles" | "admissions" | "transfers" | "lifecycle">("profiles");
  
  const [currentView, setCurrentView] = useState<"list" | "add" | "profile">("list");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleViewProfile = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView("profile");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            شؤون الطلاب
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            إدارة دورة حياة الطالب، القبول، النقل، والملفات الشاملة
          </p>
        </div>
      </div>

      {currentView === "list" && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-1.5 flex flex-wrap sm:flex-nowrap gap-1 w-full max-w-full overflow-x-auto custom-scrollbar">
           <TabButton 
             active={currentModule === "profiles"} 
             onClick={() => setCurrentModule("profiles")} 
             label="ملفات الطلاب" 
             icon={<Users className="w-4 h-4" />} 
           />
           <TabButton 
             active={currentModule === "admissions"} 
             onClick={() => setCurrentModule("admissions")} 
             label="طلبات القبول" 
             icon={<UserPlus className="w-4 h-4" />} 
           />
           <TabButton 
             active={currentModule === "transfers"} 
             onClick={() => setCurrentModule("transfers")} 
             label="النقل والترقية" 
             icon={<MapPin className="w-4 h-4" />} 
           />
           <TabButton 
             active={currentModule === "lifecycle"} 
             onClick={() => setCurrentModule("lifecycle")} 
             label="دورة حياة الطالب" 
             icon={<Activity className="w-4 h-4" />} 
           />
        </div>
      )}

      {currentView === "list" && currentModule === "profiles" && (
        <StudentsList onAdd={() => setCurrentView("add")} onViewProfile={handleViewProfile} />
      )}
      {currentView === "list" && currentModule === "admissions" && (
        <AdmissionsModule />
      )}
      {currentView === "list" && currentModule === "transfers" && (
        <TransfersModule />
      )}
      {currentView === "list" && currentModule === "lifecycle" && (
        <LifecycleModule />
      )}

      {currentView === "add" && (
        <StudentForm onBack={() => setCurrentView("list")} />
      )}
      {currentView === "profile" && selectedStudentId && (
        <StudentProfile
          studentId={selectedStudentId}
          onBack={() => setCurrentView("list")}
        />
      )}
    </div>
  );
}

function StudentsList({
  onAdd,
  onViewProfile,
}: {
  onAdd: () => void;
  onViewProfile: (id: string) => void;
}) {
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetch('/api/students?limit=50');
        const res = await response.json();
        if (res.success && res.data) {
          setStudentsData(res.data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const displayStudents = studentsData.length > 0 ? studentsData.map(s => ({
    id: s.id,
    name: s.user?.name || "بدون اسم",
    nId: s.nationalId || "-",
    grade: s.enrollments?.[0]?.section?.grade?.name || "-",
    classroom: s.enrollments?.[0]?.section?.name || "-",
    status: s.status === "ACTIVE" ? "نشط" : s.status === "WITHDRAWN" ? "منسحب" : s.status === "SUSPENDED" ? "إنذار" : "غير نشط",
    gpa: "N/A",
    attendance: "N/A",
    risk: s.status === "ACTIVE" ? "low" : "high",
    tags: []
  })) : studentsList;

  const toggleSelectAll = () => {
    if (selectedStudents.length === displayStudents.length)
      setSelectedStudents([]);
    else setSelectedStudents(displayStudents.map((s) => s.id));
  };

  const toggleSelect = (id: string) => {
    if (selectedStudents.includes(id))
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    else setSelectedStudents([...selectedStudents, id]);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-wrap gap-3 w-full justify-end">
          <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Upload className="w-4 h-4" /> استيراد نور
          </button>
          <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> تصدير السجل
          </button>
          <button
            onClick={onAdd}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> تسجيل طالب جديد
          </button>
        </div>
      </div>

      {/* Advanced Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col p-2">
        <div className="flex flex-col md:flex-row gap-3 p-2">
          <div className="relative w-full md:w-[400px]">
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="البحث بالاسم، الهوية، أو السجل الأكاديمي..."
              className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
            />
          </div>

          <div className="flex-1 flex gap-3 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            <select className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors outline-none focus:ring-2 focus:ring-indigo-500/20 shrink-0 appearance-none min-w-[140px]">
              <option>المرحلة (الكل)</option>
              <optgroup label="المرحلة الابتدائية">
                <option>الابتدائية (الكل)</option>
                <option>الأول الابتدائي</option>
                <option>الثاني الابتدائي</option>
                <option>الثالث الابتدائي</option>
                <option>الرابع الابتدائي</option>
                <option>الخامس الابتدائي</option>
                <option>السادس الابتدائي</option>
              </optgroup>
              <optgroup label="المرحلة المتوسطة">
                <option>المتوسطة (الكل)</option>
                <option>الأول المتوسط</option>
                <option>الثاني المتوسط</option>
                <option>الثالث المتوسط</option>
              </optgroup>
              <optgroup label="المرحلة الثانوية">
                <option>الثانوية (الكل)</option>
                <option>الأول الثانوي</option>
                <option>الثاني الثانوي</option>
                <option>الثالث الثانوي</option>
              </optgroup>
            </select>
            <select className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors outline-none focus:ring-2 focus:ring-indigo-500/20 shrink-0 appearance-none min-w-[140px]">
              <option>الحالة (الكل)</option>
              <option>نشط</option>
              <option>منسحب</option>
              <option>منقطع</option>
              <option>إنذار مبكر</option>
            </select>
            <button className="px-4 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4" /> فلاتر متقدمة
            </button>
          </div>
        </div>

        {/* Bulk Actions Context Bar (Visible only when items selected) */}
        <AnimatePresence>
          {selectedStudents.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 mx-2 mb-2 p-3 bg-indigo-600 rounded-lg flex items-center justify-between text-white shadow-inner">
                <span className="font-bold text-sm bg-white/20 px-3 py-1 rounded-md">
                  تم تحديد ({selectedStudents.length}) طالب
                </span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> رسالة للآباء
                  </button>
                  <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> طباعة الشهادات
                  </button>
                  <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> نقل لشعبة
                  </button>
                  <button className="px-3 py-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded text-xs font-bold whitespace-nowrap transition-colors border border-rose-400">
                    إجراء تأديبي
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Complex Main Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-right shrink-0 border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-4 w-12 sticky right-0 bg-slate-50/50 z-10 before:absolute before:inset-0 before:border-b before:border-slate-200/80">
                  <input
                    type="checkbox"
                    checked={
                      selectedStudents.length === displayStudents.length &&
                      displayStudents.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider sticky right-12 bg-slate-50/50 z-10 before:absolute before:inset-0 before:border-b before:border-slate-200/80">
                  معلومات الطالب
                </th>
                <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                  الرقم والهوية
                </th>
                <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                  التسجيل الأكاديمي
                </th>
                <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                  مؤشرات الأداء
                </th>
                <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                  علامات خاصة
                </th>
                <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500 font-bold">
                    جاري تحميل البيانات من قاعدة البيانات...
                  </td>
                </tr>
              ) : displayStudents.map((student) => (
                <tr
                  key={student.id}
                  className={cn(
                    "hover:bg-slate-50/80 transition-colors group cursor-pointer",
                    selectedStudents.includes(student.id)
                      ? "bg-blue-50/40"
                      : "",
                  )}
                  onClick={(e) => {
                    // Prevent navigation if clicking on checkbox or actions button
                    if (
                      (e.target as HTMLElement).closest(".row-actions") ||
                      (e.target as HTMLElement).closest(".row-checkbox")
                    )
                      return;
                    onViewProfile(student.id);
                  }}
                >
                  <td className="px-5 py-4 sticky right-0 bg-white group-hover:bg-slate-50/80 z-10 row-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleSelect(student.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-4 sticky right-12 bg-white group-hover:bg-slate-50/80 z-10 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[14px] font-bold text-slate-800 block truncate">
                          {student.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <StatusBadge status={student.status} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-[13px] font-mono text-slate-600 font-bold bg-slate-50 px-2 py-1 rounded-md w-max border border-slate-100">
                      <Fingerprint className="w-3.5 h-3.5 text-slate-400" />{" "}
                      {student.nId}
                    </div>
                    <div className="text-[12px] text-slate-400 font-mono mt-1 pr-1 font-semibold">
                      {student.id}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-[13px] font-bold text-slate-800 block">
                      {student.grade}
                    </span>
                    <span className="text-[12px] font-semibold text-slate-500 flex items-center gap-1 mt-1">
                      الشعبة:{" "}
                      <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                        {student.classroom}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <span
                        className={cn(
                          "text-[13px] font-bold px-2.5 py-0.5 rounded-md border",
                          student.risk === "high" || student.risk === "severe"
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100",
                        )}
                      >
                        {student.gpa}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        معدل / حضور ({student.attendance})
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5 justify-center max-w-[140px] mx-auto">
                      {student.tags.length > 0 ? (
                        student.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-bold px-2 py-0.5 rounded border border-slate-200/80 bg-white text-slate-600 block w-max shadow-sm"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-300 text-[12px] font-semibold">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap relative row-actions">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === student.id ? null : student.id,
                        )
                      }
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Action Dropdown */}
                    <AnimatePresence>
                      {activeMenu === student.id && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveMenu(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute left-6 top-10 bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-xl z-30 w-48 py-1.5 overflow-hidden"
                          >
                            <button
                              onClick={() => onViewProfile(student.id)}
                              className="w-full text-right px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                            >
                              <Activity className="w-4 h-4 text-slate-400" />{" "}
                              عرض الملف الشامل
                            </button>
                            <button className="w-full text-right px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors">
                              <FileText className="w-4 h-4 text-slate-400" />{" "}
                              طباعة كشف الدرجات
                            </button>
                            <div className="h-px bg-slate-100 my-1.5 ml-4" />
                            <button className="w-full text-right px-4 py-2 text-[13px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors">
                              <AlertCircle className="w-4 h-4 text-rose-500" />{" "}
                              إصدار إنذار / تحذير
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Advanced Pagination */}
        <div className="px-5 py-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[13px] font-medium text-slate-500">
            عرض <span className="font-bold text-slate-900">1</span> إلى{" "}
            <span className="font-bold text-slate-900">7</span> من إجمالي{" "}
            <span className="font-bold text-slate-900">1,248</span> طالب
          </div>
          <div className="flex gap-1.5">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm">
              السابق
            </button>
            <button className="w-8 py-1.5 rounded-lg bg-blue-600 text-white text-[13px] font-bold shadow-md shadow-blue-600/20">
              1
            </button>
            <button className="w-8 py-1.5 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="w-8 py-1.5 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm">
              التالي
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StudentForm({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            إضافة طالب جديد
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            تسجيل دورة حياة الطالب في النظام وبناء السجل الأكاديمي
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-8">
        {/* Section 1 */}
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-indigo-600" /> البيانات الشخصية
            الأساسية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-100 pt-5">
            <div className="md:col-span-3 lg:col-span-1 shrink-0">
              <label className="text-sm font-bold text-slate-700 block mb-2">
                صورة الطالب الشخصية
              </label>
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center hover:bg-slate-100 hover:border-indigo-400 transition-colors cursor-pointer group">
                <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-500 group-hover:text-indigo-600">
                  اختيار صورة
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:col-span-3 lg:col-span-2">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  الاسم الكامل (رباعي)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
                  placeholder="الاسم كما في الهوية..."
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  رقم الهوية / الإقامة
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
                  placeholder="10xxxxxxxx"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  الجنس
                </label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900">
                  <option>ذكر</option>
                  <option>أنثى</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  الجنسية
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
                  placeholder="سعودي..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-indigo-600" /> البيانات
            الأكاديمية
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-slate-100 pt-5">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                المرحلة والصف الدراسى
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900">
                <optgroup label="المرحلة الابتدائية">
                  <option>الصف الأول الابتدائي</option>
                  <option>الصف الثاني الابتدائي</option>
                  <option>الصف الثالث الابتدائي</option>
                  <option>الصف الرابع الابتدائي</option>
                  <option>الصف الخامس الابتدائي</option>
                  <option>الصف السادس الابتدائي</option>
                </optgroup>
                <optgroup label="المرحلة المتوسطة">
                  <option>الصف الأول المتوسط</option>
                  <option>الصف الثاني المتوسط</option>
                  <option>الصف الثالث المتوسط</option>
                </optgroup>
                <optgroup label="المرحلة الثانوية">
                  <option>الصف الأول الثانوي</option>
                  <option>الصف الثاني الثانوي</option>
                  <option>الصف الثالث الثانوي</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                الفصل / الشعبة
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900">
                <option>1/أ</option>
                <option>1/ب</option>
                <option>1/ج</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                الرقم الأكاديمي
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-sm focus:outline-none font-medium text-slate-500 cursor-not-allowed"
                value="STU-1008"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" /> بيانات ولي الأمر
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                اسم ولي الأمر
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                صلة القرابة
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900">
                <option>أب</option>
                <option>أم</option>
                <option>وصي قانوني</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                رقم الهاتف للتواصل
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
                placeholder="05xxxxxxxx"
                dir="ltr"
                style={{ textAlign: "right" }}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                العنوان السكني
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-100 pt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            إلغاء الأمر
          </button>
          <button className="px-5 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 justify-center">
            <Plus className="w-4 h-4" /> حفظ وإضافة المزيد
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-2 justify-center">
            <Save className="w-4 h-4" /> حفظ واعتماد الطالب
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentProfile({
  studentId,
  onBack,
}: {
  studentId: string;
  onBack: () => void;
}) {
  const student =
    studentsList.find((s) => s.id === studentId) || studentsList[0];
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5" /> العودة للقائمة
        </button>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-1.5">
            <FileBadge className="w-3.5 h-3.5" /> طباعة الملف
          </button>
          <button className="px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-md text-xs font-bold text-rose-700 hover:bg-rose-100 shadow-sm flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> إنذار
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-0" />

        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center font-bold text-4xl text-slate-400 shrink-0 z-10">
          {student.name.charAt(0)}
        </div>

        <div className="text-center md:text-right flex-1 z-10 pt-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-display text-slate-900">
              {student.name}
            </h1>
            <StatusBadge status={student.status} />
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-slate-400" /> {student.nId}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" /> {student.grade} -{" "}
              {student.classroom}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" /> الرقم الأكاديمي:{" "}
              <span className="text-slate-800 font-mono">{student.id}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 z-10">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">
              معدل الحضور
            </p>
            <p className="text-2xl font-bold text-emerald-700 font-mono">
              {student.attendance}
            </p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
            <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">
              المعدل التراكمي
            </p>
            <p className="text-2xl font-bold text-indigo-700 font-mono">
              {student.gpa}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
        <div className="flex items-center gap-1 border-b border-slate-100 px-2 py-2 overflow-x-auto custom-scrollbar">
          <TabButton
            active={activeTab === "personal"}
            onClick={() => setActiveTab("personal")}
            label="البيانات الشخصية"
            icon={<Users className="w-4 h-4" />}
          />
          <TabButton
            active={activeTab === "academic"}
            onClick={() => setActiveTab("academic")}
            label="المعلومات الأكاديمية"
            icon={<BookOpen className="w-4 h-4" />}
          />
          <TabButton
            active={activeTab === "finance"}
            onClick={() => setActiveTab("finance")}
            label="المعلومات المالية"
            icon={<Briefcase className="w-4 h-4" />}
          />
          <TabButton
            active={activeTab === "health"}
            onClick={() => setActiveTab("health")}
            label="السجل الصحي والسلوكي"
            icon={<Activity className="w-4 h-4" />}
          />
          <TabButton
            active={activeTab === "docs"}
            onClick={() => setActiveTab("docs")}
            label="المستندات"
            icon={<FileText className="w-4 h-4" />}
          />
        </div>

        <div className="p-6">
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                  معلومات التواصل
                </h3>
                <div className="space-y-4">
                  <InfoRow label="ولي الأمر" value="طارق محمد عبدلله (أب)" />
                  <InfoRow label="رقم الهاتف" value="0501234567" dir="ltr" />
                  <InfoRow
                    label="البريد الإلكتروني"
                    value="tariq.m@example.com"
                    dir="ltr"
                  />
                  <InfoRow
                    label="العنوان"
                    value="الرياض، حي العليا، شارع التحلية، مبنى 45"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                  سجل النظام
                </h3>
                <div className="space-y-4">
                  <InfoRow label="تاريخ القبول" value="2023-08-15" />
                  <InfoRow label="رقم التسجيل المركزي" value="REG-249018" />
                  <InfoRow label="المسار المخصص" value="عام" />
                  <InfoRow
                    label="ملاحظات صحية"
                    value="لا توجد بيانات صحية مسجلة"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-12 h-12 text-indigo-100 mx-auto mb-4" />
              <p className="font-bold text-slate-700">المعلومات الأكاديمية</p>
              <p className="text-sm mt-1">الصف الحالي، الشعبة، وتاريخ السجل الأكاديمي.</p>
            </div>
          )}
          {activeTab === "finance" && (
            <div className="text-center py-12 text-slate-500">
              <Briefcase className="w-12 h-12 text-indigo-100 mx-auto mb-4" />
              <p className="font-bold text-slate-700">المعلومات المالية</p>
              <p className="text-sm mt-1">الرصيد، الفواتير، وحالة الدفع.</p>
            </div>
          )}
          {activeTab === "health" && (
            <div className="text-center py-12 text-slate-500">
              <Activity className="w-12 h-12 text-indigo-100 mx-auto mb-4" />
              <p className="font-bold text-slate-700">السجل الصحي والسلوكي</p>
              <p className="text-sm mt-1">المخالفات، الجوائز، والبيانات الصحية.</p>
            </div>
          )}
          {activeTab === "docs" && (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 text-indigo-100 mx-auto mb-4" />
              <p className="font-bold text-slate-700">المستندات الخاصة بالطالب</p>
              <p className="text-sm mt-1">بطاقات، ملفات مصدقة، وتقارير.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-2 flex-1 justify-center sm:flex-none",
        active
          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
      )}
    >
      {icon} {label}
    </button>
  );
}

function InfoRow({
  label,
  value,
  dir = "rtl",
}: {
  label: string;
  value: string;
  dir?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1">
      <span className="text-sm font-semibold text-slate-500 w-1/3">
        {label}
      </span>
      <span className="text-sm font-bold text-slate-900 w-2/3" dir={dir}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "نشط") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/80 shadow-sm tracking-wider">
        نشط
      </span>
    );
  }
  if (status === "إنذار") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase font-bold bg-amber-50 text-amber-700 border border-amber-100/80 shadow-sm tracking-wider">
        إنذار سلوكي/أكاديمي
      </span>
    );
  }
  if (status === "إعادة") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase font-bold bg-rose-50 text-rose-700 border border-rose-100/80 shadow-sm tracking-wider">
        إعادة سنة
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase font-bold bg-slate-50 text-slate-600 border border-slate-200/80 shadow-sm tracking-wider">
      {status}
    </span>
  );
}

function AdmissionsModule() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  return (
    <div className="space-y-5">
       <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="البحث بالاسم، القهوية..." className="w-full pl-3 pr-11 py-2.5 rounded-lg border border-slate-200/80 bg-white font-medium text-[13px] text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400" />
            </div>
            <select className="px-4 py-2 bg-white border border-slate-200/80 rounded-lg text-[13px] font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-w-[140px]">
               <option>الكل (جديدة)</option>
               <option>قيد المراجعة</option>
               <option>مقبول</option>
            </select>
          </div>
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shadow-inner shrink-0 items-center h-full">
            <button onClick={() => setViewMode("table")} className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-all h-full", viewMode === "table" ? "bg-white text-blue-700 shadow shadow-black/5" : "text-slate-500 hover:text-slate-700")}>جدول</button>
            <button onClick={() => setViewMode("cards")} className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-all h-full", viewMode === "cards" ? "bg-white text-blue-700 shadow shadow-black/5" : "text-slate-500 hover:text-slate-700")}>بطاقات</button>
          </div>
       </div>

       {viewMode === "cards" ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-blue-200 transition-all relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-400 group-hover:bg-amber-500 transition-colors"></div>
                 <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3.5">
                       <div className="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center font-bold text-slate-500 border border-slate-200/80 shadow-sm">م</div>
                       <div>
                         <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-blue-700 transition-colors">محمد عبدالله راشد</h4>
                         <p className="text-[12px] font-semibold text-slate-500 mt-0.5">طالب جديد • الأول المتوسط</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-2.5 mb-5 bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                    <div className="flex justify-between text-[12px] font-bold"><span className="text-slate-500">تاريخ التقديم</span><span className="text-slate-800">12 مايو 2026</span></div>
                    <div className="flex justify-between text-[12px] font-bold"><span className="text-slate-500">أولوية الملف</span><span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">تحت المراجعة</span></div>
                 </div>
                 <div className="flex gap-2 mx-auto">
                    <button className="flex-1 py-2 bg-white text-slate-700 font-bold text-[12px] rounded-lg hover:bg-slate-50 transition-colors border border-slate-200/80 shadow-sm">التفاصيل</button>
                    <button className="flex-1 py-2 bg-blue-600 text-white font-bold text-[12px] rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">اعتماد القبول</button>
                 </div>
              </div>
            ))}
         </div>
       ) : (
         <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden p-12 text-center text-slate-400 text-sm font-bold flex flex-col items-center justify-center min-h-[300px]">
            <Search className="w-10 h-10 text-slate-200 mb-3" />
            وضعية الجدول غير متوفرة لهذه البيانات حالياً.
         </div>
       )}
    </div>
  )
}

function TransfersModule() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span> اختيار الطلبة
         </h3>
         <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 block">حدد طالباً أو مجموعة للترقية أو النقل:</label>
            <input type="text" placeholder="ابحث باسم الطالب..." className="w-full border border-slate-200 rounded-lg px-4 py-2 font-medium" />
         </div>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-50 pointer-events-none">
         <h3 className="font-bold text-lg text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm">2</span> نوع العملية
         </h3>
       </div>
    </div>
  )
}

function LifecycleModule() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex flex-col items-center text-center">
       <Activity className="w-16 h-16 text-indigo-200 mb-4" />
       <h3 className="text-xl font-bold text-slate-800 mb-2">دورة حياة الطالب (Lifecycle)</h3>
       <p className="text-slate-500 max-w-md mx-auto text-sm">
         مخطط حالة دورة الحياة والمراقبة الزمنية لجميع انتقالات الطلاب عبر النظام يظهر هنا.
       </p>
    </div>
  )
}
