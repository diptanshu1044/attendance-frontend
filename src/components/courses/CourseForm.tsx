import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useCreateCourse, useUpdateCourse } from '../../hooks/useCourses';
import { useDepartments } from '../../hooks/useDepartments';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CreateCourseData, Course } from '../../types';

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
  mode: 'create' | 'edit';
}

const CourseForm: React.FC<CourseFormProps> = ({ isOpen, onClose, course, mode }) => {
  const [formData, setFormData] = useState<CreateCourseData>({
    name: '',
    code: '',
    description: '',
    credits: 3,
    departmentId: '',
    semester: 1,
    academicYear: new Date().getFullYear().toString(),
    maxEnrollment: 50,
  });

  const { data: departments } = useDepartments();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();

  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData({
        name: course.name,
        code: course.code,
        description: course.description || '',
        credits: course.credits,
        departmentId: course.department.id,
        semester: course.semester,
        academicYear: course.academicYear,
        maxEnrollment: course.maxEnrollment || 50,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        credits: 3,
        departmentId: '',
        semester: 1,
        academicYear: new Date().getFullYear().toString(),
        maxEnrollment: 50,
      });
    }
  }, [course, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await createCourseMutation.mutateAsync(formData);
      } else if (course) {
        await updateCourseMutation.mutateAsync({
          id: course.id,
          data: formData,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'semester' || name === 'maxEnrollment' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const isLoading = createCourseMutation.isPending || updateCourseMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create New Course' : 'Edit Course'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            leftIcon={<X size={20} />}
          >
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter course name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Code *
              </label>
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., CS101"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter course description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Credits *
              </label>
              <Input
                name="credits"
                type="number"
                value={formData.credits}
                onChange={handleChange}
                min="1"
                max="6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Academic Year *
              </label>
              <Input
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="2024"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department *
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Department</option>
                {departments?.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Enrollment
              </label>
              <Input
                name="maxEnrollment"
                type="number"
                value={formData.maxEnrollment}
                onChange={handleChange}
                min="1"
                max="200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save size={20} />}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Course' : 'Update Course'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CourseForm;
