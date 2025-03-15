import { api } from './api';

// Interfaces
export interface LessonPlan {
  id: string;
  title: string;
  description?: string;
  objectives?: string;
  resources?: string;
  activities?: string;
  assessment?: string;
  duration?: number;
  date?: string;
  status: string;
  notes?: string;
  classId: string;
  contentId?: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    name: string;
    grade: string;
    subject?: string;
  };
  content?: {
    id: string;
    title: string;
    type: string;
    status: string;
  };
  teacher?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface CreateLessonPlanDTO {
  title: string;
  description?: string;
  objectives?: string;
  resources?: string;
  activities?: string;
  assessment?: string;
  duration?: number;
  date?: string;
  status?: string;
  notes?: string;
  classId: string;
  contentId?: string;
  teacherId: string;
}

export interface UpdateLessonPlanDTO extends Partial<CreateLessonPlanDTO> {
  // Extensão da interface CreateLessonPlanDTO com todos os campos opcionais
}

// Funções de API
export const getLessonPlans = async (): Promise<LessonPlan[]> => {
  try {
    const response = await api.get('/lesson-plans');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar planos de aula:', error);
    throw error;
  }
};

export const getLessonPlanById = async (id: string): Promise<LessonPlan> => {
  try {
    const response = await api.get(`/lesson-plans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar plano de aula com ID ${id}:`, error);
    throw error;
  }
};

export const getLessonPlansByClass = async (classId: string): Promise<LessonPlan[]> => {
  try {
    const response = await api.get(`/lesson-plans/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar planos de aula da turma ${classId}:`, error);
    throw error;
  }
};

export const getLessonPlansByTeacher = async (teacherId: string): Promise<LessonPlan[]> => {
  try {
    const response = await api.get(`/lesson-plans/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar planos de aula do professor ${teacherId}:`, error);
    throw error;
  }
};

export const createLessonPlan = async (lessonPlan: CreateLessonPlanDTO): Promise<LessonPlan> => {
  try {
    const response = await api.post('/lesson-plans', lessonPlan);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar plano de aula:', error);
    throw error;
  }
};

export const updateLessonPlan = async (id: string, lessonPlan: UpdateLessonPlanDTO): Promise<LessonPlan> => {
  try {
    const response = await api.patch(`/lesson-plans/${id}`, lessonPlan);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar plano de aula com ID ${id}:`, error);
    throw error;
  }
};

export const deleteLessonPlan = async (id: string): Promise<void> => {
  try {
    await api.delete(`/lesson-plans/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir plano de aula com ID ${id}:`, error);
    throw error;
  }
}; 