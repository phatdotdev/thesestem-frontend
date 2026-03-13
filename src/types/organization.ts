export interface CouncilRole {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export type OrgProps = {
  name: string;
  code: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  bannerUrl: string;
  managerEmail: string;
};

export type OrgStructureProps = {
  faculties: any[];
  colleges: any[];
};

export type UpdateOrgInfoProps = {
  name: string;
  code: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
};

export type CollegeProps = {
  id: string;
  code: string;
  name: string;
  description: string;
};

export type FacultyProps = {
  id: string;
  code: string;
  name: string;
  description: string;
};

export type DepartmentProps = {
  id: string;
  code: string;
  name: string;
  description: string;
};

export type YearResponse = {
  id: string;
  name: string;
};

export type SemesterResponse = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  year: YearResponse;
  createdAt?: string;
  updatedAt?: string;
};

export type ProgramResponse = {
  id: string;
  code: string;
  name: string;
  degree: string;
  description: string;
  college: CollegeProps;
  faculty: FacultyProps;
  department: DepartmentProps;
};

export type RoleRequest = {
  code: string;
  name: string;
  description: string;
};

export type CreateRoleRequest = RoleRequest;
export type UpdateRoleRequest = {
  id: string;
  data: RoleRequest;
};

export type RoleResponse = {
  id: string;
  code: string;
  name: string;
  description: string;
};
