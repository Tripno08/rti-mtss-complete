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
  Beaker,
  Workflow,
  Gauge,
  ChevronRight,
  School,
  LogOut,
  Menu,
  X,
  Puzzle,
  Cog,
  Plug,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSidebarContext } from '@/providers/sidebar-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  items?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
  isCollapsed?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([
    'Intervenção e Suporte',
    'Avaliação e Rastreio',
    'Análise de Dados'
  ]);
  const { isOpen, isMobile, toggle } = useSidebarContext();

  useEffect(() => {
    setIsMounted(true);
    
    // Auto-expand the group that contains the current path
    const currentGroup = navGroups.find(group => 
      group.items.some(item => 
        pathname === item.href || pathname?.startsWith(item.href + '/')
      )
    );
    
    if (currentGroup && currentGroup.title === 'Principal') {
      setCollapsedGroups(prev => 
        prev.includes(currentGroup.title) 
          ? prev.filter(title => title !== currentGroup.title)
          : prev
      );
    }
    
    // Auto-expand the item that contains the current path
    const currentItem = navGroups.flatMap(group => group.items)
      .find(item => item.items && (pathname === item.href || pathname.startsWith(item.href + '/')));
    
    if (currentItem) {
      setExpandedItems(prev => 
        prev.includes(currentItem.label) 
          ? prev 
          : [...prev, currentItem.label]
      );
    }
  }, [pathname]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };
  
  const toggleGroupCollapse = (title: string) => {
    setCollapsedGroups((prev) => 
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
            { href: '/dashboard', label: 'Visão Geral', icon: <Gauge className="h-5 w-5" /> },
            { href: '/dashboard/rti-pyramid', label: 'Pirâmide Innerview', icon: <Layers className="h-5 w-5" /> },
          ]
        },
        { href: '/students', label: 'Estudantes', icon: <Users className="h-5 w-5" /> },
        { href: '/teams', label: 'Equipes', icon: <Users2 className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Intervenção e Suporte',
      items: [
        { href: '/interventions', label: 'Intervenções', icon: <Target className="h-5 w-5" /> },
        { 
          href: '/interventions/protocols', 
          label: 'Protocolos', 
          icon: <Workflow className="h-5 w-5" /> 
        },
        { href: '/interventions/library', label: 'Biblioteca', icon: <BookOpen className="h-5 w-5" /> },
        { href: '/base-interventions', label: 'Intervenções Base', icon: <Beaker className="h-5 w-5" /> },
        { href: '/goals', label: 'Metas', icon: <Goal className="h-5 w-5" /> },
        { href: '/referrals', label: 'Encaminhamentos', icon: <ArrowRightLeft className="h-5 w-5" /> },
        { href: '/meetings', label: 'Reuniões', icon: <Calendar className="h-5 w-5" /> },
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
            { href: '/screening/instruments', label: 'Instrumentos', icon: <Beaker className="h-5 w-5" /> },
          ]
        },
        { href: '/learning-difficulties', label: 'Dificuldades', icon: <Lightbulb className="h-5 w-5" /> },
        { href: '/documents', label: 'Documentos', icon: <FileText className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Análise de Dados',
      items: [
        { 
          href: '/analytics', 
          label: 'Análise', 
          icon: <BrainCircuit className="h-5 w-5" />,
          items: [
            { href: '/analytics', label: 'Visão Geral', icon: <BrainCircuit className="h-5 w-5" /> },
            { href: '/analytics/rti-pyramid', label: 'Pirâmide Innerview', icon: <PieChart className="h-5 w-5" /> },
          ]
        },
        { href: '/reports', label: 'Relatórios', icon: <BarChart3 className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { href: '/communications', label: 'Comunicações', icon: <MessageSquare className="h-5 w-5" /> },
        { href: '/integrations', label: 'Integrações', icon: <ArrowRightLeft className="h-5 w-5" /> },
        { href: '/users', label: 'Usuários', icon: <Users className="h-5 w-5" /> },
        { href: '/settings', label: 'Configurações', icon: <Settings className="h-5 w-5" /> },
        { href: '/profile', label: 'Perfil', icon: <Users className="h-5 w-5" /> },
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
      onClick={() => isMobile && useSidebarContext().toggle()}
      aria-hidden="true"
    />
  );

  return (
    <>
      {mobileOverlay}
      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r bg-background/80 backdrop-blur-sm transition-[width] duration-200 ease-linear shadow-sm",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0"
        )}
        aria-label="Navegação principal"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col py-6 pl-6 pr-4">
          <div className="mb-6 flex items-center px-2">
            <Link href="/dashboard" className="flex items-center">
              <div className="mr-2">
                <svg width="40" height="40" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M190 100 C190 150, 150 190, 100 190 C50 190, 10 150, 10 100 C10 50, 50 10, 100 10 C150 10, 190 50, 190 100" fill="hsl(var(--primary))" opacity="0.8" />
                  <path d="M40 100 C40 120, 60 140, 80 140 C100 140, 120 120, 120 100 C120 80, 100 60, 80 60 C60 60, 40 80, 40 100" fill="hsl(var(--primary))" opacity="0.6" />
                  <path d="M70 100 C70 110, 80 120, 90 120 C100 120, 110 110, 110 100 C110 90, 100 80, 90 80 C80 80, 70 90, 70 100" fill="hsl(var(--primary))" opacity="0.4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary dark:text-white">innerview</span>
            </Link>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
            {navGroups.map((group, index) => (
              <div key={index} className="mb-6">
                <div 
                  className="sidebar-group-title cursor-pointer group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => toggleGroupCollapse(group.title)}
                >
                  <h2>
                    {group.title}
                  </h2>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 opacity-70 group-hover:opacity-100",
                      !collapsedGroups.includes(group.title) && "transform rotate-180"
                    )}
                  />
                </div>
                
                <AnimatePresence initial={false}>
                  {!collapsedGroups.includes(group.title) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-2 space-y-1">
                        {group.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            {item.items ? (
                              <div>
                                <button
                                  onClick={() => toggleExpanded(item.label)}
                                  className={cn(
                                    "sidebar-menu-item w-full justify-between flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                    pathname.startsWith(item.href) && "bg-primary/10 text-primary"
                                  )}
                                >
                                  <div className="flex items-center">
                                    {item.icon}
                                    <span className="ml-3">{item.label}</span>
                                  </div>
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 transition-transform duration-200",
                                      expandedItems.includes(item.label) && "transform rotate-180"
                                    )}
                                  />
                                </button>

                                <AnimatePresence initial={false}>
                                  {expandedItems.includes(item.label) && (
                                    <motion.ul
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="ml-6 mt-1 space-y-1 overflow-hidden"
                                    >
                                      {item.items.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                          <Link
                                            href={subItem.href}
                                            className={cn(
                                              "sidebar-submenu-item flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                              pathname === subItem.href && "bg-primary/10 text-primary"
                                            )}
                                          >
                                            {subItem.icon}
                                            <span className="ml-3">{subItem.label}</span>
                                          </Link>
                                        </li>
                                      ))}
                                    </motion.ul>
                                  )}
                                </AnimatePresence>
                              </div>
                            ) : (
                              <Link
                                href={item.href}
                                className={cn(
                                  "sidebar-menu-item flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                  pathname === item.href && "bg-primary/10 text-primary"
                                )}
                              >
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

const NavGroup = ({ group, isOpen }: { group: NavGroup; isOpen: boolean }) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile } = useSidebarContext();
  const { toggle } = useSidebarContext();

  // Verificar se algum item do grupo está ativo
  const isActive = group.items.some(
    item => pathname === item.href || pathname?.startsWith(item.href + '/')
  );

  // Expandir automaticamente o grupo se algum item estiver ativo
  useEffect(() => {
    if (isActive) {
      setIsExpanded(true);
    }
  }, [isActive]);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        <div className="flex items-center">
          {group.icon && <group.icon className="mr-2 h-4 w-4" />}
          {isOpen && <span>{group.title}</span>}
        </div>
        {isOpen && (
          <div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </button>

      {isExpanded && isOpen && (
        <div className="mt-1 space-y-1 pl-6">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && toggle()}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm',
                pathname === item.href || pathname?.startsWith(item.href + '/')
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}; 