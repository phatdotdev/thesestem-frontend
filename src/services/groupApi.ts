import type {
  AssignmentResponse,
  CreateAssignmentRequest,
  CreateGroupForm,
  CreateTopicRequest,
  DeleteAssignmentRequest,
  DeleteTopicRequest,
  GroupResponse,
  TopicResponse,
  UpdateAssignmentRequest,
  UpdateGroupForm,
  UpdateTopicRequest,
} from "../types/group";
import type { ApiResponse } from "../types/response";
import { api } from "./api";

const GROUP_URL = "/groups";
export const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* GROUPS */
    getCurrentMentorGroups: builder.query<ApiResponse<GroupResponse[]>, void>({
      query: () => ({
        url: `${GROUP_URL}/mentor/current`,
      }),
      providesTags: ["Group"],
    }),
    getGroupById: builder.query<ApiResponse<GroupResponse>, string>({
      query: (id) => ({
        url: `${GROUP_URL}/${id}`,
      }),
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation<ApiResponse<GroupResponse>, CreateGroupForm>({
      query: (data) => ({
        url: `${GROUP_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    updateGroup: builder.mutation<ApiResponse<GroupResponse>, UpdateGroupForm>({
      query: ({ id, data }) => ({
        url: `${GROUP_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation<ApiResponse<GroupResponse>, string>({
      query: (id) => ({
        url: `${GROUP_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group"],
    }),
    /* ASSIGNMENTS */
    getGroupAssignments: builder.query<
      ApiResponse<AssignmentResponse[]>,
      string
    >({
      query: (id) => ({
        url: `${GROUP_URL}/${id}/assignments`,
      }),
    }),
    createAssignment: builder.mutation<
      ApiResponse<AssignmentResponse>,
      CreateAssignmentRequest
    >({
      query: ({ groupId, data }) => ({
        url: `${GROUP_URL}/${groupId}/assignments`,
        method: "POST",
        body: data,
      }),
    }),
    updateAssignment: builder.mutation<
      ApiResponse<AssignmentResponse>,
      UpdateAssignmentRequest
    >({
      query: ({ groupId, assignmentId, data }) => ({
        url: `${GROUP_URL}/${groupId}/assignments/${assignmentId}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAssignment: builder.mutation<
      ApiResponse<void>,
      DeleteAssignmentRequest
    >({
      query: ({ groupId, assignmentId }) => ({
        url: `${GROUP_URL}/${groupId}/assignments/${assignmentId}`,
        method: "DELETE",
      }),
    }),
    /* TOPICS */
    getGroupTopics: builder.query<ApiResponse<TopicResponse[]>, string>({
      query: (id) => ({
        url: `${GROUP_URL}/${id}/topics`,
      }),
    }),
    createTopic: builder.mutation<
      ApiResponse<TopicResponse>,
      CreateTopicRequest
    >({
      query: ({ groupId, data }) => ({
        url: `${GROUP_URL}/${groupId}/topics`,
        method: "POST",
        body: data,
      }),
    }),
    updateTopic: builder.mutation<
      ApiResponse<TopicResponse>,
      UpdateTopicRequest
    >({
      query: ({ groupId, topicId, data }) => ({
        url: `${GROUP_URL}/${groupId}/topics/${topicId}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteTopic: builder.mutation<ApiResponse<void>, DeleteTopicRequest>({
      query: ({ groupId, topicId }) => ({
        url: `${GROUP_URL}/${groupId}/topics/${topicId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCurrentMentorGroupsQuery,
  useGetGroupByIdQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  /* ASSIGNMENT */
  useGetGroupAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  /* TOPICS */
  useGetGroupTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = groupApi;
