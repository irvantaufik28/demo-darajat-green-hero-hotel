import { apiRequest } from "@/lib/api/client";

export type PublicBookingExtras = {
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  rooms: {
    roomTypeId: string;
    roomTypeName: string;
    addOns: {
      code: "extra_bed" | "adult_breakfast" | "child_breakfast";
      price: number;
      unit: string;
      maxQuantityPerRoom: number | null;
    }[];
  }[];
  experiences: {
    id: string;
    code: string;
    slug: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    maxQuantity: number | null;
    category: { id: string; code: string; name: string };
    variants: { id: string; name: string; description: string | null; price: number }[];
  }[];
  requests: { code: string; priceType: "on_request" }[];
};

export function getPublicBookingExtras(
  checkInDate: string,
  checkOutDate: string,
  roomTypeIds: string[],
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({
    checkInDate,
    checkOutDate,
    roomTypeIds: [...new Set(roomTypeIds)].join(","),
  });
  return apiRequest<PublicBookingExtras>(`booking/extras?${query}`, { signal });
}
