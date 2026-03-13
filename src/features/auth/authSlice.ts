import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

const tokenFromStorage = localStorage.getItem("access_token");

const initialState: AuthState = {
  isAuthenticated: !!tokenFromStorage,
  token: tokenFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;

      localStorage.setItem("access_token", action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;

      // ❌ xoá token
      localStorage.removeItem("access_token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
