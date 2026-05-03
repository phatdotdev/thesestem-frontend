import type { ApiResponse } from "../types/response";
import { api } from "./api";

const FILE_URL = "/files";
const FIELD_URL = "/fields";

export const resourceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    downloadFile: builder.mutation<any, { fileId: string }>({
      query: ({ fileId }) => ({
        url: `${FILE_URL}/${fileId}/download`,
        method: "GET",
      }),
    }),
    getFileBlob: builder.mutation<Blob, { fileId: string }>({
      query: ({ fileId }) => ({
        url: `${FILE_URL}/${fileId}/blob`,
        method: "GET",
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch file blob");
          }
          return response.blob();
        },
      }),
    }),
    getFileView: builder.mutation<Blob, { fileId: string }>({
      query: ({ fileId }) => ({
        url: `${FILE_URL}/${fileId}/view`,
        method: "GET",
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch file blob");
          }
          return response.blob();
        },
      }),
    }),
    getFields: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `${FIELD_URL}`,
      }),
      providesTags: ["Field"],
    }),

    createField: builder.mutation<ApiResponse<any>, any>({
      query: (fieldData) => ({
        url: `${FIELD_URL}`,
        method: "POST",
        body: fieldData,
      }),
      invalidatesTags: ["Field"],
    }),

    updateField: builder.mutation<ApiResponse<any>, { fieldId: string } & any>({
      query: ({ fieldId, ...fieldData }) => ({
        url: `${FIELD_URL}/${fieldId}`,
        method: "PUT",
        body: fieldData,
      }),
      invalidatesTags: ["Field"],
    }),

    deleteField: builder.mutation<ApiResponse<any>, { fieldId: string }>({
      query: ({ fieldId }) => ({
        url: `${FIELD_URL}/${fieldId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Field"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useDownloadFileMutation,
  useGetFieldsQuery,
  useCreateFieldMutation,
  useUpdateFieldMutation,
  useDeleteFieldMutation,
  useGetFileBlobMutation,
  useGetFileViewMutation,
} = resourceApi;
