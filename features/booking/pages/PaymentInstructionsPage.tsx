"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, CalendarDays, Check, ChevronDown, Clock3, Copy, Info, LockKeyhole, Mail, MessageCircle, RefreshCw, UsersRound, UserRound, Wallet, Zap } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { GUEST_DRAFT_KEY, bookingExtraLabels, bookingExtraPrices, getExtraCost, getNights, type GuestDraft, type PaidExtraId } from "@/features/booking/constants/booking-data";
import { formatRoomPrice, getRoom } from "@/features/rooms/constants/rooms-data";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import "../styles/booking.css";
import "../styles/instructions.css";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";
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

const virtualAccount = "8277000000000000";
const displayedAccount = "8277 0000 0000 0000";
const reservationNumber = "GHD-DEMO-00124";
const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatStay(checkIn: string, checkOut: string) {
  const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
  const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);
  if (startYear === endYear && startMonth === endMonth) return `${startDay} – ${endDay} ${months[startMonth - 1]} ${startYear}`;
  return `${startDay} ${months[startMonth - 1]} ${startYear} – ${endDay} ${months[endMonth - 1]} ${endYear}`;
}

export default function PaymentInstructionsPage({ roomId, roomSelection, checkIn, checkOut, guests, counts }: Props) {
  const { t } = useTranslations({ en, id });
  const room = getRoom(roomId);
  const selectionQuery = serializeRoomSelection(roomSelection);
  const totalRooms = countSelectedRooms(roomSelection);
  const [guest, setGuest] = useState<GuestDraft | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [deadlineLabel, setDeadlineLabel] = useState(t("instructions.timer.preparing"));
  const [message, setMessage] = useState("");
  const nights = getNights(checkIn, checkOut);
  const selectedExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const roomTotal = getRoomSelectionTotal(roomSelection, nights);
  const extrasTotal = selectedExtras.reduce((sum, id) => sum + getExtraCost(id, counts[id], nights), 0);
  const total = roomTotal + extrasTotal;
  const params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests, method: "bca" });
  for (const id of selectedExtras) params.set(id, String(counts[id]));
  const paymentHref = `/booking/payment?${params}`;
  const timerKey = `green-hero-demo-payment-deadline:${params}`;

  useEffect(() => {
    let deadline = Date.now() + 30 * 60 * 1000;
    try {
      const savedGuest = sessionStorage.getItem(GUEST_DRAFT_KEY);
      if (savedGuest) {
        const draft = JSON.parse(savedGuest) as Partial<GuestDraft>;
        if (typeof draft.fullName === "string" && typeof draft.whatsapp === "string" && typeof draft.email === "string") setGuest(draft as GuestDraft);
      }
    } catch { /* Missing browser storage does not prevent the demo. */ }
    try {
      const savedDeadline = Number(sessionStorage.getItem(timerKey));
      if (Number.isFinite(savedDeadline) && savedDeadline > 0) deadline = savedDeadline;
      else sessionStorage.setItem(timerKey, String(deadline));
    } catch { /* Use a local countdown when browser storage is unavailable. */ }
    setDeadlineLabel(t("instructions.timer.deadlineValue", { date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(deadline), time: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Jakarta" }).format(deadline) }));
    function updateCountdown() { setSecondsRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))); }
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [timerKey]);

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(t("instructions.messages.copySuccess", { label }));
    } catch { setMessage(t("instructions.messages.copyFail", { label: label.toLowerCase() })); }
  }

  if (!room) return null;
  const accountName = t("instructions.account.accountNameValue", { name: guest?.fullName || t("instructions.account.accountNameFallback") });
  const countdown = secondsRemaining === null ? "--:--" : `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(secondsRemaining % 60).padStart(2, "0")}`;
  const expired = secondsRemaining === 0;
  const guides = [
    { title: t("instructions.guides.mbca.title"), steps: [t("instructions.guides.mbca.step1"), t("instructions.guides.mbca.step2"), t("instructions.guides.mbca.step3", { account: displayedAccount }), t("instructions.guides.mbca.step4", { name: accountName, total: formatRoomPrice(total) }), t("instructions.guides.mbca.step5")] },
    { title: t("instructions.guides.klikbca.title"), steps: [t("instructions.guides.klikbca.step1"), t("instructions.guides.klikbca.step2"), t("instructions.guides.klikbca.step3", { account: displayedAccount }), t("instructions.guides.klikbca.step4", { total: formatRoomPrice(total) }), t("instructions.guides.klikbca.step5")] },
    { title: t("instructions.guides.atmbca.title"), steps: [t("instructions.guides.atmbca.step1"), t("instructions.guides.atmbca.step2"), t("instructions.guides.atmbca.step3", { account: displayedAccount }), t("instructions.guides.atmbca.step4", { total: formatRoomPrice(total) })] },
    { title: t("instructions.guides.otherBank.title"), steps: [t("instructions.guides.otherBank.step1"), t("instructions.guides.otherBank.step2")] },
  ];

  return (
    <div className="booking-page payment-instructions-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="/rooms" contactHref="/contact" />
      <main className="container booking-main instructions-main">
        <nav className="booking-progress" aria-label={t("progress.ariaLabel")}>{["progress.selectRoom", "progress.addOns", "progress.guestDetails", "progress.payment"].map((label, index) => <div key={label} className={`booking-step${index < 3 ? " is-complete" : " is-current"}`} aria-current={index === 3 ? "step" : undefined}><span className="booking-step-circle">{index < 3 ? <Check size={18} /> : 4}</span><span>{t(label)}</span></div>)}</nav>
        <header className="instructions-intro"><div><span className="instructions-eyebrow"><i /> {t("instructions.intro.eyebrow")}</span><h1>{t("instructions.intro.title")}</h1><p>{t("instructions.intro.description")}</p></div><div className="instructions-identification"><span>{t("instructions.intro.reservationNumber")} <strong>{reservationNumber}</strong></span><span className="instructions-pending"><i /> {expired ? t("instructions.intro.expired") : t("instructions.intro.pending")}</span></div></header>
        <div className="instructions-demo"><Info size={18} /><span>{t("instructions.demoBanner")}</span></div>
        <div className="instructions-layout">
          <div className="instructions-left">
            <section className="instructions-card instructions-account" aria-labelledby="instructions-account-title">
              <div className="instructions-account-heading"><div><span className="instructions-bank">BCA</span><div><h2 id="instructions-account-title">{t("instructions.account.title")}</h2><p>{t("instructions.account.subtitle")}</p></div></div><span className="instructions-automatic"><Zap size={15} /> {t("instructions.account.autoConfirm")}</span></div>
              <div className="instructions-va"><span>{t("instructions.account.vaLabel")} <small>{t("instructions.demoLabel")}</small></span><div><strong>{displayedAccount}</strong><button type="button" onClick={() => copyValue(virtualAccount, t("instructions.messages.copyVaLabel"))}><Copy size={17} /> {t("instructions.account.copyVa")}</button></div></div>
              <div className="instructions-account-grid"><div><span>{t("instructions.account.accountNameLabel")}</span><strong>{accountName}</strong></div><div><span>{t("instructions.account.totalLabel")}</span><div className="instructions-amount"><strong>{formatRoomPrice(total)}</strong><button type="button" onClick={() => copyValue(String(total), t("instructions.messages.copyAmountLabel"))} aria-label={t("instructions.account.copyAmountAriaLabel")}><Copy size={19} /></button></div></div></div>
              <div className="instructions-callout"><Info size={20} /><p><strong>{t("instructions.account.calloutTitle")}</strong> {t("instructions.account.calloutText")}</p></div>
            </section>
            <section className="instructions-card instructions-guides" aria-labelledby="instructions-guide-title"><div className="instructions-guide-heading"><Wallet size={25} /><div><h2 id="instructions-guide-title">{t("instructions.guides.title")}</h2><p>{t("instructions.guides.subtitle")}</p></div></div><div className="instructions-accordion">{guides.map((guide, index) => <div key={guide.title} className={`instructions-guide${openGuide === index ? " is-open" : ""}`}><h3><button type="button" aria-expanded={openGuide === index} aria-controls={`instructions-guide-${index}`} id={`instructions-guide-button-${index}`} onClick={() => setOpenGuide(openGuide === index ? null : index)}><span><b>{index + 1}</b>{guide.title}</span><ChevronDown size={20} /></button></h3><div id={`instructions-guide-${index}`} role="region" aria-labelledby={`instructions-guide-button-${index}`} hidden={openGuide !== index}><ol>{guide.steps.map((step, stepIndex) => <li key={stepIndex}>{step}</li>)}</ol></div></div>)}</div></section>
          </div>
          <aside className="instructions-right">
            <section className="instructions-card instructions-timer" aria-labelledby="instructions-timer-title"><div className="instructions-timer-heading"><h2 id="instructions-timer-title"><Clock3 size={18} /> {t("instructions.timer.title")}</h2><span>{t("instructions.timer.timezone")}</span></div><div className="instructions-deadline"><div><span>{t("instructions.timer.endsAt")}</span><strong>{deadlineLabel}</strong></div><output aria-label={t("instructions.timer.remainingAriaLabel")} className={expired ? "is-expired" : ""}>{countdown}</output></div><p>{expired ? t("instructions.timer.expiredNote") : t("instructions.timer.activeNote")}</p></section>
            <section className="instructions-card instructions-summary"><div className="instructions-stay"><h2>{t("instructions.summary.title")}</h2><div className="instructions-room"><div><strong>{t("instructions.summary.brand")}</strong><span>{t("instructions.summary.roomValue", { count: totalRooms, nights })}</span></div></div><p><CalendarDays size={17} />{formatStay(checkIn, checkOut)}</p><p><UsersRound size={17} />{guests}</p><p><UserRound size={17} />{guest ? t("instructions.summary.guestFilled", { name: guest.fullName, whatsapp: guest.whatsapp }) : t("instructions.summary.guestEmpty")}</p></div><BookingRoomSelection selection={roomSelection} nights={nights} /><div className="instructions-extras"><h3>{t("instructions.summary.extrasTitle")}</h3>{selectedExtras.length ? selectedExtras.map((id) => <div className="instructions-cost-row" key={id}><span>{counts[id]}x {bookingExtraLabels[id]}{id === "extra-bed" ? ` ${t("instructions.summary.extraBedUnit", { nights })}` : ""}</span><strong>{formatRoomPrice(getExtraCost(id, counts[id], nights))}</strong></div>) : <p>{t("instructions.summary.noExtras")}</p>}</div><div className="instructions-costs"><div className="instructions-cost-row"><span>{t("instructions.summary.roomSubtotal", { nights })}</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="instructions-cost-row"><span>{t("instructions.summary.extrasSubtotal")}</span><strong>{formatRoomPrice(extrasTotal)}</strong></div><div className="instructions-cost-row instructions-tax"><span>{t("instructions.summary.tax")}</span><strong>{t("instructions.summary.taxIncluded")}</strong></div></div><div className="instructions-total"><div><span>{t("instructions.summary.totalLabel")}<small>{t("instructions.summary.totalNote")}</small></span><strong>{formatRoomPrice(total)}</strong></div><button type="button" className="button button-primary" onClick={() => setMessage(expired ? t("instructions.messages.expiredStatus") : t("instructions.messages.pendingStatus"))}><RefreshCw size={18} /> {t("instructions.summary.checkStatus")}</button><a className="instructions-change-method" href={paymentHref}>{t("instructions.summary.changeMethod")}</a><div className="instructions-support"><a href="/contact"><MessageCircle size={17} /> {t("instructions.summary.support")}</a></div></div></section>
            <div className="instructions-trust"><div><LockKeyhole size={20} /><span>{t("instructions.trust.noTransaction")}</span></div><div><BadgeCheck size={20} /><span>{t("instructions.trust.vaSimulation")}</span></div><div><Mail size={20} /><span>{t("instructions.trust.demoReservation")}</span></div></div>
          </aside>
        </div>
      </main>
      <footer className="instructions-footer theme-footer"><div className="container instructions-footer-grid"><div><Brand href="/" /><p>{t("instructions.footer.about")}</p><p>{t("instructions.footer.address")}</p></div><div><h2>{t("instructions.footer.infoTitle")}</h2><a href="/">{t("instructions.footer.infoAbout")}</a><a href="/rooms">{t("instructions.footer.infoRooms")}</a><a href="/contact">{t("instructions.footer.infoReservationPolicy")}</a><a href="/contact">{t("instructions.footer.infoPrivacy")}</a></div><div><h2>{t("instructions.footer.helpTitle")}</h2><a href="/contact">{t("instructions.footer.helpContact")}</a><a href="/contact">{t("instructions.footer.helpFaq")}</a><a href={paymentHref}>{t("instructions.footer.helpPaymentMethods")}</a></div></div><div className="container instructions-footer-bottom"><span>{t("instructions.footer.copyright")}</span><span>{t("instructions.footer.demoNote")}</span></div></footer>
      {message && <div className="instructions-toast" role="status"><Info size={18} /><span>{message}</span><button type="button" onClick={() => setMessage("")} aria-label={t("instructions.messages.closeAriaLabel")}>×</button></div>}
    </div>
  );
}
