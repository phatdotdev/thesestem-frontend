import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `/auth/login`,
        body: credentials,
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    loginOrg: builder.mutation({
      query: ({ code, credentials }) => ({
        url: `/auth/${code}/login`,
        body: credentials,
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: `/auth/register`,
        body: credentials,
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    verifyEmail: builder.mutation({
      query: ({ email, code }) => ({
        url: `/auth/verify`,
        body: { email, code },
        method: "POST",
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: `/auth/resend-verification-email`,
        params: { email },
        method: "POST",
      }),
    }),
    createOrganization: builder.mutation({
      query: (data) => ({
        url: `auth/create-org`,
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Organization"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginOrgMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useCreateOrganizationMutation,
  useLogoutMutation,
} = authApi;
