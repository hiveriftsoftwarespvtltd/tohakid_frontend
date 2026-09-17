import apiClient from './apiClient';

export const bannerService = {
  async getBanners() {
    return await apiClient.get('/banners');
  },

  async createBanner(data) {
    return await apiClient.post('/banners', data);
  },

  async updateBanner(id, data) {
    return await apiClient.patch(`/banners/${id}`, data);
  },

  async deleteBanner(id) {
    return await apiClient.delete(`/banners/${id}`);
  },
};
