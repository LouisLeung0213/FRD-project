import { UpdateJwtAction } from "./actions";
import { initialState, UpdateJwtState } from "./state";

export const updateJwtReducer = (
  state: UpdateJwtState = initialState,
  action: UpdateJwtAction
): UpdateJwtState => {
  if (action.type === "update_jwt") {
    let {newJwtKey, newUsername, newPassword, newNickname, newPhone, newEmail, newJoinedTime} = action.payload;

    return {
      jwtKey: newJwtKey,
      username: newUsername,
      password: newPassword,
      nickname: newNickname,
      phone: newPhone,
      email: newEmail,
      joinedTime: newJoinedTime
    };
  }
  return state;
};
