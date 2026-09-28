import { rooms } from "./rooms";

export type RoomSelection = { roomId: string; quantity: number }[];

export function normalizeRoomSelection(value: unknown): RoomSelection {
  if (!Array.isArray(value)) return [];
  return rooms.filter((room) => room.available && room.remainingRooms > 0).flatMap((room) => {
    const entry = value.find((item) => item && typeof item === "object" && item.roomId === room.id);
    const quantity = Number(entry?.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) return [];
    return [{ roomId: room.id, quantity: Math.min(quantity, room.remainingRooms) }];
  });
}

export function parseRoomSelection(value: string | undefined, fallbackRoomId = "vip"): RoomSelection {
  if (value === undefined) return normalizeRoomSelection([{ roomId: fallbackRoomId, quantity: 1 }]);
  return normalizeRoomSelection(value.split(",").map((entry) => {
    const [roomId, quantity] = entry.split(":");
    return { roomId, quantity: Number(quantity) };
  }));
}

export function serializeRoomSelection(selection: RoomSelection) {
  return normalizeRoomSelection(selection).map(({ roomId, quantity }) => `${roomId}:${quantity}`).join(",");
}

export function getSelectedRoomItems(selection: RoomSelection) {
  return normalizeRoomSelection(selection).map(({ roomId, quantity }) => ({ room: rooms.find((room) => room.id === roomId)!, quantity }));
}

export function getRoomSelectionTotal(selection: RoomSelection, nights: number) {
  return getSelectedRoomItems(selection).reduce((total, { room, quantity }) => total + room.price * quantity * nights, 0);
}

export function countSelectedRooms(selection: RoomSelection) {
  return normalizeRoomSelection(selection).reduce((total, item) => total + item.quantity, 0);
}
