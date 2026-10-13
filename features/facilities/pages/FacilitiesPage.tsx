"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import { DarajatFooter, DarajatHeader } from "@/features/home/components/DarajatHeader";
import { featuredFacilities, hotelServices, roomFacilities } from "@/features/facilities/constants/facilities-data";
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
export default function FacilitiesPage() {
  const { t } = useTranslations({ en, id });
  return (
    <div className="dp-home facilities-page">
      <DarajatHeader interior solid bookingHref="/rooms" />
      <main>
        <section className="facilities-hero" aria-labelledby="facilities-title">
          <Image src="/images/hero/darajat-pass-hero-03.png" alt={t("hero.imageAlt")} fill priority sizes="100vw" />
          <div className="facilities-hero-shade" />
          <div className="facilities-hero-content"><nav aria-label="Breadcrumb"><Link href="/">{t("breadcrumb.home")}</Link><span>/</span><span aria-current="page">{t("breadcrumb.current")}</span></nav><span className="facilities-eyebrow">{t("hero.eyebrow")}</span><h1 id="facilities-title">{t("hero.title")}</h1><p>{t("hero.description")}</p></div>
        </section>

        <div className="facilities-container facilities-highlights">
          {featuredFacilities.map((facility, index) => { const base = `featured.${facility.id}`; const keys = featuredFeatureKeys[facility.id] ?? []; return <section id={facility.id} key={facility.id} className={`facilities-feature${index % 2 ? " is-reversed" : ""}`} aria-labelledby={`facility-${facility.id}`}><div className="facilities-feature-photo"><Image src={facility.image} alt={t(`${base}.imageAlt`)} fill sizes="(max-width: 1023px) 100vw, 680px" /></div><div className="facilities-feature-copy"><span className="facilities-eyebrow">{t(`${base}.eyebrow`)}</span><h2 id={`facility-${facility.id}`}>{t(`${base}.title`)}</h2><p>{t(`${base}.description`)}</p><div className={`facilities-feature-list${facility.compact ? " is-compact" : ""}`}>{facility.features.map(({ icon: Icon }, featureIndex) => { const featureKey = keys[featureIndex]; const flat = facility.id === "pools"; const titleKey = flat ? `${base}.features.${featureKey}` : `${base}.features.${featureKey}.title`; const descKey = flat ? undefined : `${base}.features.${featureKey}.description`; return <div key={featureKey}><span className={`facilities-feature-icon${facility.id === "dining" ? " has-background" : ""}`}><Icon size={23} /></span><div><h3>{t(titleKey)}</h3>{descKey && <p>{t(descKey)}</p>}</div></div>; })}</div>{facility.note && <div className="facilities-note"><Info size={19} /><p><strong>{t("noteLabel")}</strong> {t(`${base}.note`)}</p></div>}</div></section>; })}
        </div>

        <section className="facilities-services" aria-labelledby="facilities-services-title"><div className="facilities-container"><div className="facilities-section-heading is-centered"><span className="facilities-eyebrow">{t("services.eyebrow")}</span><h2 id="facilities-services-title">{t("services.title")}</h2><p>{t("services.description")}</p></div><div className="facilities-service-grid">{hotelServices.map(({ icon: Icon }, index) => { const base = `services.items.${serviceKeys[index]}`; return <article key={serviceKeys[index]} className="facilities-service-card"><div><span className="facilities-service-icon"><Icon size={26} /></span><h3>{t(`${base}.title`)}</h3><p>{t(`${base}.description`)}</p></div><span className="facilities-service-note"><CheckCircle2 size={16} />{t(`${base}.note`)}</span></article>; })}</div></div></section>

        <section className="facilities-container facilities-room-section" aria-labelledby="facilities-room-title"><div className="facilities-section-heading"><span className="facilities-eyebrow">{t("rooms.eyebrow")}</span><h2 id="facilities-room-title">{t("rooms.title")}</h2><p>{t("rooms.description")}</p></div><div className="facilities-room-grid">{roomFacilities.map(({ icon: Icon, limited }, index) => { const base = `rooms.items.${roomKeys[index]}`; return <article key={roomKeys[index]} className="facilities-room-card"><span className="facilities-room-icon"><Icon size={23} /></span><div><h3>{t(`${base}.title`)}</h3><p>{t(`${base}.description`)}</p><span className={`facilities-availability${limited ? " is-limited" : ""}`}>{t(`${base}.availability`)}</span></div></article>; })}</div><div className="facilities-note facilities-availability-note"><Info size={22} /><p>{t("rooms.note")}</p></div></section>

        <section className="facilities-container facilities-experiences"><div><span className="facilities-eyebrow">{t("experiencesCta.eyebrow")}</span><h2>{t("experiencesCta.title")}</h2><p>{t("experiencesCta.description")}</p><Link className="button facilities-outline-button" href="/#experiences">{t("experiencesCta.button")} <ArrowRight size={18} /></Link></div></section>

      </main>

      <DarajatFooter />
    </div>
  );
}
