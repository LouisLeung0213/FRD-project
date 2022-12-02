import { UpdateDotsState, initialState } from "./state";
import { UpdateDotsAction } from "./actions";

export const updateDotsReducer = (
  oldState: UpdateDotsState = initialState,
  action: UpdateDotsAction
): UpdateDotsState => {
  let newState = { ...oldState };
  if (action.type === "update_Dots") {
    newState = action.dots;
    return newState;
  }
  return oldState;
};
