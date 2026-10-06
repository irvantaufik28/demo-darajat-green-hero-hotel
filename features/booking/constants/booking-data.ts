import { foodPackageLabels, foodPackagePrices } from "./food-packages-data";
import { celebrationCategories, celebrationPackageLabels, celebrationPackagePrices } from "./celebration-packages-data";
import type { RoomSelection } from "../../rooms/constants/room-selection-data";

export const BOOKING_DRAFT_KEY = "green-hero-booking-draft";
export const GUEST_DRAFT_KEY = "green-hero-guest-draft";

export type GuestDraft = {
  fullName: string;
  nationality?: string;
  whatsapp: string;
  email: string;
};

export const bookingExtraPrices = {
  ...foodPackagePrices,
  "extra-bed": 250000,
  ...celebrationPackagePrices,
} as const;

export const bookingExtraLabels = {
  ...foodPackageLabels,
  "extra-bed": "Extra Bed",
  ...celebrationPackageLabels,
} as const;

export type PaidExtraId = keyof typeof bookingExtraPrices;

export function getExtraQuantityLimit(id: PaidExtraId) {
  return id === "extra-bed" || id in celebrationPackagePrices ? 1 : 10;
}

export function normalizeExtraCounts(counts: Record<string, unknown>) {
  const normalized = Object.fromEntries((Object.keys(bookingExtraPrices) as PaidExtraId[]).map((id) => {
    const count = Number(counts[id]);
    return [id, Number.isInteger(count) ? Math.max(0, Math.min(getExtraQuantityLimit(id), count)) : 0];
  })) as Record<PaidExtraId, number>;
  for (const category of celebrationCategories) {
    let selected = false;
    for (const item of category.packages) {
      if (normalized[item.id] > 0 && !selected) {
        normalized[item.id] = 1;
        selected = true;
      } else {
        normalized[item.id] = 0;
      }
    }
  }
  return normalized;
}

export type BookingDraft = {
  roomId: string;
  roomSelection?: RoomSelection;
  checkIn: string;
  checkOut: string;
  guests: string;
  counts: Record<string, number>;
  requests: Record<string, boolean>;
  specialNote: string;
};

export function getNights(checkIn: string, checkOut: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return 0;
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, Math.round((end - start) / 86400000));
}

export function getExtraCost(id: PaidExtraId, count: number, nights: number) {
  return bookingExtraPrices[id] * count * (id === "extra-bed" ? nights : 1);
}
