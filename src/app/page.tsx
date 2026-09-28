"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/Brand";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroVideo } from "@/components/HeroVideo";
import { rooms, formatRoomPrice } from "@/data/rooms";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleParking,
  Clock3,
  Coffee,
  Globe2,
  Mail,
  Map,
  MapPin,
  Mountain,
  Phone,
  ShieldCheck,
  Thermometer,
  Trees,
  UsersRound,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

const highlights: { icon: LucideIcon; title: string; detail: string }[] = [
  {
    icon: Bath,
    title: "Air Hangat Alami Pegunungan",
    detail: "Mata air belerang alami bersuhu seimbang untuk meredakan kepenatan tubuh.",
  },
  {
    icon: Wind,
    title: "Udara Sejuk & Asri Bebas Polusi",
    detail: "Suhu rata-rata 16°C–20°C yang menyegarkan di keliling perkebunan hijau Garut.",
  },
  {
    icon: Mountain,
    title: "Pemandangan Lembah Garut",
    detail: "Panorama lepas perbukitan dan lautan kabut pagi langsung dari area resor.",
  },
];

const amenities: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Waves, title: "Warm Pool", detail: "Kolam Air Hangat" },
  { icon: Bath, title: "Kids Pool", detail: "Kolam Khusus Anak" },
  { icon: Wifi, title: "Free High-Speed Wi-Fi", detail: "Koneksi Cepat Area Hotel" },
  { icon: CircleParking, title: "Luas & Aman Parking", detail: "Parkir Mobil & Bus" },
  { icon: UsersRound, title: "Family Friendly", detail: "Perlengkapan Lengkap" },
  { icon: Coffee, title: "Room Service", detail: "Makanan & Minuman Hangat" },
  { icon: Clock3, title: "24 Hour Front Desk", detail: "Layanan Resepsionis Siaga" },
  { icon: Trees, title: "Outdoor Playground", detail: "Taman Bermain Terbuka" },
];

const gallery = [
  {
    image: "/images/sunrise.webp",
    category: "LANDSCAPE",
    title: "Pemandangan Sunrise Pegunungan Darajat",
    className: "gallery-large",
  },
  {
    image: "/images/twilight-pool.webp",
    category: "RELAXATION",
    title: "Kolam Air Hangat Alami",
    className: "gallery-tall",
  },
  {
    image: "/images/warm-room.webp",
    category: "SUITES",
    title: "Interior Kamar Hangat",
    className: "",
  },
  {
    image: "/images/misty-valley.webp",
    category: "NATURE",
    title: "Kabut Sejuk Dataran Tinggi",
    className: "",
  },
  {
    image: "/images/family-lounge.webp",
    category: "FAMILY TIME",
    title: "Lounge Santai Keluarga",
    className: "",
  },
];

const testimonials = [
  {
    quote:
      "Suasana sangat sejuk dan kolam air hangatnya juara untuk anak-anak setelah seharian jalan-jalan di Darajat.",
    name: "Keluarga Pratama",
    location: "Bandung, Jawa Barat",
  },
  {
    quote:
      "Kamar bersih, pemandangan bukit asri, dan stafnya ramah sekali. Pilihan terbaik untuk liburan santai keluarga.",
    name: "Hendra & Maya",
    location: "Jakarta Selatan",
  },
  {
    quote:
      "Tempatnya tenang, udara bersih, dan fasilitas air hangatnya bikin betah berlama-lama. Pasti kembali lagi!",
    name: "Rina S.",
    location: "Bogor, Jawa Barat",
  },
];

