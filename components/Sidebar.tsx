"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  BookOpen,
  GraduationCap,
  Briefcase,
  CreditCard,
  ShoppingCart,
  Building2,
  Library,
  MessageSquare,
  PieChart,
  Settings,
  ChevronDown,
  Bus,
  Search,
  School,
  Database,
  Calendar,
  Layers,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

const navGroups = [
  {
    title: "الرئيسية",
    items: [
      { name: "لوحة القيادة", href: "/", icon: LayoutDashboard },
    ]
  },
  {
    title: "العمليات الأساسية",
    items: [
      { name: "شؤون الطلاب", href: "/students", icon: Users },
      { name: "الحضور والانصراف", href: "/attendance", icon: Calendar },
      { name: "الإدارة الأكاديمية", href: "/academic", icon: School },
      { name: "الجداول الدراسية", href: "/timetable", icon: BookOpen },
      { name: "النتائج والتدرج", href: "/exams", icon: GraduationCap },
    ]
  },
  {
    title: "العمليات الإدارية",
    items: [
      { name: "الشؤون المالية", href: "/finance", icon: CreditCard },
      { name: "الموارد البشرية", href: "/hr", icon: Briefcase },
      { name: "النقل المدرسي", href: "/transport", icon: Bus },
      { name: "المشتريات", href: "/procurement", icon: ShoppingCart },
      { name: "إدارة المرافق", href: "/assets", icon: Building2 },
    ]
  },
  {
    title: "التحليلات والإعدادات",
    items: [
      { name: "التقارير المتقدمة", href: "/reports", icon: PieChart },
      { name: "الصلاحيات والأدوار", href: "/admin", icon: Database },
      { name: "إعدادات النظام", href: "/settings", icon: Settings },
    ]
  }
];

import { LogoutButton } from "@/components/LogoutButton";
import { getRoleLabel } from "@/lib/auth";

export function Sidebar({ isMobileOpen, onMobileClose, user }: { isMobileOpen?: boolean, onMobileClose?: () => void, user?: any }) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={onMobileClose} />
      )}
      <div className={cn(
        "fixed top-0 right-0 h-screen w-64 bg-slate-900 flex flex-col border-l border-slate-800 transition-transform duration-300 z-50",
        isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-[15px] tracking-wide">
              Nexus ERP
            </span>
          </div>
        </div>

        {/* Global Search Mobile (optional) */}
        <div className="px-4 py-4 lg:hidden shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث سريع..." 
              className="w-full pl-3 pr-9 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                {group.title}
              </h4>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group relative",
                        isActive
                          ? "text-white bg-blue-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-[18px] h-[18px] shrink-0 transition-colors",
                          isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <LogoutButton />
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-white/5 bg-slate-900 shrink-0">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-white">
                  {user.name?.substring(0, 2) || 'م'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate font-mono">
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
