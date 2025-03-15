'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth';
import { api } from '@/lib/utils/api';

const userSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['ADMIN', 'TEACHER', 'COORDINATOR']),
});

type UserFormData = z.infer<typeof userSchema>;

export default function EditUserPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        reset(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setError('Erro ao carregar dados do usuário');
        toast.error('Erro ao carregar dados do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      const response = await api.put(`/users/${id}`, data);
      
      // Se o usuário estiver editando seu próprio perfil, atualizar o estado de autenticação
      const authState = useAuthStore.getState();
      if (authState.user?.id === id) {
        const updatedUser = {
          ...authState.user,
          ...response.data,
        };
        
        // Atualizar o estado de autenticação com as novas informações do usuário
        useAuthStore.setState({
          ...authState,
          user: updatedUser,
        });
      }

      toast.success('Usuário atualizado com sucesso!');
      router.push(`/users/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Editar Usuário</h1>
        <button
          onClick={() => router.push(`/users/${id}`)}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Função
          </label>
          <select
            id="role"
            {...register('role')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="TEACHER">Professor</option>
            <option value="COORDINATOR">Coordenador</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {errors.role && (
            <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
} 