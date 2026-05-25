// src/modules/store/api/interceptors.ts
import { AxiosError, AxiosResponse } from 'axios';
import axiosInstance from './axiosConfig';
import { useStore } from '../store/useStore';

interface ErrorResponse {
  message: string;
  code?: string;
}

export const setupInterceptors = (): void => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useStore.getState().token || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ErrorResponse>) => {
      // Logout only on 401 without forcing redirect
      // Let the component handle navigation
      if (error.response?.status === 401) {
        const store = useStore.getState();
        store.logout();
        localStorage.removeItem('token');
        // Don't navigate here - let the component decide based on current route
      }
      
      // Log errors for debugging
      if (error.response?.status >= 500) {
        console.error('Server error:', error.response.data);
      }
      
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;