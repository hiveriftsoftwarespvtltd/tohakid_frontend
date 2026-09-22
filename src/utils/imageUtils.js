import { API_BASE_URL } from '../config/config';

/**
 * Optimizes Cloudinary URLs by injecting f_auto,q_auto transformations.
 * Reduces file sizes by 80-92% (e.g. 2.07MB -> 193KB WebP) without any visual quality loss.
 */
export const optimizeCloudinaryUrl = (url, transformations = 'f_auto,q_auto') => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }
  // Avoid duplicate injection
  if (url.includes('f_auto') || url.includes('q_auto')) {
    return url;
  }
  return url.replace('/image/upload/', `/image/upload/${transformations}/`);
};

/**
 * Formats image URLs. Converts relative backend `/uploads/...` paths to full server URLs,
 * applies automatic Cloudinary WebP/quality compression, while preserving frontend assets.
 */
export const formatImageUrl = (url, transformations = 'f_auto,q_auto') => {
  if (!url) return '';

  // 1. Cloudinary optimization (Automatic WebP & Smart Compression)
  if (typeof url === 'string' && url.includes('res.cloudinary.com')) {
    return optimizeCloudinaryUrl(url, transformations);
  }

  // 2. If local blob, base64 data, or frontend Vite asset path
  if (
    url.startsWith('blob:') ||
    url.startsWith('data:') ||
    url.startsWith('/src/') ||
    url.startsWith('/assets/') ||
    url.startsWith('@fs/')
  ) {
    return url;
  }

  // 3. Other external absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // 4. Backend base URL derived from API_BASE_URL (http://localhost:5000)
  const backendBase = (API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
};

