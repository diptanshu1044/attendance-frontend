export interface Session {
  id: string;
  title: string;
  description?: string;
  type: 'OFFLINE' | 'ONLINE';
  course: {
    id: string;
    name: string;
    code: string;
  };
  faculty: {
    id: string;
    firstName: string;
    lastName: string;
  };
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  location?: string;
  googleMeetLink?: string;
  qrCode?: string;
  attendanceCount: number;
  totalEnrolled: number;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  title: string;
  description?: string;
  type: 'OFFLINE' | 'ONLINE';
  courseId: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  location?: string;
  googleMeetLink?: string;
}

export interface AttendanceRecord {
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
  };
  session: {
    id: string;
    title: string;
    course: {
      name: string;
      code: string;
    };
  };
  markedAt: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  type: 'QR' | 'ONLINE';
  duration?: number; // in minutes for online sessions
  status: 'PRESENT' | 'LATE' | 'ABSENT';
}