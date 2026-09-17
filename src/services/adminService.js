import apiClient from './apiClient';

export const adminService = {
  async getDashboardMetrics() {
    return await apiClient.get('/admin/dashboard');
  },

  async getAnalyticsData(period = '30d') {
    return await apiClient.get(`/admin/analytics?period=${period}`);
  },

  async getSalesReport() {
    return await apiClient.get('/admin/reports/sales');
  },

  async getGstReport() {
    return await apiClient.get('/admin/reports/gst');
  },

  async getStoreSettings() {
    return await apiClient.get('/settings');
  },

  async updateStoreSettings(settings) {
    return await apiClient.patch('/settings', settings);
  },

  async getInventoryList() {
    return await apiClient.get('/inventory');
  },

  async getLowStockProducts(threshold = 10) {
    return await apiClient.get(`/inventory/low-stock?threshold=${threshold}`);
  },

  async adjustStock(productId, adjustment, reason) {
    return await apiClient.patch(`/inventory/${productId}/adjust`, { adjustment, reason });
  },
};
