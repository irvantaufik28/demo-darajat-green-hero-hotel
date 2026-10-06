import { apiRequest } from "../../../lib/api/client";

// Facility content served to the public site. The shape mirrors the static
// data in ../constants/facilities-data; icons are resolved on the client, so
// the API is expected to return icon codes (strings) rather than components.
export type FacilityFeatureDto = { icon: string; title: string; description?: string };
export type FeaturedFacilityDto = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  features: FacilityFeatureDto[];
  note?: string;
  compact?: boolean;
};

export function getFeaturedFacilities(signal?: AbortSignal) {
  return apiRequest<{ items: FeaturedFacilityDto[] }>("facilities", { signal });
}
