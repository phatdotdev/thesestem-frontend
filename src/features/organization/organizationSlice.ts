import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import LogoImage from "../../assets/images/simple-logo.png";

interface OrganizationState {
  logoUrl: string;
}

const initialState: OrganizationState = {
  logoUrl: LogoImage,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setLogoUrl: (state, action: PayloadAction<string>) => {
      state.logoUrl = action.payload;
    },
  },
});

export const { setLogoUrl } = organizationSlice.actions;
export default organizationSlice.reducer;
