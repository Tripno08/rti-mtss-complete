'use client';

import Link from 'next/link';
import { Menu, Settings, Search, X, Calendar, MessageSquare, Users2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/stores/auth';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useSidebarContext } from '@/providers/sidebar-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { NotificationsDropdown } from '@/components/notifications/notifications-dropdown';

export function Header() {
  const { isOpen, toggle } = useSidebarContext();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleLabel = () => {
    if (!user?.role) return 'Usuário';
    
    switch (user.role) {
      case 'ADMIN':
        return 'Administrador';
      case 'TEACHER':
        return 'Professor';
      case 'SPECIALIST':
        return 'Especialista';
      default:
        return user.role;
    }
  };

  // Não renderizar nada até que o componente esteja montado no cliente
  if (!isMounted) {
    return <header className="sticky top-0 z-30 h-16 w-full border-b bg-background"></header>;
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b header-pastel-blue shadow-md px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Botão de pesquisa */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/20"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="Pesquisar"
        >
          {isSearchOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          <span className="sr-only">Pesquisar</span>
        </Button>

        {/* Menu de navegação rápida */}
        <nav className="hidden md:flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm font-medium hover:bg-white/20">
                Colaboração
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/communications" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Comunicações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/meetings" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Reuniões</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/teams" className="flex items-center">
                  <Users2 className="mr-2 h-4 w-4" />
                  <span>Equipes</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm font-medium hover:bg-white/20">
                Documentos
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/documents" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Todos Documentos</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/documents/templates" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Modelos</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Alternador de tema */}
        <ModeToggle />

        {/* Notificações */}
        <NotificationsDropdown />

        {/* Configurações */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/20"
          aria-label="Configurações"
          onClick={() => router.push('/settings')}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Configurações</span>
        </Button>

        {/* Perfil do usuário */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 hover:bg-white/20"
                aria-label="Perfil do usuário"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={cn(
                    "bg-primary text-primary-foreground",
                    theme === "dark" && "bg-primary/80"
                  )}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left md:flex">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs opacity-80">{getRoleLabel()}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="default" size="sm" onClick={() => router.push('/login')}>
            Entrar
          </Button>
        )}
      </div>
    </header>
  );
} 