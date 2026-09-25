import apiClient from './api.js';

export const pagesService = {
  getAll: async () => {
    const res = await apiClient.get('/pages');
    return res?.data || [];
  },

  getBySlug: async (slug) => {
    const res = await apiClient.get(`/pages/${slug}`);
    return res?.data || null;
  },

  updateSEO: async (slug, seoData) => {
    return apiClient.put(`/pages/${slug}/seo`, seoData);
  }
};

export default pagesService;
