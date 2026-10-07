"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, CalendarDays, Check, CircleCheck, Clock3, Headphones, Hotel, Mail, RefreshCw, Ticket, UserRound } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { contactDetails } from "@/features/contact/constants/contact-data";
import { getNights, type GuestDraft } from "../constants/booking-data";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { readLiveBooking, serializeLiveSelection, type LiveRoomBooking } from "@/features/rooms/services/live-booking";
import { checkoutFingerprint, getWebsitePaymentStatus, readWebsiteCheckout, readWebsiteGuest, type WebsitePaymentStatus, type WebsiteReservation } from "../services/website-checkout";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/booking.css";
import "../styles/payment.css";
import "../styles/success.css";

function formatStayDate(value: string, language: string) {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function WebsitePaymentSuccessPage({ bookingCode }: { bookingCode: string }) {
  const { t, lang } = useTranslations({ en, id });
  const [reservation, setReservation] = useState<WebsiteReservation | null>(null);
  const [booking, setBooking] = useState<LiveRoomBooking | null>(null);
  const [guest, setGuest] = useState<GuestDraft | null>(null);
  const [status, setStatus] = useState<WebsitePaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkout = readWebsiteCheckout();
    const saved = checkout?.reservation;
    if (!saved || saved.bookingCode !== bookingCode) {
      setLoading(false);
      return;
    }
    setReservation(saved);
    const savedBooking = readLiveBooking();
    const savedGuest = savedBooking ? readWebsiteGuest(savedBooking) : null;
    if (savedBooking && savedGuest && checkout?.fingerprint === checkoutFingerprint(savedBooking, savedGuest)) {
      setBooking(savedBooking);
      setGuest(savedGuest);
    }
    let active = true;
    let timer: number | undefined;
    async function refresh() {
      try {
        const result = await getWebsitePaymentStatus(saved!);
        if (!active) return;
        setStatus(result);
        setError("");
        if (result.paymentStatus === "paid") window.clearInterval(timer);
        else if (savedBooking && savedGuest && checkout?.fingerprint === checkoutFingerprint(savedBooking, savedGuest)) {
          const query = new URLSearchParams({
            source: "website",
            room: savedBooking.selection[0]?.roomId ?? "",
            rooms: serializeLiveSelection(savedBooking.selection),
            checkIn: savedBooking.checkIn,
            checkOut: savedBooking.checkOut,
            guests: `${savedBooking.adults} adults, ${savedBooking.children} children`,
            verify: "1",
            booking: saved!.bookingCode,
          });
          window.clearInterval(timer);
          window.location.replace(`/booking/payment?${query}`);
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : t("payment.live.error"));
      } finally {
        if (active) setLoading(false);
      }
    }
    void refresh();
    timer = window.setInterval(() => { void refresh(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [bookingCode, lang]);

  const paid = status?.paymentStatus === "paid";
  const confirmed = status?.reservationStatus === "confirmed";
  const needsReview = paid && status?.reservationStatus === "expired";
  const rooms = new Map<string, { name: string; count: number }>();
  for (const room of booking?.quote.rooms ?? []) {
    const group = rooms.get(room.roomTypeId) ?? { name: room.roomTypeName, count: 0 };
    group.count += 1;
    rooms.set(room.roomTypeId, group);
  }

  return (
    <div className="booking-page payment-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="/rooms" contactHref="/contact" />
      <main className="container booking-main payment-success-main">
        <nav className="booking-progress" aria-label={t("progress.ariaLabel")}>
          {["progress.selectRoom", "progress.addOns", "progress.guestDetails", "progress.payment"].map((label, index) => (
            <div className={`booking-step${index < 3 || paid ? " is-complete" : ""}${index === 3 && !paid ? " is-current" : ""}`} key={label}>
              <span className="booking-step-circle">{index < 3 || paid ? <Check size={18} /> : 4}</span><span>{t(label)}</span>
            </div>
          ))}
        </nav>

        <section className={`payment-success-hero${paid ? " is-paid" : ""}`} aria-live="polite">
          <span className="payment-success-icon">{paid ? <CircleCheck size={34} /> : <Clock3 size={34} />}</span>
          <div>
            <span className="booking-eyebrow">{t("payment.success.eyebrow")}</span>
            <h1>{paid ? t("payment.success.title") : loading ? t("payment.success.checkingTitle") : t("payment.success.waitingTitle")}</h1>
            <p>{paid
              ? needsReview ? t("payment.success.reviewDescription") : confirmed ? t("payment.success.confirmedDescription") : t("payment.success.pendingConfirmationDescription")
              : !reservation ? t("payment.success.missingSession") : error || t("payment.success.waitingDescription")}</p>
          </div>
        </section>

        {reservation && <div className="payment-success-code"><Ticket size={21} /><span>{t("payment.success.bookingCode")}</span><strong>{bookingCode}</strong></div>}

        {paid && status ? (
          <div className="payment-success-layout">
            <div className="payment-success-content">
              <section className="payment-success-card">
                <h2>{t("payment.success.progressTitle")}</h2>
                <ol className="payment-success-timeline">
                  <li className="is-complete"><Check size={17} /><span>{t("payment.success.created")}</span></li>
                  <li className="is-complete"><Check size={17} /><span>{t("payment.success.paymentReceived")}</span></li>
                  <li className={confirmed ? "is-complete" : "is-waiting"}>{confirmed ? <Check size={17} /> : <Clock3 size={17} />}<span>{confirmed ? t("payment.success.reservationConfirmed") : needsReview ? t("payment.success.reservationReview") : t("payment.success.awaitingConfirmation")}</span></li>
                  <li className="is-waiting"><Hotel size={17} /><span>{t("payment.success.checkIn")}</span></li>
                </ol>
              </section>

              <section className="payment-success-card">
                <h2>{t("payment.success.stayTitle")}</h2>
                {booking ? (
                  <>
                    <div className="payment-success-stay-grid">
                      <div><CalendarDays size={18} /><span>{t("payment.success.checkInDate")}</span><strong>{formatStayDate(booking.checkIn, lang)}</strong></div>
                      <div><CalendarDays size={18} /><span>{t("payment.success.checkOutDate")}</span><strong>{formatStayDate(booking.checkOut, lang)}</strong></div>
                      <div><Hotel size={18} /><span>{t("payment.success.duration")}</span><strong>{t("payment.success.nights", { count: getNights(booking.checkIn, booking.checkOut) })}</strong></div>
                      <div><UserRound size={18} /><span>{t("payment.success.guests")}</span><strong>{t("payment.success.guestCount", { adults: booking.adults, children: booking.children })}</strong></div>
                    </div>
                    <div className="payment-success-rooms">
                      <h3>{t("payment.success.roomsTitle")}</h3>
                      {[...rooms].map(([id, room]) => <div key={id}><span>{room.name}</span><strong>{t("payment.success.roomCount", { count: room.count })}</strong></div>)}
                    </div>
                  </>
                ) : <p className="payment-success-note">{t("payment.success.detailsUnavailable")}</p>}
              </section>
            </div>

            <aside className="payment-success-sidebar">
              <section className="payment-success-card">
                <h2>{t("payment.success.paymentTitle")}</h2>
                <span className="payment-success-paid-badge"><BadgeCheck size={17} />{t("payment.success.paidBadge")}</span>
                <div className="payment-success-amounts">
                  <div><span>{t("payment.success.total")}</span><strong>{formatRoomPrice(status.bookingTotal)}</strong></div>
                  <div><span>{t("payment.success.paidAmount")}</span><strong>{formatRoomPrice(status.paidAmount)}</strong></div>
                  <div><span>{t("payment.success.remaining")}</span><strong>{formatRoomPrice(status.remainingBalance)}</strong></div>
                </div>
                {guest && <div className="payment-success-guest"><UserRound size={18} /><div><span>{t("payment.success.guestName")}</span><strong>{guest.fullName}</strong><small><Mail size={14} />{guest.email}</small></div></div>}
                <a className="button button-primary" href="/">{t("payment.success.homeAction")}</a>
                <a className="payment-success-support" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer"><Headphones size={17} />{t("payment.success.supportAction")}</a>
              </section>
            </aside>
          </div>
        ) : (
          <section className="payment-success-card payment-success-waiting">
            {reservation && <RefreshCw size={24} className={loading ? "payment-success-spinning" : ""} />}
            <div><h2>{t("payment.success.statusTitle")}</h2><p>{!reservation ? t("payment.success.contactSupport") : error || t("payment.success.statusDescription")}</p></div>
            <a className="button button-quiet" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer">{t("payment.success.supportAction")}</a>
          </section>
        )}
      </main>
      <footer className="payment-footer theme-footer"><div className="container payment-footer-grid"><div><Brand href="/" /><p>{t("payment.footer.about")}</p></div></div></footer>
    </div>
  );
}
