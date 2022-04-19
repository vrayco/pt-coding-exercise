import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
  EntityState,
} from "@reduxjs/toolkit";
import { GitHubRepository } from "types";
import { RootState } from "./store";
import { isHydrateAction, isResetAction } from "./utils";

interface repositoriesState extends EntityState<GitHubRepository> {
  fetching: boolean | undefined;
  hydrated: boolean;
  error: string | undefined;
}

export const repositoriesAdapter = createEntityAdapter<GitHubRepository>({
  // Keep the "all IDs" array sorted based on repositories names
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState: repositoriesState = repositoriesAdapter.getInitialState({
  fetching: undefined,
  hydrated: false,
  error: undefined,
});

export const ownRepositoriesSlice = createSlice({
  name: "ownRepositories",
  initialState,
  reducers: {
    fetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRepositories.fulfilled, (state, action) => {
      repositoriesAdapter.setAll(state, action.payload);
      state.fetching = false;
      state.error = undefined;
    });
    builder.addCase(fetchRepositories.rejected, (state, action) => {
      state.fetching = false;
      state.error = action.payload;
    });
    builder.addMatcher(isHydrateAction, (state, action) => {
      if (action.payload.preloadedState?.ownRepositories) {
        repositoriesAdapter.setAll(
          state,
          action.payload.preloadedState.ownRepositories
        );
        state.hydrated = true;
      }
    });
    builder.addMatcher(isResetAction, () => {
      return initialState;
    });
  },
});

const fetchRepositories = createAsyncThunk<
  GitHubRepository[],
  undefined,
  { rejectValue: string }
>("ownRepositories/fetch_repositories", async (_, thunkAPI) => {
  thunkAPI.dispatch(fetching(true));
  try {
    const response = await fetch("/api/data/github/own-repositories");

    if (response.ok) {
      const { data } = await response.json();

      return data;
    } else {
      return thunkAPI.rejectWithValue(response.statusText);
    }
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

const repositoriesSelectors = repositoriesAdapter.getSelectors<RootState>(
  (state) => state.ownRepositories
);

export const { fetching } = ownRepositoriesSlice.actions;

export { fetchRepositories, repositoriesSelectors };

export default ownRepositoriesSlice.reducer;
