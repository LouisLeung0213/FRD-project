import { LoginAction } from "./actions";
import { initialState, LoginState } from "./state";

export const loginReducer = (
  state: LoginState = initialState,
  action: LoginAction
): LoginState => {
  if (action.type === "update_jwt") {
    let newJwtKey = action.payload;
    return {
      jwtKey: newJwtKey,
    };
  }
  return state;
};
