/**
 * Reusable page metadata builder.
 *
 * Produces a Next.js `Metadata` object with consistent canonical, Open Graph,
 * and Twitter fields. Pages pass only what is specific to them (title,
 * description, path, optional image / noindex).
 */

import type { Metadata } from "next";
import { IS_PRODUCTION, site } from "./site";

type BuildMetadataArgs = {
  /** Page title WITHOUT the brand suffix (the template adds it). */
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. "/rooms". */
  path: string;
  /** Site-relative or absolute OG image. Defaults to the branded hero. */
  image?: string;
  /** Set true for transactional/private pages that must not be indexed. */
  noindex?: boolean;
  /** og:type — "website" (default) or "article". */
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path,
  image = site.defaultOgImage,
  noindex = false,
  type = "website",
}: BuildMetadataArgs): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  // Non-production environments are never indexable; see robots.ts too.
  const index = IS_PRODUCTION && !noindex;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index,
      follow: index,
      googleBot: { index, follow: index },
    },
    openGraph: {
      type,
      siteName: site.name,
      title,
      description,
      url: canonical,
      images: [{ url: image }],
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
