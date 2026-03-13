export type OrgUnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

export interface OrgUnit {
  id: string;
  type: OrgUnitType;

  name: string;
  code?: string;

  description?: string;

  children?: OrgUnit[];
}

// types.ts
export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  departments: Department[];
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  faculties: Faculty[];
}
