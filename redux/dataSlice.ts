import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { GitHubRepository, User } from "types";
import { isHydrateAction, isResetAction } from "./utils";

interface DataState {
  fetching: boolean | undefined;
  error: string | undefined;
  publicRepositories: GitHubRepository[] | undefined;
  ownRepositories: GitHubRepository[] | undefined;
}

const initialState: DataState = {
  fetching: undefined,
  error: undefined,
  publicRepositories: undefined,
  ownRepositories: undefined,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    fetching: (state, action: PayloadAction<boolean>) => {
      state.fetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOwnRepositories.fulfilled, (state, action) => {
      state.ownRepositories = action.payload;
      state.fetching = false;
      state.error = undefined;
    });
    builder.addCase(fetchOwnRepositories.rejected, (state, action) => {
      state.fetching = false;
      state.error = action.payload;
    });
    builder.addCase(fetchPublicRepositories.fulfilled, (state, action) => {
      state.publicRepositories = action.payload;
      state.fetching = false;
      state.error = undefined;
    });
    builder.addCase(fetchPublicRepositories.rejected, (state, action) => {
      state.fetching = false;
      state.error = action.payload;
    });
    builder.addMatcher(isHydrateAction, (state, action) => {
      state.ownRepositories =
        action.payload.preloadedState?.data?.ownRepositories;
      state.publicRepositories =
        action.payload.preloadedState?.data?.publicRepositories;
    });
    builder.addMatcher(isResetAction, (state, action) => {
      return initialState;
    });
  },
});

const fetchOwnRepositories = createAsyncThunk<
  GitHubRepository[],
  undefined,
  { rejectValue: string }
>("data/fetch_own_repositories", async (undefined, thunkAPI) => {
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

const fetchPublicRepositories = createAsyncThunk<
  GitHubRepository[],
  undefined,
  { rejectValue: string }
>("data/fetch_public_repositories", async (_, thunkAPI) => {
  thunkAPI.dispatch(fetching(true));
  try {
    const response = await fetch("/api/data/github/public-repositories");

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

export const { fetching } = dataSlice.actions;

export { fetchOwnRepositories, fetchPublicRepositories };

export default dataSlice.reducer;
