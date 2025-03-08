import type { Metadata } from 'next';
import { AuthLayoutClient } from './auth-layout-client';

export const metadata: Metadata = {
  title: 'Autenticação | RTI/MTSS System',
  description: 'Sistema de Resposta à Intervenção/Sistema de Suporte Multi-Nível',
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