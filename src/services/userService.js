import apiClient from './apiClient';

export const userService = {
  async getMyProfile() {
    return await apiClient.get('/users/me');
  },

  async updateMyProfile(fields) {
    return await apiClient.patch('/users/me', fields);
  },

  async getAllCustomers(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await apiClient.get(`/users${queryString}`);
  },

  async getCustomerById(id) {
    return await apiClient.get(`/users/${id}`);
  },

  async deleteUser(id) {
    return await apiClient.delete(`/users/${id}`);
  },
};
