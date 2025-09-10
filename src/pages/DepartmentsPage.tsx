import React, { useState } from 'react';
import { Plus, Building2, Edit, Trash2, Search, Filter } from 'lucide-react';
import DepartmentForm from '../components/departments/DepartmentForm';
import DepartmentList from '../components/departments/DepartmentList';
import DepartmentDetails from '../components/departments/DepartmentDetails';
import { Department } from '../types/auth';

const DepartmentsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [viewingDepartment, setViewingDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setShowForm(true);
  };

  const handleEditDepartment = (department: Department) => {
    console.log('DepartmentsPage - handleEditDepartment called with:', department);
    console.log('Department ID:', department.id);
    console.log('Department type:', typeof department);
    console.log('Department keys:', Object.keys(department));
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDepartment(null);
  };

  const handleViewDepartment = (department: Department) => {
    setViewingDepartment(department);
  };

  const handleCloseDetails = () => {
    setViewingDepartment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Department Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage academic departments and their information
          </p>
        </div>
        <button
          onClick={handleAddDepartment}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Department List */}
      <DepartmentList
        searchTerm={searchTerm}
        onEditDepartment={handleEditDepartment}
        onViewDepartment={handleViewDepartment}
      />

      {/* Department Form Modal */}
      {showForm && (
        <DepartmentForm
          department={editingDepartment}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}

      {/* Department Details Modal */}
      {viewingDepartment && (
        <DepartmentDetails
          department={viewingDepartment}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;
