import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { updateDotsReducer } from "./redux/dots/reducer";
import { updatePoints } from "./redux/points/actions";
import { updatePointsReducer } from "./redux/points/reducer";
import { updateJwtReducer } from "./redux/user/reducer";

const rootReducer = combineReducers({
  jwt: updateJwtReducer,
  points: updatePointsReducer,
  dots: updateDotsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
