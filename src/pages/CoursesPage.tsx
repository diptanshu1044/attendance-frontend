import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import CourseList from '../components/courses/CourseList';
import CourseForm from '../components/courses/CourseForm';
import { Course } from '../types';

const CoursesPage: React.FC = () => {
  const { isAdmin, isFaculty } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Check if user has permission to manage courses
  if (!isAdmin() && !isFaculty()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage courses.
        </p>
      </div>
    );
  }

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6">
      <CourseList 
        onCreateCourse={handleCreateCourse}
        onEditCourse={handleEditCourse}
      />
      
      <CourseForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        course={editingCourse}
        mode={formMode}
      />
    </div>
  );
};

export default CoursesPage;
