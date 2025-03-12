import type { Metadata } from 'next';
import { AuthLayoutClient } from './auth-layout-client';

export const metadata: Metadata = {
  title: 'Autenticação | Innerview',
  description: 'Sistema de visualização interna de dados educacionais e suporte multi-níveis',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthLayoutClient>{children}</AuthLayoutClient>
    </div>
  );
} 