import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { handleApiError, handleApiSuccess } from '../utils/api';

// Generic hook for GET requests
export const useApiQuery = <T>(
  key: (string | number)[],
  url: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get(url);
      return response.data;
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    gcTime: options?.cacheTime || 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled,
  });
};

// Generic hook for POST/PUT/DELETE requests
export const useApiMutation = <TData, TVariables = any>(
  method: 'POST' | 'PUT' | 'DELETE',
  url: string | ((variables: TVariables) => string),
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    invalidateQueries?: (string | number)[][];
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<TData, any, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url;
      
      let response;
      switch (method) {
        case 'POST':
          response = await api.post(endpoint, variables);
          break;
        case 'PUT':
          response = await api.put(endpoint, variables);
          break;
        case 'DELETE':
          response = await api.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      if (options?.successMessage) {
        handleApiSuccess(options.successMessage);
      }
      
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error);
      options?.onError?.(error);
    },
  });
};