import { configureStore } from "@reduxjs/toolkit";

import settingsReducer from "../features/settings/settingsSlice";
import notificationReducer from "../features/notification/notificationSlice";
import organizationReducer from "../features/organization/organizationSlice";
import authReducer from "../features/auth/authSlice";
import { api } from "../services/api";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    toast: notificationReducer,
    auth: authReducer,
    organization: organizationReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
