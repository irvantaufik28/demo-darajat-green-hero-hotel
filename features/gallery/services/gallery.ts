import { apiRequest } from "../../../lib/api/client";
import type { GalleryPhoto } from "../constants/gallery-data";

export type { GalleryPhoto } from "../constants/gallery-data";

// Fetch gallery photos, optionally filtered by category id.
export function getGalleryPhotos(category?: string, signal?: AbortSignal) {
  const query = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  return apiRequest<{ items: GalleryPhoto[] }>(`gallery${query}`, { signal });
}
