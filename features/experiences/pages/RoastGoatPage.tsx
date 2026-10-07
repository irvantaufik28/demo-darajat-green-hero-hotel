"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Info, Users } from "lucide-react";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { foodCategories } from "@/features/booking/constants/food-packages-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/roast-goat.css";

const roastGoat = foodCategories.find((c) => c.id === "roast-goat")!;

const moments = [
  { labelKey: "roastGoat.experience.moments.familyDinner", emoji: "🏠" },
  { labelKey: "roastGoat.experience.moments.gathering", emoji: "👥" },
  { labelKey: "roastGoat.experience.moments.birthday", emoji: "🎂" },
  { labelKey: "roastGoat.experience.moments.celebration", emoji: "🎉" },
];

const steps = [
  { number: "01", key: "selectPackage" },
  { number: "02", key: "schedule" },
  { number: "03", key: "addToReservation" },
];

export default function RoastGoatPage() {
  const { t } = useTranslations({ en, id });
  return (
    <div className="kg-page">
      <SiteHeader
        id="kg-header"
        links={interiorLinks}
        activeHref="/experiences/roast-goat"
        homeHref="/"
        bookingHref="/rooms"
        contactHref="/contact"
      />

      <main>
        {/* ── 1. HERO ──────────────────────────────────── */}
        <section className="kg-hero" aria-labelledby="kg-title">
          <Image
            src="/images/kambing-guling.webp"
            alt={t("roastGoat.hero.imageAlt")}
            fill
            priority
            sizes="100vw"
            className="kg-hero-image"
          />
          <div className="kg-hero-shade" aria-hidden="true" />
          <div className="kg-hero-content">
            <div className="kg-container">
              <nav className="kg-hero-breadcrumb" aria-label="Breadcrumb">
                <a href="/">{t("common.breadcrumbHome")}</a>
                <span>/</span>
                <span>{t("common.breadcrumbExperiences")}</span>
                <span>/</span>
                <span aria-current="page">{t("roastGoat.breadcrumbCurrent")}</span>
              </nav>
              <div className="kg-hero-badge">{t("common.experiencesBadge")}</div>
              <h1 id="kg-title">
                {t("roastGoat.hero.title")}
              </h1>
              <p>
                {t("roastGoat.hero.description")}
              </p>
              <div className="kg-hero-actions">
                <a href="#pilihan-paket" className="kg-btn-primary button">{t("roastGoat.hero.selectPackage")}</a>
                <a href="/contact" className="kg-btn-outline button">{t("roastGoat.hero.askAvailability")}</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL ─────────────────────────────── */}
        <section className="kg-editorial" aria-labelledby="kg-editorial-title">
          <div className="kg-container">
            <div className="kg-editorial-inner">
              <div className="kg-editorial-photo">
                <Image
                  src="/images/kambing-guling.webp"
                  alt={t("roastGoat.editorial.photoAlt")}
                  fill
                  sizes="(max-width: 1023px) 100vw, 580px"
                />
                <div className="kg-editorial-chip" aria-hidden="true">
                  {t("roastGoat.editorial.chip")}
                </div>
              </div>
              <div className="kg-editorial-copy">
                <span className="kg-eyebrow">{t("roastGoat.editorial.eyebrow")}</span>
                <h2 id="kg-editorial-title">{t("roastGoat.editorial.title")}</h2>
                <p>
                  {t("roastGoat.editorial.description")}
                </p>
                <div className="kg-features">
                  <div className="kg-feature-item">
                    <div className="kg-feature-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <h3>{t("roastGoat.editorial.features.family.title")}</h3>
                      <p>{t("roastGoat.editorial.features.family.description")}</p>
                    </div>
                  </div>
                  <div className="kg-feature-item">
                    <div className="kg-feature-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>
                    </div>
                    <div>
                      <h3>{t("roastGoat.editorial.features.prepared.title")}</h3>
                      <p>{t("roastGoat.editorial.features.prepared.description")}</p>
                    </div>
                  </div>
                  <div className="kg-feature-item">
                    <div className="kg-feature-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></svg>
                    </div>
                    <div>
                      <h3>{t("roastGoat.editorial.features.reservation.title")}</h3>
                      <p>{t("roastGoat.editorial.features.reservation.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ──────────────────────────────── */}
        <section className="kg-packages" id="pilihan-paket" aria-labelledby="kg-packages-title">
          <div className="kg-container">
            <div className="kg-section-heading">
              <span className="kg-eyebrow" style={{ justifyContent: "center" }}>{t("roastGoat.packages.eyebrow")}</span>
              <h2 id="kg-packages-title">{t("roastGoat.packages.title")}</h2>
              <p>{t("roastGoat.packages.description")}</p>
            </div>
            <div className="kg-packages-grid">
              {roastGoat.packages.map((pkg) => {
                const baseCount = roastGoat.packages[0].inclusions.length;
                return (
                  <article key={pkg.id} className={`kg-package-card${pkg.popular ? " is-popular" : ""}`}>
                    {pkg.popular && (
                      <div className="kg-package-popular-badge" aria-label={t("common.popularBadge")}>{t("common.popularBadge")}</div>
                    )}
                    <div className="kg-package-photo">
                      <Image src="/images/kambing-guling.webp" alt={pkg.name} fill sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                      <div className="kg-package-capacity">{pkg.capacity}</div>
                    </div>
                    <div className="kg-package-body">
                      <h3>{pkg.name}</h3>
                      <p>{pkg.description}</p>
                      <div className="kg-package-price">
                        <small>{t("roastGoat.packages.priceLabel")}</small>
                        <strong>Rp{pkg.price.toLocaleString("id-ID")}</strong>
                      </div>
                      <ul className="kg-inclusions" aria-label={pkg.name}>
                        <li><span className="kg-inclusions-label">{t("roastGoat.packages.inclusionsLabel")}</span></li>
                        {pkg.inclusions.map((inc, idx) => (
                          <li key={inc} className={`kg-inclusion-item${idx >= baseCount ? " is-extra" : ""}`}>
                            <CheckCircle2 size={15} />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="kg-packages-note" role="note">
              <Info size={20} />
              <p><strong>{t("roastGoat.packages.noteLabel")}</strong> {t("roastGoat.packages.note")}</p>
            </div>
          </div>
        </section>

        {/* ── 4. THE EXPERIENCE ─────────────────────────── */}
        <section className="kg-experience" aria-labelledby="kg-experience-title">
          <div className="kg-container">
            <div className="kg-experience-inner">
              <div className="kg-experience-photo-wrap">
                <div className="kg-experience-photo">
                  <Image src="/images/outdoor-dining.webp" alt={t("roastGoat.experience.photoAlt")} fill sizes="(max-width: 1023px) 100vw, 560px" />
                </div>
                <div className="kg-experience-decor" aria-hidden="true" />
              </div>
              <div className="kg-experience-copy">
                <span className="kg-eyebrow">{t("roastGoat.experience.eyebrow")}</span>
                <h2 id="kg-experience-title">{t("roastGoat.experience.title")}</h2>
                <p>{t("roastGoat.experience.description")}</p>
                <div className="kg-moment-grid">
                  {moments.map(({ labelKey, emoji }) => (
                    <div key={labelKey} className="kg-moment-item">
                      <div className="kg-moment-icon" aria-hidden="true">
                        <span style={{ fontSize: "18px" }}>{emoji}</span>
                      </div>
                      <span>{t(labelKey)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. CARA PEMESANAN ─────────────────────────── */}
        <section className="kg-how-to" aria-labelledby="kg-howto-title">
          <div className="kg-container">
            <div className="kg-section-heading">
              <span className="kg-eyebrow" style={{ justifyContent: "center" }}>{t("roastGoat.howTo.eyebrow")}</span>
              <h2 id="kg-howto-title">{t("roastGoat.howTo.title")}</h2>
              <p>{t("roastGoat.howTo.description")}</p>
            </div>
            <div className="kg-steps">
              {steps.map((step) => (
                <div key={step.number} className="kg-step">
                  <div className="kg-step-number" aria-hidden="true">{step.number}</div>
                  <h3>{t(`roastGoat.howTo.steps.${step.key}.title`)}</h3>
                  <p>{t(`roastGoat.howTo.steps.${step.key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. CTA ────────────────────────────────────── */}
        <section className="kg-cta" id="hubungi-kami" aria-labelledby="kg-cta-title">
          <div className="kg-container">
            <div className="kg-cta-inner">
              <span className="kg-eyebrow">{t("roastGoat.cta.eyebrow")}</span>
              <h2 id="kg-cta-title">{t("roastGoat.cta.title")}</h2>
              <p>{t("roastGoat.cta.description")}</p>
              <div className="kg-cta-actions">
                <a href="/rooms" className="kg-cta-btn-white">{t("roastGoat.cta.bookRoom")}</a>
                <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="kg-cta-btn-light">{t("roastGoat.cta.whatsapp")}</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <ExperienceFooter activeHref="/experiences/roast-goat" />
    </div>
  );
}
