import { api } from './api';

export const schoolNetworksApi = {
  getAll: async () => {
    const response = await api.get('/school-networks');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/school-networks/${id}`);
    return response.data;
  },

  create: async (data: Omit<SchoolNetwork, 'id' | 'createdAt' | 'updatedAt' | 'schools' | '_count'>) => {
    const response = await api.post('/school-networks', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<SchoolNetwork, 'id' | 'createdAt' | 'updatedAt' | 'schools' | '_count'>>) => {
    const response = await api.patch(`/school-networks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/school-networks/${id}`);
    return response.data;
  },
}; 