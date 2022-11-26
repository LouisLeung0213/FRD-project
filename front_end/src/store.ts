import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { updatePoints } from "./redux/points/actions";
import { updatePointsReducer } from "./redux/points/reducer";
import { updateJwtReducer } from "./redux/user/reducer";

const rootReducer = combineReducers({
  first: updateJwtReducer,
  second: updatePointsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
