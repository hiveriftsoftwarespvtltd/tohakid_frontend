import apiClient from './apiClient';

export const uploadService = {
  async uploadImage(file) {
    return await apiClient.upload('/uploads/image', file);
  },
};
