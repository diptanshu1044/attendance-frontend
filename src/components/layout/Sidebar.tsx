import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  BarChart3,
  Settings,
  QrCode,
  Monitor,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout, isAdmin, isFaculty, isStudent } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      roles: ['ADMIN', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Departments',
      icon: Building2,
      path: '/departments',
      roles: ['ADMIN'],
    },
    {
      name: 'Courses',
      icon: BookOpen,
      path: '/courses',
      roles: ['ADMIN', 'FACULTY'],
    },
    {
      name: 'Users',
      icon: Users,
      path: '/users',
      roles: ['ADMIN'],
    },
    {
      name: 'Timetable',
      icon: Calendar,
      path: '/timetable',
      roles: ['ADMIN', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Sessions',
      icon: ClipboardList,
      path: '/sessions',
      roles: ['ADMIN', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Attendance',
      icon: BarChart3,
      path: '/attendance',
      roles: ['ADMIN', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'QR Scanner',
      icon: QrCode,
      path: '/qr-scanner',
      roles: ['STUDENT'],
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      roles: ['ADMIN', 'FACULTY'],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Monitor className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                AttendanceMS
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        active
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile & Logout */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 mb-2"
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </Link>
            
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role}
              </p>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;