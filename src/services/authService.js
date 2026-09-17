import apiClient from './apiClient';

export const authService = {
  async signup(data) {
    const res = await apiClient.post('/auth/signup', data);
    if (res.data?.accessToken) {
      localStorage.setItem('tohay_access_token', res.data.accessToken);
    }
    return res;
  },

  async login(data) {
    const res = await apiClient.post('/auth/login', data);
    if (res.data?.accessToken) {
      localStorage.setItem('tohay_access_token', res.data.accessToken);
    }
    return res;
  },

  async adminLogin(data) {
    const res = await apiClient.post('/auth/admin/login', data);
    if (res.data?.accessToken) {
      localStorage.setItem('tohay_access_token', res.data.accessToken);
    }
    return res;
  },

  async updateAdminCredentials(data) {
    return await apiClient.post('/auth/admin/update-credentials', data);
  },

  async getMe() {
    return await apiClient.get('/auth/me');
  },

  async logout() {
    localStorage.removeItem('tohay_access_token');
    return await apiClient.post('/auth/logout');
  },
};
