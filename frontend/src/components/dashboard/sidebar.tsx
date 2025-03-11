'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  BookOpen,
  Settings,
  Home,
  Calendar,
  BrainCircuit,
  FileText,
  Activity,
  Lightbulb,
  Target,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { href: '/students', label: 'Estudantes', icon: <Users className="h-5 w-5" /> },
    { href: '/assessments', label: 'Avaliações', icon: <BookOpen className="h-5 w-5" /> },
    { href: '/screening', label: 'Rastreios', icon: <Activity className="h-5 w-5" /> },
    { href: '/interventions', label: 'Intervenções', icon: <Target className="h-5 w-5" /> },
    { href: '/learning-difficulties', label: 'Dificuldades de Aprendizagem', icon: <Lightbulb className="h-5 w-5" /> },
    { href: '/meetings', label: 'Reuniões', icon: <Calendar className="h-5 w-5" /> },
    { href: '/analytics', label: 'Análise de Dados', icon: <BrainCircuit className="h-5 w-5" /> },
    { href: '/reports', label: 'Relatórios', icon: <BarChart3 className="h-5 w-5" /> },
    { href: '/documents', label: 'Documentos', icon: <FileText className="h-5 w-5" /> },
    { href: '/settings', label: 'Configurações', icon: <Settings className="h-5 w-5" /> },
  ];

  // Não renderizar nada até que o componente esteja montado no cliente
  if (!isMounted) {
    return <div className="h-full w-64 border-r bg-background"></div>;
  }

  return (
    <div className="h-full w-64 border-r bg-background">
      <div className="flex flex-col h-full py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navegação</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? 'bg-accent text-accent-foreground'
                    : 'transparent'
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-auto px-3 py-2">
          <div className="rounded-md bg-muted px-3 py-2 text-xs">
            <p className="font-medium">RTI/MTSS System</p>
            <p className="text-muted-foreground">Versão 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
} 