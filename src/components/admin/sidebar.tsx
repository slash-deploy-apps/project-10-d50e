'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ZapIcon, LayoutDashboardIcon, PackageIcon, FolderIcon, MessageSquareIcon, SettingsIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

const navItems = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboardIcon },
  { href: '/admin/products', label: '제품 관리', icon: PackageIcon },
  { href: '/admin/categories', label: '카테고리 관리', icon: FolderIcon },
  { href: '/admin/inquiries', label: '견적 문의', icon: MessageSquareIcon },
  { href: '/admin/settings', label: '설정', icon: SettingsIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-[#0F172A] text-white">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
        <ZapIcon className="size-5" />
        <span className="font-mono text-sm font-bold">POWERPLAZA</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[#0369A1] text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}