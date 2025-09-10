import React, { useState, useEffect } from 'react';
import { X, Building2, Hash, AlertCircle } from 'lucide-react';
import { useDepartments } from '../../hooks/useDepartments';
import { Department } from '../../types/auth';
import toast from 'react-hot-toast';

interface DepartmentFormProps {
  department?: Department | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  code?: string;
  general?: string;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ department, onClose, onSuccess }) => {
  const { createDepartment, updateDepartment } = useDepartments();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });

  useEffect(() => {
    console.log('DepartmentForm - department prop:', department);
    if (department) {
      console.log('DepartmentForm - department.id:', department.id);
      console.log('DepartmentForm - department object keys:', Object.keys(department));
      setFormData({
        name: department.name,
        code: department.code,
      });
    } else {
      setFormData({
        name: '',
        code: '',
      });
    }
    // Clear errors when department changes
    setErrors({});
  }, [department]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Department name must be at least 2 characters';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Department code is required';
    } else if (formData.code.trim().length < 2) {
      newErrors.code = 'Department code must be at least 2 characters';
    } else if (!/^[A-Z0-9]+$/.test(formData.code.trim())) {
      newErrors.code = 'Department code must contain only uppercase letters and numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const trimmedData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
      };

      if (department) {
        // Update existing department
        console.log('Updating department - department object:', department);
        console.log('Updating department - department.id:', department.id);
        console.log('Updating department - trimmedData:', trimmedData);
        if (!department.id) {
          console.error('Department ID is missing! Department object:', department);
          throw new Error('Department ID is missing');
        }
        console.log('Calling updateDepartment with id:', department.id, 'and data:', trimmedData);
        await updateDepartment(department.id, trimmedData);
        toast.success('Department updated successfully');
      } else {
        // Create new department
        console.log('Creating department:', trimmedData);
        await createDepartment(trimmedData);
        toast.success('Department created successfully');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Department save error:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors: FormErrors = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.path === 'name') backendErrors.name = err.msg;
          if (err.path === 'code') backendErrors.code = err.msg;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
        toast.error(error.response.data.message);
      } else {
        setErrors({ general: 'Failed to save department' });
        toast.error(error.message || 'Failed to save department');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {department ? 'Edit Department' : 'Add New Department'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.name 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter department name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Department Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department Code *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.code 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter department code (e.g., CS, EE, ME)"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.code}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use uppercase letters and numbers only (e.g., CS, EE, ME, IT)
                </p>
              </div>

            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : department ? 'Update Department' : 'Create Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;
