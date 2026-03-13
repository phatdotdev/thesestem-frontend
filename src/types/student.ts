export type StudentRequest = {
  studentCode: string;
  password: string;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  programId: string;
  courseId: string;
  dob: string;
};

export type CreateStudentRequest = {
  studentCode: string;
  password: string;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  programId: string;
  courseId: string;
  dob: string;
};

export type UpdateStudentRequest = {
  studentCode?: string;
  password?: string;
  fullName?: string;
  email?: string;
  gender?: string;
  phone?: string;
  address?: string;
  programId?: string;
  courseId?: string;
  dob?: string;
};

export interface StudentResponse {
  id: string;
  studentCode: string;
  fullName: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "";
  email: string;
  phone: string;
  address?: string;
  program: {
    code: string;
    id: string;
    name: string;
  };
  course: { id: string; name: string };
  password?: string;
  avatarUrl?: string;
}

export type StudentSearchForm = {
  page?: number;
  size?: number;
  name?: string;
  code?: string;
  email?: string;
  programId?: string;
};

export type MentorSearchForm = {
  page?: number;
  size?: number;
  name?: string;
  code?: string;
  email?: string;
  collegeId?: string;
  facultyId?: string;
  departmentId?: string;
};
