'use client';

import Link from 'next/link';
import { Menu, LogOut, User, Settings } from 'lucide-react';
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

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

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
    <header className="sticky top-0 z-50 h-16 border-b bg-background flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          
          <Link href="/dashboard" className="flex items-center ml-2 md:ml-0">
            <span className="font-bold text-xl">RTI/MTSS</span>
          </Link>
        </div>

        {user && (
          <div className="relative">
            <Button 
              variant="ghost" 
              className="relative h-8 w-8 rounded-full"
              onClick={() => {
                const menu = document.getElementById('user-menu');
                if (menu) {
                  menu.classList.toggle('hidden');
                }
              }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user.name || ''} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Button>
            
            <div 
              id="user-menu" 
              className="hidden absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background ring-1 ring-border ring-opacity-5 divide-y divide-border focus:outline-none z-50"
            >
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
              </div>
              <div className="py-1">
                <Link 
                  href="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
                <Link 
                  href="/settings" 
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </div>
              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-accent"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 