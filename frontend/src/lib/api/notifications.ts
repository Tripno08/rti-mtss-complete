import { api } from './api';

// Tipos
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'intervention' | 'assessment' | 'meeting' | 'message';
  read: boolean;
  link?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Funções de API
export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    throw error;
  }
};

export const getNotificationsByUser = async (userId: string) => {
  try {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar notificações do usuário ${userId}:`, error);
    throw error;
  }
};

export const getUnreadNotificationsByUser = async (userId: string) => {
  try {
    const response = await api.get(`/notifications/user/${userId}/unread`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar notificações não lidas do usuário ${userId}:`, error);
    throw error;
  }
};

export const getNotificationById = async (id: string) => {
  try {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar notificação com ID ${id}:`, error);
    throw error;
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao marcar notificação ${id} como lida:`, error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const response = await api.patch(`/notifications/user/${userId}/read-all`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao marcar todas as notificações do usuário ${userId} como lidas:`, error);
    throw error;
  }
};

export const deleteNotification = async (id: string) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir notificação com ID ${id}:`, error);
    throw error;
  }
}; 