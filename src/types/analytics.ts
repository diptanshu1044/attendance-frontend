export interface AttendanceAnalytics {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalSessions: number;
  completedSessions: number;
  averageAttendance: number;
  attendanceByDate: Array<{
    date: string;
    attendanceCount: number;
    totalEnrolled: number;
    percentage: number;
  }>;
  topAttendees: Array<{
    student: {
      id: string;
      firstName: string;
      lastName: string;
      studentId: string;
    };
    attendanceCount: number;
    attendancePercentage: number;
  }>;
  lowAttendanceStudents: Array<{
    student: {
      id: string;
      firstName: string;
      lastName: string;
      studentId: string;
    };
    attendanceCount: number;
    attendancePercentage: number;
  }>;
}

export interface DepartmentAnalytics {
  departmentId: string;
  departmentName: string;
  totalCourses: number;
  totalStudents: number;
  totalFaculty: number;
  averageAttendance: number;
  courseWiseAttendance: Array<{
    course: {
      id: string;
      name: string;
      code: string;
    };
    averageAttendance: number;
    totalSessions: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    averageAttendance: number;
    totalSessions: number;
  }>;
}

export interface StudentAnalytics {
  studentId: string;
  student: {
    firstName: string;
    lastName: string;
    studentId: string;
  };
  overallAttendance: number;
  courseWiseAttendance: Array<{
    course: {
      id: string;
      name: string;
      code: string;
    };
    attendanceCount: number;
    totalSessions: number;
    percentage: number;
  }>;
  attendanceTrend: Array<{
    date: string;
    attendedSessions: number;
    totalSessions: number;
  }>;
  recentAttendance: AttendanceRecord[];
}