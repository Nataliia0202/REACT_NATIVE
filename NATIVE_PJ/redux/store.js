import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "../redux/sliceAuth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});