'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, DollarSign, FileText, PieChart, AlertCircle,
  Clock, CheckCircle2, ChevronRight, Plus, Search, Filter,
  Download, Receipt, Users, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [financeData, setFinanceData] = useState<any>({ invoices: [], dashboard: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch('/api/finance');
        const json = await res.json();
        if (json.success && json.data) setFinanceData(json.data);
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
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-3.5 rounded-xl text-emerald-600 border border-emerald-200/50 shadow-sm shadow-emerald-100">
             <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">إدارة الرسوم والمالية</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">اللوحة الشاملة للرسوم، المدفوعات، التخفيضات، والمتابعة المالية</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 outline-none shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
             <option>العام الدراسي 2026/2027</option>
          </select>
          <div className="relative min-w-[240px] flex-1 xl:flex-none">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث عن طالب، إيصال، حساب..." 
              className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-slate-200/80 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-700 shadow-sm transition-all placeholder:text-slate-400"
            />
          </div>
          <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center gap-2 border border-transparent">
             <Plus className="w-4 h-4" /> تسجيل دفعة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="إجمالي المحصل" value={`$${(financeData.dashboard?.totalCollected || 0).toLocaleString()}`} subtitle={`نسبة التحصيل ${financeData.dashboard?.totalInvoiced ? Math.round((financeData.dashboard.totalCollected / financeData.dashboard.totalInvoiced) * 100) : 0}%`} icon={<TrendingUp className="w-4.5 h-4.5 text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
        <StatCard title="المتبقي (المتأخرات)" value={`$${(financeData.dashboard?.totalOutstanding || 0).toLocaleString()}`} subtitle={`${financeData.dashboard?.overdueCount || 0} فواتير متعثرة`} icon={<AlertCircle className="w-4.5 h-4.5 text-rose-500" />} color="bg-rose-50 border-rose-100" />
        <StatCard title="الإيرادات الشهرية" value={`$${(financeData.dashboard?.monthlyRevenue || 0).toLocaleString()}`} subtitle="مقارنة بالشهر الماضي" icon={<PieChart className="w-4.5 h-4.5 text-indigo-500" />} color="bg-indigo-50 border-indigo-100" />
        <StatCard title="المصروفات الشهرية" value={`$${(financeData.dashboard?.monthlyExpenses || 0).toLocaleString()}`} subtitle="هذا الشهر" icon={<Clock className="w-4.5 h-4.5 text-amber-500" />} color="bg-amber-50 border-amber-100" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">لوحة التحكم المالية</h3>
            </div>
            <div className="p-3 space-y-1">
              <NavItem icon={<PieChart/>} label="اللوحة المالية" id="dashboard" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Users/>} label="حسابات الطلاب (Ledger)" id="ledger" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<DollarSign/>} label="تسجيل المدفوعات" id="payments" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<FileText/>} label="إدارة الأقساط" id="installments" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Receipt/>} label="الإيصالات والفواتير" id="receipts" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<AlertCircle/>} label="المتأخرات والمتابعة" id="arrears" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {loading ? (
             <div className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                <h3 className="text-lg font-bold text-slate-800">جاري تحميل البيانات المالية...</h3>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && <DashboardModule key="dashboard" dashboardData={financeData.dashboard} />}
              {activeTab === 'ledger' && <LedgerModule key="ledger" invoices={financeData.invoices} />}
              {activeTab === 'payments' && <PaymentsModule key="payments" dashboardData={financeData.dashboard} />}
              {activeTab === 'installments' && <InstallmentsModule key="installments" />}
              {activeTab === 'receipts' && <ReceiptsModule key="receipts" invoices={financeData.invoices} />}
              {activeTab === 'arrears' && <ArrearsModule key="arrears" invoices={financeData.invoices} />}
              
              {!['dashboard', 'ledger', 'payments', 'installments', 'receipts', 'arrears'].includes(activeTab) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[400px]">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 text-slate-300 border border-slate-200/60 shadow-inner">
                      <CreditCard className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">وحدة قيد الإنشاء</h3>
                   <p className="text-slate-500 max-w-md text-[13px] font-medium leading-relaxed">هذه الواجهة قيد الإعداد ضمن التحديث الجاري.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

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
          ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-emerald-400" />}
    </button>
  );
}

