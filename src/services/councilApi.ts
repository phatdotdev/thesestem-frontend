import type { CouncilResponse } from "../types/council";
import type { ApiResponse } from "../types/response";
import { api } from "./api";

const COUN_URL = "/councils";

const councilApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentCouncils: builder.query<ApiResponse<CouncilResponse[]>, any>({
      query: () => ({
        url: `${COUN_URL}/member/current`,
      }),
    }),
    getCouncilById: builder.query<ApiResponse<CouncilResponse>, string>({
      query: (id) => ({
        url: `${COUN_URL}/${id}`,
      }),
    }),
  }),
});

export const { useGetCurrentCouncilsQuery, useGetCouncilByIdQuery } =
  councilApi;
