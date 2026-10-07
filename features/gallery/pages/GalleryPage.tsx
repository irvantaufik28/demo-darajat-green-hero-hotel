"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Flame, Headphones, Mail, MapPin, MessageCircle, Phone, UtensilsCrossed, Waves, ZoomIn } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { galleryCategories, galleryPhotos, type GalleryCategoryId, type GalleryPhoto } from "@/features/gallery/constants/gallery-data";
import GalleryLightbox from "../components/GalleryLightbox";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/gallery.css";

const photoKeyById: Record<string, string> = {
  "thermal-pools": "thermalPools",
  "vip-suite": "vipSuite",
  "resort-entrance": "resortEntrance",
  "family-suite": "familySuite",
  "tea-landscape": "teaLandscape",
  "restaurant": "restaurant",
  "family-garden": "familyGarden",
  "standard-room": "standardRoom",
  "warm-pool": "warmPool",
  "roast-goat": "roastGoat",
  "satay-grill": "satayGrill",
  "celebration": "celebration",
};

export default function GalleryPage() {
  const { t } = useTranslations({ en, id });
  const [category, setCategory] = useState<GalleryCategoryId>("all");
  const [viewer, setViewer] = useState<{ photos: GalleryPhoto[]; startIndex: number } | null>(null);
  const localizePhoto = (photo: GalleryPhoto): GalleryPhoto => {
    const key = `photos.${photoKeyById[photo.id]}`;
    return {
      ...photo,
      categoryLabel: t(`${key}.categoryLabel`),
      title: t(`${key}.title`),
      caption: t(`${key}.caption`),
      description: photo.description ? t(`${key}.description`) : photo.description,
      alt: t(`${key}.alt`),
    };
  };
  const localizedPhotos = galleryPhotos.map(localizePhoto);
  const localizedCategories = galleryCategories.map((item) => ({ ...item, label: t(`categories.${item.id}`) }));
  const visiblePhotos = category === "all" ? localizedPhotos.slice(3, 9) : localizedPhotos.filter((photo) => photo.category === category);

  function openPhoto(photo: GalleryPhoto, album = localizedPhotos) {
    setViewer({ photos: album, startIndex: album.findIndex((item) => item.id === photo.id) });
  }

  function photoCard(photo: GalleryPhoto, style: "lead" | "stacked" | "grid" | "culinary" = "grid", badge = photo.categoryLabel) {
    return <button type="button" key={photo.id} className={`resort-gallery-photo is-${style}`} onClick={() => openPhoto(photo, style === "grid" && category !== "all" ? visiblePhotos : localizedPhotos)} aria-label={t("zoomLabel", { title: photo.title })} aria-haspopup="dialog"><Image src={photo.image} alt={photo.alt} fill priority={style === "lead"} sizes={style === "lead" ? "(max-width: 767px) 100vw, 790px" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"} /><span className="resort-gallery-photo-overlay"><span className="resort-gallery-photo-badge">{style === "lead" && <Waves size={16} />}{badge}</span><span className="resort-gallery-photo-caption"><span>{style === "lead" && <small>{t("featured.leadSmall")}</small>}{style === "culinary" && <small>{t("culinarySmall")}</small>}<span className="resort-gallery-photo-title">{photo.caption}</span>{photo.description && style !== "stacked" && <span className="resort-gallery-photo-description">{photo.description}</span>}</span><span className="resort-gallery-photo-zoom">{style === "stacked" ? <ArrowUpRight size={21} /> : <ZoomIn size={22} />}</span></span></span></button>;
  }

  return (
    <div className="resort-gallery-page">
      <SiteHeader id="gallery-header" links={interiorLinks} activeHref="/gallery" homeHref="/" bookingHref="/rooms#availability" contactHref="/contact" />
      <main>
        <section className="resort-gallery-intro"><div className="resort-gallery-container"><h1>{t("intro.title")}</h1><p>{t("intro.description")}</p></div></section>
        <section className="resort-gallery-container resort-gallery-featured" aria-label={t("featured.ariaLabel")}>{photoCard(localizedPhotos[0], "lead", t("featured.leadBadge"))}<div className="resort-gallery-stack">{photoCard(localizedPhotos[1], "stacked")}{photoCard(localizedPhotos[2], "stacked", t("featured.stackedBadge"))}</div></section>
        <section className="resort-gallery-container resort-gallery-browse" aria-label={t("browse.ariaLabel")}><div className="resort-gallery-filters" role="group" aria-label={t("browse.filtersGroupLabel")}>{localizedCategories.map((item) => <button type="button" key={item.id} aria-pressed={category === item.id} aria-controls="resort-gallery-grid" className={category === item.id ? "is-active" : ""} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div><p className="sr-only" role="status">{t("browse.status", { count: visiblePhotos.length, category: localizedCategories.find((item) => item.id === category)?.label ?? "" })}</p><div className="resort-gallery-grid" id="resort-gallery-grid">{visiblePhotos.map((photo) => photoCard(photo))}</div></section>
        <section className="resort-gallery-container resort-gallery-experience"><div><Image src="/images/gallery-experience.jpg" alt={t("experienceSection.imageAlt")} fill sizes="(max-width: 767px) 100vw, 1184px" /><div className="resort-gallery-experience-shade" /><div className="resort-gallery-experience-copy"><span className="resort-gallery-eyebrow"><Flame size={16} /> {t("experienceSection.eyebrow")}</span><h2>{t("experienceSection.title")}</h2><p>{t("experienceSection.description")}</p><div><a className="button resort-gallery-light-button" href="/#experiences">{t("experienceSection.button")} <ArrowRight size={18} /></a><span>{t("experienceSection.note")}</span></div></div></div></section>
        <section className="resort-gallery-container resort-gallery-culinary"><div className="resort-gallery-section-heading"><div><span>{t("culinarySection.eyebrow")}</span><h2>{t("culinarySection.title")}</h2></div><p>{t("culinarySection.description")}</p></div><div className="resort-gallery-culinary-grid">{photoCard(localizedPhotos[9], "culinary", t("culinarySection.leadBadge"))}<div className="resort-gallery-stack">{photoCard(localizedPhotos[10], "stacked", t("culinarySection.bbqBadge"))}{photoCard(localizedPhotos[11], "stacked", t("culinarySection.celebrationBadge"))}</div></div></section>
        <section className="resort-gallery-container resort-gallery-booking"><div><span className="resort-gallery-eyebrow">{t("bookingSection.eyebrow")}</span><h2>{t("bookingSection.title")}</h2><p>{t("bookingSection.description")}</p><div><a className="button resort-gallery-light-button" href="/rooms#availability"><CalendarDays size={18} /> {t("bookingSection.checkAvailability")}</a><a className="button resort-gallery-outline-button" href="/rooms">{t("bookingSection.viewRooms")}</a></div></div></section>
      </main>
      <footer className="resort-gallery-footer theme-footer"><div className="resort-gallery-container"><div className="resort-gallery-footer-grid"><div><Brand href="/" /><p>{t("footer.about")}</p><p className="resort-gallery-footer-address"><MapPin size={18} />{t("footer.address")}</p></div><div><h2>{t("footer.navTitle")}</h2><a href="/#about">{t("footer.nav.about")}</a><a href="/rooms">{t("footer.nav.rooms")}</a><a href="/contact">{t("footer.nav.reservationPolicy")}</a><a href="/#location">{t("footer.nav.route")}</a><a href="/contact">{t("footer.nav.contact")}</a><a href="/contact">{t("footer.nav.privacy")}</a></div><div><h2>{t("footer.hoursTitle")}</h2><div className="resort-gallery-footer-hours"><div><Waves size={20} /><span><strong>{t("footer.hours.pool.title")}</strong>{t("footer.hours.pool.value")}</span></div><div><UtensilsCrossed size={20} /><span><strong>{t("footer.hours.restaurant.title")}</strong>{t("footer.hours.restaurant.value")}</span></div><div><Headphones size={20} /><span><strong>{t("footer.hours.frontDesk.title")}</strong>{t("footer.hours.frontDesk.value")}</span></div></div></div><div><h2>{t("footer.contactTitle")}</h2><div className="resort-gallery-footer-contact"><span><Phone size={20} />{t("footer.phone")}</span><span><Mail size={20} />{t("footer.email")}</span></div><a className="button button-primary" href="/contact"><MessageCircle size={16} /> {t("footer.contactButton")}</a></div></div><div className="resort-gallery-footer-bottom"><span>{t("footer.copyright")}</span><div><a href="/contact">{t("footer.bottom.terms")}</a><a href="/contact">{t("footer.bottom.privacy")}</a><a href="/">{t("footer.bottom.sitemap")}</a></div></div></div></footer>
      {viewer && <GalleryLightbox photos={viewer.photos} startIndex={viewer.startIndex} onClose={() => setViewer(null)} />}
    </div>
  );
}
