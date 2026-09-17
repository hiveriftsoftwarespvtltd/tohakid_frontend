import apiClient from './apiClient';

export const addressService = {
  async getAddresses() {
    return await apiClient.get('/addresses');
  },

  async addAddress(data) {
    return await apiClient.post('/addresses', data);
  },

  async updateAddress(id, data) {
    return await apiClient.patch(`/addresses/${id}`, data);
  },

  async deleteAddress(id) {
    return await apiClient.delete(`/addresses/${id}`);
  },

  async setDefaultAddress(id) {
    return await apiClient.patch(`/addresses/${id}/default`);
  },
};
