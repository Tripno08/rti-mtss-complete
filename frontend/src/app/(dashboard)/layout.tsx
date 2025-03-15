'use client';

import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/dashboard/sidebar';
import { SidebarProvider } from '@/providers/sidebar-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Simular um tempo de carregamento para mostrar o indicador
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Não renderizar nada até que o componente esteja montado no cliente
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90 dark:from-background dark:via-background/95 dark:to-background/80">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="mx-auto w-full max-w-7xl">
                  <div className="rounded-xl bg-white/90 p-4 shadow-md backdrop-blur-sm dark:bg-gray-900/40 md:p-6">
                    {children}
                  </div>
                </div>
              )}
            </main>
          </div>
          <Toaster />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
} 