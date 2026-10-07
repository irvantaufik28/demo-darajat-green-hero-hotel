"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Flower2,
  Info,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { celebrationCategories } from "@/features/booking/constants/celebration-packages-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/birthday-celebration.css";

/* ── Static Data ──────────────────────────────────────────── */
const packages = celebrationCategories[0].packages;

const styleItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
    ),
    key: "lighting",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
    ),
    key: "tones",
  },
  {
    icon: <Flower2 size={18} />,
    key: "floral",
  },
  {
    icon: <UtensilsCrossed size={18} />,
    key: "table",
  },
];

const moments = [
  "birthdaySurprise",
  "familyCelebration",
  "anniversaryDinner",
  "smallGathering",
  "intimateCelebration",
];

const addons = [
  { icon: <Star size={22} />, labelKey: "birthdayCelebration.addons.cake" },
  { icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M22 4v16"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>
  ), labelKey: "birthdayCelebration.addons.roomDecoration" },
  { icon: <Flower2 size={22} />, labelKey: "birthdayCelebration.addons.flower" },
  { icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8"/><path d="M4 4h16"/><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4"/></svg>
  ), labelKey: "birthdayCelebration.addons.welcomeDrinks" },
  { icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18"/><path d="M9 21V9"/></svg>
  ), labelKey: "birthdayCelebration.addons.diningSetup" },
  { icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
  ), labelKey: "birthdayCelebration.addons.photoCorner" },
  { icon: <Flame size={22} />, labelKey: "birthdayCelebration.addons.bbqPairing" },
];

const steps = [
  { number: "01", key: "selectPackage" },
  { number: "02", key: "detail" },
  { number: "03", key: "addToReservation" },
];

const editorialHighlights = [
  { num: "01", key: "family" },
  { num: "02", key: "decor" },
  { num: "03", key: "reservation" },
];

