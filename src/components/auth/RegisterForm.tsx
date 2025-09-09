import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, User, Phone, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApiQuery } from '../../hooks/useApi';
import { API_ENDPOINTS } from '../../constants/api';
import { Department } from '../../types/auth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const registerSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup.string().oneOf(['ADMIN', 'FACULTY', 'STUDENT']).required('Role is required'),
  phoneNumber: yup.string().optional(),
  departmentId: yup.string().optional(),
  studentId: yup.string().when('role', {
    is: 'STUDENT',
    then: (schema) => schema.required('Student ID is required'),
    otherwise: (schema) => schema.optional(),
  }),
  employeeId: yup.string().when('role', {
    is: (role: string) => role === 'FACULTY' || role === 'ADMIN',
    then: (schema) => schema.required('Employee ID is required'),
    otherwise: (schema) => schema.optional(),
  }),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register: registerUser, isLoading } = useAuth();
  
  const { data: departments = [] } = useApiQuery<Department[]>(
    ['departments'],
    API_ENDPOINTS.DEPARTMENTS.LIST
  );

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'STUDENT',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Join the attendance management system
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            leftIcon={<User size={16} />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />

          <Input
            label="Last Name"
            leftIcon={<User size={16} />}
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email"
          type="email"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number"
          type="tel"
          leftIcon={<Phone size={16} />}
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            {...register('role')}
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Department
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            {...register('departmentId')}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p>
          )}
        </div>

        {selectedRole === 'STUDENT' && (
          <Input
            label="Student ID"
            error={errors.studentId?.message}
            {...register('studentId')}
          />
        )}

        {(selectedRole === 'FACULTY' || selectedRole === 'ADMIN') && (
          <Input
            label="Employee ID"
            error={errors.employeeId?.message}
            {...register('employeeId')}
          />
        )}

        <Input
          label="Password"
          type="password"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          leftIcon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </Card>
  );
};

export default RegisterForm;