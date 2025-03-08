import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage)?.state?.accessToken : null;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Erro ao processar token:', error);
      return config;
    }
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Obter o refreshToken do localStorage
        const authStorage = localStorage.getItem('auth-storage');
        const refreshToken = authStorage ? JSON.parse(authStorage)?.state?.refreshToken : null;
        
        if (!refreshToken) {
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Fazer a requisição para obter um novo token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        }, {
          withCredentials: true,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Atualizar o token no localStorage
        const currentAuthStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
        currentAuthStorage.state = {
          ...currentAuthStorage.state,
          accessToken,
          refreshToken: newRefreshToken,
        };
        localStorage.setItem('auth-storage', JSON.stringify(currentAuthStorage));
        
        // Atualizar o header da requisição original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Reenviar a requisição original
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao atualizar token:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Log detalhado do erro
    console.error('Erro na resposta:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config,
    });
    
    return Promise.reject(error);
  }
); 