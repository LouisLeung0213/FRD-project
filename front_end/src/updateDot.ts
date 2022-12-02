import { API_ORIGIN } from "./api";

export async function updateDot(id: number, location: string, status: boolean) {
  let res = await fetch(`${API_ORIGIN}/users/updateDots/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      statusLocation: location,
      status,
    }),
  });
  let result = await res.json();
  return result;
}
