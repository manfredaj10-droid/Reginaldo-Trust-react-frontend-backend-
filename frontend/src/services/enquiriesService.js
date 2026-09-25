import apiClient from './api.js';

export const enquiriesService = {
  getAll: async (status) => {
    const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
    const res = await apiClient.get(`/enquiries${query}`);
    return res?.data || [];
  },

  updateStatus: async (id, status) => {
    return apiClient.patch(`/enquiries/${id}/status`, { status });
  },

  delete: async (id) => {
    return apiClient.delete(`/enquiries/${id}`);
  }
};

export default enquiriesService;
