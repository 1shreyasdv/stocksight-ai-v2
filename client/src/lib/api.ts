import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://stocksight-ai-v2-api.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,   // Render free tier can be slow on cold-start
  withCredentials: false,
});

// ── Token helpers ─────────────────────────────────────────────────────────────

export const getToken = (): string | null =>
  Cookies.get('access_token') || localStorage.getItem('token') || null;

export const clearAuth = () => {
  Cookies.remove('access_token');
  Cookies.remove('user_role');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ── Request interceptor — attach Bearer token to EVERY request ────────────────

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — handle 401 / 403 ───────────────────────────────────

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status   = err.response?.status;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    if (status === 401) {
      // Only redirect to login when NOT already on an auth page
      const isAuthPage = ['/login', '/register', '/admin/login'].some((p) =>
        pathname.startsWith(p),
      );
      if (!isAuthPage) {
        clearAuth();
        const isAdmin = pathname.includes('/admin');
        window.location.href = isAdmin ? '/admin/login' : '/login';
      }
    }

    // 403 on admin routes means the token role isn't "admin"
    if (status === 403 && pathname.includes('/admin')) {
      console.warn(
        '[api] 403 on admin route — token may lack admin role. ' +
        'Re-login via /admin/login.',
      );
    }

    return Promise.reject(err);
  },
);

export default api;