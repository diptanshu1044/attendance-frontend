import React from 'react';
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  TrendingUp,
  Calendar,
  Building2,
  UserCheck,
  Clock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApiQuery } from '../hooks/useApi';
import StatCard from '../components/dashboard/StatCard';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { API_ENDPOINTS } from '../constants/api';

interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalSessions: number;
  todaySessions: number;
  averageAttendance: number;
  attendanceTrend: Array<{
    date: string;
    attendance: number;
    sessions: number;
  }>;
  recentSessions: Array<{
    id: string;
    title: string;
    course: string;
    time: string;
    status: 'ACTIVE' | 'COMPLETED' | 'SCHEDULED';
    attendanceRate: number;
  }>;
}

const Dashboard: React.FC = () => {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();

  const { data: stats, isLoading } = useApiQuery<DashboardStats>(
    ['dashboard', user?.role],
    '/dashboard/stats'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'secondary';
      case 'SCHEDULED':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back to your {user?.role.toLowerCase()} dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin() && (
          <>
            <StatCard
              title="Total Students"
              value={stats?.totalStudents || 0}
              icon={Users}
              iconColor="text-blue-600"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Faculty"
              value={stats?.totalFaculty || 0}
              icon={UserCheck}
              iconColor="text-green-600"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Total Courses"
              value={stats?.totalCourses || 0}
              icon={BookOpen}
              iconColor="text-purple-600"
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Average Attendance"
              value={`${stats?.averageAttendance || 0}%`}
              icon={TrendingUp}
              iconColor="text-orange-600"
              trend={{ value: 3.2, isPositive: true }}
            />
          </>
        )}

        {isFaculty() && (
          <>
            <StatCard
              title="My Courses"
              value={stats?.totalCourses || 0}
              icon={BookOpen}
              iconColor="text-blue-600"
            />
            <StatCard
              title="Total Sessions"
              value={stats?.totalSessions || 0}
              icon={ClipboardList}
              iconColor="text-green-600"
            />
            <StatCard
              title="Today's Sessions"
              value={stats?.todaySessions || 0}
              icon={Calendar}
              iconColor="text-purple-600"
            />
            <StatCard
              title="Average Attendance"
              value={`${stats?.averageAttendance || 0}%`}
              icon={TrendingUp}
              iconColor="text-orange-600"
            />
          </>
        )}

        {isStudent() && (
          <>
            <StatCard
              title="Enrolled Courses"
              value={stats?.totalCourses || 0}
              icon={BookOpen}
              iconColor="text-blue-600"
            />
            <StatCard
              title="Attended Sessions"
              value={stats?.totalSessions || 0}
              icon={UserCheck}
              iconColor="text-green-600"
            />
            <StatCard
              title="Today's Sessions"
              value={stats?.todaySessions || 0}
              icon={Clock}
              iconColor="text-purple-600"
            />
            <StatCard
              title="My Attendance"
              value={`${stats?.averageAttendance || 0}%`}
              icon={TrendingUp}
              iconColor="text-orange-600"
            />
          </>
        )}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <AttendanceChart 
          data={stats?.attendanceTrend || []}
          title="Attendance Trends (Last 30 Days)"
        />

        {/* Recent Sessions */}
        <Card>
          <CardHeader title="Recent Sessions" />
          
          <div className="space-y-4">
            {stats?.recentSessions?.slice(0, 5).map((session) => (
              <div 
                key={session.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {session.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.course}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(session.time).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={getStatusBadgeVariant(session.status)}>
                    {session.status}
                  </Badge>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {session.attendanceRate}% attended
                  </span>
                </div>
              </div>
            )) || (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No recent sessions found
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;