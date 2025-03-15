import { api } from './api';
import { AxiosError } from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  schoolId?: string;
  school?: {
    id: string;
    name: string;
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  schoolId?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  schoolId?: string;
}

/**
 * Busca todos os usuários
 * @returns Lista de usuários
 */
export async function getUsers(): Promise<User[]> {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar usuários');
    }
    throw new Error('Erro ao buscar usuários');
  }
}

/**
 * Busca um usuário pelo ID
 * @param id ID do usuário
 * @returns Dados do usuário
 */
export async function getUserById(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar usuário');
    }
    throw new Error('Erro ao buscar usuário');
  }
}

/**
 * Cria um novo usuário
 * @param userData Dados do usuário a ser criado
 * @returns Dados do usuário criado
 */
export async function createUser(userData: CreateUserDto): Promise<User> {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Erro ao criar usuário');
    }
    throw new Error('Erro ao criar usuário');
  }
}

/**
 * Atualiza um usuário existente
 * @param id ID do usuário
 * @param userData Dados a serem atualizados
 * @returns Dados do usuário atualizado
 */
export async function updateUser(id: string, userData: UpdateUserDto): Promise<User> {
  try {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
    }
    throw new Error('Erro ao atualizar usuário');
  }
}

/**
 * Exclui um usuário
 * @param id ID do usuário a ser excluído
 * @returns void
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir usuário com ID ${id}:`, error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir usuário');
    }
    throw new Error('Erro ao excluir usuário');
  }
} 