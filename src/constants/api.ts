export const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },
  
  // Department endpoints
  DEPARTMENTS: {
    LIST: '/departments',
    CREATE: '/departments',
    UPDATE: (id: string) => `/departments/${id}`,
    DELETE: (id: string) => `/departments/${id}`,
    ANALYTICS: (id: string) => `/analytics/department/${id}`,
  },
  
  // Course endpoints
  COURSES: {
    LIST: '/courses',
    CREATE: '/courses',
    UPDATE: (id: string) => `/courses/${id}`,
    DELETE: (id: string) => `/courses/${id}`,
    ENROLL: '/courses/enroll',
    ASSIGN_FACULTY: '/courses/assign-faculty',
    ANALYTICS: (id: string) => `/analytics/course/${id}`,
  },
  
  // User endpoints
  USERS: {
    LIST: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    STUDENTS: '/users/students',
    FACULTY: '/users/faculty',
  },
  
  // Session endpoints
  SESSIONS: {
    LIST: '/sessions',
    CREATE: '/sessions',
    UPDATE: (id: string) => `/sessions/${id}`,
    DELETE: (id: string) => `/sessions/${id}`,
    GENERATE_QR: (id: string) => `/sessions/${id}/generate-qr`,
    JOIN: (id: string) => `/sessions/${id}/join`,
    LEAVE: (id: string) => `/sessions/${id}/leave`,
    ATTENDANCE_STATUS: (id: string) => `/sessions/${id}/attendance-status`,
  },
  
  // Attendance endpoints
  ATTENDANCE: {
    MARK_QR: '/attendance/mark-qr',
    MARK_ONLINE: '/attendance/mark-online',
    STUDENT: (id: string) => `/attendance/student/${id}`,
    SESSION: (id: string) => `/attendance/session/${id}`,
    ANALYTICS: (id: string) => `/analytics/student/${id}`,
  },
  
  // Timetable endpoints
  TIMETABLE: {
    LIST: '/timetable',
    CREATE: '/timetable',
    UPDATE: (id: string) => `/timetable/${id}`,
    DELETE: (id: string) => `/timetable/${id}`,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;