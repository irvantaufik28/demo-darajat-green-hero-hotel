"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Crown, Minus, Plus, UsersRound, X } from "lucide-react";
import type { FoodCategory } from "@/features/booking/constants/food-packages-data";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";

type Props = {
  category: FoodCategory;
  counts: Record<string, number>;
  onSave: (counts: Record<string, number>) => void;
  onClose: () => void;
};

export default function FoodPackageModal({ category, counts, onSave, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>(() => Object.fromEntries(category.packages.map((item) => [item.id, counts[item.id] ?? 0])));
  const total = category.packages.reduce((sum, item) => sum + item.price * quantities[item.id], 0);
  const quantity = Object.values(quantities).reduce((sum, count) => sum + count, 0);

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

  function changeQuantity(id: string, delta: number) {
    setQuantities((previous) => ({ ...previous, [id]: Math.max(0, Math.min(10, previous[id] + delta)) }));
  }

  return (
    <dialog ref={dialogRef} className="food-package-modal" aria-labelledby="food-package-title" aria-describedby="food-package-description" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="food-package-shell">
        <header className="food-package-header">
          <div><span className="booking-eyebrow">FOOD &amp; GRILL</span><h2 id="food-package-title">Pilih Paket {category.name}</h2><p id="food-package-description">Pilih paket dan jumlah sesuai kebutuhan Anda.</p></div>
          <button type="button" className="food-package-close" onClick={onClose} aria-label="Tutup pilihan paket" autoFocus><X size={22} /></button>
        </header>
        <div className="food-package-grid">
          {category.packages.map((item) => {
            const count = quantities[item.id];
            return (
              <article key={item.id} className={`food-package-card${item.popular ? " is-popular" : ""}${count > 0 ? " is-selected" : ""}`}>
                <Image className="food-package-image" src={category.id === "roast-goat" ? "/images/kambing-guling.webp" : category.id === "grill" ? "/images/bbq-grill.webp" : "/images/outdoor-dining.webp"} alt={category.id === "grilled-chicken" ? "Suasana santap bersama di Green Hero" : category.name} width={128} height={116} sizes="(max-width: 620px) 80px, 116px" />
                <div className="food-package-copy">
                  <div className="food-package-badges"><span><UsersRound size={15} />{item.capacity}</span>{item.popular && <span className="food-package-popular"><Crown size={13} /> Paling Populer</span>}</div>
                  <h3>{item.name}</h3><p>{item.inclusions.slice(0, 3).join(" • ")}{item.inclusions.some((inclusion) => inclusion === "Pendamping sajian") ? " • Pendamping sajian" : ""}</p>
                </div>
                <div className="food-package-controls">
                  <div className="food-package-price"><strong>{formatRoomPrice(item.price)}</strong><span>/ paket</span></div>
                  <div className="food-package-quantity"><div className="booking-quantity"><button type="button" onClick={() => changeQuantity(item.id, -1)} disabled={count === 0} aria-label={`Kurangi ${item.name}`}><Minus size={16} /></button><output aria-live="polite" aria-label={`Jumlah ${item.name}`}>{count}</output><button type="button" onClick={() => changeQuantity(item.id, 1)} disabled={count >= 10} aria-label={`Tambah ${item.name}`}><Plus size={16} /></button></div></div>
                </div>
              </article>
            );
          })}
        </div>
        <footer className="food-package-footer"><div aria-live="polite"><span>{quantity} paket dipilih</span><strong>{formatRoomPrice(total)}</strong></div><div className="food-package-footer-actions"><button type="button" className="booking-add-button" onClick={onClose}>Batal</button><button type="button" className="button button-primary" onClick={() => onSave(quantities)}>Simpan Pilihan</button></div></footer>
      </div>
    </dialog>
  );
}
