'use client';

import React, { useState } from 'react';
import { 
  Library, BookOpen, Clock, Users, ArrowRightLeft, 
  Search, Plus, Download, ChevronRight, Bookmark,
  AlertCircle, History, BookCopy, Scan, Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
             <Library className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">المكتبة الذكية</h1>
            <p className="text-slate-500 text-sm mt-1">إدارة الفهرس، الاستعارة، وأعضاء المكتبة</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 xl:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث في الفهرس (ISBN, كلمة مفتاحية)..." 
              className="w-full pl-4 pr-9 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 flex items-center gap-2 transition-colors">
             <Plus className="w-4 h-4" /> إضافة كتاب
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي العناوين" value="3,450" icon={<BookOpen className="w-5 h-5 text-indigo-500" />} color="bg-indigo-50 border-indigo-100" />
        <StatCard title="كتب مستعارة حالياً" value="142" icon={<ArrowRightLeft className="w-5 h-5 text-blue-500" />} color="bg-blue-50 border-blue-100" />
        <StatCard title="إعارة متأخرة" value="18" subtitle="طلاب/معلمون متأخرون" icon={<Clock className="w-5 h-5 text-rose-500" />} color="bg-rose-50 border-rose-100" />
        <StatCard title="الأعضاء النشطين" value="840" subtitle="اطلعوا على كتاب هذا الشهر" icon={<Users className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">نظام المكتبة</h3>
            </div>
            <div className="p-2 space-y-1">
              <NavItem icon={<BookOpen/>} label="الفهرس والكتب" id="catalog" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<ArrowRightLeft/>} label="الاستعارة والإرجاع" id="circulation" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Users/>} label="أعضاء المكتبة" id="members" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Bookmark/>} label="الحجوزات والطلبات" id="reservations" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<AlertCircle/>} label="الغرامات والمتأخرات" id="fines" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<BookCopy/>} label="النسخ والجرد" id="inventory" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Scan/>} label="نظام المنهج الدراسي" id="textbooks" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Smartphone/>} label="البوابة الإلكترونية" id="opac" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'catalog' && <CatalogModule key="catalog" />}
            {activeTab === 'circulation' && <CirculationModule key="circulation" />}
            {activeTab === 'members' && <MembersModule key="members" />}
            {activeTab === 'reservations' && <ReservationsModule key="reservations" />}
            {activeTab === 'fines' && <FinesModule key="fines" />}
            {activeTab === 'inventory' && <InventoryModule key="inventory" />}
            {activeTab === 'textbooks' && <TextbooksModule key="textbooks" />}
            {activeTab === 'opac' && <OpacModule key="opac" />}
            
            {!['catalog', 'circulation', 'members', 'reservations', 'fines', 'inventory', 'textbooks', 'opac'].includes(activeTab) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-100">
                    <Library className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">وحدة فرعية قيد الإنشاء</h3>
                 <p className="text-slate-500 max-w-md text-sm">واجهة ({activeTab}) سيتم تصميمها ضمن الهيكل المتكامل للنظام الأكاديمي.</p>
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
          ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-indigo-400" />}
    </button>
  );
}

