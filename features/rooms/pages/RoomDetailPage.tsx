"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
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
import PageSkeleton from "@/components/PageSkeleton";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { getPublicBookingExtras, type PublicBookingExtras } from "@/features/booking/services/public-booking-extras";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { roomAmenityIcon } from "../constants/room-amenity-icons";
import { getRoomAvailability, getRoomBySlug, listRooms, type PublicRoom, type RoomAvailability } from "../services/public-rooms";
import "../styles/detail.css";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

type RoomDetailPageProps = {
  slug: string;
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

function todayJakarta() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function nextDate(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

export default function RoomDetailPage({ slug, initialCheckIn, initialCheckOut }: RoomDetailPageProps) {
  const { t } = useTranslations({ en, id });
  const today = todayJakarta();
  const hasInitialStay = initialCheckIn >= today && getNightCount(initialCheckIn, initialCheckOut) > 0;
  const [checkIn, setCheckIn] = useState(hasInitialStay ? initialCheckIn : today);
  const [checkOut, setCheckOut] = useState(hasInitialStay ? initialCheckOut : nextDate(today));
  const [guests, setGuests] = useState("2:0");
  const [editingStay, setEditingStay] = useState(false);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState<PublicRoom | null>(null);
  const [relatedRooms, setRelatedRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [availability, setAvailability] = useState<RoomAvailability | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityQuery, setAvailabilityQuery] = useState({ checkIn, checkOut, guests });
  const [experiences, setExperiences] = useState<PublicBookingExtras["experiences"]>([]);
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setRoom(null);
    setLoadError("");
    getRoomBySlug(slug, controller.signal)
      .then((detail) => {
        if (controller.signal.aborted) return;
        const patterns = detail.roomType.capacityPatterns;
        if (patterns.length && !patterns.some((pattern) => `${pattern.adults}:${pattern.children}` === guests)) {
          const option = `${patterns[0].adults}:${patterns[0].children}`;
          setGuests(option);
          setAvailabilityQuery({ checkIn, checkOut, guests: option });
        }
        setRoom(detail.roomType);
        void listRooms(controller.signal)
          .then((catalog) => {
            if (!controller.signal.aborted) setRelatedRooms(catalog.items.filter((item) => item.id !== detail.roomType.id).slice(0, 2));
          })
          .catch(() => {});
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setLoadError(cause instanceof Error ? cause.message : t("detail.messages.loadError"));
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (!room) return;
    const controller = new AbortController();
    const [adults, children] = availabilityQuery.guests.split(":").map(Number);
    setAvailability(null);
    setAvailabilityLoading(true);
    getRoomAvailability(room.id, availabilityQuery.checkIn, availabilityQuery.checkOut, adults, children, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setAvailability(result.items.find((item) => item.roomType.id === room.id) ?? null);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setMessage(cause instanceof Error ? cause.message : t("detail.messages.availabilityError"));
      })
      .finally(() => { if (!controller.signal.aborted) setAvailabilityLoading(false); });
    return () => controller.abort();
  }, [room, availabilityQuery]);

  useEffect(() => {
    if (!room) return;
    const controller = new AbortController();
    setExperiences([]);
    getPublicBookingExtras(availabilityQuery.checkIn, availabilityQuery.checkOut, [room.id], controller.signal)
      .then((result) => { if (!controller.signal.aborted) setExperiences(result.experiences.slice(0, 3)); })
      .catch(() => { if (!controller.signal.aborted) setExperiences([]); });
    return () => controller.abort();
  }, [room, availabilityQuery]);

  if (loading) return <PageSkeleton />;
  if (!room) return <div className="detail-page"><SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="/rooms" contactHref="/contact" /><main className="container detail-content"><div role="alert">{loadError || t("detail.messages.notFound")} <a href="/rooms">{t("detail.breadcrumbRooms")}</a></div></main></div>;

  const nights = getNightCount(checkIn, checkOut);
  const photos = [...room.images].sort((left, right) => Number(right.isCover) - Number(left.isCover) || left.sortOrder - right.sortOrder).slice(0, 5);
  const cover = photos[0];
  const maxGuests = Math.max(0, ...room.capacityPatterns.map((pattern) => pattern.adults + pattern.children));
  const [guestAdults, guestChildren] = guests.split(":").map(Number);
  const guestLabel = t("detail.messages.guestChoice", { adults: guestAdults, children: guestChildren });
  const guestOptions = [...new Set(room.capacityPatterns.map((pattern) => `${pattern.adults}:${pattern.children}`))];
  if (!guestOptions.length) guestOptions.push("2:0");
  const bedLabel = [room.bedCount, room.bedTypeName].filter(Boolean).join(" × ") || t("detail.messages.notSpecified");
  const currentAvailability = availabilityQuery.checkIn === checkIn && availabilityQuery.checkOut === checkOut && availabilityQuery.guests === guests ? availability : null;
  const available = Boolean(currentAvailability?.bookable);
  const nightlyPrices = currentAvailability?.pricePreview?.nightly.map((night) => night.finalPrice) ?? [];
  const nightlyPrice = nightlyPrices.length ? Math.min(...nightlyPrices) : null;
  const roomTotal = currentAvailability?.pricePreview?.roomTotal ?? null;
  const discountTotal = currentAvailability?.pricePreview?.discountTotal ?? 0;
  const policy = currentAvailability?.cancellationPolicies[0];
  const bookingHref = `/rooms?${new URLSearchParams({ roomTypeId: room.id, checkIn, checkOut, guests: guestLabel })}`;

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
    if (checkIn < today) {
      setMessage(t("detail.messages.pastDate"));
      return;
    }
    setEditingStay(false);
    setMessage("");
    setAvailability(null);
    setAvailabilityQuery({ checkIn, checkOut, guests });
  };

  return (
    <div className="detail-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#availability" contactHref="/contact" />
      <main>
        <nav className="container detail-breadcrumb" aria-label="Breadcrumb"><a href="/">{t("detail.breadcrumbHome")}</a><span>/</span><a href="/rooms">{t("detail.breadcrumbRooms")}</a><span>/</span><span>{room.name}</span></nav>

        <section className={`container detail-gallery${photos.length === 1 ? " detail-gallery--single" : ""}${photos.length === 0 ? " detail-gallery--empty" : ""}`} id="gallery" aria-label={t("detail.galleryAriaLabel", { name: room.name })}>
          {photos.map((photo, index) => (
            <a key={photo.id} href={photo.url} target="_blank" rel="noreferrer" className={`detail-gallery-photo detail-gallery-photo-${index + 1}`} aria-label={t("detail.photoLinkAriaLabel", { index: index + 1, name: room.name })}>
              <Image src={photo.url} alt={photo.altText || t("detail.photoAlt", { name: room.name, index: index + 1 })} fill unoptimized priority={index === 0} sizes={index === 0 ? "(max-width: 720px) 100vw, 60vw" : "(max-width: 720px) 50vw, 20vw"} />
            </a>
          ))}
          {photos.length === 0 && <p className="detail-gallery-empty">{t("detail.messages.noPhotos")}</p>}
          {currentAvailability && !available && <span className="detail-unavailable-ribbon">{t("detail.unavailableRibbon")}</span>}
          {cover && <a className="detail-photo-link" href={cover.url} target="_blank" rel="noreferrer">{t("detail.viewPhoto")}</a>}
        </section>

        <section className="container detail-content">
          <div className="detail-copy">
            <span className="detail-eyebrow">{t("detail.breadcrumbRooms")}</span>
            <div className="detail-heading-row"><div><h1>{room.name}</h1>{room.viewTypeName && <span className="detail-tagline">{room.viewTypeName}</span>}</div>{currentAvailability && !available && <span className="detail-status-label">{t("detail.statusUnavailable")}</span>}</div>

            <div className="detail-highlights">
              <div><UsersRound size={23} /><span><small>{t("detail.highlights.capacity")}</small><strong>{maxGuests ? t("detail.messages.maxGuests", { count: maxGuests }) : t("detail.messages.notSpecified")}</strong></span></div>
              <div><BedDouble size={23} /><span><small>{t("detail.highlights.bed")}</small><strong>{bedLabel}</strong></span></div>
              <div><Mountain size={23} /><span><small>{t("detail.highlights.ambiance")}</small><strong>{room.viewTypeName || t("detail.messages.notSpecified")}</strong></span></div>
              <div><Bath size={23} /><span><small>{t("detail.highlights.resort")}</small><strong>{room.amenities[0]?.name || t("detail.messages.notSpecified")}</strong></span></div>
            </div>

            <section className="detail-copy-section"><h2>{t("detail.aboutTitle")}</h2><p>{room.description || t("detail.messages.noDescription")}</p></section>

            <section className="detail-copy-section">
              <h2>{t("detail.amenitiesTitle")}</h2>
              <div className="detail-amenities">{room.amenities.length ? room.amenities.slice(0, 6).map((amenity) => { const Icon = roomAmenityIcon(amenity.iconKey); return <span key={amenity.id}><Icon size={21} /> {amenity.name}</span>; }) : t("detail.messages.notSpecified")}</div>
              {room.amenities.length > 6 && <>
                <div id="detail-amenities-extra" className={`detail-amenities-expand${amenitiesExpanded ? " is-open" : ""}`} aria-hidden={!amenitiesExpanded}>
                  <div className="detail-amenities detail-amenities--extra">{room.amenities.slice(6).map((amenity) => { const Icon = roomAmenityIcon(amenity.iconKey); return <span key={amenity.id}><Icon size={21} /> {amenity.name}</span>; })}</div>
                </div>
                <button type="button" className="detail-amenities-toggle" aria-controls="detail-amenities-extra" aria-expanded={amenitiesExpanded} onClick={() => setAmenitiesExpanded((current) => !current)}>
                  {amenitiesExpanded ? t("detail.amenitiesSeeLess") : t("detail.amenitiesSeeMore", { count: room.amenities.length - 6 })}
                </button>
              </>}
            </section>

            <section className="detail-copy-section"><h2>{t("detail.stayInfoTitle")}</h2><div className="detail-stay-info"><div><Clock3 size={21} /><span><strong>{t("detail.stayInfo.checkTimesTitle")}</strong><small>{t("detail.messages.checkTimes")}</small></span></div><div><UsersRound size={21} /><span><strong>{t("detail.stayInfo.capacityTitle")}</strong><small>{maxGuests ? t("detail.messages.maxGuests", { count: maxGuests }) : t("detail.messages.notSpecified")}</small></span></div><div><BedDouble size={21} /><span><strong>{t("detail.stayInfo.bedTitle")}</strong><small>{bedLabel}</small></span></div></div></section>

            <section className="detail-copy-section detail-policy"><h2>{t("detail.cancellationTitle")}</h2><div><ShieldCheck size={24} /><p><strong>{policy?.name || t("modal.checkAvailabilityForPolicy")}</strong>{policy && <><br />{policy.rules.map((rule) => { const timing = rule.timingType === "more_than" ? t("card.ruleMoreThan", { days: rule.daysBefore ?? 0 }) : t("card.ruleWithin", { days: rule.daysBefore ?? 0 }); const charge = rule.chargeValue === 0 ? t("card.ruleFree") : t("card.ruleCharge", { charge: rule.chargeType === "percentage" ? `${rule.chargeValue}%` : rule.chargeType === "nights" ? t("card.ruleNights", { nights: rule.chargeValue }) : formatRoomPrice(rule.chargeValue) }); return <span key={`${rule.timingType}-${rule.daysBefore}`}>{timing}: {charge}<br /></span>; })}</>}</p></div></section>
          </div>

          <aside className="detail-booking-card" id="availability" aria-label={t("detail.booking.ariaLabel")}>
            <div className="detail-booking-top"><span className={available ? "is-available" : "is-unavailable"}><CheckCircle2 size={17} />{availabilityLoading ? t("detail.messages.checking") : currentAvailability ? available ? t("detail.booking.remainingRooms", { count: currentAvailability.availableRooms }) : t("detail.booking.unavailable") : t("detail.messages.checkAvailability")}</span><button type="button" onClick={() => setEditingStay(!editingStay)} aria-expanded={editingStay} aria-controls="detail-edit-stay"><CalendarDays size={16} /> {t("detail.booking.edit")}</button></div>
            <div className="detail-booking-price"><small>{t("detail.booking.priceFrom")}</small><div><strong>{nightlyPrice !== null ? formatRoomPrice(nightlyPrice) : "—"}</strong><span>{t("detail.booking.perNight")}</span></div></div>
            <p className="detail-booking-included"><CheckCircle2 size={17} /> {t("detail.messages.priceByDate")}</p>
            <div className="detail-stay-card"><span className="detail-stay-label">{t("detail.booking.stayLabel")}</span><div className="detail-stay-dates"><CalendarDays size={19} /><div><strong>{formatStayDate(checkIn)} – {formatStayDate(checkOut)}</strong><span>{t("detail.booking.nights", { count: nights })}</span></div></div><div className="detail-stay-meta"><span><UsersRound size={19} /> {guestLabel}</span><span><BedDouble size={19} /> {t("detail.booking.oneRoom", { name: room.name })}</span></div></div>
            {editingStay && <form className="detail-date-form" id="detail-edit-stay" onSubmit={checkAvailability}>
              <label>{t("detail.booking.formCheckIn")}<input type="date" min={today} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></label>
              <label>{t("detail.booking.formCheckOut")}<input type="date" min={nextDate(checkIn || today)} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
              <label className="detail-guest-field">{t("detail.booking.formGuests")}<select value={guests} onChange={(event) => setGuests(event.target.value)}>{guestOptions.map((option) => { const [adults, children] = option.split(":").map(Number); return <option key={option} value={option}>{t("detail.messages.guestChoice", { adults, children })}</option>; })}</select></label>
              <button type="submit" className="detail-check-button"><CalendarDays size={18} /> {t("detail.booking.checkAvailability")}</button>
            </form>}
            {roomTotal !== null && <div className="detail-price-summary"><div><span>{t("detail.messages.roomPriceNights", { nights })}</span><strong>{formatRoomPrice(roomTotal + discountTotal)}</strong></div>{discountTotal > 0 && <div><span>{t("modal.discountTotal")}</span><span>−{formatRoomPrice(discountTotal)}</span></div>}<div className="detail-price-total"><strong>{t("detail.booking.priceSummaryTotal")}</strong><strong>{formatRoomPrice(roomTotal)}</strong></div></div>}
            {currentAvailability && !available && <div className="detail-date-notice"><CalendarDays size={20} /><p><strong>{t("detail.booking.noticeTitle")}</strong>{t("detail.messages.unavailable")}</p></div>}
            {available ? <a href={bookingHref} className="button button-primary detail-pick-button">{t("detail.booking.pick")} <ArrowRight size={18} /></a> : <button type="button" className="detail-pick-button detail-pick-unavailable" disabled>{t("detail.booking.pickUnavailable")}</button>}
            <button type="button" className="detail-edit-link" onClick={() => setEditingStay(!editingStay)} aria-expanded={editingStay} aria-controls="detail-edit-stay"><CalendarDays size={17} /> {t("detail.booking.editDatesLink")}</button>
            {message && <p className="detail-result" role="status">{message}</p>}
            <div className="detail-booking-assurances"><span><ShieldCheck size={19} /> {t("detail.messages.priceByDate")}</span>{policy && <span><CalendarDays size={19} /> {policy.name}</span>}<span><CheckCircle2 size={19} /> {t("detail.booking.assuranceConfirm")}</span></div>
            <button type="button" className="detail-date-prompt" onClick={() => setEditingStay(true)}><span>{t("detail.booking.datePromptQuestion")}<strong>{t("detail.booking.datePromptAction")}</strong></span><ChevronRight size={18} /></button>
            <div className="detail-help">{t("detail.booking.helpQuestion")}<a href="/contact">{t("detail.booking.helpAction")}</a></div>
          </aside>
        </section>

        {experiences.length > 0 && <section className="detail-extras"><div className="container"><span className="detail-eyebrow">{t("detail.extras.eyebrow")}</span><h2>{t("detail.extras.title")}</h2><p>{t("detail.extras.description")}</p><div className="detail-extra-grid">{experiences.map((experience) => <article key={experience.id}><div className="detail-extra-photo">{experience.imageUrl && <Image src={experience.imageUrl} alt={experience.name} fill unoptimized sizes="(max-width: 720px) 100vw, 33vw" />}</div><h3>{experience.name}</h3><p>{experience.description || t("detail.messages.noDescription")}</p></article>)}</div></div></section>}

        <section className="container detail-related"><div className="detail-section-heading"><div><span className="detail-eyebrow">{t("detail.related.eyebrow")}</span><h2>{t("detail.related.title")}</h2></div><a href="/rooms">{t("detail.related.viewAll")} <ArrowRight size={17} /></a></div><div className="detail-related-grid">{relatedRooms.map((item) => { const image = item.images.find((photo) => photo.isCover) ?? item.images[0]; const capacity = Math.max(0, ...item.capacityPatterns.map((pattern) => pattern.adults + pattern.children)); return <article key={item.id}><a className="detail-related-photo" href={`/rooms/${encodeURIComponent(item.slug)}`}>{image && <Image src={image.url} alt={image.altText || item.name} fill unoptimized sizes="(max-width: 720px) 100vw, 50vw" />}</a><div><small>{capacity ? t("detail.messages.maxGuests", { count: capacity }) : t("detail.messages.notSpecified")}</small><h3>{item.name}</h3><p>{item.description || t("detail.messages.noDescription")}</p><div><strong>{t("detail.messages.priceByDate")}</strong><a href={`/rooms/${encodeURIComponent(item.slug)}`}>{t("detail.related.viewDetail")} <ArrowRight size={16} /></a></div></div></article>; })}</div></section>

        <section className="container detail-final-cta"><span className="detail-eyebrow">{t("detail.finalCta.eyebrow")}</span><h2>{t("detail.finalCta.title")}</h2><p>{t("detail.finalCta.description")}</p><a className="button button-white button-lg" href="#availability">{t("detail.finalCta.action")} <ArrowRight size={18} /></a></section>
      </main>

      <footer className="site-footer theme-footer" id="contact"><div className="container footer-grid"><div className="footer-about"><Brand href="/" /><p>{t("footer.aboutDetail")}</p><div className="social-icons"><a href="/gallery" aria-label={t("footer.galleryAriaLabel")}><Globe2 size={20} /></a><a href="/#location" aria-label={t("footer.mapAriaLabel")}><Map size={20} /></a></div></div><div><h3>{t("footer.exploreTitle")}</h3><a href="/">{t("footer.exploreHome")}</a><a href="/rooms">{t("footer.exploreRooms")}</a><a href="/facilities">{t("footer.exploreFacilities")}</a><a href="/#experiences">{t("footer.exploreExperiences")}</a></div><div><h3>{t("footer.helpTitleShort")}</h3><a href="#availability">{t("footer.helpCheckAvailability")}</a><a href="/#location">{t("footer.helpRouteGuideShort")}</a><a href="/contact">{t("footer.helpContactShort")}</a></div><div><h3>{t("footer.contactTitle")}</h3><span><MapPin size={20} /> {t("footer.contactAddressShort")}</span><span><Mail size={20} /> {t("footer.contactEmail")}</span></div></div><div className="container footer-bottom"><span>{t("footer.copyrightShort")}</span><span>{t("footer.demoNoteShort")}</span></div></footer>
    </div>
  );
}
