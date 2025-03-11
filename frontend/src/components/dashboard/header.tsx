'use client';

import Link from 'next/link';
import { Menu, LogOut, User, Settings, Bell, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { useAuthStore } from '@/lib/stores/auth';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useSidebarContext } from '@/providers/sidebar-provider';

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleSidebar, isMobile } = useSidebarContext();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleLabel = (role: string = '') => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrador';
      case 'teacher':
        return 'Professor';
      case 'specialist':
        return 'Especialista';
      case 'coordinator':
        return 'Coordenador';
      default:
        return role;
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-sm dark:border-stroke-dark dark:bg-gray-dark md:px-6 lg:px-8">
      <div className="flex items-center">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-gray-dark hover:bg-innerview-light dark:hover:bg-innerview-dark/10 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        )}
        
        <div className="hidden lg:block">
          <h1 className="mb-0.5 text-xl font-bold text-innerview-secondary dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sistema de visualização interna de dados educacionais</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Botão de pesquisa */}
        <div className="relative">
          {isSearchOpen ? (
            <div className="absolute -left-64 top-0 flex w-72 items-center rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
              <Input 
                type="text" 
                placeholder="Pesquisar..." 
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-1"
                onClick={() => setIsSearchOpen(false)}
              >
                <Search className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-innerview-light dark:hover:bg-innerview-dark/10"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Pesquisar</span>
            </Button>
          )}
        </div>

        {/* Alternador de tema */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-innerview-light dark:hover:bg-innerview-dark/10"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>

        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative rounded-full hover:bg-innerview-light dark:hover:bg-innerview-dark/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-innerview-primary text-[10px] font-medium text-white">
                3
              </span>
              <span className="sr-only">Notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {[1, 2, 3].map((item) => (
                <DropdownMenuItem key={item} className="flex cursor-pointer flex-col items-start p-4">
                  <div className="flex w-full items-center justify-between">
                    <p className="font-medium">Nova mensagem</p>
                    <span className="text-xs text-gray-500">há 5 min</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Você recebeu uma nova mensagem do professor João.
                  </p>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center p-2 text-center font-medium text-innerview-primary">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Perfil do usuário */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8 border border-innerview-light">
                  <AvatarImage src="" alt={user.name || ''} />
                  <AvatarFallback className="bg-innerview-primary text-white">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-4 py-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex cursor-pointer items-center text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
} 