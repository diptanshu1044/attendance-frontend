import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, Calendar, Award, AlertTriangle } from 'lucide-react';
import { useCourseAnalytics } from '../../hooks/useCourses';
import { useStudentAnalytics } from '../../hooks/useAttendance';
import Card, { CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import { AttendanceAnalytics, StudentAnalytics } from '../../types';

interface AttendanceAnalyticsProps {
  courseId?: string;
  studentId?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AttendanceAnalyticsComponent: React.FC<AttendanceAnalyticsProps> = ({ 
  courseId, 
  studentId 
}) => {
  const { data: courseAnalytics, isLoading: courseLoading } = useCourseAnalytics(courseId || '');
  const { data: studentAnalytics, isLoading: studentLoading } = useStudentAnalytics(studentId || '');

  const isLoading = courseLoading || studentLoading;
  const analytics = courseId ? courseAnalytics : studentAnalytics;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No analytics data available
        </p>
      </div>
    );
  }

  const renderCourseAnalytics = (data: AttendanceAnalytics) => {
    const attendanceData = data.attendanceByDate.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      attendance: item.percentage,
      sessions: item.attendanceCount
    }));

    const topAttendeesData = data.topAttendees.slice(0, 5).map((item) => ({
      name: `${item.student.firstName} ${item.student.lastName}`,
      attendance: item.attendancePercentage
    }));

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalSessions}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.completedSessions}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Attendance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.averageAttendance.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Course</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{data.courseName}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend Chart */}
          <Card>
            <CardHeader title="Attendance Trend" />
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Attendees Chart */}
          <Card>
            <CardHeader title="Top Attendees" />
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topAttendeesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, attendance }: { name: string; attendance: number }) => `${name}: ${attendance.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="attendance"
                  >
                    {topAttendeesData.map((_entry, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Low Attendance Students */}
        {data.lowAttendanceStudents.length > 0 && (
          <Card>
            <CardHeader title="Students with Low Attendance" />
            <div className="p-4">
              <div className="space-y-3">
                {data.lowAttendanceStudents.map((student, _index: number) => (
                  <div key={student.student.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {student.student.firstName} {student.student.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.student.studentId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="danger">
                        {student.attendancePercentage.toFixed(1)}%
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {student.attendanceCount} / {data.totalSessions} sessions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderStudentAnalytics = (data: StudentAnalytics) => {
    const courseData = data.courseWiseAttendance.map((item) => ({
      course: item.course.name,
      attendance: item.percentage
    }));

    const trendData = data.attendanceTrend.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      attended: item.attendedSessions,
      total: item.totalSessions,
      percentage: item.totalSessions > 0 ? (item.attendedSessions / item.totalSessions) * 100 : 0
    }));

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Attendance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overallAttendance.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Student</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {data.student.firstName} {data.student.lastName}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Student ID</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{data.student.studentId}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course-wise Attendance */}
          <Card>
            <CardHeader title="Course-wise Attendance" />
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="course" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Attendance Trend */}
          <Card>
            <CardHeader title="Attendance Trend" />
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="attended" fill="#10b981" name="Attended" />
                  <Bar dataKey="total" fill="#6b7280" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Attendance Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {courseId ? 'Course attendance insights and trends' : 'Student attendance overview'}
        </p>
      </div>

      {courseId ? renderCourseAnalytics(analytics as AttendanceAnalytics) : renderStudentAnalytics(analytics as StudentAnalytics)}
    </div>
  );
};

export default AttendanceAnalyticsComponent;
