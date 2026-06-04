'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { useTransition } from 'react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2"
    >
      <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
      <span>تسجيل الخروج</span>
    </button>
  );
}
