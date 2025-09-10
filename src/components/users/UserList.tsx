import React, { useState } from 'react';
import { Edit, Trash2, Search, Filter, MoreVertical, User, GraduationCap, UserCheck, Shield } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { User as UserType } from '../../types/auth';
import toast from 'react-hot-toast';

interface UserListProps {
  activeTab: 'all' | 'students' | 'faculty';
  onEditUser: (user: UserType) => void;
}

const UserList: React.FC<UserListProps> = ({ activeTab, onEditUser }) => {
  const { users, deleteUser, isLoading } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return <GraduationCap className="w-4 h-4" />;
      case 'FACULTY':
        return <UserCheck className="w-4 h-4" />;
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'FACULTY':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Filter users based on active tab
  const filteredUsers = users.filter(user => {
    if (activeTab === 'students') return user.role === 'STUDENT';
    if (activeTab === 'faculty') return user.role === 'FACULTY';
    return true;
  });

  // Apply search filter
  const searchedUsers = filteredUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.employeeId && user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Apply sorting
  const sortedUsers = searchedUsers.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'name':
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
        break;
      case 'email':
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case 'role':
        aValue = a.role;
        bValue = b.role;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a.firstName.toLowerCase();
        bValue = b.firstName.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
            <option value="createdAt">Sort by Date</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {sortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new user.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedUsers.map((user) => (
              <li key={user.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      {(user.studentId || user.employeeId) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {user.studentId || user.employeeId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Info */}
      {sortedUsers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <p>
            Showing {sortedUsers.length} of {filteredUsers.length} users
          </p>
        </div>
      )}
    </div>
  );
};

export default UserList;
