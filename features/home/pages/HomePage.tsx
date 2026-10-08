"use client";

import Image from "next/image";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/Brand";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroVideo } from "@/components/HeroVideo";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import StayDateRangePicker from "@/features/rooms/components/StayDateRangePicker";
import { listRooms, type PublicRoom } from "@/features/rooms/services/public-rooms";
import { listFeaturedRooms, type FeaturedRoom } from "../services/featured-rooms";
import "../styles/home.css";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleParking,
  Clock3,
  Coffee,
  Globe2,
  Mail,
  Map,
  MapPin,
  Mountain,
  Phone,
  ShieldCheck,
  Thermometer,
  Trees,
  UsersRound,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

const highlights: { icon: LucideIcon; titleKey: string; detailKey: string }[] = [
  {
    icon: Bath,
    titleKey: "highlights.warmWater.title",
    detailKey: "highlights.warmWater.detail",
  },
  {
    icon: Wind,
    titleKey: "highlights.coolAir.title",
    detailKey: "highlights.coolAir.detail",
  },
  {
    icon: Mountain,
    titleKey: "highlights.valleyView.title",
    detailKey: "highlights.valleyView.detail",
  },
];

const amenities: { icon: LucideIcon; titleKey: string; detailKey: string }[] = [
  { icon: Waves, titleKey: "amenities.items.warmPool.title", detailKey: "amenities.items.warmPool.detail" },
  { icon: Bath, titleKey: "amenities.items.kidsPool.title", detailKey: "amenities.items.kidsPool.detail" },
  { icon: Wifi, titleKey: "amenities.items.wifi.title", detailKey: "amenities.items.wifi.detail" },
  { icon: CircleParking, titleKey: "amenities.items.parking.title", detailKey: "amenities.items.parking.detail" },
  { icon: UsersRound, titleKey: "amenities.items.familyFriendly.title", detailKey: "amenities.items.familyFriendly.detail" },
  { icon: Coffee, titleKey: "amenities.items.roomService.title", detailKey: "amenities.items.roomService.detail" },
  { icon: Clock3, titleKey: "amenities.items.frontDesk.title", detailKey: "amenities.items.frontDesk.detail" },
  { icon: Trees, titleKey: "amenities.items.playground.title", detailKey: "amenities.items.playground.detail" },
];

const gallery = [
  {
    image: "/images/gallery-dining-view.webp",
    categoryKey: "gallery.items.dining.category",
    titleKey: "gallery.items.dining.title",
    className: "gallery-large",
  },
  {
    image: "/images/green-hero-darajat-evening.webp",
    categoryKey: "gallery.items.resort.category",
    titleKey: "gallery.items.resort.title",
    className: "gallery-tall",
  },
  {
    image: "/images/gallery-mountain-sunset.webp",
    categoryKey: "gallery.items.nature.category",
    titleKey: "gallery.items.nature.title",
    className: "",
  },
  {
    image: "/images/gallery-balcony-dusk.webp",
    categoryKey: "gallery.items.moments.category",
    titleKey: "gallery.items.moments.title",
    className: "",
  },
  {
    image: "/images/room-mountain-villa-new.webp",
    categoryKey: "gallery.items.familyTime.category",
    titleKey: "gallery.items.familyTime.title",
    className: "",
  },
];

const testimonials = [
  {
    quoteKey: "testimonials.items.pratama.quote",
    nameKey: "testimonials.items.pratama.name",
    locationKey: "testimonials.items.pratama.location",
  },
  {
    quoteKey: "testimonials.items.hendraMaya.quote",
    nameKey: "testimonials.items.hendraMaya.name",
    locationKey: "testimonials.items.hendraMaya.location",
  },
  {
    quoteKey: "testimonials.items.rina.quote",
    nameKey: "testimonials.items.rina.name",
    locationKey: "testimonials.items.rina.location",
  },
];

