import './globals.css';
import type { Metadata } from 'next';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Mobile-first habit tracker with Supabase'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-28 pt-6 md:px-8 md:pb-10">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
