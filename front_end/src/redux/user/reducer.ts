import { UpdateJwtAction } from "./actions";
import { initialState, UpdateJwtState } from "./state";

export const updateJwtReducer = (
  state: UpdateJwtState = initialState,
  action: UpdateJwtAction
): UpdateJwtState => {
  if (action.type === "update_jwt") {
    let {newJwtKey, newUsername, newNickname, newJoinedTime} = action.payload;

    return {
      jwtKey: newJwtKey,
      username: newUsername,
      nickname: newNickname,
      joinedTime: newJoinedTime
    };
  }
  return state;
};
