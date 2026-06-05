'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bus, Users, MapPin, Navigation, Clock, ShieldAlert,
  Wrench, Bell, AlertTriangle, CheckCircle2, ChevronRight,
  Search, Plus, Map, Route, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transportData, setTransportData] = useState<any>({ stats: {}, vehicles: [], routes: [], assignments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch('/api/transport');
        const json = await res.json();
        if (json.success && json.data) setTransportData(json.data);
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
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-3.5 rounded-xl text-amber-600 border border-amber-200/50 shadow-sm shadow-amber-100">
             <Bus className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">إدارة النقل المدرسي</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">إشراف كامل على الحافلات، السائقين، خطوط السير، والرحلات اليومية</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm transition-all">
             <option>العام الدراسي 2026/2027</option>
          </select>
          <select className="px-4 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm transition-all">
             <option>الفترة: صباحي (ذهاب)</option>
             <option>الفترة: مسائي (عودة)</option>
          </select>
          <div className="relative min-w-[240px] flex-1 xl:flex-none">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث عن حافلة، طالب، مسار..." 
              className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-slate-200/80 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-slate-700 shadow-sm transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="الطلاب المشتركين" value={transportData.stats?.totalAssignedStudents || 0} subtitle="في خدمة النقل المدرسي" icon={<Users className="w-4.5 h-4.5 text-blue-500" />} color="bg-blue-50 border-blue-100" />
        <StatCard title="الحافلات العاملة الآن" value={transportData.stats?.activeVehicles || 0} subtitle={`من أصل ${transportData.stats?.totalVehicles || 0} حافلة`} icon={<Activity className="w-4.5 h-4.5 text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
        <StatCard title="خطوط السير النشطة" value={transportData.stats?.routesCount || 0} subtitle="مسارات معتمدة" icon={<Route className="w-4.5 h-4.5 text-indigo-500" />} color="bg-indigo-50 border-indigo-100" />
        <StatCard title="تنبيهات وتأخيرات" value="0" subtitle="حالة مستقرة" icon={<AlertTriangle className="w-4.5 h-4.5 text-amber-500" />} color="bg-amber-50 border-amber-100" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">النقل المدرسي</h3>
            </div>
            <div className="p-3 space-y-1">
              <NavItem icon={<Activity/>} label="اللوحة الرئيسية" id="dashboard" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<Bus/>} label="إدارة الحافلات" id="fleet" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Users/>} label="السائقون والمشرفون" id="staff" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<Map/>} label="خطوط السير (Routes)" id="routes" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Navigation/>} label="التتبع المباشر (GPS)" id="tracking" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Clock/>} label="الرحلات اليومية" id="trips" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<MapPin/>} label="تسجيل الصعود والنزول" id="boarding" active={activeTab} onClick={setActiveTab} />
              <div className="h-px bg-slate-100 my-2 mx-2"></div>
              <NavItem icon={<ShieldAlert/>} label="السلامة والحوادث" id="safety" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={<Wrench/>} label="الصيانة والوقود" id="maintenance" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {loading ? (
             <div className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
                <h3 className="text-lg font-bold text-slate-800">جاري تحميل بيانات النقل...</h3>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && <DashboardModule key="dashboard" />}
              {activeTab === 'fleet' && <FleetModule key="fleet" vehicles={transportData.vehicles} />}
              {activeTab === 'routes' && <RoutesModule key="routes" routes={transportData.routes} />}
              {activeTab === 'tracking' && <TrackingModule key="tracking" />}
              {activeTab === 'staff' && <StaffModule key="staff" />}
              {activeTab === 'trips' && <TripsModule key="trips" />}
              {activeTab === 'maintenance' && <MaintenanceModule key="maintenance" />}
              {activeTab === 'boarding' && <BoardingModule key="boarding" assignments={transportData.assignments} />}
              {activeTab === 'safety' && <SafetyModule key="safety" />}
              
              {!['dashboard', 'fleet', 'routes', 'tracking', 'staff', 'trips', 'maintenance', 'boarding', 'safety'].includes(activeTab) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="placeholder" className="bg-white border border-slate-200/80 rounded-2xl p-20 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col items-center justify-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 border border-slate-200/60 shadow-inner">
                      <Bus className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">مسار غير معرف في النقل المدرسي</h3>
                   <p className="text-slate-500 max-w-md mx-auto text-[13px] font-medium leading-relaxed">المفتاح ({activeTab}) غير مرتبط بتبويب نقل نشط، استخدم وحدات الحافلات والمسارات من القائمة الجانبية.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
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
          ? "bg-amber-50 text-amber-700 shadow-sm border border-amber-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      )}
    >
      {React.cloneElement(icon, { className: cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-amber-600" : "text-slate-400 group-hover:text-amber-500") })}
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 mr-auto text-amber-400" />}
    </button>
  );
}

// ------------------------------------------------------------------
// Modules
// ------------------------------------------------------------------

function DashboardModule() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
         <h3 className="text-[17px] font-bold text-slate-900 mb-5 font-display">الرحلات النشطة الآن</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TripCard bus="B-01" route="خط السالمية - حولي" driver="محمد أحمد" status="في الطريق" progress={65} students={22} nextStop="دوار الجوازات" />
            <TripCard bus="B-04" route="خط مشرف - بيان" driver="سيد محمود" status="تأخير بسيط" progress={40} students={18} nextStop="جمعية مشرف" delayed />
         </div>
      </motion.div>
    </div>
  );
}

function TripCard({ bus, route, driver, status, progress, students, nextStop, delayed }: any) {
  return (
    <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300/80 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-slate-800 text-white font-mono text-[11px] px-2.5 py-1 rounded-md font-bold tracking-wider">{bus}</span>
            <span className="font-bold text-[15px] text-slate-900">{route}</span>
          </div>
          <p className="text-[13px] font-medium text-slate-500">السائق: <span className="text-slate-700">{driver}</span></p>
        </div>
        <span className={cn("text-[11px] font-bold px-3 py-1.5 rounded-md border shadow-sm", delayed ? "bg-amber-50 text-amber-800 border-amber-200/60" : "bg-emerald-50 text-emerald-800 border-emerald-200/60")}>
          {status}
        </span>
      </div>
      
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase tracking-widest">
          <span>اكتمل {progress}%</span>
          <span>{students} طالب</span>
        </div>
        <div className="h-2.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
          <div className={cn("h-full rounded-full transition-all", delayed ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]")} style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      <div className="flex items-center gap-2.5 text-[13px] font-semibold text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80 shadow-sm">
        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
        <span className="truncate">المحطة القادمة: <span className="text-slate-900 font-bold">{nextStop}</span></span>
      </div>
    </div>
  );
}

function FleetModule({ vehicles }: { vehicles: any[] }) {
  const buses = vehicles.length > 0 ? vehicles.map(v => ({
    code: v.id.substring(0, 8),
    plate: v.plateNumber,
    capacity: v.capacity,
    used: 0,
    type: v.type,
    driver: v.driverName || '-',
    status: v.status === 'ACTIVE' ? 'نشطة' : v.status === 'MAINTENANCE' ? 'صيانة' : 'غير نشطة'
  })) : [
    { code: 'B-01', plate: '1234 ص ب م', capacity: 30, used: 22, type: 'تويوتا كوستر 2023', driver: 'محمد أحمد', status: 'في رحلة' },
    { code: 'B-02', plate: '9876 أ م د', capacity: 25, used: 25, type: 'نيسان مدني 2022', driver: 'خالد حسين', status: 'نشطة - متوقفة' },
    { code: 'B-03', plate: '4567 ل س س', capacity: 30, used: 0, type: 'تويوتا كوستر 2021', driver: '-', status: 'صيانة' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">إدارة أسطول الحافلات</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">مراقبة سعة وحالة مركبات النقل المدرسي</p>
        </div>
        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-colors border border-transparent">
           <Plus className="w-4 h-4" /> إضافة حافلة
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
         <table className="w-full text-right shrink-0 border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الرمز</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-right">رقم اللوحة / النوع</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">السعة (مستخدم/كلي)</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">السائق الحالي</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {buses.map((bus, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-slate-500 text-[14px]">{bus.code}</td>
                  <td className="px-6 py-4">
                    <span className="block font-bold text-slate-900 text-[15px] tracking-widest">{bus.plate}</span>
                    <span className="block text-[12px] text-slate-500 mt-1">{bus.type}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-md text-[13px] font-mono font-bold text-slate-700 border border-slate-200/60 shadow-sm">
                      <span className={cn(bus.used >= bus.capacity ? "text-rose-600" : "text-slate-900")}>{bus.used}</span>
                      <span className="text-slate-400">/</span>
                      <span>{bus.capacity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-slate-800">{bus.driver}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("text-[11px] font-bold px-3 py-1.5 rounded-md border shadow-sm", 
                      bus.status.includes('رحلة') ? "bg-emerald-50 text-emerald-800 border-emerald-200/60" : 
                      bus.status.includes('صيانة') ? "bg-rose-50 text-rose-800 border-rose-200/60" : 
                      "bg-blue-50 text-blue-800 border-blue-200/60"
                    )}>
                      {bus.status}
                    </span>
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

function RoutesModule({ routes: apiRoutes }: { routes: any[] }) {
  const routes = apiRoutes.length > 0 ? apiRoutes.map(r => ({
    id: r.id.substring(0, 8),
    name: r.name,
    stations: r.assignments?.length || 0,
    bus: r.vehicle?.plateNumber || '-',
    time: r.startTime || 'غير محدد',
  })) : [
    { id: "R-01", name: "خط السالمية - حولي", stations: 12, bus: "B-01", time: "06:30 ص" },
    { id: "R-02", name: "خط مشرف - بيان", stations: 8, bus: "B-04", time: "06:45 ص" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">إدارة خطوط السير والمحطات</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">قائمة المسارات المعرفة وتعيين الحافلات لها</p>
        </div>
        <button className="px-4 py-2.5 bg-amber-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-amber-600/20 hover:bg-amber-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> إضافة مسار جديد
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
         <table className="w-full text-right shrink-0 border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">الرمز</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">اسم المسار</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">عدد المحطات</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحافلة المرتبطة</th>
                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-center">وقت الانطلاق</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {routes.map((r, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-slate-500 text-[14px]">{r.id}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{r.name}</td>
                  <td className="px-6 py-4 text-center text-[14px] font-bold text-emerald-600">{r.stations} محطات</td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-[13px] text-slate-700">{r.bus}</td>
                  <td className="px-6 py-4 text-center font-mono font-semibold text-[13px] text-slate-500">{r.time}</td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </motion.div>
  );
}

function StaffModule() {
  const staffList = [
    { name: "محمد أحمد", role: "سائق", phone: "0501112223", licenseValid: true },
    { name: "خالد حسين", role: "سائق", phone: "0563334445", licenseValid: true },
    { name: "سعاد علي", role: "مشرفة حافلة", phone: "0559998887", licenseValid: null },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
         <div>
            <h3 className="text-[17px] font-bold text-slate-900 font-display">السائقون والمشرفون</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">إدارة طاقم النقل ومتابعة صلاحية الرخص</p>
         </div>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
           <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الاسم</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase">الدور</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">رقم الهاتف</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase text-center">الرخصة</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {staffList.map((s, i) => (
               <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-slate-900">{s.name}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{s.role}</td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-500 font-mono">{s.phone}</td>
                  <td className="px-6 py-4 text-center">
                     {s.licenseValid === true && <span className="px-2.5 py-1 rounded text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">سارية</span>}
                     {s.licenseValid === false && <span className="px-2.5 py-1 rounded text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-100">منتهية</span>}
                     {s.licenseValid === null && <span className="text-slate-300">-</span>}
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function TripsModule() {
  const trips = [
    { id: 'TR-0501', date: '2026-10-15', bus: 'B-01', route: 'خط السالمية - حولي', driver: 'محمد أحمد', period: 'صباحي (ذهاب)', departure: '06:30', arrival: '07:25', students: 22, status: 'مكتمل', delay: 0 },
    { id: 'TR-0502', date: '2026-10-15', bus: 'B-04', route: 'خط مشرف - بيان', driver: 'سيد محمود', period: 'صباحي (ذهاب)', departure: '06:45', arrival: '07:50', students: 18, status: 'مكتمل بتأخير', delay: 15 },
    { id: 'TR-0503', date: '2026-10-15', bus: 'B-02', route: 'خط الأحمدي - الفحيحيل', driver: 'خالد حسين', period: 'صباحي (ذهاب)', departure: '06:30', arrival: '07:20', students: 25, status: 'مكتمل', delay: 0 },
    { id: 'TR-0504', date: '2026-10-14', bus: 'B-01', route: 'خط السالمية - حولي', driver: 'محمد أحمد', period: 'مسائي (عودة)', departure: '14:00', arrival: '15:10', students: 20, status: 'مكتمل', delay: 0 },
    { id: 'TR-0505', date: '2026-10-14', bus: 'B-04', route: 'خط مشرف - بيان', driver: 'سيد محمود', period: 'مسائي (عودة)', departure: '14:00', arrival: '15:25', students: 17, status: 'ملغى', delay: 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">سجل الرحلات اليومية</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">تاريخ وأرشيف جميع الرحلات مع تقييم الأداء والالتزام بالمواعيد</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" defaultValue="2026-10-15" className="px-4 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 shadow-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" />
          <select className="px-3 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 shadow-sm outline-none">
            <option>كل الفترات</option>
            <option>صباحي (ذهاب)</option>
            <option>مسائي (عودة)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-slate-500 text-[11px] font-bold uppercase mb-1">إجمالي الرحلات اليوم</h4>
          <div className="text-2xl font-bold text-slate-900 font-mono">24</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-emerald-600 text-[11px] font-bold uppercase mb-1">مكتملة في الموعد</h4>
          <div className="text-2xl font-bold text-emerald-600 font-mono">21</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-amber-600 text-[11px] font-bold uppercase mb-1">تأخير</h4>
          <div className="text-2xl font-bold text-amber-600 font-mono">2</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-rose-600 text-[11px] font-bold uppercase mb-1">ملغاة</h4>
          <div className="text-2xl font-bold text-rose-600 font-mono">1</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right shrink-0 border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">رقم الرحلة</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">الحافلة / المسار</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">الفترة</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">الانطلاق → الوصول</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">الطلاب</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((trip, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-[13px] text-slate-500 block">{trip.id}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{trip.date}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">{trip.bus}</span>
                      <span className="font-bold text-[13px] text-slate-900">{trip.route}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">السائق: {trip.driver}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-[12px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">{trip.period}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-mono font-bold text-[13px] text-slate-700">
                      {trip.departure} <span className="text-slate-300 mx-1">→</span> {trip.arrival}
                    </span>
                    {trip.delay > 0 && <span className="block text-[11px] text-amber-600 font-bold mt-0.5">+{trip.delay} دقيقة تأخير</span>}
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-[14px] text-slate-800">{trip.students}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={cn("text-[11px] font-bold px-2.5 py-1.5 rounded-md border shadow-sm",
                      trip.status === 'مكتمل' ? "bg-emerald-50 text-emerald-800 border-emerald-200/60" :
                      trip.status === 'مكتمل بتأخير' ? "bg-amber-50 text-amber-800 border-amber-200/60" :
                      "bg-rose-50 text-rose-800 border-rose-200/60"
                    )}>
                      {trip.status}
                    </span>
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

function MaintenanceModule() {
  const records = [
    { id: 'MNT-101', bus: 'B-03', type: 'فحص فني دوري', date: '2026-10-10', cost: '450', status: 'مكتمل', nextDate: '2027-01-10', mechanic: 'ورشة المتحدة' },
    { id: 'MNT-102', bus: 'B-01', type: 'تغيير زيت وفلاتر', date: '2026-10-05', cost: '120', status: 'مكتمل', nextDate: '2027-01-05', mechanic: 'ورشة السالمية' },
    { id: 'MNT-103', bus: 'B-04', type: 'إصلاح نظام التبريد', date: '2026-10-12', cost: '800', status: 'قيد التنفيذ', nextDate: '-', mechanic: 'ورشة المتحدة' },
    { id: 'MNT-104', bus: 'B-02', type: 'تغيير إطارات أمامية', date: '2026-09-28', cost: '340', status: 'مكتمل', nextDate: '2027-09-28', mechanic: 'ورشة بيان' },
  ];

  const fuelLog = [
    { bus: 'B-01', liters: 85, cost: '25.5', date: '2026-10-14', odometer: '45,230 كم' },
    { bus: 'B-02', liters: 70, cost: '21.0', date: '2026-10-14', odometer: '38,100 كم' },
    { bus: 'B-04', liters: 90, cost: '27.0', date: '2026-10-13', odometer: '52,800 كم' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">الصيانة واستهلاك الوقود</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">متابعة الفحص الفني الدوري، طلبات الصيانة الطارئة، وسجل تعبئة الوقود</p>
        </div>
        <button className="px-4 py-2.5 bg-amber-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-amber-600/20 hover:bg-amber-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> طلب صيانة جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-slate-500 text-[11px] font-bold uppercase mb-1">إجمالي تكاليف الصيانة</h4>
          <div className="text-xl font-bold text-slate-900 font-mono">1,710 <span className="text-sm text-slate-400">د.ك</span></div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">هذا الشهر</p>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-emerald-600 text-[11px] font-bold uppercase mb-1">حافلات جاهزة</h4>
          <div className="text-xl font-bold text-emerald-600 font-mono">12 <span className="text-sm text-slate-400">/ 15</span></div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-amber-600 text-[11px] font-bold uppercase mb-1">في الصيانة</h4>
          <div className="text-xl font-bold text-amber-600 font-mono">2</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-blue-600 text-[11px] font-bold uppercase mb-1">إجمالي الوقود الشهري</h4>
          <div className="text-xl font-bold text-blue-600 font-mono">2,450 <span className="text-sm text-slate-400">لتر</span></div>
        </div>
      </div>

      {/* Maintenance Records */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <h3 className="font-bold text-slate-800 text-[14px]">سجل الصيانة والإصلاحات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right shrink-0 border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase">رقم الطلب</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase">الحافلة</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase">نوع الصيانة</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">التاريخ</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">التكلفة</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">الحالة</th>
                <th className="px-5 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">الموعد القادم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-[12px] text-slate-500">{r.id}</td>
                  <td className="px-5 py-3.5"><span className="bg-slate-800 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">{r.bus}</span></td>
                  <td className="px-5 py-3.5 font-bold text-[13px] text-slate-800">{r.type}</td>
                  <td className="px-5 py-3.5 text-center font-mono text-[12px] text-slate-600">{r.date}</td>
                  <td className="px-5 py-3.5 text-center font-mono font-bold text-[13px] text-emerald-600">{r.cost} د.ك</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-md border",
                      r.status === 'مكتمل' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-[12px] text-slate-500">{r.nextDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fuel Log */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <h3 className="font-bold text-slate-800 text-[14px]">سجل تعبئة الوقود</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right shrink-0 border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 uppercase">الحافلة</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">الكمية (لتر)</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">التكلفة (د.ك)</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">التاريخ</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 uppercase text-center">عداد المسافة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fuelLog.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5"><span className="bg-slate-800 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">{f.bus}</span></td>
                  <td className="px-6 py-3.5 text-center font-mono font-bold text-[14px] text-blue-600">{f.liters}</td>
                  <td className="px-6 py-3.5 text-center font-mono font-bold text-[13px] text-emerald-600">{f.cost}</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[12px] text-slate-600">{f.date}</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[12px] text-slate-500">{f.odometer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function TrackingModule() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-center border border-slate-800 overflow-hidden relative min-h-[450px] flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Kuwait&zoom=11&size=800x400&sensor=false&style=feature:all|element:labels|visibility:off&style=feature:water|color:0x1a1a2e&style=feature:landscape|color:0x16213e&style=feature:road|color:0x0f3460')] opacity-40 bg-cover bg-center mix-blend-screen" />
         <div className="relative z-10 w-full max-w-lg mx-auto bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-white/5">
           <Navigation className="w-16 h-16 text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
           <h3 className="text-2xl font-bold text-white mb-3 font-display tracking-tight">واجهة التتبع المباشر (GPS)</h3>
           <p className="text-slate-300 text-[13px] font-medium leading-relaxed max-w-sm mx-auto">نظام الخرائط قيد المعاينة في بيئة المطورين. يتطلب ربط مفتاح Google Maps API للعمل بكامل الميزات.</p>
           <button className="mt-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors border border-transparent shadow-[0_4px_14px_rgba(16,185,129,0.4)]">
              محاكاة حركة الحافلات
           </button>
         </div>
      </div>
    </motion.div>
  );
}

function BoardingModule({ assignments }: { assignments: any[] }) {
  const boardingRecords = assignments.length > 0 ? assignments.map(a => ({
    student: a.student?.user?.name || 'بدون اسم',
    grade: 'مسجل',
    bus: a.route?.name || '-',
    station: a.pickupPoint || 'غير محدد',
    boardTime: '-',
    alightTime: '-',
    status: 'في الحافلة'
  })) : [
    { student: 'أحمد محمد عبدالعزيز', grade: 'السادس - أ', bus: 'B-01', station: 'محطة السالمية الرئيسية', boardTime: '06:42', alightTime: '07:18', status: 'وصل المدرسة' },
    { student: 'سارة فهد العلي', grade: 'الخامس - ب', bus: 'B-01', station: 'دوار الجوازات', boardTime: '06:50', alightTime: '07:18', status: 'وصل المدرسة' },
    { student: 'عمر خالد السعيد', grade: 'الرابع - أ', bus: 'B-04', station: 'جمعية مشرف', boardTime: '07:00', alightTime: '-', status: 'في الحافلة' },
    { student: 'نورة سعد الحربي', grade: 'الثاني - ب', bus: 'B-04', station: 'بيان - بلوك 5', boardTime: '07:05', alightTime: '-', status: 'في الحافلة' },
    { student: 'فيصل ياسر الغامدي', grade: 'السادس - أ', bus: 'B-01', station: 'محطة حولي المركزية', boardTime: '-', alightTime: '-', status: 'لم يصعد' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">تسجيل الصعود والنزول</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">تتبع صعود ونزول كل طالب في محطته مع التوقيت الدقيق</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" defaultValue="2026-10-15" className="px-4 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 shadow-sm outline-none" />
          <select className="px-3 py-2.5 border border-slate-200/80 rounded-lg text-[13px] font-bold bg-slate-50 text-slate-700 shadow-sm outline-none">
            <option>كل الحافلات</option>
            <option>B-01</option>
            <option>B-02</option>
            <option>B-04</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-emerald-600 text-[11px] font-bold uppercase mb-1">وصلوا المدرسة</h4>
          <div className="text-2xl font-bold text-emerald-600 font-mono">284 <span className="text-sm text-slate-400">/ 426</span></div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-blue-600 text-[11px] font-bold uppercase mb-1">في الحافلات الآن</h4>
          <div className="text-2xl font-bold text-blue-600 font-mono">98</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-rose-600 text-[11px] font-bold uppercase mb-1">لم يصعدوا</h4>
          <div className="text-2xl font-bold text-rose-600 font-mono">44</div>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">تم إرسال إشعار لأولياء الأمور</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right shrink-0 border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">الطالب / الصف</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحافلة</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">المحطة</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">وقت الصعود</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">وقت النزول</th>
                <th className="px-5 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {boardingRecords.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-bold text-[13px] text-slate-900 block">{r.student}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{r.grade}</span>
                  </td>
                  <td className="px-5 py-4 text-center"><span className="bg-slate-800 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">{r.bus}</span></td>
                  <td className="px-5 py-4 text-[13px] font-medium text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {r.station}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-mono font-semibold text-[13px] text-slate-600">{r.boardTime}</td>
                  <td className="px-5 py-4 text-center font-mono font-semibold text-[13px] text-slate-600">{r.alightTime}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={cn("text-[11px] font-bold px-2.5 py-1.5 rounded-md border shadow-sm whitespace-nowrap",
                      r.status === 'وصل المدرسة' ? "bg-emerald-50 text-emerald-800 border-emerald-200/60" :
                      r.status === 'في الحافلة' ? "bg-blue-50 text-blue-800 border-blue-200/60" :
                      "bg-rose-50 text-rose-800 border-rose-200/60"
                    )}>
                      {r.status}
                    </span>
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

function SafetyModule() {
  const incidents = [
    { id: 'INC-001', date: '2026-10-12', bus: 'B-04', type: 'حادث مروري بسيط', severity: 'منخفض', driver: 'سيد محمود', description: 'احتكاك جانبي بسيط بمركبة متوقفة، لا إصابات', status: 'مغلق', action: 'تقرير تأميني مقدم' },
    { id: 'INC-002', date: '2026-10-08', bus: 'B-01', type: 'سلوك طالب', severity: 'متوسط', driver: 'محمد أحمد', description: 'شجار بين طالبين داخل الحافلة أثناء الرحلة', status: 'مفتوح', action: 'استدعاء أولياء الأمور' },
    { id: 'INC-003', date: '2026-09-25', bus: 'B-02', type: 'عطل فني مفاجئ', severity: 'عالي', driver: 'خالد حسين', description: 'توقف المحرك أثناء الرحلة الصباحية، تم نقل الطلاب بحافلة بديلة', status: 'مغلق', action: 'تحويل للصيانة الشاملة' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 font-display">السلامة والبلاغات</h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">سجل الحوادث والبلاغات المرورية ومؤشرات أمان الأسطول</p>
        </div>
        <button className="px-4 py-2.5 bg-rose-600 text-white rounded-lg text-[13px] font-bold shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-colors flex items-center gap-2 border border-transparent">
          <Plus className="w-4 h-4" /> تسجيل حادثة / بلاغ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-slate-500 text-[11px] font-bold uppercase mb-1">إجمالي الحوادث (هذا الفصل)</h4>
          <div className="text-2xl font-bold text-slate-900 font-mono">3</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-emerald-600 text-[11px] font-bold uppercase mb-1">أيام بدون حوادث</h4>
          <div className="text-2xl font-bold text-emerald-600 font-mono">18</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-amber-600 text-[11px] font-bold uppercase mb-1">بلاغات مفتوحة</h4>
          <div className="text-2xl font-bold text-amber-600 font-mono">1</div>
        </div>
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <h4 className="text-blue-600 text-[11px] font-bold uppercase mb-1">معدل السلامة</h4>
          <div className="text-2xl font-bold text-blue-600 font-mono">97.8%</div>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((inc, i) => (
          <div key={i} className={cn(
            "bg-white border rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-md relative overflow-hidden",
            inc.severity === 'عالي' ? "border-rose-200/80" : inc.severity === 'متوسط' ? "border-amber-200/80" : "border-slate-200/80"
          )}>
            <div className={cn(
              "absolute top-0 right-0 w-1.5 h-full",
              inc.severity === 'عالي' ? "bg-rose-500" : inc.severity === 'متوسط' ? "bg-amber-400" : "bg-emerald-400"
            )} />
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono font-bold text-[12px] text-slate-400">{inc.id}</span>
                  <span className="bg-slate-800 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">{inc.bus}</span>
                  <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-md border",
                    inc.severity === 'عالي' ? "bg-rose-50 text-rose-700 border-rose-100" :
                    inc.severity === 'متوسط' ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-emerald-50 text-emerald-700 border-emerald-100"
                  )}>خطورة: {inc.severity}</span>
                  <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-md border",
                    inc.status === 'مفتوح' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-100 text-slate-600 border-slate-200"
                  )}>{inc.status}</span>
                </div>
                <h3 className="font-bold text-[15px] text-slate-900 mb-1">{inc.type}</h3>
                <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{inc.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-[12px] text-slate-500 font-semibold">
                  <span>📅 {inc.date}</span>
                  <span>🚌 السائق: {inc.driver}</span>
                  <span>📋 الإجراء: <span className="text-slate-700 font-bold">{inc.action}</span></span>
                </div>
              </div>
              {inc.status === 'مفتوح' && (
                <button className="text-[12px] font-bold text-white bg-slate-800 hover:bg-slate-900 px-4 py-2 rounded-lg shadow-sm transition-colors shrink-0">متابعة وإغلاق</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
