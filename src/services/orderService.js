import apiClient from './apiClient';

export const orderService = {
  async createOrder(orderData) {
    return await apiClient.post('/orders', orderData);
  },

  async getMyOrders() {
    return await apiClient.get('/orders');
  },

  async getOrderById(id) {
    return await apiClient.get(`/orders/${id}`);
  },

  async trackOrder(orderNumber) {
    return await apiClient.get(`/orders/track/${orderNumber}`);
  },

  async cancelOrder(id) {
    return await apiClient.patch(`/orders/${id}/cancel`);
  },

  // Admin APIs
  async getAllAdminOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await apiClient.get(`/admin/orders${queryString}`);
  },

  async updateOrderStatus(id, status) {
    return await apiClient.patch(`/admin/orders/${id}/status`, { status });
  },
};
