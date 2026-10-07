"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  Mail,
  Map,
  MapPin,
  Mountain,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { formatRoomPrice, getRoom, rooms } from "@/features/rooms/constants/rooms-data";
import "../styles/detail.css";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

type RoomDetailPageProps = {
  roomId: string;
  initialCheckIn: string;
  initialCheckOut: string;
};

const validDate = /^\d{4}-\d{2}-\d{2}$/;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatStayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

function getNightCount(checkIn: string, checkOut: string) {
  if (!validDate.test(checkIn) || !validDate.test(checkOut)) return 0;
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, Math.round((end - start) / 86400000));
}

export default function RoomDetailPage({ roomId, initialCheckIn, initialCheckOut }: RoomDetailPageProps) {
  const { t } = useTranslations({ en, id });
  const room = getRoom(roomId);
  const hasInitialStay = getNightCount(initialCheckIn, initialCheckOut) > 0;
  const [checkIn, setCheckIn] = useState(hasInitialStay ? initialCheckIn : "2026-10-18");
  const [checkOut, setCheckOut] = useState(hasInitialStay ? initialCheckOut : "2026-10-20");
  const [guests, setGuests] = useState("2 Dewasa, 1 Anak");
  const [editingStay, setEditingStay] = useState(false);
  const [message, setMessage] = useState("");

  if (!room) return null;

  const nights = getNightCount(checkIn, checkOut);
  const relatedRooms = rooms.filter((item) => item.id !== room.id).slice(0, 2);
  const photos = [room.image, room.image, room.image, "/images/green-hero-warm-pool.webp", room.image];
  const bookingHref = `/booking/extras?${new URLSearchParams({ room: room.id, checkIn, checkOut, guests })}`;

  const checkAvailability = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checkIn || !checkOut) {
      setMessage(t("detail.messages.selectDates"));
      return;
    }
    if (checkOut <= checkIn) {
      setMessage(t("detail.messages.checkoutAfterCheckin"));
      return;
    }
    setEditingStay(false);
    setMessage(room.available
      ? t("detail.messages.available")
      : t("detail.messages.unavailable"));
  };

  return (
    <div className="detail-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#availability" contactHref="/contact" />
      <main>
        <nav className="container detail-breadcrumb" aria-label="Breadcrumb"><a href="/">{t("detail.breadcrumbHome")}</a><span>/</span><a href="/rooms">{t("detail.breadcrumbRooms")}</a><span>/</span><span>{room.name}</span></nav>

        <section className="container detail-gallery" id="gallery" aria-label={t("detail.galleryAriaLabel", { name: room.name })}>
          {photos.map((photo, index) => (
            <a key={`${photo}-${index}`} href={photo} target="_blank" rel="noreferrer" className={`detail-gallery-photo detail-gallery-photo-${index + 1}`} aria-label={t("detail.photoLinkAriaLabel", { index: index + 1, name: room.name })}>
              <Image src={photo} alt={index === 0 ? room.imageAlt : t("detail.photoAlt", { name: room.name, index: index + 1 })} fill priority={index === 0} sizes={index === 0 ? "(max-width: 720px) 100vw, 60vw" : "(max-width: 720px) 50vw, 20vw"} />
            </a>
          ))}
          {!room.available && <span className="detail-unavailable-ribbon">{t("detail.unavailableRibbon")}</span>}
          <a className="detail-photo-link" href={room.image} target="_blank" rel="noreferrer">{t("detail.viewPhoto")}</a>
        </section>

        <section className="container detail-content">
          <div className="detail-copy">
            <span className="detail-eyebrow">{room.eyebrow}</span>
            <div className="detail-heading-row"><div><h1>{room.name}</h1><span className="detail-tagline">{room.tagline}</span></div>{!room.available && <span className="detail-status-label">{t("detail.statusUnavailable")}</span>}</div>
            <p className="detail-lead">{room.description}</p>

            <div className="detail-highlights">
              <div><UsersRound size={23} /><span><small>{t("detail.highlights.capacity")}</small><strong>{room.amenities[0].label}</strong></span></div>
              <div><BedDouble size={23} /><span><small>{t("detail.highlights.bed")}</small><strong>{room.amenities[1].label}</strong></span></div>
              <div><Mountain size={23} /><span><small>{t("detail.highlights.ambiance")}</small><strong>{room.feature}</strong></span></div>
              <div><Bath size={23} /><span><small>{t("detail.highlights.resort")}</small><strong>{t("detail.highlights.resortValue")}</strong></span></div>
            </div>

            <section className="detail-copy-section"><h2>{t("detail.aboutTitle")}</h2><p>{room.description}</p><p>{t("detail.aboutExtra")}</p></section>

            <section className="detail-copy-section"><h2>{t("detail.amenitiesTitle")}</h2><div className="detail-amenities">{room.amenities.map(({ icon: Icon, label }) => <span key={label}><Icon size={21} /> {label}</span>)}</div></section>

            <section className="detail-copy-section"><h2>{t("detail.stayInfoTitle")}</h2><div className="detail-stay-info"><div><Clock3 size={21} /><span><strong>{t("detail.stayInfo.checkTimesTitle")}</strong><small>{t("detail.stayInfo.checkTimesDetail")}</small></span></div><div><UsersRound size={21} /><span><strong>{t("detail.stayInfo.capacityTitle")}</strong><small>{room.amenities[0].label}</small></span></div><div><BedDouble size={21} /><span><strong>{t("detail.stayInfo.bedTitle")}</strong><small>{room.amenities[1].label}</small></span></div></div></section>

            <section className="detail-copy-section detail-policy"><h2>{t("detail.cancellationTitle")}</h2><div><ShieldCheck size={24} /><p><strong>{room.cancellationPolicy.summary}</strong><br />{room.cancellationPolicy.description}</p></div></section>
          </div>

          <aside className="detail-booking-card" id="availability" aria-label={t("detail.booking.ariaLabel")}>
            <div className="detail-booking-top"><span className={room.available ? "is-available" : "is-unavailable"}><CheckCircle2 size={17} />{room.available ? t("detail.booking.remainingRooms", { count: room.remainingRooms }) : t("detail.booking.unavailable")}</span><button type="button" onClick={() => setEditingStay(!editingStay)} aria-expanded={editingStay} aria-controls="detail-edit-stay"><CalendarDays size={16} /> {t("detail.booking.edit")}</button></div>
            <div className="detail-booking-price"><small>{room.available ? t("detail.booking.priceFrom") : t("detail.booking.priceReference")}</small><div><strong>{formatRoomPrice(room.price)}</strong><span>{t("detail.booking.perNight")}</span></div></div>
            <p className="detail-booking-included"><CheckCircle2 size={17} /> {t("detail.booking.included")}</p>
            <div className="detail-stay-card"><span className="detail-stay-label">{t("detail.booking.stayLabel")}</span><div className="detail-stay-dates"><CalendarDays size={19} /><div><strong>{formatStayDate(checkIn)} – {formatStayDate(checkOut)}</strong><span>{t("detail.booking.nights", { count: nights })}</span></div></div><div className="detail-stay-meta"><span><UsersRound size={19} /> {guests}</span><span><BedDouble size={19} /> {t("detail.booking.oneRoom", { name: room.name })}</span></div></div>
            {editingStay && <form className="detail-date-form" id="detail-edit-stay" onSubmit={checkAvailability}>
              <label>{t("detail.booking.formCheckIn")}<input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></label>
              <label>{t("detail.booking.formCheckOut")}<input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
              <label className="detail-guest-field">{t("detail.booking.formGuests")}<select value={guests} onChange={(event) => setGuests(event.target.value)}><option value="2 Dewasa, 1 Anak">{t("detail.booking.guestOptions.twoAdultsOneChild")}</option><option value="2 Dewasa">{t("detail.booking.guestOptions.twoAdults")}</option><option value="3 Dewasa">{t("detail.booking.guestOptions.threeAdults")}</option><option value="4 Dewasa">{t("detail.booking.guestOptions.fourAdults")}</option></select></label>
              <button type="submit" className="detail-check-button"><CalendarDays size={18} /> {t("detail.booking.checkAvailability")}</button>
            </form>}
            <div className="detail-price-summary"><div><span>{t("detail.booking.priceSummaryRoom", { nights, price: formatRoomPrice(room.price) })}</span><strong>{formatRoomPrice(room.price * nights)}</strong></div><div><span>{t("detail.booking.priceSummaryTax")}</span><span>{t("detail.booking.priceSummaryTaxIncluded")}</span></div><div className="detail-price-total"><strong>{t("detail.booking.priceSummaryTotal")}</strong><strong>{formatRoomPrice(room.price * nights)}</strong></div></div>
            {!room.available && <div className="detail-date-notice"><CalendarDays size={20} /><p><strong>{t("detail.booking.noticeTitle")}</strong>{t("detail.booking.noticeDetail")}</p></div>}
            {room.available ? <a href={bookingHref} className="button button-primary detail-pick-button">{t("detail.booking.pick")} <ArrowRight size={18} /></a> : <button type="button" className="detail-pick-button detail-pick-unavailable" disabled>{t("detail.booking.pickUnavailable")}</button>}
            <button type="button" className="detail-edit-link" onClick={() => setEditingStay(!editingStay)} aria-expanded={editingStay} aria-controls="detail-edit-stay"><CalendarDays size={17} /> {t("detail.booking.editDatesLink")}</button>
            {message && <p className="detail-result" role="status">{message}</p>}
            <div className="detail-booking-assurances"><span><ShieldCheck size={19} /> {t("detail.booking.assuranceReferencePrice")}</span><span><CalendarDays size={19} /> {room.cancellationPolicy.summary}</span><span><CheckCircle2 size={19} /> {t("detail.booking.assuranceConfirm")}</span></div>
            <button type="button" className="detail-date-prompt" onClick={() => setEditingStay(true)}><span>{t("detail.booking.datePromptQuestion")}<strong>{t("detail.booking.datePromptAction")}</strong></span><ChevronRight size={18} /></button>
            <div className="detail-help">{t("detail.booking.helpQuestion")}<a href="/contact">{t("detail.booking.helpAction")}</a></div>
          </aside>
        </section>

        <section className="detail-extras"><div className="container"><span className="detail-eyebrow">{t("detail.extras.eyebrow")}</span><h2>{t("detail.extras.title")}</h2><p>{t("detail.extras.description")}</p><div className="detail-extra-grid"><article><div className="detail-extra-photo"><Image src="/images/kambing-guling.webp" alt={t("detail.extras.roastGoatTitle")} fill sizes="(max-width: 720px) 100vw, 33vw" /></div><h3>{t("detail.extras.roastGoatTitle")}</h3><p>{t("detail.extras.roastGoatDescription")}</p></article><article><div className="detail-extra-photo"><Image src="/images/outdoor-dining.webp" alt={t("detail.extras.chickenTitle")} fill sizes="(max-width: 720px) 100vw, 33vw" /></div><h3>{t("detail.extras.chickenTitle")}</h3><p>{t("detail.extras.chickenDescription")}</p></article><article><div className="detail-extra-photo"><Image src="/images/bbq-grill.webp" alt={t("detail.extras.bbqTitle")} fill sizes="(max-width: 720px) 100vw, 33vw" /></div><h3>{t("detail.extras.bbqTitle")}</h3><p>{t("detail.extras.bbqDescription")}</p></article></div></div></section>

        <section className="container detail-related"><div className="detail-section-heading"><div><span className="detail-eyebrow">{t("detail.related.eyebrow")}</span><h2>{t("detail.related.title")}</h2></div><a href="/rooms">{t("detail.related.viewAll")} <ArrowRight size={17} /></a></div><div className="detail-related-grid">{relatedRooms.map((item) => <article key={item.id}><a className="detail-related-photo" href={`/rooms/${item.id}`}><Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, 50vw" />{!item.available && <span>{t("detail.related.unavailable")}</span>}</a><div><small>{item.guests}</small><h3>{item.name}</h3><p>{item.description}</p><div><strong>{formatRoomPrice(item.price)} <small>{t("detail.related.perNight")}</small></strong><a href={`/rooms/${item.id}`}>{t("detail.related.viewDetail")} <ArrowRight size={16} /></a></div></div></article>)}</div></section>

        <section className="container detail-final-cta"><span className="detail-eyebrow">{t("detail.finalCta.eyebrow")}</span><h2>{t("detail.finalCta.title")}</h2><p>{t("detail.finalCta.description")}</p><a className="button button-white button-lg" href="#availability">{t("detail.finalCta.action")} <ArrowRight size={18} /></a></section>
      </main>

      <footer className="site-footer theme-footer" id="contact"><div className="container footer-grid"><div className="footer-about"><Brand href="/" /><p>{t("footer.aboutDetail")}</p><div className="social-icons"><a href="/gallery" aria-label={t("footer.galleryAriaLabel")}><Globe2 size={20} /></a><a href="/#location" aria-label={t("footer.mapAriaLabel")}><Map size={20} /></a></div></div><div><h3>{t("footer.exploreTitle")}</h3><a href="/">{t("footer.exploreHome")}</a><a href="/rooms">{t("footer.exploreRooms")}</a><a href="/facilities">{t("footer.exploreFacilities")}</a><a href="/#experiences">{t("footer.exploreExperiences")}</a></div><div><h3>{t("footer.helpTitleShort")}</h3><a href="#availability">{t("footer.helpCheckAvailability")}</a><a href="/#location">{t("footer.helpRouteGuideShort")}</a><a href="/contact">{t("footer.helpContactShort")}</a></div><div><h3>{t("footer.contactTitle")}</h3><span><MapPin size={20} /> {t("footer.contactAddressShort")}</span><span><Mail size={20} /> {t("footer.contactEmail")}</span></div></div><div className="container footer-bottom"><span>{t("footer.copyrightShort")}</span><span>{t("footer.demoNoteShort")}</span></div></footer>
    </div>
  );
}
