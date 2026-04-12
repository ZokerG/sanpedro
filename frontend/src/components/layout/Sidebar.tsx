'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  WalletCards,
  ListTodo,
  TentTree,
  ArrowLeftRight,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Logística', href: '/logistica', icon: Users },
  { name: 'Administrativo', href: '/administrativo', icon: Users },
  { name: 'Prensa', href: '/prensa', icon: Users },
  { name: 'Eventos', href: '/eventos', icon: CalendarDays },
  { name: 'Roles', href: '/roles', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800">
          Corpo<span className="text-[var(--color-primary)]">Sanpedro</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-[var(--color-primary)]' : 'text-slate-400')} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
