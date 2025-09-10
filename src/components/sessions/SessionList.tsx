import React from 'react';
import { Plus, Edit, Trash2, QrCode, Users, Calendar, MapPin, Video } from 'lucide-react';
import { useSessions, useDeleteSession, useGenerateQR } from '../../hooks/useSessions';
import { useCourses } from '../../hooks/useCourses';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Session } from '../../types';

interface SessionListProps {
  onCreateSession: () => void;
  onEditSession: (session: Session) => void;
}

const SessionList: React.FC<SessionListProps> = ({ onCreateSession, onEditSession }) => {
  const { data: sessions, isLoading, error } = useSessions();
  const { data: courses } = useCourses();
  const deleteSessionMutation = useDeleteSession();
  const generateQRMutation = useGenerateQR();

  const handleDelete = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteSessionMutation.mutateAsync(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const handleGenerateQR = async (sessionId: string) => {
    try {
      await generateQRMutation.mutateAsync({ id: sessionId });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'secondary';
      case 'SCHEDULED':
        return 'primary';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'ONLINE' ? Video : MapPin;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load sessions
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sessions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your class sessions and attendance
          </p>
        </div>
        <Button onClick={onCreateSession} leftIcon={<Plus size={20} />}>
          Create Session
        </Button>
      </div>

      {/* Sessions List */}
      {sessions && sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => {
            const TypeIcon = getTypeIcon(session.type);
            const course = courses?.find(c => c.id === session.course.id);
            
            return (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {course?.name} ({course?.code})
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.faculty.firstName} {session.faculty.lastName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(session.status)}>
                        {session.status}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center">
                        <TypeIcon size={14} className="mr-1" />
                        {session.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      <div>
                        <div className="font-medium">
                          {new Date(session.scheduledStartTime).toLocaleDateString()}
                        </div>
                        <div className="text-xs">
                          {new Date(session.scheduledStartTime).toLocaleTimeString()} - 
                          {new Date(session.scheduledEndTime).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users size={16} className="mr-2" />
                      <div>
                        <div className="font-medium">
                          {session.attendanceCount} / {session.totalEnrolled}
                        </div>
                        <div className="text-xs">attended</div>
                      </div>
                    </div>

                    {session.location && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={16} className="mr-2" />
                        <span className="truncate">{session.location}</span>
                      </div>
                    )}
                  </div>

                  {session.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {session.description}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEditSession(session)}
                      leftIcon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    
                    {session.status === 'SCHEDULED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleGenerateQR(session.id)}
                        leftIcon={<QrCode size={16} />}
                        disabled={generateQRMutation.isPending}
                      >
                        Generate QR
                      </Button>
                    )}
                    
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(session.id)}
                      leftIcon={<Trash2 size={16} />}
                      disabled={deleteSessionMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No sessions found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first session
          </p>
          <Button onClick={onCreateSession} leftIcon={<Plus size={20} />}>
            Create Session
          </Button>
        </Card>
      )}
    </div>
  );
};

export default SessionList;
