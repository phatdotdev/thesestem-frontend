import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id?: string;
  message: string;
  type: ToastType;
  timeoutSet?: number;
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const ToastSlice = createSlice({
  name: "Toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Toast>) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = ToastSlice.actions;

export default ToastSlice.reducer;
