'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, Bell, Mail, Send, CheckCircle2, 
  Search, Plus, ChevronRight, MessageCircle, AlertCircle,
  FileText, Calendar, Inbox, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('announcements');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-pink-100 to-rose-50 p-3.5 rounded-xl text-pink-600 border border-pink-200/50 shadow-sm shadow-pink-100">
             <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">الاتصالات والرسائل</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">التعاميم، رسائل SMS، والبريد الداخلي</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-5 py-2.5 bg-pink-600 text-white rounded-lg text-[13px] font-bold hover:bg-pink-700 shadow-sm shadow-pink-600/20 flex items-center gap-2 transition-colors border border-transparent">
             <Send className="w-4 h-4" /> إرسال رسالة جديدة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="رسائل مرسلة" value="8,401" subtitle="هذا الشهر" icon={<Send className="w-4.5 h-4.5 text-pink-500" />} color="bg-pink-50 border-pink-100" />
        <StatCard title="إشعارات النظام" value="1,245" subtitle="إشعارات تلقائية" icon={<Bell className="w-4.5 h-4.5 text-blue-500" />} color="bg-blue-50 border-blue-100" />
        <StatCard title="تعاميم نشطة" value="3" subtitle="قرارات هامة" icon={<FileText className="w-4.5 h-4.5 text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
        <StatCard title="رسائل غير مقروءة" value="12" subtitle="تحتاج الرد" icon={<Inbox className="w-4.5 h-4.5 text-slate-300" />} color="bg-slate-900 border-slate-800 text-white" dark />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">وحدات الاتصال</h3>
            </div>
            <div className="p-3 space-y-1">
              <NavItem icon={<Bell/>} label="الإشعارات والتعاميم" id="announcements" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Mail/>} label="الرسائل الداخلية" id="internal_mail" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<MessageCircle/>} label="المهام" id="tasks" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Calendar/>} label="الاجتماعات" id="meetings" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<FileText/>} label="الوثائق والمستندات" id="documents" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'announcements' && <AnnouncementsModule key="announcements" />}
            {activeTab === 'internal_mail' && <InternalMailModule key="internal_mail" />}
            {activeTab === 'tasks' && <TasksModule key="tasks" />}
            {activeTab === 'meetings' && <MeetingsModule key="meetings" />}
            {activeTab === 'documents' && <DocumentsModule key="documents" />}
            
            {!['announcements', 'internal_mail', 'tasks', 'meetings', 'documents'].includes(activeTab) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 border border-slate-200/60 shadow-inner">
                    <MessageSquare className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">وحدة قيد الإنشاء</h3>
                 <p className="text-slate-500 max-w-md mx-auto text-[13px] font-medium leading-relaxed">واجهة ({activeTab}) سيتم تصميمها ضمن الهيكل المتكامل للاتصالات.</p>
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
          ? "bg-pink-50 text-pink-700 shadow-sm border border-pink-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-pink-600" : "text-slate-400 group-hover:text-pink-500") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-pink-400" />}
    </button>
  );
}

function AnnouncementsModule() {
  const announcements = [
    { id: '1', title: 'مواعيد اختبارات منتصف الفصل الأول', target: 'الطلاب وأولياء الأمور - جميع المراحل', date: '2026-10-15', status: 'نشط' },
    { id: '2', title: 'اجتماع الهيئة الإدارية والأكاديمية', target: 'المعلمون والإداريون', date: '2026-10-20', status: 'مجدول' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">التعاميم والإعلانات</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">لوحة الإعلانات الموحدة للمدرسة</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0 border-collapse">
             <thead className="bg-slate-50/50 border-b border-slate-200/80">
                <tr>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">عنوان التعميم</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الفئة المستهدفة</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">التاريخ</th>
                   <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {announcements.map((ann, i) => (
                 <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-[14px] font-bold text-slate-900">{ann.title}</td>
                    <td className="px-6 py-4 text-slate-500 text-[13px] font-medium">{ann.target}</td>
                    <td className="px-6 py-4 text-center font-mono text-[13px] text-slate-500">{ann.date}</td>
                    <td className="px-6 py-4 text-center">
                       {ann.status === 'نشط' && <span className="inline-flex items-center px-3 py-1.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-sm">نشط</span>}
                       {ann.status === 'مجدول' && <span className="inline-flex items-center px-3 py-1.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/60 shadow-sm">مجدول</span>}
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

function InternalMailModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
       <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center min-h-[400px] flex flex-col justify-center items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 border border-slate-100 shadow-inner">
             <Mail className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">الرسائل الداخلية</h3>
          <p className="text-slate-500 text-[13px] font-medium max-w-md mx-auto leading-relaxed">صندوق الوارد وإرسال رسائل بين المستخدمين من معلمين، طلاب، وإداريين.</p>
       </div>
    </motion.div>
  );
}

function TasksModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
       <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center min-h-[400px] flex flex-col justify-center items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 border border-slate-100 shadow-inner">
             <MessageCircle className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">المهام</h3>
          <p className="text-slate-500 text-[13px] font-medium max-w-md mx-auto leading-relaxed">إدارة المهام الموكلة للموظفين وتتبع حالة الإنجاز والتسليم.</p>
       </div>
    </motion.div>
  );
}

function MeetingsModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
       <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center min-h-[400px] flex flex-col justify-center items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 border border-slate-100 shadow-inner">
             <Calendar className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">إدارة الاجتماعات</h3>
          <p className="text-slate-500 text-[13px] font-medium max-w-md mx-auto leading-relaxed">جدولة الاجتماعات، دعوة المشاركين، وكتابة محاضر الاجتماع والقرارات.</p>
       </div>
    </motion.div>
  );
}

function DocumentsModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
       <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center min-h-[400px] flex flex-col justify-center items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 border border-slate-100 shadow-inner">
             <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">الوثائق والمستندات</h3>
          <p className="text-slate-500 text-[13px] font-medium max-w-md mx-auto leading-relaxed">أرشفة الملفات وحفظ مستندات المدرسة بشجرة مجلدات مع إدارة صلاحيات الوصول.</p>
       </div>
    </motion.div>
  );
}
