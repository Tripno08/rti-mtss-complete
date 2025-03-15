'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';

// Componente interno que usa useSearchParams
function AuthLayoutInternal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const from = searchParams?.get('from') || '/dashboard';

  useEffect(() => {
    setMounted(true);
    // Se o usuário já estiver autenticado, redireciona para o dashboard ou página solicitada
    if (isAuthenticated) {
      router.replace(from);
    }
  }, [isAuthenticated, router, from]);

  // Não renderiza nada até que o componente seja montado no cliente
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

// Componente exportado que envolve o componente interno com Suspense
export function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthLayoutInternal>{children}</AuthLayoutInternal>
    </Suspense>
  );
} 