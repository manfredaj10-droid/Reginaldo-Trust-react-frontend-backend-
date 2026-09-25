import apiClient from './api.js';

export const sectionsService = {
  getByPage: async (pageSlug) => {
    const res = await apiClient.get(`/sections/${pageSlug}`);
    return res?.data || [];
  },

  getByKey: async (pageSlug, sectionKey) => {
    const res = await apiClient.get(`/sections/${pageSlug}/${sectionKey}`);
    return res?.data || null;
  },

  update: async (pageSlug, sectionKey, sectionData) => {
    return apiClient.put(`/sections/${pageSlug}/${sectionKey}`, sectionData);
  },

  delete: async (pageSlug, sectionKey) => {
    return apiClient.delete(`/sections/${pageSlug}/${sectionKey}`);
  }
};

export default sectionsService;
