"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BedDouble, ChevronLeft, ChevronRight, MapPin, Mountain, UsersRound, Waves } from "lucide-react";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import StayDateRangePicker from "@/features/rooms/components/StayDateRangePicker";
import { listRooms, type PublicRoom } from "@/features/rooms/services/public-rooms";
import { listFeaturedRooms, type FeaturedRoom } from "../services/featured-rooms";
import { useTranslations } from "@/lib/i18n";
import { DarajatFooter, DarajatHeader } from "../components/DarajatHeader";
import { DarajatHeroSlideshow } from "../components/DarajatHeroSlideshow";
import { darajatCopy } from "../constants/darajat-copy";
import { darajatMedia } from "../constants/darajat-media";
import en from "../locales/en.json";
import id from "../locales/id.json";

function jakartaToday() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export default function Home() {
  const { t, lang } = useTranslations({ en, id });
  const [roomIndex, setRoomIndex] = useState(0);
  const [visibleRoomCount, setVisibleRoomCount] = useState(3);
  const roomTrackRef = useRef<HTMLDivElement>(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(2);
  const [roomTypeId, setRoomTypeId] = useState("all");
  const [roomTypes, setRoomTypes] = useState<PublicRoom[]>([]);
  const [featuredRooms, setFeaturedRooms] = useState<FeaturedRoom[]>([]);
  const [featuredRoomsLoading, setFeaturedRoomsLoading] = useState(true);
  const [featuredRoomsError, setFeaturedRoomsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    listRooms(controller.signal).then((result) => setRoomTypes(result.items)).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    listFeaturedRooms(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setFeaturedRooms(result.items);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFeaturedRoomsError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setFeaturedRoomsLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const tablet = window.matchMedia("(max-width: 900px)");
    const mobile = window.matchMedia("(max-width: 620px)");
    const updateRoomLayout = () => {
      const count = mobile.matches ? 1 : tablet.matches ? 2 : 3;
      setVisibleRoomCount(count);
      const track = roomTrackRef.current;
      if (!track) return;
      const first = track.children[0] as HTMLElement | undefined;
      const second = track.children[1] as HTMLElement | undefined;
      const step = first && second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
      setRoomIndex(Math.max(0, Math.min(featuredRooms.length - count, Math.round(track.scrollLeft / Math.max(1, step)))));
    };
    updateRoomLayout();
    tablet.addEventListener("change", updateRoomLayout);
    mobile.addEventListener("change", updateRoomLayout);
    return () => {
      tablet.removeEventListener("change", updateRoomLayout);
      mobile.removeEventListener("change", updateRoomLayout);
    };
  }, [featuredRooms.length]);

  const scrollToRoom = (index: number) => {
    const track = roomTrackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !first || !card) return;
    track.scrollTo({
      left: card.offsetLeft - first.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const changeRoom = (direction: number) => {
    const positions = Math.max(1, featuredRooms.length - visibleRoomCount + 1);
    scrollToRoom((roomIndex + direction + positions) % positions);
  };

  const updateRoomPosition = () => {
    const track = roomTrackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    const second = track?.children[1] as HTMLElement | undefined;
    if (!track || !first || !second) return;
    const step = second.offsetLeft - first.offsetLeft;
    setRoomIndex(Math.max(0, Math.min(featuredRooms.length - visibleRoomCount, Math.round(track.scrollLeft / Math.max(1, step)))));
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkIn && !checkOut) {
      setBookingMessage(t("booking.messages.selectBothDates"));
      return;
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      setBookingMessage(t("booking.messages.checkoutAfterCheckin"));
      return;
    }
    const params = new URLSearchParams({ guests: `${adults} Dewasa, ${children} Anak` });
    if (roomTypeId !== "all") params.set("roomTypeId", roomTypeId);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    setBookingMessage("");
    navigateWithSkeleton(`/rooms?${params.toString()}`);
  };


  const copy = darajatCopy[lang];
  const photos = darajatMedia.tourism;
  return (
    <div className="dp-home">
      <a className="dp-skip" href="#main-content">{copy.skip}</a>
      <DarajatHeader />
      <main id="main-content">
        <section className="hero dp-hero" id="home" aria-label="Darajat Pass">
          <DarajatHeroSlideshow />
          <div className="hero-shade" />
          <div className="dp-hero-copy dp-container">
            <h1>Darajat Pass</h1>
          </div>
          <section className="booking-section" id="booking" aria-label={t("booking.ariaLabel")}>
            <div className="dp-container dp-booking-panel">
              <form className="booking-card booking-card--range" onSubmit={handleSearch}>
                <StayDateRangePicker checkIn={checkIn} checkOut={checkOut} minDate={jakartaToday()} language={lang}
                  label={t("booking.dateRange")} checkInLabel={t("booking.checkIn")} checkOutLabel={t("booking.checkOut")}
                  placeholder={t("booking.selectRangeHint")}
                  onChange={(nextCheckIn, nextCheckOut) => { setCheckIn(nextCheckIn); setCheckOut(nextCheckOut); setBookingMessage(""); }} />
                <label className="booking-field">
                  <span><UsersRound size={20} /> {t("booking.adults")}</span>
                  <select aria-label={t("booking.adultsAriaLabel")} value={adults} onChange={(event) => setAdults(Number(event.target.value))}>
                    {Array.from({ length: 14 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}
                  </select>
                </label>
                <label className="booking-field">
                  <span><UsersRound size={20} /> {t("booking.children")}</span>
                  <select aria-label={t("booking.childrenAriaLabel")} value={children} onChange={(event) => setChildren(Number(event.target.value))}>
                    {Array.from({ length: 15 }, (_, count) => count).map((count) => <option key={count} value={count}>{count}</option>)}
                  </select>
                </label>
                <label className="booking-field">
                  <span><BedDouble size={20} /> {t("booking.roomType")}</span>
                  <select aria-label={t("booking.roomTypeAriaLabel")} value={roomTypeId} onChange={(event) => setRoomTypeId(event.target.value)}>
                    <option value="all">{t("booking.allRoomTypes")}</option>
                    {roomTypes.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
                  </select>
                </label>
                <button className="button button-primary booking-submit" type="submit">{t("booking.submit")}</button>
              </form>
              {bookingMessage && <p className="booking-message" role="status">{bookingMessage}</p>}
            </div>
          </section>
        </section>
        <div className="dp-pillar-strip"><div className="dp-container">{[Waves, UsersRound, Mountain].map((Icon, index) => <span key={copy.pillars[index]}><Icon size={22} strokeWidth={1.5} />{copy.pillars[index]}</span>)}</div></div>
        <section className="dp-intro dp-container dp-section" id="about">
          <div className="dp-intro-copy"><p className="dp-kicker">{copy.introLabel}</p><h2>{copy.introTitle}</h2><p className="dp-body">{copy.introBody}</p><Link className="dp-text-link" href="/rooms">{copy.introLink}<ArrowRight size={18} /></Link></div>
          <figure className="dp-intro-photo"><div className="dp-photo"><Image src={darajatMedia.welcome} alt={copy.introCaption} fill unoptimized sizes="(max-width: 780px) 100vw, 52vw" /></div><figcaption>{copy.introCaption}</figcaption></figure>
        </section>
        <section className="dp-rooms dp-section" id="rooms"><div className="dp-container">
          <div className="dp-section-heading"><div><p className="dp-kicker">{copy.roomsLabel}</p><h2>{copy.roomsTitle}</h2><p className="dp-body">{copy.roomsBody}</p></div><Link className="dp-text-link" href="/rooms">{t("rooms.viewAll")}<ArrowRight size={18} /></Link></div>
            <div className="room-carousel" role="region" aria-roledescription="carousel" aria-label={lang === "id" ? "Pilihan kamar menginap" : "Rooms for your stay"}>
              {featuredRooms.length > visibleRoomCount && <button className="room-carousel-arrow previous" type="button" onClick={() => changeRoom(-1)} aria-label={t("rooms.previousAriaLabel")}><ChevronLeft size={22} /></button>}
              <div className="room-grid" ref={roomTrackRef} onScroll={updateRoomPosition} tabIndex={0} aria-label={t("rooms.gridAriaLabel")}>
              {featuredRooms.map((room) => (
                <article className="room-card" key={room.roomTypeId}>
                  <div className="room-photo">
                    {room.coverImage && <Image src={room.coverImage.url} alt={room.coverImage.altText || room.name} fill unoptimized sizes="(max-width: 780px) 100vw, 33vw" />}
                  </div>
                  <div className="room-content">
                    <h3>{room.name}</h3>
                    {room.description && <p>{room.description}</p>}
                    <div className="room-facts">
                      {room.maxGuests !== null && <span><UsersRound size={16} /> {t("rooms.guests", { count: room.maxGuests })}</span>}
                      {room.sizeSqm && <span>{t("rooms.size", { size: room.sizeSqm })}</span>}
                    </div>
                    <div className="room-bottom">
                      <span>{room.startingPrice !== null ? `${t("rooms.priceFrom")} ${formatRoomPrice(room.startingPrice)} ${t("rooms.perNight")}` : t("rooms.priceUnavailable")}</span>
                      <a href={`/rooms/${encodeURIComponent(room.slug)}`} onClick={(event) => { event.preventDefault(); navigateWithSkeleton(`/rooms/${encodeURIComponent(room.slug)}`); }}>{t("rooms.viewDetail")} <ArrowRight size={17} /></a>
                    </div>
                  </div>
                </article>
              ))}
              {!featuredRoomsLoading && featuredRooms.length === 0 && <p className="room-section-message" role={featuredRoomsError ? "alert" : "status"}>{t(featuredRoomsError ? "rooms.loadError" : "rooms.empty")}</p>}
              {featuredRoomsLoading && <p className="room-section-message" role="status">{t("rooms.loading")}</p>}
              </div>
              {featuredRooms.length > visibleRoomCount && <button className="room-carousel-arrow next" type="button" onClick={() => changeRoom(1)} aria-label={t("rooms.nextAriaLabel")}><ChevronRight size={22} /></button>}
            </div>
            {featuredRooms.length > visibleRoomCount && <div className="room-dots" aria-label={t("rooms.dotsAriaLabel")}>
              {featuredRooms.slice(0, Math.max(1, featuredRooms.length - visibleRoomCount + 1)).map((room, index) => (
                <button key={room.roomTypeId} className={index === roomIndex ? "active" : ""} type="button" aria-label={t("rooms.dotAriaLabel", { name: room.name })} aria-current={index === roomIndex ? "true" : undefined} onClick={() => scrollToRoom(index)} />
              ))}
            </div>}
          <p className="dp-catalog-note">{copy.roomsNote}</p>
        </div></section>
        <section className="dp-water" id="hot-spring">
          <div className="dp-water-photo"><Image src={darajatMedia.nightPool} alt={copy.waterTitle} fill unoptimized sizes="(max-width: 780px) 100vw, 50vw" /></div>
          <div className="dp-water-copy"><p className="dp-kicker">{copy.waterLabel}</p><h2>{copy.waterTitle}</h2><p className="dp-body">{copy.waterBody}</p>
            <dl className="dp-water-facts">{copy.waterFacts.map(([title, body]) => <div key={title}><dt>{title}</dt><dd>{body}</dd></div>)}</dl>
            <p className="dp-water-note">{copy.waterNote}</p><a className="dp-text-link" href="#gallery">{copy.waterLink}<ArrowRight size={18} /></a>
          </div>
        </section>
        <section className="dp-activities dp-container dp-section" id="experiences">
          <div className="dp-section-heading"><div><p className="dp-kicker">{copy.activityLabel}</p><h2>{copy.activityTitle}</h2></div></div>
          <div className="dp-activity-list">{copy.activities.map((activity, i) => <article key={activity.tag}>
            <span className="dp-activity-number">0{i + 1}</span><div><p className="dp-kicker">{activity.tag}</p><h3>{activity.title}</h3></div><p className="dp-body">{activity.body}</p>
            <a className="dp-text-link" href="https://darajatpass.com/kontak/" target="_blank" rel="noreferrer">{activity.action}<ArrowRight size={18} /></a>
          </article>)}</div>
          <div className="dp-amenities" id="facilities"><p>{copy.amenitiesLabel}</p><ul>{copy.amenities.map(item => <li key={item}>{item}</li>)}</ul></div>
        </section>
        <section className="dp-gallery dp-section" id="gallery"><div className="dp-container">
          <div className="dp-gallery-heading">
            <p className="dp-kicker">{copy.galleryLabel}</p><h2>{copy.galleryTitle}</h2>
          </div>
          <div className="dp-tourism-layout">
            <figure className="dp-tourism-card is-featured"><Image src={photos[0]} alt={copy.galleryCaptions[0]} fill unoptimized sizes="(max-width: 780px) 100vw, 62vw" /><div className="dp-tourism-shade" /><figcaption><span className="dp-tourism-number">01</span><span><small>{copy.galleryTags[0]}</small><strong>{copy.galleryCaptions[0]}</strong></span></figcaption></figure>
            <div className="dp-tourism-stack">{photos.slice(1).map((photo, index) => { const i = index + 1; return <figure className="dp-tourism-card" key={photo}><Image src={photo} alt={copy.galleryCaptions[i]} fill unoptimized sizes="(max-width: 780px) 100vw, 38vw" /><div className="dp-tourism-shade" /><figcaption><span className="dp-tourism-number">0{i + 1}</span><span><small>{copy.galleryTags[i]}</small><strong>{copy.galleryCaptions[i]}</strong></span></figcaption></figure>; })}</div>
          </div>
        </div></section>
        <section className="dp-location-section dp-container dp-section" id="location">
          <div><p className="dp-kicker">{copy.locationLabel}</p><h2>{copy.locationTitle}</h2><p className="dp-body">{copy.locationBody}</p><a className="dp-button dp-green" href="https://www.google.com/maps/search/?api=1&query=Darajat+Pass+Garut" target="_blank" rel="noreferrer">{copy.map}<ArrowRight size={18} /></a></div>
          <div className="dp-address-panel"><MapPin size={30} strokeWidth={1.5} /><h3>{copy.locationAside}</h3><p>{copy.locationAsideBody}</p><address>{copy.address}</address><a className="dp-text-link" href="https://darajatpass.com/kontak/" target="_blank" rel="noreferrer">{copy.contact}<ArrowRight size={18} /></a><div className="dp-puncak"><strong>{copy.puncak}</strong><p>{copy.puncakBody}</p></div></div>
        </section>
        <section className="dp-final"><div className="dp-container"><div><h2>{copy.ctaTitle}</h2><p>{copy.ctaBody}</p></div><a className="dp-button dp-gold" href="#booking">{copy.cta}</a></div></section>
      </main>
      <DarajatFooter />
    </div>
  );
}
