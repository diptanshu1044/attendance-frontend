import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/api.service';
import { Course, CreateCourseData, EnrollmentData, FacultyAssignmentData } from '../types';

// Query keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  analytics: (id: string) => [...courseKeys.all, 'analytics', id] as const,
};

// Get all courses
export const useCourses = () => {
  return useQuery({
    queryKey: courseKeys.lists(),
    queryFn: courseService.getCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single course
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseService.getCourse(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create course mutation
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
};

// Update course mutation
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCourseData> }) =>
      courseService.updateCourse(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) });
    },
  });
};

// Delete course mutation
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
};

// Enroll student mutation
export const useEnrollStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseService.enrollStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
};

// Assign faculty mutation
export const useAssignFaculty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseService.assignFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
};

// Get course analytics
export const useCourseAnalytics = (id: string) => {
  return useQuery({
    queryKey: courseKeys.analytics(id),
    queryFn: () => courseService.getCourseAnalytics(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
