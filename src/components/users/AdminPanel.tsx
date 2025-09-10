import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Database,
  Key,
  UserCog
} from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { User as UserType } from '../../types/auth';
import AdminUserManagement from './AdminUserManagement';

interface AdminPanelProps {
  onEditUser: (user: UserType) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onEditUser }) => {
  const { users, deleteUser, isLoading } = useUsers();
  const [selectedAdmin, setSelectedAdmin] = useState<UserType | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'users'>('overview');

  // Get admin users
  const adminUsers = users.filter(user => user.role === 'ADMIN');
  
  // Get system statistics
  const totalUsers = users.length;
  const studentCount = users.filter(user => user.role === 'STUDENT').length;
  const facultyCount = users.filter(user => user.role === 'FACULTY').length;
  const adminCount = adminUsers.length;

  const handleDeleteAdmin = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete admin ${userName}? This action cannot be undone.`)) {
      try {
        await deleteUser(userId);
        // You might want to add a toast notification here
      } catch (error: any) {
        console.error('Failed to delete admin:', error);
      }
    }
  };

  const adminStats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      description: 'All registered users'
    },
    {
      title: 'Students',
      value: studentCount,
      icon: Users,
      color: 'bg-green-500',
      description: 'Active students'
    },
    {
      title: 'Faculty',
      value: facultyCount,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Faculty members'
    },
    {
      title: 'Admins',
      value: adminCount,
      icon: Shield,
      color: 'bg-red-500',
      description: 'System administrators'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Admin Dashboard
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeView === 'overview'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Database className="w-4 h-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveView('users')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeView === 'users'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <UserCog className="w-4 h-4 inline mr-2" />
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'overview' ? (
        <>
          {/* Admin Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Management Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Admin Users Management
              </h3>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
              {adminCount} Admin{adminCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="p-6">
          {adminUsers.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No admin users found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create admin users to manage the system.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminUsers.map((admin) => (
                <div
                  key={admin.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedAdmin?.id === admin.id
                      ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Admin Avatar */}
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                      </div>

                      {/* Admin Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {admin.firstName} {admin.lastName}
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            <Shield className="w-3 h-3 mr-1" />
                            ADMIN
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {admin.email}
                        </p>
                        {admin.department && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Department: {admin.department.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditUser(admin)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Edit admin"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      {adminCount > 1 && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, `${admin.firstName} ${admin.lastName}`)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete admin"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Database className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              System Information
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                User Distribution
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Students</span>
                  <span className="font-medium">{studentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Faculty</span>
                  <span className="font-medium">{facultyCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Admins</span>
                  <span className="font-medium">{adminCount}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <Key className="w-4 h-4 inline mr-2" />
                  Reset User Passwords
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <Activity className="w-4 h-4 inline mr-2" />
                  View System Logs
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Generate Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      ) : (
        <AdminUserManagement onEditUser={onEditUser} />
      )}
    </div>
  );
};

export default AdminPanel;
