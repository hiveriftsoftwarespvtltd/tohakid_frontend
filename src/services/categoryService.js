import apiClient from './apiClient';

export const categoryService = {
  async getCategories() {
    return await apiClient.get('/categories');
  },

  async createCategory(data) {
    return await apiClient.post('/categories', data);
  },

  async updateCategory(id, data) {
    return await apiClient.patch(`/categories/${id}`, data);
  },

  async deleteCategory(id) {
    return await apiClient.delete(`/categories/${id}`);
  },
};
