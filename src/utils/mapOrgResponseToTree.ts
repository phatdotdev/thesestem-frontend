import type { OrgUnit } from "../types/structure";

export function mapOrgResponseToTree(data: any): OrgUnit[] {
  const result: OrgUnit[] = [];

  // Colleges
  data.colleges?.forEach((college: any) => {
    result.push({
      id: college.id,
      type: "COLLEGE",
      name: college.name,
      description: college.description,

      code: college.code,
      children:
        college.faculties?.map((faculty: any) => ({
          id: faculty.id,
          type: "FACULTY",
          name: faculty.name,
          description: faculty.description,

          code: faculty.code,
          children:
            faculty.departments?.map((dept: any) => ({
              id: dept.id,
              type: "DEPARTMENT",
              name: dept.name,
              code: dept.code,
              description: dept.description,
              children: [],
            })) ?? [],
        })) ?? [],
    });
  });

  // Faculties không thuộc college
  data.faculties?.forEach((faculty: any) => {
    if (!faculty.collegeId) {
      result.push({
        id: faculty.id,
        type: "FACULTY",
        name: faculty.name,
        description: faculty.description,
        code: faculty.code,
        children:
          faculty.departments?.map((dept: any) => ({
            id: dept.id,
            type: "DEPARTMENT",
            name: dept.name,
            code: dept.code,
            description: dept.description,
            children: [],
          })) ?? [],
      });
    }
  });

  // Departments không thuộc faculty
  data.departments?.forEach((dept: any) => {
    if (!dept.facultyId) {
      result.push({
        id: dept.id,
        type: "DEPARTMENT",
        name: dept.name,
        code: dept.code,
        description: dept.description,
        children: [],
      });
    }
  });

  return result;
}
