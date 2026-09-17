import apiClient from './apiClient';

export const paymentService = {
  async createRazorpayOrder(amount, receipt) {
    return await apiClient.post('/payments/create-order', { amount, receipt });
  },

  async verifyPayment(paymentDetails) {
    return await apiClient.post('/payments/verify', paymentDetails);
  },

  async getAllAdminPayments() {
    return await apiClient.get('/payments/admin/all');
  },
};
