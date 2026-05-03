import type { LecturerResponse } from "./lecturer";
import type { StudentResponse } from "./student";

type OrganizationResponse = {
  id: string;
  name: string;
};

export type ThesisResponse = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  student: StudentResponse;
  mentor: LecturerResponse;
  organization: OrganizationResponse | null;
  progressPercent: number;
  accessLevel: "PUBLIC" | "INTERNAL" | "PRIVATE";
  status: string;
  submissions: SubmissionResponse[];
};

export type ThesisRequest = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  progressPercent: number;
  status: string;
};

export interface FileAssetResponse {
  id: string;
  name: string;
  url: string;
}

export interface SubmissionResponse {
  id: string;
  thesisId: string;
  version: number;
  note: string;
  submittedAt: string;
  files: FileAssetResponse[];
}

export type InternalThesisSuggestion = {
  id: string;
  title: string;
  description: string;
  score: number;
  reason: string;
  organizationName?: string;
};

export type ExternalThesisSuggestion = {
  title: string;
  description: string;
  link: string;
  reason: string;
};

export type SuggestThesisResponse = {
  internals: InternalThesisSuggestion[];
  externals: ExternalThesisSuggestion[];
};
