import { apiRequest } from "@/lib/api/client";

export type FeaturedRoom = {
  roomTypeId: string;
  sortOrder: number;
  isActive: boolean;
  slug: string;
  name: string;
  description: string | null;
  sizeSqm: string | null;
  maxGuests: number | null;
  coverImage: { url: string; altText: string | null } | null;
  startingPrice: number | null;
};

export function listFeaturedRooms(signal?: AbortSignal) {
  return apiRequest<{ items: FeaturedRoom[] }>("featured-rooms", { signal });
}
