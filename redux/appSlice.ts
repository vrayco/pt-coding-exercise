import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppHydrationStatus } from "enums";
import { isHydrateAction } from "./utils";

interface AppState {
  hydrated: AppHydrationStatus;
}

const initialState: AppState = {
  hydrated: AppHydrationStatus.PENDING,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    hydrate: (state, action: PayloadAction<{ preloadedState: any }>) => {
      state.hydrated = AppHydrationStatus.IN_PROGRESS;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isHydrateAction, (state, action) => {
      state.hydrated = AppHydrationStatus.HYDRATED;
    });
  },
});

export const { hydrate } = appSlice.actions;

export default appSlice.reducer;
