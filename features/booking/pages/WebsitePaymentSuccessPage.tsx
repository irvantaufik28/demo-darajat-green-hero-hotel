"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BadgeCheck, BedDouble, CalendarDays, Check, CircleCheck, Clock3, Download, Headphones, Hotel, KeyRound, Mail, MessageCircle, RefreshCw, ShieldCheck, Ticket } from "lucide-react";
import { Brand } from "@/components/Brand";
import PageSkeleton from "@/components/PageSkeleton";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { contactDetails } from "@/features/contact/constants/contact-data";
import { getNights, type GuestDraft } from "../constants/booking-data";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { listRooms, type PublicRoom } from "@/features/rooms/services/public-rooms";
import { readLiveBooking, serializeLiveSelection, type LiveRoomBooking } from "@/features/rooms/services/live-booking";
import { checkoutFingerprint, downloadWebsiteReservationDocument, getWebsitePaymentStatus, readWebsiteCheckout, readWebsiteGuest, type WebsitePaymentStatus, type WebsiteReservation } from "../services/website-checkout";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/booking.css";
import "../styles/payment.css";
import "@/features/reservation-check/styles/reservation-check.css";
import "../styles/success.css";

function formatStayDate(value: string, language: string) {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatPaymentTime(value: string, language: string) {
  return `${new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value))} WIB`;
}

export default function WebsitePaymentSuccessPage({ bookingCode }: { bookingCode: string }) {
  const { t, lang } = useTranslations({ en, id });
  const [reservation, setReservation] = useState<WebsiteReservation | null>(null);
  const [booking, setBooking] = useState<LiveRoomBooking | null>(null);
  const [guest, setGuest] = useState<GuestDraft | null>(null);
  const [status, setStatus] = useState<WebsitePaymentStatus | null>(null);
  const [roomCatalog, setRoomCatalog] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<"voucher" | "receipt" | null>(null);
  const [downloadError, setDownloadError] = useState("");

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
          navigateWithSkeleton(`/booking/payment?${query}`, true);
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
  const confirmed = ["confirmed", "checked_in", "checked_out"].includes(status?.reservationStatus ?? "");
  const voucherReady = confirmed;
  const needsReview = paid && status?.reservationStatus === "expired";

  useEffect(() => {
    if (!paid) return;
    const currentState = window.history.state;
    if (!currentState?.greenHeroPaymentSuccessGuard) {
      window.history.pushState({ ...currentState, greenHeroPaymentSuccessGuard: true }, "", window.location.href);
    }
    function returnHome() {
      navigateWithSkeleton("/", true);
    }
    window.addEventListener("popstate", returnHome);
    return () => window.removeEventListener("popstate", returnHome);
  }, [paid]);

  useEffect(() => {
    if (!status || status.paymentStatus !== "paid" || !booking) return;
    const controller = new AbortController();
    listRooms(controller.signal).then((result) => setRoomCatalog(result.items)).catch(() => {});
    return () => controller.abort();
  }, [status?.paymentStatus, booking]);

  const rooms = new Map<string, { id: string; name: string; count: number; baseAmount: number; discountAmount: number }>();
  for (const room of booking?.quote.rooms ?? []) {
    const group = rooms.get(room.roomTypeId) ?? { id: room.roomTypeId, name: room.roomTypeName, count: 0, baseAmount: 0, discountAmount: 0 };
    group.count += 1;
    group.baseAmount += room.baseAmount;
    group.discountAmount += room.discountAmount;
    rooms.set(room.roomTypeId, group);
  }
  const bookedRooms = [...rooms.values()];
  const roomTotal = bookedRooms.reduce((total, room) => total + room.baseAmount - room.discountAmount, 0);
  const additionalCharges = status ? Math.max(0, status.bookingTotal - roomTotal) : 0;
  const hasCurrentBreakdown = Boolean(booking && status && booking.quote.bookingTotal === status.bookingTotal);

  async function handleDownload(type: "voucher" | "receipt") {
    if (!reservation || downloading) return;
    setDownloadError("");
    setDownloading(type);
    try {
      const blob = await downloadWebsiteReservationDocument(reservation, type);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reservation.bookingCode}-${type}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (cause) {
      setDownloadError(cause instanceof Error ? cause.message : t("payment.success.downloadError"));
    } finally {
      setDownloading(null);
    }
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="booking-page payment-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="/rooms" contactHref="/contact" />
      <main className="container booking-main payment-success-main reservation-check-page">
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

        {reservation && !paid && <div className="payment-success-code"><Ticket size={21} /><span>{t("payment.success.bookingCode")}</span><strong>{bookingCode}</strong></div>}

        {paid && status ? (
          <div className="payment-success-result">
            <section className="reservation-check-card reservation-check-timeline-card">
              <div className="reservation-check-status-row">
                <div><span>{t("payment.success.bookingStatus")}</span><strong className="reservation-check-paid"><CircleCheck size={15} />{t("payment.success.paidBadge")}</strong><strong className={confirmed ? "reservation-check-confirmed" : "payment-success-pending-badge"}><BadgeCheck size={15} />{confirmed ? t("payment.success.reservationConfirmed") : needsReview ? t("payment.success.reservationReview") : t("payment.success.awaitingConfirmation")}</strong></div>
                <div><span>{t("payment.success.bookingCode")}</span><strong className="reservation-check-booking-code">{bookingCode}</strong></div>
              </div>
              <ol className="reservation-check-timeline">
                <li className="complete"><span><Check size={20} /></span><strong>{t("payment.success.created")}</strong><small>{t("payment.success.createdNote")}</small></li>
                <li className="complete"><span><Check size={20} /></span><strong>{t("payment.success.paymentReceived")}</strong><small>{t("payment.success.paymentNote")}</small></li>
                <li className={confirmed ? "current" : "payment-success-pending-step"}><span>{confirmed ? <Hotel size={20} /> : <Clock3 size={20} />}</span><strong>{confirmed ? t("payment.success.reservationConfirmed") : needsReview ? t("payment.success.reservationReview") : t("payment.success.awaitingConfirmation")}</strong><small>{confirmed ? t("payment.success.confirmedNote") : t("payment.success.pendingNote")}</small></li>
                <li><span><KeyRound size={20} /></span><strong>{t("payment.success.checkIn")}</strong><small>{booking ? formatStayDate(booking.checkIn, lang) : "—"}</small></li>
              </ol>
            </section>

            <div className="reservation-check-details-grid">
              <div className="reservation-check-main-details">
                <section className="reservation-check-confirmation"><span><Mail size={22} /></span><div><h2>{confirmed ? t("payment.success.confirmationTitle") : t("payment.success.pendingConfirmationTitle")}</h2><p>{confirmed ? t("payment.success.confirmedDescription") : needsReview ? t("payment.success.reviewDescription") : t("payment.success.pendingConfirmationDescription")}</p></div></section>
                <section className="reservation-check-card">
                  <div className="reservation-check-card-heading"><h2>{t("payment.success.stayTitle")}</h2></div>
                  {booking ? <>
                    {bookedRooms.map((room) => {
                      const roomType = roomCatalog.find((item) => item.id === room.id);
                      const cover = roomType?.images.find((image) => image.isCover) ?? roomType?.images[0];
                      return <div className="reservation-check-room" key={room.id}>
                        <div className="reservation-check-room-image">{cover ? <Image src={cover.url} alt={cover.altText ?? room.name} fill unoptimized sizes="(max-width: 600px) 90vw, 176px" /> : <BedDouble size={40} />}</div>
                        <div><div className="reservation-check-room-tags"><span>{t("payment.success.roomCount", { count: room.count })}</span></div><h3>{room.name}</h3>{roomType?.description && <p>{roomType.description}</p>}<div className="reservation-check-room-amenities">{roomType?.bedTypeName && <span><BedDouble size={15} />{roomType.bedTypeName}</span>}{roomType?.mealTypeName && <span><ShieldCheck size={15} />{roomType.mealTypeName}</span>}</div></div>
                      </div>;
                    })}
                    <div className="reservation-check-stay-grid">
                      <div><span>{t("payment.success.guestName")}</span><strong>{guest?.fullName ?? "—"}</strong></div>
                      <div><span>{t("payment.success.roomsTitle")}</span><strong>{t("payment.success.roomCount", { count: booking.quote.roomCount })}</strong></div>
                      <div><span>{t("payment.success.guests")}</span><strong>{t("payment.success.guestCount", { adults: booking.adults, children: booking.children })}</strong></div>
                      <div><span>{t("payment.success.checkInDate")}</span><strong>{formatStayDate(booking.checkIn, lang)}</strong></div>
                      <div><span>{t("payment.success.checkOutDate")}</span><strong>{formatStayDate(booking.checkOut, lang)}</strong></div>
                      <div><span>{t("payment.success.duration")}</span><strong>{t("payment.success.nights", { count: getNights(booking.checkIn, booking.checkOut) })}</strong></div>
                    </div>
                  </> : <p className="payment-success-note">{t("payment.success.detailsUnavailable")}</p>}
                </section>
              </div>

              <aside className="reservation-check-sidebar">
                <section className="reservation-check-card reservation-check-payment">
                  <h2>{t("payment.success.paymentTitle")}</h2>
                  <div className="reservation-check-costs">
                    {status.summary ? <>
                      {status.summary.rooms.map((room, index) => <div key={index}><span>{t("payment.success.roomLine", { roomName: room.name, count: 1, nights: room.nights })}</span><strong>{formatRoomPrice(room.baseAmount)}</strong></div>)}
                      {status.summary.rooms.some((room) => room.discountAmount > 0) && <div><span>{t("payment.success.discount")}</span><strong>−{formatRoomPrice(status.summary.rooms.reduce((total, room) => total + room.discountAmount, 0))}</strong></div>}
                      {status.summary.extras.map((extra, index) => <div key={index}><span>{extra.description}{extra.quantity > 1 ? ` × ${extra.quantity}` : ""}</span><strong>{formatRoomPrice(extra.amount)}</strong></div>)}
                    </> : hasCurrentBreakdown ? <>
                      {bookedRooms.map((room) => <div key={room.id}><span>{t("payment.success.roomLine", { roomName: room.name, count: room.count, nights: booking!.quote.nights })}</span><strong>{formatRoomPrice(room.baseAmount)}</strong></div>)}
                      {booking!.quote.discountTotal > 0 && <div><span>{t("payment.success.discount")}</span><strong>−{formatRoomPrice(booking!.quote.discountTotal)}</strong></div>}
                      {additionalCharges > 0 && <div><span>{t("payment.success.additionalCharges")}</span><strong>{formatRoomPrice(additionalCharges)}</strong></div>}
                    </> : <div><span>{t("payment.success.bookingAmount")}</span><strong>{formatRoomPrice(status.bookingTotal)}</strong></div>}
                  </div>
                  <div className="reservation-check-total"><div><strong>{t("payment.success.total")}</strong><small>{t("payment.success.totalNote")}</small></div><b>{formatRoomPrice(status.bookingTotal)}</b></div>
                  <div className="reservation-check-payment-info">
                    <div><span>{t("payment.success.paymentProvider")}</span><strong>{status.summary?.payment?.provider === "xendit" ? "Xendit" : status.summary?.payment?.provider ?? "—"}</strong></div>
                    {status.summary?.payment?.paidAt && <div><span>{t("payment.success.transactionTime")}</span><strong>{formatPaymentTime(status.summary.payment.paidAt, lang)}</strong></div>}
                    {status.summary?.payment?.reference && <div><span>{t("payment.success.transactionReference")}</span><strong>{status.summary.payment.reference}</strong></div>}
                    <div><span>{t("payment.success.paidAmount")}</span><strong>{formatRoomPrice(status.paidAmount)}</strong></div>
                    <div><span>{t("payment.success.remaining")}</span><strong>{formatRoomPrice(status.remainingBalance)}</strong></div>
                  </div>
                  {voucherReady && <button type="button" className="button button-primary" onClick={() => void handleDownload("voucher")} disabled={downloading !== null}><Download size={18} />{downloading === "voucher" ? t("payment.success.downloading") : t("payment.success.downloadVoucher")}</button>}
                  <button type="button" className={voucherReady ? "button button-quiet" : "button button-primary"} onClick={() => void handleDownload("receipt")} disabled={downloading !== null}><Download size={18} />{downloading === "receipt" ? t("payment.success.downloading") : t("payment.success.downloadReceipt")}</button>
                  {downloadError && <p className="payment-success-download-error" role="alert">{downloadError}</p>}
                  <a className="button button-quiet" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />{t("payment.success.supportAction")}</a>
                  <p className="reservation-check-security"><ShieldCheck size={14} />{t("payment.success.summaryNote")}</p>
                </section>
                <section className="reservation-check-modification"><CalendarDays size={22} /><div><h3>{t("payment.success.changeTitle")}</h3><p>{t("payment.success.changeDescription")}</p></div></section>
              </aside>
            </div>
            <section className="reservation-check-help"><span><Headphones size={30} /></span><div><h2>{t("payment.success.helpTitle")}</h2><p>{t("payment.success.helpDescription")}</p></div><a className="button button-primary" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />{t("payment.success.supportAction")}</a></section>
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
