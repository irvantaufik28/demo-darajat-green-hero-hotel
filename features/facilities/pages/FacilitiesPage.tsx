"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Info, Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { facilityHours, featuredFacilities, hotelServices, roomFacilities } from "@/features/facilities/constants/facilities-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/facilities.css";

const featuredFeatureKeys: Record<string, string[]> = {
  pools: ["outdoorPool", "warmPool", "hotTub", "kidsPool"],
  dining: ["restaurant", "breakfast", "roomService"],
  family: ["friendly", "kidsPool", "garden"],
  connectivity: ["parking", "wifi", "roomWifi"],
};
const serviceKeys = ["frontDesk", "housekeeping", "luggage", "roomService"];
const roomKeys = ["bathroom", "shower", "bathtub", "minibar", "refrigerator", "kitchenette"];
const hourKeys = ["pool", "restaurant", "frontDesk"];

export default function FacilitiesPage() {
  const { t } = useTranslations({ en, id });
  return (
    <div className="facilities-page">
      <SiteHeader id="facilities-header" links={interiorLinks} activeHref="/facilities" homeHref="/" bookingHref="/rooms#availability" contactHref="/contact" />
      <main>
        <section className="facilities-hero" aria-labelledby="facilities-title">
          <Image src="/images/green-hero-resort-sunset.webp" alt={t("hero.imageAlt")} fill priority sizes="100vw" />
          <div className="facilities-hero-shade" />
          <div className="facilities-hero-content"><nav aria-label="Breadcrumb"><a href="/">{t("breadcrumb.home")}</a><span>/</span><span aria-current="page">{t("breadcrumb.current")}</span></nav><span className="facilities-eyebrow">{t("hero.eyebrow")}</span><h1 id="facilities-title">{t("hero.title")}</h1><p>{t("hero.description")}</p></div>
        </section>

        <div className="facilities-container facilities-highlights">
          {featuredFacilities.map((facility, index) => { const base = `featured.${facility.id}`; const keys = featuredFeatureKeys[facility.id] ?? []; return <section id={facility.id} key={facility.id} className={`facilities-feature${index % 2 ? " is-reversed" : ""}`} aria-labelledby={`facility-${facility.id}`}><div className="facilities-feature-photo"><Image src={facility.image} alt={t(`${base}.imageAlt`)} fill sizes="(max-width: 1023px) 100vw, 680px" /></div><div className="facilities-feature-copy"><span className="facilities-eyebrow">{t(`${base}.eyebrow`)}</span><h2 id={`facility-${facility.id}`}>{t(`${base}.title`)}</h2><p>{t(`${base}.description`)}</p><div className={`facilities-feature-list${facility.compact ? " is-compact" : ""}`}>{facility.features.map(({ icon: Icon }, featureIndex) => { const featureKey = keys[featureIndex]; const flat = facility.id === "pools"; const titleKey = flat ? `${base}.features.${featureKey}` : `${base}.features.${featureKey}.title`; const descKey = flat ? undefined : `${base}.features.${featureKey}.description`; return <div key={featureKey}><span className={`facilities-feature-icon${facility.id === "dining" ? " has-background" : ""}`}><Icon size={23} /></span><div><h3>{t(titleKey)}</h3>{descKey && <p>{t(descKey)}</p>}</div></div>; })}</div>{facility.note && <div className="facilities-note"><Info size={19} /><p><strong>{t("noteLabel")}</strong> {t(`${base}.note`)}</p></div>}</div></section>; })}
        </div>

        <section className="facilities-services" aria-labelledby="facilities-services-title"><div className="facilities-container"><div className="facilities-section-heading is-centered"><span className="facilities-eyebrow">{t("services.eyebrow")}</span><h2 id="facilities-services-title">{t("services.title")}</h2><p>{t("services.description")}</p></div><div className="facilities-service-grid">{hotelServices.map(({ icon: Icon }, index) => { const base = `services.items.${serviceKeys[index]}`; return <article key={serviceKeys[index]} className="facilities-service-card"><div><span className="facilities-service-icon"><Icon size={26} /></span><h3>{t(`${base}.title`)}</h3><p>{t(`${base}.description`)}</p></div><span className="facilities-service-note"><CheckCircle2 size={16} />{t(`${base}.note`)}</span></article>; })}</div></div></section>

        <section className="facilities-container facilities-room-section" aria-labelledby="facilities-room-title"><div className="facilities-section-heading"><span className="facilities-eyebrow">{t("rooms.eyebrow")}</span><h2 id="facilities-room-title">{t("rooms.title")}</h2><p>{t("rooms.description")}</p></div><div className="facilities-room-grid">{roomFacilities.map(({ icon: Icon, limited }, index) => { const base = `rooms.items.${roomKeys[index]}`; return <article key={roomKeys[index]} className="facilities-room-card"><span className="facilities-room-icon"><Icon size={23} /></span><div><h3>{t(`${base}.title`)}</h3><p>{t(`${base}.description`)}</p><span className={`facilities-availability${limited ? " is-limited" : ""}`}>{t(`${base}.availability`)}</span></div></article>; })}</div><div className="facilities-note facilities-availability-note"><Info size={22} /><p>{t("rooms.note")}</p></div></section>

        <section className="facilities-container facilities-experiences"><div><span className="facilities-eyebrow">{t("experiencesCta.eyebrow")}</span><h2>{t("experiencesCta.title")}</h2><p>{t("experiencesCta.description")}</p><a className="button facilities-outline-button" href="/#experiences">{t("experiencesCta.button")} <ArrowRight size={18} /></a></div></section>

        <section className="facilities-booking-cta"><div className="facilities-container"><h2>{t("bookingCta.title")}</h2><p>{t("bookingCta.description")}</p><div><a className="button facilities-booking-button" href="/rooms#availability">{t("bookingCta.checkAvailability")}</a><a className="button facilities-contact-button" href="/contact">{t("bookingCta.contactReservation")}</a></div></div></section>
      </main>

      <footer className="facilities-footer theme-footer"><div className="facilities-container"><div className="facilities-footer-grid"><div className="facilities-footer-about"><Brand href="/" /><p>{t("footer.about")}</p><div className="facilities-footer-contact"><span><MapPin size={18} />{t("footer.address")}</span><span><Phone size={18} />{t("footer.phone")}</span><span><Mail size={18} />{t("footer.email")}</span></div></div><div><h2>{t("footer.navTitle")}</h2><a href="/#about">{t("footer.nav.about")}</a><a href="/rooms">{t("footer.nav.rooms")}</a><a href="/contact">{t("footer.nav.reservationPolicy")}</a><a href="/#location">{t("footer.nav.route")}</a><a href="/contact">{t("footer.nav.contact")}</a><a href="/contact">{t("footer.nav.privacy")}</a></div><div><h2>{t("footer.hoursTitle")}</h2><div className="facilities-hours">{facilityHours.map((_, index) => <div key={hourKeys[index]}><strong>{t(`footer.hours.${hourKeys[index]}.title`)}</strong><span>{t(`footer.hours.${hourKeys[index]}.hours`)}</span></div>)}</div></div></div><div className="facilities-footer-bottom"><span>{t("footer.copyright")}</span><div><a href="/contact">{t("footer.bottom.terms")}</a><a href="/contact">{t("footer.bottom.privacy")}</a><a href="/">{t("footer.bottom.sitemap")}</a></div></div></div></footer>
    </div>
  );
}
