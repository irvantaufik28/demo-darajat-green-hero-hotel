"use client";

import Image from "next/image";
import { CheckCircle2, Info, Utensils } from "lucide-react";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { foodCategories } from "@/features/booking/constants/food-packages-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/grilled-chicken.css";

const chickenCategory = foodCategories.find((c) => c.id === "grilled-chicken")!;

const editorialHighlights = [
  { number: "01", key: "together" },
  { number: "02", key: "prepared" },
  { number: "03", key: "sides" },
];

const pendampings = [
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>), key: "grilledChicken" },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>), key: "warmRice" },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>), key: "sambal" },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>), key: "lalapan" },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>), key: "tahuTempe" },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>), key: "vegetables" },
];

const addons = [
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>, labelKey: "grilledChicken.addons.extraChicken", subKey: "grilledChicken.addons.extraChickenSub" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>, labelKey: "grilledChicken.addons.additionalRice", subKey: "grilledChicken.addons.additionalRiceSub" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>, labelKey: "grilledChicken.addons.extraSambal", subKey: "grilledChicken.addons.extraSambalSub" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>, labelKey: "grilledChicken.addons.tahuTempe", subKey: "grilledChicken.addons.tahuTempeSub" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>, labelKey: "grilledChicken.addons.vegetables", subKey: "grilledChicken.addons.vegetablesSub" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, labelKey: "grilledChicken.addons.drinks", subKey: "grilledChicken.addons.drinksSub" },
];

const steps = [
  { number: "01", key: "selectPackage" },
  { number: "02", key: "schedule" },
  { number: "03", key: "addToReservation" },
];

