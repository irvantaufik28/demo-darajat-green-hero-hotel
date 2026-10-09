"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  BadgeCheck,
  Check,
  CircleCheck,
  Clock3,
  Coffee,
  ContactRound,
  Download,
  Headphones,
  Hotel,
  Info,
  KeyRound,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  CalendarDays,
  Phone,
  Search,
  ShieldCheck,
  Thermometer,
  Ticket,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { contactDetails } from "@/features/contact/constants/contact-data";
import {
  downloadReservationDocument,
  getReservationByCode,
  type PublicReservationLookup,
  type ReservationLookupCredentials,
} from "@/features/reservation-check/services/reservation";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { ApiError } from "@/lib/api/client";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/reservation-check.css";

export default function ReservationCheckPage() {
  const { t, lang } = useTranslations({ en, id });
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "found" | "error"
  >("idle");
  const [lookup, setLookup] = useState<PublicReservationLookup | null>(null);
  const [credentials, setCredentials] =
    useState<ReservationLookupCredentials | null>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const reservation = lookup?.reservation ?? null;
  const nights = reservation
    ? Math.max(
        1,
        Math.round(
          (Date.parse(`${reservation.checkOutDate}T00:00:00Z`) -
            Date.parse(`${reservation.checkInDate}T00:00:00Z`)) /
            86400000,
        ),
      )
    : 0;
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(lang === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${value}T00:00:00Z`));
  const formatDateTime = (value: string | null | undefined) =>
    value
      ? new Intl.DateTimeFormat(lang === "en" ? "en-US" : "id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Jakarta",
        }).format(new Date(value))
      : "—";
  const guests = reservation
    ? `${t("result.stay.fields.guestAdults", { count: reservation.adults })}${reservation.children ? `, ${t("result.stay.fields.guestChildren", { count: reservation.children })}` : ""}`
    : "";
  const isPaid = Boolean(reservation && reservation.payment.paidAmount > 0);
  const isConfirmed = Boolean(
    reservation &&
    ["confirmed", "checked_in", "checked_out"].includes(
      reservation.reservationStatus,
    ),
  );
  const isCheckedIn = Boolean(
    reservation &&
    ["checked_in", "checked_out"].includes(reservation.reservationStatus),
  );

  const stayDetails = [
    {
      label: t("result.stay.fields.guestName"),
      value: reservation?.guestName ?? "",
    },
    {
      label: t("result.stay.fields.roomCount"),
      value: reservation
        ? t("result.stay.fields.roomCountDynamic", {
            count: reservation.rooms.length,
          })
        : "",
    },
    { label: t("result.stay.fields.capacity"), value: guests },
    {
      label: t("result.stay.fields.checkIn"),
      value: reservation ? formatDate(reservation.checkInDate) : "",
      note: t("result.stay.fields.checkInNote"),
    },
    {
      label: t("result.stay.fields.checkOut"),
      value: reservation ? formatDate(reservation.checkOutDate) : "",
      note: t("result.stay.fields.checkOutNote"),
    },
    {
      label: t("result.stay.fields.duration"),
      value: t("result.stay.fields.durationValue", { nights }),
      note: t("result.stay.fields.durationNote"),
    },
  ];

  useEffect(() => {
    if (lookupStatus === "found")
      resultRef.current?.focus({ preventScroll: true });
  }, [lookupStatus]);

  async function checkReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lookupStatus === "loading") return;
    const form = new FormData(event.currentTarget);
    const nextCredentials = {
      bookingCode: String(form.get("bookingCode") ?? "").trim(),
      contactInfo: String(form.get("contactInfo") ?? "").trim(),
    };
    if (!nextCredentials.bookingCode || !nextCredentials.contactInfo) {
      setError(t("lookup.errors.required"));
      setLookupStatus("error");
      return;
    }
    setLookupStatus("loading");
    setLookup(null);
    setError("");
    try {
      const result = await getReservationByCode(nextCredentials);
      setLookup(result);
      setCredentials(nextCredentials);
      setLookupStatus("found");
    } catch (cause) {
      setLookupStatus("error");
      setError(
        cause instanceof ApiError && cause.status === 404
          ? t("lookup.errors.notFound")
          : t("lookup.errors.failed"),
      );
    }
  }

  async function downloadVoucher() {
    if (!credentials || !reservation || downloading) return;
    setDownloading(true);
    setError("");
    try {
      const blob = await downloadReservationDocument(credentials, "voucher");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reservation.bookingCode}-voucher.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError(t("lookup.errors.document"));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <SiteHeader
        id="reservation-header"
        links={interiorLinks}
        activeHref="/reservation-check"
        homeHref="/"
        bookingHref="/rooms#availability"
      />
      <main className="reservation-check-page reservation-check-container">
        <section className="reservation-check-intro">
          <span className="reservation-check-label">
            <i />
            {t("intro.label")}
          </span>
          <h1>{t("intro.title")}</h1>
          <p>{t("intro.description")}</p>
        </section>
        <section
          className="reservation-check-card reservation-check-lookup"
          aria-label={t("lookup.ariaLabel")}
        >
          <form onSubmit={checkReservation} noValidate>
            <div className="reservation-check-inputs">
              <div>
                <label htmlFor="reservation-code">
                  {t("lookup.fields.codeLabel")}
                </label>
                <div className="reservation-check-input">
                  <Ticket size={20} />
                  <input
                    id="reservation-code"
                    name="bookingCode"
                    placeholder={t("lookup.fields.codePlaceholder")}
                    autoComplete="off"
                    maxLength={40}
                    disabled={lookupStatus === "loading"}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reservation-contact">
                  {t("lookup.fields.contactLabel")}
                </label>
                <div className="reservation-check-input">
                  <ContactRound size={20} />
                  <input
                    id="reservation-contact"
                    name="contactInfo"
                    placeholder={t("lookup.fields.contactPlaceholder")}
                    autoComplete="off"
                    maxLength={255}
                    disabled={lookupStatus === "loading"}
                  />
                </div>
              </div>
            </div>
            <div className="reservation-check-form-actions">
              <p>
                <Info size={18} />
                {t("lookup.hint")}
              </p>
              <button
                className="button button-primary"
                type="submit"
                disabled={lookupStatus === "loading"}
              >
                {lookupStatus === "loading" ? (
                  <LoaderCircle
                    className="reservation-check-spinner"
                    size={20}
                  />
                ) : (
                  <Search size={20} />
                )}
                {lookupStatus === "loading"
                  ? t("lookup.actions.checking")
                  : t("lookup.actions.check")}
              </button>
            </div>
          </form>
        </section>
        <div
          className={`reservation-check-announcement${lookupStatus === "error" ? " is-error" : ""}`}
          role={lookupStatus === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {lookupStatus === "loading"
            ? t("announcement.loading")
            : lookupStatus === "found"
              ? t("announcement.found")
              : lookupStatus === "error"
                ? error
                : ""}
        </div>
        {lookupStatus === "loading" && (
          <section
            className="reservation-check-loading"
            aria-label={t("loading.ariaLabel")}
            aria-busy="true"
          >
            <div className="reservation-check-loading-label">
              <LoaderCircle className="reservation-check-spinner" size={26} />
              <div>
                <strong>{t("loading.title")}</strong>
                <p>{t("loading.description")}</p>
              </div>
            </div>
            <div className="reservation-check-skeleton wide" />
            <div className="reservation-check-skeleton" />
            <div className="reservation-check-loading-columns">
              <div className="reservation-check-skeleton tall" />
              <div className="reservation-check-skeleton tall" />
            </div>
          </section>
        )}
        {lookupStatus === "found" && reservation && (
          <div
            className="reservation-check-result"
            ref={resultRef}
            tabIndex={-1}
            aria-label={t("result.ariaLabel")}
          >
            <section className="reservation-check-card reservation-check-timeline-card">
              <div className="reservation-check-status-row">
                <div>
                  <span>{t("result.status.bookingStatusLabel")}</span>
                  <strong className="reservation-check-paid">
                    <CircleCheck size={15} />
                    {isPaid
                      ? t("result.status.paid")
                      : t("result.status.unpaid")}
                  </strong>
                  <strong className="reservation-check-confirmed">
                    <BadgeCheck size={15} />
                    {isConfirmed
                      ? t("result.status.confirmed")
                      : t("result.status.pending")}
                  </strong>
                </div>
                <div>
                  <span>{t("result.status.bookingCodeLabel")}</span>
                  <strong className="reservation-check-booking-code">
                    {reservation.bookingCode}
                  </strong>
                </div>
              </div>
              <ol className="reservation-check-timeline">
                <li className="complete">
                  <span>
                    <Check size={20} />
                  </span>
                  <strong>{t("result.timeline.created")}</strong>
                  <small>{formatDateTime(reservation.createdAt)}</small>
                </li>
                <li className={isPaid ? "complete" : "current"}>
                  <span>
                    <Check size={20} />
                  </span>
                  <strong>{t("result.timeline.payment")}</strong>
                  <small>
                    {formatDateTime(
                      reservation.payment.latestTransaction?.paidAt,
                    )}
                  </small>
                </li>
                <li
                  className={isConfirmed ? "complete" : isPaid ? "current" : ""}
                >
                  <span>
                    <Hotel size={20} />
                  </span>
                  <strong>{t("result.timeline.confirmed")}</strong>
                  <small>
                    {isConfirmed
                      ? t("result.timeline.confirmedNote")
                      : t("result.status.pending")}
                  </small>
                </li>
                <li className={isCheckedIn ? "complete" : ""}>
                  <span>
                    <KeyRound size={20} />
                  </span>
                  <strong>{t("result.timeline.checkIn")}</strong>
                  <small>
                    {formatDate(reservation.checkInDate)}, 14:00 WIB
                  </small>
                </li>
              </ol>
            </section>
            <div className="reservation-check-details-grid">
              <div className="reservation-check-main-details">
                <section className="reservation-check-confirmation">
                  <span>
                    <Mail size={22} />
                  </span>
                  <div>
                    <h2>
                      {isConfirmed
                        ? t("result.confirmation.title")
                        : t("result.confirmation.pendingTitle")}
                    </h2>
                    <p>
                      {t("result.confirmation.description", {
                        guestName: reservation.guestName,
                      })}
                    </p>
                  </div>
                </section>
                <section className="reservation-check-card">
                  <div className="reservation-check-card-heading">
                    <h2>{t("result.stay.heading")}</h2>
                    <span>
                      {reservation.documents.voucherAvailable
                        ? t("result.stay.voucherBadge")
                        : t("result.status.pending")}
                    </span>
                  </div>
                  {reservation.rooms.map((item, index) => (
                    <div
                      className="reservation-check-room"
                      key={`${item.name}-${index}`}
                    >
                      <div className="reservation-check-room-image">
                        {item.image ? (
                          <Image
                            src={item.image.url}
                            alt={item.image.altText || item.name}
                            fill
                            unoptimized
                            sizes="(max-width: 600px) 90vw, 176px"
                          />
                        ) : (
                          <Hotel size={40} />
                        )}
                      </div>
                      <div>
                        <div className="reservation-check-room-tags">
                          <span>
                            {t("result.stay.roomNumber", { count: index + 1 })}
                          </span>
                        </div>
                        <h3>{item.name}</h3>
                        <p>
                          {item.bedConfiguration ||
                            t("result.stay.bedNotSpecified")}
                        </p>
                        <div className="reservation-check-room-amenities">
                          <span>
                            <ContactRound size={15} />
                            {t("result.stay.fields.guestAdults", {
                              count: item.adults,
                            })}
                            {item.children
                              ? `, ${t("result.stay.fields.guestChildren", { count: item.children })}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="reservation-check-stay-grid">
                    {stayDetails.map(({ label, value, note }) => (
                      <div key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                        {note && <small>{note}</small>}
                      </div>
                    ))}
                  </div>
                </section>
                {reservation.experiences.length > 0 && (
                  <section className="reservation-check-card">
                    <div className="reservation-check-card-heading">
                      <div>
                        <h2>{t("result.experiences.heading")}</h2>
                        <p>{t("result.experiences.description")}</p>
                      </div>
                      <span>
                        {t("result.experiences.dynamicCount", {
                          count: reservation.experiences.length,
                        })}
                      </span>
                    </div>
                    <div className="reservation-check-experiences">
                      {reservation.experiences.map((experience, index) => (
                        <article key={`${experience.name}-${index}`}>
                          <span className="reservation-check-firepit">
                            <Coffee size={28} />
                          </span>
                          <div>
                            <h3>{experience.name}</h3>
                            <p>
                              {experience.description ||
                                t("result.experiences.noDescription")}
                            </p>
                            {experience.serviceDate && (
                              <small>
                                <Clock3 size={14} />
                                {formatDate(experience.serviceDate)}
                              </small>
                            )}
                          </div>
                          <div className="reservation-check-extra-price">
                            <strong>
                              {formatRoomPrice(
                                experience.unitPrice * experience.quantity,
                              )}
                            </strong>
                            <span>
                              <Check size={12} />
                              {experience.quantity} ×{" "}
                              {formatRoomPrice(experience.unitPrice)}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              <aside className="reservation-check-sidebar">
                <section className="reservation-check-card reservation-check-payment">
                  <h2>{t("result.payment.heading")}</h2>
                  <div className="reservation-check-costs">
                    <div>
                      <span>{t("result.payment.bookingTotal")}</span>
                      <strong>
                        {formatRoomPrice(reservation.payment.bookingTotal)}
                      </strong>
                    </div>
                    <div>
                      <span>{t("result.payment.paidAmount")}</span>
                      <strong>
                        {formatRoomPrice(reservation.payment.paidAmount)}
                      </strong>
                    </div>
                    <div>
                      <span>{t("result.payment.remainingBalance")}</span>
                      <strong>
                        {formatRoomPrice(reservation.payment.remainingBalance)}
                      </strong>
                    </div>
                  </div>
                  <div className="reservation-check-total">
                    <div>
                      <strong>{t("result.payment.totalLabel")}</strong>
                      <small>{t("result.payment.totalNote")}</small>
                    </div>
                    <b>{formatRoomPrice(reservation.payment.bookingTotal)}</b>
                  </div>
                  <div className="reservation-check-payment-info">
                    <div>
                      <span>{t("result.payment.methodLabel")}</span>
                      <strong>
                        {reservation.payment.latestTransaction?.method ||
                          reservation.payment.latestTransaction?.provider ||
                          t("result.payment.notAvailable")}
                      </strong>
                    </div>
                    <div>
                      <span>{t("result.payment.transactionTimeLabel")}</span>
                      <strong>
                        {formatDateTime(
                          reservation.payment.latestTransaction?.paidAt,
                        )}
                      </strong>
                    </div>
                    <div>
                      <span>{t("result.payment.referenceLabel")}</span>
                      <strong>
                        {reservation.payment.latestTransaction?.reference ||
                          t("result.payment.manualReference")}
                      </strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={downloadVoucher}
                    disabled={
                      !reservation.documents.voucherAvailable || downloading
                    }
                  >
                    <Download size={20} />
                    {downloading
                      ? t("result.payment.downloading")
                      : t("result.payment.downloadVoucher")}
                  </button>
                  <a
                    className="button button-quiet"
                    href={contactDetails.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={18} />
                    {t("result.payment.contactReceptionist")}
                  </a>
                  <p className="reservation-check-security">
                    <ShieldCheck size={14} />
                    {t("result.payment.security")}
                  </p>
                </section>
                <section className="reservation-check-modification">
                  <CalendarDays size={22} />
                  <div>
                    <h3>{t("result.modification.title")}</h3>
                    <p>{t("result.modification.description")}</p>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        )}
        <section className="reservation-check-help">
          <span>
            <Headphones size={30} />
          </span>
          <div>
            <h2>{t("help.title")}</h2>
            <p>{t("help.description")}</p>
          </div>
          <a
            className="button button-primary"
            href={contactDetails.whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={20} />
            {t("help.action")}
          </a>
        </section>
      </main>
      <footer className="reservation-check-footer theme-footer">
        <div className="reservation-check-container">
          <div className="reservation-check-footer-grid">
            <div>
              <Brand href="/" />
              <p>{t("footer.about")}</p>
              <p className="reservation-check-footer-contact">
                <MapPin size={18} />
                {contactDetails.address}
              </p>
              <a
                className="reservation-check-footer-contact"
                href={contactDetails.phoneHref}
              >
                <Phone size={18} />
                {contactDetails.phone}
              </a>
              <a
                className="reservation-check-footer-contact"
                href={`mailto:${contactDetails.email}`}
              >
                <Mail size={18} />
                {contactDetails.email}
              </a>
            </div>
            <div>
              <h2>{t("footer.navTitle")}</h2>
              <Link href="/rooms">{t("footer.navRooms")}</Link>
              <a href="/facilities">{t("footer.navHotSpring")}</a>
              <a href="/facilities">{t("footer.navFacilities")}</a>
              <a href="/gallery">{t("footer.navGallery")}</a>
              <a href="/contact#location">{t("footer.navRoute")}</a>
              <a href="/contact">{t("footer.navContact")}</a>
            </div>
            <div>
              <h2>{t("footer.guestServicesTitle")}</h2>
              <a href="/reservation-check" aria-current="page">
                {t("footer.serviceCheckStatus")}
              </a>
              <Link href="/rooms">{t("footer.servicePolicy")}</Link>
              <a href="/contact">{t("footer.serviceCheckInOut")}</a>
              <a href="/contact">{t("footer.serviceGroups")}</a>
              <a href="/contact">{t("footer.servicePrivacy")}</a>
            </div>
            <div>
              <h2>{t("footer.hoursTitle")}</h2>
              <div className="reservation-check-footer-hours">
                <p>
                  <span>{t("footer.hoursFrontDeskLabel")}</span>
                  <strong>{t("footer.hoursFrontDeskValue")}</strong>
                </p>
                <p>
                  <span>{t("footer.hoursHotSpringLabel")}</span>
                  <strong>{t("footer.hoursHotSpringValue")}</strong>
                </p>
                <p>
                  <span>{t("footer.hoursRestaurantLabel")}</span>
                  <strong>{t("footer.hoursRestaurantValue")}</strong>
                </p>
                <small>
                  <Thermometer size={16} />
                  {t("footer.hoursTemperature")}
                </small>
              </div>
            </div>
          </div>
          <div className="reservation-check-footer-bottom">
            <span>{t("footer.copyright")}</span>
            <a href="/contact">{t("footer.terms")}</a>
            <a href="/contact">{t("footer.privacy")}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
