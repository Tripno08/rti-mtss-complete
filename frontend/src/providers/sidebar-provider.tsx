'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  setIsOpen: () => {},
  toggleSidebar: () => {},
  isMobile: false,
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsOpen(window.innerWidth >= 1024);
    };

    // Verificar o tamanho da tela inicialmente
    checkScreenSize();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);

    // Limpar listener ao desmontar
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebarContext = () => useContext(SidebarContext); 