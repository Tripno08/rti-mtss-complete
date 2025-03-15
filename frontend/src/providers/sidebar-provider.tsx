'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
  isMobile: false,
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggle = () => {
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
    <SidebarContext.Provider value={{ isOpen, toggle, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebarContext = () => useContext(SidebarContext); 