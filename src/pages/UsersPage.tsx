import React, { useState } from 'react';
import { Plus, Users, GraduationCap, UserCheck } from 'lucide-react';
import UserForm from '../components/users/UserForm';
import UserList from '../components/users/UserList';
import { User } from '../types/auth';

const UsersPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'faculty'>('all');

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const tabs = [
    { id: 'all', label: 'All Users', icon: Users, count: 0 },
    { id: 'students', label: 'Students', icon: GraduationCap, count: 0 },
    { id: 'faculty', label: 'Faculty', icon: UserCheck, count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage students and faculty members
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User List */}
      <UserList
        activeTab={activeTab}
        onEditUser={handleEditUser}
      />

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
};

export default UsersPage;
