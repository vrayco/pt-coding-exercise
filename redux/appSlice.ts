import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppGlobalStatus, AppHydrationStatus } from "enums";
import { RootState } from "./store";
import { isHydrateAction, isResetAction } from "./utils";

interface AppState {
  globalStatus: AppGlobalStatus;
  hydrated: AppHydrationStatus;
}

const initialState: AppState = {
  globalStatus: AppGlobalStatus.READY,
  hydrated: AppHydrationStatus.PENDING,
};

type PayloadHydrateActionType = { preloadedState: Partial<RootState> };

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // This action (hydrate) is handled by other reducers as well.
    hydrate: (state, action: PayloadAction<PayloadHydrateActionType>) => {
      state.hydrated = AppHydrationStatus.IN_PROGRESS;
    },
    // This action (reset) is handled by other reducers as well.
    reset: (state) => {
      state.globalStatus = AppGlobalStatus.RESETTING;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(isHydrateAction, (state) => {
      state.hydrated = AppHydrationStatus.HYDRATED;
    });
    builder.addMatcher(isResetAction, () => {
      return {
        ...initialState,
        globalStatus: AppGlobalStatus.RESETED,
        hydrated: AppHydrationStatus.HYDRATED,
      };
    });
  },
});

export const { hydrate, reset } = appSlice.actions;

export default appSlice.reducer;
