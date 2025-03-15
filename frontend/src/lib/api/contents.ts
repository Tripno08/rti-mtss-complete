import axios from 'axios';
import { API_URL } from '@/lib/constants';
import { getAuthToken } from '@/lib/auth';

// Tipos
export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'activity' | 'assessment';
  status: 'draft' | 'published';
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentDto {
  title: string;
  description: string;
  type: 'lesson' | 'activity' | 'assessment';
  status: 'draft' | 'published';
  classId: string;
}

export interface UpdateContentDto {
  title?: string;
  description?: string;
  type?: 'lesson' | 'activity' | 'assessment';
  status?: 'draft' | 'published';
}

// Funções da API

/**
 * Busca todos os conteúdos
 */
export async function getContents(): Promise<Content[]> {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/contents`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    throw error;
  }
}

/**
 * Busca um conteúdo pelo ID
 */
export async function getContentById(id: string): Promise<Content> {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/contents/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar conteúdo com ID ${id}:`, error);
    throw error;
  }
}

/**
 * Busca conteúdos por turma
 */
export async function getContentsByClass(classId: string): Promise<Content[]> {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/contents/class/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar conteúdos da turma ${classId}:`, error);
    throw error;
  }
}

/**
 * Cria um novo conteúdo
 */
export async function createContent(data: CreateContentDto): Promise<Content> {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/contents`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar conteúdo:', error);
    throw error;
  }
}

/**
 * Atualiza um conteúdo existente
 */
export async function updateContent(id: string, data: UpdateContentDto): Promise<Content> {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/contents/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar conteúdo com ID ${id}:`, error);
    throw error;
  }
}

/**
 * Exclui um conteúdo
 */
export async function deleteContent(id: string): Promise<void> {
  try {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/contents/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(`Erro ao excluir conteúdo com ID ${id}:`, error);
    throw error;
  }
}

// Funções auxiliares para dados mockados (temporário)
const MOCK_CONTENTS: Content[] = [
  {
    id: '1',
    title: 'Introdução à Matemática Básica',
    description: 'Fundamentos de adição, subtração, multiplicação e divisão',
    type: 'lesson',
    status: 'published',
    classId: '1',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Exercícios de Frações',
    description: 'Atividades práticas sobre operações com frações',
    type: 'activity',
    status: 'published',
    classId: '1',
    createdAt: '2023-10-05T14:30:00Z',
    updatedAt: '2023-10-05T14:30:00Z'
  },
  {
    id: '3',
    title: 'Avaliação Bimestral',
    description: 'Avaliação cobrindo os conteúdos do primeiro bimestre',
    type: 'assessment',
    status: 'draft',
    classId: '1',
    createdAt: '2023-10-10T09:15:00Z',
    updatedAt: '2023-10-10T09:15:00Z'
  },
  {
    id: '4',
    title: 'Introdução à Língua Portuguesa',
    description: 'Fundamentos de gramática e ortografia',
    type: 'lesson',
    status: 'published',
    classId: '2',
    createdAt: '2023-10-02T10:00:00Z',
    updatedAt: '2023-10-02T10:00:00Z'
  }
];

/**
 * Versão mockada para buscar todos os conteúdos
 */
export async function getMockContents(): Promise<Content[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CONTENTS);
    }, 500);
  });
}

/**
 * Versão mockada para buscar conteúdos por turma
 */
export async function getMockContentsByClass(classId: string): Promise<Content[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredContents = MOCK_CONTENTS.filter(content => content.classId === classId);
      resolve(filteredContents);
    }, 500);
  });
}

/**
 * Versão mockada para buscar um conteúdo pelo ID
 */
export async function getMockContentById(id: string): Promise<Content | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = MOCK_CONTENTS.find(content => content.id === id) || null;
      resolve(content);
    }, 500);
  });
}

/**
 * Versão mockada para criar um conteúdo
 */
export async function createMockContent(data: CreateContentDto): Promise<Content> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContent: Content = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      resolve(newContent);
    }, 500);
  });
}

/**
 * Versão mockada para atualizar um conteúdo
 */
export async function updateMockContent(id: string, data: UpdateContentDto): Promise<Content> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const contentIndex = MOCK_CONTENTS.findIndex(content => content.id === id);
      if (contentIndex === -1) {
        reject(new Error(`Conteúdo com ID ${id} não encontrado`));
        return;
      }
      
      const updatedContent: Content = {
        ...MOCK_CONTENTS[contentIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      resolve(updatedContent);
    }, 500);
  });
}

/**
 * Versão mockada para excluir um conteúdo
 */
export async function deleteMockContent(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const contentIndex = MOCK_CONTENTS.findIndex(content => content.id === id);
      if (contentIndex === -1) {
        reject(new Error(`Conteúdo com ID ${id} não encontrado`));
        return;
      }
      
      resolve();
    }, 500);
  });
} 