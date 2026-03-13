import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `/auth/login`,
        body: credentials,
        method: "POST",
      }),
    }),
    loginOrg: builder.mutation({
      query: ({ code, credentials }) => ({
        url: `/auth/${code}/login`,
        body: credentials,
        method: "POST",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLoginOrgMutation, useLogoutMutation } =
  authApi;
