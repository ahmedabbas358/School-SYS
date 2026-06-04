import type {Metadata} from 'next';
import './globals.css';
import { Shell } from '@/components/Shell';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'SchoolERP Pro',
  description: 'النظام الإداري المتكامل للمؤسسات التعليمية',
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-indigo-500/30">
        <Shell user={user}>{children}</Shell>
      </body>
    </html>
  );
}
