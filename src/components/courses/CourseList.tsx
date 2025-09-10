import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, BookOpen, Calendar } from 'lucide-react';
import { useCourses, useDeleteCourse } from '../../hooks/useCourses';
import Card, { CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import CourseForm from './CourseForm';
import { Course } from '../../types';

interface CourseListProps {
  onCreateCourse: () => void;
  onEditCourse: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onCreateCourse, onEditCourse }) => {
  const { data: courses, isLoading, error } = useCourses();
  const deleteCourseMutation = useDeleteCourse();

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourseMutation.mutateAsync(courseId);
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load courses
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your courses and enrollments
          </p>
        </div>
        <Button onClick={onCreateCourse} leftIcon={<Plus size={20} />}>
          Create Course
        </Button>
      </div>

      {/* Courses Grid */}
      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {course.code}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course.department.name}
                    </p>
                  </div>
                  <Badge variant={course.isActive ? 'success' : 'secondary'}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen size={16} className="mr-2" />
                    <span>{course.credits} credits</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users size={16} className="mr-2" />
                    <span>{course.enrollmentCount || 0} enrolled</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    <span>Semester {course.semester}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEditCourse(course)}
                    leftIcon={<Edit size={16} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
                    leftIcon={<Trash2 size={16} />}
                    disabled={deleteCourseMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first course
          </p>
          <Button onClick={onCreateCourse} leftIcon={<Plus size={20} />}>
            Create Course
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CourseList;
