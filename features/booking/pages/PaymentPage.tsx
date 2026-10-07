"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  Info,
  LockKeyhole,
  MailCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { bookingExtraLabels, bookingExtraPrices, getExtraCost, getNights, type PaidExtraId } from "@/features/booking/constants/booking-data";
import { formatRoomPrice, getRoom } from "@/features/rooms/constants/rooms-data";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import "../styles/booking.css";
import "../styles/payment.css";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";
import { useTranslations, type Translate } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

type Props = {
  roomId: string;
  roomSelection: RoomSelection;
  checkIn: string;
  checkOut: string;
  guests: string;
  counts: Record<PaidExtraId, number>;
  initialPaymentMethod?: string;
};

type PaymentTabId = "hotel" | "card" | "virtual-account" | "wallet";

type PaymentOption = {
  id: string;
  label: string;
  brand: string;
  information: string[];
};

const paymentTabs: { id: PaymentTabId; labelKey: string }[] = [
  { id: "hotel", labelKey: "payment.tabs.hotel" },
  { id: "card", labelKey: "payment.tabs.card" },
  { id: "virtual-account", labelKey: "payment.tabs.virtualAccount" },
  { id: "wallet", labelKey: "payment.tabs.wallet" },
];

function buildPaymentOptions(t: Translate): Record<PaymentTabId, PaymentOption[]> {
  return {
    hotel: [
      { id: "hotel-payment", label: t("payment.options.hotelPayment.label"), brand: "HOTEL", information: [t("payment.options.hotelPayment.info1"), t("payment.options.hotelPayment.info2")] },
      { id: "no-prepayment", label: t("payment.options.noPrepayment.label"), brand: "HOTEL", information: [t("payment.options.noPrepayment.info1"), t("payment.options.noPrepayment.info2")] },
    ],
    card: [
      { id: "credit-card", label: t("payment.options.creditCard.label"), brand: "VISA  ●●  JCB", information: [t("payment.options.creditCard.info1"), t("payment.options.creditCard.info2")] },
    ],
    "virtual-account": [
      ...["BCA", "Bank Neo Commerce", "BRI", "BSI", "CIMB", "Danamon", "Permata", "Mandiri", "ATM"].map((name) => ({ id: name.toLowerCase().replaceAll(" ", "-"), label: name, brand: name === "ATM" ? "ATM" : name.toUpperCase(), information: [t("payment.options.virtualAccountInfo1", { name }), t("payment.options.virtualAccountInfo2")] })),
    ],
    wallet: [
      ...["GoPay", "ShopeePay", "QRIS", "Dana", "LinkAja", "AstraPay", "Jenius"].map((name) => ({ id: name.toLowerCase(), label: name, brand: name === "QRIS" ? "QRIS" : name, information: name === "QRIS" ? [t("payment.options.qrisInfo1"), t("payment.options.qrisInfo2")] : [t("payment.options.walletInfo1", { name }), t("payment.options.walletInfo2")] })),
    ],
  };
}

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatDateRange(checkIn: string, checkOut: string) {
  const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
  const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);
  if (startYear === endYear && startMonth === endMonth) return `${startDay} – ${endDay} ${months[startMonth - 1]} ${startYear}`;
  return `${startDay} ${months[startMonth - 1]} ${startYear} – ${endDay} ${months[endMonth - 1]} ${endYear}`;
}

