import { api } from './api';

// Tipos
export interface Class {
  id: string;
  name: string;
  grade: string;
  subject?: string;
  schoolId: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    name: string;
  };
  teacher?: {
    id: string;
    name: string;
  };
  _count?: {
    students: number;
  };
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  joinedAt: string;
  student: {
    id: string;
    name: string;
    grade: string;
    performanceLevel?: 'high' | 'medium' | 'low';
    interventionsCount?: number;
    lastAssessmentDate?: string;
    attentionRequired?: boolean;
    attentionReason?: string;
  };
}

export interface CreateClassDto {
  name: string;
  grade: string;
  subject?: string;
  schoolId: string;
  teacherId: string;
}

export interface UpdateClassDto {
  name?: string;
  grade?: string;
  subject?: string;
  schoolId?: string;
  teacherId?: string;
}

// Funções de API
export const getClasses = async () => {
  try {
    const response = await api.get('/classes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    throw error;
  }
};

export const getClassById = async (id: string) => {
  try {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar turma com ID ${id}:`, error);
    throw error;
  }
};

export const getClassesBySchool = async (schoolId: string) => {
  try {
    const response = await api.get(`/classes/school/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar turmas da escola ${schoolId}:`, error);
    throw error;
  }
};

export const getClassesByTeacher = async (teacherId: string) => {
  try {
    const response = await api.get(`/classes/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar turmas do professor ${teacherId}:`, error);
    throw error;
  }
};

export const createClass = async (data: CreateClassDto) => {
  try {
    const response = await api.post('/classes', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar turma:', error);
    throw error;
  }
};

export const updateClass = async (id: string, data: UpdateClassDto) => {
  try {
    const response = await api.patch(`/classes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar turma com ID ${id}:`, error);
    throw error;
  }
};

export const deleteClass = async (id: string) => {
  try {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir turma com ID ${id}:`, error);
    throw error;
  }
};

// Funções para gerenciar estudantes na turma
export const getClassStudents = async (classId: string) => {
  try {
    const response = await api.get(`/classes/${classId}/students`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar estudantes da turma ${classId}:`, error);
    throw error;
  }
};

export const addStudentToClass = async (classId: string, studentId: string) => {
  try {
    const response = await api.post(`/classes/${classId}/students`, { studentId });
    return response.data;
  } catch (error) {
    console.error(`Erro ao adicionar estudante ${studentId} à turma ${classId}:`, error);
    throw error;
  }
};

export const removeStudentFromClass = async (classId: string, studentId: string) => {
  try {
    const response = await api.delete(`/classes/${classId}/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao remover estudante ${studentId} da turma ${classId}:`, error);
    throw error;
  }
}; 