"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Globe2,
  Headphones,
  Mail,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import PageSkeleton from "@/components/PageSkeleton";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { formatRoomPrice, type Room } from "@/features/rooms/constants/rooms-data";
import RoomInfoModal from "../components/RoomInfoModal";
import StayDateRangePicker from "../components/StayDateRangePicker";
import "../styles/rooms.css";
import { getNights } from "@/features/booking/constants/booking-data";
import { type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import { listRooms, quoteRooms, searchRooms as searchRoomAvailability, type PublicRoom, type RoomAvailability, type RoomQuote } from "../services/public-rooms";
import { LIVE_BOOKING_KEY, serializeLiveSelection, type LiveRoomBooking } from "../services/live-booking";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

const benefits = [
  { icon: Clock3, titleKey: "benefits.items.directReservation.title", descriptionKey: "benefits.items.directReservation.description" },
  { icon: ShieldCheck, titleKey: "benefits.items.clearInfo.title", descriptionKey: "benefits.items.clearInfo.description" },
  { icon: Headphones, titleKey: "benefits.items.staffSupport.title", descriptionKey: "benefits.items.staffSupport.description" },
];

type Props = { initialSelection: RoomSelection; initialCheckIn: string; initialCheckOut: string; initialMinDate: string; initialGuests: string };

function formatSelectionDate(value: string, placeholder: string) {
  const [year, month, day] = value.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return months[month - 1] && day ? `${day} ${months[month - 1]} ${year}` : placeholder;
}

function allocateGuests(rooms: { roomType: PublicRoom; quantity: number }[], adults: number, children: number) {
  const units = rooms.flatMap(({ roomType, quantity }) => Array.from({ length: quantity }, () => roomType));
  const memo = new Set<string>();
  function assign(index: number, remainingAdults: number, remainingChildren: number): { roomTypeId: string; adults: number; children: number }[] | null {
    if (index === units.length) return remainingAdults === 0 && remainingChildren === 0 ? [] : null;
    const key = `${index}:${remainingAdults}:${remainingChildren}`;
    if (memo.has(key)) return null;
    for (const pattern of units[index].capacityPatterns) {
      if (pattern.extraBeds > 0) continue;
      if (pattern.adults > remainingAdults || pattern.children > remainingChildren) continue;
      const rest = assign(index + 1, remainingAdults - pattern.adults, remainingChildren - pattern.children);
      if (rest) return [{ roomTypeId: units[index].id, adults: pattern.adults, children: pattern.children }, ...rest];
    }
    memo.add(key);
    return null;
  }
  return assign(0, adults, children);
}

function displayRoom(room: PublicRoom, availability?: RoomAvailability): Room {
  const cover = room.images.find((image) => image.isCover) ?? room.images[0];
  const firstNight = availability?.pricePreview?.nightly[0];
  const policy = availability?.cancellationPolicies[0];
  return {
    id: room.id,
    name: room.name,
    price: firstNight?.finalPrice ?? 0,
    available: availability?.bookable ?? false,
    remainingRooms: availability?.availableRooms ?? 0,
    cancellationPolicy: { summary: policy?.name ?? "Kebijakan pembatalan tersedia setelah memilih tanggal", description: policy?.policyType ?? "" },
    tagline: room.viewTypeName ?? room.bedTypeName ?? "Green Hero Darajat",
    eyebrow: "ROOMS & SUITES",
    badge: [room.bedCount && `${room.bedCount} ${room.bedTypeName ?? "Bed"}`, room.sizeSqm && `${room.sizeSqm} m²`].filter(Boolean).join(" · ") || room.name,
    image: cover?.url ?? "/images/room-standard-new.webp",
    imageAlt: cover?.altText ?? room.name,
    description: room.description ?? "",
    previewTag: room.name,
    guests: `${Math.max(0, ...room.capacityPatterns.map((pattern) => pattern.adults + pattern.children))} Tamu`,
    feature: room.viewTypeName ?? "",
    amenities: room.amenities.map((amenity) => ({ icon: BedDouble, label: amenity.name })),
  };
}

export default function RoomsPage({ initialSelection, initialCheckIn, initialCheckOut, initialMinDate, initialGuests }: Props) {
  const { t, lang } = useTranslations({ en, id });
  const [roomType, setRoomType] = useState("all");
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(Number.parseInt(initialGuests, 10) || 2);
  const [children, setChildren] = useState(Number(initialGuests.match(/(\d+)\s*(?:Anak|Child)/i)?.[1] ?? 0));
  const [selection, setSelection] = useState<RoomSelection>(initialSelection);
  const [message, setMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [catalog, setCatalog] = useState<PublicRoom[]>([]);
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);
  const [quote, setQuote] = useState<RoomQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [searchedDates, setSearchedDates] = useState({ checkIn: initialCheckIn, checkOut: initialCheckOut });

  useEffect(() => {
    const controller = new AbortController();
    listRooms(controller.signal).then((result) => setCatalog(result.items)).catch((error) => {
      if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Gagal memuat kamar.");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!searchedDates.checkIn || !searchedDates.checkOut || searchedDates.checkOut <= searchedDates.checkIn) return;
    const controller = new AbortController();
    setSearching(true);
    searchRoomAvailability(searchedDates.checkIn, searchedDates.checkOut, controller.signal)
      .then((result) => { setAvailability(result.items); setAvailabilityLoaded(true); setCatalog((current) => current.length ? current : result.items.map((item) => item.roomType)); setMessage(""); })
      .catch((error) => { if (!controller.signal.aborted) { setAvailability([]); setAvailabilityLoaded(false); setMessage(error instanceof Error ? error.message : "Gagal mencari ketersediaan."); } })
      .finally(() => { if (!controller.signal.aborted) setSearching(false); });
    return () => controller.abort();
  }, [searchedDates]);

  const availabilityById = new Map(availability.map((item) => [item.roomType.id, item]));
  const rooms = catalog.map((room) => displayRoom(room, availabilityById.get(room.id)));

  const visibleRooms = roomType === "all" ? rooms : rooms.filter((room) => room.id === roomType);

  const selectedRooms = selection.flatMap(({ roomId, quantity }) => {
    const room = rooms.find((item) => item.id === roomId);
    return room ? [{ room, quantity }] : [];
  });
  const totalRooms = selectedRooms.reduce((total, item) => total + item.quantity, 0);
  const nights = getNights(searchedDates.checkIn, searchedDates.checkOut);
  const roomTotal = quote?.roomTotal ?? 0;
  const guests = `${adults} ${t("availability.adults")}${children ? `, ${children} ${t("availability.children")}` : ""}`;

  useEffect(() => {
    setQuote(null);
    setQuoting(false);
    if (!selection.length || !availability.length || !nights) return;
    const selected = selection.flatMap(({ roomId, quantity }) => {
      const roomType = catalog.find((item) => item.id === roomId);
      return roomType ? [{ roomType, quantity }] : [];
    });
    if (selected.length !== selection.length || selected.some(({ roomType, quantity }) => !availabilityById.get(roomType.id)?.bookable || quantity > (availabilityById.get(roomType.id)?.availableRooms ?? 0))) return;
    const allocated = allocateGuests(selected, adults, children);
    if (!allocated) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setQuoting(true);
      quoteRooms({ checkInDate: searchedDates.checkIn, checkOutDate: searchedDates.checkOut, totalAdults: adults, totalChildren: children, rooms: allocated }, controller.signal)
        .then((result) => { setQuote(result); setMessage(""); })
        .catch((error) => { if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Gagal menghitung harga."); })
        .finally(() => { if (!controller.signal.aborted) setQuoting(false); });
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [selection, availability, catalog, adults, children, searchedDates.checkIn, searchedDates.checkOut, nights]);

  function changeRoomQuantity(roomId: string, delta: number) {
    setSelection((current) => {
      if (delta > 0 && current.reduce((total, item) => total + item.quantity, 0) >= 20) return current;
      const quantity = (current.find((item) => item.roomId === roomId)?.quantity ?? 0) + delta;
      return quantity > 0 ? [...current.filter((item) => item.roomId !== roomId), { roomId, quantity }] : current.filter((item) => item.roomId !== roomId);
    });
  }

  function changeStayDate(nextCheckIn: string, nextCheckOut: string) {
    setCheckIn(nextCheckIn);
    setCheckOut(nextCheckOut);
    setSearchedDates({ checkIn: "", checkOut: "" });
    setSearching(false);
    setAvailability([]);
    setAvailabilityLoaded(false);
    setSelection([]);
    setQuote(null);
  }

  function continueBooking() {
    if (!quote || quoting || !totalRooms) return;
    const selected = selection.flatMap(({ roomId, quantity }) => {
      const roomType = catalog.find((item) => item.id === roomId);
      return roomType ? [{ roomType, quantity }] : [];
    });
    const allocation = allocateGuests(selected, adults, children);
    if (!allocation || allocation.length !== totalRooms) {
      setMessage(t("cart.adjustGuests"));
      return;
    }
    const booking: LiveRoomBooking = {
      checkIn: searchedDates.checkIn,
      checkOut: searchedDates.checkOut,
      adults,
      children,
      selection,
      allocation,
      quote,
    };
    try {
      sessionStorage.setItem(LIVE_BOOKING_KEY, JSON.stringify(booking));
    } catch {
      setMessage(t("cart.storageError"));
      return;
    }
    const params = new URLSearchParams({ source: "website", room: selection[0].roomId, rooms: serializeLiveSelection(selection), checkIn: searchedDates.checkIn, checkOut: searchedDates.checkOut, guests });
    navigateWithSkeleton(`/booking/extras?${params}`);
  }

  function searchRooms(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkIn || !checkOut) {
      setMessage(t("availability.messages.selectDates"));
      return;
    }
    if (checkOut <= checkIn) {
      setMessage(t("availability.messages.checkoutAfterCheckin"));
      return;
    }
    setSelection([]);
    setQuote(null);
    setAvailabilityLoaded(false);
    setAvailability([]);
    setSearchedDates({ checkIn, checkOut });
    setMessage("");
    document.getElementById("rooms-list")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="rooms-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#availability" contactHref="/contact" />
      <main>
        <section className="rooms-hero" aria-label={t("list.heroAriaLabel")}>
          <Image src="/images/green-hero-resort-sunset.webp" alt={t("list.heroImageAlt")} fill priority sizes="100vw" className="rooms-hero-image" />
          <div className="rooms-hero-shade" />
          <div className="container rooms-hero-content">
            <div>
              <nav className="rooms-breadcrumb" aria-label="Breadcrumb"><a href="/">{t("list.breadcrumbHome")}</a><span>/</span><span>{t("list.breadcrumbCurrent")}</span></nav>
              <span className="rooms-eyebrow">{t("list.eyebrow")}</span>
              <h1>{t("list.title")}</h1>
              <p>{t("list.description")}</p>
            </div>
          </div>
        </section>

        <section className="container rooms-availability" id="availability" aria-label={t("availability.ariaLabel")}>
          <form className="rooms-search" onSubmit={searchRooms}>
            <StayDateRangePicker checkIn={checkIn} checkOut={checkOut} minDate={initialMinDate} language={lang} label={t("availability.dateRange")} checkInLabel={t("availability.checkIn")} checkOutLabel={t("availability.checkOut")} placeholder={t("availability.selectRangeHint")} onChange={changeStayDate} />
            <label><span><UsersRound size={16} /> {t("availability.adults")}</span><input type="number" min="1" max="100" value={adults} onChange={(event) => setAdults(Math.max(1, Number(event.target.value) || 1))} /></label>
            <label><span><UsersRound size={16} /> {t("availability.children")}</span><input type="number" min="0" max="100" value={children} onChange={(event) => setChildren(Math.max(0, Number(event.target.value) || 0))} /></label>
            <label><span><BedDouble size={16} /> {t("availability.rooms")}</span><select value={roomType} onChange={(event) => setRoomType(event.target.value)}><option value="all">{t("availability.allRoomTypes")}</option>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name}{!availabilityLoaded || room.available ? "" : t("availability.unavailableSuffix")}</option>)}</select></label>
            <button className="button button-primary rooms-search-button" type="submit" disabled={loading || searching}><Search size={18} /> {searching ? t("availability.searching") : t("availability.search")}</button>
          </form>
          {(message || loading) && <p className="rooms-search-message" role="status">{message || t("availability.loading")}</p>}
        </section>

        <section className="container rooms-intro">
          <span className="rooms-eyebrow">{t("intro.eyebrow")}</span>
          <h2>{t("intro.title")}</h2>
          <p>{t("intro.description")}</p>
          <div className="rooms-intro-note"><CheckCircle2 size={18} /> {t("intro.note")}</div>
          <small className="rooms-price-disclaimer">{t("intro.priceDisclaimer")}</small>
        </section>

        <section className="container rooms-booking-layout" id="rooms-list" aria-label={t("card.layoutAriaLabel")}><div className="rooms-list">
          {!loading && !rooms.length && <p role="status">{t("availability.noRooms")}</p>}
          {(loading || searching) && <PageSkeleton compact />}
          {!loading && !searching && visibleRooms.map((room) => (
            <article className={`rooms-card${availabilityLoaded && !room.available ? " is-unavailable" : ""}`} id={`room-${room.id}`} key={room.id}>
              <div className="rooms-card-photo">
                <Image src={room.image} alt={room.imageAlt} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1000px) 40vw, 30vw" />
                <span className="rooms-card-badge">{room.badge}</span>
                {availabilityLoaded && !room.available && <span className="rooms-unavailable-badge">{t("card.unavailable")}</span>}
              </div>
              <div className="rooms-card-body">
                <div>
                  <span className="rooms-card-eyebrow">{room.eyebrow}</span>
                  <h3>{room.name}</h3>
                  <span className="rooms-card-tagline">{room.tagline}</span>
                  <p>{room.description}</p>
                  <div className="rooms-card-amenities">{room.amenities.map(({ icon: Icon, label }) => <span key={label}><Icon size={19} /> {label}</span>)}</div>
                  <div className="rooms-card-conditions">
                    <span className={`rooms-stock${availabilityLoaded ? room.remainingRooms === 0 ? " is-empty" : room.remainingRooms <= 2 ? " is-low" : "" : ""}`}><BedDouble size={16} /> {searching ? t("availability.checkingStock") : availabilityLoaded ? t("card.remainingRooms", { count: room.remainingRooms }) : t("availability.notChecked")}</span>
                    <div className="rooms-cancellation"><ShieldCheck size={17} /><span>{room.cancellationPolicy.summary}</span></div>
                  </div>
                </div>
                <div className="rooms-card-actions">
                  <div className="rooms-price"><small>{availabilityLoaded && room.available ? t("card.priceFrom") : t("card.priceReference")}</small><strong>{room.price > 0 ? formatRoomPrice(room.price) : "—"}</strong><span>{t("card.perNight")}</span></div>
                  <div>
                    <button type="button" className="rooms-detail-button" aria-haspopup="dialog" onClick={() => setActiveRoom(room)}>{t("card.viewDetail")}</button>
                    {availabilityLoaded && room.available ? (
                      (selection.find((item) => item.roomId === room.id)?.quantity ?? 0) > 0 ? (
                        <div className="rooms-quantity" aria-label={t("card.quantityAriaLabel", { name: room.name })}>
                          <button type="button" aria-label={t("card.decreaseAriaLabel", { name: room.name })} onClick={() => changeRoomQuantity(room.id, -1)}><Minus size={18} /></button>
                          <output aria-live="polite">{selection.find((item) => item.roomId === room.id)?.quantity ?? 0}</output>
                          <button type="button" aria-label={t("card.increaseAriaLabel", { name: room.name })} disabled={(selection.find((item) => item.roomId === room.id)?.quantity ?? 0) >= room.remainingRooms} onClick={() => changeRoomQuantity(room.id, 1)}><Plus size={18} /></button>
                        </div>
                      ) : <button className="button button-primary" type="button" onClick={() => changeRoomQuantity(room.id, 1)}>{t("card.selectRoom")} <Plus size={17} /></button>
                    ) : !availabilityLoaded ? <a className="button button-primary" href="#availability">{t("availability.search")}</a> : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
          </div>
          {totalRooms > 0 && <a className="rooms-mobile-summary" href="#rooms-cart"><span>{t("cart.mobileSummary", { count: totalRooms, price: quote ? formatRoomPrice(roomTotal) : "—" })}</span><strong>{t("cart.mobileViewSummary")} <ArrowRight size={16} /></strong></a>}
          <aside className="rooms-cart" id="rooms-cart" aria-label={t("cart.ariaLabel")}><div className="rooms-cart-heading"><span className="rooms-eyebrow">{t("cart.eyebrow")}</span><h2>{t("cart.brand")}</h2><p><CalendarDays size={16} />{formatSelectionDate(searchedDates.checkIn, t("selectionDate.placeholder"))} – {formatSelectionDate(searchedDates.checkOut, t("selectionDate.placeholder"))}</p><small>{nights > 0 ? t("cart.nights", { count: nights }) : t("cart.selectValidDates")} • {guests}</small></div><div className="rooms-cart-room-heading"><span><BedDouble size={22} /></span><div><h3>{t("cart.roomHeading")}</h3><p>{t("cart.roomsSelected", { count: totalRooms })}</p></div></div><div className="rooms-cart-items">{selectedRooms.length ? selectedRooms.map(({ room, quantity }) => <div className="rooms-cart-item" key={room.id}><div><strong>{room.name}</strong><b>{quote ? formatRoomPrice(quote.rooms.filter((item) => item.roomTypeId === room.id).reduce((total, item) => total + item.baseAmount - item.discountAmount, 0)) : "—"}</b></div><p>{catalog.find((item) => item.id === room.id)?.mealTypeName ?? ""}</p><div><span>{t("cart.roomLineNoPrice", { count: quantity, nights })}</span><button type="button" aria-label={t("cart.removeAriaLabel", { name: room.name })} onClick={() => setSelection((current) => current.filter((item) => item.roomId !== room.id))}><Trash2 size={13} />{t("cart.remove")}</button></div></div>) : <div className="rooms-cart-empty"><BedDouble size={30} /><strong>{t("cart.emptyTitle")}</strong><p>{t("cart.emptyDescription")}</p></div>}</div>{quote && quote.discountTotal > 0 && <div className="rooms-cart-subtotal"><span>{t("cart.discount")}</span><strong>−{formatRoomPrice(quote.discountTotal)}</strong></div>}<div className="rooms-cart-subtotal"><span>{t("cart.roomSubtotal")}</span><strong>{quote ? formatRoomPrice(roomTotal) : "—"}</strong></div><div className="rooms-cart-total"><div aria-live="polite" aria-atomic="true"><h3>{t("cart.total")}</h3><strong>{quote ? formatRoomPrice(quote.bookingTotal) : "—"}</strong></div><p>{t("cart.taxIncluded")}</p><button type="button" className="button button-primary" disabled={!quote || quoting || !totalRooms} onClick={continueBooking}>{t("cart.continue")} <ArrowRight size={18} /></button><small>{totalRooms && !quote ? t("cart.adjustGuests") : totalRooms ? t("cart.forwardedNote") : t("cart.selectAtLeastOne")}</small></div></aside>
        </section>

        <section className="container rooms-benefits">
          <span className="rooms-eyebrow">{t("benefits.eyebrow")}</span>
          <h2>{t("benefits.title")}</h2>
          <div className="rooms-benefit-grid">{benefits.map(({ icon: Icon, titleKey, descriptionKey }) => <div key={titleKey}><span className="rooms-benefit-icon"><Icon size={27} /></span><h3>{t(titleKey)}</h3><p>{t(descriptionKey)}</p></div>)}</div>
        </section>

        <section className="container rooms-experience">
          <div className="rooms-experience-photo"><Image src="/images/bbq-grill.webp" alt={t("experience.photoAlt")} fill sizes="(max-width: 800px) 100vw, 40vw" /><span>{t("experience.photoBadge")}</span></div>
          <div className="rooms-experience-copy"><span className="rooms-eyebrow"><Flame size={17} /> {t("experience.eyebrow")}</span><h2>{t("experience.title")}</h2><p>{t("experience.description")}</p><a className="button button-primary" href="/#experiences">{t("experience.action")} <ArrowRight size={18} /></a><small>{t("experience.note")}</small></div>
        </section>

        <section className="container rooms-final-cta" id="booking-section"><div><span className="rooms-eyebrow">{t("finalCta.eyebrow")}</span><h2>{t("finalCta.title")}</h2><p>{t("finalCta.description")}</p><div><a className="button button-white button-lg" href="#availability">{t("finalCta.checkAvailability")}</a><a className="button button-outline-light button-lg" href="/contact"><MessageCircle size={18} /> {t("finalCta.contact")}</a></div></div></section>
      </main>
      {activeRoom && <RoomInfoModal key={activeRoom.id} room={activeRoom} onClose={() => setActiveRoom(null)} />}

      <footer className="site-footer theme-footer" id="contact">
          <div className="container footer-grid">
          <div className="footer-about"><Brand href="/" /><p>{t("footer.aboutList")}</p><div className="social-icons"><a href="/gallery" aria-label={t("footer.galleryAriaLabel")}><Globe2 size={20} /></a><a href="/#location" aria-label={t("footer.locationAriaLabel")}><MapIcon size={20} /></a></div></div>
          <div><h3>{t("footer.exploreTitle")}</h3><a href="/">{t("footer.exploreAbout")}</a><a href="/rooms">{t("footer.exploreRooms")}</a><a href="/#hot-spring">{t("footer.exploreHotSpring")}</a><a href="/gallery">{t("footer.exploreGallery")}</a></div>
          <div><h3>{t("footer.helpTitle")}</h3><a href="#availability">{t("footer.helpCheckAvailability")}</a><a href="/#location">{t("footer.helpRouteGuide")}</a><a href="/contact">{t("footer.helpContact")}</a></div>
          <div><h3>{t("footer.contactTitle")}</h3><span><MapPin size={20} /> {t("footer.contactAddress")}</span><span><Mail size={20} /> {t("footer.contactEmail")}</span></div>
        </div>
        <div className="container footer-bottom"><span>{t("footer.copyright")}</span><span>{t("footer.roomDataNote")}</span></div>
      </footer>

    </div>
  );
}
