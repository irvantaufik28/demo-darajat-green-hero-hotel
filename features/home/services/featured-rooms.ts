import { apiRequest } from "@/lib/api/client";
import { staticRoomImagesById } from "@/features/rooms/constants/static-room-media";

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

export async function listFeaturedRooms(signal?: AbortSignal) {
  const result = await apiRequest<{ items: FeaturedRoom[] }>("featured-rooms", { signal });
  return {
    ...result,
    items: result.items.map((room) => {
      const images = staticRoomImagesById[room.roomTypeId as keyof typeof staticRoomImagesById];
      const cover = images?.find((image) => image.isCover) ?? images?.[0];
      return cover ? { ...room, coverImage: { url: cover.url, altText: cover.altText } } : room;
    }),
  };
}
