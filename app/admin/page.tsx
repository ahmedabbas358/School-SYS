"use client";

import React, { useState } from "react";
import {
  Building2,
  Globe,
  ShieldCheck,
  Network,
  History,
  Save,
  Plus,
  Lock,
  CheckCircle2,
  Workflow,
  Settings,
  Filter,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type AdminTab = "profile" | "academic" | "rbac" | "workflows" | "audit" | "tools";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("rbac");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-50 p-3.5 rounded-xl text-indigo-600 border border-indigo-200/50 shadow-sm shadow-indigo-100">
             <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
              الإدارة المركزية وإعدادات النظام
            </h1>
            <p className="text-slate-500 text-[13px] mt-1 font-medium leading-relaxed max-w-2xl">
              إعدادات متقدمة للهيكل التنظيمي، الصلاحيات الدقيقة، ومحركات سير العمل
              (Workflows)
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-[13px] font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20 flex items-center gap-2 border border-transparent">
            <Save className="w-4 h-4" />
            حفظ واستيعاب التغييرات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Advanced Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                وحدات التحكم
              </h3>
            </div>
            <div className="p-3 space-y-1">
              <NavButton
                icon={<Building2 />}
                label="بيانات المؤسسة ومحددات الهوية"
                isActive={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavButton
                icon={<Globe />}
                label="الهيكل التربوي والتقويم"
                isActive={activeTab === "academic"}
                onClick={() => setActiveTab("academic")}
              />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavButton
                icon={<ShieldCheck />}
                label="إدارة الصلاحيات والأدوار (RBAC)"
                isActive={activeTab === "rbac"}
                onClick={() => setActiveTab("rbac")}
              />
              <NavButton
                icon={<Network />}
                label="محرك سير العمل (Workflows)"
                isActive={activeTab === "workflows"}
                onClick={() => setActiveTab("workflows")}
              />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavButton
                icon={<History />}
                label="سجل التدقيق (Audit Log)"
                isActive={activeTab === "audit"}
                onClick={() => setActiveTab("audit")}
              />
              <NavButton
                icon={<Settings />}
                label="أدوات المطور والطوارئ"
                isActive={activeTab === "tools"}
                onClick={() => setActiveTab("tools")}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-4 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "rbac" && <RbacModule key="rbac" />}
            {activeTab === "workflows" && <WorkflowModule key="workflows" />}
            {activeTab === "profile" && (
              <ProfileModule key="profile" />
            )}
            {activeTab === "academic" && (
              <AcademicModule key="academic" />
            )}
            {activeTab === "audit" && <AuditModule key="audit" />}
            {activeTab === "tools" && <ToolsModule key="tools" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all text-right group content-start",
        isActive
          ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500") })}
      <span className="leading-snug">{label}</span>
    </button>
  );
}

function RbacModule() {
  const [activeView, setActiveView] = useState('matrix'); // 'roles' | 'matrix' | 'users'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 font-display">
            إدارة الأدوار والصلاحيات الدقيقة (RBAC)
          </h3>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            تحكم كامل في مصفوفة الصلاحيات لكل دور على مستوى الوحدة، الشاشة، الحقل، والسجل.
          </p>
        </div>
        <div className="flex bg-slate-50/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto hide-scrollbar snap-x shadow-inner">
           <button onClick={() => setActiveView('roles')} className={cn("px-4 py-2 rounded-lg text-[13px] font-bold transition-all text-center whitespace-nowrap snap-start", activeView === 'roles' ? "bg-white text-indigo-700 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50")}>إدارة الأدوار</button>
           <button onClick={() => setActiveView('matrix')} className={cn("px-4 py-2 rounded-lg text-[13px] font-bold transition-all text-center whitespace-nowrap snap-start", activeView === 'matrix' ? "bg-white text-indigo-700 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50")}>مصفوفة الصلاحيات</button>
           <button onClick={() => setActiveView('users')} className={cn("px-4 py-2 rounded-lg text-[13px] font-bold transition-all text-center whitespace-nowrap snap-start", activeView === 'users' ? "bg-white text-indigo-700 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50")}>تعيين للمستخدمين</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'roles' && <RbacRolesView key="roles" />}
        {activeView === 'matrix' && <RbacMatrixView key="matrix" />}
        {activeView === 'users' && <RbacUsersView key="users" />}
      </AnimatePresence>
    </motion.div>
  );
}

