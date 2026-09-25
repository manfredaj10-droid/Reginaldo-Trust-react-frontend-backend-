import apiClient from './api.js';

export const adminService = {
  login: async (credentials) => {
    const payload = typeof credentials === 'string'
      ? { username: 'admin', password: credentials }
      : { username: credentials.username || 'admin', password: credentials.password };

    const res = await apiClient.post('/auth/login', payload);
    if (res?.token) {
      localStorage.setItem('regi_admin_token', res.token);
      localStorage.setItem('regi_admin_user', JSON.stringify(res.user));
    }
    return res;
  },

  logout: () => {
    localStorage.removeItem('regi_admin_token');
    localStorage.removeItem('regi_admin_user');
  },

  isAuthenticated: () => {
    return Boolean(localStorage.getItem('regi_admin_token'));
  },

  getUser: () => {
    try {
      const u = localStorage.getItem('regi_admin_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  getStats: async () => {
    return apiClient.get('/admin/stats');
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.put('/auth/profile', profileData);
    if (res?.user) {
      localStorage.setItem('regi_admin_user', JSON.stringify(res.user));
    }
    return res;
  },

  deleteContact: async (id) => {
    return apiClient.delete(`/enquiries/${id}`);
  }
};

export default adminService;
