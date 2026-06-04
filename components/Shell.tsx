'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export function Shell({ children, user }: { children: React.ReactNode; user: any }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Sidebar isMobileOpen={isMobileOpen} onMobileClose={() => setIsMobileOpen(false)} user={user} />
      <Header onMenuClick={() => setIsMobileOpen(true)} user={user} />
      <main className="flex-1 lg:mr-64 p-4 sm:p-6 pb-24 lg:pb-10 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
