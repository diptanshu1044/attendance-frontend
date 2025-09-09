export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  department: {
    id: string;
    name: string;
    code: string;
  };
  faculty: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  semester: number;
  academicYear: string;
  enrollmentCount: number;
  maxEnrollment?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  name: string;
  code: string;
  description?: string;
  credits: number;
  departmentId: string;
  semester: number;
  academicYear: string;
  maxEnrollment?: number;
}

export interface EnrollmentData {
  courseId: string;
  studentId: string;
}

export interface FacultyAssignmentData {
  courseId: string;
  facultyId: string;
}