import type { LecturerResponse } from "./lecturer";
import type { StudentResponse } from "./student";

export type ThesisResponse = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  student: StudentResponse;
  mentor: LecturerResponse;
  progressPercent: number;
  status: string;
};

export type ThesisRequest = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  progressPercent: number;
  status: string;
};
