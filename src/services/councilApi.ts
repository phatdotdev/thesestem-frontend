import type { CouncilResponse } from "../types/council";
import type { ApiResponse } from "../types/response";
import { api } from "./api";

const COUN_URL = "/councils";

const councilApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentCouncilList: builder.query<ApiResponse<CouncilResponse[]>, any>({
      query: (form) => ({
        url: `${COUN_URL}/current/list`,
        params: form,
      }),
      providesTags: ["Council"],
    }),
    getCurrentCouncils: builder.query<ApiResponse<CouncilResponse[]>, any>({
      query: () => ({
        url: `${COUN_URL}/member/current`,
      }),
      providesTags: ["Council"],
    }),
    getCouncilsBySemester: builder.query<
      ApiResponse<CouncilResponse[]>,
      string
    >({
      query: (semesterId) => ({
        url: `${COUN_URL}/member/semester/${semesterId}`,
      }),
      providesTags: ["Council"],
    }),
    getCouncilById: builder.query<ApiResponse<CouncilResponse>, string>({
      query: (id) => ({
        url: `${COUN_URL}/${id}`,
      }),
      providesTags: ["Council"],
    }),
  }),
});

export const {
  useGetCurrentCouncilListQuery,
  useGetCurrentCouncilsQuery,
  useGetCouncilsBySemesterQuery,
  useLazyGetCouncilsBySemesterQuery,
  useGetCouncilByIdQuery,
} = councilApi;
