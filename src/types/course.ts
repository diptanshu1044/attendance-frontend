export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  department: {
    id: string;
    name: string;
    code: string;
  };
  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  enrollmentCount?: number;
}

export interface CreateCourseData {
  name: string;
  code: string;
  credits: number;
  departmentId: string;
  semester: number;
}

export interface EnrollmentData {
  courseId: string;
  studentId: string;
}

export interface FacultyAssignmentData {
  courseId: string;
  facultyId: string;
}