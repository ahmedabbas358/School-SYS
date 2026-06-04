'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, TrendingUp, AlertCircle, Clock, ArrowUpRight, ArrowDownRight,
  Briefcase, Calendar, CheckSquare, BellRing, RefreshCcw, Download, Info, ShieldAlert,
  PieChart, BarChart3, LineChart, DollarSign, Wallet, MoreHorizontal, GraduationCap, Building2,
  CalendarDays,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const fallbackFinanceData = [
  { month: 'سبتمبر', revenue: 120000, expenses: 85000 },
  { month: 'أكتوبر', revenue: 145000, expenses: 90000 },
  { month: 'نوفمبر', revenue: 210000, expenses: 110000 },
  { month: 'ديسمبر', revenue: 180000, expenses: 95000 },
  { month: 'يناير', revenue: 155000, expenses: 88000 },
  { month: 'فبراير', revenue: 250000, expenses: 105000 },
];

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    loadData();
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const financeData = data?.financeData?.length > 0 ? data.financeData : fallbackFinanceData;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">نظرة عامة</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">مرحباً بك في نظام Nexus، نقدم لك أحدث المؤشرات التحليلية.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-white border border-slate-200/80 text-slate-600 rounded-md text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-2"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} /> تحديث
          </button>
          <button className="px-4 py-2 bg-blue-600 border border-blue-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center gap-2">
            <Download className="w-4 h-4" /> تقرير الإدارة
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="الطلاب المقيدين" value={data?.kpi?.studentsCount || 0} change="+2" isPositive trend="الطلاب المسجلين" icon={Users} color="blue" />
        <MetricCard title="متوسط الحضور" value={`${data?.kpi?.presentRate || 0}%`} change="+1%" isPositive trend="متوسط اليوم" icon={CalendarDays} color="emerald" />
        <MetricCard title="الإيرادات الشهرية" value={`$${((data?.kpi?.monthlyRevenue || 0) / 1000).toFixed(1)}K`} change="+5%" isPositive trend="مقارنة بالشهر الماضي" icon={Wallet} color="indigo" />
        <MetricCard title="تنبيهات أكاديمية وسلوكية" value={data?.kpi?.alertsCount || 0} change="-1" isPositive={false} trend="طلاب بحاجة لدعم" icon={ShieldAlert} color="rose" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column (Charts & Tables) */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          
          {/* Revenue Chart */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-[400px] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">التدفقات المالية</h3>
              </div>
              <div className="flex gap-2 bg-slate-100/80 p-1 rounded-md text-xs font-semibold">
                <button className="px-3 py-1 bg-white text-slate-800 shadow-sm rounded">شهري</button>
                <button className="px-3 py-1 text-slate-500 hover:text-slate-800 rounded transition-colors">فصلي</button>
              </div>
            </div>
            <div className="flex-1 w-full p-5" dir="ltr">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E2E8F0" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#E2E8F0" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                      itemStyle={{ fontWeight: 600, fontSize: '13px' }}
                      labelStyle={{ color: '#64748B', marginBottom: '4px', fontSize: '12px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" name="الإيرادات المحصلة" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" name="المصروفات" dataKey="expenses" stroke="#94A3B8" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">أحدث العمليات الإدارية</h3>
              <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">عرض السجل كاملاً &rarr;</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right shrink-0 border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/80">
                    <th className="px-5 py-3.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">الإجراء</th>
                    <th className="px-5 py-3.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">المستخدم</th>
                    <th className="px-5 py-3.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">الحالة</th>
                    <th className="px-5 py-3.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-500">جاري التحميل...</td>
                    </tr>
                  ) : data?.activities?.length > 0 ? (
                    data.activities.map((act: any, idx: number) => (
                      <ActivityRow key={idx} action={act.action} user={act.user} status={act.status} date={act.date} />
                    ))
                  ) : (
                    <>
                      <ActivityRow action="تسجيل طالب جديد (يزن محمد)" user="القبول والتسجيل" status="success" date="قبل 10 دقائق" />
                      <ActivityRow action="تحصيل رسوم دراسية (دفعة 1)" user="المحاسب العام" status="success" date="قبل ساعة" />
                      <ActivityRow action="اعتماد جدول اختبارات (الثانوي)" user="الشؤون الأكاديمية" status="pending" date="قبل ساعتين" />
                      <ActivityRow action="تم إلغاء حصة رياضيات (الصف 4)" user="النظام التلقائي" status="warning" date="اليوم 08:00 ص" />
                      <ActivityRow action="صرف رواتب الموظفين (فبراير)" user="مدير الموارد البشرية" status="success" date="أمس" />
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6 lg:space-y-8">
          {/* Quick Actions */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-widest font-mono">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={UserPlus} label="طالب جديد" />
              <ActionButton icon={FileText} label="إنشاء فاتورة" />
              <ActionButton icon={Calendar} label="تعديل جدول" />
              <ActionButton icon={BellRing} label="إرسال تعميم" />
            </div>
          </div>

          {/* To Do / Notifications */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-[400px]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">التنبيهات والمراجعات</h3>
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">3</div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <TaskItem 
                title="مراجعة طلبات التوظيف (قسم العلوم)" 
                desc="تم تقديم 4 طلبات جديدة تحتاج للمراجعة المبدئية." 
                time="عاجل" 
                isUrgent 
              />
              <TaskItem 
                title="نواقص في بيانات المعلمين" 
                desc="يوجد معلمين لم يكملوا إرفاق المؤهلات الطبية." 
                time="خلال يومين" 
              />
              <TaskItem 
                title="صيانة مستعجلة للمختبر B" 
                desc="توقف جهاز التبريد، تم رفع طلب من مسؤول المختبر." 
                time="جاري المعالجة" 
                isOngoing
              />
              <TaskItem 
                title="اعتماد خصومات الطلاب المتفوقين" 
                desc="هناك 12 طلب خصم معلق من الإدارة الأكاديمية." 
                time="قيد الانتظار" 
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

// ---------------------------
// Components
// ---------------------------

function MetricCard({ title, value, change, isPositive, trend, icon: Icon, color }: any) {
  const iconColorClass = 
    color === 'blue' ? 'text-blue-600 bg-blue-50 border-blue-100' :
    color === 'emerald' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
    color === 'indigo' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
    'text-rose-600 bg-rose-50 border-rose-100';

  const changeColorClass = isPositive ? 'text-emerald-600' : 'text-rose-600';

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] group">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-slate-500 font-medium text-sm">{title}</h4>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-105", iconColorClass)}>
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900 mb-2">{value}</h2>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5", 
            isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
          <span className="text-xs text-slate-400 font-medium">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-200/80 bg-white hover:border-blue-200 hover:bg-blue-50/50 transition-all text-slate-600 hover:text-blue-700 group">
      <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" strokeWidth={2} />
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  );
}

function ActivityRow({ action, user, status, date }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-5 py-4">
        <p className="text-[13px] font-bold text-slate-800">{action}</p>
      </td>
      <td className="px-5 py-4">
        <p className="text-[13px] font-medium text-slate-500">{user}</p>
      </td>
      <td className="px-5 py-4">
        {status === 'success' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>مكتمل</span>}
        {status === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>قيد المراجعة</span>}
        {status === 'warning' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>استثناء</span>}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-slate-400 font-medium">{date}</p>
          <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function TaskItem({ title, desc, time, isUrgent, isOngoing }: any) {
  return (
    <div className="p-3.5 m-1 rounded-lg hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
      <div className="flex justify-between items-start mb-1.5">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", 
          isUrgent ? "text-rose-600 bg-rose-50 border-rose-100" :
          isOngoing ? "text-blue-600 bg-blue-50 border-blue-100" :
          "text-slate-500 bg-slate-100 border-slate-200"
        )}>
          {time}
        </span>
      </div>
      <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

