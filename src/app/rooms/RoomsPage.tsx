"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Globe2,
  Headphones,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { rooms, formatRoomPrice, type Room } from "@/data/rooms";
import RoomInfoModal from "./RoomInfoModal";
import { getNights } from "@/data/booking";
import { countSelectedRooms, getRoomSelectionTotal, getSelectedRoomItems, normalizeRoomSelection, serializeRoomSelection, type RoomSelection } from "@/data/roomSelection";

const heroSlides = [
  { image: "/images/hero-resort.webp", alt: "Resor Green Hero Darajat di pegunungan" },
  { image: "/images/hero-pool.webp", alt: "Kolam air panas Green Hero Darajat" },
  { image: "/images/hero-suite.webp", alt: "Kamar suite dengan pemandangan pegunungan" },
];

const benefits = [
  { icon: Clock3, title: "Proses Reservasi Langsung", description: "Pilih kamar langsung dari Green Hero Darajat dengan informasi yang mudah dipahami." },
  { icon: ShieldCheck, title: "Informasi Kamar yang Jelas", description: "Lihat fasilitas, kapasitas tamu, dan tipe ranjang setiap kamar sebelum memilih." },
  { icon: Headphones, title: "Dukungan Staff Green Hero", description: "Tim kami siap membantu kebutuhan menginap dan penataan kamar Anda." },
];

type Props = { initialSelection: RoomSelection; initialCheckIn: string; initialCheckOut: string; initialGuests: string };

function formatSelectionDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return months[month - 1] && day ? `${day} ${months[month - 1]} ${year}` : "Pilih tanggal";
}

