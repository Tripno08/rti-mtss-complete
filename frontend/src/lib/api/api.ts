import axios from 'axios';

// Configuração da URL base da API
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

// Função segura para remover do localStorage
const safeRemoveLocalStorage = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error);
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

// Criação da instância do axios com configurações padrão
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Aumentando o timeout para 10 segundos
  timeout: 10000,
  // Permitindo credenciais para CORS
  withCredentials: true,
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    try {
      // Verificar se estamos no navegador
      const token = safeGetLocalStorage('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Requisição enviada:', config.url);
      }
      
      return config;
    } catch (error) {
      console.error('Erro no interceptor de requisição:', error);
      return config;
    }
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Resposta recebida:', response.status);
      }
      return response;
    } catch (error) {
      console.error('Erro no interceptor de resposta (sucesso):', error);
      return response;
    }
  },
  (error) => {
    try {
      if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status fora do intervalo 2xx
        console.error('Erro de resposta:', {
          status: error.response.status,
          data: error.response.data,
        });
        
        // Se for erro 401 (não autorizado) e não estamos na página de login
        if (error.response.status === 401 && typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath !== '/login') {
            console.log('Redirecionando para login devido a erro 401');
            // Limpar token
            safeRemoveLocalStorage('token');
            // Redirecionar para login
            safeRedirect('/login');
          }
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Erro de requisição (sem resposta)');
      } else {
        // Algo aconteceu na configuração da requisição que acionou um erro
        console.error('Erro na configuração da requisição:', error.message);
      }
    } catch (interceptorError) {
      console.error('Erro no interceptor de resposta (erro):', interceptorError);
    }
    
    return Promise.reject(error);
  }
); 