function SectionEyebrow({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return <span className={`section-eyebrow${gold ? " gold" : ""}`}>{children}</span>;
}

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

  return (
    <>
      <SiteHeader id="home-header" revealOnScroll />

      <main>
        <section className="hero" id="home" aria-label={t("hero.ariaLabel")}>
          <HeroVideo />
          <div className="hero-shade" />
          <section className="booking-section" id="booking" aria-label={t("booking.ariaLabel")}>
            <h1 className="hero-destination-title">{t("hero.destinationTitle")}</h1>
            <div className="container">
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

        <section className="welcome-section container" id="about">
          <div className="welcome-copy">
            <SectionEyebrow>{t("welcome.eyebrow")}</SectionEyebrow>
            <h2>{t("welcome.title")}</h2>
            <p className="section-description">
              {t("welcome.description")}
            </p>
            <div className="highlight-list">
              {highlights.map(({ icon: Icon, titleKey, detailKey }) => (
                <div className="highlight" key={titleKey}>
                  <span className="highlight-icon"><Icon size={21} /></span>
                  <span><strong>{t(titleKey)}</strong><small>{t(detailKey)}</small></span>
                </div>
              ))}
            </div>
          </div>
          <div className="welcome-media">
            <Image src="/images/green-hero-darajat-evening.webp" alt={t("welcome.mediaAlt")} fill sizes="(max-width: 780px) 100vw, 50vw" />
            <div className="welcome-badge"><UsersRound size={30} /><span><strong>{t("welcome.badgeTitle")}</strong><small>{t("welcome.badgeDetail")}</small></span></div>
          </div>
        </section>

        <section className="rooms-section section-space" id="rooms">
          <div className="container">
            <div className="section-header room-header">
              <div>
                <SectionEyebrow gold>{t("rooms.eyebrow")}</SectionEyebrow>
                <h2>{t("rooms.title")}</h2>
                <p>{t("rooms.description")}</p>
              </div>
              <div className="room-actions">
                <a href="/rooms">{t("rooms.viewAll")} <ArrowRight size={17} /></a>
              </div>
            </div>
            <div className="room-carousel" role="region" aria-roledescription="carousel" aria-label={t("rooms.carouselAriaLabel")}>
              {featuredRooms.length > visibleRoomCount && <button className="room-carousel-arrow previous" type="button" onClick={() => changeRoom(-1)} aria-label={t("rooms.previousAriaLabel")}><ChevronLeft size={22} /></button>}
              <div className="room-grid" ref={roomTrackRef} onScroll={updateRoomPosition} tabIndex={0} aria-label={t("rooms.gridAriaLabel")}>
              {featuredRooms.map((room) => (
                <article className="room-card" key={room.roomTypeId}>
                  <div className="room-photo">
                    {room.coverImage && <Image src={room.coverImage.url} alt={room.coverImage.altText || room.name} fill unoptimized sizes="(max-width: 780px) 100vw, 33vw" />}
                  </div>
                  <div className="room-content">
                    <h3>{room.name}</h3>
                    <p>{room.description || "—"}</p>
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
          </div>
        </section>

        <section className="experiences-section section-space container" id="experiences">
          <div className="section-header experiences-header">
            <div><SectionEyebrow gold>{t("experiences.eyebrow")}</SectionEyebrow><h2>{t("experiences.title")}</h2></div>
            <p>{t("experiences.description")}</p>
          </div>
          <div className="experience-layout">
            <div className="experience-feature image-overlay-card">
              <Image src="/images/outdoor-highland-dining.jpg" alt="Keluarga menikmati makan malam dan kambing guling di teras terbuka Green Hero Darajat" fill sizes="(max-width: 780px) 100vw, 40vw" />
              <div><span>{t("experiences.feature.badge")}</span><h3>{t("experiences.feature.title")}</h3><p>{t("experiences.feature.detail")}</p></div>
            </div>
            <div className="experience-options">
              <article className="experience-main">
                <div>
                  <SectionEyebrow gold>{t("experiences.roastGoat.eyebrow")}</SectionEyebrow>
                  <h3>{t("experiences.roastGoat.title")}</h3>
                  <p>{t("experiences.roastGoat.detail")}</p>
                </div>
                <Image src="/images/kambing-guling.webp" alt="Kambing guling untuk acara makan bersama" width={110} height={110} />
                <div className="experience-meta"><span><UsersRound size={17} /> {t("experiences.roastGoat.meta")}</span><a href="#booking">{t("experiences.viewOptions")} <ArrowRight size={16} /></a></div>
              </article>
              <div className="experience-small-grid">
                <article className="experience-small">
                  <span>{t("experiences.bbq.badge")}</span>
                  <Image src="/images/bbq-grill.webp" alt="BBQ dan grill di ruang terbuka" width={100} height={100} />
                  <h3>{t("experiences.bbq.title")}</h3>
                  <p>{t("experiences.bbq.detail")}</p>
                  <a href="#booking">{t("experiences.viewOptions")} <ArrowRight size={16} /></a>
                </article>
                <article className="experience-small birthday">
                  <span>{t("experiences.birthday.badge")}</span>
                  <Image src="/images/birthday-room.webp" alt="Dekorasi ulang tahun di kamar resor" width={100} height={100} />
                  <h3>Birthday<br />Celebration</h3>
                  <p>{t("experiences.birthday.detail")}</p>
                  <a href="#booking">{t("experiences.viewOptions")} <ArrowRight size={16} /></a>
                </article>
              </div>
            </div>
          </div>
          <div className="extras-bar">
            <div><strong>{t("experiences.extrasTitle")}</strong><div className="extras-chips"><span>{t("experiences.extrasChips.chickenFamilySet")}</span><span>{t("experiences.extrasChips.anniversarySetup")}</span><span>{t("experiences.extrasChips.roomDecoration")}</span><span>{t("experiences.extrasChips.extraBed")}</span><span>{t("experiences.extrasChips.additionalBreakfast")}</span></div></div>
            <a className="button button-primary" href="#booking">{t("experiences.viewAll")} <ArrowRight size={18} /></a>
          </div>
        </section>

        <section className="spring-section container section-space" id="hot-spring">
          <div className="spring-media">
            <Image src="/images/green-hero-warm-pool.webp" alt={t("spring.mediaAlt")} fill sizes="(max-width: 780px) 100vw, 55vw" />
            <span>{t("spring.mediaBadge")}</span>
          </div>
          <div className="spring-copy">
            <SectionEyebrow>{t("spring.eyebrow")}</SectionEyebrow>
            <h2>{t("spring.title")}</h2>
            <p>{t("spring.description")}</p>
            <div className="spring-stats">
              <span><Thermometer size={23} /><strong>{t("spring.stats.temperature")}</strong><small>{t("spring.stats.temperatureLabel")}</small></span>
              <span><Clock3 size={23} /><strong>{t("spring.stats.everyDay")}</strong><small>{t("spring.stats.everyDayLabel")}</small></span>
              <span><ShieldCheck size={23} /><strong>{t("spring.stats.kidFriendly")}</strong><small>{t("spring.stats.kidFriendlyLabel")}</small></span>
            </div>
          </div>
        </section>

        <section className="amenities-section section-space" id="facilities">
          <div className="container">
            <div className="center-heading"><SectionEyebrow>{t("amenities.eyebrow")}</SectionEyebrow><h2>{t("amenities.title")}</h2><p>{t("amenities.description")}</p></div>
            <div className="amenities-grid">
              {amenities.map(({ icon: Icon, titleKey, detailKey }) => (
                <div className="amenity" key={titleKey}><span><Icon size={28} strokeWidth={2.2} /></span><strong>{t(titleKey)}</strong><small>{t(detailKey)}</small></div>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery-section section-space container" id="gallery">
          <div className="section-header gallery-header"><div><SectionEyebrow>{t("gallery.eyebrow")}</SectionEyebrow><h2>{t("gallery.title")}</h2></div><a className="button button-quiet" href="/gallery">{t("gallery.viewFull")}</a></div>
          <div className="gallery-grid" id="gallery-grid">
            {gallery.map((item) => (
              <div className={`gallery-item ${item.className}`} key={item.titleKey}>
                <Image src={item.image} alt={t(item.titleKey)} fill sizes={item.className === "gallery-large" ? "(max-width: 780px) 100vw, 60vw" : "(max-width: 780px) 100vw, 33vw"} />
                <div><span>{t(item.categoryKey)}</span><h3>{t(item.titleKey)}</h3></div>
              </div>
            ))}
          </div>
        </section>

        <section className="testimonials-section section-space">
          <div className="container">
            <div className="center-heading"><SectionEyebrow>{t("testimonials.eyebrow")}</SectionEyebrow><h2>{t("testimonials.title")}</h2></div>
            <div className="testimonials-grid">
              {testimonials.map((item) => (
                <blockquote key={item.nameKey}>
                  <div className="stars" aria-label={t("testimonials.starsAriaLabel")}>★★★★★</div>
                  <p>“{t(item.quoteKey)}”</p>
                  <footer><strong>{t(item.nameKey)}</strong><span>{t(item.locationKey)}</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="location-section container section-space" id="location">
          <div className="location-map">
            <Image src="/images/darajat-map.webp" alt={t("location.mapAlt")} fill sizes="(max-width: 780px) 100vw, 50vw" />
          </div>
          <div className="location-copy">
            <SectionEyebrow>{t("location.eyebrow")}</SectionEyebrow>
            <h2>{t("location.title")}</h2>
            <strong><MapPin size={21} /> {t("location.address")}</strong>
            <p>{t("location.description")}</p>
            <div className="location-actions"><a className="button button-primary" href="https://www.google.com/maps/search/?api=1&query=Darajat+Pass+Garut" target="_blank" rel="noreferrer"><Map size={20} /> {t("location.directions")}</a><a className="button button-quiet" href="/contact"><Phone size={20} /> {t("location.contact")}</a></div>
          </div>
        </section>

        <section className="final-cta">
          <div className="container">
            <SectionEyebrow>{t("finalCta.eyebrow")}</SectionEyebrow>
            <h2>{t("finalCta.title")}</h2>
            <p>{t("finalCta.description")}</p>
            <a className="button button-white button-lg" href="#booking">{t("finalCta.action")} <ArrowRight size={21} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer theme-footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-about"><Brand /><p>{t("footer.about")}</p><div className="social-icons"><a href="/gallery" aria-label={t("footer.galleryAriaLabel")}><Camera size={20} /></a><a href="#location" aria-label={t("footer.locationAriaLabel")}><Globe2 size={20} /></a><a href="#location" aria-label={t("footer.mapAriaLabel")}><Map size={20} /></a></div></div>
          <div><h3>{t("footer.exploreTitle")}</h3><a href="#about">{t("footer.exploreAbout")}</a><a href="/rooms">{t("footer.exploreRooms")}</a><a href="#hot-spring">{t("footer.exploreHotSpring")}</a><a href="/gallery">{t("footer.exploreGallery")}</a></div>
          <div><h3>{t("footer.helpTitle")}</h3><a href="#booking">{t("footer.helpReservationPolicy")}</a><a href="#location">{t("footer.helpRouteGuide")}</a><a href="/contact">{t("footer.helpContact")}</a><a href="/contact">{t("footer.helpPrivacy")}</a></div>
          <div><h3>{t("footer.contactTitle")}</h3><span><MapPin size={20} /> {t("footer.contactAddress")}</span><span><Phone size={20} /> {t("footer.contactPhone")}</span><span><Mail size={20} /> {t("footer.contactEmail")}</span></div>
        </div>
        <div className="container footer-bottom"><span>{t("footer.copyright")}</span><span>{t("footer.demoNote")}</span></div>
      </footer>
    </>
  );
}
