export interface UpdateJwtState {
  jwtKey: string | null;
  username: string | null;
  password: string | null;
  nickname: string | null;
  phone: string | null;
  email: string | null;
  joinedTime: string | null;
  is_admin: boolean;
}

export const initialState: UpdateJwtState = {
  jwtKey: null,
  username: null,
  password: null,
  nickname: null,
  phone: null,
  email: null,
  joinedTime: null,
  is_admin: false,
};
