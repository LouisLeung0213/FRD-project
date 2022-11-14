import { configureStore } from "@reduxjs/toolkit";
import { updateJwtReducer } from "./redux/user/reducer";

export const store = configureStore({
  reducer: updateJwtReducer,
});

export type RootState = ReturnType<typeof store.getState>;
