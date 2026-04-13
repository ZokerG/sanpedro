import axios from 'axios';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useAuthStore } from '@/store/useAuthStore';

// Configuración de NProgress
nProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contador de peticiones activas para manejar peticiones concurrentes con nProgress
let activeRequests = 0;

axiosInstance.interceptors.request.use(
  (config) => {
    if (activeRequests === 0) {
      nProgress.start();
    }
    activeRequests++;
    
    // Inyectar el token desde Zustand
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      nProgress.done();
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) {
      nProgress.done();
    }
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      nProgress.done();
    }

    // Token expirado o inválido → cerrar sesión y redirigir al login
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/')
    ) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);
