import type {
  AssignmentResponse,
  AssignmentSubmissionResponse,
  AssignStudentRequest,
  CreateAssignmentRequest,
  CreateGroupForm,
  CreateMeetingRequest,
  CreateTopicRequest,
  DeleteAssignmentRequest,
  DeleteMeetingRequest,
  DeleteTopicRequest,
  GroupResponse,
  MeetingResponse,
  ThesesResponse,
  TopicResponse,
  UpdateAssignmentRequest,
  UpdateGroupForm,
  UpdateMeetingRequest,
  UpdateTopicRequest,
} from "../types/group";
import type { ApiResponse } from "../types/response";
import type { StudentResponse } from "../types/student";
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
    getMentorGroupsBySemester: builder.query<ApiResponse<GroupResponse[]>, any>(
      {
        query: (id) => ({
          url: `${GROUP_URL}/mentor/semester/${id}`,
        }),
        providesTags: ["Group"],
      },
    ),
    getCurrentStudentGroups: builder.query<ApiResponse<GroupResponse[]>, void>({
      query: () => ({
        url: `${GROUP_URL}/student/current`,
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
      providesTags: ["Assignment"],
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
      invalidatesTags: ["Assignment"],
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
      invalidatesTags: ["Assignment", "AssignmentSubmission"],
    }),
    deleteAssignment: builder.mutation<
      ApiResponse<void>,
      DeleteAssignmentRequest
    >({
      query: ({ groupId, assignmentId }) => ({
        url: `${GROUP_URL}/${groupId}/assignments/${assignmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment", "AssignmentSubmission"],
    }),
    getAssignmentDetail: builder.query<
      ApiResponse<AssignmentResponse>,
      { groupId: string; assignmentId: string }
    >({
      query: ({ groupId, assignmentId }) => ({
        url: `${GROUP_URL}/${groupId}/assignments/${assignmentId}`,
      }),
      providesTags: ["Assignment"],
    }),
    submitAssignment: builder.mutation<
      ApiResponse<void>,
      { groupId: string; assignmentId: string; form: FormData }
    >({
      query: ({ groupId, assignmentId, form }) => ({
        url: `${GROUP_URL}/${groupId}/assignments/${assignmentId}/submissions`,
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["AssignmentSubmission", "Assignment"],
    }),
    getStudentAssignmentSubmissions: builder.query<
      ApiResponse<AssignmentSubmissionResponse[]>,
      { groupId: string; assignmentId: string }
    >({
      query: ({ groupId, assignmentId }) => ({
        url: `${GROUP_URL}/${groupId}/assignments/${assignmentId}/submissions/student`,
      }),
      providesTags: ["AssignmentSubmission"],
    }),
    getAssignmentSubmissions: builder.query<
      ApiResponse<AssignmentSubmissionResponse[]>,
      { groupId: string; assignmentId: string }
    >({
      query: ({ groupId, assignmentId }) => ({
        url: `${GROUP_URL}/${groupId}/assignments/${assignmentId}/submissions`,
      }),
      providesTags: ["AssignmentSubmission"],
    }),
    /* MEETINGS */
    getGroupMeetings: builder.query<ApiResponse<MeetingResponse[]>, string>({
      query: (id) => ({
        url: `${GROUP_URL}/${id}/meetings`,
      }),
      providesTags: ["Meeting"],
    }),
    createMeeting: builder.mutation<
      ApiResponse<MeetingResponse>,
      CreateMeetingRequest
    >({
      query: ({ groupId, data }) => ({
        url: `${GROUP_URL}/${groupId}/meetings`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Meeting"],
    }),
    updateMeeting: builder.mutation<
      ApiResponse<MeetingResponse>,
      UpdateMeetingRequest
    >({
      query: ({ groupId, meetingId, data }) => ({
        url: `${GROUP_URL}/${groupId}/meetings/${meetingId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Meeting"],
    }),
    deleteMeeting: builder.mutation<ApiResponse<void>, DeleteMeetingRequest>({
      query: ({ groupId, meetingId }) => ({
        url: `${GROUP_URL}/${groupId}/meetings/${meetingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meeting"],
    }),
    /* DOCUMENTS */
    getGroupDocuments: builder.query<ApiResponse<any>, string>({
      query: (id) => ({
        url: `${GROUP_URL}/${id}/documents`,
      }),
      providesTags: ["Folder", "FileAsset"],
    }),
    uploadFileToGroup: builder.mutation<ApiResponse<void>, any>({
      query: ({ groupId, folderId, formData }) => ({
        url: `${GROUP_URL}/${groupId}/files/${folderId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Folder", "FileAsset"],
    }),
    deleteFileFromGroup: builder.mutation<ApiResponse<void>, any>({
      query: ({ groupId, folderId, fileId }) => ({
        url: `${GROUP_URL}/${groupId}/files/${folderId}/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder", "FileAsset"],
    }),
    createGroupFolder: builder.mutation<ApiResponse<void>, any>({
      query: ({ groupId, folderId, name }) => ({
        url: `${GROUP_URL}/${groupId}/folders/${folderId}`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Folder", "FileAsset"],
    }),
    deleteGroupFolder: builder.mutation<ApiResponse<void>, any>({
      query: ({ groupId, folderId }) => ({
        url: `${GROUP_URL}/${groupId}/folders/${folderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder", "FileAsset"],
    }),
    /* TOPICS */
    getGroupTopics: builder.query<ApiResponse<TopicResponse[]>, string>({
      query: (id) => ({
        url: `${GROUP_URL}/${id}/topics`,
      }),
      providesTags: ["Topic"],
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
      invalidatesTags: ["Topic"],
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
      invalidatesTags: ["Topic"],
    }),
    deleteTopic: builder.mutation<ApiResponse<void>, DeleteTopicRequest>({
      query: ({ groupId, topicId }) => ({
        url: `${GROUP_URL}/${groupId}/topics/${topicId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Topic"],
    }),
    assignStudentToTopic: builder.mutation<
      ApiResponse<void>,
      AssignStudentRequest
    >({
      query: ({ groupId, studentId, topicId }) => ({
        url: `${GROUP_URL}/${groupId}/topics/${topicId}/${studentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Topic", "GroupStudent", "Thesis"],
    }),
    exchangeStudentBetweenTopics: builder.mutation<
      ApiResponse<void>,
      {
        groupId: string;
        studentId: string;
        oldTopicId: string;
        newTopicId: string;
      }
    >({
      query: ({ groupId, studentId, newTopicId }) => ({
        url: `${GROUP_URL}/${groupId}/topics/${newTopicId}/${studentId}/exchange`,
        method: "POST",
      }),
      invalidatesTags: ["Topic", "GroupStudent", "Thesis"],
    }),
    /* STUDENTS */
    getStudentsInGroup: builder.query<ApiResponse<StudentResponse[]>, string>({
      query: (id) => ({
        url: `${GROUP_URL}/${id}/students`,
      }),
      providesTags: ["GroupStudent"],
    }),
    assignStudentToGroup: builder.mutation<
      ApiResponse<void>,
      { groupId: string; studentId: string }
    >({
      query: ({ groupId, studentId }) => ({
        url: `${GROUP_URL}/${groupId}/students/${studentId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Group", "SemesterStudent", "GroupStudent"],
    }),
    removeStudentFromGroup: builder.mutation<
      ApiResponse<void>,
      { groupId: string; studentId: string }
    >({
      query: ({ groupId, studentId }) => ({
        url: `${GROUP_URL}/${groupId}/students/${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group", "SemesterStudent", "GroupStudent"],
    }),
    /* THESES */
    getGroupTheses: builder.query<ApiResponse<ThesesResponse[]>, string>({
      query: (id) => ({
        url: `${GROUP_URL}/${id}/theses`,
      }),
      providesTags: ["Thesis"],
    }),
  }),
});

export const {
  /* GROUPS */
  useGetCurrentStudentGroupsQuery,
  useGetCurrentMentorGroupsQuery,
  useLazyGetCurrentMentorGroupsQuery,
  useLazyGetMentorGroupsBySemesterQuery,
  useGetGroupByIdQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  /* ASSIGNMENT */
  useGetGroupAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAssignmentDetailQuery,
  useSubmitAssignmentMutation,
  useGetStudentAssignmentSubmissionsQuery,
  useGetAssignmentSubmissionsQuery,
  /* MEETINGS */
  useGetGroupMeetingsQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
  /* DOCUMENTS */
  useGetGroupDocumentsQuery,
  useUploadFileToGroupMutation,
  useDeleteFileFromGroupMutation,
  useCreateGroupFolderMutation,
  useDeleteGroupFolderMutation,
  /* TOPICS */
  useGetGroupTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useAssignStudentToTopicMutation,
  useExchangeStudentBetweenTopicsMutation,
  /* STUDENTS */
  useGetStudentsInGroupQuery,
  useAssignStudentToGroupMutation,
  useRemoveStudentFromGroupMutation,
  /* THESES */
  useGetGroupThesesQuery,
} = groupApi;
