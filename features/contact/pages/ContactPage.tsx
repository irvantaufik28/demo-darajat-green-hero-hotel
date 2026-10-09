"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  BellRing,
  CalendarDays,
  Clock3,
  ExternalLink,
  Headphones,
  Hotel,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Mountain,
  Navigation,
  Phone,
  Plus,
  Send,
  Thermometer,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import {
  contactDetails,
  contactSubjects,
  contactTopics,
} from "@/features/contact/constants/contact-data";
import {
  getPublicHotelInfo,
  type PublicHotelInfo,
} from "@/features/contact/services/contact";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "../styles/contact.css";

const topicKeyByLabel: Record<string, string> = {
  "Ketersediaan Kamar": "roomAvailability",
  "Perubahan Reservasi": "reservationChange",
  "Pembayaran & Konfirmasi": "paymentConfirmation",
  "Kambing Guling": "goatRoast",
  "BBQ & Grill": "bbqGrill",
  "Birthday Celebration": "birthday",
  "Anniversary Setup": "anniversary",
};
const serviceKeys = [
  "frontDesk",
  "checkInOut",
  "hotSpring",
  "dining",
  "concierge",
];

export default function ContactPage() {
  const { t } = useTranslations({ en, id });
  const [subject, setSubject] = useState("rooms");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [locationZoom, setLocationZoom] = useState(1);
  const [hotelInfo, setHotelInfo] = useState<PublicHotelInfo | null>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    void getPublicHotelInfo(controller.signal)
      .then(({ hotel }) => setHotelInfo(hotel))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const whatsapp = hotelInfo?.whatsappNumber || contactDetails.whatsapp;
  const whatsappDigits = whatsapp.replace(/\D/g, "").replace(/^0/, "62");
  const phone = hotelInfo?.phone || contactDetails.phone;
  const phoneHref = hotelInfo?.phone
    ? `tel:${hotelInfo.phone.replace(/[^+\d]/g, "")}`
    : contactDetails.phoneHref;
  const email = hotelInfo?.email || contactDetails.email;
  const address = hotelInfo?.address || contactDetails.address;
  const mapsHref =
    hotelInfo?.googleMapsUrl ||
    (hotelInfo?.latitude && hotelInfo.longitude
      ? `https://maps.google.com/?q=${hotelInfo.latitude},${hotelInfo.longitude}`
      : contactDetails.mapsHref);
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}`
    : contactDetails.whatsappHref;

  const contactCards = [
    {
      key: "whatsapp",
      value: t("cards.whatsapp.value", { whatsapp }),
      href: whatsappHref,
      icon: MessageCircle,
      external: true,
    },
    {
      key: "phone",
      value: phone,
      href: phoneHref,
      icon: Phone,
      external: false,
    },
    {
      key: "email",
      value: email,
      href: `mailto:${email}`,
      icon: Mail,
      external: false,
    },
  ];

  const serviceInformation = [
    { icon: Clock3 },
    { icon: CalendarDays },
    { icon: Waves },
    { icon: UtensilsCrossed },
    { icon: Headphones },
  ];

  function selectTopic(topic: (typeof contactTopics)[number]) {
    setSubject(topic.subject);
    setMessage(
      (current) =>
        current ||
        t("form.topicPrefill", {
          topic: t(`topics.${topicKeyByLabel[topic.label]}`).toLowerCase(),
        }),
    );
    setFormStatus("");
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    subjectRef.current?.focus({ preventScroll: true });
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus(t("form.status"));
  }

  return (
    <>
      <SiteHeader
        id="contact-header"
        links={interiorLinks}
        activeHref="/contact"
        homeHref="/"
        bookingHref="/rooms#availability"
        contactHref="/contact"
      />
      <main className="resort-contact-page">
        <section className="resort-contact-hero">
          <Image
            src="/images/contact-hero.jpg"
            alt={t("hero.imageAlt")}
            fill
            sizes="100vw"
            preload
          />
          <div className="resort-contact-container">
            <span className="resort-contact-hero-label">{t("hero.label")}</span>
            <h1>{t("hero.title")}</h1>
            <p>{t("hero.description")}</p>
          </div>
        </section>

        <section
          className="resort-contact-container resort-contact-cards"
          aria-label={t("cards.ariaLabel")}
        >
          {contactCards.map(
            ({ key, value, href, icon: Icon, external }, index) => (
              <article className="resort-contact-card" key={key}>
                <div className="resort-contact-card-top">
                  <span className="resort-contact-icon">
                    <Icon size={26} />
                  </span>
                  <span className="resort-contact-badge">
                    {t(`cards.${key}.badge`)}
                  </span>
                </div>
                <h2>{t(`cards.${key}.title`)}</h2>
                <p>{t(`cards.${key}.description`)}</p>
                <strong className="resort-contact-card-value">
                  {index === 0 && <span className="resort-contact-dot" />}
                  {value}
                </strong>
                <a
                  className={`button ${index === 0 ? "button-primary" : "button-quiet"}`}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                >
                  {t(`cards.${key}.action`)}
                  {external && <ExternalLink size={16} />}
                </a>
              </article>
            ),
          )}
        </section>

        <section className="resort-contact-container resort-contact-section">
          <div className="resort-contact-reservation">
            <div className="resort-contact-reservation-top">
              <div>
                <span className="resort-contact-eyebrow">
                  <BellRing size={18} />
                  {t("reservation.eyebrow")}
                </span>
                <h2>{t("reservation.title")}</h2>
                <p>{t("reservation.description")}</p>
              </div>
              <div className="resort-contact-reservation-actions">
                <a
                  className="button button-primary"
                  href={`${whatsappHref}?text=Halo%20Green%20Hero,%20saya%20butuh%20bantuan%20reservasi`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={18} />
                  {t("reservation.chatAction")}
                </a>
                <a className="button button-quiet" href="/reservation-check">
                  {t("reservation.checkAction")}
                </a>
              </div>
            </div>
            <div className="resort-contact-topics">
              <span>{t("reservation.topicsLabel")}</span>
              <div>
                {contactTopics.map((topic) => (
                  <button
                    type="button"
                    key={topic.label}
                    onClick={() => selectTopic(topic)}
                  >
                    {t(`topics.${topicKeyByLabel[topic.label]}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="resort-contact-container resort-contact-section resort-contact-service-grid">
          <div className="resort-contact-form-card" id="contact-form">
            <h2>{t("form.title")}</h2>
            <p>{t("form.description")}</p>
            <form onSubmit={submitMessage} onChange={() => setFormStatus("")}>
              <label htmlFor="contact-name">
                {t("form.fields.fullNameLabel")}{" "}
                <span>{t("form.fields.requiredMark")}</span>
              </label>
              <input
                id="contact-name"
                name="fullName"
                autoComplete="name"
                placeholder={t("form.fields.fullNamePlaceholder")}
                required
                maxLength={120}
              />
              <div className="resort-contact-form-row">
                <div>
                  <label htmlFor="contact-whatsapp">
                    {t("form.fields.whatsappLabel")}{" "}
                    <span>{t("form.fields.requiredMark")}</span>
                  </label>
                  <input
                    id="contact-whatsapp"
                    name="whatsapp"
                    type="tel"
                    autoComplete="tel"
                    placeholder={t("form.fields.whatsappPlaceholder")}
                    required
                    maxLength={30}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email">
                    {t("form.fields.emailLabel")}{" "}
                    <span>{t("form.fields.requiredMark")}</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("form.fields.emailPlaceholder")}
                    required
                    maxLength={254}
                  />
                </div>
              </div>
              <label htmlFor="contact-subject">
                {t("form.fields.subjectLabel")}
              </label>
              <select
                id="contact-subject"
                name="subject"
                ref={subjectRef}
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              >
                {contactSubjects.map((option) => (
                  <option value={option.value} key={option.value}>
                    {t(`subjects.${option.value}`)}
                  </option>
                ))}
              </select>
              <label htmlFor="contact-message">
                {t("form.fields.messageLabel")}{" "}
                <span>{t("form.fields.requiredMark")}</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder={t("form.fields.messagePlaceholder")}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                maxLength={3000}
              />
              <button className="button button-primary" type="submit">
                <Send size={18} />
                {t("form.submit")}
              </button>
              {formStatus && (
                <p className="resort-contact-status" role="status">
                  {formStatus}
                </p>
              )}
            </form>
          </div>
          <div className="resort-contact-service">
            <span className="resort-contact-eyebrow">
              {t("service.eyebrow")}
            </span>
            <h2>{t("service.title")}</h2>
            <p>{t("service.description")}</p>
            <div className="resort-contact-service-list">
              {serviceInformation.map(({ icon: Icon }, index) => (
                <article key={serviceKeys[index]}>
                  <span
                    className={`resort-contact-service-icon service-icon-${index}`}
                  >
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3>{t(`service.${serviceKeys[index]}.title`)}</h3>
                    <p>{t(`service.${serviceKeys[index]}.detail`)}</p>
                  </div>
                </article>
              ))}
            </div>
            <blockquote>
              {t("service.quote")}
              <cite>{t("service.quoteCite")}</cite>
            </blockquote>
          </div>
        </section>

        <section
          className="resort-contact-container resort-contact-section"
          id="location"
        >
          <div className="resort-contact-section-heading">
            <span className="resort-contact-eyebrow">
              {t("location.eyebrow")}
            </span>
            <h2>{t("location.title")}</h2>
            <p>{t("location.description")}</p>
          </div>
          <div className="resort-contact-location">
            <div className="resort-contact-location-details">
              <span className="resort-contact-altitude">
                <Mountain size={18} />
                {t("location.altitude")}
              </span>
              <h3>{hotelInfo?.name || t("location.name")}</h3>
              <div className="resort-contact-location-row">
                <MapPin size={22} />
                <div>
                  <span>{t("location.addressLabel")}</span>
                  <p>{address}</p>
                </div>
              </div>
              <div className="resort-contact-location-row">
                <Mountain size={22} />
                <div>
                  <span>{t("location.areaLabel")}</span>
                  <p>{t("location.areaDescription")}</p>
                </div>
              </div>
              <div className="resort-contact-location-row">
                <Navigation size={22} />
                <div>
                  <span>{t("location.travelTimeLabel")}</span>
                  <p>
                    {t("location.travelTimeFromGarut")}
                    <br />
                    {t("location.travelTimeFromBandung")}
                  </p>
                </div>
              </div>
              <div className="resort-contact-map-link">
                <a
                  className="button button-primary"
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation size={18} />
                  {t("location.mapsAction")}
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <div className="resort-contact-location-preview">
              <div
                className="resort-contact-location-photo"
                style={{ transform: `scale(${locationZoom})` }}
              >
                <Image
                  src="/images/contact-location.jpg"
                  alt={t("location.photoAlt")}
                  fill
                  sizes="(max-width: 800px) 100vw, 60vw"
                />
              </div>
              <div className="resort-contact-location-marker">
                <span>
                  <Hotel size={28} />
                </span>
                <h3>{hotelInfo?.name || t("location.name")}</h3>
                <p>{t("location.markerArea")}</p>
                <strong>
                  <Thermometer size={17} />
                  {t("location.markerTemperature")}
                </strong>
              </div>
              <div className="resort-contact-map-controls">
                <button
                  type="button"
                  aria-label={t("location.zoomInAria")}
                  disabled={locationZoom >= 1.8}
                  onClick={() =>
                    setLocationZoom((zoom) => Math.min(1.8, zoom + 0.2))
                  }
                >
                  <Plus size={20} />
                </button>
                <button
                  type="button"
                  aria-label={t("location.zoomOutAria")}
                  disabled={locationZoom <= 1}
                  onClick={() =>
                    setLocationZoom((zoom) => Math.max(1, zoom - 0.2))
                  }
                >
                  <Minus size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="resort-contact-container resort-contact-final-section">
          <div className="resort-contact-booking">
            <span className="resort-contact-eyebrow">
              {t("booking.eyebrow")}
            </span>
            <h2>{t("booking.title")}</h2>
            <p>{t("booking.description")}</p>
            <div>
              <a className="button button-white" href="/rooms#availability">
                {t("booking.bookNow")}
              </a>
              <a className="button button-outline-light" href="/rooms">
                {t("booking.viewRooms")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="resort-contact-footer theme-footer">
        <div className="resort-contact-container">
          <div className="resort-contact-footer-grid">
            <div>
              <Brand href="/" />
              <p>{t("footer.about")}</p>
              <strong className="resort-contact-footer-hours">
                <span />
                {t("footer.hours")}
              </strong>
            </div>
            <div>
              <h2>{t("footer.navTitle")}</h2>
              <a href="/#about">{t("footer.navAbout")}</a>
              <a href="/rooms">{t("footer.navRooms")}</a>
              <a href="/rooms">{t("footer.navPolicy")}</a>
              <a href="#location">{t("footer.navRoute")}</a>
              <a href="/contact" aria-current="page">
                {t("footer.navContact")}
              </a>
            </div>
            <div>
              <h2>{t("footer.experiencesTitle")}</h2>
              {[
                t("footer.experienceGoatRoast"),
                t("footer.experienceBbq"),
                t("footer.experienceChicken"),
                t("footer.experienceBirthday"),
                t("footer.experienceAnniversary"),
              ].map((label) => (
                <a key={label} href="/#experiences">
                  {label}
                </a>
              ))}
            </div>
            <div>
              <h2>{t("footer.contactTitle")}</h2>
              <p className="resort-contact-footer-detail">
                <MapPin size={18} />
                {address}
              </p>
              <a className="resort-contact-footer-detail" href={phoneHref}>
                <Phone size={18} />
                {phone}
              </a>
              <a
                className="resort-contact-footer-detail"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} />
                {t("footer.conciergeLabel", { whatsapp })}
              </a>
              <a
                className="resort-contact-footer-detail"
                href={`mailto:${email}`}
              >
                <Mail size={18} />
                {email}
              </a>
            </div>
          </div>
          <div className="resort-contact-footer-bottom">
            <span>{t("footer.copyright")}</span>
            <a href="/">{t("footer.sitemap")}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
