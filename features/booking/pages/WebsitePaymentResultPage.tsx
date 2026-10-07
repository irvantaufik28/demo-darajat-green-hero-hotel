"use client";

import { useEffect, useState } from "react";
import { Check, Clock3, RefreshCw } from "lucide-react";
import { Brand } from "@/components/Brand";
import PageSkeleton from "@/components/PageSkeleton";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { readLiveBooking, serializeLiveSelection } from "@/features/rooms/services/live-booking";
import { clearWebsiteCheckout, getWebsitePaymentStatus, readWebsiteCheckout, type WebsitePaymentStatus, type WebsiteReservation } from "../services/website-checkout";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/booking.css";
import "../styles/payment.css";

export default function WebsitePaymentResultPage({ bookingCode }: { bookingCode: string }) {
  const { t, lang } = useTranslations({ en, id });
  const [status, setStatus] = useState<WebsitePaymentStatus | null>(null);
  const [reservation, setReservation] = useState<WebsiteReservation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentHref, setPaymentHref] = useState<string | null>(null);

  useEffect(() => {
    const checkout = readWebsiteCheckout();
    const reservation = checkout?.reservation;
    if (!reservation || reservation.bookingCode !== bookingCode) {
      setLoading(false);
      return;
    }
    setReservation(reservation);
    const booking = readLiveBooking();
    if (booking) {
      const query = new URLSearchParams({ source: "website", room: booking.selection[0]?.roomId ?? "", rooms: serializeLiveSelection(booking.selection), checkIn: booking.checkIn, checkOut: booking.checkOut, guests: `${booking.adults} adults, ${booking.children} children` });
      setPaymentHref(`/booking/payment?${query}`);
    }
    let active = true;
    let timer: number | undefined;
    async function refresh() {
      try {
        const result = await getWebsitePaymentStatus(reservation!);
        if (active) {
          setStatus(result);
          setError("");
          if (result.paymentStatus === "paid") {
            navigateWithSkeleton(`/booking/payment/success?${new URLSearchParams({ booking: result.bookingCode })}`, true);
          }
          if (result.paymentStatus === "paid" || result.reservationStatus === "expired") window.clearInterval(timer);
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

  const isPaid = status?.paymentStatus === "paid";
  const isExpired = !isPaid && (status?.reservationStatus === "expired" || status?.paymentSession?.status === "expired" || (status?.paymentExpiresAt ? Date.parse(status.paymentExpiresAt) <= Date.now() : false));

  function startNewBooking() {
    clearWebsiteCheckout();
    navigateWithSkeleton("/rooms");
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="booking-page payment-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="/rooms" contactHref="/contact" />
      <main className="container booking-main payment-main">
        <nav className="booking-progress" aria-label={t("progress.ariaLabel")}>{["progress.selectRoom", "progress.addOns", "progress.guestDetails", "progress.payment"].map((label, index) => <div className={`booking-step${index < 3 ? " is-complete" : " is-current"}`} key={label}><span className="booking-step-circle">{index < 3 ? <Check size={18} /> : 4}</span><span>{t(label)}</span></div>)}</nav>
        <div className="payment-intro"><span className="booking-eyebrow">{t("payment.intro.eyebrow")}</span><h1>{t("payment.live.resultTitle")}</h1><p>{t("payment.live.resultDescription")}</p></div>
        <div className="payment-method-card payment-result-card">
          <Clock3 size={28} />
          <div><span>{t("payment.live.bookingCode")}</span><h2>{bookingCode}</h2><p>{loading ? t("payment.live.loading") : !reservation ? t("payment.live.missingSession") : error || (isPaid ? t("payment.live.paid") : isExpired ? t("payment.live.expired") : t("payment.live.pending"))}</p>
            {status && <div className="payment-result-totals"><span>{t("payment.summary.total")}: <strong>{formatRoomPrice(status.bookingTotal)}</strong></span><span>{t("payment.live.paidAmount")}: <strong>{formatRoomPrice(status.paidAmount)}</strong></span></div>}
            {reservation && !isPaid && !isExpired && paymentHref && <a className="button button-primary" href={paymentHref}>{t("payment.live.continuePayment")}</a>}
            {isExpired && <button type="button" className="payment-restart-button" onClick={startNewBooking}>{t("payment.live.startNew")}</button>}
            <a className="payment-result-back" href="/rooms">{t("guest.live.backToRooms")}</a>
          </div>
          {reservation && !isPaid && !isExpired && <RefreshCw size={20} aria-label={t("payment.live.refreshing")} />}
        </div>
      </main>
      <footer className="payment-footer theme-footer"><div className="container payment-footer-grid"><div><Brand href="/" /><p>{t("payment.footer.about")}</p></div></div></footer>
    </div>
  );
}
