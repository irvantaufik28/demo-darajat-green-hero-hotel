"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Flame,
  Info,
  LockKeyhole,
  Mail,
  MessageCircle,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import PageSkeleton from "@/components/PageSkeleton";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { GUEST_DRAFT_KEY, bookingExtraLabels, bookingExtraPrices, getExtraCost, getNights, type GuestDraft, type PaidExtraId } from "@/features/booking/constants/booking-data";
import { formatRoomPrice, getRoom } from "@/features/rooms/constants/rooms-data";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import "../styles/booking.css";
import "../styles/guest.css";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";
import { LiveBookingRoomSelection } from "../components/LiveBookingRoomSelection";
import { LIVE_BOOKING_KEY, LIVE_GUEST_DRAFT_KEY, liveBookingFingerprint, readLiveBooking, serializeLiveSelection, type LiveRoomBooking } from "@/features/rooms/services/live-booking";
import { quoteRooms } from "@/features/rooms/services/public-rooms";
import { demoGuestContact, guestNationalities, getGuestNationality, normalizeLocalWhatsapp, type GuestNationalityCode } from "@/features/booking/constants/guest-contact-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

type Props = {
  roomId: string;
  roomSelection: RoomSelection;
  checkIn: string;
  checkOut: string;
  guests: string;
  counts: Record<PaidExtraId, number>;
  liveMode?: boolean;
};

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatStayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

