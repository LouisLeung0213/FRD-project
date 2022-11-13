//action creator

export function login(token: string) {
  return { type: "update_jwt" as const, payload: token };
}

export type LoginAction = ReturnType<typeof login>;