export default function GrilledChickenPage() {
  const { t } = useTranslations({ en, id });
  return (
    <div className="ab-page">
      <SiteHeader
        id="ab-header"
        links={interiorLinks}
        activeHref="/experiences/grilled-chicken"
        homeHref="/"
        bookingHref="/rooms"
        contactHref="/contact"
      />

      <main>
        {/* ── 1. HERO ──────────────────────────────────── */}
        <section className="ab-hero" aria-labelledby="ab-title">
          <Image src="/images/outdoor-dining.webp" alt={t("grilledChicken.hero.imageAlt")} fill priority sizes="100vw" className="ab-hero-image" />
          <div className="ab-hero-shade" aria-hidden="true" />
          <div className="ab-hero-content">
            <nav className="ab-hero-breadcrumb" aria-label="Breadcrumb">
              <a href="/">{t("common.breadcrumbHome")}</a><span>/</span><span>{t("common.breadcrumbExperiences")}</span><span>/</span>
              <span aria-current="page">{t("grilledChicken.breadcrumbCurrent")}</span>
            </nav>
            <div className="ab-hero-badge">{t("common.experiencesBadge")}</div>
            <h1 id="ab-title">{t("grilledChicken.hero.title")}</h1>
            <p>{t("grilledChicken.hero.description")}</p>
            <div className="ab-hero-actions">
              <a href="#pilihan-paket" className="ab-btn-primary">{t("grilledChicken.hero.selectPackage")}</a>
              <a href="#cara-pesan" className="ab-btn-outline">{t("grilledChicken.hero.checkAvailability")}</a>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL ─────────────────────────────── */}
        <section className="ab-editorial" aria-labelledby="ab-editorial-title">
          <div className="ab-container">
            <div className="ab-editorial-inner">
              <div className="ab-editorial-photo">
                <Image src="/images/outdoor-dining.webp" alt={t("grilledChicken.editorial.photoAlt")} fill sizes="(max-width: 1023px) 100vw, 680px" />
                <div className="ab-editorial-chip" aria-hidden="true">
                  <Utensils size={18} />
                  <span>{t("grilledChicken.editorial.chip")}</span>
                </div>
              </div>
              <div className="ab-editorial-copy">
                <span className="ab-eyebrow">{t("grilledChicken.editorial.eyebrow")}</span>
                <h2 id="ab-editorial-title">{t("grilledChicken.editorial.title")}</h2>
                <p>{t("grilledChicken.editorial.description")}</p>
                <div className="ab-numbered-list">
                  {editorialHighlights.map((item) => (
                    <div key={item.number} className="ab-numbered-item">
                      <span>{item.number}</span>
                      <div><h3>{t(`grilledChicken.editorial.highlights.${item.key}.title`)}</h3><p>{t(`grilledChicken.editorial.highlights.${item.key}.description`)}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ──────────────────────────────── */}
        <section className="ab-packages" id="pilihan-paket" aria-labelledby="ab-packages-title">
          <div className="ab-container">
            <div className="ab-section-heading">
              <span className="ab-eyebrow is-center">{t("grilledChicken.packages.eyebrow")}</span>
              <h2 id="ab-packages-title">{t("grilledChicken.packages.title")}</h2>
              <p>{t("grilledChicken.packages.description")}</p>
            </div>
            <div className="ab-packages-grid">
              {chickenCategory.packages.map((pkg, idx) => (
                <article key={pkg.id} className={`ab-package-card${pkg.popular ? " is-popular" : ""}`}>
                  {pkg.popular && (
                    <div className="ab-popular-badge" aria-label={t("common.popularBadge")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--gold)" }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      {t("grilledChicken.packages.popularBadge")}
                    </div>
                  )}
                  <div className="ab-package-capacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    {pkg.capacity}
                  </div>
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className="ab-package-price">
                    <div className="ab-price-row">
                      <strong>Rp{pkg.price.toLocaleString("id-ID")}</strong>
                      <span>{t("common.pricePerPackage")}</span>
                    </div>
                  </div>
                  <span className="ab-inclusions-label">{t("common.inclusionsLabel")}</span>
                  <ul className="ab-inclusions" aria-label={pkg.name}>
                    {pkg.inclusions.map((inc, i) => (
                      <li key={inc} className={`ab-inclusion-item${i === 0 ? " is-featured" : ""}`}>
                        <CheckCircle2 size={14} />{inc}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="ab-packages-note" role="note">
              <Info size={20} />
              <p>{t("grilledChicken.packages.note")}</p>
            </div>
          </div>
        </section>

        {/* ── 4. PENDAMPING FAVORIT ─────────────────────── */}
        <section className="ab-pendamping" aria-labelledby="ab-pendamping-title">
          <div className="ab-container">
            <div className="ab-section-heading">
              <span className="ab-eyebrow is-center">{t("grilledChicken.pendamping.eyebrow")}</span>
              <h2 id="ab-pendamping-title">{t("grilledChicken.pendamping.title")}</h2>
              <p>{t("grilledChicken.pendamping.description")}</p>
            </div>
            <div className="ab-pendamping-grid">
              {pendampings.map((item) => (
                <div key={item.key} className="ab-pendamping-card">
                  <div className="ab-pendamping-icon" aria-hidden="true">{item.icon}</div>
                  <h3>{t(`grilledChicken.pendamping.items.${item.key}.title`)}</h3>
                  <p>{t(`grilledChicken.pendamping.items.${item.key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. CINEMATIC BREAK ───────────────────────── */}
        <section className="ab-cinematic" aria-labelledby="ab-cinematic-title">
          <Image src="/images/kambing-guling.webp" alt={t("grilledChicken.cinematic.imageAlt")} fill sizes="100vw" className="ab-cinematic-image" />
          <div className="ab-cinematic-overlay" aria-hidden="true" />
          <div className="ab-cinematic-content">
            <svg className="ab-cinematic-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <blockquote id="ab-cinematic-title">&ldquo;{t("grilledChicken.cinematic.quote")}&rdquo;</blockquote>
            <p>{t("grilledChicken.cinematic.description")}</p>
          </div>
        </section>

        {/* ── 6. TAMBAHKAN SESUAI SELERA ───────────────── */}
        <section className="ab-addons" aria-labelledby="ab-addons-title">
          <div className="ab-container">
            <div className="ab-section-heading">
              <span className="ab-eyebrow is-center">{t("grilledChicken.addons.eyebrow")}</span>
              <h2 id="ab-addons-title">{t("grilledChicken.addons.title")}</h2>
              <p>{t("grilledChicken.addons.description")}</p>
            </div>
            <div className="ab-addons-grid">
              {addons.map((addon) => (
                <div key={addon.labelKey} className="ab-addon-row">
                  <div className="ab-addon-left">
                    <div className="ab-addon-icon" aria-hidden="true">{addon.icon}</div>
                    <div><strong>{t(addon.labelKey)}</strong><span>{t(addon.subKey)}</span></div>
                  </div>
                  <span className="ab-addon-tag">{t("grilledChicken.addons.tag")}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. CARA PESAN ─────────────────────────────── */}
        <section className="ab-how-to" id="cara-pesan" aria-labelledby="ab-howto-title">
          <div className="ab-container">
            <div className="ab-section-heading">
              <span className="ab-eyebrow is-center">{t("grilledChicken.howTo.eyebrow")}</span>
              <h2 id="ab-howto-title">{t("grilledChicken.howTo.title")}</h2>
              <p>{t("grilledChicken.howTo.description")}</p>
            </div>
            <div className="ab-steps">
              {steps.map((step) => (
                <div key={step.number} className="ab-step">
                  <span className="ab-step-number" aria-hidden="true">{step.number}</span>
                  <h3>{t(`grilledChicken.howTo.steps.${step.key}.title`)}</h3>
                  <p>{t(`grilledChicken.howTo.steps.${step.key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. CTA ────────────────────────────────────── */}
        <section className="ab-cta" aria-labelledby="ab-cta-title">
          <div className="ab-container">
            <svg className="ab-cta-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>
            <h2 id="ab-cta-title">{t("grilledChicken.cta.title")}</h2>
            <p>{t("grilledChicken.cta.description")}</p>
            <div className="ab-cta-actions">
              <a href="/rooms" className="ab-cta-btn-white">{t("grilledChicken.cta.bookRoom")}</a>
              <a href="/#experiences" className="ab-cta-btn-outline">{t("grilledChicken.cta.viewOther")}</a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <ExperienceFooter activeHref="/experiences/grilled-chicken" />
    </div>
  );
}
