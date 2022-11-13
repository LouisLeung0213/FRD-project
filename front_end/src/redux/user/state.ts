export interface LoginState {
  jwtKey: string | null;
}

export const initialState: LoginState = {
  jwtKey: null,
};
