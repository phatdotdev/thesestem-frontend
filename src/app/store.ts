import { combineReducers, configureStore } from "@reduxjs/toolkit";

import settingsReducer from "../features/settings/settingsSlice";
import toastReducer from "../features/notification/toastSlice";
import notificationReducer from "../features/notification/notificationSlice";
import organizationReducer from "../features/organization/organizationSlice";
import authReducer, { logout } from "../features/auth/authSlice";
import { api } from "../services/api";

const appReducer = combineReducers({
  settings: settingsReducer,
  toast: toastReducer,
  notification: notificationReducer,
  auth: authReducer,
  organization: organizationReducer,
  [api.reducerPath]: api.reducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: Parameters<typeof appReducer>[1],
) => {
  const nextState = appReducer(state, action);

  // After auth logout runs, rebuild store from initial state to prevent cross-account stale data.
  if (logout.match(action)) {
    return appReducer(undefined, { type: "app/reset" });
  }

  return nextState;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableStateInvariantMiddleware: {
        ignoredActions: ["api/executeMutation/fulfilled"],
        ignoredPaths: [
          // Ignore Blob objects in RTK Query mutations
          /api\.mutations\..+\.data$/,
        ],
      },
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
