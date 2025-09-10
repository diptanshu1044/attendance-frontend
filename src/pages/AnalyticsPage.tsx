import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCourses } from '../hooks/useCourses';
import AttendanceAnalytics from '../components/analytics/AttendanceAnalytics';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BarChart3, Users, BookOpen } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const { data: courses } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'course' | 'student'>('course');

  // Check if user has permission to view analytics
  if (!isAdmin() && !isFaculty() && !isStudent()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to view analytics.
        </p>
      </div>
    );
  }

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const handleViewModeChange = (mode: 'course' | 'student') => {
    setViewMode(mode);
    if (mode === 'student') {
      setSelectedCourseId('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          View attendance insights and trends
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader title="Analytics Controls" />
        <div className="p-6 space-y-4">
          {/* View Mode Toggle */}
          <div className="flex space-x-4">
            <Button
              variant={viewMode === 'course' ? 'primary' : 'secondary'}
              onClick={() => handleViewModeChange('course')}
              leftIcon={<BookOpen size={20} />}
            >
              Course Analytics
            </Button>
            <Button
              variant={viewMode === 'student' ? 'primary' : 'secondary'}
              onClick={() => handleViewModeChange('student')}
              leftIcon={<Users size={20} />}
            >
              Student Analytics
            </Button>
          </div>

          {/* Course Selection (for course analytics) */}
          {viewMode === 'course' && courses && courses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Student Analytics Info */}
          {viewMode === 'student' && isStudent() && (
            <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300">
                <strong>Student View:</strong> Showing your personal attendance analytics across all enrolled courses.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Analytics Content */}
      {viewMode === 'course' ? (
        selectedCourseId ? (
          <AttendanceAnalytics courseId={selectedCourseId} />
        ) : (
          <Card className="text-center py-12">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a Course
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a course from the dropdown above to view its attendance analytics
            </p>
          </Card>
        )
      ) : (
        <AttendanceAnalytics studentId={user?.id || ''} />
      )}
    </div>
  );
};

export default AnalyticsPage;
