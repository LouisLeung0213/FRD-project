export interface UpdateJwtState {
  jwtKey: string | null;
  id: number | null;
  username: string | null;
  nickname: string | null;
  phone: string | null;
  email: string | null;
  joinedTime: string | null;
  isAdmin: boolean;
  icon_name: string | null;
  bankAccount: Array<Object> | null;
  icon_src: string | null;
}

export const initialState: UpdateJwtState = {
  jwtKey: null,
  id: null,
  username: null,
  nickname: null,
  phone: null,
  email: null,
  joinedTime: null,
  isAdmin: false,
  bankAccount: null,
  icon_name: null,
  icon_src: null,
};