export default function BookingGuestPage({ roomId, roomSelection, checkIn, checkOut, guests, counts, liveMode = false }: Props) {
  const { t, lang } = useTranslations({ en, id });
  const room = getRoom(roomId);
  const [liveBooking, setLiveBooking] = useState<LiveRoomBooking | null>(null);
  const [liveLoading, setLiveLoading] = useState(liveMode);
  const [saveMessage, setSaveMessage] = useState("");
  const selectionQuery = liveBooking ? serializeLiveSelection(liveBooking.selection) : serializeRoomSelection(roomSelection);
  const totalRooms = liveBooking?.quote.roomCount ?? countSelectedRooms(roomSelection);
  const [fullName, setFullName] = useState(liveMode ? "" : demoGuestContact.fullName);
  const [nationality, setNationality] = useState<GuestNationalityCode>(demoGuestContact.nationality);
  const [whatsapp, setWhatsapp] = useState(liveMode ? "" : demoGuestContact.whatsapp);
  const [email, setEmail] = useState(liveMode ? "" : demoGuestContact.email);
  const selectedNationality = getGuestNationality(nationality);

  useEffect(() => { setSaveMessage(""); }, [fullName, nationality, whatsapp, email]);

  useEffect(() => {
    if (!liveMode) return;
    const booking = readLiveBooking();
    if (booking?.checkIn !== checkIn || booking.checkOut !== checkOut || booking.selection[0]?.roomId !== roomId) {
      setLiveLoading(false);
      return;
    }
    const controller = new AbortController();
    quoteRooms({ checkInDate: booking.checkIn, checkOutDate: booking.checkOut, totalAdults: booking.adults, totalChildren: booking.children, rooms: booking.allocation.map((room, index) => ({ ...room, ...booking.extras?.rooms[index] })), experiences: booking.extras?.experiences }, controller.signal)
      .then((quote) => {
        const refreshed = { ...booking, quote };
        setLiveBooking(refreshed);
        try { sessionStorage.setItem(LIVE_BOOKING_KEY, JSON.stringify(refreshed)); } catch { /* Keep this page's verified quote. */ }
      })
      .catch(() => { if (!controller.signal.aborted) setLiveBooking(null); })
      .finally(() => { if (!controller.signal.aborted) setLiveLoading(false); });
    return () => controller.abort();
  }, [liveMode, checkIn, checkOut, roomId]);

  useEffect(() => {
    try {
      const booking = liveMode ? readLiveBooking() : null;
      const saved = sessionStorage.getItem(liveMode ? LIVE_GUEST_DRAFT_KEY : GUEST_DRAFT_KEY);
      if (!saved) return;
      const stored = JSON.parse(saved) as Partial<GuestDraft> | { bookingKey?: string; draft?: Partial<GuestDraft> } | null;
      if (liveMode && (!booking || !stored || !("bookingKey" in stored) || stored.bookingKey !== liveBookingFingerprint(booking))) return;
      const draft = liveMode && stored && "draft" in stored ? stored.draft : stored as Partial<GuestDraft> | null;
      if (!draft || typeof draft !== "object") return;
      const savedNationality = getGuestNationality(draft.nationality);
      setNationality(savedNationality.code);
      setFullName(typeof draft.fullName === "string" && draft.fullName.trim() ? draft.fullName : liveMode ? "" : demoGuestContact.fullName);
      setWhatsapp(typeof draft.whatsapp === "string" && draft.whatsapp.trim() ? normalizeLocalWhatsapp(draft.whatsapp, savedNationality.dialCode) : liveMode ? "" : demoGuestContact.whatsapp);
      setEmail(typeof draft.email === "string" && draft.email.trim() ? draft.email : liveMode ? "" : demoGuestContact.email);
    } catch {
      // The form remains usable when browser storage is unavailable.
    }
  }, [liveMode]);
  if (liveLoading) return <PageSkeleton />;
  if (liveMode && !liveBooking) return <main className="container booking-main"><h1>{t("guest.live.expiredTitle")}</h1><p>{t("guest.live.expiredDescription")}</p><a className="button button-primary" href="/rooms">{t("guest.live.backToRooms")}</a></main>;
  if (!room && !liveMode) return null;

  const nights = getNights(checkIn, checkOut);
  const selectedExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const roomTotal = liveBooking?.quote.roomTotal ?? getRoomSelectionTotal(roomSelection, nights);
  const extrasTotal = liveBooking ? liveBooking.quote.bookingTotal - liveBooking.quote.roomTotal : selectedExtras.reduce((total, id) => total + getExtraCost(id, counts[id], nights), 0);
  const liveExtraLines = liveBooking ? [
    { label: "Extra Bed", amount: liveBooking.quote.extraBedTotal ?? 0 },
    { label: lang === "en" ? "Breakfast" : "Sarapan", amount: liveBooking.quote.breakfastTotal ?? 0 },
    { label: "Experiences", amount: liveBooking.quote.experienceTotal ?? 0 },
  ].filter((item) => item.amount > 0) : [];
  const step2Params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
  if (liveMode) step2Params.set("source", "website");
  const backHref = `/booking/extras?${step2Params}`;
  const roomHref = `/rooms?${new URLSearchParams({ rooms: selectionQuery, checkIn, checkOut, guests })}`;

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (liveMode) {
      if (!liveBooking) return;
      const draft: GuestDraft = { fullName: fullName.trim(), nationality, whatsapp: `${selectedNationality.dialCode}${whatsapp}`, email: email.trim() };
      try {
        sessionStorage.setItem(LIVE_GUEST_DRAFT_KEY, JSON.stringify({ bookingKey: liveBookingFingerprint(liveBooking), draft }));
        const params = new URLSearchParams({ source: "website", room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
        navigateWithSkeleton(`/booking/payment?${params}`);
      } catch {
        setSaveMessage(t("guest.live.saveError"));
      }
      return;
    }
    try { sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify({ fullName, nationality, whatsapp: `${selectedNationality.dialCode}${whatsapp}`, email } satisfies GuestDraft)); } catch { /* The demo flow can continue. */ }
    const params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
    for (const id of selectedExtras) params.set(id, String(counts[id]));
    navigateWithSkeleton(`/booking/payment?${params}`);
  }

  return (
    <div className="booking-page guest-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#guest-summary" contactHref="/contact" />
      <main className="container booking-main guest-main">
        <nav className="booking-progress" aria-label={t("progress.ariaLabel")}>
          {["progress.selectRoom", "progress.addOns", "progress.guestDetails", "progress.payment"].map((label, index) => (
            <div className={`booking-step${index < 2 ? " is-complete" : ""}${index === 2 ? " is-current" : ""}`} key={label}>
              <span className="booking-step-circle">{index < 2 ? <Check size={18} /> : index + 1}</span><span>{t(label)}</span>
            </div>
          ))}
        </nav>

        <div className="guest-intro"><span className="booking-eyebrow">{t("guest.intro.eyebrow")}</span><h1>{t("guest.intro.title")}</h1><p>{liveMode ? t("guest.live.description") : t("guest.intro.description")}</p></div>

        <div className="guest-layout">
          <div className="guest-left">
            <section className="guest-form-card" aria-labelledby="guest-form-title">
              <div className="guest-form-heading"><div><h2 id="guest-form-title">{t("guest.form.title")}</h2><p>{t("guest.form.description")}</p></div><BadgeCheck size={26} /></div>
              <form id="guest-form" onSubmit={handleContinue}>
                <div className="guest-field"><label htmlFor="guest-full-name"><span>{t("guest.form.fullNameLabel")} <b>*</b></span><small>{t("guest.form.fullNameHint")}</small></label><div className="guest-input-wrap"><input id="guest-full-name" name="fullName" type="text" autoComplete="name" placeholder={t("guest.form.fullNamePlaceholder")} value={fullName} onChange={(event) => setFullName(event.target.value)} required /><UserRound size={21} /></div><p><Info size={15} /> {t("guest.form.fullNameNote")}</p></div>
                <div className="guest-field"><label htmlFor="guest-nationality"><span>{t("guest.form.nationalityLabel")} <b>*</b></span><small>{t("guest.form.nationalityHint")}</small></label><div className="guest-input-wrap"><select id="guest-nationality" name="nationality" autoComplete="country" value={nationality} onChange={(event) => setNationality(getGuestNationality(event.target.value).code)} required>{guestNationalities.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name}</option>)}</select></div></div>
                <div className="guest-field"><label htmlFor="guest-whatsapp"><span>{t("guest.form.whatsappLabel")} <b>*</b></span><small>{t("guest.form.whatsappHint")}</small></label><div className="guest-phone-wrap"><span className="guest-phone-code"><span aria-hidden="true">{selectedNationality.flag}</span><strong>{selectedNationality.dialCode}</strong></span><input id="guest-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national" placeholder={selectedNationality.phoneExample} pattern="[1-9][0-9]{5,13}" maxLength={20} title={t("guest.form.whatsappTitle")} value={whatsapp} onChange={(event) => setWhatsapp(normalizeLocalWhatsapp(event.target.value, selectedNationality.dialCode))} required /><MessageCircle size={21} /></div><p><Info size={15} /> {t("guest.form.whatsappNote")}</p></div>
                <div className="guest-field"><label htmlFor="guest-email"><span>{t("guest.form.emailLabel")} <b>*</b></span><small>{t("guest.form.emailHint")}</small></label><div className="guest-input-wrap"><input id="guest-email" name="email" type="email" autoComplete="email" placeholder={t("guest.form.emailPlaceholder")} value={email} onChange={(event) => setEmail(event.target.value)} required /><Mail size={21} /></div><p><Info size={15} /> {t("guest.form.emailNote")}</p></div>
                <div className="guest-security"><LockKeyhole size={21} /><span>{liveMode ? t("guest.live.security") : t("guest.form.security")}</span></div>
                {saveMessage && <p role="status" className="guest-save-message">{saveMessage}</p>}
              </form>
            </section>

            <a className="guest-back-link" href={backHref}><ArrowLeft size={19} /> {t("guest.form.backLink")}</a>

            <div className="guest-resort-note"><div className="guest-resort-photo"><Image src="/images/hero-resort.webp" alt={t("guest.resortNote.imageAlt")} fill sizes="(max-width: 640px) 100vw, 180px" /></div><div><span>{t("guest.resortNote.brand")}</span><p>{t("guest.resortNote.text")}</p></div></div>
          </div>

          <aside className="guest-summary" id="guest-summary" aria-label={t("guest.summary.ariaLabel")}><div className="guest-summary-header"><h2>{t("guest.summary.title")}</h2><span>{t("guest.summary.step")}</span></div><div className="guest-summary-content"><div className="guest-summary-stay"><div className="guest-summary-room"><div><h3>{t("guest.summary.roomLine", { count: totalRooms, nights })}</h3><p>{t("guest.summary.brand")}</p></div><a href={roomHref}>{t("guest.summary.change")}</a></div><div className="guest-schedule"><div><span>{t("guest.summary.checkIn")}</span><strong>{formatStayDate(checkIn)}</strong>{!liveMode && <small>{t("guest.summary.checkInTime")}</small>}</div><div><span>{t("guest.summary.checkOut")}</span><strong>{formatStayDate(checkOut)}</strong>{!liveMode && <small>{t("guest.summary.checkOutTime")}</small>}</div></div><p><UsersRound size={16} /> {t("guest.summary.guestsLine", { guests, count: totalRooms })}</p></div>
            {liveBooking ? <LiveBookingRoomSelection booking={liveBooking} nights={nights} /> : <BookingRoomSelection selection={roomSelection} nights={nights} />}<div className="guest-summary-prices"><div className="guest-price-row"><span>{t("guest.summary.roomSubtotal", { count: totalRooms, nights })}</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="guest-selected-extras"><h4>{t("guest.summary.selectedExtrasTitle")}</h4>{liveMode ? liveExtraLines.length ? liveExtraLines.map((item) => <div className="guest-price-row" key={item.label}><span>{item.label}</span><strong>{formatRoomPrice(item.amount)}</strong></div>) : <p>{t("guest.summary.noPaidExtras")}</p> : selectedExtras.length ? selectedExtras.map((id) => <div className="guest-price-row" key={id}><span>{bookingExtraLabels[id]} {id === "extra-bed" ? t("guest.summary.extraBedUnit", { nights }) : counts[id] > 1 ? t("guest.summary.countUnit", { count: counts[id] }) : ""}</span><strong>{formatRoomPrice(getExtraCost(id, counts[id], nights))}</strong></div>) : <p>{t("guest.summary.noPaidExtras")}</p>}</div>{!liveMode && <div className="guest-hot-spring"><Flame size={18} /> {t("guest.summary.hotSpring")}</div>}</div>
            <div className="guest-total"><div><span>{t("guest.summary.estimatedTotal")}</span><strong>{formatRoomPrice(roomTotal + extrasTotal)}</strong></div><small>{liveMode ? t("guest.live.totalNote") : t("guest.summary.taxIncluded")}</small></div><button type="submit" form="guest-form" className="button button-primary guest-continue">{liveMode ? t("guest.live.save") : t("guest.summary.continue")} <ArrowRight size={19} /></button><div className="guest-policy-note"><BadgeCheck size={20} /><span><strong>{t("guest.summary.policyTitle")}</strong>{liveMode ? t("guest.live.policyNote") : t("guest.summary.policyNote")}</span></div></div></aside>
        </div>
      </main>
      <footer className="guest-footer theme-footer"><div className="container guest-footer-grid"><div><Brand href="/" /><p>{t("guest.footer.about")}</p></div><div><strong>{t("guest.footer.exploreTitle")}</strong><a href="/">{t("guest.footer.exploreHome")}</a><a href="/rooms">{t("guest.footer.exploreRooms")}</a><a href="/facilities">{t("guest.footer.exploreFacilities")}</a></div><div><strong>{t("guest.footer.contactTitle")}</strong><span>{t("guest.footer.contactAddress")}</span><span>{t("guest.footer.contactEmail")}</span></div></div><div className="container guest-footer-bottom">{liveMode ? t("guest.live.footer") : t("guest.footer.bottom")}</div></footer>
    </div>
  );
}
