"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  Mail,
  Map,
  MapPin,
  Mountain,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { formatRoomPrice, getRoom, rooms } from "@/data/rooms";

type RoomDetailPageProps = {
  roomId: string;
  initialCheckIn: string;
  initialCheckOut: string;
};

const validDate = /^\d{4}-\d{2}-\d{2}$/;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatStayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

function getNightCount(checkIn: string, checkOut: string) {
  if (!validDate.test(checkIn) || !validDate.test(checkOut)) return 0;
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, Math.round((end - start) / 86400000));
}

export default function RoomDetailPage({ roomId, initialCheckIn, initialCheckOut }: RoomDetailPageProps) {
  const room = getRoom(roomId);
  const hasInitialStay = getNightCount(initialCheckIn, initialCheckOut) > 0;
  const [checkIn, setCheckIn] = useState(hasInitialStay ? initialCheckIn : "2026-10-18");
  const [checkOut, setCheckOut] = useState(hasInitialStay ? initialCheckOut : "2026-10-20");
  const [guests, setGuests] = useState("2 Dewasa, 1 Anak");
  const [editingStay, setEditingStay] = useState(false);
  const [message, setMessage] = useState("");

  if (!room) return null;

  const nights = getNightCount(checkIn, checkOut);
  const relatedRooms = rooms.filter((item) => item.id !== room.id).slice(0, 2);
  const photos = [room.image, room.image, room.image, "/images/hot-spring.webp", room.image];
  const bookingHref = `/booking/extras?${new URLSearchParams({ room: room.id, checkIn, checkOut, guests })}`;

  const checkAvailability = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checkIn || !checkOut) {
      setMessage("Pilih tanggal check-in dan check-out untuk mengecek ketersediaan.");
      return;
    }
    if (checkOut <= checkIn) {
      setMessage("Tanggal check-out harus setelah tanggal check-in.");
      return;
    }
    setEditingStay(false);
    setMessage(room.available
      ? "Kamar ini ditandai tersedia pada data demo. Reservasi sebenarnya belum terhubung."
      : "Kamar ini masih ditandai tidak tersedia pada data demo. Coba tanggal lain atau hubungi hotel untuk konfirmasi.");
  };

  return (
    <div className="detail-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#availability" contactHref="/contact" />
      <main>
        <nav className="container detail-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/rooms">Kamar & Suite</a><span>/</span><span>{room.name}</span></nav>

        <section className="container detail-gallery" id="gallery" aria-label={`Foto ${room.name}`}>
          {photos.map((photo, index) => (
            <a key={`${photo}-${index}`} href={photo} target="_blank" rel="noreferrer" className={`detail-gallery-photo detail-gallery-photo-${index + 1}`} aria-label={`Buka foto ${index + 1} ${room.name}`}>
              <Image src={photo} alt={index === 0 ? room.imageAlt : `${room.name}, foto ${index + 1}`} fill priority={index === 0} sizes={index === 0 ? "(max-width: 720px) 100vw, 60vw" : "(max-width: 720px) 50vw, 20vw"} />
            </a>
          ))}
          {!room.available && <span className="detail-unavailable-ribbon">Tidak Tersedia</span>}
          <a className="detail-photo-link" href={room.image} target="_blank" rel="noreferrer">Lihat Foto</a>
        </section>

        <section className="container detail-content">
          <div className="detail-copy">
            <span className="detail-eyebrow">{room.eyebrow}</span>
            <div className="detail-heading-row"><div><h1>{room.name}</h1><span className="detail-tagline">{room.tagline}</span></div>{!room.available && <span className="detail-status-label">Tidak Tersedia</span>}</div>
            <p className="detail-lead">{room.description}</p>

            <div className="detail-highlights">
              <div><UsersRound size={23} /><span><small>Kapasitas</small><strong>{room.amenities[0].label}</strong></span></div>
              <div><BedDouble size={23} /><span><small>Tempat Tidur</small><strong>{room.amenities[1].label}</strong></span></div>
              <div><Mountain size={23} /><span><small>Suasana</small><strong>{room.feature}</strong></span></div>
              <div><Bath size={23} /><span><small>Resor</small><strong>Air Hangat Alami</strong></span></div>
            </div>

            <section className="detail-copy-section"><h2>Tentang Kamar Ini</h2><p>{room.description}</p><p>Ruang ini menawarkan suasana hangat untuk beristirahat setelah menikmati udara sejuk Darajat dan fasilitas resor bersama orang terdekat.</p></section>

            <section className="detail-copy-section"><h2>Fasilitas Kamar</h2><div className="detail-amenities">{room.amenities.map(({ icon: Icon, label }) => <span key={label}><Icon size={21} /> {label}</span>)}</div></section>

            <section className="detail-copy-section"><h2>Informasi Menginap</h2><div className="detail-stay-info"><div><Clock3 size={21} /><span><strong>Waktu Check-in & Check-out</strong><small>Check-in mulai 14.00 WIB · Check-out hingga 12.00 WIB</small></span></div><div><UsersRound size={21} /><span><strong>Kapasitas Tamu</strong><small>{room.amenities[0].label}</small></span></div><div><BedDouble size={21} /><span><strong>Tempat Tidur</strong><small>{room.amenities[1].label}</small></span></div></div></section>

            <section className="detail-copy-section detail-policy"><h2>Kebijakan Pembatalan</h2><div><ShieldCheck size={24} /><p><strong>{room.cancellationPolicy.summary}</strong><br />{room.cancellationPolicy.description}</p></div></section>
          </div>

          <aside className="detail-booking-card" id="availability" aria-label="Harga dan ketersediaan kamar">
            <div className="detail-booking-top"><span className={room.available ? "is-available" : "is-unavailable"}><CheckCircle2 size={17} />{room.available ? `Sisa ${room.remainingRooms} kamar` : "Tidak Tersedia"}</span><button type="button" onClick={() => setEditingStay(!editingStay)} aria-expanded={editingStay} aria-controls="detail-edit-stay"><CalendarDays size={16} /> Ubah</button></div>
            <div className="detail-booking-price"><small>{room.available ? "Mulai dari" : "Harga referensi"}</small><div><strong>{formatRoomPrice(room.price)}</strong><span>/ malam</span></div></div>
            <p className="detail-booking-included"><CheckCircle2 size={17} /> Termasuk akses kolam air panas alami</p>
            <div className="detail-stay-card"><span className="detail-stay-label">Tanggal Menginap</span><div className="detail-stay-dates"><CalendarDays size={19} /><div><strong>{formatStayDate(checkIn)} – {formatStayDate(checkOut)}</strong><span>({nights} Malam)</span></div></div><div className="detail-stay-meta"><span><UsersRound size={19} /> {guests}</span><span><BedDouble size={19} /> 1 {room.name}</span></div></div>
            {editingStay && <form className="detail-date-form" id="detail-edit-stay" onSubmit={checkAvailability}>
              <label>Check-in<input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></label>
              <label>Check-out<input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
              <label className="detail-guest-field">Tamu<select value={guests} onChange={(event) => setGuests(event.target.value)}><option>2 Dewasa, 1 Anak</option><option>2 Dewasa</option><option>3 Dewasa</option><option>4 Dewasa</option></select></label>
              <button type="submit" className="detail-check-button"><CalendarDays size={18} /> Cek Ketersediaan</button>
            </form>}
            <div className="detail-price-summary"><div><span>Harga Kamar ({nights} Malam x {formatRoomPrice(room.price)})</span><strong>{formatRoomPrice(room.price * nights)}</strong></div><div><span>Pajak &amp; Biaya Layanan</span><span>Termasuk</span></div><div className="detail-price-total"><strong>Total Estimasi</strong><strong>{formatRoomPrice(room.price * nights)}</strong></div></div>
            {!room.available && <div className="detail-date-notice"><CalendarDays size={20} /><p><strong>Coba tanggal lain</strong>Kamar ini ditandai tidak tersedia pada data demo. Ubah tanggal untuk melihat pilihan, lalu hubungi hotel untuk konfirmasi.</p></div>}
            {room.available ? <a href={bookingHref} className="button button-primary detail-pick-button">Pilih Kamar <ArrowRight size={18} /></a> : <button type="button" className="detail-pick-button detail-pick-unavailable" disabled>Tidak Tersedia</button>}
            <button type="button" className="detail-edit-link" onClick={() => setEditingStay(!editingStay)} aria-expanded={editingStay} aria-controls="detail-edit-stay"><CalendarDays size={17} /> Ubah tanggal atau tamu</button>
            {message && <p className="detail-result" role="status">{message}</p>}
            <div className="detail-booking-assurances"><span><ShieldCheck size={19} /> Harga referensi langsung dari hotel</span><span><CalendarDays size={19} /> {room.cancellationPolicy.summary}</span><span><CheckCircle2 size={19} /> Konfirmasi melalui tim reservasi</span></div>
            <button type="button" className="detail-date-prompt" onClick={() => setEditingStay(true)}><span>Belum punya jadwal pasti?<strong>Pilih tanggal lain untuk melihat harga &amp; ketersediaan</strong></span><ChevronRight size={18} /></button>
            <div className="detail-help">Butuh bantuan reservasi khusus?<a href="/contact">Chat Tim Reservasi Hotel</a></div>
          </aside>
        </section>

        <section className="detail-extras"><div className="container"><span className="detail-eyebrow">TAMBAHAN SAAT MENGINAP</span><h2>Lengkapi Pengalaman Menginap Anda</h2><p>Pilihan kuliner dapat ditambahkan saat proses reservasi tersedia.</p><div className="detail-extra-grid"><article><div className="detail-extra-photo"><Image src="/images/kambing-guling.webp" alt="Kambing Guling" fill sizes="(max-width: 720px) 100vw, 33vw" /></div><h3>Kambing Guling</h3><p>Cocok untuk keluarga besar dan gathering hangat di malam hari.</p></article><article><div className="detail-extra-photo"><Image src="/images/outdoor-dining.webp" alt="Santap bersama keluarga" fill sizes="(max-width: 720px) 100vw, 33vw" /></div><h3>Ayam Bakar Family Set</h3><p>Pilihan santap bersama keluarga dengan suasana sejuk Darajat.</p></article><article><div className="detail-extra-photo"><Image src="/images/bbq-grill.webp" alt="BBQ dan Grill" fill sizes="(max-width: 720px) 100vw, 33vw" /></div><h3>BBQ & Grill Set</h3><p>Paket grill untuk dinikmati bersama di area resor.</p></article></div></div></section>

        <section className="container detail-related"><div className="detail-section-heading"><div><span className="detail-eyebrow">EKSPLORASI TIPE LAIN</span><h2>Pilihan Kamar Lainnya</h2></div><a href="/rooms">Lihat Semua Kamar & Suite <ArrowRight size={17} /></a></div><div className="detail-related-grid">{relatedRooms.map((item) => <article key={item.id}><a className="detail-related-photo" href={`/rooms/${item.id}`}><Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, 50vw" />{!item.available && <span>Tidak Tersedia</span>}</a><div><small>{item.guests}</small><h3>{item.name}</h3><p>{item.description}</p><div><strong>{formatRoomPrice(item.price)} <small>/ malam</small></strong><a href={`/rooms/${item.id}`}>Lihat Detail <ArrowRight size={16} /></a></div></div></article>)}</div></section>

        <section className="container detail-final-cta"><span className="detail-eyebrow">RESERVASI GREEN HERO DARAJAT</span><h2>Siap Menginap di Green Hero Darajat?</h2><p>Pilih tanggal menginap dan cek kembali pilihan kamar untuk menikmati liburan pegunungan yang hangat.</p><a className="button button-white button-lg" href="#availability">Cek Ketersediaan <ArrowRight size={18} /></a></section>
      </main>

      <footer className="site-footer" id="contact"><div className="container footer-grid"><div className="footer-about"><Brand href="/" /><p>Hotel & resor ramah keluarga di kawasan dataran tinggi Darajat Pass, Garut. Nikmati udara sejuk dan kolam air panas alami.</p><div className="social-icons"><a href="/gallery" aria-label="Lihat galeri"><Globe2 size={20} /></a><a href="/#location" aria-label="Lihat peta"><Map size={20} /></a></div></div><div><h3>Eksplorasi</h3><a href="/">Home</a><a href="/rooms">Kamar & Suite</a><a href="/facilities">Fasilitas</a><a href="/#experiences">Experiences</a></div><div><h3>Bantuan</h3><a href="#availability">Cek Ketersediaan</a><a href="/#location">Panduan Rute</a><a href="/contact">Kontak</a></div><div><h3>Kontak & Lokasi</h3><span><MapPin size={20} /> Jl. Raya Darajat KM 14, Karyamekar, Pasirwangi, Garut</span><span><Mail size={20} /> halo@greenherodarajat.com</span></div></div><div className="container footer-bottom"><span>© 2026 Green Hero Darajat Hotel & Resort.</span><span>Demo frontend · Harga & ketersediaan contoh</span></div></footer>
    </div>
  );
}
