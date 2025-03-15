import axios from 'axios';

// Como estamos rodando o frontend localmente, precisamos usar a URL completa do backend
// A variável de ambiente já inclui o sufixo '/api'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Evitar logs desnecessários em produção
if (process.env.NODE_ENV !== 'production') {
  console.log('API_URL configurada:', API_URL);
}

// Função segura para acessar localStorage
const safeGetLocalStorage = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  } catch (error) {
    console.error('Erro ao acessar localStorage:', error);
    return null;
  }
};

// Função segura para definir no localStorage
const safeSetLocalStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('Erro ao definir localStorage:', error);
  }
};

// Função segura para redirecionar
const safeRedirect = (url: string): void => {
  try {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Erro ao redirecionar:', error);
  }
};

// Criar instância do Axios com configurações otimizadas
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Desabilitar withCredentials para evitar problemas de CORS
  withCredentials: false,
  // Adicionar timeout para evitar requisições pendentes
  timeout: 10000,
  // Configurações adicionais para melhorar a estabilidade
  maxRedirects: 5,
  maxContentLength: 2000000, // 2MB
});

// Função segura para acessar propriedades aninhadas
const safeGet = <T>(obj: Record<string, unknown>, path: string, defaultValue: T): T => {
  try {
    if (!obj) return defaultValue;
    const keys = path.split('.');
    return keys.reduce((o, key) => {
      const value = o && typeof o === 'object' && key in o ? (o as Record<string, unknown>)[key] : undefined;
      return (value !== undefined ? value : defaultValue) as T;
    }, obj as unknown) as T;
  } catch {
    return defaultValue;
  }
};

// Função segura para analisar JSON
const safeParse = <T>(text: string | null, defaultValue: T): T => {
  try {
    if (!text) return defaultValue;
    return JSON.parse(text) as T;
  } catch {
    console.error('Erro ao analisar JSON');
    return defaultValue;
  }
};

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    try {
      const authStorage = safeGetLocalStorage('auth-storage');
      const token = authStorage ? safeGet<string | null>(safeParse<Record<string, unknown>>(authStorage, {}), 'state.accessToken', null) : null;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch {
      // Silenciar erro
      return config;
    }
  },
  (error) => {
    // Silenciar erro
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      // Log detalhado do erro para depuração
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro na requisição:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      
      const originalRequest = error.config || {};
      
      // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Obter o refreshToken do localStorage
          const authStorage = safeGetLocalStorage('auth-storage');
          const refreshToken = authStorage ? safeGet<string | null>(safeParse<Record<string, unknown>>(authStorage, {}), 'state.refreshToken', null) : null;
          
          if (!refreshToken) {
            safeRedirect('/login');
            return Promise.reject(error);
          }
          
          // Fazer a requisição para obter um novo token
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          }, {
            withCredentials: false,
          });
          
          const accessToken = response.data?.accessToken;
          const newRefreshToken = response.data?.refreshToken;
          
          if (!accessToken || !newRefreshToken) {
            throw new Error('Tokens inválidos recebidos do servidor');
          }
          
          // Atualizar o token no localStorage
          try {
            const currentAuthStorage = safeParse<Record<string, unknown>>(safeGetLocalStorage('auth-storage'), {});
            currentAuthStorage.state = {
              ...safeGet<Record<string, unknown>>(currentAuthStorage, 'state', {}),
              accessToken,
              refreshToken: newRefreshToken,
            };
            safeSetLocalStorage('auth-storage', JSON.stringify(currentAuthStorage));
          } catch {
            // Silenciar erro
          }
          
          // Atualizar o header da requisição original
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Reenviar a requisição original
          return axios(originalRequest);
        } catch {
          // Silenciar erro
          safeRedirect('/login');
          return Promise.reject(error);
        }
      }
    } catch {
      // Silenciar erro
    }
    
    return Promise.reject(error);
  }
); 