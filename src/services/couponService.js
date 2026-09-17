import apiClient from './apiClient';

export const couponService = {
  async getCoupons() {
    return await apiClient.get('/coupons');
  },

  async validateCoupon(code, cartTotal) {
    return await apiClient.post('/coupons/validate', { code, cartTotal });
  },

  async createCoupon(data) {
    return await apiClient.post('/coupons', data);
  },

  async updateCoupon(id, data) {
    return await apiClient.patch(`/coupons/${id}`, data);
  },

  async deleteCoupon(id) {
    return await apiClient.delete(`/coupons/${id}`);
  },
};
