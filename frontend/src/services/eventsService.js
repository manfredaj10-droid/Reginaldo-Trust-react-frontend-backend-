import apiClient from './api.js';

export const eventsService = {
  getAll: async (isExtra) => {
    const query = isExtra !== undefined ? `?is_extra=${isExtra}` : '';
    return apiClient.get(`/events${query}`);
  },

  create: async (eventData) => {
    return apiClient.post('/events', eventData);
  },

  update: async (id, eventData) => {
    return apiClient.put(`/events/${id}`, eventData);
  },

  delete: async (id) => {
    return apiClient.delete(`/events/${id}`);
  }
};

export default eventsService;