function RbacRolesView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
       <div className="flex justify-end">
           <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-[13px] font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20 flex items-center gap-2 border border-transparent">
             <Plus className="w-4 h-4" /> اضافة دور مخصص
           </button>
       </div>
       <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-x-auto">
          <table className="w-full text-right shrink-0 border-collapse min-w-[600px]">
             <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/80">
                 <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 w-1/4">اسم الدور</th>
                 <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 w-2/4">الوصف</th>
                 <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 text-center w-1/6">عدد المستخدمين</th>
                 <th className="px-5 py-4 text-[13px] font-semibold text-slate-500 text-center">إجراءات</th>
               </tr>
             </thead>
             <tbody>
                {[
                  { name: 'مدير النظام (Super Admin)', desc: 'صلاحيات مطلقة للتحكم بكافة إعدادات النظام والصلاحيات', count: 2 },
                  { name: 'مدير المدرسة', desc: 'صلاحيات قراءة شاملة واعتماد مالي وأكاديمي', count: 1 },
                  { name: 'نائب أكاديمي', desc: 'إدارة الهيكل الأكاديمي والجدول وتقييم المعلمين', count: 3 },
                  { name: 'شؤون الطلاب', desc: 'إدارة طلبات القبول وملفات الطلاب ودورة حياتهم', count: 5 },
                  { name: 'محاسب', desc: 'إدارة الرسوم، الفواتير، المتأخرات ورواتب الموظفين', count: 2 },
                  { name: 'معلم', desc: 'إدارة الغياب والدرجات لطلابه فقط، وعرض جدوله', count: 85 },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                     <td className="px-5 py-4 text-[14px] font-bold text-slate-900">{r.name}</td>
                     <td className="px-5 py-4 text-[13px] font-medium text-slate-500 leading-relaxed">{r.desc}</td>
                     <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 border border-indigo-200/50 font-mono font-bold text-[12px] rounded-md px-3 py-1 shadow-sm">{r.count}</span>
                     </td>
                     <td className="px-5 py-4 text-center">
                        <button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-4 py-2 rounded-lg transition-colors mx-1 shadow-sm">تعديل الصلاحيات</button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </motion.div>
  );
}

