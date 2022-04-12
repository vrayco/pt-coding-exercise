import { configureStore, ReducerFromReducersMapObject } from "@reduxjs/toolkit";
import authSlice from "redux/auth-slice";
import appSlice from "./app-slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice, // This reducer must be in the last place to ensure hydrate action is executed the last one
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootSate = ReturnType<typeof store.getState>;
// Inferred type:t {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
