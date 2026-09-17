import apiClient from './apiClient';

export const returnService = {
  async createReturn(data) {
    return await apiClient.post('/returns', data);
  },

  async getMyReturns() {
    return await apiClient.get('/returns');
  },

  async getAllAdminReturns() {
    return await apiClient.get('/returns/admin/all');
  },

  async updateReturnStatus(id, status, adminNotes) {
    return await apiClient.patch(`/returns/admin/${id}/status`, { status, adminNotes });
  },
};
