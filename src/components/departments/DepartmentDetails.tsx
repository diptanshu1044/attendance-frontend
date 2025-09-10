import React from 'react';
import { X, Building2, BookOpen, Calendar, Users, Hash, GraduationCap } from 'lucide-react';
import { Department } from '../../types/auth';

interface DepartmentDetailsProps {
  department: Department;
  onClose: () => void;
}

const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({ department, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {department.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Department Details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Department Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Hash className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Code</p>
                    <p className="text-lg text-gray-900 dark:text-white">{department.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {new Date(department.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {department.courses?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 flex items-center justify-center">
                    <div className={`h-3 w-3 rounded-full ${department.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {department.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Courses ({department.courses?.length || 0})
              </h4>
              {department.courses && department.courses.length > 0 ? (
                <div className="space-y-3">
                  {department.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <GraduationCap className="h-5 w-5 text-blue-500" />
                            <h5 className="text-lg font-medium text-gray-900 dark:text-white">
                              {course.name}
                            </h5>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                              {course.code}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{course.credits} credits</span>
                            <span>Semester {course.semester}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              course.isActive 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {course.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This department doesn't have any courses yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
