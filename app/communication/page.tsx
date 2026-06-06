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
  const mails = [
    { id: 1, sender: 'مدير المدرسة', subject: 'بخصوص خطة العام الدراسي القادم', preview: 'السلام عليكم، يرجى الاطلاع على المرفقات بخصوص...', date: '10:30 ص', unread: true },
    { id: 2, sender: 'قسم شؤون المعلمين', subject: 'تحديث بيانات التواصل', preview: 'نرجو من جميع الزملاء تحديث بياناتهم عبر البوابة...', date: 'أمس', unread: false },
    { id: 3, sender: 'علي أحمد (معلم لغة عربية)', subject: 'طلب تبديل حصة', preview: 'أرجو التكرم بالموافقة على تبديل الحصة الثالثة يوم...', date: '12 أكتوبر', unread: false },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex h-[600px] bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="w-64 border-l border-slate-100 bg-slate-50/30 p-4 flex flex-col gap-2 shrink-0">
        <button className="w-full bg-pink-600 text-white font-bold py-2.5 rounded-xl shadow-sm hover:bg-pink-700 transition-colors mb-4 flex items-center justify-center gap-2">
           <Send className="w-4 h-4" /> رسالة جديدة
        </button>
        <div className="space-y-1">
           <button className="w-full flex justify-between items-center px-4 py-2 bg-pink-50 text-pink-700 font-bold rounded-lg text-sm">
             <div className="flex items-center gap-2"><Inbox className="w-4 h-4" /> صندوق الوارد</div>
             <span className="bg-pink-200/50 text-pink-700 px-2 py-0.5 rounded text-[10px]">12</span>
           </button>
           <button className="w-full flex justify-between items-center px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg text-sm transition-colors">
             <div className="flex items-center gap-2"><Send className="w-4 h-4" /> البريد المرسل</div>
           </button>
           <button className="w-full flex justify-between items-center px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg text-sm transition-colors">
             <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> المسودات</div>
           </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
           <h2 className="font-bold text-slate-800 text-lg">صندوق الوارد</h2>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="البحث في الرسائل..." className="pl-4 pr-9 py-1.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mails.map((mail) => (
             <div key={mail.id} className={cn("p-4 border-b border-slate-100 cursor-pointer transition-colors flex gap-4 items-start", mail.unread ? "bg-white" : "bg-slate-50/50", "hover:bg-pink-50/30")}>
                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-500 font-bold text-sm">
                   {mail.sender.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-baseline mb-1">
                      <span className={cn("text-sm truncate", mail.unread ? "font-bold text-slate-900" : "font-semibold text-slate-700")}>{mail.sender}</span>
                      <span className={cn("text-xs whitespace-nowrap mr-2 font-mono", mail.unread ? "font-bold text-pink-600" : "text-slate-400")}>{mail.date}</span>
                   </div>
                   <h4 className={cn("text-sm truncate mb-1", mail.unread ? "font-bold text-slate-800" : "font-medium text-slate-600")}>{mail.subject}</h4>
                   <p className="text-xs text-slate-500 truncate">{mail.preview}</p>
                </div>
             </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TasksModule() {
  const tasks = [
    { id: 'T-101', title: 'إعداد الجدول المدرسي النهائي', assignedTo: 'أ. خالد صالح', dueDate: '2026-10-18', priority: 'عالية', status: 'قيد التنفيذ' },
    { id: 'T-102', title: 'مراجعة طلبات النقل', assignedTo: 'أ. فاطمة علي', dueDate: '2026-10-20', priority: 'متوسطة', status: 'جديدة' },
    { id: 'T-103', title: 'تجهيز ملفات الاعتماد الأكاديمي', assignedTo: 'لجنة الجودة', dueDate: '2026-11-01', priority: 'عالية', status: 'متأخرة' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
           <h2 className="text-lg font-bold text-slate-900">إدارة المهام</h2>
           <p className="text-sm text-slate-500 mt-0.5">تتبع المهام الموكلة لفريق العمل</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
           <Plus className="w-4 h-4" /> إضافة مهمة
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <table className="w-full text-right shrink-0">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">المهمة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">المسؤول</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">تاريخ الاستحقاق</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الأولوية</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحالة</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {tasks.map((task) => (
               <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                     <span className="text-sm font-bold text-slate-900 block">{task.title}</span>
                     <span className="text-[11px] font-mono text-slate-400">{task.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">{task.assignedTo}</td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-slate-600">{task.dueDate}</td>
                  <td className="px-6 py-4 text-center">
                     {task.priority === 'عالية' && <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">عالية</span>}
                     {task.priority === 'متوسطة' && <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">متوسطة</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                     {task.status === 'قيد التنفيذ' && <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">قيد التنفيذ</span>}
                     {task.status === 'جديدة' && <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">جديدة</span>}
                     {task.status === 'متأخرة' && <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">متأخرة</span>}
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function MeetingsModule() {
  const meetings = [
    { title: 'اجتماع مجلس الإدارة الشهري', date: 'الخميس 18 أكتوبر', time: '10:00 ص - 12:00 م', location: 'قاعة الاجتماعات الرئيسية', attendees: 12 },
    { title: 'لقاء أولياء الأمور (المرحلة الابتدائية)', date: 'الأحد 21 أكتوبر', time: '04:00 م - 06:00 م', location: 'عبر منصة Zoom', attendees: 150 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
           <h2 className="text-lg font-bold text-slate-900">الاجتماعات المجدولة</h2>
           <p className="text-sm text-slate-500 mt-0.5">تنظيم وإدارة الاجتماعات الداخلية والخارجية</p>
        </div>
        <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
           <Calendar className="w-4 h-4" /> جدولة اجتماع
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         {meetings.map((m, i) => (
           <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                 <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
                    <Calendar className="w-5 h-5" />
                 </div>
                 <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold">{m.date}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-[15px] mb-2">{m.title}</h3>
              <div className="space-y-2 mt-4 text-sm text-slate-600 font-medium">
                 <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> الوقت: {m.time}</p>
                 <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> الموقع: {m.location}</p>
                 <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> المدعوين: {m.attendees} شخص</p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                 <button className="flex-1 bg-blue-50 text-blue-700 font-bold py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">عرض التفاصيل</button>
                 <button className="flex-1 border border-slate-200 text-slate-600 font-bold py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">محضر الاجتماع</button>
              </div>
           </div>
         ))}
      </div>
    </motion.div>
  );
}

function DocumentsModule() {
  const docs = [
    { name: 'الخطة التشغيلية 2026-2027.pdf', type: 'PDF', size: '2.4 MB', date: '2026-09-01' },
    { name: 'نموذج تقييم الأداء الوظيفي.docx', type: 'DOCX', size: '1.1 MB', date: '2026-09-15' },
    { name: 'لائحة السلوك والمواظبة المحدثة.pdf', type: 'PDF', size: '3.8 MB', date: '2026-10-05' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
           <h2 className="text-lg font-bold text-slate-900">الوثائق والمستندات</h2>
           <p className="text-sm text-slate-500 mt-0.5">أرشيف الملفات المشتركة ونماذج العمل</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors">رفع ملف</button>
           <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">مجلد جديد</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <table className="w-full text-right shrink-0">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">اسم الملف</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">النوع</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحجم</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">تاريخ التعديل</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-left">إجراءات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {docs.map((doc, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                     <FileText className={cn("w-5 h-5", doc.type === 'PDF' ? "text-rose-500" : "text-blue-500")} />
                     <span className="text-[14px] font-bold text-slate-800">{doc.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-xs font-bold text-slate-500">{doc.type}</td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-slate-600">{doc.size}</td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-slate-500">{doc.date}</td>
                  <td className="px-6 py-4 text-left">
                     <button className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200/60 opacity-0 group-hover:opacity-100 transition-opacity">تحميل</button>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}
