"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BedDouble, Cake, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, Coffee, Heart, MapPin, Minus, Plus, UsersRound, UtensilsCrossed } from "lucide-react";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { Brand } from "@/components/Brand";
import PageSkeleton from "@/components/PageSkeleton";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { LIVE_BOOKING_KEY, readLiveBooking, serializeLiveSelection, type LiveRoomBooking } from "@/features/rooms/services/live-booking";
import { quoteRooms } from "@/features/rooms/services/public-rooms";
import { getPublicBookingExtras, type PublicBookingExtras } from "../services/public-booking-extras";
import { LiveBookingRoomSelection } from "../components/LiveBookingRoomSelection";
import ExperiencePackageModal from "../components/ExperiencePackageModal";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/booking.css";

type RoomExtras = { extraBeds: number; adultBreakfasts: number; childBreakfasts: number };
type Choice = { variantId: string; quantity: number };

const emptyRoom = (): RoomExtras => ({ extraBeds: 0, adultBreakfasts: 0, childBreakfasts: 0 });
const requestLabels: Record<string, { id: string; en: string }> = {
  baby_cot: { id: "Boks bayi", en: "Baby cot" },
  extra_person: { id: "Tamu tambahan", en: "Extra person" },
  early_check_in: { id: "Check-in lebih awal", en: "Early check-in" },
  late_check_out: { id: "Check-out lebih lambat", en: "Late check-out" },
};

