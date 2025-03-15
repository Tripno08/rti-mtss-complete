import { api } from './api';

// Tipos
export interface Intervention {
  id: string;
  startDate: string;
  endDate?: string;
  type: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    grade: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterventionDto {
  startDate: string;
  endDate?: string;
  type: string;
  description: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  studentId: string;
  baseInterventionId?: string;
}

export interface UpdateInterventionDto {
  startDate?: string;
  endDate?: string;
  type?: string;
  description?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  studentId?: string;
}

// Funções de API
export const getInterventions = async (status?: string) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/interventions', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar intervenções:', error);
    throw error;
  }
};

export const getInterventionById = async (id: string) => {
  try {
    const response = await api.get(`/interventions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar intervenção com ID ${id}:`, error);
    throw error;
  }
};

export const getInterventionsByStudentId = async (studentId: string) => {
  try {
    const response = await api.get(`/interventions/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar intervenções do estudante ${studentId}:`, error);
    throw error;
  }
};

export const createIntervention = async (data: CreateInterventionDto) => {
  try {
    const response = await api.post('/interventions', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar intervenção:', error);
    throw error;
  }
};

export const updateIntervention = async (id: string, data: UpdateInterventionDto) => {
  try {
    const response = await api.patch(`/interventions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar intervenção com ID ${id}:`, error);
    throw error;
  }
};

export const completeIntervention = async (id: string) => {
  try {
    const response = await api.patch(`/interventions/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao completar intervenção com ID ${id}:`, error);
    throw error;
  }
};

export const cancelIntervention = async (id: string) => {
  try {
    const response = await api.patch(`/interventions/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar intervenção com ID ${id}:`, error);
    throw error;
  }
};

export const deleteIntervention = async (id: string) => {
  try {
    const response = await api.delete(`/interventions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir intervenção com ID ${id}:`, error);
    throw error;
  }
};

export const getBaseInterventions = async () => {
  try {
    const response = await api.get('/interventions/base');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar intervenções base:', error);
    throw error;
  }
}; 