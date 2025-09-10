import React from 'react';
import { Edit, Trash2, Building2, Calendar, BookOpen, Eye } from 'lucide-react';
import { useDepartments } from '../../hooks/useDepartments';
import { Department } from '../../types/auth';
import toast from 'react-hot-toast';

interface DepartmentListProps {
  searchTerm: string;
  onEditDepartment: (department: Department) => void;
  onViewDepartment?: (department: Department) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ searchTerm, onEditDepartment, onViewDepartment }) => {
  const { departments, deleteDepartment, isLoading } = useDepartments();

  // Debug: Log departments to see their structure
  console.log('DepartmentList - departments:', departments);
  console.log('DepartmentList - first department:', departments[0]);
  console.log('DepartmentList - departments length:', departments.length);
  
  // Additional debugging for each department
  departments.forEach((dept, index) => {
    console.log(`Department ${index}:`, dept);
    console.log(`Department ${index} id:`, dept.id);
    console.log(`Department ${index} has id:`, 'id' in dept);
  });

  const handleDeleteDepartment = async (departmentId: string, departmentName: string) => {
    if (window.confirm(`Are you sure you want to delete ${departmentName}?`)) {
      try {
        await deleteDepartment(departmentId);
        toast.success('Department deleted successfully');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete department';
        toast.error(errorMessage);
      }
    }
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No departments found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new department.'}
            </p>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <div
              key={department.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Department Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {department.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {department.code}
                      </p>
                      {/* Temporary debug display */}
                      <p className="text-xs text-red-500">
                        ID: {department.id || 'NO ID FOUND'}
                      </p>
                    </div>
                  </div>


                  {/* Department Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>
                        {department.courses?.length || 0} course{department.courses?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Created {new Date(department.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 ml-4">
                  {onViewDepartment && (
                    <button
                      onClick={() => onViewDepartment(department)}
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="View department details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      console.log('Edit button clicked, department:', department);
                      console.log('Department ID:', department.id);
                      console.log('Department keys:', Object.keys(department));
                      console.log('Department values:', Object.values(department));
                      onEditDepartment(department);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Edit department"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(department.id, department.name)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Delete department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Info */}
      {filteredDepartments.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <p>
            Showing {filteredDepartments.length} of {departments.length} departments
          </p>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
