"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Clock3, Info, LockKeyhole, MailCheck, Wallet, Zap } from "lucide-react";
import { Brand } from "@/components/Brand";
import PageSkeleton from "@/components/PageSkeleton";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { getNights, type GuestDraft } from "../constants/booking-data";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { LIVE_BOOKING_KEY, readLiveBooking, serializeLiveSelection, type LiveRoomBooking } from "@/features/rooms/services/live-booking";
import { quoteRooms, searchRooms, type RoomAvailability } from "@/features/rooms/services/public-rooms";
import { LiveBookingRoomSelection } from "../components/LiveBookingRoomSelection";
import { checkoutFingerprint, clearWebsiteCheckout, createWebsitePaymentSession, createWebsiteReservation, getWebsitePaymentStatus, readWebsiteCheckout, readWebsiteGuest, saveWebsiteCheckout, type WebsiteReservation } from "../services/website-checkout";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/booking.css";
import "../styles/payment.css";

type Props = { roomId: string; checkIn: string; checkOut: string; guests: string; verifyReturn?: boolean; bookingCode?: string };
type CancellationRule = RoomAvailability["cancellationPolicies"][number]["rules"][number];

function safeCheckoutUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const allowedHosts = ["xendit.co", "checkout.xendit.co", "checkout-staging.xendit.co", "xen.to", "dev.xen.to"];
    return url.protocol === "https:" && !url.username && !url.password && allowedHosts.includes(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

export default function WebsitePaymentPage({ roomId, checkIn, checkOut, guests, verifyReturn = false, bookingCode = "" }: Props) {
  const { t, lang } = useTranslations({ en, id });
  const [booking, setBooking] = useState<LiveRoomBooking | null>(null);
  const [guest, setGuest] = useState<GuestDraft | null>(null);
  const [reservation, setReservation] = useState<WebsiteReservation | null>(null);
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentUncertain, setPaymentUncertain] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmedPriceChange, setConfirmedPriceChange] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const stored = readLiveBooking();
    if (!stored || stored.checkIn !== checkIn || stored.checkOut !== checkOut || stored.selection[0]?.roomId !== roomId) {
      setLoading(false);
      return;
    }
    const savedGuest = readWebsiteGuest(stored);
    if (!savedGuest) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setGuest(savedGuest);
    const checkout = readWebsiteCheckout();
    if (checkout?.fingerprint === checkoutFingerprint(stored, savedGuest) && checkout.reservation) {
      setReservation(checkout.reservation);
      setBooking(stored);
      getWebsitePaymentStatus(checkout.reservation)
        .then((status) => {
          if (controller.signal.aborted) return;
          if (status.paymentStatus === "paid") {
            navigateWithSkeleton(`/booking/payment/success?${new URLSearchParams({ booking: status.bookingCode })}`, true);
            return;
          }
          setPaymentUncertain(false);
          setLoading(false);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setPaymentUncertain(true);
          setMessage(t("payment.live.verificationPending"));
          setLoading(false);
        });
      return () => controller.abort();
    }
    Promise.all([
      quoteRooms({ checkInDate: stored.checkIn, checkOutDate: stored.checkOut, totalAdults: stored.adults, totalChildren: stored.children, rooms: stored.allocation }, controller.signal),
      searchRooms(stored.checkIn, stored.checkOut, controller.signal),
    ])
      .then(([quote, result]) => {
        setAvailability(result.items);
        const allocation = stored.allocation.map((room) => {
          const options = result.items.find((item) => item.roomType.id === room.roomTypeId)?.cancellationPolicies ?? [];
          return { ...room, cancellationPolicyId: options[0]?.id };
        });
        const refreshed = { ...stored, allocation, quote };
        setBooking(refreshed);
        try { sessionStorage.setItem(LIVE_BOOKING_KEY, JSON.stringify(refreshed)); } catch { /* Keep the current quote in memory. */ }
      })
      .catch(() => { if (!controller.signal.aborted) setMessage(t("payment.live.quoteError")); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [roomId, checkIn, checkOut, lang]);

  useEffect(() => {
    let active = true;
    let checking = false;
    async function recheckAfterReturn() {
      if (checking) return;
      const stored = readLiveBooking();
      const savedGuest = stored ? readWebsiteGuest(stored) : null;
      const checkout = readWebsiteCheckout();
      if (!stored || !savedGuest || !checkout?.reservation || checkout.fingerprint !== checkoutFingerprint(stored, savedGuest)) return;
      checking = true;
      setLoading(true);
      try {
        const status = await getWebsitePaymentStatus(checkout.reservation);
        if (!active) return;
        if (status.paymentStatus === "paid") {
          navigateWithSkeleton(`/booking/payment/success?${new URLSearchParams({ booking: status.bookingCode })}`, true);
          return;
        }
        setPaymentUncertain(false);
        setLoading(false);
      } catch {
        if (active) {
          setPaymentUncertain(true);
          setMessage(t("payment.live.verificationPending"));
          setLoading(false);
        }
      } finally {
        checking = false;
      }
    }
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) void recheckAfterReturn();
    }
    function onVisibilityChange() {
      if (document.visibilityState === "visible") void recheckAfterReturn();
    }
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      active = false;
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [lang]);

  useEffect(() => {
    if (!verifyReturn && !paymentUncertain) return;
    const saved = readWebsiteCheckout()?.reservation;
    if (!saved || (verifyReturn && saved.bookingCode !== bookingCode)) {
      setMessage(t("payment.live.missingSession"));
      return;
    }
    let active = true;
    let timer: number | undefined;
    async function refresh() {
      try {
        const status = await getWebsitePaymentStatus(saved!);
        if (!active) return;
        if (status.paymentStatus === "paid") {
          window.clearInterval(timer);
          navigateWithSkeleton(`/booking/payment/success?${new URLSearchParams({ booking: saved!.bookingCode })}`, true);
          return;
        }
        setMessage(status.reservationStatus === "expired"
          ? t("payment.live.verificationReview")
          : t("payment.live.verificationPending"));
      } catch (cause) {
        if (active) setMessage(cause instanceof Error ? cause.message : t("payment.live.error"));
      }
    }
    void refresh();
    timer = window.setInterval(() => { void refresh(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [verifyReturn, paymentUncertain, bookingCode, lang]);

  const secondsRemaining = reservation ? Math.max(0, Math.ceil((Date.parse(reservation.paymentExpiresAt) - now) / 1000)) : null;
  const expired = secondsRemaining === 0;
  const countdown = secondsRemaining === null ? "--:--" : `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(secondsRemaining % 60).padStart(2, "0")}`;
  const selection = booking ? serializeLiveSelection(booking.selection) : "";
  const backHref = `/booking/guest-details?${new URLSearchParams({ source: "website", room: roomId, rooms: selection, checkIn, checkOut, guests })}`;
  const total = reservation?.bookingTotal ?? booking?.quote.bookingTotal ?? 0;
  const nights = getNights(checkIn, checkOut);
  const isVerifying = verifyReturn || paymentUncertain;

  function startNewBooking() {
    clearWebsiteCheckout();
    navigateWithSkeleton("/rooms");
  }

  function describeRule(rule: CancellationRule) {
    const timing = rule.timingType === "more_than"
      ? t("payment.live.policyMoreThan", { days: rule.daysBefore ?? 0 })
      : t("payment.live.policyWithin", { days: rule.daysBefore ?? 0 });
    const charge = rule.chargeType === "percentage"
      ? `${rule.chargeValue}%`
      : rule.chargeType === "nights"
        ? t("payment.live.policyNights", { nights: rule.chargeValue })
        : formatRoomPrice(rule.chargeValue);
    return `${timing}: ${t("payment.live.policyCharge", { charge })}`;
  }

  async function handlePay() {
    if (!booking || !guest || submitting || verifyReturn || paymentUncertain) return;
    setSubmitting(true);
    setMessage("");
    try {
      const fingerprint = checkoutFingerprint(booking, guest);
      let existing = readWebsiteCheckout();
      if (existing?.reservation && existing.fingerprint !== fingerprint) {
        const previous = await getWebsitePaymentStatus(existing.reservation);
        if (previous.reservationStatus === "pending" && previous.paymentStatus !== "paid" && (!previous.paymentExpiresAt || Date.parse(previous.paymentExpiresAt) > Date.now())) {
          setMessage(t("payment.live.existingBooking"));
          return;
        }
        existing = null;
      }
      if (!existing?.reservation) {
        for (const [index, room] of booking.allocation.entries()) {
          const options = availability.find((item) => item.roomType.id === room.roomTypeId)?.cancellationPolicies;
          if (!options?.length) {
            setMessage(t("payment.live.policyUnavailable"));
            return;
          }
          if (room.cancellationPolicyId !== options[0].id) {
            setMessage(t("payment.live.policyUnavailable"));
            return;
          }
        }
      }
      const checkout = existing?.fingerprint === fingerprint ? existing : { fingerprint, idempotencyKey: crypto.randomUUID() };
      saveWebsiteCheckout(checkout);
      const created = checkout.reservation ?? await createWebsiteReservation(booking, guest, checkout.idempotencyKey);
      if (!checkout.reservation) {
        saveWebsiteCheckout({ ...checkout, reservation: created });
        setReservation(created);
      }
      if (created.bookingTotal !== booking.quote.bookingTotal && !confirmedPriceChange) {
        setConfirmedPriceChange(true);
        setMessage(t("payment.live.priceChanged", { amount: formatRoomPrice(created.bookingTotal) }));
        return;
      }
      const status = await getWebsitePaymentStatus(created);
      if (status.paymentStatus === "paid") {
        navigateWithSkeleton(`/booking/payment/success?${new URLSearchParams({ booking: created.bookingCode })}`, true);
        return;
      }
      if (status.reservationStatus !== "pending" || (status.paymentExpiresAt && Date.parse(status.paymentExpiresAt) <= Date.now())) {
        setMessage(t("payment.live.expired"));
        return;
      }
      const session = await createWebsitePaymentSession(created);
      const checkoutUrl = safeCheckoutUrl(session.checkoutUrl);
      if (!checkoutUrl) {
        setMessage(t("payment.live.sessionPending"));
        return;
      }
      navigateWithSkeleton(checkoutUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("payment.live.error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageSkeleton />;
  if (!booking || !guest) return <main className="container booking-main"><h1>{t("payment.live.missingTitle")}</h1><p>{message || t("payment.live.missingDescription")}</p><a className="button button-primary" href="/rooms">{t("guest.live.backToRooms")}</a></main>;

  return (
    <div className="booking-page payment-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#payment-summary" contactHref="/contact" />
      <main className="container booking-main payment-main">
        <nav className="booking-progress" aria-label={t("progress.ariaLabel")}>
          {["progress.selectRoom", "progress.addOns", "progress.guestDetails", "progress.payment"].map((label, index) => (
            <div className={`booking-step${index < 3 ? " is-complete" : ""}${index === 3 ? " is-current" : ""}`} key={label}>
              <span className="booking-step-circle">{index < 3 ? <Check size={18} /> : 4}</span><span>{t(label)}</span>
            </div>
          ))}
        </nav>
        <div className="payment-intro"><span className="booking-eyebrow">{t("payment.intro.eyebrow")}</span><h1>{isVerifying ? t("payment.live.verificationTitle") : t("payment.intro.title")}</h1><p>{isVerifying ? t("payment.live.verificationDescription") : t("payment.live.description")}</p></div>
        <div className="payment-layout">
          <div className="payment-left">
            {!isVerifying && <section className="payment-method-card" aria-labelledby="payment-method-title">
              <div className="payment-method-heading"><div><Wallet size={25} /><h2 id="payment-method-title">{t("payment.live.methodTitle")}</h2></div><p>{t("payment.live.methodDescription")}</p></div>
              <div className="payment-xendit-notice"><Info size={24} /><div><strong>{t("payment.live.methodNoticeTitle")}</strong><p>{t("payment.live.methodNotice")}</p></div></div>
            </section>}
            {availability.length > 0 && (
              <section className="payment-policy-card" aria-labelledby="payment-policy-title">
                <h2 id="payment-policy-title">{t("payment.live.policyTitle")}</h2>
                <p>{t("payment.live.policyDescription")}</p>
                <div className="payment-policy-rooms">
                  {booking.allocation.map((room, index) => {
                    const options = availability.find((item) => item.roomType.id === room.roomTypeId)?.cancellationPolicies ?? [];
                    const selectedId = room.cancellationPolicyId ?? options[0]?.id;
                    return (
                      <div className="payment-policy-room" key={`${room.roomTypeId}-${index}`}>
                        <strong>{t("payment.live.policyRoom", { number: index + 1 })} · {booking.quote.rooms[index]?.roomTypeName ?? availability.find((item) => item.roomType.id === room.roomTypeId)?.roomType.name}</strong>
                        {options.length ? options.map((policy, policyIndex) => (
                          <div className="payment-policy-option" key={policy.id ?? `default-${policyIndex}`}>
                            <div className="payment-policy-option-heading"><span className="payment-policy-name">{policy.name}</span>{policy.id === selectedId && <small>{t("payment.live.policyApplied")}</small>}</div>
                            <div className="payment-policy-details">
                              {policy.policyType && <span>{policy.policyType}</span>}
                              {policy.rules.length > 1 && <small>{t("payment.live.policyRuleCount", { count: policy.rules.length })}</small>}
                              {policy.rules.map((rule, ruleIndex) => <small key={ruleIndex}>{describeRule(rule)}</small>)}
                              {policy.noShowChargeType && <small>{t("payment.live.policyNoShow", {
                                charge: policy.noShowChargeType === "first_night"
                                  ? t("payment.live.policyNoShowFirstNight")
                                  : policy.noShowChargeType === "full_stay"
                                    ? t("payment.live.policyNoShowFullStay")
                                    : `${policy.noShowChargeValue}%`,
                              })}</small>}
                            </div>
                          </div>
                        )) : <span className="payment-policy-name">{t("payment.live.policyUnavailable")}</span>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            <div className="payment-trust-grid"><div><LockKeyhole size={23} /><span><strong>{t("payment.live.secureTitle")}</strong><small>{t("payment.live.secureDetail")}</small></span></div><div><Zap size={23} /><span><strong>{t("payment.live.statusTitle")}</strong><small>{t("payment.live.statusDetail")}</small></span></div><div><MailCheck size={23} /><span><strong>{t("payment.live.guestTitle")}</strong><small>{guest.email}</small></span></div></div>
          </div>
          <aside className="payment-right" id="payment-summary">
            {isVerifying
              ? <div className="payment-verification-banner"><Clock3 size={24} /><div><strong>{t("payment.live.verificationTitle")}</strong><p>{t("payment.live.verificationDescription")}</p></div></div>
              : <div className="payment-timer"><Clock3 size={24} /><div><span>{t("payment.timer.remaining")} <strong>{countdown}</strong></span><p>{reservation ? t("payment.live.timerActive") : t("payment.live.timerBefore")}</p></div></div>}
            <div className="payment-summary-card"><div className="payment-summary-heading"><h2>{t("payment.summary.title")}</h2><span>{reservation?.bookingCode ?? t("payment.live.ready")}</span></div><div className="payment-booking-details"><div><span>{t("payment.summary.roomType")}</span><strong>{t("payment.summary.roomValue", { count: booking.quote.roomCount, nights })}</strong></div><div><span>{t("payment.summary.schedule")}</span><strong>{checkIn} – {checkOut}<small>{guests}</small></strong></div><div><span>{t("payment.summary.extras")}</span><strong>{t("payment.summary.noExtras")}</strong></div></div><LiveBookingRoomSelection booking={booking} nights={nights} /><div className="payment-total"><div><span>{t("payment.summary.total")}</span><strong>{formatRoomPrice(total)}</strong></div><p>{t("payment.live.totalNote")}</p></div><button type="button" className="payment-pay-button" onClick={handlePay} disabled={submitting || expired || isVerifying}><LockKeyhole size={20} /> {isVerifying ? t("payment.live.verifying") : submitting ? t("payment.live.processing") : t("payment.live.payNow")}</button>{expired && !isVerifying && <button type="button" className="payment-restart-button" onClick={startNewBooking}>{t("payment.live.startNew")}</button>}<p className="payment-pay-caption">{isVerifying ? t("payment.live.verificationDescription") : t("payment.live.payCaption")}</p>{message && <p className="payment-status" role="alert">{message}</p>}{!isVerifying && <div className="payment-back"><a href={backHref}><ArrowLeft size={18} /> {t("payment.summary.back")}</a></div>}</div>
          </aside>
        </div>
      </main>
      <footer className="payment-footer theme-footer"><div className="container payment-footer-grid"><div><Brand href="/" /><p>{t("payment.footer.about")}</p></div><div><strong>{t("payment.footer.exploreTitle")}</strong><a href="/">{t("payment.footer.exploreHome")}</a><a href="/rooms">{t("payment.footer.exploreRooms")}</a><a href="/facilities">{t("payment.footer.exploreFacilities")}</a></div></div><div className="container payment-footer-bottom"><span>{t("payment.footer.copyright")}</span></div></footer>
    </div>
  );
}
