//action creator

type UserInfo = {
  newJwtKey: string | null,
  newId: number | null,
  newUsername: string | null,
  newNickname: string | null,
  newPhone: string | null,
  newEmail: string | null,
  newJoinedTime: string | null
  newIsAdmin: boolean;
};

export function updateJwt(userInfo: UserInfo) {
  return { type: "update_jwt" as const, payload: userInfo };
}

export type UpdateJwtAction = ReturnType<typeof updateJwt>;
