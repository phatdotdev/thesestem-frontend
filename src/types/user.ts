export type OrganizationType = "UNIVERSITY" | "COLLEGE " | "ACADEMY";

export type ManagerRequest = {
  username: string;
  password: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  type: OrganizationType;
};

export type CreateManagerRequest = ManagerRequest;

export type UpdateManagerRequest = {
  id: string;
  data: {
    username: string;
    password: string;
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    description: string;
    type: OrganizationType;
  };
};
export type ManagerResponse = {
  id: string;
  username: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  type: OrganizationType;
  logoUrl: string;
};
