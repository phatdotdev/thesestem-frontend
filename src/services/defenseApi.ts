import type { DefenseResponse } from "../types/defense";
import type { ApiResponse, PageResponse } from "../types/response";
import { api } from "./api";

const DEF_URL = "/defenses";

const defenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchCurrentDefenses: builder.query<
      ApiResponse<PageResponse<DefenseResponse>>,
      any
    >({
      query: (form) => ({
        url: `${DEF_URL}/current/search`,
        params: form,
      }),
      providesTags: ["Defense"],
    }),
    searchDefenses: builder.query<
      ApiResponse<PageResponse<DefenseResponse>>,
      any
    >({
      query: (form) => ({
        url: `${DEF_URL}/search`,
        params: form,
      }),
      providesTags: ["Defense"],
    }),
    getDefenses: builder.query<ApiResponse<DefenseResponse[]>, any>({
      query: (form) => ({
        url: `${DEF_URL}`,
        params: form,
      }),
      providesTags: ["Defense"],
    }),
    getCurrentDefenses: builder.query<ApiResponse<DefenseResponse[]>, any>({
      query: (form) => ({
        url: `${DEF_URL}/current`,
        params: form,
      }),
      providesTags: ["Defense"],
    }),
    getDefensesBySemester: builder.query<ApiResponse<DefenseResponse[]>, any>({
      query: ({ semesterId, ...form }) => ({
        url: `${DEF_URL}/semester/${semesterId}`,
        params: form,
      }),
      providesTags: ["Defense"],
    }),
    createDefense: builder.mutation<ApiResponse<DefenseResponse>, any>({
      query: (data) => ({
        url: `${DEF_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Defense"],
    }),
    updateDefense: builder.mutation<ApiResponse<DefenseResponse>, any>({
      query: ({ data, id }) => ({
        url: `${DEF_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Defense", "DefenseScore"],
    }),
    getDefensesByCouncil: builder.query<ApiResponse<DefenseResponse[]>, string>(
      {
        query: (id) => ({
          url: `${DEF_URL}/council/${id}`,
        }),
        providesTags: ["Defense"],
      },
    ),
    getDefenseByThesis: builder.query<ApiResponse<DefenseResponse>, string>({
      query: (id) => ({
        url: `${DEF_URL}/thesis/${id}`,
      }),
      providesTags: ["Defense"],
    }),
    getDefenseById: builder.query<ApiResponse<DefenseResponse>, string>({
      query: (id) => ({
        url: `${DEF_URL}/${id}`,
      }),
      providesTags: ["Defense"],
    }),
    getDefenseByIdForMentor: builder.query<
      ApiResponse<DefenseResponse>,
      string
    >({
      query: (id) => ({
        url: `${DEF_URL}/${id}/mentor`,
      }),
      providesTags: ["Defense", "DefenseScore"],
    }),
    scoreThesis: builder.mutation({
      query: ({ id, memberId, data }) => ({
        url: `${DEF_URL}/${id}/scores/${memberId}`,
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Defense", "DefenseScore"],
    }),
    uploadMinutesFile: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `${DEF_URL}/${id}/minutes-file`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Defense"],
    }),
    deleteMinutesFile: builder.mutation({
      query: (id) => ({
        url: `${DEF_URL}/${id}/minutes-file`,
        method: "DELETE",
      }),
      invalidatesTags: ["Defense"],
    }),
  }),
});

export const {
  useSearchCurrentDefensesQuery,
  useSearchDefensesQuery,
  useGetDefensesQuery,
  useGetCurrentDefensesQuery,
  useCreateDefenseMutation,
  useUpdateDefenseMutation,
  // GET
  useGetDefensesBySemesterQuery,
  useGetDefensesByCouncilQuery,
  useGetDefenseByThesisQuery,
  useGetDefenseByIdQuery,
  useGetDefenseByIdForMentorQuery,
  useScoreThesisMutation,
  useUploadMinutesFileMutation,
  useDeleteMinutesFileMutation,
} = defenseApi;

export const useGetDefenseBySemesterQuery = useGetDefensesBySemesterQuery;
export const useGetCurrentDefenseQuery = useGetCurrentDefensesQuery;
