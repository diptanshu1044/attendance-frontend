import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../services/api.service';
import { AttendanceRecord, StudentAnalytics } from '../types';

// Query keys
export const attendanceKeys = {
  all: ['attendance'] as const,
  student: (studentId: string, courseId?: string) => 
    [...attendanceKeys.all, 'student', studentId, courseId] as const,
  session: (sessionId: string) => 
    [...attendanceKeys.all, 'session', sessionId] as const,
  analytics: (studentId: string) => 
    [...attendanceKeys.all, 'analytics', studentId] as const,
};

// Get student attendance
export const useStudentAttendance = (studentId: string, courseId?: string) => {
  return useQuery({
    queryKey: attendanceKeys.student(studentId, courseId),
    queryFn: () => attendanceService.getStudentAttendance(studentId, courseId),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get session attendance
export const useSessionAttendance = (sessionId: string) => {
  return useQuery({
    queryKey: attendanceKeys.session(sessionId),
    queryFn: () => attendanceService.getSessionAttendance(sessionId),
    enabled: !!sessionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get student analytics
export const useStudentAnalytics = (studentId: string) => {
  return useQuery({
    queryKey: attendanceKeys.analytics(studentId),
    queryFn: () => attendanceService.getStudentAnalytics(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mark attendance via QR mutation
export const useMarkAttendanceQR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ qrCodeId, location }: { 
      qrCodeId: string; 
      location?: { latitude: number; longitude: number } 
    }) => attendanceService.markAttendanceQR(qrCodeId, location),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// Mark attendance online mutation
export const useMarkAttendanceOnline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, duration }: { 
      sessionId: string; 
      duration?: number 
    }) => attendanceService.markAttendanceOnline(sessionId, duration),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};
