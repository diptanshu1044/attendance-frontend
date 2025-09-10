import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useCreateSession, useUpdateSession } from '../../hooks/useSessions';
import { useCourses } from '../../hooks/useCourses';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CreateSessionData, Session } from '../../types';

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  session?: Session | null;
  mode: 'create' | 'edit';
}

const SessionForm: React.FC<SessionFormProps> = ({ isOpen, onClose, session, mode }) => {
  const [formData, setFormData] = useState<CreateSessionData>({
    title: '',
    description: '',
    type: 'OFFLINE',
    courseId: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    location: '',
    googleMeetLink: '',
  });

  const { data: courses } = useCourses();
  const createSessionMutation = useCreateSession();
  const updateSessionMutation = useUpdateSession();

  useEffect(() => {
    if (session && mode === 'edit') {
      setFormData({
        title: session.title,
        description: session.description || '',
        type: session.type,
        courseId: session.course.id,
        scheduledStartTime: session.scheduledStartTime,
        scheduledEndTime: session.scheduledEndTime,
        location: session.location || '',
        googleMeetLink: session.googleMeetLink || '',
      });
    } else {
      const now = new Date();
      const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      setFormData({
        title: '',
        description: '',
        type: 'OFFLINE',
        courseId: '',
        scheduledStartTime: startTime.toISOString().slice(0, 16),
        scheduledEndTime: endTime.toISOString().slice(0, 16),
        location: '',
        googleMeetLink: '',
      });
    }
  }, [session, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await createSessionMutation.mutateAsync(formData);
      } else if (session) {
        await updateSessionMutation.mutateAsync({
          id: session.id,
          data: formData,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isLoading = createSessionMutation.isPending || updateSessionMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create New Session' : 'Edit Session'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            leftIcon={<X size={20} />}
          >
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Session Title *
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter session title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter session description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course *
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Course</option>
                {courses?.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="OFFLINE">Offline</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time *
              </label>
              <Input
                name="scheduledStartTime"
                type="datetime-local"
                value={formData.scheduledStartTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time *
              </label>
              <Input
                name="scheduledEndTime"
                type="datetime-local"
                value={formData.scheduledEndTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {formData.type === 'OFFLINE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter classroom or venue"
              />
            </div>
          )}

          {formData.type === 'ONLINE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Meet Link
              </label>
              <Input
                name="googleMeetLink"
                value={formData.googleMeetLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
                type="url"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save size={20} />}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Session' : 'Update Session'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SessionForm;