export default function RoomsPage({ initialSelection, initialCheckIn, initialCheckOut, initialGuests }: Props) {
  const [slide, setSlide] = useState(0);
  const [roomType, setRoomType] = useState("all");
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [selection, setSelection] = useState<RoomSelection>(initialSelection);
  const [message, setMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  const visibleRooms = roomType === "all" ? rooms : rooms.filter((room) => room.id === roomType);

  const selectedRooms = getSelectedRoomItems(selection);
  const totalRooms = countSelectedRooms(selection);
  const nights = getNights(checkIn, checkOut);
  const roomTotal = getRoomSelectionTotal(selection, nights);

  function changeRoomQuantity(roomId: string, delta: number) {
    setSelection((current) => {
      const quantity = (current.find((item) => item.roomId === roomId)?.quantity ?? 0) + delta;
      return normalizeRoomSelection([...current.filter((item) => item.roomId !== roomId), { roomId, quantity }]);
    });
  }

  function continueBooking() {
    if (!totalRooms || nights <= 0) return;
    const params = new URLSearchParams({ room: selectedRooms[0].room.id, rooms: serializeRoomSelection(selection), checkIn, checkOut, guests });
    window.location.assign(`/booking/extras?${params}`);
  }

  function searchRooms(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkIn || !checkOut) {
      setMessage("Pilih tanggal check-in dan check-out terlebih dahulu.");
      return;
    }
    if (checkOut <= checkIn) {
      setMessage("Tanggal check-out harus setelah tanggal check-in.");
      return;
    }
    const availableCount = visibleRooms.filter((room) => room.available).length;
    const unavailableCount = visibleRooms.length - availableCount;
    setMessage(`Pencarian demo: ${availableCount} tipe kamar tersedia dan ${unavailableCount} tidak tersedia. Harga yang ditampilkan adalah contoh.`);
    document.getElementById("rooms-list")?.scrollIntoView({ behavior: "smooth" });
  }

  function detailHref(id: string) {
    const dates = new URLSearchParams();
    if (checkIn) dates.set("checkIn", checkIn);
    if (checkOut) dates.set("checkOut", checkOut);
    return `/rooms/${id}${dates.size ? `?${dates}` : ""}`;
  }

  return (
    <div className="rooms-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#availability" contactHref="/contact" />
      <main>
        <section className="rooms-hero" aria-label="Kamar dan Suite Green Hero Darajat">
          {heroSlides.map((item, index) => (
            <Image key={item.image} src={item.image} alt={item.alt} fill priority={index === 0} sizes="100vw" className={`rooms-hero-image${slide === index ? " is-active" : ""}`} />
          ))}
          <div className="rooms-hero-shade" />
          <div className="container rooms-hero-content">
            <div>
              <nav className="rooms-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Kamar & Suite</span></nav>
              <span className="rooms-eyebrow">OUR ROOMS</span>
              <h1>Temukan Kamar yang Sesuai untuk Perjalanan Anda</h1>
              <p>Pilih kamar yang nyaman untuk beristirahat bersama pasangan, keluarga, atau rombongan selama menikmati suasana sejuk dan pemandian air panas alami Darajat.</p>
            </div>
            <div className="rooms-hero-controls">
              <button type="button" aria-label="Slide sebelumnya" onClick={() => setSlide((current) => (current + heroSlides.length - 1) % heroSlides.length)}><ChevronLeft size={20} /></button>
              <div className="rooms-hero-dots">{heroSlides.map((item, index) => <button type="button" key={item.image} aria-label={`Tampilkan slide ${index + 1}`} aria-current={slide === index ? "true" : undefined} className={slide === index ? "is-active" : ""} onClick={() => setSlide(index)} />)}</div>
              <button type="button" aria-label="Slide berikutnya" onClick={() => setSlide((current) => (current + 1) % heroSlides.length)}><ChevronRight size={20} /></button>
            </div>
          </div>
        </section>

        <section className="container rooms-availability" id="availability" aria-label="Cari kamar">
          <form className="rooms-search" onSubmit={searchRooms}>
            <label><span><CalendarDays size={16} /> Check-in</span><input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></label>
            <label><span><CalendarDays size={16} /> Check-out</span><input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
            <label><span><UsersRound size={16} /> Tamu</span><select value={guests} onChange={(event) => setGuests(event.target.value)}>{[...new Set([initialGuests, "2 Dewasa", "4 Dewasa (Family)", "Rombongan (5-8 Tamu)", "Grup Besar (10+ Tamu)"])].map((label) => <option key={label} value={label}>{label}</option>)}</select></label>
            <label><span><BedDouble size={16} /> Kamar</span><select value={roomType} onChange={(event) => setRoomType(event.target.value)}><option value="all">Semua Tipe Kamar</option>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name}{room.available ? "" : " — Tidak tersedia"}</option>)}</select></label>
            <button className="button button-primary rooms-search-button" type="submit"><Search size={18} /> Cek Ketersediaan</button>
          </form>
          {message && <p className="rooms-search-message" role="status">{message}</p>}
        </section>

        <section className="container rooms-intro">
          <span className="rooms-eyebrow">LUXURY HIGHLAND SANCTUARY</span>
          <h2>Kenyamanan Autentik di Lereng Darajat</h2>
          <p>Setiap ruang dirancang dengan perpaduan kehangatan kayu jati alami, panorama kabut pegunungan, dan fasilitas pemandian air panas bumi yang menenangkan.</p>
          <div className="rooms-intro-note"><CheckCircle2 size={18} /> Akses fasilitas kolam renang air panas alami & sarapan pagi</div>
          <small className="rooms-price-disclaimer">Harga, sisa kamar, ketersediaan, dan kebijakan pembatalan pada halaman ini adalah data contoh.</small>
        </section>

        <section className="container rooms-booking-layout" id="rooms-list" aria-label="Pilihan kamar dan ringkasan harga"><div className="rooms-list">
          {visibleRooms.map((room) => (
            <article className={`rooms-card${room.available ? "" : " is-unavailable"}`} id={`room-${room.id}`} key={room.id}>
              <div className="rooms-card-photo">
                <Image src={room.image} alt={room.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 40vw, 30vw" />
                <span className="rooms-card-badge">{room.badge}</span>
                {!room.available && <span className="rooms-unavailable-badge">Tidak Tersedia</span>}
              </div>
              <div className="rooms-card-body">
                <div>
                  <span className="rooms-card-eyebrow">{room.eyebrow}</span>
                  <h3>{room.name}</h3>
                  <span className="rooms-card-tagline">{room.tagline}</span>
                  <p>{room.description}</p>
                  <div className="rooms-card-amenities">{room.amenities.map(({ icon: Icon, label }) => <span key={label}><Icon size={19} /> {label}</span>)}</div>
                  <div className="rooms-card-conditions">
                    <span className={`rooms-stock${room.remainingRooms === 0 ? " is-empty" : room.remainingRooms <= 2 ? " is-low" : ""}`}><BedDouble size={16} /> Sisa {room.remainingRooms} kamar</span>
                    <div className="rooms-cancellation"><ShieldCheck size={17} /><span>{room.cancellationPolicy.summary}</span></div>
                  </div>
                </div>
                <div className="rooms-card-actions">
                  <div className="rooms-price"><small>{room.available ? "Mulai dari" : "Harga referensi"}</small><strong>{formatRoomPrice(room.price)}</strong><span>/ malam</span></div>
                  <div>
                    <button type="button" className="rooms-detail-button" aria-haspopup="dialog" onClick={() => setActiveRoom(room)}>Lihat Detail</button>
                    {room.available ? (selection.find((item) => item.roomId === room.id)?.quantity ?? 0) > 0 ? <div className="rooms-quantity" aria-label={`Jumlah ${room.name}`}><button type="button" aria-label={`Kurangi ${room.name}`} onClick={() => changeRoomQuantity(room.id, -1)}><Minus size={18} /></button><output aria-live="polite">{selection.find((item) => item.roomId === room.id)?.quantity ?? 0}</output><button type="button" aria-label={`Tambah ${room.name}`} disabled={(selection.find((item) => item.roomId === room.id)?.quantity ?? 0) >= room.remainingRooms} onClick={() => changeRoomQuantity(room.id, 1)}><Plus size={18} /></button></div> : <button className="button button-primary" type="button" onClick={() => changeRoomQuantity(room.id, 1)}>Pilih Kamar <Plus size={17} /></button> : <a className="button button-primary" href={detailHref(room.id)}>Pilih Kamar <ArrowRight size={17} /></a>}
                  </div>
                </div>
              </div>
            </article>
          ))}
          </div>
          {totalRooms > 0 && <a className="rooms-mobile-summary" href="#rooms-cart"><span>{totalRooms} Kamar • {formatRoomPrice(roomTotal)}</span><strong>Lihat Ringkasan <ArrowRight size={16} /></strong></a>}
          <aside className="rooms-cart" id="rooms-cart" aria-label="Ringkasan pilihan kamar"><div className="rooms-cart-heading"><span className="rooms-eyebrow">RINGKASAN BOOKING</span><h2>Green Hero Darajat</h2><p><CalendarDays size={16} />{formatSelectionDate(checkIn)} – {formatSelectionDate(checkOut)}</p><small>{nights > 0 ? `${nights} Malam` : "Pilih tanggal menginap yang valid"} • {guests}</small></div><div className="rooms-cart-room-heading"><span><BedDouble size={22} /></span><div><h3>Kamar</h3><p>{totalRooms} kamar dipilih</p></div></div><div className="rooms-cart-items">{selectedRooms.length ? selectedRooms.map(({ room, quantity }) => <div className="rooms-cart-item" key={room.id}><div><strong>{room.name}</strong><b>{formatRoomPrice(room.price * quantity * nights)}</b></div><p>Sarapan &amp; akses kolam air panas</p><div><span>{quantity} Kamar × {formatRoomPrice(room.price)} × {nights} Malam</span><button type="button" aria-label={`Hapus ${room.name} dari pilihan`} onClick={() => setSelection((current) => current.filter((item) => item.roomId !== room.id))}><Trash2 size={13} />Hapus</button></div></div>) : <div className="rooms-cart-empty"><BedDouble size={30} /><strong>Belum ada kamar dipilih</strong><p>Pilih tipe kamar dan jumlahnya dari daftar. Anda dapat menambahkan beberapa tipe kamar sekaligus.</p></div>}</div><div className="rooms-cart-subtotal"><span>Subtotal Kamar</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="rooms-cart-total"><div aria-live="polite" aria-atomic="true"><h3>Total</h3><strong>{formatRoomPrice(roomTotal)}</strong></div><p>Termasuk pajak &amp; biaya layanan</p><button type="button" className="button button-primary" disabled={!totalRooms || nights <= 0} onClick={continueBooking}>Lanjut ke Pilihan Tambahan <ArrowRight size={18} /></button><small>{totalRooms ? "Semua pilihan kamar diteruskan dalam satu booking." : "Pilih minimal 1 kamar untuk melanjutkan."}</small></div></aside>
        </section>

        <section className="container rooms-benefits">
          <span className="rooms-eyebrow">KEUNTUNGAN TAMU</span>
          <h2>Booking Langsung dengan Lebih Mudah</h2>
          <div className="rooms-benefit-grid">{benefits.map(({ icon: Icon, title, description }) => <div key={title}><span className="rooms-benefit-icon"><Icon size={27} /></span><h3>{title}</h3><p>{description}</p></div>)}</div>
        </section>

        <section className="container rooms-experience">
          <div className="rooms-experience-photo"><Image src="/images/bbq-grill.webp" alt="BBQ dan grill untuk pengalaman menginap di Darajat" fill sizes="(max-width: 800px) 100vw, 40vw" /><span>Special Resort Experience</span></div>
          <div className="rooms-experience-copy"><span className="rooms-eyebrow"><Flame size={17} /> KULINER & KEHANGATAN</span><h2>Tambahkan Pengalaman Saat Menginap</h2><p>Nikmati malam sejuk Darajat bersama keluarga dengan hidangan lezat. Paket Kambing Guling, Ayam Bakar, dan BBQ & Grill dapat ditambahkan saat melakukan booking kamar.</p><a className="button button-primary" href="/#experiences">Lihat Paket Tambahan <ArrowRight size={18} /></a><small>Disediakan lengkap dengan alat pemanggang & api unggun.</small></div>
        </section>

        <section className="container rooms-final-cta" id="booking-section"><div><span className="rooms-eyebrow">RESERVASI MUDAH</span><h2>Sudah Menemukan Kamar yang Cocok?</h2><p>Pilih tanggal menginap dan cek ketersediaan kamar Green Hero Darajat untuk memastikan liburan keluarga Anda berkesan.</p><div><a className="button button-white button-lg" href="#availability">Cek Ketersediaan</a><a className="button button-outline-light button-lg" href="/contact"><MessageCircle size={18} /> Hubungi Kami</a></div></div></section>
      </main>
      {activeRoom && <RoomInfoModal key={activeRoom.id} room={activeRoom} onClose={() => setActiveRoom(null)} />}

      <footer className="site-footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-about"><Brand href="/" /><p>Hotel & resor ramah keluarga di kawasan dataran tinggi Darajat Pass, Garut. Menggabungkan kenyamanan alami, kolam air panas, dan panorama perbukitan asri.</p><div className="social-icons"><a href="/gallery" aria-label="Lihat galeri"><Globe2 size={20} /></a><a href="/#location" aria-label="Lihat lokasi"><Map size={20} /></a></div></div>
          <div><h3>Eksplorasi</h3><a href="/">Tentang Kami</a><a href="/rooms">Kamar & Suite</a><a href="/#hot-spring">Kolam Air Panas</a><a href="/gallery">Galeri Momen</a></div>
          <div><h3>Bantuan & Panduan</h3><a href="#availability">Cek Ketersediaan</a><a href="/#location">Panduan Rute Darajat</a><a href="/contact">Kontak & Bantuan</a></div>
          <div><h3>Kontak & Lokasi</h3><span><MapPin size={20} /> Jl. Raya Darajat KM 14, Karyamekar, Pasirwangi, Kabupaten Garut, Jawa Barat 44161</span><span><Mail size={20} /> halo@greenherodarajat.com</span></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Green Hero Darajat Hotel & Resort. Seluruh Hak Cipta Dilindungi.</span><span>Demo frontend · Data & kontak contoh</span></div>
      </footer>

    </div>
  );
}
