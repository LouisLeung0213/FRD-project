import { UpdateJwtAction } from "./actions";
import { initialState, UpdateJwtState } from "./state";

export const updateJwtReducer = (
  oldState: UpdateJwtState = initialState,
  action: UpdateJwtAction
): UpdateJwtState => {
  let newState = { ...oldState };
  if (action.type === "update_jwt") {
    newState = action.userInfo;
    // let {
    //   newJwtKey,
    //   newId,
    //   newUsername,
    //   newNickname,
    //   newPhone,
    //   newEmail,
    //   newJoinedTime,
    //   newIsAdmin,
    // } = action.userInfo;

    // return {...state,
    //   jwtKey: newJwtKey,
    //   id: newId,
    //   username: newUsername,
    //   nickname: newNickname,
    //   phone: newPhone,
    //   email: newEmail,
    //   joinedTime: newJoinedTime,
    //   isAdmin: newIsAdmin,
    // };
    console.log(newState);
    return newState;
  }
  return oldState;
};
