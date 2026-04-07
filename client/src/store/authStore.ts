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

const extractError = (err: unknown, fallback: string): string => {
  const detail = (err as any)?.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
  if (typeof detail === 'object') return detail.msg || JSON.stringify(detail);
  return fallback;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  role: null,

  loadUser: async () => {
    const token = Cookies.get('access_token');
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, token });
    } catch {
      // Only clear on 401 (handled by interceptor)
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);
      const res = await api.post('/auth/login', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const { access_token, user } = res.data;
      Cookies.set('access_token', access_token, { expires: 30, sameSite: 'strict' });
      Cookies.set('user_role', user.role, { expires: 30 });
      set({ user, token: access_token, isLoading: false });
      return user.role as 'user' | 'admin';
    } catch (err: unknown) {
      const msg = extractError(err, 'Login failed');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  adminLogin: async (email, password, otp) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/admin-login', { email, password, otp });
      const { access_token, user } = res.data;
      Cookies.set('access_token', access_token, { expires: 1, sameSite: 'strict' });
      Cookies.set('user_role', 'admin', { expires: 1 });
      set({ user, token: access_token, role: 'admin', isLoading: false });
      return access_token;
    } catch (err: unknown) {
      const msg = extractError(err, 'Admin authentication failed');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { access_token, user } = res.data;
      Cookies.set('access_token', access_token, { expires: 30 });
      Cookies.set('user_role', user.role, { expires: 30 });
      set({ user, token: access_token, isLoading: false });
    } catch (err: unknown) {
      const msg = extractError(err, 'Registration failed');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('user_role');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
  setRole: (role) => set({ role }),
  setToken: (token) => set({ token }),
}));
