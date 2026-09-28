"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Crown, X } from "lucide-react";
import type { CelebrationCategory } from "@/data/celebrationPackages";
import { formatRoomPrice } from "@/data/rooms";

type Props = {
  category: CelebrationCategory;
  counts: Record<string, number>;
  onSave: (counts: Record<string, number>) => void;
  onClose: () => void;
};

export default function CelebrationPackageModal({ category, counts, onSave, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(() => category.packages.find((item) => counts[item.id] > 0)?.id ?? null);
  const selectedPackage = category.packages.find((item) => item.id === selectedId);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function saveSelection() {
    onSave(Object.fromEntries(category.packages.map((item) => [item.id, item.id === selectedId ? 1 : 0])));
  }

  return (
    <dialog ref={dialogRef} className="food-package-modal celebration-package-modal" aria-labelledby="celebration-package-title" aria-describedby="celebration-package-description" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="food-package-shell">
        <header className="food-package-header">
          <div>
            <span className="booking-eyebrow">SPECIAL MOMENTS</span>
            <h2 id="celebration-package-title">Pilih Paket {category.name}</h2>
            <p id="celebration-package-description">Pilih satu paket untuk momen spesial Anda.</p>
          </div>
          <button type="button" className="food-package-close" onClick={onClose} aria-label="Tutup pilihan paket" autoFocus><X size={22} /></button>
        </header>
        <div className="food-package-grid celebration-package-options" role="radiogroup" aria-label={`Pilihan paket ${category.name}`}>
          {category.packages.map((item) => (
            <article key={item.id} className={`celebration-package-card${item.popular ? " is-popular" : ""}${selectedId === item.id ? " is-selected" : ""}`}>
              <label className="celebration-package-select">
              <input type="radio" name="celebration-package" value={item.id} checked={selectedId === item.id} onChange={() => setSelectedId(item.id)} />
              <span className="celebration-package-content">
                <span className="food-package-badges"><span>{item.capacity}</span>{item.popular && <span className="food-package-popular"><Crown size={13} /> Paling Populer</span>}</span>
                <span className="celebration-package-name">{item.name}</span>
                <span className="celebration-package-description">{item.description}</span>
                <span className="food-package-price celebration-package-price"><strong>{formatRoomPrice(item.price)}</strong><span>/ paket</span></span>
              </span>
              </label>
              <details className="celebration-package-details">
                <summary>Isi paket</summary>
                <ul className="celebration-package-inclusions">{item.inclusions.map((inclusion) => <li key={inclusion}><CheckCircle2 size={15} />{inclusion}</li>)}</ul>
              </details>
            </article>
          ))}
          <label className="celebration-package-none"><input type="radio" name="celebration-package" checked={selectedId === null} onChange={() => setSelectedId(null)} />Tanpa paket {category.name}</label>
        </div>
        <footer className="food-package-footer">
          <div aria-live="polite"><span>{selectedPackage ? selectedPackage.name : "Belum ada paket dipilih"}</span><strong>{formatRoomPrice(selectedPackage?.price ?? 0)}</strong></div>
          <div className="food-package-footer-actions"><button type="button" className="booking-add-button" onClick={onClose}>Batal</button><button type="button" className="button button-primary" onClick={saveSelection}>Simpan Pilihan</button></div>
        </footer>
      </div>
    </dialog>
  );
}
