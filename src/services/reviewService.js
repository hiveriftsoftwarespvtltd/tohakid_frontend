import apiClient from './apiClient';

export const reviewService = {
  async getProductReviews(productId) {
    return await apiClient.get(`/reviews/product/${productId}`);
  },

  async createReview(data) {
    return await apiClient.post('/reviews', data);
  },

  async getAllAdminReviews() {
    return await apiClient.get('/reviews/admin/all');
  },

  async updateReviewStatus(id, status) {
    return await apiClient.patch(`/reviews/admin/${id}/status`, { status });
  },

  async deleteReview(id) {
    return await apiClient.delete(`/reviews/admin/${id}`);
  },
};
