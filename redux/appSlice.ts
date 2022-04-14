import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppGlobalStatus, AppHydrationStatus } from "enums";
import { isHydrateAction, isResetAction } from "./utils";

interface AppState {
  globalStatus: AppGlobalStatus;
  hydrated: AppHydrationStatus;
}

const initialState: AppState = {
  globalStatus: AppGlobalStatus.READY,
  hydrated: AppHydrationStatus.PENDING,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    hydrate: (state, action: PayloadAction<{ preloadedState: any }>) => {
      state.hydrated = AppHydrationStatus.IN_PROGRESS;
    },
    reset: (state) => {
      state.globalStatus = AppGlobalStatus.RESETTING;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(isHydrateAction, (state, action) => {
      state.hydrated = AppHydrationStatus.HYDRATED;
    });
    builder.addMatcher(isResetAction, (state, action) => {
      return {
        ...initialState,
        hydrated: AppHydrationStatus.HYDRATED,
        globalStatus: AppGlobalStatus.RESETED,
      };
    });
  },
});

export const { hydrate, reset } = appSlice.actions;

export default appSlice.reducer;
