import { api } from './api';

// Tipos
export interface Assessment {
  id: string;
  date: string;
  type: string;
  score: number;
  notes?: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    name: string;
    grade: string;
  };
}

export interface CreateAssessmentDto {
  date: string;
  type: string;
  score: number;
  notes?: string;
  studentId: string;
}

export interface UpdateAssessmentDto {
  date?: string;
  type?: string;
  score?: number;
  notes?: string;
  studentId?: string;
}

// Funções de API
export const getAssessments = async () => {
  try {
    const response = await api.get('/assessments');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw error;
  }
};

export const getAssessmentById = async (id: string) => {
  try {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar avaliação com ID ${id}:`, error);
    throw error;
  }
};

export const getAssessmentsByStudentId = async (studentId: string) => {
  try {
    const response = await api.get(`/assessments/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar avaliações do estudante ${studentId}:`, error);
    throw error;
  }
};

export const createAssessment = async (data: CreateAssessmentDto) => {
  try {
    const response = await api.post('/assessments', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    throw error;
  }
};

export const updateAssessment = async (id: string, data: UpdateAssessmentDto) => {
  try {
    const response = await api.patch(`/assessments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar avaliação com ID ${id}:`, error);
    throw error;
  }
};

export const deleteAssessment = async (id: string) => {
  try {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir avaliação com ID ${id}:`, error);
    throw error;
  }
};

// Funções auxiliares
export const getAssessmentTypeOptions = () => [
  { value: 'Diagnóstica', label: 'Diagnóstica' },
  { value: 'Formativa', label: 'Formativa' },
  { value: 'Somativa', label: 'Somativa' },
  { value: 'Prova', label: 'Prova' },
  { value: 'Trabalho', label: 'Trabalho' },
  { value: 'Projeto', label: 'Projeto' },
  { value: 'Apresentação', label: 'Apresentação' },
  { value: 'Participação', label: 'Participação' },
  { value: 'Outro', label: 'Outro' }
]; 