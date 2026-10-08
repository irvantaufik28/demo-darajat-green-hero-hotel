"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import type { PublicBookingExtras } from "../services/public-booking-extras";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

type Experience = PublicBookingExtras["experiences"][number];
type Choice = { variantId: string; quantity: number };

export default function ExperiencePackageModal({ experience, choice, onSave, onClose }: {
  experience: Experience;
  choice: Choice | undefined;
  onSave: (choice: Choice | null) => void;
  onClose: () => void;
}) {
  const { t, lang } = useTranslations({ en, id });
  const english = lang === "en";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [variantId, setVariantId] = useState<string | null>(choice?.quantity ? choice.variantId : null);
  const [quantity, setQuantity] = useState(choice?.quantity || 1);
  const variant = experience.variants.find((item) => item.id === variantId);
  const maximum = experience.maxQuantity ?? 10;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  return <dialog ref={dialogRef} className="food-package-modal celebration-package-modal" aria-labelledby="experience-package-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="food-package-shell">
      <header className="food-package-header"><div><span className="booking-eyebrow">EXPERIENCES</span><h2 id="experience-package-title">{experience.name}</h2></div><button type="button" className="food-package-close" onClick={onClose} aria-label={t("celebrationModal.closeAriaLabel")} autoFocus><X size={22} /></button></header>
      <div className="food-package-grid celebration-package-options" role="radiogroup" aria-label={experience.name}>
        {experience.variants.map((item) => <article key={item.id} className={`celebration-package-card${variantId === item.id ? " is-selected" : ""}`}><label className="celebration-package-select"><input type="radio" name="experience-package" value={item.id} checked={variantId === item.id} onChange={() => { setVariantId(item.id); setQuantity(1); }} /><span className="celebration-package-content"><span className="celebration-package-name">{item.name}</span><span className="celebration-package-description">{item.description}</span><span className="food-package-price celebration-package-price"><strong>{formatRoomPrice(item.price)}</strong><span>{t("celebrationModal.perPackage")}</span></span></span></label></article>)}
        <label className="celebration-package-none"><input type="radio" name="experience-package" checked={variantId === null} onChange={() => setVariantId(null)} />{english ? "No package" : "Tanpa paket"}</label>
      </div>
      <footer className="food-package-footer"><div aria-live="polite"><span>{variant ? variant.name : (english ? "No package selected" : "Belum memilih paket")}</span><strong>{formatRoomPrice((variant?.price ?? 0) * (variant ? quantity : 0))}</strong></div><div className="food-package-footer-actions">{variant && maximum > 1 && <div className="booking-quantity"><button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)} aria-label={english ? "Decrease quantity" : "Kurangi jumlah"}><Minus size={16} /></button><span>{quantity}</span><button type="button" disabled={quantity >= maximum} onClick={() => setQuantity((value) => value + 1)} aria-label={english ? "Increase quantity" : "Tambah jumlah"}><Plus size={16} /></button></div>}<button type="button" className="booking-add-button" onClick={onClose}>{t("celebrationModal.cancel")}</button><button type="button" className="button button-primary" onClick={() => onSave(variantId ? { variantId, quantity } : null)}>{t("celebrationModal.save")}</button></div></footer>
    </div>
  </dialog>;
}