function RbacMatrixView() {
  const roles = ["مدير المدرسة", "نائب أكاديمي", "شؤون الطلاب", "محاسب", "معلم"];
  const modules = [
    {
      name: "شؤون الطلاب - ملف الطالب",
      permissions: ["VIEW", "CREATE", "EDIT", "DELETE", "EXPORT", "AUDIT"],
    },
    {
      name: "الجدول الدراسي",
      permissions: ["VIEW", "EDIT (تعديل الجدول)", "APPROVE"],
    },
  ];

  return (
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="bg-indigo-50/80 text-indigo-800 p-5 rounded-2xl text-[13px] font-semibold flex items-start gap-4 border border-indigo-100 mb-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
         <div>
            <p className="mb-1 leading-relaxed">نظام الصلاحيات الدقيقة يدعم تقييد الحقول (Field-Level) وتقييد السجلات (Record-Level) لحماية قصوى.</p>
            <p className="text-[12px] opacity-80 mt-1 font-medium">يمكنك النقر على أيقونة الترس بجانب الوحدة لتخصيص الحقول (مثل إخفاء &quot;الرصيد المالي&quot; عن بعض الإدارات).</p>
         </div>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right shrink-0 border-collapse min-w-full md:min-w-[800px]">
            <thead>
              <tr>
                <th className="px-5 py-5 bg-slate-50/50 border-b border-slate-200/80 text-[13px] font-bold text-slate-700 min-w-[130px] md:min-w-[250px] border-l sticky right-0 z-10 w-[130px] md:w-[250px]">
                  الوحدة / الإجراء
                </th>
                {roles.map((role) => (
                  <th
                    key={role}
                    className="px-5 py-5 bg-slate-50/50 border-b border-slate-200/80 text-[12px] font-bold text-slate-700 text-center min-w-[120px]"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, i) => (
                <React.Fragment key={mod.name}>
                  <tr>
                    <td
                      colSpan={roles.length + 1}
                      className="bg-slate-100/50 px-5 py-3 text-[12px] font-bold text-slate-600 uppercase tracking-wider border-y border-slate-200/80 sticky right-0 left-auto shadow-inner"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-fit">
                        <span>وحدة: <span className="font-extrabold">{mod.name}</span></span>
                        <div className="flex flex-wrap gap-2">
                          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 shadow-sm transition-colors">
                             <Settings className="w-3.5 h-3.5" /> تقييد الحقول
                          </button>
                          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 shadow-sm transition-colors">
                             <Filter className="w-3.5 h-3.5" /> تقييد السجلات
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {mod.permissions.map((perm) => (
                    <tr
                      key={perm}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-5 py-4 border-b border-slate-100 border-l sticky right-0 bg-white z-10 w-[130px] md:w-[250px]">
                        <div className="flex items-center gap-2.5 text-[12px] font-semibold text-slate-600">
                          <Lock className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
                          <span className="truncate">{perm}</span>
                        </div>
                      </td>
                      {roles.map((role, idx) => {
                        const hasPerm =
                          idx === 0 ||
                          (idx === 2 && mod.name.includes("الطلاب")) ||
                          (idx === 1 && mod.name.includes("الجدول")) ||
                          (idx === 4 && perm === "VIEW") ||
                          (idx === 3 && perm === "VIEW" && mod.name.includes("الطلاب"));
                        return (
                          <td
                            key={role}
                            className="px-5 py-4 border-b border-slate-100 text-center"
                          >
                            <button
                              className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-colors shadow-sm",
                                hasPerm
                                  ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200/50"
                                  : "bg-slate-50 text-slate-200 hover:bg-slate-100 hover:text-slate-400 border border-slate-200/50",
                              )}
                            >
                              {hasPerm && <CheckCircle2 className="w-4.5 h-4.5" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     </motion.div>
  );
}

function RbacUsersView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 text-center text-slate-500 bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col justify-center items-center">
       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 border border-slate-200/60 shadow-inner">
         <Users className="w-10 h-10" />
       </div>
       <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">تعيين الأدوار للمستخدمين</h3>
       <p className="text-[13px] max-w-lg mx-auto font-medium leading-relaxed">تتيح هذه الواجهة من ربط الموظفين بأدوارهم، ودعم التفويض المؤقت (DELEGATE) أو تخطي الموافقات (BYPASS) للضرورة القصوى.</p>
    </motion.div>
  );
}

function WorkflowModule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden border border-indigo-500">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2 font-display">
            محرك سير العمل التلقائي (Workflow Engine)
          </h3>
          <p className="text-indigo-100 text-[14px] max-w-2xl leading-relaxed font-medium">
            قم ببناء مسارات الموافقات، التفويضات، والاستثناءات بشكل مرئي للتحكم
            الكامل في الدورة المستندية لأي إجراء في النظام.
          </p>
        </div>
        <Workflow className="w-40 h-40 absolute top-1/2 -translate-y-1/2 left-0 text-white opacity-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-indigo-300 transition-all group flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <h4 className="font-bold text-slate-900 text-[15px]">
            اعتماد خصم استثنائي (رسوم دراسية)
          </h4>
          <p className="text-[12px] font-medium text-slate-500 mt-1.5 mb-6 leading-relaxed">
            مسار الموافقة عند تجاوز خصم الرسوم الحد المسموح للمحاسب بنسبة (10%).
          </p>
          <div className="mt-auto space-y-2.5">
            <div className="flex items-center gap-3 text-[12px] font-bold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
              <span className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                1
              </span>
              شؤون الطلاب <span className="opacity-60">(إنشاء الطلب)</span>
            </div>
            <div className="w-0.5 h-4 bg-slate-200 mx-7" />
            <div className="flex items-center gap-3 text-[12px] font-bold text-indigo-700 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                2
              </span>
              المدير المالي <span className="opacity-60">(مراجعة مالية)</span>
            </div>
            <div className="w-0.5 h-4 bg-slate-200 mx-7" />
            <div className="flex items-center gap-3 text-[12px] font-bold text-white bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 shadow-sm">
              <span className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                3
              </span>
              مدير المدرسة <span className="opacity-60">(اعتماد نهائي)</span>
            </div>
          </div>
          <div className="border-t border-slate-100 mt-5 pt-4 flex justify-between items-center">
             <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md text-[11px] font-bold border border-emerald-200/60 tracking-wider">مُفعّل</span>
            <button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors">
              تعديل المسار
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-indigo-300 transition-all group flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <h4 className="font-bold text-slate-900 text-[15px]">
            أمر ترقية طالب (تجاوز السن)
          </h4>
          <p className="text-[12px] font-medium text-slate-500 mt-1.5 mb-6 leading-relaxed">
            مسار معالجة ترقية طالب عندما يتجاوز السن القانوني للمرحلة بنظام
            الوزارة.
          </p>
          <div className="mt-auto space-y-2.5">
            <div className="flex items-center gap-3 text-[12px] font-bold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
              <span className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                1
              </span>
              شؤون الطلاب <span className="opacity-60">(رفع مسوغات)</span>
            </div>
            <div className="w-0.5 h-4 bg-slate-200 mx-7" />
            <div className="flex items-center gap-3 text-[12px] font-bold text-white bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 shadow-sm">
              <span className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                2
              </span>
              المرشد الطلابي + نائب أكاديمي
            </div>
          </div>
          <div className="border-t border-slate-100 mt-5 pt-4 flex justify-between items-center">
             <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md text-[11px] font-bold border border-emerald-200/60 tracking-wider">مُفعّل</span>
             <button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors">
              تعديل المسار
            </button>
          </div>
        </div>

        <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center min-h-[300px] text-slate-500 hover:text-indigo-600">
          <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold">إنشاء مسار سير عمل جديد</span>
          <span className="text-xs mt-2 text-center px-4">
            حدد الشروط، القواعد (Rules)، ومستويات الاعتماد بخصائص تفصيلية.
          </span>
        </button>
      </div>
    </motion.div>
  );
}

function AuditModule() {
  const logs = [
    { id: 'AL-9012', user: 'محمد صالح (محاسب)', action: 'UPDATE', target: 'فاتورة INV-0092', module: 'المالية', time: 'منذ 5 دقائق', ip: '192.168.1.45', changes: 'تعديل الخصم من 0% إلى 10%' },
    { id: 'AL-9011', user: 'أحمد محمود (شؤون طلاب)', action: 'DELETE', target: 'طالب (رقم 3091)', module: 'الطلاب', time: 'منذ 23 دقيقة', ip: '192.168.1.12', changes: 'حذف السجل نهائياً' },
    { id: 'AL-9010', user: 'سارة خالد (معلم)', action: 'CREATE', target: 'غياب يوم 2026-05-22', module: 'الأكاديمي', time: 'منذ 1 ساعة', ip: '192.168.1.88', changes: 'تسجيل غياب لـ 3 طلاب' },
    { id: 'AL-9009', user: 'SYSTEM (Auto)', action: 'BACKUP', target: 'Database', module: 'النظام', time: 'منذ 3 ساعات', ip: '127.0.0.1', changes: 'نجاح النسخ الاحتياطي الدوري' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 font-display">سجل التدقيق (Audit Logs)</h3>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">مراقبة وتسجيل جميع حركات وتعديلات المستخدمين على مساحة النظام للامتثال والحماية.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 border border-slate-200/80 bg-white rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
              <Filter className="w-4 h-4 text-slate-500" /> تصفية
           </button>
           <button className="px-5 py-2.5 border border-slate-200/80 bg-white rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
              <History className="w-4 h-4 text-slate-500" /> تصدير PDF/CSV
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right shrink-0 min-w-[800px] border-collapse">
             <thead className="bg-slate-50/50 border-b border-slate-200/80">
               <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider w-24">معرف السجل</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">المستخدم (IP)</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الإجراء والوحدة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider w-1/3">التفاصيل والتغييرات</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-left">الوقت</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100/80">
               {logs.map((log) => (
                 <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                   <td className="px-6 py-4 text-[12px] font-mono text-slate-500 font-medium">{log.id}</td>
                   <td className="px-6 py-4">
                     <p className="text-[14px] font-bold text-slate-900">{log.user}</p>
                     <p className="text-[12px] text-slate-500 font-mono mt-0.5">{log.ip}</p>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase border text-center min-w-[70px] shadow-sm",
                          log.action === 'UPDATE' && "bg-blue-50 text-blue-700 border-blue-200/60",
                          log.action === 'DELETE' && "bg-rose-50 text-rose-700 border-rose-200/60",
                          log.action === 'CREATE' && "bg-emerald-50 text-emerald-700 border-emerald-200/60",
                          log.action === 'BACKUP' && "bg-slate-50 text-slate-700 border-slate-200/60"
                        )}>{log.action}</span>
                        <span className="text-[13px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{log.module}</span>
                     </div>
                     <p className="text-[13px] font-semibold text-slate-700 mt-2">{log.target}</p>
                   </td>
                   <td className="px-6 py-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-slate-200/60 transition-colors">
                        <span className="text-[12px] text-slate-600 leading-relaxed font-mono font-medium">{log.changes}</span>
                      </div>
                   </td>
                   <td className="px-6 py-4 text-[13px] font-semibold text-slate-500 text-left">{log.time}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function ToolsModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
       
       <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-6 shadow-sm overflow-hidden relative group">
         <div className="absolute inset-0 bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2 text-[16px] relative z-10"><Lock className="w-4 h-4" /> نظام الطوارئ والاستمرارية</h4>
         <p className="text-[13px] text-rose-600 mb-5 font-medium relative z-10 leading-relaxed">تعطيل الخدمات مؤقتاً، وتفعيل وضع الصيانة أو وضع القراءة فقط.</p>
         <div className="flex flex-wrap gap-3 relative z-10">
            <button className="px-5 py-2.5 bg-rose-600 text-white font-bold text-[13px] rounded-lg shadow-sm disabled:opacity-50 hover:bg-rose-700 transition-colors">تفعيل وضع الطوارئ (إيقاف النظام)</button>
            <button className="px-5 py-2.5 bg-white text-rose-700 font-bold text-[13px] rounded-lg border border-rose-200/80 shadow-sm hover:bg-rose-100 transition-colors">إيقاف بوابة الدفع فقط</button>
         </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
         <h4 className="font-bold mb-2 text-slate-100 text-[16px]">المراقبة التشغيلية (System Health)</h4>
         <p className="text-[13px] text-slate-400 mb-6 font-medium">استهلاك الموارد وحالة الخوادم الحينية.</p>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 relative overflow-hidden backdrop-blur-sm">
               <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl"></div>
               <span className="block text-[11px] text-slate-400 mb-1.5 uppercase font-bold tracking-wider">CPU Usage</span>
               <div className="text-2xl font-mono text-emerald-400 font-bold tracking-tight">12%</div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 relative overflow-hidden backdrop-blur-sm">
               <div className="absolute -right-4 -top-4 w-12 h-12 bg-amber-500/10 rounded-full blur-xl"></div>
               <span className="block text-[11px] text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Memory (RAM)</span>
               <div className="text-2xl font-mono text-amber-400 font-bold tracking-tight">4.2 <span className="text-[14px]">GB</span></div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 relative overflow-hidden backdrop-blur-sm">
               <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500/10 rounded-full blur-xl"></div>
               <span className="block text-[11px] text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Queries / sec</span>
               <div className="text-2xl font-mono text-blue-400 font-bold tracking-tight">84 <span className="text-[14px]">qps</span></div>
            </div>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-indigo-200 transition-all cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-110 transition-transform">
               <Settings className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 text-[15px] transition-colors">التخصيص العميق</h4>
               <p className="text-[13px] text-slate-500 mt-1.5 font-medium leading-relaxed">محرر الواجهات، إضافة حقول مخصصة (Custom Fields) للجداول دون برمجة.</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-indigo-200 transition-all cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform">
               <Save className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 text-[15px] transition-colors">استيراد/تصدير البيانات الضخمة</h4>
               <p className="text-[13px] text-slate-500 mt-1.5 font-medium leading-relaxed">رفع ملفات Excel لتهيئة النظام، تصدير كامل لقاعدة البيانات والأرشفة.</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-indigo-200 transition-all cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
               <Users className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-bold text-slate-900 group-hover:text-blue-700 text-[15px] transition-colors">دليل المستخدم والتدريب</h4>
               <p className="text-[13px] text-slate-500 mt-1.5 font-medium leading-relaxed">إدارة الفيديوهات التعليمية، وجولات النظام (Tours) للمستخدمين الجدد.</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-indigo-200 transition-all cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 transition-transform">
               <History className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-bold text-slate-900 group-hover:text-amber-700 text-[15px] transition-colors">حل التعارضات</h4>
               <p className="text-[13px] text-slate-500 mt-1.5 font-medium leading-relaxed">أداة تسوية لتعارضات جداول الحصص أو تداخل البيانات من مصادر متعددة.</p>
            </div>
         </div>
       </div>

    </motion.div>
  );
}

function ProfileModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
       <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <h3 className="text-[17px] font-bold text-slate-900 font-display mb-4">بيانات المؤسسة والهوية البصرية</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">اسم المؤسسة التعلمية</label>
                 <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" defaultValue="مدارس المستقبل الأهلية" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">الرقم الضريبي / السجل التجاري</label>
                 <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" defaultValue="310293029100003" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">البريد الإلكتروني الرسمي</label>
                 <input type="email" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" defaultValue="info@future-schools.edu" />
               </div>
            </div>
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">الشعار (Logo)</label>
                 <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                    <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="text-sm font-semibold text-slate-600">انقر لرفع شعار جديد</span>
                 </div>
               </div>
            </div>
         </div>
       </div>
    </motion.div>
  );
}

function AcademicModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
       <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <h3 className="text-[17px] font-bold text-slate-900 font-display mb-4">الهيكل التربوي والتقويم المدمج</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">نظام الفصول الدراسية</label>
                 <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option>نظام 3 فصول دراسية (مسارات)</option>
                    <option>نظام فصلين دراسيين</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">بداية العام الدراسي الحالي</label>
                 <input type="date" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" defaultValue="2026-08-20" />
               </div>
            </div>
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">حالة التقويم</label>
                 <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-200 text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> التقويم الأكاديمي معتمد ومقفل
                 </div>
               </div>
            </div>
         </div>
       </div>
    </motion.div>
  );
}
