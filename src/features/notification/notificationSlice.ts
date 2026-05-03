import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NotificationResponse } from "../../types/communication";

interface NotificationState {
  notifications: NotificationResponse[];

  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationResponse>) => {
      state.notifications.unshift(action.payload);

      state.unreadCount += 1;
    },

    setNotifications: (
      state,
      action: PayloadAction<NotificationResponse[]>,
    ) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload,
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      }
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, setNotifications, markAllRead, markAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
