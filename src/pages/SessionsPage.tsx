import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import SessionList from '../components/sessions/SessionList';
import SessionForm from '../components/sessions/SessionForm';
import { Session } from '../types';

const SessionsPage: React.FC = () => {
  const { isAdmin, isFaculty } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Check if user has permission to manage sessions
  if (!isAdmin() && !isFaculty()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage sessions.
        </p>
      </div>
    );
  }

  const handleCreateSession = () => {
    setEditingSession(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSession(null);
  };

  return (
    <div className="space-y-6">
      <SessionList 
        onCreateSession={handleCreateSession}
        onEditSession={handleEditSession}
      />
      
      <SessionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        session={editingSession}
        mode={formMode}
      />
    </div>
  );
};

export default SessionsPage;
