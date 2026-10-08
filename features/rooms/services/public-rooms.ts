import { apiRequest } from "@/lib/api/client";

export type PublicRoom = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sizeSqm: number | null;
  bedCount: number | null;
  bedTypeName: string | null;
  mealTypeName: string | null;
  viewTypeName: string | null;
  images: { id: string; url: string; altText: string | null; isCover: boolean; sortOrder: number }[];
  amenities: { id: string; name: string; iconKey: string | null }[];
  capacityPatterns: { adults: number; children: number; extraBeds: number }[];
};

export type RoomAvailability = {
  roomType: PublicRoom;
  availableRooms: number;
  readyRoomCount?: number;
  maxBookableRooms?: number;
  bookable: boolean;
  unavailableReasons: string[];
  nightlyRates: { stayDate: string; basePrice: number | null }[];
  pricePreview: {
    roomTotal: number;
    discountTotal: number;
    nightly: { stayDate: string; basePrice: number; discountAmount: number; finalPrice: number }[];
    appliedCampaigns: {
      id: string;
      name: string;
      bookingEnd: string | null;
      stayEnd: string | null;
    }[];
  } | null;
  cancellationPolicies: {
    id: string | null;
    name: string;
    policyType: string | null;
    noShowChargeType: "percentage" | "first_night" | "full_stay" | null;
    noShowChargeValue: number;
    rules: { timingType: string; daysBefore: number | null; chargeType: string; chargeValue: number }[];
  }[];
};

export function selectableRoomCount(availability?: RoomAvailability): number {
  return availability?.bookable ? (availability.maxBookableRooms ?? availability.availableRooms) : 0;
}

export type RoomQuote = {
  nights: number;
  roomCount: number;
  roomTotal: number;
  discountTotal: number;
  bookingTotal: number;
  extraBedTotal?: number;
  breakfastTotal?: number;
  experienceTotal?: number;
  experiences?: { name: string; quantity: number; totalAmount: number }[];
  rooms: { roomIndex: number; roomTypeId: string; roomTypeName: string; baseAmount: number; discountAmount: number }[];
  appliedCampaigns: unknown[];
};

export function listRooms(signal?: AbortSignal) {
  return apiRequest<{ items: PublicRoom[] }>("rooms", { signal });
}

export function searchRooms(checkInDate: string, checkOutDate: string, signal?: AbortSignal) {
  const query = new URLSearchParams({ checkInDate, checkOutDate });
  return apiRequest<{ items: RoomAvailability[] }>(`rooms/availability?${query}`, { signal });
}

export function quoteRooms(
  body: {
    checkInDate: string;
    checkOutDate: string;
    totalAdults: number;
    totalChildren: number;
    rooms: { roomTypeId: string; adults: number; children: number; cancellationPolicyId?: string | null; extraBeds?: number; adultBreakfasts?: number; childBreakfasts?: number }[];
    experiences?: { variantId: string; quantity: number }[];
  },
  signal?: AbortSignal,
) {
  return apiRequest<RoomQuote>("rooms/quote", { method: "POST", body, signal });
}
