import apiClient from './apiClient';

export const genderCardService = {
  async getGenderCards() {
    return await apiClient.get('/gender-cards');
  },

  async createGenderCard(data) {
    return await apiClient.post('/gender-cards', data);
  },

  async updateGenderCard(id, data) {
    return await apiClient.patch(`/gender-cards/${id}`, data);
  },

  async deleteGenderCard(id) {
    return await apiClient.delete(`/gender-cards/${id}`);
  },
};
