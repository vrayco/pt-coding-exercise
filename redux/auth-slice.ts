import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "services/authService";
import { Credentials, NonSensitiveInfoUser } from "types";

interface AuthState {
  user: NonSensitiveInfoUser | undefined;
  fetching: boolean;
  error: string | undefined;
}

const initialState: AuthState = {
  user: undefined,
  fetching: false,
  error: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    fetching: (state) => {
      state.fetching = true;
      state.error = undefined;
    },
    signOut: (state) => {
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.user = action.payload;
      state.fetching = false;
      state.error = undefined;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.user = undefined;
      state.error = action.payload;
      state.fetching = false;
    });
  },
});

const { fetching, signOut } = authSlice.actions;

const signIn = createAsyncThunk<
  NonSensitiveInfoUser,
  Credentials,
  { rejectValue: string }
>("auth/signin", async (credentials: Credentials, thunkAPI) => {
  thunkAPI.dispatch(fetching());
  try {
    return await authService.signIn(credentials);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export { signIn, signOut };

export default authSlice.reducer;
