import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/api';
import { 
  User, 
  RegisterData, 
  LoginResponse, 
  Department, 
  Course, 
  CreateCourseData, 
  EnrollmentData, 
  FacultyAssignmentData,
  Session,
  CreateSessionData,
  AttendanceRecord,
  AttendanceAnalytics,
  DepartmentAnalytics,
  StudentAnalytics
} from '../types';

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  register: async (userData: RegisterData): Promise<LoginResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, userData);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return response.data;
  },
};

// Department Services
export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await api.get(API_ENDPOINTS.DEPARTMENTS.LIST);
    console.log('API Response for getDepartments:', response.data);
    const departments = response.data.data || response.data;
    console.log('Processed departments:', departments);
    console.log('First department structure:', departments[0]);
    return departments;
  },

  getDepartment: async (id: string): Promise<Department> => {
    const response = await api.get(API_ENDPOINTS.DEPARTMENTS.GET(id));
    return response.data.data || response.data;
  },

  createDepartment: async (departmentData: Partial<Department>): Promise<Department> => {
    const response = await api.post(API_ENDPOINTS.DEPARTMENTS.CREATE, departmentData);
    return response.data.data || response.data;
  },

  updateDepartment: async (id: string, departmentData: Partial<Department>): Promise<Department> => {
    console.log('updateDepartment called with id:', id, 'and data:', departmentData);
    console.log('API endpoint:', API_ENDPOINTS.DEPARTMENTS.UPDATE(id));
    const response = await api.put(API_ENDPOINTS.DEPARTMENTS.UPDATE(id), departmentData);
    console.log('Update response:', response.data);
    return response.data.data || response.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.DEPARTMENTS.DELETE(id));
  },

  getDepartmentAnalytics: async (id: string): Promise<DepartmentAnalytics> => {
    const response = await api.get(API_ENDPOINTS.DEPARTMENTS.ANALYTICS(id));
    return response.data.data || response.data;
  },
};

// Course Services
export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get(API_ENDPOINTS.COURSES.LIST);
    return response.data.data || response.data;
  },

  getCourse: async (id: string): Promise<Course> => {
    const response = await api.get(API_ENDPOINTS.COURSES.UPDATE(id));
    return response.data.data || response.data;
  },

  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    const response = await api.post(API_ENDPOINTS.COURSES.CREATE, courseData);
    return response.data.data || response.data;
  },

  updateCourse: async (id: string, courseData: Partial<CreateCourseData>): Promise<Course> => {
    const response = await api.put(API_ENDPOINTS.COURSES.UPDATE(id), courseData);
    return response.data.data || response.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.COURSES.DELETE(id));
  },

  enrollStudent: async (enrollmentData: EnrollmentData): Promise<void> => {
    await api.post(API_ENDPOINTS.COURSES.ENROLL, enrollmentData);
  },

  assignFaculty: async (assignmentData: FacultyAssignmentData): Promise<void> => {
    await api.post(API_ENDPOINTS.COURSES.ASSIGN_FACULTY, assignmentData);
  },

  getCourseAnalytics: async (id: string): Promise<AttendanceAnalytics> => {
    const response = await api.get(API_ENDPOINTS.COURSES.ANALYTICS(id));
    return response.data.data || response.data;
  },
};

// User Services
export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get(API_ENDPOINTS.USERS.LIST);
    return response.data.data || response.data;
  },

  getStudents: async (): Promise<User[]> => {
    const response = await api.get(API_ENDPOINTS.USERS.STUDENTS);
    return response.data.data || response.data;
  },

  getFaculty: async (): Promise<User[]> => {
    const response = await api.get(API_ENDPOINTS.USERS.FACULTY);
    return response.data.data || response.data;
  },

  createUser: async (userData: RegisterData): Promise<User> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data.user || response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data.data || response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.USERS.DELETE(id));
  },
};

