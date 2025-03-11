import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

// Função para limpar o localStorage
const clearAuthStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-storage');
    
    // Também remover o cookie se possível
    document.cookie = 'auth-storage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      login: async (credentials) => {
        try {
          // Limpar o estado atual
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });

          // A rota correta é '/api/auth/login' ou apenas '/auth/login' dependendo da baseURL
          // Como estamos usando a URL completa com '/api' na baseURL, devemos usar apenas '/auth/login'
          console.log('API URL antes do login:', api.defaults.baseURL);
          const response = await api.post('/auth/login', credentials);
          const { user, accessToken, refreshToken } = response.data;

          if (!user || !accessToken || !refreshToken) {
            throw new Error('Resposta inválida do servidor');
          }

          // Configurar o token de acesso para futuras requisições
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          // Atualizar o estado com as informações do usuário
          set({
            isAuthenticated: true,
            user,
            accessToken,
            refreshToken,
          });
        } catch (error) {
          console.error('Erro durante o login:', error);
          throw error;
        }
      },
      logout: () => {
        // Limpar o token de autorização
        delete api.defaults.headers.common.Authorization;

        // Limpar o estado
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 