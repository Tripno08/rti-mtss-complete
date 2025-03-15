import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/utils/api';
import axios from 'axios';

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

// Função segura para criar o storage
const createSafeStorage = () => {
  return {
    getItem: (name: string): string | null => {
      try {
        if (typeof window !== 'undefined') {
          return localStorage.getItem(name);
        }
        return null;
      } catch (error) {
        console.error('Erro ao acessar localStorage:', error);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(name, value);
        }
      } catch (error) {
        console.error('Erro ao definir localStorage:', error);
      }
    },
    removeItem: (name: string): void => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(name);
        }
      } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
      }
    }
  };
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

          console.log('Tentando login com API URL:', api.defaults.baseURL);
          console.log('Credenciais:', credentials);
          
          // Tentar login com diferentes URLs
          let response;
          let error;
          
          try {
            // Primeira tentativa: URL padrão
            console.log('Tentativa 1: URL padrão');
            response = await api.post('/auth/login', credentials);
          } catch (err) {
            error = err;
            console.error('Erro na primeira tentativa:', err);
            
            try {
              // Segunda tentativa: URL direta
              console.log('Tentativa 2: URL direta');
              response = await axios.post('http://localhost:3001/api/auth/login', credentials, {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: false
              });
            } catch (err2) {
              console.error('Erro na segunda tentativa:', err2);
              throw error; // Lançar o erro original se ambas as tentativas falharem
            }
          }
          
          console.log('Resposta do login:', response?.data);
          
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
        try {
          // Limpar o token de autorização
          delete api.defaults.headers.common.Authorization;

          // Limpar o estado
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
        } catch (error) {
          console.error('Erro durante o logout:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createSafeStorage()),
    }
  )
); 