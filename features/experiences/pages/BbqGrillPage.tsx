"use client";

import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { foodCategories } from "@/features/booking/constants/food-packages-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/bbq-grill.css";

/* ── Data ─────────────────────────────────────────────────── */
const grillCategory = foodCategories.find((c) => c.id === "grill")!;

const editorialHighlights = [
  { number: "01", key: "family" },
  { number: "02", key: "prepared" },
  { number: "03", key: "mountain" },
];

const bentoCategories = [
  {
    number: "01",
    key: "meat",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
    ),
    items: [
      { name: "Beef Shortplate (US Cut)", note: "Slice 1.5mm" },
      { name: "Saikoro Beef Cubes", note: "Meltique Cut" },
      { name: "Marinated Spicy Beef", note: "Signature Rub" },
      { name: "Fresh Chicken Fillet", note: "Herb Infused" },
    ],
  },
  {
    number: "02",
    key: "sides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>
    ),
    items: [
      { name: "Jumbo Smoked Beef Sausage", note: "Bratwurst" },
      { name: "Fishball & Seafood Tofu", note: "Olahan Segar" },
      { name: "Jagung Manis & Selada Segar", note: "Lokal Garut" },
      { name: "Jamur Enoki & Champignon", note: "Fresh Cut" },
    ],
  },
  {
    number: "03",
    key: "sauces",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/></svg>
    ),
    items: [
      { name: "Bumbu Oles Manis Gurih Khas Sunda", note: "Chef's Signature", isSignature: true },
      { name: "Saus BBQ Smokey Black Pepper", note: "Western Taste" },
      { name: "Garlic Sesame Oil Dipping", note: "Savoury" },
      { name: "Sambal Kecap Rawit & Jeruk Limau", note: "Pedas Segar" },
    ],
  },
];

const addons = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
    ),
    labelKey: "bbqGrill.addons.additionalBeef",
    subKey: "bbqGrill.addons.additionalBeefSub",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
    ),
    labelKey: "bbqGrill.addons.additionalChicken",
    subKey: "bbqGrill.addons.additionalChickenSub",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
    ),
    labelKey: "bbqGrill.addons.mixedSeafood",
    subKey: "bbqGrill.addons.mixedSeafoodSub",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/><path d="M2 12h20"/><path d="M12 12v10"/></svg>
    ),
    labelKey: "bbqGrill.addons.extraVegetables",
    subKey: "bbqGrill.addons.extraVegetablesSub",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
    ),
    labelKey: "bbqGrill.addons.hotpot",
    subKey: "bbqGrill.addons.hotpotSub",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    labelKey: "bbqGrill.addons.additionalServing",
    subKey: "bbqGrill.addons.additionalServingSub",
  },
];

const steps = [
  { number: "01", key: "selectPackage" },
  { number: "02", key: "schedule" },
  { number: "03", key: "addToReservation" },
];

