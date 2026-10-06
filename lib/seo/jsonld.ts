/**
 * Schema.org JSON-LD builders.
 *
 * Only data that actually exists in the project is emitted. No ratings,
 * reviews, stars, prices, availability, distances, or attractions are
 * fabricated. Fields that depend on owner-provided data (geo coordinates,
 * check-in/out times) are intentionally omitted until that data exists.
 */

import type { Room } from "@/features/rooms/constants/rooms-data";
import { SITE_URL, absoluteUrl, site } from "./site";

type JsonLdObject = Record<string, unknown>;

/** Parse a leading integer out of a free-text occupancy label (e.g. "Hingga 4 Tamu" -> 4). */
function parseMaxOccupancy(guests: string): number | undefined {
  const match = guests.match(/\d+/g);
  if (!match || match.length === 0) return undefined;
  // Use the largest number found so ranges like "2–4" yield 4.
  return Math.max(...match.map(Number));
}

/** PostalAddress shared by Hotel/LocalBusiness. */
function postalAddress(): JsonLdObject {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address,
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: "ID",
  };
}

/** Hotel + LocalBusiness identity for the homepage. */
export function hotelJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${SITE_URL}/#hotel`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: SITE_URL,
    logo: absoluteUrl(site.logo),
    image: absoluteUrl(site.defaultOgImage),
    telephone: site.telephone,
    email: site.email,
    address: postalAddress(),
    hasMap: site.mapsHref,
    areaServed: `${site.city}, ${site.region}`,
  };
}

/** WebSite entity for the homepage. */
export function webSiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: site.name,
    url: SITE_URL,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#hotel` },
  };
}

type Crumb = { name: string; path: string };

/** BreadcrumbList for internal pages. */
export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** HotelRoom for a room detail page. No price/availability/rating is emitted. */
export function hotelRoomJsonLd(room: Room): JsonLdObject {
  const maxOccupancy = parseMaxOccupancy(room.guests);
  const node: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.name,
    description: room.description,
    url: absoluteUrl(`/rooms/${room.id}`),
    image: absoluteUrl(room.image),
    // Link the room back to the property.
    containedInPlace: { "@type": "Hotel", name: site.name, "@id": `${SITE_URL}/#hotel` },
    // Amenities use the human-readable labels from room data.
    amenityFeature: room.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.label,
      value: true,
    })),
  };
  if (maxOccupancy) {
    node.occupancy = { "@type": "QuantitativeValue", maxValue: maxOccupancy, unitText: "person" };
  }
  if (room.feature) node.bed = room.feature;
  return node;
}
