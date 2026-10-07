"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
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
  Map,
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
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { rooms, formatRoomPrice, type Room } from "@/features/rooms/constants/rooms-data";
import RoomInfoModal from "../components/RoomInfoModal";
import "../styles/rooms.css";
import { getNights } from "@/features/booking/constants/booking-data";
import { countSelectedRooms, getRoomSelectionTotal, getSelectedRoomItems, normalizeRoomSelection, serializeRoomSelection, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

const benefits = [
  { icon: Clock3, titleKey: "benefits.items.directReservation.title", descriptionKey: "benefits.items.directReservation.description" },
  { icon: ShieldCheck, titleKey: "benefits.items.clearInfo.title", descriptionKey: "benefits.items.clearInfo.description" },
  { icon: Headphones, titleKey: "benefits.items.staffSupport.title", descriptionKey: "benefits.items.staffSupport.description" },
];

type Props = { initialSelection: RoomSelection; initialCheckIn: string; initialCheckOut: string; initialGuests: string };

function formatSelectionDate(value: string, placeholder: string) {
  const [year, month, day] = value.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return months[month - 1] && day ? `${day} ${months[month - 1]} ${year}` : placeholder;
}

export default function RoomsPage({ initialSelection, initialCheckIn, initialCheckOut, initialGuests }: Props) {
  const { t } = useTranslations({ en, id });
  const [roomType, setRoomType] = useState("all");
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [selection, setSelection] = useState<RoomSelection>(initialSelection);
  const [message, setMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  const visibleRooms = roomType === "all" ? rooms : rooms.filter((room) => room.id === roomType);

  const selectedRooms = getSelectedRoomItems(selection);
  const totalRooms = countSelectedRooms(selection);
  const nights = getNights(checkIn, checkOut);
  const roomTotal = getRoomSelectionTotal(selection, nights);

  function changeRoomQuantity(roomId: string, delta: number) {
    setSelection((current) => {
      const quantity = (current.find((item) => item.roomId === roomId)?.quantity ?? 0) + delta;
      return normalizeRoomSelection([...current.filter((item) => item.roomId !== roomId), { roomId, quantity }]);
    });
  }

  function continueBooking() {
    if (!totalRooms || nights <= 0) return;
    const params = new URLSearchParams({ room: selectedRooms[0].room.id, rooms: serializeRoomSelection(selection), checkIn, checkOut, guests });
    window.location.assign(`/booking/extras?${params}`);
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
    const availableCount = visibleRooms.filter((room) => room.available).length;
    const unavailableCount = visibleRooms.length - availableCount;
    setMessage(t("availability.messages.searchResult", { available: availableCount, unavailable: unavailableCount }));
    document.getElementById("rooms-list")?.scrollIntoView({ behavior: "smooth" });
  }

  function detailHref(id: string) {
    const dates = new URLSearchParams();
    if (checkIn) dates.set("checkIn", checkIn);
    if (checkOut) dates.set("checkOut", checkOut);
    return `/rooms/${id}${dates.size ? `?${dates}` : ""}`;
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
            <label><span><CalendarDays size={16} /> {t("availability.checkIn")}</span><input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></label>
            <label><span><CalendarDays size={16} /> {t("availability.checkOut")}</span><input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
            <label><span><UsersRound size={16} /> {t("availability.guests")}</span><select value={guests} onChange={(event) => setGuests(event.target.value)}>{[...new Set([initialGuests, "2 Dewasa", "4 Dewasa (Family)", "Rombongan (5-8 Tamu)", "Grup Besar (10+ Tamu)"])].map((label) => <option key={label} value={label}>{label}</option>)}</select></label>
            <label><span><BedDouble size={16} /> {t("availability.rooms")}</span><select value={roomType} onChange={(event) => setRoomType(event.target.value)}><option value="all">{t("availability.allRoomTypes")}</option>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name}{room.available ? "" : t("availability.unavailableSuffix")}</option>)}</select></label>
            <button className="button button-primary rooms-search-button" type="submit"><Search size={18} /> {t("availability.search")}</button>
          </form>
          {message && <p className="rooms-search-message" role="status">{message}</p>}
        </section>

        <section className="container rooms-intro">
          <span className="rooms-eyebrow">{t("intro.eyebrow")}</span>
          <h2>{t("intro.title")}</h2>
          <p>{t("intro.description")}</p>
          <div className="rooms-intro-note"><CheckCircle2 size={18} /> {t("intro.note")}</div>
          <small className="rooms-price-disclaimer">{t("intro.priceDisclaimer")}</small>
        </section>

        <section className="container rooms-booking-layout" id="rooms-list" aria-label={t("card.layoutAriaLabel")}><div className="rooms-list">
          {visibleRooms.map((room) => (
            <article className={`rooms-card${room.available ? "" : " is-unavailable"}`} id={`room-${room.id}`} key={room.id}>
              <div className="rooms-card-photo">
                <Image src={room.image} alt={room.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 40vw, 30vw" />
                <span className="rooms-card-badge">{room.badge}</span>
                {!room.available && <span className="rooms-unavailable-badge">{t("card.unavailable")}</span>}
              </div>
              <div className="rooms-card-body">
                <div>
                  <span className="rooms-card-eyebrow">{room.eyebrow}</span>
                  <h3>{room.name}</h3>
                  <span className="rooms-card-tagline">{room.tagline}</span>
                  <p>{room.description}</p>
                  <div className="rooms-card-amenities">{room.amenities.map(({ icon: Icon, label }) => <span key={label}><Icon size={19} /> {label}</span>)}</div>
                  <div className="rooms-card-conditions">
                    <span className={`rooms-stock${room.remainingRooms === 0 ? " is-empty" : room.remainingRooms <= 2 ? " is-low" : ""}`}><BedDouble size={16} /> {t("card.remainingRooms", { count: room.remainingRooms })}</span>
                    <div className="rooms-cancellation"><ShieldCheck size={17} /><span>{room.cancellationPolicy.summary}</span></div>
                  </div>
                </div>
                <div className="rooms-card-actions">
                  <div className="rooms-price"><small>{room.available ? t("card.priceFrom") : t("card.priceReference")}</small><strong>{formatRoomPrice(room.price)}</strong><span>{t("card.perNight")}</span></div>
                  <div>
                    <button type="button" className="rooms-detail-button" aria-haspopup="dialog" onClick={() => setActiveRoom(room)}>{t("card.viewDetail")}</button>
                    {room.available ? (selection.find((item) => item.roomId === room.id)?.quantity ?? 0) > 0 ? <div className="rooms-quantity" aria-label={t("card.quantityAriaLabel", { name: room.name })}><button type="button" aria-label={t("card.decreaseAriaLabel", { name: room.name })} onClick={() => changeRoomQuantity(room.id, -1)}><Minus size={18} /></button><output aria-live="polite">{selection.find((item) => item.roomId === room.id)?.quantity ?? 0}</output><button type="button" aria-label={t("card.increaseAriaLabel", { name: room.name })} disabled={(selection.find((item) => item.roomId === room.id)?.quantity ?? 0) >= room.remainingRooms} onClick={() => changeRoomQuantity(room.id, 1)}><Plus size={18} /></button></div> : <button className="button button-primary" type="button" onClick={() => changeRoomQuantity(room.id, 1)}>{t("card.selectRoom")} <Plus size={17} /></button> : <a className="button button-primary" href={detailHref(room.id)}>{t("card.selectRoom")} <ArrowRight size={17} /></a>}
                  </div>
                </div>
              </div>
            </article>
          ))}
          </div>
          {totalRooms > 0 && <a className="rooms-mobile-summary" href="#rooms-cart"><span>{t("cart.mobileSummary", { count: totalRooms, price: formatRoomPrice(roomTotal) })}</span><strong>{t("cart.mobileViewSummary")} <ArrowRight size={16} /></strong></a>}
          <aside className="rooms-cart" id="rooms-cart" aria-label={t("cart.ariaLabel")}><div className="rooms-cart-heading"><span className="rooms-eyebrow">{t("cart.eyebrow")}</span><h2>{t("cart.brand")}</h2><p><CalendarDays size={16} />{formatSelectionDate(checkIn, t("selectionDate.placeholder"))} – {formatSelectionDate(checkOut, t("selectionDate.placeholder"))}</p><small>{nights > 0 ? t("cart.nights", { count: nights }) : t("cart.selectValidDates")} • {guests}</small></div><div className="rooms-cart-room-heading"><span><BedDouble size={22} /></span><div><h3>{t("cart.roomHeading")}</h3><p>{t("cart.roomsSelected", { count: totalRooms })}</p></div></div><div className="rooms-cart-items">{selectedRooms.length ? selectedRooms.map(({ room, quantity }) => <div className="rooms-cart-item" key={room.id}><div><strong>{room.name}</strong><b>{formatRoomPrice(room.price * quantity * nights)}</b></div><p>{t("cart.included")}</p><div><span>{t("cart.roomLine", { count: quantity, price: formatRoomPrice(room.price), nights })}</span><button type="button" aria-label={t("cart.removeAriaLabel", { name: room.name })} onClick={() => setSelection((current) => current.filter((item) => item.roomId !== room.id))}><Trash2 size={13} />{t("cart.remove")}</button></div></div>) : <div className="rooms-cart-empty"><BedDouble size={30} /><strong>{t("cart.emptyTitle")}</strong><p>{t("cart.emptyDescription")}</p></div>}</div><div className="rooms-cart-subtotal"><span>{t("cart.roomSubtotal")}</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="rooms-cart-total"><div aria-live="polite" aria-atomic="true"><h3>{t("cart.total")}</h3><strong>{formatRoomPrice(roomTotal)}</strong></div><p>{t("cart.taxIncluded")}</p><button type="button" className="button button-primary" disabled={!totalRooms || nights <= 0} onClick={continueBooking}>{t("cart.continue")} <ArrowRight size={18} /></button><small>{totalRooms ? t("cart.forwardedNote") : t("cart.selectAtLeastOne")}</small></div></aside>
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
          <div className="footer-about"><Brand href="/" /><p>{t("footer.aboutList")}</p><div className="social-icons"><a href="/gallery" aria-label={t("footer.galleryAriaLabel")}><Globe2 size={20} /></a><a href="/#location" aria-label={t("footer.locationAriaLabel")}><Map size={20} /></a></div></div>
          <div><h3>{t("footer.exploreTitle")}</h3><a href="/">{t("footer.exploreAbout")}</a><a href="/rooms">{t("footer.exploreRooms")}</a><a href="/#hot-spring">{t("footer.exploreHotSpring")}</a><a href="/gallery">{t("footer.exploreGallery")}</a></div>
          <div><h3>{t("footer.helpTitle")}</h3><a href="#availability">{t("footer.helpCheckAvailability")}</a><a href="/#location">{t("footer.helpRouteGuide")}</a><a href="/contact">{t("footer.helpContact")}</a></div>
          <div><h3>{t("footer.contactTitle")}</h3><span><MapPin size={20} /> {t("footer.contactAddress")}</span><span><Mail size={20} /> {t("footer.contactEmail")}</span></div>
        </div>
        <div className="container footer-bottom"><span>{t("footer.copyright")}</span><span>{t("footer.demoNote")}</span></div>
      </footer>

    </div>
  );
}
