'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/stores/auth';
import { toast } from 'sonner';
import { api } from '@/lib/utils/api';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Componente interno que usa useSearchParams
function LoginPageContent() {
  const searchParams = useSearchParams();
  const from = searchParams?.get('from') || '/dashboard';
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'password123'
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Tentando fazer login com:', data);
      console.log('API URL:', api.defaults.baseURL);
      
      // Usar o método de login do store de autenticação
      await login(data);
      
      toast.success('Login realizado com sucesso!');
      
      // Redirecionar após o login
      setTimeout(() => {
        window.location.href = from;
      }, 1000);
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Mostrar detalhes do erro
      if (axios.isAxiosError(error) && error.response) {
        console.error('Resposta do servidor:', error.response.data);
        console.error('Status do erro:', error.response.status);
        console.error('Headers da resposta:', error.response.headers);
      }
      
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entre com suas credenciais
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Componente exportado que envolve o componente interno com Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginPageContent />
    </Suspense>
  );
} 