function SectionEyebrow({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return <span className={`section-eyebrow${gold ? " gold" : ""}`}>{children}</span>;
}

export default function Home() {
  const router = useRouter();
  const [roomIndex, setRoomIndex] = useState(0);
  const [bookingMessage, setBookingMessage] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Dewasa, 2 Anak");
  const [roomCount, setRoomCount] = useState("1 Kamar");

  const changeRoom = (direction: number) => {
    setRoomIndex((current) => (current + direction + rooms.length) % rooms.length);
  };

  const visibleRooms = [0, 1, 2].map((offset) => rooms[(roomIndex + offset) % rooms.length]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkIn && checkOut && checkOut <= checkIn) {
      setBookingMessage("Tanggal check-out harus setelah tanggal check-in.");
      return;
    }
    const params = new URLSearchParams({ guests });
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    setBookingMessage("");
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <>
      <SiteHeader id="home-header" revealOnScroll />

      <main>
        <section className="hero" id="home" aria-label="Selamat datang di Green Hero Darajat">
          <HeroVideo />
          <div className="hero-shade" />
          <section className="booking-section" id="booking" aria-label="Cari kamar">
            <h1 className="hero-destination-title">Darajat Garut</h1>
            <div className="container">
              <form className="booking-card" onSubmit={handleSearch}>
                <label className="booking-field">
                  <span><CalendarDays size={19} /> Check-in</span>
                  <input aria-label="Tanggal check-in" type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} />
                </label>
                <label className="booking-field">
                  <span><CalendarDays size={19} /> Check-out</span>
                  <input aria-label="Tanggal check-out" type="date" value={checkOut} min={checkIn || undefined} onChange={(event) => setCheckOut(event.target.value)} />
                </label>
                <label className="booking-field">
                  <span><UsersRound size={20} /> Tamu</span>
                  <select aria-label="Jumlah tamu" value={guests} onChange={(event) => setGuests(event.target.value)}>
                    <option>2 Dewasa, 2 Anak</option>
                    <option>2 Dewasa</option>
                    <option>4 Dewasa</option>
                    <option>4 Dewasa, 2 Anak</option>
                  </select>
                </label>
                <label className="booking-field">
                  <span><BedDouble size={20} /> Kamar</span>
                  <select aria-label="Jumlah kamar" value={roomCount} onChange={(event) => setRoomCount(event.target.value)}>
                    <option>1 Kamar</option>
                    <option>2 Kamar</option>
                    <option>3 Kamar</option>
                  </select>
                </label>
                <button className="button button-primary booking-submit" type="submit">Cek Kamar</button>
              </form>
              {bookingMessage && <p className="booking-message" role="status">{bookingMessage}</p>}
            </div>
          </section>
        </section>

        <section className="welcome-section container" id="about">
          <div className="welcome-copy">
            <SectionEyebrow>WELCOME TO GREEN HERO</SectionEyebrow>
            <h2>Tempat Beristirahat di Udara Sejuk Darajat</h2>
            <p className="section-description">
              Green Hero Darajat menawarkan pengalaman menginap yang nyaman untuk keluarga dengan suasana pegunungan dan fasilitas yang mendukung liburan santai. Berada tepat di kawasan dataran tinggi Garut, udara segar dan panorama alam menjadi teman terbaik istirahat Anda.
            </p>
            <div className="highlight-list">
              {highlights.map(({ icon: Icon, title, detail }) => (
                <div className="highlight" key={title}>
                  <span className="highlight-icon"><Icon size={21} /></span>
                  <span><strong>{title}</strong><small>{detail}</small></span>
                </div>
              ))}
            </div>
          </div>
          <div className="welcome-media">
            <Image src="/images/resort-exterior.webp" alt="Bangunan resor Green Hero di antara bukit dan taman" fill sizes="(max-width: 780px) 100vw, 50vw" />
            <div className="welcome-badge"><UsersRound size={30} /><span><strong>Family Friendly Resort</strong><small>Fasilitas aman & nyaman untuk semua umur</small></span></div>
          </div>
        </section>

        <section className="rooms-section section-space" id="rooms">
          <div className="container">
            <div className="section-header room-header">
              <div>
                <SectionEyebrow gold>HIGHLAND SANCTUARY SUITES</SectionEyebrow>
                <h2>Pilihan Kamar untuk Perjalanan Anda</h2>
                <p>Dirancang mewah, hangat, dan intim untuk kebersamaan keluarga di pelukan sejuknya alam pegunungan Darajat Pass.</p>
              </div>
              <div className="room-actions">
                <button type="button" onClick={() => changeRoom(-1)} aria-label="Kamar sebelumnya"><ChevronLeft size={21} /></button>
                <button type="button" onClick={() => changeRoom(1)} aria-label="Kamar berikutnya"><ChevronRight size={21} /></button>
                <a href="/rooms">Lihat Semua Kamar <ArrowRight size={17} /></a>
              </div>
            </div>
            <div className="room-grid">
              {visibleRooms.map((room) => (
                <article className={`room-card${room.available ? "" : " is-unavailable"}`} key={room.name}>
                  <div className="room-photo">
                    <Image src={room.image} alt={room.name} fill sizes="(max-width: 780px) 100vw, 33vw" />
                    <span>{room.previewTag}</span>
                    {!room.available && <span className="room-unavailable">Tidak Tersedia</span>}
                  </div>
                  <div className="room-content">
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <div className="room-facts"><span><UsersRound size={16} /> {room.guests}</span><span><Mountain size={16} /> {room.feature}</span></div>
                    <div className="room-bottom"><span>{room.available ? "Mulai dari" : "Harga referensi"} {formatRoomPrice(room.price)} / malam</span><a href={`/rooms/${room.id}`}>Lihat Detail <ArrowRight size={17} /></a></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="room-dots" aria-label="Posisi pilihan kamar">
              {rooms.map((room, index) => (
                <button key={room.name} className={index === roomIndex ? "active" : ""} type="button" aria-label={`Mulai dari ${room.name}`} onClick={() => setRoomIndex(index)} />
              ))}
            </div>
          </div>
        </section>

        <section className="experiences-section section-space container" id="experiences">
          <div className="section-header experiences-header">
            <div><SectionEyebrow gold>GREEN HERO EXPERIENCES</SectionEyebrow><h2>Lebih dari Sekadar Menginap</h2></div>
            <p>Lengkapi waktu bersama keluarga dengan pilihan pengalaman dan layanan tambahan selama menginap di Green Hero Darajat.</p>
          </div>
          <div className="experience-layout">
            <div className="experience-feature image-overlay-card">
              <Image src="/images/outdoor-dining.webp" alt="Keluarga menikmati makan malam di ruang terbuka pegunungan" fill sizes="(max-width: 780px) 100vw, 40vw" />
              <div><span>DINING HIGHLIGHT</span><h3>Outdoor Highland Dining</h3><p>Santap hangat bersama keluarga di udara sejuk Darajat</p></div>
            </div>
            <div className="experience-options">
              <article className="experience-main">
                <div>
                  <SectionEyebrow gold>DINING EXPERIENCE</SectionEyebrow>
                  <h3>Kambing Guling</h3>
                  <p>Pilihan santap bersama untuk keluarga besar, gathering, atau momen spesial selama menginap di Green Hero.</p>
                </div>
                <Image src="/images/kambing-guling.webp" alt="Kambing guling untuk acara makan bersama" width={110} height={110} />
                <div className="experience-meta"><span><UsersRound size={17} /> Cocok untuk keluarga & rombongan</span><a href="#booking">Lihat Pilihan <ArrowRight size={16} /></a></div>
              </article>
              <div className="experience-small-grid">
                <article className="experience-small">
                  <span>FAMILY DINING</span>
                  <Image src="/images/bbq-grill.webp" alt="BBQ dan grill di ruang terbuka" width={100} height={100} />
                  <h3>BBQ & Grill</h3>
                  <p>Nikmati waktu santai bersama keluarga dengan paket grill di tengah udara sejuk Darajat.</p>
                  <a href="#booking">Lihat Pilihan <ArrowRight size={16} /></a>
                </article>
                <article className="experience-small birthday">
                  <span>SPECIAL MOMENT</span>
                  <Image src="/images/birthday-room.webp" alt="Dekorasi ulang tahun di kamar resor" width={100} height={100} />
                  <h3>Birthday<br />Celebration</h3>
                  <p>Buat momen ulang tahun lebih berkesan dengan dekorasi dan pilihan paket perayaan selama menginap.</p>
                  <a href="#booking">Lihat Pilihan <ArrowRight size={16} /></a>
                </article>
              </div>
            </div>
          </div>
          <div className="extras-bar">
            <div><strong>• &nbsp; PILIHAN TAMBAHAN SELAMA MENGINAP</strong><div className="extras-chips"><span>Ayam Bakar Family Set</span><span>Anniversary Setup</span><span>Room Decoration</span><span>Extra Bed</span><span>Sarapan Tambahan</span></div></div>
            <a className="button button-primary" href="#booking">Lihat Semua Pengalaman <ArrowRight size={18} /></a>
          </div>
        </section>

        <section className="spring-section container section-space" id="hot-spring">
          <div className="spring-media">
            <Image src="/images/hot-spring.webp" alt="Kolam air hangat alami di tengah perbukitan hijau Darajat" fill sizes="(max-width: 780px) 100vw, 55vw" />
            <span>Suhu Air Alami: 36°C – 38°C</span>
          </div>
          <div className="spring-copy">
            <SectionEyebrow>RELAKSASI ALAMI</SectionEyebrow>
            <h2>Hangat di Tengah Udara Pegunungan</h2>
            <p>Nikmati waktu santai bersama keluarga di kolam air hangat setelah menikmati sejuknya kawasan Darajat. Air hangat alami bersuhu ideal untuk relaksasi tubuh di tengah sejuknya udara dataran tinggi.</p>
            <div className="spring-stats">
              <span><Thermometer size={23} /><strong>36°C – 38°C</strong><small>Suhu Ideal</small></span>
              <span><Clock3 size={23} /><strong>Setiap Hari</strong><small>Buka 06.00 – 22.00</small></span>
              <span><ShieldCheck size={23} /><strong>Ramah Anak</strong><small>Kedalaman Aman</small></span>
            </div>
          </div>
        </section>

        <section className="amenities-section section-space" id="facilities">
          <div className="container">
            <div className="center-heading"><SectionEyebrow>FASILITAS HOTEL</SectionEyebrow><h2>Everything You Need for a<br />Comfortable Stay</h2><p>Fasilitas lengkap untuk menunjang liburan santai dan menyenangkan bersama keluarga tercinta.</p></div>
            <div className="amenities-grid">
              {amenities.map(({ icon: Icon, title, detail }) => (
                <div className="amenity" key={title}><span><Icon size={28} strokeWidth={2.2} /></span><strong>{title}</strong><small>{detail}</small></div>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery-section section-space container" id="gallery">
          <div className="section-header gallery-header"><div><SectionEyebrow>FOTO & MOMEN</SectionEyebrow><h2>Experience Green Hero</h2></div><a className="button button-quiet" href="/gallery">Lihat Galeri Lengkap</a></div>
          <div className="gallery-grid" id="gallery-grid">
            {gallery.map((item) => (
              <div className={`gallery-item ${item.className}`} key={item.title}>
                <Image src={item.image} alt={item.title} fill sizes={item.className === "gallery-large" ? "(max-width: 780px) 100vw, 60vw" : "(max-width: 780px) 100vw, 33vw"} />
                <div><span>{item.category}</span><h3>{item.title}</h3></div>
              </div>
            ))}
          </div>
        </section>

        <section className="testimonials-section section-space">
          <div className="container">
            <div className="center-heading"><SectionEyebrow>ULASAN PENGUNJUNG</SectionEyebrow><h2>What Our Guests Say</h2></div>
            <div className="testimonials-grid">
              {testimonials.map((item) => (
                <blockquote key={item.name}>
                  <div className="stars" aria-label="5 dari 5 bintang">★★★★★</div>
                  <p>“{item.quote}”</p>
                  <footer><strong>{item.name}</strong><span>{item.location}</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="location-section container section-space" id="location">
          <div className="location-map">
            <Image src="/images/darajat-map.webp" alt="Ilustrasi rute menuju kawasan Darajat Pass di Garut" fill sizes="(max-width: 780px) 100vw, 50vw" />
          </div>
          <div className="location-copy">
            <SectionEyebrow>AKSES & PETUNJUK</SectionEyebrow>
            <h2>Explore Darajat</h2>
            <strong><MapPin size={21} /> Darajat, Garut, Jawa Barat</strong>
            <p>Terletak di ketinggian Darajat Pass dengan akses jalan beraspal yang mulus. Dikelilingi perkebunan sayur dan pemandangan kawah geotermal, tempat yang tepat untuk melarikan diri dari hiruk pikuk perkotaan.</p>
            <div className="location-actions"><a className="button button-primary" href="https://www.google.com/maps/search/?api=1&query=Darajat+Pass+Garut" target="_blank" rel="noreferrer"><Map size={20} /> Petunjuk Arah</a><a className="button button-quiet" href="/contact"><Phone size={20} /> Hubungi Kami</a></div>
          </div>
        </section>

        <section className="final-cta">
          <div className="container">
            <SectionEyebrow>RENCANAKAN LIBURAN ANDA</SectionEyebrow>
            <h2>Ready for Your Stay in Darajat?</h2>
            <p>Temukan kamar yang sesuai dan rencanakan waktu menginap bersama keluarga di tengah kenyamanan kolam air hangat dan sejuknya pegunungan.</p>
            <a className="button button-white button-lg" href="#booking">Cek Ketersediaan Sekarang <ArrowRight size={21} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer theme-footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-about"><Brand /><p>Hotel & resor ramah keluarga di kawasan dataran tinggi Darajat Pass, Garut. Menggabungkan kenyamanan alami, kolam air panas, dan panorama perbukitan asri.</p><div className="social-icons"><a href="/gallery" aria-label="Lihat galeri"><Camera size={20} /></a><a href="#location" aria-label="Lihat lokasi"><Globe2 size={20} /></a><a href="#location" aria-label="Lihat peta"><Map size={20} /></a></div></div>
          <div><h3>Eksplorasi</h3><a href="#about">Tentang Kami</a><a href="/rooms">Kamar & Fasilitas</a><a href="#hot-spring">Kolam Air Panas</a><a href="/gallery">Galeri Momen</a></div>
          <div><h3>Bantuan & Panduan</h3><a href="#booking">Kebijakan Reservasi</a><a href="#location">Panduan Rute Darajat</a><a href="/contact">Kontak & Bantuan</a><a href="/contact">Kebijakan Privasi</a></div>
          <div><h3>Kontak & Lokasi</h3><span><MapPin size={20} /> Jl. Raya Darajat KM 14, Karyamekar, Pasirwangi, Kabupaten Garut, Jawa Barat 44161</span><span><Phone size={20} /> +62 812-3456-7890</span><span><Mail size={20} /> halo@greenherodarajat.com</span></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Green Hero Darajat Hotel & Resort. Seluruh Hak Cipta Dilindungi.</span><span>Demo frontend · Data & kontak contoh</span></div>
      </footer>
    </>
  );
}
