import apiClient from './apiClient';

export const paymentService = {
  // Standard Razorpay endpoints
  async createRazorpayOrder(amount, receipt) {
    return await apiClient.post('/payments/create-order', { amount, receipt });
  },

  async verifyPayment(paymentDetails) {
    return await apiClient.post('/payments/verify', paymentDetails);
  },

  async getAllAdminPayments() {
    return await apiClient.get('/payments/admin/all');
  },

  // Razorpay Magic 1-Click Checkout endpoints
  async createMagicOrder(amount, receipt, notes = {}) {
    return await apiClient.post('/magic-checkout/create-order', { amount, receipt, notes });
  },

  async verifyMagicPayment(payload) {
    return await apiClient.post('/magic-checkout/verify', payload);
  },
};

export default paymentService;
