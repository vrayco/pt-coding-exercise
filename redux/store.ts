import { configureStore } from "@reduxjs/toolkit";
import authSlice from "redux/authSlice";
import dataSlice from "redux/dataSlice";
import appSlice from "redux/appSlice";

/**
 * IMPORTANT: The appSlice reducer must be declared in the last place of the 
 * reducers object to ensure their reducers are executed the last ones.
 * The reason is because redux executes those reducers in "extraReducers"
 * following the order here.
 */
export const store = configureStore({
  reducer: {
    auth: authSlice,
    data: dataSlice,
    app: appSlice, // appSlice must be declared in the latest position.
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
