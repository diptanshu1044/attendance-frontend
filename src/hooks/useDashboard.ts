import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/api.service';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (role: string) => [...dashboardKeys.all, 'stats', role] as const,
};

// Get dashboard stats
export const useDashboardStats = (role: string) => {
  return useQuery({
    queryKey: dashboardKeys.stats(role),
    queryFn: dashboardService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
