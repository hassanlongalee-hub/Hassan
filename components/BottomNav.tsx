'use client';

import type { Route } from 'next';
=======
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

type NavItem = {
  href: Route;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
=======

  { href: '/dashboard', label: 'Today', icon: '🏠' },
  { href: '/habits/new', label: 'New', icon: '➕' }
];

export function BottomNav() {
  const pathname = usePathname();

  if (!pathname || pathname === '/' || pathname === '/auth') {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-4 pb-5 pt-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-2xl bg-slate-100 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex min-w-24 flex-col items-center rounded-xl px-4 py-2 text-xs font-semibold transition',
                isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
