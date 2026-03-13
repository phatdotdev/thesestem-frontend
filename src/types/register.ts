import type { LecturerResponse } from "./lecturer";
import type { StudentResponse } from "./student";

export type CreateRegisterRequest = {
  message: string;
  mentorId: string;
};

export type RegisterResposne = {
  id: string;
  student: StudentResponse;
  mentor: LecturerResponse;
  message: string;
  response: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};
