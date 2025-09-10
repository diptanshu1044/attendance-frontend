import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services/api.service';
import { Department } from '../types';

// Query keys
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...departmentKeys.lists(), { filters }] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
  analytics: (id: string) => [...departmentKeys.all, 'analytics', id] as const,
};

// Get all departments
export const useDepartments = () => {
  const query = useQuery({
    queryKey: departmentKeys.lists(),
    queryFn: departmentService.getDepartments,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

  return {
    departments: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createDepartment: createDepartmentMutation.mutateAsync,
    updateDepartment: (id: string, data: Partial<Department>) => 
      updateDepartmentMutation.mutateAsync({ id, data }),
    deleteDepartment: deleteDepartmentMutation.mutateAsync,
    isCreating: createDepartmentMutation.isPending,
    isUpdating: updateDepartmentMutation.isPending,
    isDeleting: deleteDepartmentMutation.isPending,
  };
};

// Get single department
export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentService.getDepartment(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create department mutation
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

// Update department mutation
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) =>
      departmentService.updateDepartment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) });
    },
  });
};

// Delete department mutation
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentService.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

// Get department analytics
export const useDepartmentAnalytics = (id: string) => {
  return useQuery({
    queryKey: departmentKeys.analytics(id),
    queryFn: () => departmentService.getDepartmentAnalytics(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
