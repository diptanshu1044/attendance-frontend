import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/api.service';
import { User, RegisterData } from '../types/auth';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch students
  const {
    data: students = [],
    isLoading: isLoadingStudents
  } = useQuery({
    queryKey: ['users', 'students'],
    queryFn: userService.getStudents,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch faculty
  const {
    data: faculty = [],
    isLoading: isLoadingFaculty
  } = useQuery({
    queryKey: ['users', 'faculty'],
    queryFn: userService.getFaculty,
    staleTime: 5 * 60 * 1000,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      return userService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'students'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'faculty'] });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: Partial<User> }) => {
      return userService.updateUser(id, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'students'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'faculty'] });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return userService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'students'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'faculty'] });
    },
  });

  // Create user function
  const createUser = async (userData: RegisterData) => {
    try {
      await createUserMutation.mutateAsync(userData);
      toast.success('User created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
      throw error;
    }
  };

  // Update user function
  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      await updateUserMutation.mutateAsync({ id, userData });
      toast.success('User updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
      throw error;
    }
  };

  // Delete user function
  const deleteUser = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      toast.success('User deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
      throw error;
    }
  };

  return {
    users,
    students,
    faculty,
    isLoading: isLoading || isLoadingStudents || isLoadingFaculty,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
