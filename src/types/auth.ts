export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
  profilePicture?: string;
  department?: Department;
  phoneNumber?: string;
  studentId?: string;
  employeeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  departmentId: string;
  department?: Department;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
  departmentId?: string;
  phoneNumber?: string;
  studentId?: string;
  employeeId?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}