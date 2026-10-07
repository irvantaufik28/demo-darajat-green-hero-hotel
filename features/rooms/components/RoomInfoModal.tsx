"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ShieldCheck, X } from "lucide-react";
import type { Room } from "@/features/rooms/constants/rooms-data";
import "./room-info-modal.css";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

type Props = {
  room: Room;
  onClose: () => void;
};

export default function RoomInfoModal({ room, onClose }: Props) {
  const { t } = useTranslations({ en, id });
  const dialogRef = useRef<HTMLDialogElement>(null);

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
        <header className="room-info-header"><div><span>{room.eyebrow}</span><h2 id="room-info-title">{room.name}</h2></div><button type="button" aria-label={t("modal.closeAriaLabel")} onClick={onClose} autoFocus><X size={22} /></button></header>
        <div className="room-info-content"><div className="room-info-photo"><Image src={room.image} alt={room.imageAlt} fill sizes="(max-width: 720px) 90vw, 656px" /><span>{room.guests}</span></div><div className="room-info-description"><span>{room.tagline}</span><p id="room-info-description">{room.description}</p><h3>{t("modal.amenitiesTitle")}</h3><ul>{room.amenities.map(({ icon: Icon, label }) => <li key={label}><Icon size={20} /><span>{label}</span></li>)}</ul><section className="room-info-policy" aria-labelledby="room-info-policy-title"><h3 id="room-info-policy-title"><ShieldCheck size={20} />{t("modal.cancellationTitle")}</h3><strong>{room.cancellationPolicy.summary}</strong><p>{room.cancellationPolicy.description}</p></section></div></div>
        <footer className="room-info-footer"><button type="button" className="button button-primary" onClick={onClose}>{t("modal.close")}</button></footer>
      </div>
    </dialog>
  );
}
