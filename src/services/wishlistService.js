import apiClient from './apiClient';

export const wishlistService = {
  async getWishlist() {
    return await apiClient.get('/wishlist');
  },

  async toggleWishlist(productId) {
    return await apiClient.post(`/wishlist/${productId}`);
  },
};
