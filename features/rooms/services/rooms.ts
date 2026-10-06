import { apiRequest } from "../../../lib/api/client";
import type { Room } from "../constants/rooms-data";

export type { Room } from "../constants/rooms-data";

// Fetch all bookable room types from the public API.
export function getRooms(signal?: AbortSignal) {
  return apiRequest<{ items: Room[] }>("rooms", { signal });
}

// Fetch a single room type by its id/slug.
export function getRoom(id: string, signal?: AbortSignal) {
  return apiRequest<{ room: Room }>(`rooms/${encodeURIComponent(id)}`, { signal });
}
