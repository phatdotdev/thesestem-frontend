import type { LecturerResponse } from "./lecturer";

export type CouncilRole = {
  id: string;
  name: string;
  code: string;
  description: string;
};

export interface CouncilMemberResponse {
  id: string;
  lecturer: LecturerResponse;
  role: CouncilRole;
}

export type MemberRequest = {
  id?: string;
  lecturerId: string;
  roleId: string;
};

export type CouncilRequest = {
  code: string;
  name: string;
  members: MemberRequest[];
};

export type CreateCouncilRequest = CouncilRequest;

export type UpdateCouncilRequest = {
  id: string;
  data: CouncilRequest;
};

export interface CouncilResponse {
  id: string;
  code: string;
  name: string;
  semester: string;
  members: CouncilMemberResponse[];
}
