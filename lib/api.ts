'use client';
import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001';
export const CLINIC_ID = Number(process.env.NEXT_PUBLIC_CLINIC_ID || 3);
export const WS_BASE   = process.env.NEXT_PUBLIC_MEDICAL_WS || 'ws://localhost:8001';

export const api = axios.create({
  baseURL: `${BASE}/api/v1`,
  timeout: 15000,
});

// Inject auth token when present (espace patient)
api.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('connect_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
