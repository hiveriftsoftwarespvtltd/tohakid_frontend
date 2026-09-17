import axios from 'axios';
import { API_BASE_URL } from '../config/config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Bearer token dynamically (Admin or Customer)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tohay_admin_token') || localStorage.getItem('tohay_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data payload & handle 401 authorization failures
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      (Array.isArray(error.response?.data?.errors) ? error.response.data.errors[0] : null) ||
      error.message ||
      'API Request Failed';
    return Promise.reject(new Error(message));
  }
);

class ApiClient {
  get(endpoint, config = {}) {
    return axiosInstance.get(endpoint, config);
  }

  post(endpoint, body, config = {}) {
    return axiosInstance.post(endpoint, body, config);
  }

  patch(endpoint, body, config = {}) {
    return axiosInstance.patch(endpoint, body, config);
  }

  delete(endpoint, body, config = {}) {
    return axiosInstance.delete(endpoint, { data: body, ...config });
  }

  upload(endpoint, file) {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
