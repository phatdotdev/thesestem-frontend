import { api } from "./api";
import type { ApiResponse, PageResponse } from "../types/response";
import type { ThesisResponse } from "../types/thesis";

const THESES_URL = "/theses";

const thesisApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentTheses: builder.query<ApiResponse<ThesisResponse[]>, any>({
      query: (form) => ({
        url: `${THESES_URL}/current`,
        params: form,
      }),
    }),
    searchCurrentTheses: builder.query<
      ApiResponse<PageResponse<ThesisResponse>>,
      any
    >({
      query: (form) => ({
        url: `${THESES_URL}/current/search`,
        params: form,
      }),
    }),
    /* THESIS INFO*/
    getCurrentStudentThesis: builder.query<ApiResponse<ThesisResponse[]>, void>(
      {
        query: () => ({
          url: `${THESES_URL}/student/current`,
        }),
      },
    ),
    getStudentThesisById: builder.query<ApiResponse<ThesisResponse>, string>({
      query: (id) => ({
        url: `${THESES_URL}/${id}`,
      }),
    }),
    updateThesis: builder.mutation<ApiResponse<ThesisResponse>, any>({
      query: ({ id, data }) => ({
        url: `${THESES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
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
  }),
});

export const {
  useGetCurrentThesesQuery,
  useSearchCurrentThesesQuery,
  useGetCurrentStudentThesisQuery,
  useGetStudentThesisByIdQuery,
  useUpdateThesisMutation,
  useGetStudentThesisDraftQuery,
  useUploadFileToThesisMutation,
  useDeleteFileFromThesisMutation,
  useCreateThesisFolderMutation,
  useDeleteThesisFolderMutation,
} = thesisApi;