/* ── Component ────────────────────────────────────────────── */
export default function BirthdayCelebrationPage() {
  const { t } = useTranslations({ en, id });
  return (
    <div className="bc-page">
      <SiteHeader
        id="bc-header"
        links={interiorLinks}
        activeHref="/experiences/birthday-celebration"
        homeHref="/"
        bookingHref="/rooms"
        contactHref="/contact"
      />

      <main>
        {/* ── 1. HERO ──────────────────────────────────── */}
        <section className="bc-hero" aria-labelledby="bc-title">
          <Image
            src="/images/birthday-outdoor-celebration.jpg"
            alt={t("birthdayCelebration.hero.imageAlt")}
            fill
            priority
            sizes="100vw"
            className="bc-hero-image"
          />
          <div className="bc-hero-shade" aria-hidden="true" />
          <div className="bc-hero-content">
            <div className="bc-container">
              <nav className="bc-hero-breadcrumb" aria-label="Breadcrumb">
                <a href="/">{t("common.breadcrumbHome")}</a>
                <span>/</span>
                <span>{t("common.breadcrumbExperiences")}</span>
                <span>/</span>
                <span aria-current="page">{t("birthdayCelebration.breadcrumbCurrent")}</span>
              </nav>
              <div className="bc-hero-badge">{t("common.experiencesBadge")}</div>
              <h1 id="bc-title">
                {t("birthdayCelebration.hero.title")}
              </h1>
              <p>
                {t("birthdayCelebration.hero.description")}
              </p>
              <div className="bc-hero-actions">
                <a href="#pilihan-paket" className="bc-btn-gold">
                  {t("birthdayCelebration.hero.selectPackage")}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a href="/contact" className="bc-btn-outline">
                  {t("birthdayCelebration.hero.askAvailability")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL ─────────────────────────────── */}
        <section className="bc-editorial" aria-labelledby="bc-editorial-title">
          <div className="bc-container">
            <div className="bc-editorial-inner">
              {/* foto kiri */}
              <div className="bc-editorial-photo">
                <Image
                  src="/images/birthday-room-decor.webp"
                  alt={t("birthdayCelebration.editorial.photoAlt")}
                  fill
                  sizes="(max-width: 1023px) 100vw, 580px"
                />
                <div className="bc-editorial-chip" aria-hidden="true">
                  <div className="bc-editorial-chip-text">
                    <span>{t("birthdayCelebration.editorial.chipLabel")}</span>
                    <strong>{t("birthdayCelebration.editorial.chipTitle")}</strong>
                  </div>
                  <Sparkles size={26} />
                </div>
              </div>

              {/* copy kanan */}
              <div className="bc-editorial-copy">
                <span className="bc-eyebrow">{t("birthdayCelebration.editorial.eyebrow")}</span>
                <h2 id="bc-editorial-title">
                  {t("birthdayCelebration.editorial.title")}
                </h2>
                <p>
                  {t("birthdayCelebration.editorial.description")}
                </p>
                <div className="bc-highlights">
                  {editorialHighlights.map((item) => (
                    <div key={item.num} className="bc-highlight-item">
                      <span>{item.num}</span>
                      <div>
                        <h3>{t(`birthdayCelebration.editorial.highlights.${item.key}.title`)}</h3>
                        <p>{t(`birthdayCelebration.editorial.highlights.${item.key}.description`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#pilihan-paket" className="bc-editorial-link">
                  {t("birthdayCelebration.editorial.link")}
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ──────────────────────────────── */}
        <section
          className="bc-packages"
          id="pilihan-paket"
          aria-labelledby="bc-packages-title"
        >
          <div className="bc-container">
            <div className="bc-section-heading">
              <span className="bc-eyebrow is-center">{t("birthdayCelebration.packages.eyebrow")}</span>
              <h2 id="bc-packages-title">{t("birthdayCelebration.packages.title")}</h2>
              <p>
                {t("birthdayCelebration.packages.description")}
              </p>
            </div>

            <div className="bc-packages-grid">
              {packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`bc-package-card${pkg.popular ? " is-popular" : ""}`}
                >
                  {pkg.popular && (
                    <div className="bc-popular-badge" aria-label={t("common.popularBadge")}>
                      {t("common.popularBadge")}
                    </div>
                  )}
                  <div className="bc-package-header">
                    <span className="bc-package-capacity">{pkg.capacity}</span>
                    <span aria-hidden="true"><Sparkles size={20} /></span>
                  </div>
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className="bc-package-price">
                    <small>{t("birthdayCelebration.packages.priceLabel")}</small>
                    <div className="bc-price-row">
                      <strong>Rp{pkg.price.toLocaleString("id-ID")}</strong>
                      <span>{t("common.pricePerPackage")}</span>
                    </div>
                  </div>
                  <span className="bc-inclusions-label">{t("birthdayCelebration.packages.inclusionsLabel")}</span>
                  <ul className="bc-inclusions" aria-label={pkg.name}>
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="bc-inclusion-item">
                        <CheckCircle2 size={14} />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="bc-packages-note" role="note">
              <Info size={20} />
              <p>
                {t("birthdayCelebration.packages.note")}
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. DESIGN STYLE ───────────────────────────── */}
        <section className="bc-style" aria-labelledby="bc-style-title">
          <div className="bc-container">
            <div className="bc-style-inner">
              <div className="bc-style-copy">
                <span className="bc-eyebrow">{t("birthdayCelebration.style.eyebrow")}</span>
                <h2 id="bc-style-title">
                  {t("birthdayCelebration.style.title")}
                </h2>
                <p>
                  {t("birthdayCelebration.style.description")}
                </p>
                <div className="bc-style-grid">
                  {styleItems.map((item) => (
                    <div key={item.key} className="bc-style-item">
                      <div className="bc-style-icon" aria-hidden="true">
                        {item.icon}
                      </div>
                      <div>
                        <h4>{t(`birthdayCelebration.style.items.${item.key}.title`)}</h4>
                        <p>{t(`birthdayCelebration.style.items.${item.key}.description`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bc-style-photo">
                <Image
                  src="/images/birthday-room-decor.webp"
                  alt={t("birthdayCelebration.style.photoAlt")}
                  fill
                  sizes="(max-width: 1023px) 100vw, 480px"
                />
                <div className="bc-style-photo-label" aria-hidden="true">
                  {t("birthdayCelebration.style.photoLabel")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. MOMEN CHIPS ───────────────────────────── */}
        <section className="bc-moments" aria-labelledby="bc-moments-title">
          <div className="bc-container">
            <div className="bc-moments-inner">
              <h3 id="bc-moments-title">{t("birthdayCelebration.moments.title")}</h3>
              <div className="bc-moments-chips">
                {moments.map((m) => (
                  <span key={m}>{t(`birthdayCelebration.moments.items.${m}`)}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. ADD-ONS ────────────────────────────────── */}
        <section className="bc-addons" aria-labelledby="bc-addons-title">
          <div className="bc-container">
            <div className="bc-section-heading">
              <span className="bc-eyebrow is-center">{t("birthdayCelebration.addons.eyebrow")}</span>
              <h2 id="bc-addons-title">{t("birthdayCelebration.addons.title")}</h2>
              <p>
                {t("birthdayCelebration.addons.description")}
              </p>
            </div>
            <div className="bc-addons-grid">
              {addons.map((addon) => (
                <div key={addon.labelKey} className="bc-addon-item">
                  <div className="bc-addon-icon" aria-hidden="true">
                    {addon.icon}
                  </div>
                  <strong>{t(addon.labelKey)}</strong>
                  <span>{t("birthdayCelebration.addons.subLabel")}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. CINEMATIC BREAK ───────────────────────── */}
        <section className="bc-cinematic" aria-labelledby="bc-cinematic-title">
          <Image
            src="/images/misty-valley.webp"
            alt={t("birthdayCelebration.cinematic.imageAlt")}
            fill
            sizes="100vw"
            className="bc-cinematic-image"
          />
          <div className="bc-cinematic-overlay" aria-hidden="true" />
          <div className="bc-cinematic-content">
            <span className="bc-cinematic-eyebrow">{t("birthdayCelebration.cinematic.eyebrow")}</span>
            <h2 id="bc-cinematic-title">{t("birthdayCelebration.cinematic.title")}</h2>
            <p>
              {t("birthdayCelebration.cinematic.description")}
            </p>
          </div>
        </section>

        {/* ── 8. HOW TO ORDER ───────────────────────────── */}
        <section className="bc-how-to" id="cara-pesan" aria-labelledby="bc-howto-title">
          <div className="bc-container">
            <div className="bc-section-heading">
              <span className="bc-eyebrow is-center">{t("birthdayCelebration.howTo.eyebrow")}</span>
              <h2 id="bc-howto-title">{t("birthdayCelebration.howTo.title")}</h2>
              <p>
                {t("birthdayCelebration.howTo.description")}
              </p>
            </div>
            <div className="bc-steps">
              {steps.map((step) => (
                <div key={step.number} className="bc-step">
                  <span className="bc-step-number" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3>{t(`birthdayCelebration.howTo.steps.${step.key}.title`)}</h3>
                  <p>{t(`birthdayCelebration.howTo.steps.${step.key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CTA ────────────────────────────────────── */}
        <section className="bc-cta" aria-labelledby="bc-cta-title">
          <div className="bc-container">
            <div className="bc-cta-card">
              <div className="bc-cta-inner">
                <span className="bc-cta-eyebrow">{t("birthdayCelebration.cta.eyebrow")}</span>
                <h2 id="bc-cta-title">
                  {t("birthdayCelebration.cta.title")}
                </h2>
                <p>
                  {t("birthdayCelebration.cta.description")}
                </p>
                <div className="bc-cta-actions">
                  <a href="/rooms" className="bc-cta-btn-white">
                    <CalendarCheck size={17} />
                    {t("birthdayCelebration.cta.bookRoom")}
                  </a>
                  <a href="/#experiences" className="bc-cta-btn-glass">
                    {t("birthdayCelebration.cta.viewOther")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <ExperienceFooter activeHref="/experiences/birthday-celebration" />
    </div>
  );
}
