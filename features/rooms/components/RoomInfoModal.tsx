"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BedDouble, ChevronLeft, ChevronRight, ShieldCheck, X } from "lucide-react";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { roomAmenityIcon } from "../constants/room-amenity-icons";
import { selectableRoomCount, type PublicRoom, type RoomAvailability } from "../services/public-rooms";
import "./room-info-modal.css";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

type Props = {
  room: PublicRoom;
  availability?: RoomAvailability;
  onClose: () => void;
};

export default function RoomInfoModal({ room, availability, onClose }: Props) {
  const { t, lang } = useTranslations({ en, id });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const images = room.images.length
    ? [...room.images].sort((left, right) => Number(right.isCover) - Number(left.isCover) || left.sortOrder - right.sortOrder)
    : [{ id: "fallback", url: "/images/room-standard-new.webp", altText: room.name }];
  const currentImage = images[selectedImage] ?? images[0];
  const nightly = availability?.pricePreview?.nightly ?? [];
  const campaigns = availability?.pricePreview?.appliedCampaigns ?? [];
  const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="room-info-modal"
      aria-labelledby="room-info-title"
      aria-describedby="room-info-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <div className="room-info-shell">
        <header className="room-info-header">
          <div><span>{t("modal.eyebrow")}</span><h2 id="room-info-title">{room.name}</h2></div>
          <button type="button" aria-label={t("modal.closeAriaLabel")} onClick={onClose} autoFocus><X size={22} /></button>
        </header>
        <div className="room-info-content">
          <section className="room-info-gallery" aria-label={t("modal.galleryTitle")}>
            <div className="room-info-photo">
              <Image src={currentImage.url} alt={currentImage.altText || room.name} fill unoptimized sizes="(max-width: 720px) 90vw, 820px" />
              {images.length > 1 && <>
                <button type="button" className="room-info-gallery__arrow is-prev" aria-label={t("modal.previousPhoto")} onClick={() => setSelectedImage((current) => (current + images.length - 1) % images.length)}><ChevronLeft size={21} /></button>
                <button type="button" className="room-info-gallery__arrow is-next" aria-label={t("modal.nextPhoto")} onClick={() => setSelectedImage((current) => (current + 1) % images.length)}><ChevronRight size={21} /></button>
                <span className="room-info-gallery__count">{selectedImage + 1} / {images.length}</span>
              </>}
            </div>
            {images.length > 1 && <div className="room-info-thumbnails">
              {images.map((image, index) => <button type="button" key={image.id} className={index === selectedImage ? "is-active" : ""} aria-label={t("modal.photoNumber", { number: index + 1 })} aria-pressed={index === selectedImage} onClick={() => setSelectedImage(index)}><Image src={image.url} alt={image.altText || room.name} fill unoptimized sizes="90px" /></button>)}
            </div>}
          </section>

          <div className="room-info-description">
            {room.viewTypeName && <span>{room.viewTypeName}</span>}
            <p id="room-info-description">{room.description || t("modal.noDescription")}</p>
            <section className="room-info-section">
              <h3>{t("modal.roomDetailsTitle")}</h3>
              <dl className="room-info-facts">
                {room.sizeSqm !== null && <div><dt>{t("modal.size")}</dt><dd>{room.sizeSqm} m²</dd></div>}
                {room.bedTypeName && <div><dt>{t("modal.bed")}</dt><dd><BedDouble size={17} />{room.bedCount ? `${room.bedCount} × ` : ""}{room.bedTypeName}</dd></div>}
                {room.viewTypeName && <div><dt>{t("modal.view")}</dt><dd>{room.viewTypeName}</dd></div>}
                {room.mealTypeName && <div><dt>{t("modal.meal")}</dt><dd>{room.mealTypeName}</dd></div>}
                {availability && <div><dt>{t("modal.availableRooms")}</dt><dd>{selectableRoomCount(availability)}</dd></div>}
              </dl>
            </section>

            {room.amenities.length > 0 && <section className="room-info-section">
              <h3>{t("modal.amenitiesTitle")}</h3>
              <ul className="room-info-amenities">{room.amenities.map((amenity) => { const Icon = roomAmenityIcon(amenity.iconKey); return <li key={amenity.id}><Icon size={18} /><span>{amenity.name}</span></li>; })}</ul>
            </section>}

            {availability && <section className="room-info-section">
              <h3>{t("modal.priceTitle")}</h3>
              <p className="room-info-availability">{availability.bookable ? t("modal.bookable") : t("modal.unavailable")}</p>
              {nightly.length > 0 && <div className="room-info-rates">{nightly.map((rate) => <div key={rate.stayDate}><span>{new Date(`${rate.stayDate}T00:00:00`).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short", year: "numeric" })}</span><span>{rate.discountAmount > 0 && <del>{formatRoomPrice(rate.basePrice)}</del>}<strong>{formatRoomPrice(rate.finalPrice)}</strong></span></div>)}</div>}
              {availability.pricePreview?.discountTotal ? <div className="room-info-price-total"><span>{t("modal.discountTotal")}</span><strong>−{formatRoomPrice(availability.pricePreview.discountTotal)}</strong></div> : null}
              {availability.pricePreview && <div className="room-info-price-total"><span>{t("modal.totalRoomPrice")}</span><span className="room-info-price-total__amount">{availability.pricePreview.discountTotal > 0 && <del>{formatRoomPrice(availability.pricePreview.roomTotal + availability.pricePreview.discountTotal)}</del>}<strong>{formatRoomPrice(availability.pricePreview.roomTotal)}</strong></span></div>}
              {campaigns.length > 0 && <div className="room-info-campaigns">
                <h4>{t("modal.promotionTitle")}</h4>
                {campaigns.map((campaign) => <div className="room-info-campaign" key={campaign.id}>
                  <strong>{campaign.name}</strong>
                  <dl>
                    <div><dt>{t("modal.bookingPeriodEnd")}</dt><dd>{campaign.bookingEnd ? formatDate(campaign.bookingEnd) : t("modal.noEndDate")}</dd></div>
                    <div><dt>{t("modal.stayPeriodEnd")}</dt><dd>{campaign.stayEnd ? formatDate(campaign.stayEnd) : t("modal.noEndDate")}</dd></div>
                  </dl>
                </div>)}
              </div>}
            </section>}

            <section className="room-info-policy" aria-labelledby="room-info-policy-title">
              <h3 id="room-info-policy-title"><ShieldCheck size={20} />{t("modal.cancellationTitle")}</h3>
              {availability ? availability.cancellationPolicies.map((policy, index) => {
                const noShow = policy.noShowChargeType === "percentage" ? `${policy.noShowChargeValue}%` : policy.noShowChargeType === "first_night" ? t("card.noShowFirstNight") : policy.noShowChargeType === "full_stay" ? t("card.noShowFullStay") : null;
                return <div className="room-info-policy__item" key={policy.id ?? `fallback-${index}`}>
                  <strong>{policy.name}</strong>
                  {policy.id === null ? <p>{t("modal.fallbackPolicy")}</p> : <ul>{policy.rules.map((rule, ruleIndex) => {
                    const timing = rule.timingType === "more_than" ? t("card.ruleMoreThan", { days: rule.daysBefore ?? 0 }) : t("card.ruleWithin", { days: rule.daysBefore ?? 0 });
                    const charge = rule.chargeValue === 0 ? t("card.ruleFree") : t("card.ruleCharge", { charge: rule.chargeType === "percentage" ? `${rule.chargeValue}%` : rule.chargeType === "nights" ? t("card.ruleNights", { nights: rule.chargeValue }) : formatRoomPrice(rule.chargeValue) });
                    return <li key={`${rule.timingType}-${rule.daysBefore}-${ruleIndex}`}>{timing}: {charge}</li>;
                  })}</ul>}
                  {noShow && <small>{t("card.noShow", { charge: noShow })}</small>}
                </div>;
              }) : <p>{t("modal.checkAvailabilityForPolicy")}</p>}
            </section>
          </div>
        </div>
        <footer className="room-info-footer"><button type="button" className="button button-primary" onClick={onClose}>{t("modal.close")}</button></footer>
      </div>
    </dialog>
  );
}
