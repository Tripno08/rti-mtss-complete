import { api } from './api';

// Tipos
export interface Student {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string;
  schoolId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    name: string;
  };
}

export interface CreateStudentDto {
  name: string;
  grade: string;
  dateOfBirth: string;
  schoolId?: string;
  userId: string;
}

export interface UpdateStudentDto {
  name?: string;
  grade?: string;
  dateOfBirth?: string;
  schoolId?: string;
}

// Funções de API
export const getStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estudantes:', error);
    throw error;
  }
};

export const getStudentById = async (id: string) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar estudante com ID ${id}:`, error);
    throw error;
  }
};

export const getStudentsBySchool = async (schoolId: string) => {
  try {
    const response = await api.get(`/students/school/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar estudantes da escola ${schoolId}:`, error);
    throw error;
  }
};

export const getStudentsByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/students/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar estudantes do usuário ${userId}:`, error);
    throw error;
  }
};

export const createStudent = async (data: CreateStudentDto) => {
  try {
    const response = await api.post('/students', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar estudante:', error);
    throw error;
  }
};

export const updateStudent = async (id: string, data: UpdateStudentDto) => {
  try {
    const response = await api.patch(`/students/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar estudante com ID ${id}:`, error);
    throw error;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir estudante com ID ${id}:`, error);
    throw error;
  }
};

// Função para buscar estudantes que necessitam de atenção especial
export const getStudentsRequiringAttention = async () => {
  try {
    // Esta é uma função hipotética que depende da implementação do backend
    // Pode ser necessário criar um endpoint específico para isso
    const response = await api.get('/students/requiring-attention');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estudantes que necessitam de atenção:', error);
    throw error;
  }
}; 