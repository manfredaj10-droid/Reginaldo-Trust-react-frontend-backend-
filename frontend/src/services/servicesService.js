import apiClient from './api.js';

export const servicesService = {
  // Catalog CRUD
  getCatalog: async () => {
    return apiClient.get('/services/catalog');
  },

  createService: async (serviceData) => {
    return apiClient.post('/services/catalog', serviceData);
  },

  updateService: async (id, serviceData) => {
    return apiClient.put(`/services/catalog/${id}`, serviceData);
  },

  deleteService: async (id) => {
    return apiClient.delete(`/services/catalog/${id}`);
  },

  // Citizen Assistance Requests
  requestAssistance: async (requestData) => {
    return apiClient.post('/services/request', requestData);
  },

  getAllRequests: async (category, status) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`/services/requests${qs}`);
  }
};

export default servicesService;
