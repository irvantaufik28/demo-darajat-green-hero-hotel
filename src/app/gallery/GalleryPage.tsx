"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Flame, Headphones, Mail, MapPin, MessageCircle, Phone, UtensilsCrossed, Waves, ZoomIn } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { galleryCategories, galleryPhotos, type GalleryCategoryId, type GalleryPhoto } from "@/data/gallery";
import GalleryLightbox from "./GalleryLightbox";

export default function GalleryPage() {
  const [category, setCategory] = useState<GalleryCategoryId>("all");
  const [viewer, setViewer] = useState<{ photos: GalleryPhoto[]; startIndex: number } | null>(null);
  const visiblePhotos = category === "all" ? galleryPhotos.slice(3, 9) : galleryPhotos.filter((photo) => photo.category === category);

  function openPhoto(photo: GalleryPhoto, album = galleryPhotos) {
    setViewer({ photos: album, startIndex: album.findIndex((item) => item.id === photo.id) });
  }

  function photoCard(photo: GalleryPhoto, style: "lead" | "stacked" | "grid" | "culinary" = "grid", badge = photo.categoryLabel) {
    return <button type="button" key={photo.id} className={`resort-gallery-photo is-${style}`} onClick={() => openPhoto(photo, style === "grid" && category !== "all" ? visiblePhotos : galleryPhotos)} aria-label={`Perbesar foto ${photo.title}`} aria-haspopup="dialog"><Image src={photo.image} alt={photo.alt} fill priority={style === "lead"} sizes={style === "lead" ? "(max-width: 767px) 100vw, 790px" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"} /><span className="resort-gallery-photo-overlay"><span className="resort-gallery-photo-badge">{style === "lead" && <Waves size={16} />}{badge}</span><span className="resort-gallery-photo-caption"><span>{style === "lead" && <small>HIGHLIGHT WISATA</small>}{style === "culinary" && <small>Menu Signature Resor</small>}<span className="resort-gallery-photo-title">{photo.caption}</span>{photo.description && style !== "stacked" && <span className="resort-gallery-photo-description">{photo.description}</span>}</span><span className="resort-gallery-photo-zoom">{style === "stacked" ? <ArrowUpRight size={21} /> : <ZoomIn size={22} />}</span></span></span></button>;
  }

  return (
    <div className="resort-gallery-page">
      <SiteHeader id="gallery-header" links={interiorLinks} activeHref="/gallery" homeHref="/" bookingHref="/rooms#availability" contactHref="/contact" />
      <main>
        <section className="resort-gallery-intro"><div className="resort-gallery-container"><h1>Keanggunan Resor <em>&amp;</em> Kehangatan Sunyi Darajat</h1><p>Jelajahi kamar, kolam air hangat, area hotel, dan berbagai momen yang bisa dinikmati selama menginap di Darajat.</p></div></section>
        <section className="resort-gallery-container resort-gallery-featured" aria-label="Foto unggulan resor">{photoCard(galleryPhotos[0], "lead", "Kolam Air Hangat Alami")}<div className="resort-gallery-stack">{photoCard(galleryPhotos[1], "stacked")}{photoCard(galleryPhotos[2], "stacked", "Suasana Darajat")}</div></section>
        <section className="resort-gallery-container resort-gallery-browse" aria-label="Jelajahi galeri berdasarkan kategori"><div className="resort-gallery-filters" role="group" aria-label="Kategori foto">{galleryCategories.map((item) => <button type="button" key={item.id} aria-pressed={category === item.id} aria-controls="resort-gallery-grid" className={category === item.id ? "is-active" : ""} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div><p className="sr-only" role="status">{visiblePhotos.length} foto ditampilkan untuk kategori {galleryCategories.find((item) => item.id === category)?.label}.</p><div className="resort-gallery-grid" id="resort-gallery-grid">{visiblePhotos.map((photo) => photoCard(photo))}</div></section>
        <section className="resort-gallery-container resort-gallery-experience"><div><Image src="/images/gallery-experience.jpg" alt="Santap BBQ bersama keluarga di area terbuka resor" fill sizes="(max-width: 767px) 100vw, 1184px" /><div className="resort-gallery-experience-shade" /><div className="resort-gallery-experience-copy"><span className="resort-gallery-eyebrow"><Flame size={16} /> GREEN HERO EXPERIENCES</span><h2>Momen yang Layak Diingat</h2><p>Lengkapi waktu bersama keluarga dengan pilihan dining dan celebration experience selama menginap di tengah udara sejuk Pasirwangi.</p><div><a className="button resort-gallery-light-button" href="/#experiences">Lihat Experiences <ArrowRight size={18} /></a><span>Tersedia Kambing Guling &amp; Live BBQ</span></div></div></div></section>
        <section className="resort-gallery-container resort-gallery-culinary"><div className="resort-gallery-section-heading"><div><span>CITA RASA &amp; MOMEN SPESIAL</span><h2>Kehangatan Kuliner &amp; Perayaan Keluarga</h2></div><p>Dari gurihnya hidangan kambing guling tradisional hingga dekorasi kejutan manis di dalam kamar.</p></div><div className="resort-gallery-culinary-grid">{photoCard(galleryPhotos[9], "culinary", "Live Cooking")}<div className="resort-gallery-stack">{photoCard(galleryPhotos[10], "stacked", "BBQ & Grill")}{photoCard(galleryPhotos[11], "stacked", "Celebration")}</div></div></section>
        <section className="resort-gallery-container resort-gallery-booking"><div><span className="resort-gallery-eyebrow">RESERVASI LANGSUNG</span><h2>Temukan Suasana Ini Secara Langsung</h2><p>Pilih tanggal menginap dan temukan kamar yang tersedia di Green Hero Darajat. Rasakan hangatnya air belerang alami dan sejuknya pegunungan Garut.</p><div><a className="button resort-gallery-light-button" href="/rooms#availability"><CalendarDays size={18} /> Cek Ketersediaan</a><a className="button resort-gallery-outline-button" href="/rooms">Lihat Kamar</a></div></div></section>
      </main>
      <footer className="resort-gallery-footer"><div className="resort-gallery-container"><div className="resort-gallery-footer-grid"><div><Brand href="/" /><p>Resor bernuansa alam pegunungan di kawasan Darajat Garut dengan fasilitas kolam renang air panas alami dan lanskap kebun teh yang menenangkan.</p><p className="resort-gallery-footer-address"><MapPin size={18} />Jl. Raya Darajat KM 14, Desa Karyamekar, Pasirwangi, Garut, Jawa Barat 44161</p></div><div><h2>Navigasi Utama</h2><a href="/#about">Tentang Kami</a><a href="/rooms">Kamar &amp; Fasilitas</a><a href="/contact">Kebijakan Reservasi</a><a href="/#location">Panduan Rute Darajat</a><a href="/contact">Kontak &amp; Bantuan</a><a href="/contact">Kebijakan Privasi</a></div><div><h2>Jam Operasional</h2><div className="resort-gallery-footer-hours"><div><Waves size={20} /><span><strong>Kolam Air Panas Alami</strong>Buka 24 Jam (Setiap Hari)</span></div><div><UtensilsCrossed size={20} /><span><strong>Restoran Sunda &amp; Kafe</strong>06.00 – 22.00 WIB</span></div><div><Headphones size={20} /><span><strong>Layanan Resepsionis</strong>24 Jam Siap Melayani</span></div></div></div><div><h2>Kontak &amp; Reservasi</h2><div className="resort-gallery-footer-contact"><span><Phone size={20} />+62 812 2345 6789 (WhatsApp)</span><span><Mail size={20} />reservation@greenherodarajat.com</span></div><a className="button button-primary" href="/contact"><MessageCircle size={16} /> Hubungi Reservasi</a></div></div><div className="resort-gallery-footer-bottom"><span>© 2026 Green Hero Darajat Hotel &amp; Resort. Seluruh Hak Cipta Dilindungi.</span><div><a href="/contact">Syarat &amp; Ketentuan</a><a href="/contact">Kebijakan Privasi</a><a href="/">Sitemap</a></div></div></div></footer>
      {viewer && <GalleryLightbox photos={viewer.photos} startIndex={viewer.startIndex} onClose={() => setViewer(null)} />}
    </div>
  );
}
