//action creator

import { UpdatePointsState } from "./state";

export function updatePoints(points: UpdatePointsState) {
  return { type: "update_Points" as const, points };
}

export type UpdatePointsAction = ReturnType<typeof updatePoints>;