// ------------------------------------------------------------------
// Modules
// ------------------------------------------------------------------

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart as RePieChart, Pie, Cell } from 'recharts';

const financeData = [
  { name: 'أغسطس', expected: 80000, actual: 40000 },
  { name: 'سبتمبر', expected: 120000, actual: 110000 },
  { name: 'أكتوبر', expected: 50000, actual: 48000 },
  { name: 'نوفمبر', expected: 40000, actual: 35000 },
];

function DashboardModule({ dashboardData }: { dashboardData: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-[17px] font-bold text-slate-900 font-display mb-5">التحصيل الشهري مقابل المتوقع</h3>
            <div className="h-[300px] w-full" dir="ltr">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={financeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `$${val/1000}k`} />
                   <RechartsTooltip />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                   <Area type="monotone" dataKey="expected" stroke="#94A3B8" fillOpacity={1} fill="url(#colorExpected)" name="المتوقع" />
                   <Area type="monotone" dataKey="actual" stroke="#10B981" fillOpacity={1} strokeWidth={2} fill="url(#colorActual)" name="المحصل" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-[17px] font-bold text-slate-900 font-display mb-5">توزيع الإيرادات</h3>
            <div className="h-[250px] w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={[{name: 'الرسوم الدراسية', value: 70}, {name: 'النقل الممدرسي', value: 20}, {name: 'أنشطة أخرى', value: 10}]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#10B981" />
                      <Cell fill="#3B82F6" />
                      <Cell fill="#F59E0B" />
                    </Pie>
                    <RechartsTooltip />
                  </RePieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-2">
               <div className="flex justify-between text-sm font-bold"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>الرسوم الدراسية</span><span>70%</span></div>
               <div className="flex justify-between text-sm font-bold"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>النقل المدرسي</span><span>20%</span></div>
               <div className="flex justify-between text-sm font-bold"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div>أنشطة أخرى</span><span>10%</span></div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function PaymentsModule({ dashboardData }: { dashboardData: any }) {
  const recentPayments = dashboardData?.recentPayments || [];
  
  const payments = recentPayments.length > 0 ? recentPayments.map((p: any) => ({
    id: p.paymentNumber,
    student: p.invoice?.student?.user?.name || 'بدون اسم',
    amount: `$${p.amount.toLocaleString()}`,
    method: p.method === 'CASH' ? 'نقدي' : p.method === 'CARD' ? 'بطاقة ائتمان' : p.method === 'TRANSFER' ? 'تحويل بنكي' : p.method,
    date: new Date(p.paidAt).toLocaleDateString(),
    status: p.status === 'COMPLETED' ? 'مكتمل' : 'قيد المراجعة'
  })) : [
    { id: "PAY-1004", student: "أحمد الماجد", amount: "$500", method: "بطاقة ائتمان", date: "2026-05-20", status: "مكتمل" },
    { id: "PAY-1005", student: "سارة فهد", amount: "$300", method: "تحويل بنكي", date: "2026-05-19", status: "قيد المراجعة" },
    { id: "PAY-1006", student: "عمر خالد", amount: "$150", method: "نقدي", date: "2026-05-18", status: "مكتمل" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">سجل المدفوعات</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">تتبع المدفوعات الواردة وتأكيد التحويلات</p>
         </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">رقم العملية</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الطالب</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">المبلغ</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">طريقة الدفع</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">التاريخ</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الحالة</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {payments.map((p, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono text-[13px] font-bold text-slate-500">{p.id}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{p.student}</td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-[14px] text-emerald-600">{p.amount}</td>
                  <td className="px-6 py-4 text-center font-bold text-[13px] text-slate-700">{p.method}</td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-[12px] text-slate-500">{p.date}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold border", 
                        p.status === "مكتمل" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                     )}>{p.status}</span>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function InstallmentsModule() {
  const installments = [
    { student: "خالد المحمد", plan: "خطة 3 أقساط", total: "$1,500", paid: "$500", remaining: "$1,000", nextDueDate: "2026-11-01" },
    { student: "زينب عبدالفتاح", plan: "خطة شهرية", total: "$2,000", paid: "$400", remaining: "$1,600", nextDueDate: "2026-10-15" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">إدارة الأقساط (Installment Plans)</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">جدولة الدفعات وتقسيم الرسوم للطلاب المسجلين في خطط الدفع الميسرة</p>
        </div>
        <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> إنشاء خطة تقسيط
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
         <table className="w-full text-right shrink-0 border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الطالب</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">نوع الخطة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">إجمالي الرسوم</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">المدفوع / المتبقي</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">موعد القسط القادم</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {installments.map((item, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-[14px] font-bold text-slate-900">{item.student}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-medium text-emerald-700">{item.plan}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-mono font-bold text-slate-600">{item.total}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-mono font-bold">
                     <span className="text-emerald-600">{item.paid}</span> <span className="text-slate-300">/</span> <span className="text-rose-500">{item.remaining}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] font-mono font-bold text-amber-600">{item.nextDueDate}</td>
                  <td className="px-6 py-4 text-left">
                    <button className="text-[12px] font-bold text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100 transition-all shadow-sm">دفع القسط</button>
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

function ReceiptsModule({ invoices }: { invoices: any[] }) {
  const receipts = invoices.length > 0 ? invoices.map((inv) => ({
    id: inv.invoiceNumber,
    student: inv.student?.user?.name || 'بدون اسم',
    date: new Date(inv.createdAt).toLocaleDateString(),
    amount: `$${inv.totalAmount.toLocaleString()}`,
    status: inv.status === 'PAID' ? 'مدفوع' : inv.status === 'PARTIAL' ? 'دفع جزئي' : 'مُصدر'
  })) : [
    { id: "REC-2026-001", student: "أحمد الماجد", date: "2026-05-20", amount: "$500", status: "مُصدر" },
    { id: "REC-2026-002", student: "عمر خالد", date: "2026-05-18", amount: "$150", status: "مُصدر" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">سجل الفواتير والإيصالات</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">توليد فواتير ضريبية، طباعتها، وإرسالها بالبريد الإلكتروني لأولياء الأمور</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
         <table className="w-full text-right shrink-0 border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">رقم الإيصال</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الطالب</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">التاريخ</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">المبلغ</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-left">خيارات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {receipts.map((item, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-[13px] font-mono font-bold text-slate-500">{item.id}</td>
                  <td className="px-6 py-4 text-[14px] font-bold text-slate-900">{item.student}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-mono font-semibold text-slate-600">{item.date}</td>
                  <td className="px-6 py-4 text-center text-[14px] font-mono font-bold text-emerald-600">{item.amount}</td>
                  <td className="px-6 py-4 text-center">
                     <span className="px-2.5 py-1 rounded text-[11px] font-bold border bg-blue-50 text-blue-700 border-blue-100">{item.status}</span>
                  </td>
                  <td className="px-6 py-4 text-left flex items-center justify-end gap-2">
                    <button className="text-[12px] font-bold text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-all shadow-sm">عرض</button>
                    <button className="text-[12px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-all shadow-sm">طباعة</button>
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

function ArrearsModule({ invoices }: { invoices: any[] }) {
  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE' || (i.status === 'UNPAID' && i.dueDate && new Date(i.dueDate) < new Date()));
  
  const arrears = overdueInvoices.length > 0 ? overdueInvoices.map(inv => {
    const dueDate = new Date(inv.dueDate);
    const today = new Date();
    const daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      student: inv.student?.user?.name || 'بدون اسم',
      totalDue: `$${inv.balance.toLocaleString()}`,
      daysLate: daysLate > 0 ? daysLate : 0,
      phone: inv.student?.contactPhone || 'غير متوفر'
    };
  }) : [
    { student: "خالد المحمد", totalDue: "$800", daysLate: 45, phone: "0501112223" },
    { student: "زينب عبدالفتاح", totalDue: "$1,200", daysLate: 90, phone: "0563334445" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display text-rose-600">المتأخرات وحالات التعثر</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">تنبيهات الدفع ومتابعة الحسابات المتعثرة</p>
         </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-rose-50/50 border-b border-rose-100">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-rose-700 uppercase">اسم الطالب</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-rose-700 uppercase text-center">المبلغ المستحق</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-rose-700 uppercase text-center">أيام التأخير</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-rose-700 uppercase text-center">التواصل</th>
                <th className="px-6 py-4 text-center"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {arrears.map((a, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{a.student}</td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-[15px] text-rose-600">{a.totalDue}</td>
                  <td className="px-6 py-4 text-center">
                     <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-100 text-[12px] font-bold">{a.daysLate} يوم</span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-[13px] text-slate-600">{a.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[12px] font-bold text-white bg-rose-500 hover:bg-rose-600 px-3 py-1.5 rounded-lg border border-transparent shadow-sm transition-all text-center mx-auto">إرسال إشعار فوري</button>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function LedgerModule({ invoices }: { invoices: any[] }) {
  const defaultLedgers = [
    { name: 'أحمد محمد عبدالعزيز', grade: 'الصف السادس', total: '$1,200', paid: '$800', balance: '$400', status: 'مسدد جزئياً' },
    { name: 'عمر خالد السعيد', grade: 'الرابع الابتدائي', total: '$1,000', paid: '$1,000', balance: '$0', status: 'مسدد بالكامل' },
    { name: 'سارة فهد', grade: 'الاول الثانوي', total: '$1,500', paid: '$0', balance: '$1,500', status: 'متأخر' },
  ];

  const ledgers = invoices && invoices.length > 0 ? invoices.map(l => ({
    name: l.student?.user?.name || "بدون اسم",
    grade: l.student?.studentNumber || "N/A",
    total: `$${(l.totalAmount || 0).toLocaleString()}`,
    paid: `$${(l.paidAmount || 0).toLocaleString()}`,
    balance: `$${(l.balance || 0).toLocaleString()}`,
    status: l.status === 'PAID' ? 'مسدد بالكامل' : l.status === 'PARTIAL' ? 'مسدد جزئياً' : 'متأخر'
  })) : defaultLedgers;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">حسابات الطلاب المالية</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">متابعة الأرصدة، الأقساط، والحالات المالية لكل طالب</p>
        </div>
        <button className="px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-2 shadow-sm border border-slate-200/80">
           <Download className="w-4 h-4" /> تصدير كشف حساب
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
         <table className="w-full text-right shrink-0 border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الطالب / الصف</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">إجمالي الرسوم</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">المدفوع</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الرصيد المتبقي</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الإجراءات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {ledgers.map((l, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                     <span className="text-[14px] font-bold text-slate-900 block">{l.name}</span>
                     <span className="text-[12px] font-semibold text-slate-500 block mt-0.5">{l.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] font-mono font-bold text-slate-600 bg-slate-50/30">{l.total}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-mono font-bold text-emerald-600">{l.paid}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-mono font-bold text-rose-600 bg-rose-50/30">{l.balance}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-md border shadow-sm tracking-wide", 
                      l.status === 'مسدد بالكامل' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                      l.status === 'متأخر' ? "bg-rose-50 text-rose-800 border-rose-100" : 
                      "bg-amber-50 text-amber-800 border-amber-100"
                    )}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[12px] font-bold text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 px-4 py-2 rounded-lg border border-emerald-100 hover:border-emerald-600 transition-all shadow-sm">تفاصيل</button>
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
