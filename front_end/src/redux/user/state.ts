export interface UpdateJwtState {
  jwtKey: string | null;
  id: number | undefined;
  username: string | undefined;
  nickname: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  joinedTime: string | undefined;
  isAdmin: boolean;
  icon_name: string | undefined;
  bankAccount: Array<Object>;
  icon_src: string | undefined;
}

export const initialState: UpdateJwtState = {
  jwtKey: null,
  id: undefined,
  username: undefined,
  nickname: undefined,
  phone: undefined,
  email: undefined,
  joinedTime: undefined,
  isAdmin: false,
  bankAccount: [{}],
  icon_name: undefined,
  icon_src: undefined,
};