/* ── Component ────────────────────────────────────────────── */
export default function BbqGrillPage() {
  const { t } = useTranslations({ en, id });
  return (
    <div className="bbq-page">
      {/* ── Header ──────────────────────────────────────── */}
      <SiteHeader
        id="bbq-header"
        links={interiorLinks}
        activeHref="/experiences/bbq-grill"
        homeHref="/"
        bookingHref="/rooms"
        contactHref="/contact"
      />

      <main>
        {/* ── 1. HERO ──────────────────────────────────── */}
        <section className="bbq-hero" aria-labelledby="bbq-title">
          <Image
            src="/images/bbq-grill.webp"
            alt={t("bbqGrill.hero.imageAlt")}
            fill
            priority
            sizes="100vw"
            className="bbq-hero-image"
          />
          <div className="bbq-hero-shade" aria-hidden="true" />
          <div className="bbq-hero-content">
            <div className="bbq-container">
              <nav className="bbq-hero-breadcrumb" aria-label="Breadcrumb">
                <a href="/">{t("common.breadcrumbHome")}</a>
                <span>/</span>
                <span>{t("common.breadcrumbExperiences")}</span>
                <span>/</span>
                <span aria-current="page">{t("bbqGrill.breadcrumbCurrent")}</span>
              </nav>
              <div className="bbq-hero-badge">{t("common.experiencesBadge")}</div>
              <h1 id="bbq-title">
                {t("bbqGrill.hero.title")}
              </h1>
              <p>
                {t("bbqGrill.hero.description")}
              </p>
              <div className="bbq-hero-actions">
                <a href="#pilihan-paket" className="bbq-btn-primary">
                  {t("bbqGrill.hero.selectPackage")}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </a>
                <a href="#cara-pesan" className="bbq-btn-outline">
                  {t("bbqGrill.hero.checkAvailability")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL ─────────────────────────────── */}
        <section className="bbq-editorial" aria-labelledby="bbq-editorial-title">
          <div className="bbq-container">
            <div className="bbq-editorial-inner">
              {/* foto kiri */}
              <div className="bbq-editorial-photo">
                <Image
                  src="/images/bbq-grill.webp"
                  alt={t("bbqGrill.editorial.photoAlt")}
                  fill
                  sizes="(max-width: 1023px) 100vw, 580px"
                />
                <div className="bbq-editorial-chip" aria-hidden="true">
                  <div className="bbq-editorial-chip-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>
                  </div>
                  <div>
                    <strong>{t("bbqGrill.editorial.chipTitle")}</strong>
                    <span>{t("bbqGrill.editorial.chipSubtitle")}</span>
                  </div>
                </div>
              </div>

              {/* copy kanan */}
              <div className="bbq-editorial-copy">
                <span className="bbq-eyebrow">{t("bbqGrill.editorial.eyebrow")}</span>
                <h2 id="bbq-editorial-title">
                  {t("bbqGrill.editorial.title")}
                </h2>
                <p>
                  {t("bbqGrill.editorial.description")}
                </p>
                <div className="bbq-numbered-list">
                  {editorialHighlights.map((item) => (
                    <div key={item.number} className="bbq-numbered-item">
                      <span>{item.number}</span>
                      <div>
                        <h3>{t(`bbqGrill.editorial.highlights.${item.key}.title`)}</h3>
                        <p>{t(`bbqGrill.editorial.highlights.${item.key}.description`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#pilihan-paket" className="bbq-editorial-link">
                  {t("bbqGrill.editorial.link")}
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ──────────────────────────────── */}
        <section
          className="bbq-packages"
          id="pilihan-paket"
          aria-labelledby="bbq-packages-title"
        >
          <div className="bbq-container">
            <div className="bbq-section-heading">
              <span className="bbq-eyebrow" style={{ justifyContent: "center" }}>{t("bbqGrill.packages.eyebrow")}</span>
              <h2 id="bbq-packages-title">{t("bbqGrill.packages.title")}</h2>
              <p>
                {t("bbqGrill.packages.description")}
              </p>
            </div>

            <div className="bbq-packages-grid">
              {grillCategory.packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`bbq-package-card${pkg.popular ? " is-popular" : ""}`}
                >
                  {pkg.popular && (
                    <div className="bbq-package-popular-badge" aria-label={t("common.popularBadge")}>
                      {t("common.popularBadge")}
                    </div>
                  )}
                  <div className="bbq-package-header">
                    <span className="bbq-package-tag">
                      {pkg.id === "grill-highland"
                        ? t("bbqGrill.packages.tagHighland")
                        : pkg.id === "grill-family"
                        ? t("bbqGrill.packages.tagFamily")
                        : t("bbqGrill.packages.tagGrand")}
                    </span>
                    <div className="bbq-package-guests">
                      <Users size={15} />
                      {pkg.capacity}
                    </div>
                  </div>

                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>

                  <div className="bbq-package-price">
                    <small>{t("bbqGrill.packages.priceLabel")}</small>
                    <div className="bbq-package-price-row">
                      <strong>Rp{pkg.price.toLocaleString("id-ID")}</strong>
                      <span>{t("common.pricePerPackage")}</span>
                    </div>
                  </div>

                  <span className="bbq-inclusions-label">{t("common.inclusionsLabel")}</span>
                  <ul className="bbq-inclusions" aria-label={pkg.name}>
                    {pkg.inclusions.map((inc, idx) => (
                      <li
                        key={inc}
                        className={`bbq-inclusion-item${idx === 0 && pkg.popular ? " is-featured" : ""}`}
                      >
                        <CheckCircle2 size={15} />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="bbq-packages-note" role="note">
              <Info size={20} />
              <p>
                {t("bbqGrill.packages.note")}
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. BAHAN & OLAHAN ─────────────────────────── */}
        <section className="bbq-table" aria-labelledby="bbq-table-title">
          <div className="bbq-container">
            <div className="bbq-table-header">
              <div>
                <span className="bbq-eyebrow">{t("bbqGrill.ingredients.eyebrow")}</span>
                <h2 id="bbq-table-title">{t("bbqGrill.ingredients.title")}</h2>
                <p>
                  {t("bbqGrill.ingredients.description")}
                </p>
              </div>
              <div className="bbq-table-badge">
                <ShieldCheck size={16} />
                {t("bbqGrill.ingredients.badge")}
              </div>
            </div>

            <div className="bbq-bento-grid">
              {bentoCategories.map((cat) => (
                <div key={cat.number} className="bbq-bento-card">
                  <div className="bbq-bento-icon" aria-hidden="true">
                    {cat.icon}
                  </div>
                  <span className="bbq-eyebrow is-gold">{t("bbqGrill.ingredients.categoryLabel", { number: cat.number })}</span>
                  <h3>{t(`bbqGrill.ingredients.${cat.key}.title`)}</h3>
                  <p>{t(`bbqGrill.ingredients.${cat.key}.description`)}</p>
                  <div className="bbq-bento-items">
                    {cat.items.map((item) => (
                      <div key={item.name} className="bbq-bento-row">
                        <span>{item.name}</span>
                        <span className={"isSignature" in item && item.isSignature ? "is-signature" : ""}>
                          {item.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. CINEMATIC BREAK ───────────────────────── */}
        <section className="bbq-cinematic" aria-hidden="false">
          <Image
            src="/images/outdoor-dining.webp"
            alt={t("bbqGrill.cinematic.imageAlt")}
            fill
            sizes="100vw"
            className="bbq-cinematic-image"
          />
          <div className="bbq-cinematic-overlay" aria-hidden="true" />
          <div className="bbq-cinematic-content">
            <span className="bbq-cinematic-eyebrow">{t("bbqGrill.cinematic.eyebrow")}</span>
            <blockquote>
              &ldquo;{t("bbqGrill.cinematic.quote")}&rdquo;
            </blockquote>
            <p>
              {t("bbqGrill.cinematic.description")}
            </p>
          </div>
        </section>

        {/* ── 6. LENGKAPI BBQ ───────────────────────────── */}
        <section className="bbq-addons" aria-labelledby="bbq-addons-title">
          <div className="bbq-container">
            <div className="bbq-addons-header">
              <div className="bbq-addons-pill">
                <PlusCircle size={14} />
                {t("bbqGrill.addons.pill")}
              </div>
              <h2 id="bbq-addons-title">{t("bbqGrill.addons.title")}</h2>
              <p>
                {t("bbqGrill.addons.description")}
              </p>
            </div>
            <div className="bbq-addons-grid">
              {addons.map((addon) => (
                <div key={addon.labelKey} className="bbq-addon-item">
                  <div className="bbq-addon-icon" aria-hidden="true">
                    {addon.icon}
                  </div>
                  <strong>{t(addon.labelKey)}</strong>
                  <span>{t(addon.subKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. CARA PESAN ─────────────────────────────── */}
        <section
          className="bbq-how-to"
          id="cara-pesan"
          aria-labelledby="bbq-howto-title"
        >
          <div className="bbq-container">
            <div className="bbq-section-heading">
              <span className="bbq-eyebrow" style={{ justifyContent: "center" }}>{t("bbqGrill.howTo.eyebrow")}</span>
              <h2 id="bbq-howto-title">{t("bbqGrill.howTo.title")}</h2>
              <p>
                {t("bbqGrill.howTo.description")}
              </p>
            </div>
            <div className="bbq-steps">
              {steps.map((step) => (
                <div key={step.number} className="bbq-step">
                  <div className="bbq-step-number" aria-hidden="true">
                    {step.number}
                  </div>
                  <h3>{t(`bbqGrill.howTo.steps.${step.key}.title`)}</h3>
                  <p>{t(`bbqGrill.howTo.steps.${step.key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. CTA ────────────────────────────────────── */}
        <section className="bbq-cta" aria-labelledby="bbq-cta-title">
          <div className="bbq-container">
            <div className="bbq-cta-inner">
              <span className="bbq-cta-eyebrow">{t("bbqGrill.cta.eyebrow")}</span>
              <h2 id="bbq-cta-title">
                {t("bbqGrill.cta.title")}
              </h2>
              <p>
                {t("bbqGrill.cta.description")}
              </p>
              <div className="bbq-cta-actions">
                <a href="/rooms" className="bbq-cta-btn-white">
                  {t("bbqGrill.cta.bookRoom")}
                </a>
                <a href="/#experiences" className="bbq-cta-btn-outline">
                  {t("bbqGrill.cta.viewOther")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <ExperienceFooter activeHref="/experiences/bbq-grill" />
    </div>
  );
}
