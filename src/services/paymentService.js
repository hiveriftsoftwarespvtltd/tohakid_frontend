import apiClient from './apiClient';

export const paymentService = {
  // Standard Razorpay endpoints
  async createRazorpayOrder(amount, receipt, notes = {}) {
    return await apiClient.post('/payments/create-order', { amount, receipt, notes });
  },

  async verifyPayment(paymentDetails) {
    return await apiClient.post('/payments/verify', paymentDetails);
  },

  async getAllAdminPayments() {
    return await apiClient.get('/payments/admin/all');
  },

  // Razorpay Magic 1-Click Checkout endpoints
  async createMagicOrder(amount, receipt, notes = {}, lineItems = []) {
    // Call /payments/create-order (universally available on backend)
    try {
      return await apiClient.post('/payments/create-order', {
        amount,
        receipt,
        notes,
        line_items: lineItems,
      });
    } catch {
      return await apiClient.post('/magic-checkout/create-order', {
        amount,
        receipt,
        notes,
        line_items: lineItems,
      });
    }
  },

  async verifyMagicPayment(payload) {
    // Attempt /magic-checkout/verify; fallback to /payments/verify
    try {
      return await apiClient.post('/magic-checkout/verify', payload);
    } catch {
      return await apiClient.post('/payments/verify', {
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature,
      });
    }
  },
};

export default paymentService;
