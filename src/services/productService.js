import apiClient from './apiClient';

let pendingGetProductsPromise = null;
let pendingGetProductsQuery = null;

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';

    if (pendingGetProductsPromise && pendingGetProductsQuery === queryString) {
      return pendingGetProductsPromise;
    }

    pendingGetProductsQuery = queryString;
    pendingGetProductsPromise = apiClient.get(`/products${queryString}`).finally(() => {
      pendingGetProductsPromise = null;
      pendingGetProductsQuery = null;
    });

    return await pendingGetProductsPromise;
  },

  async getProductById(id) {
    return await apiClient.get(`/products/${id}`);
  },

  async createProduct(data) {
    return await apiClient.post('/products', data);
  },

  async updateProduct(id, data) {
    return await apiClient.patch(`/products/${id}`, data);
  },

  async deleteProduct(id) {
    return await apiClient.delete(`/products/${id}`);
  },

  async bulkDeleteProducts(ids) {
    return await apiClient.post('/products/bulk-delete', { ids });
  },

  async bulkUpdateStatus(ids, status) {
    return await apiClient.post('/products/bulk-status', { ids, status });
  },
};
