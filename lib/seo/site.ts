/**
 * Central SEO / site configuration.
 *
 * Single source of truth for:
 * - the public site URL (from env, required for canonical/OG/sitemap),
 * - the deployment environment (controls indexability),
 * - the business identity + NAP (Name, Address, Phone) used by metadata and
 *   JSON-LD so the information stays consistent across every page.
 *
 * IMPORTANT (owner action):
 * - Set NEXT_PUBLIC_SITE_URL to the real production domain before deploying.
 * - The contact values below are mirrored from the project's contact data and
 *   should be confirmed against the real business details (see docs/seo-audit.md).
 */

import { contactDetails } from "@/features/contact/constants/contact-data";

// Fallback is a placeholder; production MUST override via NEXT_PUBLIC_SITE_URL.
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.greenherodarajat.com";

/** Public site origin, without a trailing slash. */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

/** Deployment environment. Only "production" is indexable. */
export const SITE_ENV = (process.env.NEXT_PUBLIC_SITE_ENV?.trim() || "production").toLowerCase();

/** True only in production — used to gate indexing in robots/metadata. */
export const IS_PRODUCTION = SITE_ENV === "production";

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/** Canonical business identity used across metadata and structured data. */
export const site = {
  name: "Green Hero Darajat",
  legalName: "Green Hero Darajat Hotel & Resort",
  // Short, natural description of the property for defaults/fallbacks.
  description:
    "Hotel dan penginapan keluarga di Darajat, Garut, Jawa Barat dengan kamar hangat, kolam air hangat alami, dan udara sejuk pegunungan.",
  locality: "Darajat",
  region: "Jawa Barat",
  city: "Garut",
  // Branding assets that already exist in /public/images.
  logo: "/images/green-hero-logo.png",
  defaultOgImage: "/images/green-hero-resort-sunset.webp",
  // NAP mirrored from the project's contact data (single source).
  address: contactDetails.address,
  telephone: contactDetails.phone,
  whatsapp: contactDetails.whatsapp,
  whatsappHref: contactDetails.whatsappHref,
  email: contactDetails.email,
  mapsHref: contactDetails.mapsHref,
} as const;
