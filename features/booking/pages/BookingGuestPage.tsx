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
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { GUEST_DRAFT_KEY, bookingExtraLabels, bookingExtraPrices, getExtraCost, getNights, type GuestDraft, type PaidExtraId } from "@/features/booking/constants/booking-data";
import { formatRoomPrice, getRoom } from "@/features/rooms/constants/rooms-data";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import "../styles/booking.css";
import "../styles/guest.css";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";
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
};

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatStayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

export default function BookingGuestPage({ roomId, roomSelection, checkIn, checkOut, guests, counts }: Props) {
  const { t } = useTranslations({ en, id });
  const room = getRoom(roomId);
  const selectionQuery = serializeRoomSelection(roomSelection);
  const totalRooms = countSelectedRooms(roomSelection);
  const [fullName, setFullName] = useState(demoGuestContact.fullName);
  const [nationality, setNationality] = useState<GuestNationalityCode>(demoGuestContact.nationality);
  const [whatsapp, setWhatsapp] = useState(demoGuestContact.whatsapp);
  const [email, setEmail] = useState(demoGuestContact.email);
  const selectedNationality = getGuestNationality(nationality);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(GUEST_DRAFT_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved) as Partial<GuestDraft> | null;
      if (!draft || typeof draft !== "object") return;
      const savedNationality = getGuestNationality(draft.nationality);
      setNationality(savedNationality.code);
      setFullName(typeof draft.fullName === "string" && draft.fullName.trim() ? draft.fullName : demoGuestContact.fullName);
      setWhatsapp(typeof draft.whatsapp === "string" && draft.whatsapp.trim() ? normalizeLocalWhatsapp(draft.whatsapp, savedNationality.dialCode) : demoGuestContact.whatsapp);
      setEmail(typeof draft.email === "string" && draft.email.trim() ? draft.email : demoGuestContact.email);
    } catch {
      // The form remains usable when browser storage is unavailable.
    }
  }, []);
  if (!room) return null;

  const nights = getNights(checkIn, checkOut);
  const selectedExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const roomTotal = getRoomSelectionTotal(roomSelection, nights);
  const extrasTotal = selectedExtras.reduce((total, id) => total + getExtraCost(id, counts[id], nights), 0);
  const step2Params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
  const backHref = `/booking/extras?${step2Params}`;
  const roomHref = `/rooms?${new URLSearchParams({ rooms: selectionQuery, checkIn, checkOut, guests })}`;

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify({ fullName, nationality, whatsapp: `${selectedNationality.dialCode}${whatsapp}`, email } satisfies GuestDraft)); } catch { /* The demo flow can continue. */ }
    const params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
    for (const id of selectedExtras) params.set(id, String(counts[id]));
    window.location.assign(`/booking/payment?${params}`);
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

        <div className="guest-intro"><span className="booking-eyebrow">{t("guest.intro.eyebrow")}</span><h1>{t("guest.intro.title")}</h1><p>{t("guest.intro.description")}</p></div>

        <div className="guest-layout">
          <div className="guest-left">
            <section className="guest-form-card" aria-labelledby="guest-form-title">
              <div className="guest-form-heading"><div><h2 id="guest-form-title">{t("guest.form.title")}</h2><p>{t("guest.form.description")}</p></div><BadgeCheck size={26} /></div>
              <form id="guest-form" onSubmit={handleContinue}>
                <div className="guest-field"><label htmlFor="guest-full-name"><span>{t("guest.form.fullNameLabel")} <b>*</b></span><small>{t("guest.form.fullNameHint")}</small></label><div className="guest-input-wrap"><input id="guest-full-name" name="fullName" type="text" autoComplete="name" placeholder={t("guest.form.fullNamePlaceholder")} value={fullName} onChange={(event) => setFullName(event.target.value)} required /><UserRound size={21} /></div><p><Info size={15} /> {t("guest.form.fullNameNote")}</p></div>
                <div className="guest-field"><label htmlFor="guest-nationality"><span>{t("guest.form.nationalityLabel")} <b>*</b></span><small>{t("guest.form.nationalityHint")}</small></label><div className="guest-input-wrap"><select id="guest-nationality" name="nationality" autoComplete="country" value={nationality} onChange={(event) => setNationality(getGuestNationality(event.target.value).code)} required>{guestNationalities.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name}</option>)}</select></div></div>
                <div className="guest-field"><label htmlFor="guest-whatsapp"><span>{t("guest.form.whatsappLabel")} <b>*</b></span><small>{t("guest.form.whatsappHint")}</small></label><div className="guest-phone-wrap"><span className="guest-phone-code"><span aria-hidden="true">{selectedNationality.flag}</span><strong>{selectedNationality.dialCode}</strong></span><input id="guest-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national" placeholder={selectedNationality.phoneExample} pattern="[1-9][0-9]{5,13}" maxLength={20} title={t("guest.form.whatsappTitle")} value={whatsapp} onChange={(event) => setWhatsapp(normalizeLocalWhatsapp(event.target.value, selectedNationality.dialCode))} required /><MessageCircle size={21} /></div><p><Info size={15} /> {t("guest.form.whatsappNote")}</p></div>
                <div className="guest-field"><label htmlFor="guest-email"><span>{t("guest.form.emailLabel")} <b>*</b></span><small>{t("guest.form.emailHint")}</small></label><div className="guest-input-wrap"><input id="guest-email" name="email" type="email" autoComplete="email" placeholder={t("guest.form.emailPlaceholder")} value={email} onChange={(event) => setEmail(event.target.value)} required /><Mail size={21} /></div><p><Info size={15} /> {t("guest.form.emailNote")}</p></div>
                <div className="guest-security"><LockKeyhole size={21} /><span>{t("guest.form.security")}</span></div>
              </form>
            </section>

            <a className="guest-back-link" href={backHref}><ArrowLeft size={19} /> {t("guest.form.backLink")}</a>

            <div className="guest-resort-note"><div className="guest-resort-photo"><Image src="/images/hero-resort.webp" alt={t("guest.resortNote.imageAlt")} fill sizes="(max-width: 640px) 100vw, 180px" /></div><div><span>{t("guest.resortNote.brand")}</span><p>{t("guest.resortNote.text")}</p></div></div>
          </div>

          <aside className="guest-summary" id="guest-summary" aria-label={t("guest.summary.ariaLabel")}><div className="guest-summary-header"><h2>{t("guest.summary.title")}</h2><span>{t("guest.summary.step")}</span></div><div className="guest-summary-content"><div className="guest-summary-stay"><div className="guest-summary-room"><div><h3>{t("guest.summary.roomLine", { count: totalRooms, nights })}</h3><p>{t("guest.summary.brand")}</p></div><a href={roomHref}>{t("guest.summary.change")}</a></div><div className="guest-schedule"><div><span>{t("guest.summary.checkIn")}</span><strong>{formatStayDate(checkIn)}</strong><small>{t("guest.summary.checkInTime")}</small></div><div><span>{t("guest.summary.checkOut")}</span><strong>{formatStayDate(checkOut)}</strong><small>{t("guest.summary.checkOutTime")}</small></div></div><p><UsersRound size={16} /> {t("guest.summary.guestsLine", { guests, count: totalRooms })}</p></div>
            <BookingRoomSelection selection={roomSelection} nights={nights} /><div className="guest-summary-prices"><div className="guest-price-row"><span>{t("guest.summary.roomSubtotal", { count: totalRooms, nights })}</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="guest-selected-extras"><h4>{t("guest.summary.selectedExtrasTitle")}</h4>{selectedExtras.length ? selectedExtras.map((id) => <div className="guest-price-row" key={id}><span>{bookingExtraLabels[id]} {id === "extra-bed" ? t("guest.summary.extraBedUnit", { nights }) : counts[id] > 1 ? t("guest.summary.countUnit", { count: counts[id] }) : ""}</span><strong>{formatRoomPrice(getExtraCost(id, counts[id], nights))}</strong></div>) : <p>{t("guest.summary.noPaidExtras")}</p>}</div><div className="guest-hot-spring"><Flame size={18} /> {t("guest.summary.hotSpring")}</div></div>
            <div className="guest-total"><div><span>{t("guest.summary.estimatedTotal")}</span><strong>{formatRoomPrice(roomTotal + extrasTotal)}</strong></div><small>{t("guest.summary.taxIncluded")}</small></div><button type="submit" form="guest-form" className="button button-primary guest-continue">{t("guest.summary.continue")} <ArrowRight size={19} /></button><div className="guest-policy-note"><BadgeCheck size={20} /><span><strong>{t("guest.summary.policyTitle")}</strong>{t("guest.summary.policyNote")}</span></div></div></aside>
        </div>
      </main>
      <footer className="guest-footer theme-footer"><div className="container guest-footer-grid"><div><Brand href="/" /><p>{t("guest.footer.about")}</p></div><div><strong>{t("guest.footer.exploreTitle")}</strong><a href="/">{t("guest.footer.exploreHome")}</a><a href="/rooms">{t("guest.footer.exploreRooms")}</a><a href="/facilities">{t("guest.footer.exploreFacilities")}</a></div><div><strong>{t("guest.footer.contactTitle")}</strong><span>{t("guest.footer.contactAddress")}</span><span>{t("guest.footer.contactEmail")}</span></div></div><div className="container guest-footer-bottom">{t("guest.footer.bottom")}</div></footer>
    </div>
  );
}
