"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BadgeCheck, Check, CircleCheck, Clock3, Coffee, ContactRound, Download, Flame, Headphones, Hotel, Info, KeyRound, LoaderCircle, Mail, MapPin, MessageCircle, CalendarDays, Phone, Search, ShieldCheck, Star, Thermometer, Ticket, Wifi } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { contactDetails } from "@/features/contact/constants/contact-data";
import { demoReservation as reservation, demoReservationTotal } from "@/features/reservation-check/constants/reservation-data";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/reservation-check.css";

export default function ReservationCheckPage() {
  const { t } = useTranslations({ en, id });
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading" | "found">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const stayDetails = [
    { label: t("result.stay.fields.guestName"), value: reservation.guestName },
    { label: t("result.stay.fields.roomCount"), value: t("result.stay.fields.roomCountValue") },
    { label: t("result.stay.fields.capacity"), value: reservation.guests },
    { label: t("result.stay.fields.checkIn"), value: reservation.checkIn, note: t("result.stay.fields.checkInNote") },
    { label: t("result.stay.fields.checkOut"), value: reservation.checkOut, note: t("result.stay.fields.checkOutNote") },
    { label: t("result.stay.fields.duration"), value: t("result.stay.fields.durationValue", { nights: reservation.nights }), note: t("result.stay.fields.durationNote") },
  ];

  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (lookupStatus === "found") resultRef.current?.focus({ preventScroll: true });
  }, [lookupStatus]);

  function checkReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lookupStatus === "loading") return;
    setLookupStatus("loading");
    timerRef.current = setTimeout(() => {
      setLookupStatus("found");
      timerRef.current = null;
    }, 1400);
  }

  function downloadVoucher() {
    const documentContent = `<!doctype html><html lang="id"><meta charset="utf-8"><title>${t("voucher.pageTitle", { code: reservation.code })}</title><style>body{font-family:Arial,sans-serif;color:#023223;max-width:760px;margin:50px auto;padding:24px;line-height:1.8}h1{font-family:Georgia,serif}aside{background:#f7f3ea;padding:16px}table{width:100%;border-collapse:collapse}td{padding:12px;border-bottom:1px solid #ddd}td:last-child{text-align:right}</style><h1>${t("voucher.brand")}</h1><h2>${t("voucher.heading")}</h2><aside>${t("voucher.disclaimer")}</aside><p>${t("voucher.codeLabel")} <strong>${reservation.code}</strong><br>${t("voucher.guestLabel")} ${reservation.guestName}<br>${t("voucher.roomLabel")} ${reservation.room.name}<br>${t("voucher.checkInLabel")} ${reservation.checkIn}, 14:00 WIB<br>${t("voucher.checkOutLabel")} ${reservation.checkOut}, 12:00 WIB<br>${reservation.guests} • ${reservation.nights} malam</p><table><tr><td>${reservation.room.name} (${reservation.nights} malam)</td><td>${formatRoomPrice(reservation.room.price * reservation.nights)}</td></tr><tr><td>${reservation.grill.name}</td><td>${formatRoomPrice(reservation.grill.price)}</td></tr><tr><td>${t("voucher.firepitLine")}</td><td>${t("voucher.firepitFree")}</td></tr><tr><td>${t("voucher.taxLine")}</td><td>${t("voucher.taxIncluded")}</td></tr><tr><td><strong>${t("voucher.totalLabel")}</strong></td><td><strong>${formatRoomPrice(demoReservationTotal)}</strong></td></tr></table><p>${t("voucher.statusLine")}<br>${t("voucher.methodLine")}<br>${t("voucher.timeLabel")} ${reservation.paidAt} WIB</p></html>`;
    const url = URL.createObjectURL(new Blob([documentContent], { type: "text/html;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reservation.code}-demo-voucher.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <SiteHeader id="reservation-header" links={interiorLinks} activeHref="/reservation-check" homeHref="/" bookingHref="/rooms#availability" />
      <main className="reservation-check-page reservation-check-container">
        <section className="reservation-check-intro"><span className="reservation-check-label"><i />{t("intro.label")}</span><h1>{t("intro.title")}</h1><p>{t("intro.description")}</p></section>
        <section className="reservation-check-card reservation-check-lookup" aria-label={t("lookup.ariaLabel")}><form onSubmit={checkReservation} noValidate><div className="reservation-check-inputs"><div><label htmlFor="reservation-code">{t("lookup.fields.codeLabel")}</label><div className="reservation-check-input"><Ticket size={20} /><input id="reservation-code" name="bookingCode" placeholder={t("lookup.fields.codePlaceholder")} autoComplete="off" maxLength={80} disabled={lookupStatus === "loading"} /></div></div><div><label htmlFor="reservation-contact">{t("lookup.fields.contactLabel")}</label><div className="reservation-check-input"><ContactRound size={20} /><input id="reservation-contact" name="contactInfo" placeholder={t("lookup.fields.contactPlaceholder")} autoComplete="off" maxLength={254} disabled={lookupStatus === "loading"} /></div></div></div><div className="reservation-check-form-actions"><p><Info size={18} />{t("lookup.demoHint")}</p><button className="button button-primary" type="submit" disabled={lookupStatus === "loading"}>{lookupStatus === "loading" ? <LoaderCircle className="reservation-check-spinner" size={20} /> : <Search size={20} />}{lookupStatus === "loading" ? t("lookup.actions.checking") : t("lookup.actions.check")}</button></div></form></section>
        <div className="reservation-check-announcement" role="status" aria-live="polite">{lookupStatus === "loading" ? t("announcement.loading") : lookupStatus === "found" ? t("announcement.found") : ""}</div>
        {lookupStatus === "loading" && <section className="reservation-check-loading" aria-label={t("loading.ariaLabel")} aria-busy="true"><div className="reservation-check-loading-label"><LoaderCircle className="reservation-check-spinner" size={26} /><div><strong>{t("loading.title")}</strong><p>{t("loading.description")}</p></div></div><div className="reservation-check-skeleton wide" /><div className="reservation-check-skeleton" /><div className="reservation-check-loading-columns"><div className="reservation-check-skeleton tall" /><div className="reservation-check-skeleton tall" /></div></section>}
        {lookupStatus === "found" && <div className="reservation-check-result" ref={resultRef} tabIndex={-1} aria-label={t("result.ariaLabel")}>
          <section className="reservation-check-card reservation-check-timeline-card"><div className="reservation-check-status-row"><div><span>{t("result.status.bookingStatusLabel")}</span><strong className="reservation-check-paid"><CircleCheck size={15} />{t("result.status.paid")}</strong><strong className="reservation-check-confirmed"><BadgeCheck size={15} />{t("result.status.confirmed")}</strong></div><div><span>{t("result.status.bookingCodeLabel")}</span><strong className="reservation-check-booking-code">{reservation.code}</strong></div></div><ol className="reservation-check-timeline"><li className="complete"><span><Check size={20} /></span><strong>{t("result.timeline.created")}</strong><small>{reservation.createdAt}</small></li><li className="complete"><span><Check size={20} /></span><strong>{t("result.timeline.payment")}</strong><small>{reservation.paidAt}</small></li><li className="current"><span><Hotel size={20} /></span><strong>{t("result.timeline.confirmed")}</strong><small>{t("result.timeline.confirmedNote")}</small></li><li><span><KeyRound size={20} /></span><strong>{t("result.timeline.checkIn")}</strong><small>{t("result.timeline.checkInNote")}</small></li></ol></section>
          <div className="reservation-check-details-grid"><div className="reservation-check-main-details"><section className="reservation-check-confirmation"><span><Mail size={22} /></span><div><h2>{t("result.confirmation.title")}</h2><p>{t("result.confirmation.description", { guestName: reservation.guestName })}</p></div></section><section className="reservation-check-card"><div className="reservation-check-card-heading"><h2>{t("result.stay.heading")}</h2><span>{t("result.stay.voucherBadge")}</span></div><div className="reservation-check-room"><div className="reservation-check-room-image"><Image src={reservation.room.image} alt={reservation.room.imageAlt} fill sizes="(max-width: 600px) 90vw, 176px" /></div><div><div className="reservation-check-room-tags"><span>{t("result.stay.building")}</span><strong><Star size={13} />4.9</strong></div><h3>{reservation.room.name} · {t("result.stay.roomTitleSuffix")}</h3><p>{reservation.room.description}</p><div className="reservation-check-room-amenities"><span><Wifi size={15} />{t("result.stay.amenityWifi")}</span><span><Coffee size={15} />{t("result.stay.amenityBreakfast")}</span></div></div></div><div className="reservation-check-stay-grid">{stayDetails.map(({ label, value, note }) => <div key={label}><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>)}</div></section>
          <section className="reservation-check-card"><div className="reservation-check-card-heading"><div><h2>{t("result.experiences.heading")}</h2><p>{t("result.experiences.description")}</p></div><span>{t("result.experiences.countBadge")}</span></div><div className="reservation-check-experiences"><article><div className="reservation-check-extra-image"><Image src="/images/bbq-grill.webp" alt={t("result.experiences.bbq.imageAlt")} fill sizes="64px" /></div><div><h3>{t("result.experiences.bbq.title", { grillName: reservation.grill.name })}</h3><p>{t("result.experiences.bbq.detail", { capacity: reservation.grill.capacity, inclusions: reservation.grill.inclusions.slice(0, 3).join(", ") })}</p><small><Clock3 size={14} />{t("result.experiences.bbq.schedule")}</small></div><div className="reservation-check-extra-price"><strong>{formatRoomPrice(reservation.grill.price)}</strong><span><Check size={12} />{t("result.experiences.bbq.includedNote")}</span></div></article><article><span className="reservation-check-firepit"><Flame size={28} /></span><div><h3>{t("result.experiences.firepit.title")}</h3><p>{t("result.experiences.firepit.detail")}</p><small><Coffee size={14} />{t("result.experiences.firepit.freeNote")}</small></div><div className="reservation-check-extra-price"><strong className="reservation-check-free">{t("result.experiences.firepit.free")}</strong><small>{t("result.experiences.firepit.complimentary")}</small></div></article></div></section></div>
          <aside className="reservation-check-sidebar"><section className="reservation-check-card reservation-check-payment"><h2>{t("result.payment.heading")}</h2><div className="reservation-check-costs"><div><span>{t("result.payment.roomLine", { roomName: reservation.room.name, nights: reservation.nights })}</span><strong>{formatRoomPrice(reservation.room.price * reservation.nights)}</strong></div><div><span>{t("result.payment.bbqLine", { grillName: reservation.grill.name })}</span><strong>{formatRoomPrice(reservation.grill.price)}</strong></div><div><span>{t("result.payment.firepitLine")}</span><strong className="reservation-check-free">{t("result.payment.firepitValue")}</strong></div><div><span>{t("result.payment.taxLine")}</span><strong className="reservation-check-free">{t("result.payment.taxValue")}</strong></div></div><div className="reservation-check-total"><div><strong>{t("result.payment.totalLabel")}</strong><small>{t("result.payment.totalNote")}</small></div><b>{formatRoomPrice(demoReservationTotal)}</b></div><div className="reservation-check-payment-info"><div><span>{t("result.payment.methodLabel")}</span><strong>{t("result.payment.methodValue")}</strong></div><div><span>{t("result.payment.transactionTimeLabel")}</span><strong>{reservation.paidAt} WIB</strong></div><div><span>{t("result.payment.accountLabel")}</span><strong>{reservation.virtualAccount}</strong></div></div><button type="button" className="button button-primary" onClick={downloadVoucher}><Download size={20} />{t("result.payment.downloadVoucher")}</button><a className="button button-quiet" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />{t("result.payment.contactReceptionist")}</a><p className="reservation-check-security"><ShieldCheck size={14} />{t("result.payment.security")}</p></section><section className="reservation-check-modification"><CalendarDays size={22} /><div><h3>{t("result.modification.title")}</h3><p>{t("result.modification.description")}</p></div></section></aside></div>
        </div>}
        <section className="reservation-check-help"><span><Headphones size={30} /></span><div><h2>{t("help.title")}</h2><p>{t("help.description")}</p></div><a className="button button-primary" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={20} />{t("help.action")}</a></section>
      </main>
      <footer className="reservation-check-footer theme-footer"><div className="reservation-check-container"><div className="reservation-check-footer-grid"><div><Brand href="/" /><p>{t("footer.about")}</p><p className="reservation-check-footer-contact"><MapPin size={18} />{contactDetails.address}</p><a className="reservation-check-footer-contact" href={contactDetails.phoneHref}><Phone size={18} />{contactDetails.phone}</a><a className="reservation-check-footer-contact" href={`mailto:${contactDetails.email}`}><Mail size={18} />{contactDetails.email}</a></div><div><h2>{t("footer.navTitle")}</h2><a href="/rooms">{t("footer.navRooms")}</a><a href="/facilities">{t("footer.navHotSpring")}</a><a href="/facilities">{t("footer.navFacilities")}</a><a href="/gallery">{t("footer.navGallery")}</a><a href="/contact#location">{t("footer.navRoute")}</a><a href="/contact">{t("footer.navContact")}</a></div><div><h2>{t("footer.guestServicesTitle")}</h2><a href="/reservation-check" aria-current="page">{t("footer.serviceCheckStatus")}</a><a href="/rooms">{t("footer.servicePolicy")}</a><a href="/contact">{t("footer.serviceCheckInOut")}</a><a href="/contact">{t("footer.serviceGroups")}</a><a href="/contact">{t("footer.servicePrivacy")}</a></div><div><h2>{t("footer.hoursTitle")}</h2><div className="reservation-check-footer-hours"><p><span>{t("footer.hoursFrontDeskLabel")}</span><strong>{t("footer.hoursFrontDeskValue")}</strong></p><p><span>{t("footer.hoursHotSpringLabel")}</span><strong>{t("footer.hoursHotSpringValue")}</strong></p><p><span>{t("footer.hoursRestaurantLabel")}</span><strong>{t("footer.hoursRestaurantValue")}</strong></p><small><Thermometer size={16} />{t("footer.hoursTemperature")}</small></div></div></div><div className="reservation-check-footer-bottom"><span>{t("footer.copyright")}</span><a href="/contact">{t("footer.terms")}</a><a href="/contact">{t("footer.privacy")}</a></div></div></footer>
    </>
  );
}
