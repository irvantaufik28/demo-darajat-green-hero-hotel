import type { RoomQuote } from "./public-rooms";

export const LIVE_BOOKING_KEY = "green-hero-live-room-booking";
export const LIVE_GUEST_DRAFT_KEY = "green-hero-live-guest-draft";

export type LiveRoomBooking = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  selection: { roomId: string; quantity: number }[];
  allocation: { roomTypeId: string; adults: number; children: number; cancellationPolicyId?: string | null }[];
  quote: RoomQuote;
  roomImages?: Record<string, { url: string; altText: string }>;
  extras?: {
    rooms: { extraBeds: number; adultBreakfasts: number; childBreakfasts: number }[];
    experiences: { variantId: string; quantity: number }[];
    specialRequests: string;
    requestCodes?: string[];
    note?: string;
  };
};

export function serializeLiveSelection(selection: LiveRoomBooking["selection"]) {
  return selection.map(({ roomId, quantity }) => `${roomId}:${quantity}`).join(",");
}

export function liveBookingFingerprint(booking: LiveRoomBooking) {
  return `${booking.checkIn}|${booking.checkOut}|${booking.adults}|${booking.children}|${serializeLiveSelection(booking.selection)}`;
}

export function readLiveBooking(): LiveRoomBooking | null {
  try {
    const raw = sessionStorage.getItem(LIVE_BOOKING_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as LiveRoomBooking;
    if (!value || !Array.isArray(value.selection) || !Array.isArray(value.allocation) || !value.quote || !value.checkIn || !value.checkOut) return null;
    const count = value.selection.reduce((total, item) => total + item.quantity, 0);
    if (count !== value.quote.roomCount || value.allocation.length !== count) return null;
    return value;
  } catch {
    return null;
  }
}
