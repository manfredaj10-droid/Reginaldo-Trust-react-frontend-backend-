import apiClient from './api.js';

export const contentService = {
  getAll: async () => {
    return apiClient.get('/content');
  },

  get: async (section) => {
    return apiClient.get(`/content/${section}`);
  },

  update: async (section, data) => {
    return apiClient.put(`/content/${section}`, data);
  }
};

export default contentService;
