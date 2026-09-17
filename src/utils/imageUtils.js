import { API_BASE_URL } from '../config/config';

/**
 * Formats image URLs. Converts relative backend `/uploads/...` paths to full server URLs,
 * while preserving frontend local assets, base64 data, and external URLs.
 */
export const formatImageUrl = (url) => {
  if (!url) return '';
  
  // If already absolute URL, blob, base64, or frontend Vite asset path
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:') ||
    url.startsWith('/src/') ||
    url.startsWith('/assets/') ||
    url.startsWith('@fs/')
  ) {
    return url;
  }

  // Backend base URL derived from API_BASE_URL (http://localhost:5000)
  const backendBase = (API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
};
