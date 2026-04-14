'use client';
import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<'user' | 'admin'>;
  adminLogin: (email: string, password: string, otp: string) => Promise<string>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setRole: (role: string | null) => void;
  setToken: (token: string | null) => void;
}

// ── Error extractor ───────────────────────────────────────────────────────────

const extractError = (err: unknown, fallback: string): string => {
  const detail = (err as any)?.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
  if (typeof detail === 'object') return detail.msg || JSON.stringify(detail);
  return fallback;
};

// ── Persist token helpers ─────────────────────────────────────────────────────

const persistToken = (token: string, role: string, daysExpiry = 30) => {
  Cookies.set('access_token', token, { expires: daysExpiry, sameSite: 'strict' });
  Cookies.set('user_role', role, { expires: daysExpiry, sameSite: 'strict' });
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ role }));
};

const clearToken = () => {
  Cookies.remove('access_token');
  Cookies.remove('user_role');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  role: null,

  // ── loadUser: rehydrate from cookie on app mount ──────────────────────────
  loadUser: async () => {
    const token = Cookies.get('access_token') || localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, token, role: res.data.role });
    } catch {
      // 401 interceptor in api.ts will handle redirect
    }
  },

  // ── login ─────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const form = new URLSearchParams();
      form.append('username', email.toLowerCase().trim());
      form.append('password', password);

      const res = await api.post('/auth/login', form.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, user } = res.data;
      persistToken(access_token, user.role);
      set({ user, token: access_token, role: user.role, isLoading: false });
      return user.role as 'user' | 'admin';
    } catch (err: unknown) {
      const msg = extractError(err, 'Login failed. Check your credentials.');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  // ── adminLogin ────────────────────────────────────────────────────────────
  adminLogin: async (email, password, otp) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/admin-login', {
        email: email.toLowerCase().trim(),
        password,
        otp,
      });

      const { access_token, user } = res.data;
      // Admin sessions expire in 8 h — use 0.33 days (≈ 8 h) for the cookie
      persistToken(access_token, 'admin', 0.34);
      set({ user, token: access_token, role: 'admin', isLoading: false });
      return access_token;
    } catch (err: unknown) {
      const msg = extractError(err, 'Admin authentication failed');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  // ── register ──────────────────────────────────────────────────────────────
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });

    // Client-side validation (mirrors backend rules)
    if (name.trim().length < 2) {
      set({ error: 'Name must be at least 2 characters', isLoading: false });
      throw new Error('Name must be at least 2 characters');
    }
    if (password.length < 8) {
      set({ error: 'Password must be at least 8 characters', isLoading: false });
      throw new Error('Password must be at least 8 characters');
    }

    try {
      const res = await api.post('/auth/register', {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      });

      const { access_token, user } = res.data;
      persistToken(access_token, user.role);
      set({ user, token: access_token, role: user.role, isLoading: false });
    } catch (err: unknown) {
      const msg = extractError(err, 'Registration failed. Please try again.');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  // ── logout ────────────────────────────────────────────────────────────────
  logout: () => {
    clearToken();
    set({ user: null, token: null, role: null });
  },

  clearError: () => set({ error: null }),
  setRole:    (role)  => set({ role }),
  setToken:   (token) => set({ token }),
}));