function CatalogModule() {
  const books = [
    { isbn: '978-6030304381', title: 'مقدمة في الذكاء الاصطناعي', author: 'أحمد السعيد', category: 'علوم حاسب', copies: 5, available: 3 },
    { isbn: '978-9774620023', title: 'تاريخ الأندلس المصور', author: 'د. طارق السويدان', category: 'تاريخ', copies: 2, available: 0 },
    { isbn: '978-0123456789', title: 'أساسيات الفيزياء', author: 'هاليداي ، ريزنيك', category: 'علوم', copies: 10, available: 8 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">فهرس المكتبة</h2>
          <p className="text-sm text-slate-500 mt-0.5">البحث وإدارة العناوين والنسخ المتاحة</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">العنوان / ISBN</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المؤلف</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">التصنيف</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">النسخ الكلية</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">المتاح</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {books.map((book, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                       <span className="text-sm font-bold text-slate-900 block">{book.title}</span>
                       <span className="text-[11px] font-bold text-slate-400 font-mono mt-0.5">{book.isbn}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-sm font-semibold">{book.author}</td>
                    <td className="px-5 py-4 text-center">
                       <span className="bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-md text-[11px] font-bold">{book.category}</span>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">{book.copies}</td>
                    <td className="px-5 py-4 text-center">
                       <span className={cn("text-lg font-bold font-mono", book.available > 0 ? "text-emerald-600" : "text-rose-600")}>{book.available}</span>
                    </td>
                    <td className="px-5 py-4 text-left">
                       <button className="text-[11px] font-bold text-slate-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100">التفاصيل</button>
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

function CirculationModule() {
  const records = [
    { member: 'خالد الفهد', type: 'طالب (الصف العاشر)', book: 'تاريخ الأندلس المصور', dateOut: '2026-10-01', dueDate: '2026-10-15', status: 'مستعار' },
    { member: 'سناء خليل', type: 'معلم', book: 'مقدمة في الذكاء الاصطناعي', dateOut: '2026-09-20', dueDate: '2026-10-05', status: 'متأخر' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الاستعارة والإرجاع</h2>
          <p className="text-sm text-slate-500 mt-0.5">تسجيل حركات الإعارة للطلاب والموظفين</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
              تسجيل إرجاع
           </button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 flex items-center gap-2 transition-colors">
              إعارة جديدة
           </button>
        </div>
      </div>

       <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">العضو</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الكتاب</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">تاريخ الإعارة</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الاستحقاق</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {records.map((rec, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-900 block">{rec.member}</span>
                        <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">{rec.type}</span>
                     </td>
                     <td className="px-5 py-4 text-sm font-bold text-slate-800">{rec.book}</td>
                     <td className="px-5 py-4 text-center font-mono text-sm text-slate-600">{rec.dateOut}</td>
                     <td className="px-5 py-4 text-center font-mono text-sm text-slate-900 font-bold">{rec.dueDate}</td>
                     <td className="px-5 py-4 text-center">
                        {rec.status === 'مستعار' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-100 text-blue-800 border border-blue-200">مستعار</span>}
                        {rec.status === 'متأخر' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-100 text-rose-800 border border-rose-200">متأخر</span>}
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

function MembersModule() {
  const members = [
    { id: 'MEM-001', name: 'خالد الفهد', type: 'طالب', grade: 'الصف العاشر', books: 2, status: 'نشط' },
    { id: 'MEM-002', name: 'سناء خليل', type: 'معلم', grade: 'قسم العلوم', books: 1, status: 'نشط' },
    { id: 'MEM-003', name: 'أحمد سعد', type: 'طالب', grade: 'الصف السابع', books: 0, status: 'موقوف' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">أعضاء المكتبة</h2>
          <p className="text-sm text-slate-500 mt-0.5">إدارة اشتراكات الطلاب والمعلمين وصلاحياتهم</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">
           <Plus className="w-4 h-4" /> إضافة عضو
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">رقم العضوية</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الاسم</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">النوع</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الاستعارات الحالية</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {members.map((mem, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-5 py-4 font-mono text-sm font-bold text-slate-600">{mem.id}</td>
                     <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-900 block">{mem.name}</span>
                        <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">{mem.grade}</span>
                     </td>
                     <td className="px-5 py-4 text-center text-sm font-bold text-slate-700">{mem.type}</td>
                     <td className="px-5 py-4 text-center font-bold text-slate-800">{mem.books}</td>
                     <td className="px-5 py-4 text-center">
                        {mem.status === 'نشط' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">نشط</span>}
                        {mem.status === 'موقوف' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">موقوف</span>}
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

function ReservationsModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الحجوزات والطلبات</h2>
          <p className="text-sm text-slate-500 mt-0.5">متابعة طلبات حجز الكتب غير المتوفرة حالياً</p>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
         <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
         <h3 className="text-lg font-bold text-slate-700">لا توجد حجوزات نشطة</h3>
         <p className="text-slate-500 text-sm mt-1">جميع طلبات الحجز تم تلبيتها.</p>
      </div>
    </motion.div>
  );
}

function FinesModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الغرامات والمتأخرات</h2>
          <p className="text-sm text-slate-500 mt-0.5">تحصيل الغرامات عن التأخير أو التلف</p>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
         <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
         <h3 className="text-lg font-bold text-slate-700">سجل الغرامات</h3>
         <p className="text-slate-500 text-sm mt-1">هنا يظهر سجل الغرامات المدفوعة والمستحقة.</p>
      </div>
    </motion.div>
  );
}

function InventoryModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">النسخ والجرد</h2>
          <p className="text-sm text-slate-500 mt-0.5">إدارة باركود النسخ وجرد الرفوف</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">
           <BookCopy className="w-4 h-4" /> جلسة جرد جديدة
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
         <BookCopy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
         <h3 className="text-lg font-bold text-slate-700">نظام الجرد الآلي</h3>
         <p className="text-slate-500 text-sm mt-1">يمكنك بدء جرد باستخدام جهاز قارئ الباركود.</p>
      </div>
    </motion.div>
  );
}

function TextbooksModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">نظام المنهج الدراسي</h2>
          <p className="text-sm text-slate-500 mt-0.5">صرف واسترجاع الكتب المدرسية والمقررات</p>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
         <Scan className="w-12 h-12 text-slate-300 mx-auto mb-3" />
         <h3 className="text-lg font-bold text-slate-700">توزيع المقررات</h3>
         <p className="text-slate-500 text-sm mt-1">إدارة صرف المقررات للطلاب بداية الفصل الدراسي.</p>
      </div>
    </motion.div>
  );
}

function OpacModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">البوابة الإلكترونية (OPAC)</h2>
          <p className="text-sm text-slate-500 mt-0.5">إعدادات واجهة البحث لطلاب المدرسة والمستفيدين</p>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
         <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
         <h3 className="text-lg font-bold text-slate-700">إعدادات البوابة</h3>
         <p className="text-slate-500 text-sm mt-1">تخصيص الواجهة العامة للمكتبة (الكتب المميزة، الإعلانات).</p>
      </div>
    </motion.div>
  );
}
