import { UpdateJwtAction } from "./actions";
import { initialState, UpdateJwtState } from "./state";

export const updateJwtReducer = (
  state: UpdateJwtState = initialState,
  action: UpdateJwtAction
): UpdateJwtState => {
  if (action.type === "update_jwt") {
    let {
      newJwtKey,
      newId,
      newUsername,
      newNickname,
      newPhone,
      newEmail,
      newJoinedTime,
      newIsAdmin,
    } = action.payload;

    return {
      jwtKey: newJwtKey,
      id: newId,
      username: newUsername,
      nickname: newNickname,
      phone: newPhone,
      email: newEmail,
      joinedTime: newJoinedTime,
      is_admin: newIsAdmin,
    };
  }
  return state;
};
