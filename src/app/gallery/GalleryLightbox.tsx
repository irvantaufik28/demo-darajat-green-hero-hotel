"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryPhoto } from "@/data/gallery";

type Props = { photos: GalleryPhoto[]; startIndex: number; onClose: () => void };

export default function GalleryLightbox({ photos, startIndex, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(startIndex);
  const photo = photos[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  function changePhoto(direction: number) {
    setIndex((previous) => (previous + direction + photos.length) % photos.length);
  }

  return (
    <dialog ref={dialogRef} className="resort-gallery-viewer" aria-labelledby="gallery-viewer-title" onCancel={onClose} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); changePhoto(event.key === "ArrowLeft" ? -1 : 1); } }}>
      <div className="resort-gallery-viewer-shell">
        <header className="resort-gallery-viewer-header"><div aria-live="polite"><span className="resort-gallery-viewer-counter">{index + 1} / {photos.length}</span><div><span className="resort-gallery-viewer-category">{photo.categoryLabel}</span><h2 id="gallery-viewer-title">{photo.title}</h2></div></div><button type="button" onClick={onClose} aria-label="Tutup galeri foto" autoFocus><X size={24} /></button></header>
        <div className="resort-gallery-viewer-stage"><div className="resort-gallery-viewer-image"><Image src={photo.image} alt={photo.alt} fill sizes="100vw" /></div><button type="button" className="resort-gallery-viewer-prev" onClick={() => changePhoto(-1)} aria-label="Foto sebelumnya" disabled={photos.length < 2}><ChevronLeft size={28} /></button><button type="button" className="resort-gallery-viewer-next" onClick={() => changePhoto(1)} aria-label="Foto selanjutnya" disabled={photos.length < 2}><ChevronRight size={28} /></button></div>
        <p className="resort-gallery-viewer-hint">Gunakan tombol panah kiri / kanan pada keyboard untuk navigasi. Tekan Escape untuk menutup.</p>
      </div>
    </dialog>
  );
}
