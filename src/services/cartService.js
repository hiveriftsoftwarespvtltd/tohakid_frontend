import apiClient from './apiClient';

export const cartService = {
  async getCart() {
    return await apiClient.get('/cart');
  },

  async addToCart(productId, size, qty = 1, extraOptions = {}) {
    return await apiClient.post('/cart/items', {
      productId,
      size,
      qty,
      child1Size: extraOptions.child1Size || null,
      child2Size: extraOptions.child2Size || null,
    });
  },

  async updateQuantity(productId, size, delta) {
    return await apiClient.patch(`/cart/items/${productId}`, { size, delta });
  },

  async removeFromCart(productId, size) {
    return await apiClient.delete(`/cart/items/${productId}`, { size });
  },

  async clearCart() {
    return await apiClient.delete('/cart');
  },

  async applyCoupon(code) {
    return await apiClient.post('/cart/apply-coupon', { code });
  },

  async removeCoupon() {
    return await apiClient.delete('/cart/coupon');
  },
};
