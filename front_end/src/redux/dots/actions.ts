import { UpdateDotsState } from "./state";

export function updateDots(dots: UpdateDotsState) {
  return { type: "update_Dots" as const, dots };
}

export type UpdateDotsAction = ReturnType<typeof updateDots>;
