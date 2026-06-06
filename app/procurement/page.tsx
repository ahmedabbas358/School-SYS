'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, Package, Box, TrendingUp, AlertCircle, 
  Search, Plus, Download, ChevronRight, FileText,
  Truck, ArrowRightLeft, ShieldCheck, History, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function ProcurementPage() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-sky-100 p-3 rounded-lg text-sky-600">
             <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">المشتريات والمخازن</h1>
            <p className="text-slate-500 text-sm mt-1">إدارة الموردين، الطلبات، الأرصدة المخزنية</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 xl:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث عن صنف، مورد، طلبية..." 
              className="w-full pl-4 pr-9 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-700"
            />
          </div>
          <button className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-bold hover:bg-sky-700 shadow-sm shadow-sky-600/20 flex items-center gap-2 transition-colors">
             <Plus className="w-4 h-4" /> طلب جديد
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الأصناف" value="2,450" icon={<Box className="w-5 h-5 text-sky-500" />} color="bg-sky-50 border-sky-100" />
        <StatCard title="طلبات شراء نشطة" value="12" subtitle="3 متأخرة التسليم" icon={<FileText className="w-5 h-5 text-amber-500" />} color="bg-amber-50 border-amber-100" />
        <StatCard title="أصناف وصلت للحد الأدنى" value="18" icon={<AlertCircle className="w-5 h-5 text-rose-500" />} color="bg-rose-50 border-rose-100" />
        <StatCard title="المشتريات (هذا الشهر)" value="145K" icon={<TrendingUp className="w-5 h-5 text-slate-300" />} color="bg-slate-900 border-slate-800 text-white" dark />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">وحدات النظام</h3>
            </div>
            <div className="p-2 space-y-1">
              <NavItem icon={<Box/>} label="الرصيد المخزني" id="inventory" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<FileText/>} label="طلبات الشراء (PR)" id="purchase_requests" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<ShoppingCart/>} label="أوامر الشراء (PO)" id="purchase_orders" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Truck/>} label="إدارة الموردين" id="suppliers" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Package/>} label="الاستلام والفحص" id="receiving" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<ArrowRightLeft/>} label="صرف المواد" id="distribution" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<ShieldCheck/>} label="الجرد والتسويات" id="stock_take" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<History/>} label="حركة الأصناف" id="movements" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<BarChart3/>} label="تقارير المخازن" id="reports" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'inventory' && <InventoryModule key="inventory" />}
            {activeTab === 'purchase_requests' && <PurchaseRequestsModule key="purchase_requests" />}
            {activeTab === 'purchase_orders' && <PurchaseOrdersModule key="purchase_orders" />}
            {activeTab === 'suppliers' && <SuppliersModule key="suppliers" />}
            {activeTab === 'receiving' && <ReceivingModule key="receiving" />}
            {activeTab === 'distribution' && <DistributionModule key="distribution" />}
            {activeTab === 'stock_take' && <StockTakeModule key="stock_take" />}
            {activeTab === 'movements' && <MovementsModule key="movements" />}
            {activeTab === 'reports' && <ReportsModule key="reports" />}
            
            {!['inventory', 'purchase_requests', 'purchase_orders', 'suppliers', 'receiving', 'distribution', 'stock_take', 'movements', 'reports'].includes(activeTab) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-100">
                    <ShoppingCart className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">وحدة قيد الإنشاء</h3>
                 <p className="text-slate-500 max-w-md text-sm">واجهة ({activeTab}) سيتم تصميمها ضمن الهيكل المتكامل.</p>
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
          ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-sky-400" />}
    </button>
  );
}

