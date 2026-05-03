import { api } from "./api";
import type { ApiResponse } from "../types/response";
import type { SystemStatistics } from "../types/statistics";

const statisticsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSystemStatistics: build.query<ApiResponse<SystemStatistics>, void>({
      query: () => "/statistics/system",
      providesTags: ["Statistics"],
    }),
    getGroupStatistics: build.query<ApiResponse<any>, string>({
      query: (groupId) => `/statistics/group/${groupId}`,
      providesTags: ["Statistics"],
    }),
    getMentorStatistics: build.query<ApiResponse<any>, void>({
      query: () => `/statistics/mentor`,
      providesTags: ["Statistics"],
    }),
    getMentorStatisticsBySemester: build.query<ApiResponse<any>, string>({
      query: (semesterId) => `/statistics/mentor/semester/${semesterId}`,
      providesTags: ["Statistics"],
    }),
    getOrganizationStatistics: build.query<ApiResponse<any>, any>({
      query: (form) => ({
        url: "/statistics/organization",
        params: form,
      }),
      providesTags: ["Statistics"],
    }),
  }),
});
export const {
  useGetSystemStatisticsQuery,
  useGetGroupStatisticsQuery,
  useGetMentorStatisticsQuery,
  useGetMentorStatisticsBySemesterQuery,
  useLazyGetMentorStatisticsBySemesterQuery,
  useGetOrganizationStatisticsQuery,
} = statisticsApi;
