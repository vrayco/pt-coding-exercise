import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SigninProviders } from "enums";
import authService from "services/authService";
import { Credentials, User } from "types";
import { reset } from "./appSlice";
import { isHydrateAction, isResetAction } from "./utils";

interface AuthState {
  user: User | undefined;
  fetching: SigninProviders | undefined;
  error: string | undefined;
}

const initialState: AuthState = {
  user: undefined,
  fetching: undefined,
  error: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    fetching: (state, action: PayloadAction<SigninProviders>) => {
      state.fetching = action.payload;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInCredentials.fulfilled, (state, action) => {
      state.user = action.payload;
      state.fetching = undefined;
      state.error = undefined;
    });
    builder.addCase(signInCredentials.rejected, (state, action) => {
      state.user = undefined;
      state.fetching = undefined;
      state.error = action.payload;
    });
    builder.addCase(signInGithub.fulfilled, (state, action) => {
      state.user = action.payload;
      state.fetching = undefined;
      state.error = undefined;
    });
    builder.addCase(signInGithub.rejected, (state, action) => {
      state.user = undefined;
      state.fetching = undefined;
      state.error = action.payload;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.user = undefined;
      state.fetching = undefined;
      state.error = undefined;
    });
    builder.addMatcher(isHydrateAction, (state, action) => {
      state.user = action.payload.preloadedState?.auth?.user;
    });
    builder.addMatcher(isResetAction, (state, action) => {
      return initialState;
    });
  },
});

const { fetching } = authSlice.actions;

const signInCredentials = createAsyncThunk<
  User,
  Credentials,
  { rejectValue: string }
>("auth/signin_credentials", async (credentials: Credentials, thunkAPI) => {
  thunkAPI.dispatch(fetching(SigninProviders.CREDENTIALS));
  try {
    return await authService.signInCredentials(credentials);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

const signInGithub = createAsyncThunk<User, string, { rejectValue: string }>(
  "auth/signin_github",
  async (code: string, thunkAPI) => {
    thunkAPI.dispatch(fetching(SigninProviders.GITHUB));
    try {
      return await authService.signInGithub(code);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

const signOut = createAsyncThunk<Boolean>(
  "auth/signout",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(reset()); // This action will be handled by others reducers to get reset the whole state.
    return await authService.signOut();
  }
);

export { signInCredentials, signInGithub, signOut };

export default authSlice.reducer;
