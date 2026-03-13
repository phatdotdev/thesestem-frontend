import type { StudentResponse } from "./student";

export type GroupResponse = {
  id: string;
  name: string;
  description: string;
};

export type CreateGroupForm = {
  name: string;
  description: string;
};
export type UpdateGroupForm = {
  id: string;
  data: { name: string; description: string };
};

export type AssignmentStatus = "OPEN" | "CLOSED";

export type AssignmentResponse = {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: AssignmentStatus;
};

export type CreateAssignmentRequest = {
  groupId: string;
  data: { name: string; description: string; deadline: string };
};

export type UpdateAssignmentRequest = {
  groupId: string;
  assignmentId: string;
  data: { name: string; description: string; deadline: string };
};

export type DeleteAssignmentRequest = {
  groupId: string;
  assignmentId: string;
};

export type TopicStatus = "DRAFT" | "OPEN" | "IN_PROGRESS" | "COMPLETED";

export type TopicResponse = {
  id: string;
  title: string;
  description: string;
  maxStudents: number;
  status: TopicStatus;
  students: StudentResponse[];
  createdAt: string;
  updatedAt: string;
};

export type CreateTopicRequest = {
  groupId: string;
  data: { title: string; description: string; maxStudents: number };
};

export type UpdateTopicRequest = {
  groupId: string;
  topicId: string;
  data: { title: string; description: string; maxStudents: number };
};

export type DeleteTopicRequest = {
  groupId: string;
  topicId: string;
};
