import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services/api.service';
import { Session, CreateSessionData } from '../types';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...sessionKeys.lists(), { filters }] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
  attendance: (id: string) => [...sessionKeys.all, 'attendance', id] as const,
};

// Get all sessions
export const useSessions = () => {
  return useQuery({
    queryKey: sessionKeys.lists(),
    queryFn: sessionService.getSessions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single session
export const useSession = (id: string) => {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionService.getSession(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Create session mutation
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};

// Update session mutation
export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSessionData> }) =>
      sessionService.updateSession(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
    },
  });
};

// Delete session mutation
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};

// Generate QR code mutation
export const useGenerateQR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, location }: { id: string; location?: { latitude: number; longitude: number } }) =>
      sessionService.generateQR(id, location),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
    },
  });
};

// Join session mutation
export const useJoinSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.joinSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};

// Leave session mutation
export const useLeaveSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionService.leaveSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};

// Get attendance status
export const useAttendanceStatus = (id: string) => {
  return useQuery({
    queryKey: sessionKeys.attendance(id),
    queryFn: () => sessionService.getAttendanceStatus(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};
