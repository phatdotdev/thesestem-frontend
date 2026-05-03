import { api } from "./api";
import type { ApiResponse, PageResponse } from "../types/response";
import type {
  InternalThesisSuggestion,
  SubmissionResponse,
  ThesisResponse,
} from "../types/thesis";

const THESES_URL = "/theses";

const thesisApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchTheses: builder.query<ApiResponse<PageResponse<ThesisResponse>>, any>(
      {
        query: (form) => ({
          url: `${THESES_URL}/all/search`,
          params: form,
        }),
        providesTags: ["Thesis"],
      },
    ),
    searchThesesForManager: builder.query<
      ApiResponse<PageResponse<ThesisResponse>>,
      any
    >({
      query: (form) => ({
        url: `${THESES_URL}/manager/search`,
        params: form,
      }),
      providesTags: ["Thesis"],
    }),
    searchPublicTheses: builder.query<
      ApiResponse<PageResponse<ThesisResponse>>,
      any
    >({
      query: (form) => ({
        url: `${THESES_URL}/public/search`,
        params: form,
      }),
      providesTags: ["Thesis"],
    }),
    getPublicThesisById: builder.query<ApiResponse<ThesisResponse>, string>({
      query: (id) => ({
        url: `${THESES_URL}/public/${id}`,
      }),
      providesTags: ["Thesis"],
    }),
    getCurrentTheses: builder.query<ApiResponse<ThesisResponse[]>, any>({
      query: (form) => ({
        url: `${THESES_URL}/current/list`,
        params: form,
      }),
      providesTags: ["Thesis"],
    }),
    searchCurrentTheses: builder.query<
      ApiResponse<PageResponse<ThesisResponse>>,
      any
    >({
      query: (form) => ({
        url: `${THESES_URL}/current/search`,
        params: form,
      }),
      providesTags: ["Thesis"],
    }),
    searchThesesBySemester: builder.query<
      ApiResponse<PageResponse<ThesisResponse>>,
      any
    >({
      query: ({ semesterId, form }) => ({
        url: `${THESES_URL}/${semesterId}/search`,
        params: form,
      }),
      providesTags: ["Thesis"],
    }),
    /* THESIS INFO*/
    getCurrentStudentThesis: builder.query<ApiResponse<ThesisResponse[]>, void>(
      {
        query: () => ({
          url: `${THESES_URL}/student/current`,
        }),
        providesTags: ["Thesis"],
      },
    ),
    getStudentThesisBySemester: builder.query<
      ApiResponse<ThesisResponse[]>,
      string
    >({
      query: (semesterId) => ({
        url: `${THESES_URL}/student/${semesterId}`,
      }),
      providesTags: ["Thesis"],
    }),
    getStudentThesisById: builder.query<ApiResponse<ThesisResponse>, string>({
      query: (id) => ({
        url: `${THESES_URL}/${id}`,
      }),
      providesTags: ["Thesis"],
    }),
    updateThesis: builder.mutation<ApiResponse<ThesisResponse>, any>({
      query: ({ id, data }) => ({
        url: `${THESES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Thesis"],
    }),
    progressThesis: builder.mutation<ApiResponse<ThesisResponse>, string>({
      query: (id) => ({
        url: `${THESES_URL}/${id}/progress`,
        method: "PUT",
      }),
      invalidatesTags: ["Thesis"],
    }),
    approveThesis: builder.mutation<ApiResponse<ThesisResponse>, string>({
      query: (id) => ({
        url: `${THESES_URL}/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["Thesis"],
    }),
    rejectThesis: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${THESES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Thesis"],
    }),
    updateTheisAccessLevel: builder.mutation<ApiResponse<ThesisResponse>, any>({
      query: ({ id, accessLevel }) => ({
        url: `${THESES_URL}/${id}/access-level`,
        method: "PUT",
        params: { accessLevel },
      }),
      invalidatesTags: ["Thesis"],
    }),
    /*FILES */
    getStudentThesisDraft: builder.query<ApiResponse<any>, string>({
      query: (id) => ({
        url: `${THESES_URL}/${id}/draft`,
      }),
      providesTags: ["ThesisDraft"],
    }),

    uploadFileToThesis: builder.mutation<ApiResponse<void>, any>({
      query: ({ id, folderId, formData }) => ({
        url: `${THESES_URL}/${id}/files/${folderId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ThesisDraft"],
    }),
    deleteFileFromThesis: builder.mutation<ApiResponse<void>, any>({
      query: ({ id, folderId, fileId }) => ({
        url: `${THESES_URL}/${id}/files/${folderId}/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ThesisDraft"],
    }),
    createThesisFolder: builder.mutation<ApiResponse<void>, any>({
      query: ({ id, folderId, name }) => ({
        url: `${THESES_URL}/${id}/folders/${folderId}`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["ThesisDraft"],
    }),
    deleteThesisFolder: builder.mutation<ApiResponse<void>, any>({
      query: ({ id, folderId }) => ({
        url: `${THESES_URL}/${id}/folders/${folderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ThesisDraft"],
    }),
    /* Submit */
    submitThesis: builder.mutation<
      ApiResponse<SubmissionResponse>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `${THESES_URL}/${id}/submissions`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ThesisSubmission", "Thesis"],
    }),
    getSubmissionsByThesis: builder.query<
      ApiResponse<SubmissionResponse[]>,
      any
    >({
      query: ({ thesisId, form }) => ({
        url: `${THESES_URL}/${thesisId}/submissions`,
        params: form,
      }),
      providesTags: ["ThesisSubmission"],
    }),
    getThesesByGroup: builder.query<ApiResponse<ThesisResponse[]>, string>({
      query: (groupId) => ({
        url: `${THESES_URL}/group/${groupId}`,
      }),
      providesTags: ["Thesis"],
    }),
    getThesisByIdAndGroup: builder.query<
      ApiResponse<ThesisResponse>,
      { thesisId: string; groupId: string }
    >({
      query: ({ thesisId, groupId }) => ({
        url: `${THESES_URL}/${thesisId}/group/${groupId}`,
      }),
      providesTags: ["Thesis"],
    }),
    /* SUGGESTIONS */
    getSimilarTheses: builder.query<
      ApiResponse<InternalThesisSuggestion[]>,
      string
    >({
      query: (thesisId) => ({
        url: `${THESES_URL}/${thesisId}/suggestions`,
      }),
      providesTags: ["Thesis"],
    }),
  }),
});

export const {
  useSearchPublicThesesQuery,
  useGetPublicThesisByIdQuery,
  useSearchThesesQuery,
  useGetCurrentThesesQuery,
  useSearchThesesForManagerQuery,
  useSearchThesesBySemesterQuery,
  useLazySearchThesesBySemesterQuery,
  useSearchCurrentThesesQuery,
  useGetCurrentStudentThesisQuery,
  useGetStudentThesisByIdQuery,
  useUpdateThesisMutation,
  useProgressThesisMutation,
  useApproveThesisMutation,
  useRejectThesisMutation,
  useUpdateTheisAccessLevelMutation,
  useGetStudentThesisDraftQuery,
  useUploadFileToThesisMutation,
  useDeleteFileFromThesisMutation,
  useCreateThesisFolderMutation,
  useDeleteThesisFolderMutation,
  useSubmitThesisMutation,
  useGetSubmissionsByThesisQuery,
  useGetThesesByGroupQuery,
  useGetThesisByIdAndGroupQuery,
  useGetStudentThesisBySemesterQuery,
  useLazyGetStudentThesisBySemesterQuery,
  // suggestions
  useGetSimilarThesesQuery,
} = thesisApi;
