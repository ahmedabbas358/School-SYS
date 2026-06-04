'use client';

import React from 'react';
import { Bell, Search, Menu, Settings, HelpCircle, ChevronDown } from 'lucide-react';

export function Header({ onMenuClick, user }: { onMenuClick?: () => void, user?: any }) {
  return (
    <header className="h-[60px] bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 lg:mr-64 transition-all duration-300 shadow-sm shadow-slate-200/20">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-1.5 lg:hidden text-slate-500 hover:bg-slate-100 rounded-md transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span className="text-slate-900 font-bold">مدرسة الأفق العالمية</span>
          <span className="text-slate-300">/</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs select-none border border-slate-200">فرع العليا</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="البحث العالمي (Ctrl+K)..." 
            className="pl-4 pr-9 py-1.5 w-64 rounded-md border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 transition-shadow hover:bg-white"
          />
        </div>
        
        <div className="h-4 w-px bg-slate-200 hidden md:block mx-1"></div>
        
        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
          <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
          <Settings className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors relative">
          <Bell className="w-4 h-4" strokeWidth={2.5} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-600 border border-white"></span>
        </button>
      </div>
    </header>
  );
}
