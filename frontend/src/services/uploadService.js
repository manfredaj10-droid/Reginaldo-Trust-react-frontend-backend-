import apiClient from './api.js';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.upload('/upload', formData);
    return res;
  }
};

export default uploadService;