export default function LiveBookingExtrasPage({ roomId, checkIn, checkOut, guests }: { roomId: string; checkIn: string; checkOut: string; guests: string }) {
  const { t, lang } = useTranslations({ en, id });
  const english = lang === "en";
  const [booking, setBooking] = useState<LiveRoomBooking | null>(null);
  const [catalog, setCatalog] = useState<PublicBookingExtras | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoting, setQuoting] = useState(false);
  const [error, setError] = useState("");
  const [roomExtras, setRoomExtras] = useState<RoomExtras[]>([]);
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [activeExperience, setActiveExperience] = useState<PublicBookingExtras["experiences"][number] | null>(null);
  const [requests, setRequests] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = readLiveBooking();
    if (!saved || saved.checkIn !== checkIn || saved.checkOut !== checkOut || saved.selection[0]?.roomId !== roomId) {
      setLoading(false);
      return;
    }
    setBooking(saved);
    setRoomExtras(saved.allocation.map((_, index) => saved.extras?.rooms[index] ?? emptyRoom()));
    setRequests(Object.fromEntries((saved.extras?.requestCodes ?? []).map((code) => [code, true])));
    setNote(saved.extras?.note ?? "");
    const controller = new AbortController();
    getPublicBookingExtras(saved.checkIn, saved.checkOut, saved.allocation.map((room) => room.roomTypeId), controller.signal)
      .then((data) => {
        setCatalog(data);
        setChoices(Object.fromEntries(data.experiences.flatMap((experience) => {
          const chosen = (saved.extras?.experiences ?? []).find((item) => experience.variants.some((variant) => variant.id === item.variantId));
          return chosen ? [[experience.id, chosen]] : [];
        })));
      })
      .catch((cause) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : String(cause)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [roomId, checkIn, checkOut]);

  const selectedExperiences = useMemo(() => Object.values(choices).filter((item) => item.quantity > 0), [choices]);
  const extrasKey = JSON.stringify({ roomExtras, selectedExperiences });

  useEffect(() => {
    if (!booking || !catalog || roomExtras.length !== booking.allocation.length) return;
    const controller = new AbortController();
    setQuoting(true);
    const timer = window.setTimeout(() => {
      quoteRooms({
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        totalAdults: booking.adults,
        totalChildren: booking.children,
        rooms: booking.allocation.map((room, index) => ({ ...room, ...roomExtras[index] })),
        experiences: selectedExperiences,
      }, controller.signal)
        .then((quote) => {
          setBooking((previous) => previous ? { ...previous, quote } : previous);
          setError("");
        })
        .catch((cause) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : String(cause)); })
        .finally(() => { if (!controller.signal.aborted) setQuoting(false); });
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [catalog, extrasKey, booking?.checkIn, booking?.checkOut, booking?.adults, booking?.children]);

  if (loading) return <PageSkeleton />;
  if (!booking || !catalog) return <main className="container booking-main"><h1>{t("extras.live.expiredTitle")}</h1><p>{error || t("extras.live.expiredDescription")}</p><a className="button button-primary" href="/rooms">{t("extras.live.backToRooms")}</a></main>;

  const currentBooking = booking;
  const nights = catalog.nights;
  const selectionQuery = serializeLiveSelection(booking.selection);
  const roomHref = `/rooms?${new URLSearchParams({ rooms: selectionQuery, checkIn, checkOut, guests })}`;
  const optionsByRoom = new Map(catalog.rooms.map((room) => [room.roomTypeId, room]));
  const diningExperiences = catalog.experiences.filter((experience) => /dining|food/i.test(`${experience.category.code} ${experience.category.name}`));
  const celebrationExperiences = catalog.experiences.filter((experience) => !/dining|food/i.test(`${experience.category.code} ${experience.category.name}`));

  function changeRoomExtra(index: number, key: keyof RoomExtras, value: number) {
    setRoomExtras((previous) => previous.map((room, rowIndex) => rowIndex === index ? { ...room, [key]: value } : room));
  }

  function saveExperience(experienceId: string, choice: Choice | null) {
    setChoices((previous) => {
      if (choice) return { ...previous, [experienceId]: choice };
      const next = { ...previous };
      delete next[experienceId];
      return next;
    });
    setActiveExperience(null);
  }

  async function continueBooking(skip: boolean) {
    if (quoting || (!skip && error)) return;
    setQuoting(true);
    try {
      const extras = skip ? {
        rooms: currentBooking.allocation.map(emptyRoom), experiences: [], specialRequests: "", requestCodes: [], note: "",
      } : {
        rooms: roomExtras,
        experiences: selectedExperiences,
        requestCodes: Object.keys(requests).filter((code) => requests[code]),
        note: note.trim(),
        specialRequests: [
          ...Object.keys(requests).filter((code) => requests[code]).map((code) => requestLabels[code]?.id ?? code),
          note.trim(),
        ].filter(Boolean).join("; "),
      };
      const quote = await quoteRooms({
        checkInDate: currentBooking.checkIn, checkOutDate: currentBooking.checkOut,
        totalAdults: currentBooking.adults, totalChildren: currentBooking.children,
        rooms: currentBooking.allocation.map((room, index) => ({ ...room, ...extras.rooms[index] })),
        experiences: extras.experiences,
      });
      const updated = { ...currentBooking, quote, extras };
      sessionStorage.setItem(LIVE_BOOKING_KEY, JSON.stringify(updated));
      const params = new URLSearchParams({ source: "website", room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
      navigateWithSkeleton(`/booking/guest-details?${params}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setQuoting(false);
    }
  }

  return <div className="booking-page booking-extras-page">
    <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#booking-summary" contactHref="/contact" />
    <main className="container booking-main">
      <nav className="booking-progress" aria-label={t("progress.ariaLabel")}>{["progress.selectRoom", "progress.addOns", "progress.guestDetails", "progress.payment"].map((label, index) => <div className={`booking-step${index === 1 ? " is-current" : ""}${index === 0 ? " is-complete" : ""}`} key={label}><span className="booking-step-circle">{index === 0 ? <Check size={18} /> : index + 1}</span><span>{t(label)}</span></div>)}</nav>
      <div className="booking-intro"><span className="booking-eyebrow">{t("extras.intro.eyebrow")}</span><h1>{t("extras.intro.title")}</h1><p>{t("extras.intro.description")}</p></div>
      <div className="booking-layout">
        <div className="booking-options">
          <div className="booking-stay-banner"><div><strong><BedDouble size={20} /> {t("extras.stayBanner.roomSelection")} <span>{t("extras.stayBanner.roomCount", { count: booking.quote.roomCount })}</span></strong><p><CalendarDays size={16} /> {checkIn} → {checkOut} ({nights} {english ? "nights" : "malam"})</p><p><UsersRound size={16} /> {guests}</p><LiveBookingRoomSelection booking={booking} nights={nights} /><small>{t("extras.stayBanner.roomSubtotal")} <b>{formatRoomPrice(booking.quote.roomTotal)}</b></small></div><a href={roomHref}>{t("extras.stayBanner.changeRoom")} <ArrowRight size={16} /></a></div>

          <section className="booking-section"><div className="booking-section-title"><span>{t("extras.roomAddons.badge")}</span><h2>{t("extras.roomAddons.title")}</h2></div><div className="booking-room-grid booking-live-room-grid">{booking.allocation.map((room, index) => {
            const available = optionsByRoom.get(room.roomTypeId);
            const selected = roomExtras[index] ?? emptyRoom();
            return <article className="booking-extra-card" key={`${room.roomTypeId}-${index}`}><div className="booking-extra-copy"><div className="booking-live-room-label"><div className="booking-extra-name"><BedDouble size={21} /><h3>{available?.roomTypeName ?? room.roomTypeId} · {english ? "Room" : "Kamar"} {index + 1}</h3></div><p>{room.adults} {english ? "adults" : "dewasa"}, {room.children} {english ? "children" : "anak"}</p></div>{available?.addOns.map((option) => {
              const field = option.code === "extra_bed" ? "extraBeds" : option.code === "adult_breakfast" ? "adultBreakfasts" : "childBreakfasts";
              const maximum = option.code === "extra_bed" ? option.maxQuantityPerRoom ?? 0 : option.code === "adult_breakfast" ? room.adults : room.children;
              if (maximum < 1) return null;
              const label = option.code === "extra_bed" ? "Extra Bed" : option.code === "adult_breakfast" ? (english ? "Adult breakfast" : "Sarapan dewasa") : (english ? "Child breakfast" : "Sarapan anak");
              return <div className="booking-extra-actions" key={option.code}><span className="booking-live-addon-label">{option.code.includes("breakfast") ? <Coffee size={17} /> : <BedDouble size={17} />}<span><strong>{label}</strong><small>{formatRoomPrice(option.price)} / {english ? "night" : "malam"}</small></span></span><div className="booking-quantity"><button type="button" disabled={selected[field] === 0} onClick={() => changeRoomExtra(index, field, selected[field] - 1)} aria-label={`Remove ${label}`}><Minus size={16} /></button><span>{selected[field]}</span><button type="button" disabled={selected[field] >= maximum} onClick={() => changeRoomExtra(index, field, selected[field] + 1)} aria-label={`Add ${label}`}><Plus size={16} /></button></div></div>;
            })}</div></article>;
          })}</div></section>

          {diningExperiences.length > 0 && <section className="booking-section"><div className="booking-food-hero"><Image src="/images/outdoor-dining.webp" alt={t("extras.food.heroAlt")} fill sizes="(max-width: 840px) 100vw, 60vw" /><div><span>EXPERIENCES · {t("extras.food.badge")}</span><h2>{t("extras.food.title")}</h2><p>{t("extras.food.description")}</p></div></div><div className="booking-card-list">{diningExperiences.map((experience) => {
            const chosen = choices[experience.id];
            const selectedVariant = experience.variants.find((variant) => variant.id === chosen?.variantId);
            const startingPrice = Math.min(...experience.variants.map((variant) => variant.price));
            return <button type="button" key={experience.id} className={`booking-extra-card booking-food-choice${chosen?.quantity ? " is-selected" : ""}`} onClick={() => setActiveExperience(experience)} aria-haspopup="dialog"><span className="booking-extra-copy"><span className="booking-extra-name"><span className="booking-food-name">{experience.name}</span>{chosen?.quantity ? <span className="booking-selected"><CheckCircle2 size={15} /> {t("extras.food.added")}</span> : null}</span><span className="booking-food-description">{experience.description}</span><span className="booking-extra-price"><small>{selectedVariant ? t("extras.moments.priceLabel") : t("extras.food.priceFrom")}</small> {formatRoomPrice(selectedVariant?.price ?? startingPrice)}<span>{t("extras.food.perPackage")}</span></span>{selectedVariant && <span className="booking-food-selection">{selectedVariant.name} × {chosen.quantity}</span>}</span><span className="booking-add-button">{chosen?.quantity ? t("extras.food.changePackage") : t("extras.food.selectPackage")}<ChevronRight size={17} /></span></button>;
          })}</div><p className="booking-section-note"><UtensilsCrossed size={17} /> {t("extras.food.note")}</p></section>}

          {celebrationExperiences.length > 0 && <section className="booking-section"><div className="booking-section-title is-clay"><span>EXPERIENCES · {t("extras.moments.badge")}</span><h2>{t("extras.moments.title")}</h2></div><div className="booking-moment-grid">{celebrationExperiences.map((experience) => {
            const chosen = choices[experience.id];
            const selectedVariant = experience.variants.find((variant) => variant.id === chosen?.variantId);
            const startingPrice = Math.min(...experience.variants.map((variant) => variant.price));
            return <button type="button" key={experience.id} className={`booking-extra-card booking-moment-choice${chosen?.quantity ? " is-selected" : ""}`} onClick={() => setActiveExperience(experience)} aria-haspopup="dialog"><span className="booking-moment-top">{/birthday/i.test(experience.name) ? <Cake size={22} /> : <Heart size={22} />}{chosen?.quantity ? <span className="booking-selected"><CheckCircle2 size={15} /> {t("extras.moments.selected")}</span> : null}</span><span className="booking-extra-copy"><span className="booking-food-name">{experience.name}</span><span className="booking-food-description">{experience.description}</span>{selectedVariant && <span className="booking-food-selection">{selectedVariant.name} × {chosen.quantity}</span>}</span><span className="booking-extra-actions"><span className="booking-extra-price"><small>{selectedVariant ? t("extras.moments.priceLabel") : t("extras.moments.priceFrom")}</small> {formatRoomPrice(selectedVariant?.price ?? startingPrice)}<span>{t("extras.moments.perPackage")}</span></span><span className="booking-add-button">{chosen?.quantity ? t("extras.moments.changePackage") : t("extras.moments.selectPackage")}<ChevronRight size={17} /></span></span></button>;
          })}</div></section>}

          <section className="booking-request-section"><div className="booking-section-title"><span>{t("extras.requests.badge")}</span><h2>{t("extras.requests.title")}</h2><p>{t("extras.requests.description")}</p></div><div className="booking-request-grid">{catalog.requests.map(({ code }) => <div className="booking-request-card" key={code}><div><Clock3 size={23} /><span><strong>{requestLabels[code]?.[english ? "en" : "id"] ?? code}</strong><small>{t("extras.requests.statusByRequest")}</small></span></div><button type="button" aria-pressed={!!requests[code]} onClick={() => setRequests((current) => ({ ...current, [code]: !current[code] }))}>{requests[code] ? t("extras.requests.cancel") : t("extras.requests.submitRequest")}</button></div>)}</div><label className="booking-note-label" htmlFor="booking-special-note">{t("extras.requests.noteLabel")}</label><textarea id="booking-special-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder={t("extras.requests.notePlaceholder")} /></section>
        </div>

        <aside className="booking-summary" id="booking-summary"><div className="booking-summary-header"><h2>{t("extras.summary.title")}</h2><span>{t("extras.summary.step")}</span></div><div className="booking-summary-stay"><strong>{t("extras.summary.stayLine", { count: booking.quote.roomCount, nights })}</strong><span><CalendarDays size={16} /> {checkIn} – {checkOut}</span><span><UsersRound size={16} /> {guests}</span></div><div className="booking-summary-cost"><h3>{t("extras.summary.costTitle")}</h3><LiveBookingRoomSelection booking={booking} nights={nights} /><div className="booking-summary-row"><span>{t("extras.summary.roomSubtotal", { count: booking.quote.roomCount, nights })}</span><strong>{formatRoomPrice(booking.quote.roomTotal)}</strong></div><div className="booking-summary-addons"><h4>{t("extras.summary.addonsTitle")}</h4>{(booking.quote.extraBedTotal ?? 0) > 0 && <div className="booking-summary-row"><span>Extra Bed</span><strong>{formatRoomPrice(booking.quote.extraBedTotal ?? 0)}</strong></div>}{(booking.quote.breakfastTotal ?? 0) > 0 && <div className="booking-summary-row"><span>{english ? "Breakfast" : "Sarapan"}</span><strong>{formatRoomPrice(booking.quote.breakfastTotal ?? 0)}</strong></div>}{(booking.quote.experienceTotal ?? 0) > 0 && <div className="booking-summary-row"><span>Experiences</span><strong>{formatRoomPrice(booking.quote.experienceTotal ?? 0)}</strong></div>}{!booking.quote.extraBedTotal && !booking.quote.breakfastTotal && !booking.quote.experienceTotal && <p>{t("extras.summary.noPaidOptions")}</p>}</div><div className="booking-summary-total"><span><strong>{t("extras.summary.estimatedTotal")}</strong><small>{t("extras.summary.taxIncluded")}</small></span><strong>{formatRoomPrice(booking.quote.bookingTotal)}</strong></div></div>{error && <p role="alert" style={{ color: "#bb3d32" }}>{error}</p>}<div className="booking-summary-actions"><button type="button" className="button button-primary" disabled={quoting || !!error} onClick={() => continueBooking(false)}>{quoting ? (english ? "Updating..." : "Memperbarui...") : t("extras.summary.continue")} <ArrowRight size={18} /></button><button type="button" disabled={quoting} onClick={() => continueBooking(true)}>{t("extras.summary.skip")}</button></div></aside>
      </div>
    </main>
    {activeExperience && <ExperiencePackageModal key={activeExperience.id} experience={activeExperience} choice={choices[activeExperience.id]} onSave={(choice) => saveExperience(activeExperience.id, choice)} onClose={() => setActiveExperience(null)} />}
    <footer className="booking-footer theme-footer"><div className="container booking-footer-inner"><div className="booking-footer-grid"><div className="booking-footer-about"><Brand href="/" /><p>{t("footer.about")}</p><span><MapPin size={17} /> {t("footer.address")}</span></div><div><strong>{t("footer.navTitle")}</strong><a href="/">{t("footer.navAbout")}</a><a href="/rooms">{t("footer.navRooms")}</a><a href="/#location">{t("footer.navRouteGuide")}</a><a href="/rooms">{t("footer.navReservationPolicy")}</a></div><div><strong>{t("footer.helpTitle")}</strong><a href="/contact">{t("footer.helpContact")}</a><a href="/contact">{t("footer.helpPrivacy")}</a><a href="/contact">{t("footer.helpFaq")}</a></div></div><div className="booking-footer-bottom"><span>{t("extras.live.footer")}</span><a href="/rooms">{t("footer.backToRooms")} <ChevronRight size={15} /></a></div></div></footer>
  </div>;
}
