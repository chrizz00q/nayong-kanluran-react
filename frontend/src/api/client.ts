import axios from 'axios';

// All PHP endpoints live under /api on the same origin as the backend.
// In dev, vite.config.ts proxies /api -> PHP_BACKEND_URL so cookies are
// same-origin. In production, build this app and serve it from the same
// host as the PHP app (e.g. copy dist/ into the RBI web root) so /api still
// resolves correctly with no CORS setup required.
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired / not logged in - bounce to login.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function toFormData(payload: Record<string, unknown>): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      fd.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => fd.append(`${key}[]`, String(v)));
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? '1' : '');
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
}

export function uploadUrl(filename?: string | null): string | null {
  if (!filename) return null;
  return `/uploads/${filename}`;
}
