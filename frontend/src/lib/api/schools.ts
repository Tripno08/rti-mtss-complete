import { api } from './api';

export const schoolsApi = {
  getAll: async () => {
    const response = await api.get('/schools');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/schools/${id}`);
    return response.data;
  },

  create: async (data: Omit<School, 'id' | 'createdAt' | 'updatedAt' | 'network' | '_count'>) => {
    const response = await api.post('/schools', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<School, 'id' | 'createdAt' | 'updatedAt' | 'network' | '_count'>>) => {
    const response = await api.patch(`/schools/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/schools/${id}`);
    return response.data;
  },

  getByNetwork: async (networkId: string) => {
    const response = await api.get(`/schools/network/${networkId}`);
    return response.data;
  },
}; 