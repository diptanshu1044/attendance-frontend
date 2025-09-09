import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    error,
  } = useAuthStore();

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = () => hasRole('ADMIN');
  const isFaculty = () => hasRole('FACULTY');
  const isStudent = () => hasRole('STUDENT');

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    error,
    hasRole,
    hasAnyRole,
    isAdmin,
    isFaculty,
    isStudent,
  };
};