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
    }),
    getCurrentDefenses: builder.query<ApiResponse<DefenseResponse[]>, any>({
      query: (form) => ({
        url: `${DEF_URL}/current`,
        params: form,
      }),
    }),
    createDefense: builder.mutation<ApiResponse<DefenseResponse>, any>({
      query: (data) => ({
        url: `${DEF_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateDefense: builder.mutation<ApiResponse<DefenseResponse>, any>({
      query: ({ data, id }) => ({
        url: `${DEF_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getDefensesByCouncil: builder.query<ApiResponse<DefenseResponse[]>, string>(
      {
        query: (id) => ({
          url: `${DEF_URL}/council/${id}`,
        }),
      },
    ),
    getDefenseByThesis: builder.query<ApiResponse<DefenseResponse>, string>({
      query: (id) => ({
        url: `${DEF_URL}/thesis/${id}`,
      }),
    }),
    getDefenseById: builder.query<ApiResponse<DefenseResponse>, string>({
      query: (id) => ({
        url: `${DEF_URL}/${id}`,
      }),
    }),
    getDefenseByIdForMentor: builder.query<
      ApiResponse<DefenseResponse>,
      string
    >({
      query: (id) => ({
        url: `${DEF_URL}/${id}/mentor`,
      }),
      providesTags: ["DefenseScore"],
    }),
    scoreThesis: builder.mutation({
      query: ({ id, memberId, data }) => ({
        url: `${DEF_URL}/${id}/scores/${memberId}`,
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["DefenseScore"],
    }),
  }),
});

export const {
  useSearchCurrentDefensesQuery,
  useGetCurrentDefensesQuery,
  useCreateDefenseMutation,
  useUpdateDefenseMutation,
  // GET
  useGetDefensesByCouncilQuery,
  useGetDefenseByThesisQuery,
  useGetDefenseByIdQuery,
  useGetDefenseByIdForMentorQuery,
  useScoreThesisMutation,
} = defenseApi;
