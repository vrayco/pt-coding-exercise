import { configureStore } from "@reduxjs/toolkit";
import authSlice from "redux/authSlice";
import appSlice from "./appSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice, // This reducer must be in the last place to ensure hydrate action is executed the last one
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type:t {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
