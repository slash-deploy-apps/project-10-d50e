'use client';

import { useEffect, useState } from 'react';
import { authClient } from '~/server/better-auth/client';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '~/components/admin/sidebar';
import { Spinner } from '~/components/ui/spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    void authClient.getSession().then((session) => {
      if (session.data) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    });
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated || pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <header className="flex h-14 items-center justify-end border-b px-6">
          <button
            onClick={async () => {
              await authClient.signOut();
              router.push('/admin/login');
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            로그아웃
          </button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}