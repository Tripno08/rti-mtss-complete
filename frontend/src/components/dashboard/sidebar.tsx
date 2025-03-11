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
  ArrowRightLeft,
  MessageSquare,
  ListChecks,
  Users2,
  Goal,
  PieChart,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSidebarContext } from '@/providers/sidebar-provider';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  items?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { isOpen, isMobile } = useSidebarContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // Definir grupos de navegação
  const navGroups: NavGroup[] = [
    {
      title: 'Principal',
      items: [
        { 
          href: '/dashboard', 
          label: 'Dashboard', 
          icon: <Home className="h-5 w-5" />,
          items: [
            { href: '/dashboard', label: 'Visão Geral', icon: <Home className="h-5 w-5" /> },
            { href: '/dashboard/rti-pyramid', label: 'Pirâmide Innerview', icon: <Layers className="h-5 w-5" /> },
          ]
        },
        { href: '/students', label: 'Estudantes', icon: <Users className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Avaliação e Rastreio',
      items: [
        { 
          href: '/assessments', 
          label: 'Avaliações', 
          icon: <BookOpen className="h-5 w-5" />,
          items: [
            { href: '/assessments', label: 'Todas Avaliações', icon: <BookOpen className="h-5 w-5" /> },
            { href: '/assessments/new', label: 'Nova Avaliação', icon: <BookOpen className="h-5 w-5" /> },
          ]
        },
        { 
          href: '/screening', 
          label: 'Rastreios', 
          icon: <Activity className="h-5 w-5" />,
          items: [
            { href: '/screening', label: 'Todos Rastreios', icon: <Activity className="h-5 w-5" /> },
            { href: '/screening-results', label: 'Resultados', icon: <ListChecks className="h-5 w-5" /> },
          ]
        },
        { href: '/learning-difficulties', label: 'Dificuldades', icon: <Lightbulb className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Intervenção',
      items: [
        { href: '/interventions', label: 'Intervenções', icon: <Target className="h-5 w-5" /> },
        { href: '/goals', label: 'Metas', icon: <Goal className="h-5 w-5" /> },
        { href: '/referrals', label: 'Encaminhamentos', icon: <ArrowRightLeft className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Colaboração',
      items: [
        { href: '/communications', label: 'Comunicações', icon: <MessageSquare className="h-5 w-5" /> },
        { href: '/meetings', label: 'Reuniões', icon: <Calendar className="h-5 w-5" /> },
        { href: '/teams', label: 'Equipes', icon: <Users2 className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Análise e Relatórios',
      items: [
        { 
          href: '/analytics', 
          label: 'Análise de Dados', 
          icon: <BrainCircuit className="h-5 w-5" />,
          items: [
            { href: '/analytics', label: 'Visão Geral', icon: <BrainCircuit className="h-5 w-5" /> },
            { href: '/analytics/rti-pyramid', label: 'Pirâmide Innerview', icon: <PieChart className="h-5 w-5" /> },
          ]
        },
        { href: '/reports', label: 'Relatórios', icon: <BarChart3 className="h-5 w-5" /> },
        { href: '/documents', label: 'Documentos', icon: <FileText className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Sistema',
      items: [
        { href: '/settings', label: 'Configurações', icon: <Settings className="h-5 w-5" /> },
      ]
    },
  ];

  // Não renderizar nada até que o componente esteja montado no cliente
  if (!isMounted) {
    return <div className="h-full w-64 border-r bg-background"></div>;
  }

  // Overlay para dispositivos móveis
  const mobileOverlay = isMobile && isOpen && (
    <div
      className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
      aria-hidden="true"
    />
  );

  return (
    <>
      {mobileOverlay}
      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-stroke bg-white transition-[width] duration-200 ease-linear dark:border-stroke-dark dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0"
        )}
        aria-label="Navegação principal"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col py-8 pl-6 pr-4">
          <div className="mb-6 flex items-center px-2">
            <Link href="/dashboard" className="flex items-center">
              <div className="mr-2">
                <svg width="40" height="40" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M190 100 C190 150, 150 190, 100 190 C50 190, 10 150, 10 100 C10 50, 50 10, 100 10 C150 10, 190 50, 190 100" fill="#2EBFD4" opacity="0.8" />
                  <path d="M40 100 C40 120, 60 140, 80 140 C100 140, 120 120, 120 100 C120 80, 100 60, 80 60 C60 60, 40 80, 40 100" fill="#2EBFD4" opacity="0.6" />
                  <path d="M70 100 C70 110, 80 120, 90 120 C100 120, 110 110, 110 100 C110 90, 100 80, 90 80 C80 80, 70 90, 70 100" fill="#2EBFD4" opacity="0.4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-innerview-secondary dark:text-white">innerview</span>
            </Link>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
            {navGroups.map((group, index) => (
              <div key={index} className="mb-6">
                <h2 className="mb-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {group.title}
                </h2>
                <nav role="navigation" aria-label={group.title}>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        {item.items ? (
                          <div>
                            <button
                              onClick={() => toggleExpanded(item.label)}
                              className={cn(
                                "flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                                pathname.startsWith(item.href)
                                  ? "bg-innerview-light text-innerview-primary dark:bg-innerview-dark/10 dark:text-innerview-primary"
                                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                              )}
                            >
                              <span className="mr-3">{item.icon}</span>
                              <span>{item.label}</span>
                              {expandedItems.includes(item.label) ? (
                                <ChevronUp className="ml-auto h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-auto h-4 w-4" />
                              )}
                            </button>

                            {expandedItems.includes(item.label) && (
                              <ul className="mt-1 space-y-1 pl-10">
                                {item.items.map((subItem) => (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className={cn(
                                        "flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                        pathname === subItem.href
                                          ? "text-innerview-primary dark:text-innerview-primary"
                                          : "text-gray-700 hover:text-innerview-primary dark:text-gray-300 dark:hover:text-innerview-primary"
                                      )}
                                    >
                                      {subItem.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                              pathname === item.href
                                ? "bg-innerview-light text-innerview-primary dark:bg-innerview-dark/10 dark:text-innerview-primary"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            )}
                          >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>

          <div className="mt-auto px-3 py-4">
            <div className="rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M190 100 C190 150, 150 190, 100 190 C50 190, 10 150, 10 100 C10 50, 50 10, 100 10 C150 10, 190 50, 190 100" fill="#2EBFD4" opacity="0.8" />
                    <path d="M40 100 C40 120, 60 140, 80 140 C100 140, 120 120, 120 100 C120 80, 100 60, 80 60 C60 60, 40 80, 40 100" fill="#2EBFD4" opacity="0.6" />
                    <path d="M70 100 C70 110, 80 120, 90 120 C100 120, 110 110, 110 100 C110 90, 100 80, 90 80 C80 80, 70 90, 70 100" fill="#2EBFD4" opacity="0.4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-innerview-secondary dark:text-white">Innerview</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Versão 1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 