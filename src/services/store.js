import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../features/CustomerSlice";

export const store = configureStore({
  reducer: {
    customer: customerReducer,
  },
});
