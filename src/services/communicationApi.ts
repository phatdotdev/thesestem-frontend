import type { ApiResponse } from "../types/response";
import { api } from "./api";

const CHAT_URL = "/messages";

const communicationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGroupMessages: build.query<ApiResponse<any[]>, string>({
      query: (groupId) => `${CHAT_URL}/group/${groupId}`,
      providesTags: ["ChatMessage"],
    }),
    sendSystemNotification: build.mutation<
      void,
      { title: string; content: string; type: string; recipientGroup: string }
    >({
      query: (data) => ({
        url: "/notifications/system",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SystemNotification", "Notification"],
    }),
    getSystemNotifications: build.query<ApiResponse<any[]>, void>({
      query: () => "/notifications/system",
      providesTags: ["SystemNotification"],
    }),
    getNotifications: build.query<ApiResponse<any[]>, void>({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),
    readNotification: build.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    readAllNotifications: build.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetGroupMessagesQuery,
  useReadNotificationMutation,
  useReadAllNotificationsMutation,
  useGetNotificationsQuery,
  useSendSystemNotificationMutation,
  useGetSystemNotificationsQuery,
} = communicationApi;
