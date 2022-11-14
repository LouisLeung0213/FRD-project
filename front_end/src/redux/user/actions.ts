//action creator

type UserInfo = {
  newJwtKey: string | null,
  newUsername: string | null,
  newNickname: string | null,
  newJoinedTime: string | null
}

export function updateJwt(userInfo: UserInfo) {
  return { type: "update_jwt" as const, payload: userInfo };
}

export type UpdateJwtAction = ReturnType<typeof updateJwt>;
