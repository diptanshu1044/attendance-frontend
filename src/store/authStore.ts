import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/api';
import { AuthState, User, RegisterData, LoginResponse } from '../types/auth';
import { handleApiError, handleApiSuccess } from '../utils/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
          });

          const { user, token } = response.data.data || response.data;
          
          console.log('Login successful - Token received:', token ? 'Yes' : 'No');
          console.log('Login successful - User:', user);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          console.log('Auth store updated - Token stored:', token ? 'Yes' : 'No');
          
          handleApiSuccess('Login successful!');
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ 
            error: errorMessage, 
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
          
          const { user, token } = response.data.data || response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          handleApiSuccess('Registration successful!');
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ 
            error: errorMessage, 
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        handleApiSuccess('Logged out successfully!');
      },

      updateProfile: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.put<User>(API_ENDPOINTS.AUTH.PROFILE, userData);
          
          set({
            user: response.data,
            isLoading: false,
          });
          
          handleApiSuccess('Profile updated successfully!');
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrated:', state);
      },
    }
  )
);