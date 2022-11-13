import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "./redux/user/reducer";

export const store = configureStore({
  reducer: loginReducer,
});

export type RootState = ReturnType<typeof store.getState>;
