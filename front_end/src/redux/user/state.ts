export interface UpdateJwtState {
  jwtKey: string | null;
  username: string | null,
  nickname: string | null,
  joinedTime: string | null
}

export const initialState: UpdateJwtState = {
  jwtKey: null,
  username: null,
  nickname: null,
  joinedTime: null
};