// Session Services
export const sessionService = {
  getSessions: async (): Promise<Session[]> => {
    const response = await api.get(API_ENDPOINTS.SESSIONS.LIST);
    return response.data.data || response.data;
  },

  getSession: async (id: string): Promise<Session> => {
    const response = await api.get(API_ENDPOINTS.SESSIONS.UPDATE(id));
    return response.data.data || response.data;
  },

  createSession: async (sessionData: CreateSessionData): Promise<Session> => {
    const response = await api.post(API_ENDPOINTS.SESSIONS.CREATE, sessionData);
    return response.data.data || response.data;
  },

  updateSession: async (id: string, sessionData: Partial<CreateSessionData>): Promise<Session> => {
    const response = await api.put(API_ENDPOINTS.SESSIONS.UPDATE(id), sessionData);
    return response.data.data || response.data;
  },

  deleteSession: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.SESSIONS.DELETE(id));
  },

  generateQR: async (id: string, location?: { latitude: number; longitude: number }): Promise<{ qrCode: string; expiresAt: string }> => {
    const response = await api.post(API_ENDPOINTS.SESSIONS.GENERATE_QR(id), location);
    return response.data.data || response.data;
  },

  joinSession: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.SESSIONS.JOIN(id));
  },

  leaveSession: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.SESSIONS.LEAVE(id));
  },

  getAttendanceStatus: async (id: string): Promise<{ isPresent: boolean; markedAt?: string }> => {
    const response = await api.get(API_ENDPOINTS.SESSIONS.ATTENDANCE_STATUS(id));
    return response.data.data || response.data;
  },
};

// Attendance Services
export const attendanceService = {
  markAttendanceQR: async (qrCodeId: string, location?: { latitude: number; longitude: number }): Promise<AttendanceRecord> => {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE.MARK_QR, {
      qrCodeId,
      ...location
    });
    return response.data.data || response.data;
  },

  markAttendanceOnline: async (sessionId: string, duration?: number): Promise<AttendanceRecord> => {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE.MARK_ONLINE, {
      sessionId,
      duration
    });
    return response.data.data || response.data;
  },

  getStudentAttendance: async (studentId: string, courseId?: string): Promise<AttendanceRecord[]> => {
    const params = courseId ? { courseId } : {};
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.STUDENT(studentId), { params });
    return response.data.data || response.data;
  },

  getSessionAttendance: async (sessionId: string): Promise<AttendanceRecord[]> => {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.SESSION(sessionId));
    return response.data.data || response.data;
  },

  getStudentAnalytics: async (studentId: string): Promise<StudentAnalytics> => {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.ANALYTICS(studentId));
    return response.data.data || response.data;
  },
};

// Dashboard Services
export const dashboardService = {
  getDashboardStats: async (): Promise<{
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
  }> => {
    // Since there's no dedicated dashboard endpoint, we'll aggregate data from other endpoints
    const [courses, sessions, users] = await Promise.all([
      courseService.getCourses(),
      sessionService.getSessions(),
      userService.getUsers()
    ]);

    const students = users.filter(user => user.role === 'STUDENT');
    const faculty = users.filter(user => user.role === 'FACULTY');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessions.filter(session => {
      const sessionDate = new Date(session.scheduledStartTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });

    // Calculate average attendance (simplified)
    const totalPossibleAttendances = sessions.length * students.length;
    const actualAttendances = sessions.reduce((sum, session) => sum + session.attendanceCount, 0);
    const averageAttendance = totalPossibleAttendances > 0 ? (actualAttendances / totalPossibleAttendances) * 100 : 0;

    // Generate attendance trend data (last 30 days)
    const attendanceTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.scheduledStartTime);
        return sessionDate.toDateString() === date.toDateString();
      });
      
      const dayAttendance = daySessions.reduce((sum, session) => sum + session.attendanceCount, 0);
      const totalEnrolled = daySessions.reduce((sum, session) => sum + session.totalEnrolled, 0);
      
      attendanceTrend.push({
        date: date.toISOString().split('T')[0],
        attendance: totalEnrolled > 0 ? (dayAttendance / totalEnrolled) * 100 : 0,
        sessions: daySessions.length
      });
    }

    // Recent sessions
    const recentSessions = sessions
      .sort((a, b) => new Date(b.scheduledStartTime).getTime() - new Date(a.scheduledStartTime).getTime())
      .slice(0, 5)
      .map(session => ({
        id: session.id,
        title: session.title,
        course: session.course.name,
        time: session.scheduledStartTime,
        status: session.status,
        attendanceRate: session.totalEnrolled > 0 ? (session.attendanceCount / session.totalEnrolled) * 100 : 0
      }));

    return {
      totalStudents: students.length,
      totalFaculty: faculty.length,
      totalCourses: courses.length,
      totalSessions: sessions.length,
      todaySessions: todaySessions.length,
      averageAttendance: Math.round(averageAttendance * 100) / 100,
      attendanceTrend,
      recentSessions
    };
  },
};

// Export all services
export const apiService = {
  auth: authService,
  department: departmentService,
  course: courseService,
  user: userService,
  session: sessionService,
  attendance: attendanceService,
  dashboard: dashboardService,
};