export default function PaymentPage({ roomId, roomSelection, checkIn, checkOut, guests, counts }: Props) {
  const { t } = useTranslations({ en, id });
  const paymentOptions = buildPaymentOptions(t);
  const room = getRoom(roomId);
  const selectionQuery = serializeRoomSelection(roomSelection);
  const totalRooms = countSelectedRooms(roomSelection);
  const [selectedTab] = useState<PaymentTabId>("virtual-account");
  const [selectedOptions] = useState<Record<PaymentTabId, string>>({ hotel: "hotel-payment", card: "credit-card", "virtual-account": "bca", wallet: "qris" });
  const [message, setMessage] = useState("");
  if (!room) return null;

  const nights = getNights(checkIn, checkOut);
  const selectedExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const roomTotal = getRoomSelectionTotal(roomSelection, nights);
  const extrasTotal = selectedExtras.reduce((total, id) => total + getExtraCost(id, counts[id], nights), 0);
  const total = roomTotal + extrasTotal;
  const backParams = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
  for (const id of selectedExtras) backParams.set(id, String(counts[id]));
  const backHref = `/booking/guest-details?${backParams}`;
  const selectedOption = paymentOptions[selectedTab].find((option) => option.id === selectedOptions[selectedTab]);

  function handleContinue() {
    if (selectedTab === "virtual-account" && selectedOption?.id === "bca") {
      const instructionParams = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests, method: "bca" });
      for (const id of selectedExtras) instructionParams.set(id, String(counts[id]));
      try { sessionStorage.removeItem(`green-hero-demo-payment-deadline:${instructionParams}`); } catch { /* Continue without browser storage. */ }
      window.location.assign(`/booking/payment/instructions?${instructionParams}`);
      return;
    }
    setMessage(t("payment.messages.simulationOnly", { method: selectedOption?.label ?? t("payment.messages.methodFallback") }));
  }

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

        <div className="payment-intro"><span className="booking-eyebrow">{t("payment.intro.eyebrow")}</span><h1>{t("payment.intro.title")}</h1><p>{t("payment.intro.description")}</p></div>

        <div className="payment-layout">
          <div className="payment-left">
            <section className="payment-method-card" aria-labelledby="payment-method-title"><div className="payment-method-heading"><div><Wallet size={25} /><h2 id="payment-method-title">{t("payment.method.title")}</h2></div><p className="payment-demo-notice" id="payment-demo-notice"><Info size={16} /> {t("payment.method.demoNotice")}</p></div>
              <div className="payment-tabs" role="tablist" aria-label={t("payment.method.tabsAriaLabel")}>
                {paymentTabs.map((tab) => <button key={tab.id} id={`payment-tab-${tab.id}`} type="button" role="tab" aria-selected={selectedTab === tab.id} aria-controls="payment-options-panel" className={selectedTab === tab.id ? "is-active" : ""} disabled={tab.id !== "virtual-account"} title={tab.id !== "virtual-account" ? t("payment.method.disabledTitle") : undefined} aria-describedby="payment-demo-notice">{t(tab.labelKey)}</button>)}
              </div>
              <div id="payment-options-panel" role="tabpanel" aria-labelledby={`payment-tab-${selectedTab}`} className="payment-options-panel">
                <fieldset className="payment-methods"><legend className="sr-only">{t("payment.method.optionsAriaLabel", { label: t(paymentTabs.find((tab) => tab.id === selectedTab)?.labelKey ?? "") })}</legend>
                  {paymentOptions[selectedTab].map((option) => <div className="payment-option-group" key={option.id}>
                    <label className={`payment-method-option${selectedOptions[selectedTab] === option.id ? " is-selected" : ""}${option.id !== "bca" ? " is-unavailable" : ""}`} title={option.id !== "bca" ? t("payment.method.disabledTitle") : undefined}><input type="radio" name={`payment-option-${selectedTab}`} value={option.id} checked={selectedOptions[selectedTab] === option.id} readOnly disabled={option.id !== "bca"} aria-describedby="payment-demo-notice" /><strong>{option.label}</strong><span className="payment-brand-mark">{option.brand}</span></label>
                    {selectedOptions[selectedTab] === option.id && <div className="payment-option-information"><div><Info size={18} /><strong>{t("payment.method.importantInfo")}</strong></div><ul>{option.information.map((item) => <li key={item}>{item}</li>)}</ul></div>}
                  </div>)}
                </fieldset>
              </div>
            </section>

            <div className="payment-trust-grid"><div><LockKeyhole size={23} /><span><strong>{t("payment.trust.noTransactionTitle")}</strong><small>{t("payment.trust.noTransactionDetail")}</small></span></div><div><Zap size={23} /><span><strong>{t("payment.trust.interactiveTitle")}</strong><small>{t("payment.trust.interactiveDetail")}</small></span></div><div><MailCheck size={23} /><span><strong>{t("payment.trust.guestDataTitle")}</strong><small>{t("payment.trust.guestDataDetail")}</small></span></div></div>
          </div>

          <aside className="payment-right" id="payment-summary"><div className="payment-timer"><Clock3 size={24} /><div><span>{t("payment.timer.remaining")} <strong>{t("payment.timer.placeholder")}</strong></span><p>{t("payment.timer.note")}</p></div></div>
            <div className="payment-summary-card"><div className="payment-summary-heading"><h2>{t("payment.summary.title")}</h2><span>{t("payment.summary.badge")}</span></div><div className="payment-booking-details"><div><span>{t("payment.summary.roomType")}</span><strong>{t("payment.summary.roomValue", { count: totalRooms, nights })}</strong></div><div><span>{t("payment.summary.schedule")}</span><strong>{formatDateRange(checkIn, checkOut)}<small>{guests}</small></strong></div><div><span>{t("payment.summary.extras")}</span><strong>{selectedExtras.length ? selectedExtras.map((id) => <small key={id}>{bookingExtraLabels[id]} {t("payment.summary.extraUnit", { count: counts[id] })}</small>) : <small>{t("payment.summary.noExtras")}</small>}</strong></div></div><BookingRoomSelection selection={roomSelection} nights={nights} /><div className="payment-total"><div><span>{t("payment.summary.total")}</span><strong>{formatRoomPrice(total)}</strong></div><p>{t("payment.summary.totalNote")}</p></div><button type="button" className="payment-pay-button" onClick={handleContinue}><LockKeyhole size={20} /> {selectedTab === "virtual-account" && selectedOption?.id === "bca" ? t("payment.summary.continueInstructions") : selectedTab === "hotel" ? t("payment.summary.continueHotel") : t("payment.summary.payAmount", { amount: formatRoomPrice(total) })}</button><p className="payment-pay-caption">{t("payment.summary.payCaption")}</p>{message && <p className="payment-status" role="status">{message}</p>}<div className="payment-back"><a href={backHref}><ArrowLeft size={18} /> {t("payment.summary.back")}</a></div></div>
          </aside>
        </div>
      </main>
      <footer className="payment-footer theme-footer"><div className="container payment-footer-grid"><div><Brand href="/" /><p>{t("payment.footer.about")}</p></div><div><strong>{t("payment.footer.exploreTitle")}</strong><a href="/">{t("payment.footer.exploreHome")}</a><a href="/rooms">{t("payment.footer.exploreRooms")}</a><a href="/facilities">{t("payment.footer.exploreFacilities")}</a></div><div><strong>{t("payment.footer.contactTitle")}</strong><span>{t("payment.footer.contactAddress")}</span><span>{t("payment.footer.contactEmail")}</span></div></div><div className="container payment-footer-bottom"><span>{t("payment.footer.copyright")}</span><span>{t("payment.footer.demoNote")}</span></div></footer>
    </div>
  );
}
