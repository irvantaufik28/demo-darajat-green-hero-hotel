# SEO Audit — Green Hero Darajat (Public Website)

Audit date: 2026-10-07
Scope: Public website only (`app/`, `features/`, `components/`). Admin/backoffice excluded.
Framework: Next.js 16 (App Router, Turbopack), React 19.

This document lists issues found in the pre-optimization state, the affected
pages, severity, and the fix that was implemented. "Owner action" items cannot
be completed in code and are listed in `docs/seo-setup.md`.

Severity scale: **High** (blocks indexing / major ranking impact), **Medium**
(meaningful SEO quality), **Low** (polish).

---

## Summary table

| # | Problem | Affected page(s) | Severity | Fix implemented |
|---|---------|------------------|----------|-----------------|
| 1 | No `metadataBase` → relative OG/canonical URLs would fail to resolve | All | High | Added `metadataBase` from `NEXT_PUBLIC_SITE_URL` in `app/layout.tsx` |
| 2 | No canonical URLs | All | High | Added `alternates.canonical` per route via `buildMetadata()` |
| 3 | No `robots.txt` | Site | High | Added `app/robots.ts` (env-aware: production indexable, non-prod `noindex`) |
| 4 | No `sitemap.xml` | Site | High | Added `app/sitemap.ts` listing canonical public pages (incl. room details) |
| 5 | No Open Graph / Twitter metadata | All | High | Added OG + Twitter defaults in layout and per-page overrides |
| 6 | Generic, non-localized homepage title/description | Home | High | New title/description targeting "Hotel & Penginapan di Darajat Garut" |
| 7 | Missing unique titles/descriptions on most routes | Rooms, facilities, gallery, contact, experiences, reservation-check | High | Added unique metadata per route; title template `%s | Green Hero Darajat` |
| 8 | No structured data (JSON-LD) | All | High | Added `Hotel`+`WebSite` on home, `BreadcrumbList` on internal pages, `HotelRoom` on room detail |
| 9 | Booking/transactional pages were indexable | `/booking/*`, `/reservation-check` | Medium | `robots: noindex` on these routes + excluded from sitemap |
| 10 | NAP inconsistency: contact page vs facilities footer show different phone/address | `/contact`, `/facilities` | Medium | Centralized NAP in `lib/seo/site.ts`; facilities footer now reads shared contact data (owner must confirm the correct real values) |
| 11 | Home H1 renders inside a client component (`"use client"`) | Home | Low | Content is still server-rendered as static HTML by Next.js; verified H1 "Darajat Garut" present in prerendered output. JSON-LD injected server-side via the server page wrapper |
| 12 | No web app manifest | Site | Low | Added `app/manifest.ts` with name/short_name/icons |
| 13 | No `NEXT_PUBLIC_SITE_URL` env | Site | High (deploy) | Documented in `.env.example`; required before production deploy |

---

## Checklist results

### Metadata
- **Titles**: Before — only a single global title. After — unique, length-aware (~50–60 chars) titles per route via a shared `buildMetadata()` helper and a title template.
- **Descriptions**: Before — single global description. After — unique ~140–160 char descriptions per route, written as natural Indonesian copy matching search intent.
- **Duplicated metadata**: Resolved — each route now defines its own.
- **Missing metadata**: Resolved for all public routes.

### Indexability & technical
- **robots.txt**: Added via `app/robots.ts`. Production allows all crawlable public pages, disallows `/booking/` and `/api/`. Non-production (`NEXT_PUBLIC_SITE_ENV !== "production"`) returns site-wide `disallow: /` to prevent preview/staging indexing.
- **sitemap.xml**: Added via `app/sitemap.ts`. Includes home, rooms, each room detail (from room data), facilities, gallery, contact, and the 5 experience pages. Excludes `/booking/*`, `/reservation-check`, and `/api/*`.
- **Canonical**: Added per page.
- **Trailing slash / URL structure**: Clean, lowercase, hyphenated slugs already in use (`/rooms/mountain-villa`, `/experiences/roast-goat`). No query-string-based routes for primary content. No change needed.
- **Redirects**: Existing legacy ID→EN redirects in `next.config.ts` are correct (301 permanent) and preserved.
- **404 handling**: Room detail already calls `notFound()` for unknown slugs. Next.js default `not-found` applies.

### Heading hierarchy & semantic HTML
- Each public page has exactly one `<h1>`. Verified: home ("Darajat Garut"), rooms, room detail (`{room.name}`), facilities, gallery, contact, and each experience page.
- `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>` are already used across pages. Minor `<header>` additions applied where a page intro block was a plain `<div>`.

### Images
- **All public images already use `next/image`** (no raw `<img>`).
- `fill` + `sizes` are set; `priority` is applied only to above-the-fold / LCP images (hero, lead gallery, first room photo). Below-the-fold images lazy-load by default.
- Alt text is descriptive and specific (e.g. "Green Hero Darajat, kolam air hangat, dan panorama pegunungan saat senja"), not generic.
- Assets are already `.webp`/`.jpg`. No keyword stuffing found.

### Open Graph / Twitter
- Added globally and per page. OG image defaults to an existing branded asset (`/images/green-hero-resort-sunset.webp`). `og:type`, `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image` all set. Twitter `summary_large_image` card added.

### Structured data
- `Hotel` + `WebSite` JSON-LD on the homepage (name, url, logo, image, address, telephone, email — from centralized NAP; no invented ratings/prices).
- `BreadcrumbList` on internal pages.
- `HotelRoom` on each room detail page (name, description, bed/occupancy from existing room data; **no** price/availability/review injected to avoid fabricated structured data).

### Performance / Core Web Vitals
- Fonts already use `next/font` with `display: swap` (no render-blocking external font CSS).
- SEO-critical text is server-rendered (page content is static HTML in the prerender).
- `next/image` handles responsive sizing and lazy loading. No third-party scripts present. No changes that affect the booking flow.

### Accessibility affecting SEO
- `lang="id"` already set on `<html>`.
- Interactive gallery items have `aria-label`. Breadcrumb `nav` has `aria-label`.

---

## Owner actions required (cannot be done in code)
See `docs/seo-setup.md` for full steps.

1. **Public domain** — set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.greenherodarajat.com`). All canonical/OG/sitemap URLs depend on it. Currently a placeholder.
2. **Verify real NAP** — the contact details in `features/contact/constants/contact-data.ts` look like demo/placeholder values, and the facilities footer previously showed a *different* phone and address. Confirm the single correct business name, address, phone, WhatsApp, and email.
3. **Geo coordinates** — not present in project data. If available, add latitude/longitude to enable `geo` in the Hotel schema and improve local SEO.
4. **Check-in/check-out times** — not present in project data. Add if known to enrich Hotel schema.
5. **Google Search Console** verification + sitemap submission.
6. **Google Business Profile** link to the website.
7. **Analytics** — none present; see events list in `docs/seo-analytics-events.md`.

> No ratings, reviews, stars, prices, availability, distances, or attractions
> were invented. Structured data contains only values present in project data.