function InventoryModule() {
  const items = [
    { code: 'ITM-0012', name: 'ورق تصوير A4', category: 'القرطاسية والمكتبية', quantity: 150, min: 50, unit: 'كرتون', status: 'متاح' },
    { code: 'ITM-0089', name: 'أقلام سبورة (ألوان منوعة)', category: 'القرطاسية والمكتبية', quantity: 24, min: 30, unit: 'علبة', status: 'إعادة طلب' },
    { code: 'ITM-0431', name: 'أجهزة حاسب محمول (Dell)', category: 'الأجهزة التقنية', quantity: 5, min: 2, unit: 'جهاز', status: 'متاح' },
    { code: 'ITM-0210', name: 'كراسي طالب فردية', category: 'الأثاث المدرسي', quantity: 0, min: 20, unit: 'قطعة', status: 'نفذ' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الرصيد المخزني</h2>
          <p className="text-sm text-slate-500 mt-0.5">سجل الأصناف ومراقبة حدود إعادة الطلب</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
             <Download className="w-4 h-4 text-slate-500" /> تصدير جرد
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">كود/اسم الصنف</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">التصنيف</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الكمية الحالية</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الحد الأدنى</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {items.map((item, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                       <span className="text-sm font-bold text-slate-900 block">{item.name}</span>
                       <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded inline-block mt-1 font-mono">{item.code}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-sm font-semibold">{item.category}</td>
                    <td className="px-5 py-4 text-center">
                       <span className={cn("text-lg font-bold font-mono", item.status === 'نفذ' ? "text-rose-600" : "text-slate-900")}>{item.quantity}</span>
                       <span className="text-[10px] text-slate-500 mr-1">{item.unit}</span>
                    </td>
                    <td className="px-5 py-4 text-center text-slate-500 font-mono text-sm font-bold">{item.min}</td>
                    <td className="px-5 py-4 text-center">
                       {item.status === 'متاح' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">متاح</span>}
                       {item.status === 'إعادة طلب' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-100 text-amber-800 border border-amber-200">إعادة طلب</span>}
                       {item.status === 'نفذ' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-100 text-rose-800 border border-rose-200">نفذ</span>}
                    </td>
                    <td className="px-5 py-4 text-left">
                       <button className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100">تفاصيل وحركة</button>
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

function PurchaseRequestsModule() {
  const requests = [
    { id: 'PR-2026-041', department: 'الأكاديمي', requester: 'محمد سعد', date: '2026-10-12', items: 3, status: 'موافق عليه', priority: 'عالية' },
    { id: 'PR-2026-042', department: 'التقنية', requester: 'فهد عبدالله', date: '2026-10-14', items: 12, status: 'معلق', priority: 'متوسطة' },
    { id: 'PR-2026-043', department: 'الصيانة', requester: 'خالد السيد', date: '2026-10-15', items: 5, status: 'مرفوض', priority: 'منخفضة' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">طلبات الشراء (Purchase Requests)</h2>
          <p className="text-sm text-slate-500 mt-0.5">متابعة طلبات الأقسام واعتمادها</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-right shrink-0">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">رقم الطلب</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">القسم / مقدم الطلب</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">التاريخ</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">أصناف</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الأولوية</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                   <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {requests.map((req, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                       <span className="text-sm font-bold text-slate-900 font-mono">{req.id}</span>
                    </td>
                    <td className="px-5 py-4">
                       <span className="text-sm font-bold text-slate-800 block">{req.department}</span>
                       <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">{req.requester}</span>
                    </td>
                    <td className="px-5 py-4 text-center text-slate-600 font-mono text-sm">{req.date}</td>
                    <td className="px-5 py-4 text-center text-slate-700 font-bold">{req.items}</td>
                    <td className="px-5 py-4 text-center">
                       {req.priority === 'عالية' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100">عالية</span>}
                       {req.priority === 'متوسطة' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100">متوسطة</span>}
                       {req.priority === 'منخفضة' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200">منخفضة</span>}
                    </td>
                    <td className="px-5 py-4 text-center">
                       {req.status === 'موافق عليه' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">موافق عليه</span>}
                       {req.status === 'معلق' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">قيد المراجعة</span>}
                       {req.status === 'مرفوض' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">مرفوض</span>}
                    </td>
                    <td className="px-5 py-4 text-left">
                       <button className="text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-100 transition-colors">فتح الطلب</button>
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

function PurchaseOrdersModule() { return <div className="p-8 text-center text-slate-500">وحدة أوامر الشراء قيد الإنشاء</div>; }
function SuppliersModule() { return <div className="p-8 text-center text-slate-500">وحدة الموردين قيد الإنشاء</div>; }
function ReceivingModule() { return <div className="p-8 text-center text-slate-500">وحدة استلام المشتريات قيد الإنشاء</div>; }
function DistributionModule() { return <div className="p-8 text-center text-slate-500">وحدة توزيع العهد قيد الإنشاء</div>; }
function StockTakeModule() { return <div className="p-8 text-center text-slate-500">وحدة الجرد قيد الإنشاء</div>; }
function MovementsModule() { return <div className="p-8 text-center text-slate-500">وحدة حركات المستودع قيد الإنشاء</div>; }
function ReportsModule() { return <div className="p-8 text-center text-slate-500">وحدة التقارير قيد الإنشاء</div>; }
