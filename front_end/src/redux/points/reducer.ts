import { UpdatePointsAction } from "./actions";
import { initialState, UpdatePointsState } from "./state";

export const updatePointsReducer = (
  oldState: UpdatePointsState = initialState,
  action: UpdatePointsAction
): UpdatePointsState => {
  let newState = { ...oldState };
  if (action.type === "update_Points") {
    newState = action.points;

    console.log(newState);
    return newState;
  }
  return oldState;
};
