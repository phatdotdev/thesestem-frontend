export type AddLecturerRequest = {
  lecturerCode: string;
  fullName: string;
  gender: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  dob: string;
  collegeId: string | null;
  facultyId: string | null;
  departmentId: string | null;
};

export type UpdateLecturerRequest = {
  lecturerCode: string;
  fullName: string;
  gender: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  dob: string;
  collegeId: string | null;
  facultyId: string | null;
  departmentId: string | null;
};

export type LecturerResponse = {
  college: any;
  id: string;
  lecturerCode: string;
  fullName: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  faculty: { id: string; name: string };
  department: { id: string; name: string };
};
