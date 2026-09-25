import apiClient from './api.js';

export const initiativesService = {
  getAll: async () => {
    const res = await apiClient.get('/initiatives');
    return res?.data || [];
  },

  create: async (initiativeData) => {
    return apiClient.post('/initiatives', initiativeData);
  },

  update: async (id, initiativeData) => {
    return apiClient.put(`/initiatives/${id}`, initiativeData);
  },

  delete: async (id) => {
    return apiClient.delete(`/initiatives/${id}`);
  }
};

export default initiativesService;
