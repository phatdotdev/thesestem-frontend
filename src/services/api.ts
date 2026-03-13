import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { loginSuccess, logout } from "../features/auth/authSlice";

/* ======================================================
   BASE QUERY
====================================================== */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/* ======================================================
   REFRESH TOKEN QUEUE
====================================================== */
let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const onLogout = () => {
  refreshSubscribers = [];
};

/* ======================================================
   BASE QUERY WITH REAUTH
====================================================== */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) return result;

  // Nếu refresh cũng 401 → logout
  if (typeof args !== "string" && args.url === "/auth/refresh") {
    api.dispatch(logout());
    onLogout();
    return result;
  }

  const originalRequest = args;

  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const newToken = (refreshResult.data as any).data.accessToken;

        // ✅ Lưu token mới
        api.dispatch(loginSuccess({ token: newToken }));

        // Đánh thức các request đang đợi
        onRefreshed();

        // ✅ Retry request gốc (prepareHeaders tự lấy token mới)
        result = await rawBaseQuery(originalRequest, api, extraOptions);
      } else {
        api.dispatch(logout());
        onLogout();
      }
    } catch {
      api.dispatch(logout());
      onLogout();
    } finally {
      isRefreshing = false;
    }
  } else {
    // ⏳ Các request khác đợi refresh
    return new Promise((resolve) => {
      subscribeTokenRefresh(() => {
        resolve(rawBaseQuery(originalRequest, api, extraOptions));
      });
    });
  }

  return result;
};

/* ======================================================
   API INSTANCE
====================================================== */
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Thesis",
    "Year",
    "Structure",
    "Program",
    "Student",
    "Lecturer",
    "Manager",
    "Group",
    "SemesterStudent",
    "SemesterMentor",
  ],
  endpoints: () => ({}),
});
