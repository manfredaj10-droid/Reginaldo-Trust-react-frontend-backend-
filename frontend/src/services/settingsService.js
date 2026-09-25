import apiClient from './api.js';

export const settingsService = {
  get: async () => {
    const res = await apiClient.get('/settings');
    return res?.data || {};
  },

  update: async (settingsData) => {
    return apiClient.put('/settings', settingsData);
  }
};

export default settingsService;
