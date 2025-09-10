import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authState = useAuthStore.getState();
    const token = authState.token;
    console.log('API Request - Auth State:', { 
      hasToken: !!token, 
      isAuthenticated: authState.isAuthenticated,
      hasUser: !!authState.user,
      url: config.url 
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request - Authorization header set for:', config.url);
    } else {
      console.log('API Request - No token available for:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token } = response.data;
          useAuthStore.getState().setToken(token);
          
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 'An error occurred';
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;

// Helper function for handling API errors
export const handleApiError = (error: any) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  toast.error(errorMessage);
  console.error('API Error:', error);
  return errorMessage;
};

// Helper function for success messages
export const handleApiSuccess = (message: string) => {
  toast.success(message);
};