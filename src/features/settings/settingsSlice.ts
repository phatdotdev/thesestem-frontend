import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const getInitialTheme = (): "light" | "dark" => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme === "dark" ? "dark" : "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

interface SettingsState {
  theme: "light" | "dark";
  language: string;
  notificationsEnabled: boolean;
}

const initialState: SettingsState = {
  theme: getInitialTheme(),
  language: "en",
  notificationsEnabled: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
  },
});

export const { setTheme, setLanguage, toggleNotifications } =
  settingsSlice.actions;
export default settingsSlice.reducer;
