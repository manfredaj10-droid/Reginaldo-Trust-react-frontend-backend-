import apiClient from './api.js';

export const galleryService = {
  getByCategory: async (category = 'all') => {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    return apiClient.get(`/gallery${query}`);
  },

  create: async (itemData) => {
    return apiClient.post('/gallery', itemData);
  },

  update: async (id, itemData) => {
    return apiClient.put(`/gallery/${id}`, itemData);
  },

  delete: async (id) => {
    return apiClient.delete(`/gallery/${id}`);
  },

  getCategories: async () => {
    const res = await apiClient.get('/gallery/categories');
    return res?.data || [];
  },

  addCategory: async (categoryData) => {
    return apiClient.post('/gallery/categories', categoryData);
  },

  deleteCategory: async (id) => {
    return apiClient.delete(`/gallery/categories/${id}`);
  }
};

export default galleryService;
