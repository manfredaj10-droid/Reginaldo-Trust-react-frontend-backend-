import apiClient from './api.js';

export const contactService = {
  submitInquiry: async (inquiryData) => {
    return apiClient.post('/contact', inquiryData);
  },

  getAll: async (status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiClient.get(`/contact${query}`);
  },

  updateStatus: async (id, status) => {
    return apiClient.patch(`/contact/${id}`, { status });
  }
};

export default contactService;
