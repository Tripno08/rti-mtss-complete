'use client';

import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ReactQueryProvider } from '@/providers/query-provider';
import { SidebarProvider } from '@/providers/sidebar-provider';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ProtectedRoute>
      <ReactQueryProvider>
        <SidebarProvider>
          {!isMounted ? (
            <div className="flex h-screen items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-innerview-primary border-t-transparent"></div>
              <span className="ml-2">Carregando...</span>
            </div>
          ) : (
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="w-full bg-gray-50 dark:bg-[#020d1a]">
                <Header />
                <main className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  {children}
                </main>
              </div>
            </div>
          )}
        </SidebarProvider>
      </ReactQueryProvider>
    </ProtectedRoute>
  );
} 