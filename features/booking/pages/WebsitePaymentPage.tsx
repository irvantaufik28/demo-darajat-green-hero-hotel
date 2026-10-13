"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Clock3, Info, LockKeyhole, MailCheck, Wallet, Zap } from "lucide-react";
import PageSkeleton from "@/components/PageSkeleton";
import { navigateWithSkeleton } from "@/components/NavigationSkeleton";
import { DarajatFooter, DarajatHeader } from "@/features/home/components/DarajatHeader";
import { getNights, type GuestDraft } from "../constants/booking-data";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { LIVE_BOOKING_KEY, readLiveBooking, serializeLiveSelection, type LiveRoomBooking } from "@/features/rooms/services/live-booking";
import { quoteRooms, searchRooms, type RoomAvailability } from "@/features/rooms/services/public-rooms";
import { LiveBookingRoomSelection } from "../components/LiveBookingRoomSelection";
import { readWebsiteGuest } from "../services/website-checkout";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/booking.css";
import "../styles/payment.css";

type Props = { roomId: string; checkIn: string; checkOut: string; guests: string };
type CancellationRule = RoomAvailability["cancellationPolicies"][number]["rules"][number];

export default function WebsitePaymentPage({ roomId, checkIn, checkOut, guests }: Props) {
  const { t, lang } = useTranslations({ en, id });
  const redirectTimer = useRef<number | null>(null);
  const [booking, setBooking] = useState<LiveRoomBooking | null>(null);
  const [guest, setGuest] = useState<GuestDraft | null>(null);
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => () => {
    if (redirectTimer.current !== null) window.clearTimeout(redirectTimer.current);
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
    Promise.all([
      quoteRooms({ checkInDate: stored.checkIn, checkOutDate: stored.checkOut, totalAdults: stored.adults, totalChildren: stored.children, rooms: stored.allocation.map((room, index) => ({ ...room, ...stored.extras?.rooms[index] })), experiences: stored.extras?.experiences }, controller.signal),
      searchRooms(stored.checkIn, stored.checkOut, controller.signal),
    ])
      .then(([quote, result]) => {
        const allocation = stored.allocation.map((room) => {
          const options = result.items.find((item) => item.roomType.id === room.roomTypeId)?.cancellationPolicies ?? [];
          return { ...room, cancellationPolicyId: options[0]?.id };
        });
        const refreshed = { ...stored, allocation, quote };
        setAvailability(result.items);
        setBooking(refreshed);
        try { sessionStorage.setItem(LIVE_BOOKING_KEY, JSON.stringify(refreshed)); } catch { /* Keep the current quote in memory. */ }
      })
      .catch(() => { if (!controller.signal.aborted) setMessage(t("payment.live.quoteError")); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [roomId, checkIn, checkOut, lang]);

  const selection = booking ? serializeLiveSelection(booking.selection) : "";
  const backHref = `/booking/guest-details?${new URLSearchParams({ source: "website", room: roomId, rooms: selection, checkIn, checkOut, guests })}`;
  const total = booking?.quote.bookingTotal ?? 0;
  const nights = getNights(checkIn, checkOut);

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

  function handlePay() {
    if (!booking || !guest || submitting) return;
    setSubmitting(true);
    setMessage(t("payment.live.demoProcessing"));
    redirectTimer.current = window.setTimeout(() => {
      const query = new URLSearchParams({ booking: "DEMO-DARAJAT", demo: "1" });
      navigateWithSkeleton(`/booking/payment/success?${query}`, true);
    }, 900);
  }

  if (loading) return <PageSkeleton />;
  if (!booking || !guest) return <main className="container booking-main"><h1>{t("payment.live.missingTitle")}</h1><p>{message || t("payment.live.missingDescription")}</p><a className="button button-primary" href="/rooms">{t("guest.live.backToRooms")}</a></main>;

  return (
    <div className="dp-home booking-page payment-page">
      <DarajatHeader interior solid bookingHref="#payment-summary" />
      <main className="container booking-main payment-main">
        <nav className="booking-progress" aria-label={t("progress.ariaLabel")}>
          {["progress.selectRoom", "progress.addOns", "progress.guestDetails", "progress.payment"].map((label, index) => <div className={`booking-step${index < 3 ? " is-complete" : ""}${index === 3 ? " is-current" : ""}`} key={label}><span className="booking-step-circle">{index < 3 ? <Check size={18} /> : 4}</span><span>{t(label)}</span></div>)}
        </nav>
        <div className="payment-intro"><h1>{t("payment.intro.title")}</h1><p>{t("payment.live.description")}</p></div>
        <div className="payment-layout">
          <div className="payment-left">
            <section className="payment-method-card" aria-labelledby="payment-method-title">
              <div className="payment-method-heading"><div><Wallet size={25} /><h2 id="payment-method-title">{t("payment.live.methodTitle")}</h2></div><p>{t("payment.live.methodDescription")}</p></div>
              <div className="payment-demo-mode-notice"><Info size={24} /><div><strong>{t("payment.live.methodNoticeTitle")}</strong><p>{t("payment.live.methodNotice")}</p></div></div>
            </section>
            {availability.length > 0 && <section className="payment-policy-card" aria-labelledby="payment-policy-title">
              <h2 id="payment-policy-title">{t("payment.live.policyTitle")}</h2><p>{t("payment.live.policyDescription")}</p>
              <div className="payment-policy-rooms">{booking.allocation.map((room, index) => {
                const options = availability.find((item) => item.roomType.id === room.roomTypeId)?.cancellationPolicies ?? [];
                const selectedId = room.cancellationPolicyId ?? options[0]?.id;
                return <div className="payment-policy-room" key={`${room.roomTypeId}-${index}`}><strong>{t("payment.live.policyRoom", { number: index + 1 })} · {booking.quote.rooms[index]?.roomTypeName ?? availability.find((item) => item.roomType.id === room.roomTypeId)?.roomType.name}</strong>
                  {options.length ? options.map((policy, policyIndex) => <div className="payment-policy-option" key={policy.id ?? `default-${policyIndex}`}><div className="payment-policy-option-heading"><span className="payment-policy-name">{policy.name}</span>{policy.id === selectedId && <small>{t("payment.live.policyApplied")}</small>}</div><div className="payment-policy-details">{policy.policyType && <span>{policy.policyType}</span>}{policy.rules.length > 1 && <small>{t("payment.live.policyRuleCount", { count: policy.rules.length })}</small>}{policy.rules.map((rule, ruleIndex) => <small key={ruleIndex}>{describeRule(rule)}</small>)}{policy.noShowChargeType && <small>{t("payment.live.policyNoShow", { charge: policy.noShowChargeType === "first_night" ? t("payment.live.policyNoShowFirstNight") : policy.noShowChargeType === "full_stay" ? t("payment.live.policyNoShowFullStay") : `${policy.noShowChargeValue}%` })}</small>}</div></div>) : <span className="payment-policy-name">{t("payment.live.policyUnavailable")}</span>}
                </div>;
              })}</div>
            </section>}
            <div className="payment-trust-grid"><div><LockKeyhole size={23} /><span><strong>{t("payment.live.secureTitle")}</strong><small>{t("payment.live.secureDetail")}</small></span></div><div><Zap size={23} /><span><strong>{t("payment.live.statusTitle")}</strong><small>{t("payment.live.statusDetail")}</small></span></div><div><MailCheck size={23} /><span><strong>{t("payment.live.guestTitle")}</strong><small>{guest.email}</small></span></div></div>
          </div>
          <aside className="payment-right" id="payment-summary">
            <div className="payment-timer"><Clock3 size={24} /><div><span><strong>{t("payment.live.demoBadge")}</strong></span><p>{t("payment.live.timerBefore")}</p></div></div>
            <div className="payment-summary-card"><div className="payment-summary-heading"><h2>{t("payment.summary.title")}</h2><span>{t("payment.live.ready")}</span></div><div className="payment-booking-details"><div><span>{t("payment.summary.roomType")}</span><strong>{t("payment.summary.roomValue", { count: booking.quote.roomCount, nights })}</strong></div><div><span>{t("payment.summary.schedule")}</span><strong>{checkIn} – {checkOut}<small>{guests}</small></strong></div><div><span>{t("payment.summary.extras")}</span><strong>{booking.quote.bookingTotal > booking.quote.roomTotal ? formatRoomPrice(booking.quote.bookingTotal - booking.quote.roomTotal) : t("payment.summary.noExtras")}</strong></div></div><LiveBookingRoomSelection booking={booking} nights={nights} /><div className="payment-total"><div><span>{t("payment.summary.total")}</span><strong>{formatRoomPrice(total)}</strong></div><p>{t("payment.live.totalNote")}</p></div><button type="button" className="payment-pay-button" onClick={handlePay} disabled={submitting} aria-describedby="payment-demo-caption"><LockKeyhole size={20} />{submitting ? t("payment.live.demoProcessing") : t("payment.live.payNow")}</button><p className="payment-pay-caption" id="payment-demo-caption">{t("payment.live.payCaption")}</p>{message && <p className="payment-status" role="status">{message}</p>}<div className="payment-back"><a href={backHref}><ArrowLeft size={18} /> {t("payment.summary.back")}</a></div></div>
          </aside>
        </div>
      </main>
      <DarajatFooter />
    </div>
  );
}
