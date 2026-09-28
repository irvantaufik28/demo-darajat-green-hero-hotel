"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { BellRing, CalendarDays, Clock3, ExternalLink, Headphones, Hotel, Mail, MapPin, MessageCircle, Minus, Mountain, Navigation, Phone, Plus, Send, Thermometer, UtensilsCrossed, Waves } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { contactDetails, contactSubjects, contactTopics } from "@/data/contact";

const contactCards = [
  { title: "Chat via WhatsApp", badge: "Respon Cepat", description: "Untuk pertanyaan cepat mengenai kamar, reservasi, dan kebutuhan menginap.", value: `${contactDetails.whatsapp} (Layanan 24 Jam)`, action: "Buka WhatsApp", href: contactDetails.whatsappHref, icon: MessageCircle, external: true },
  { title: "Hubungi Hotel", badge: "Front Desk & Hotel", description: "Berbicara langsung dengan tim reservasi dan front desk Green Hero Darajat.", value: contactDetails.phone, action: "Telepon Sekarang", href: contactDetails.phoneHref, icon: Phone, external: false },
  { title: "Email Kami", badge: "Resmi & Kelompok", description: "Untuk kebutuhan informasi, kerja sama kelompok, atau komunikasi yang lebih formal.", value: contactDetails.email, action: "Kirim Email", href: `mailto:${contactDetails.email}`, icon: Mail, external: false },
];

const serviceInformation = [
  { title: "Layanan Meja Depan (Front Desk)", detail: "24 Jam Setiap Hari tanpa henti", icon: Clock3 },
  { title: "Jam Check-In & Check-Out", detail: "Check-In: 14:00 WIB | Check-Out: 12:00 WIB", icon: CalendarDays },
  { title: "Kolam Air Panas Alami", detail: "06:00 – 22:00 WIB (Suhu 38°C – 41°C)", icon: Waves },
  { title: "Layanan Restoran & Dining", detail: "07:00 – 22:00 WIB (Menu Tradisional & Western)", icon: UtensilsCrossed },
  { title: "Dukungan Concierge WhatsApp", detail: "Respons aktif 24 Jam siap membantu perjalanan", icon: Headphones },
];

export default function ContactPage() {
  const [subject, setSubject] = useState("rooms");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [locationZoom, setLocationZoom] = useState(1);
  const subjectRef = useRef<HTMLSelectElement>(null);

  function selectTopic(topic: (typeof contactTopics)[number]) {
    setSubject(topic.subject);
    setMessage((current) => current || `Halo Green Hero Darajat, saya ingin bertanya mengenai ${topic.label.toLowerCase()}.`);
    setFormStatus("");
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    subjectRef.current?.focus({ preventScroll: true });
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("Simulasi selesai. Pesan belum dikirim karena ini adalah demo. Hubungi tim hotel melalui WhatsApp, telepon, atau email untuk bantuan langsung.");
  }

  return (
    <>
      <SiteHeader id="contact-header" links={interiorLinks} activeHref="/contact" homeHref="/" bookingHref="/rooms#availability" contactHref="/contact" />
      <main className="resort-contact-page">
        <section className="resort-contact-hero">
          <Image src="/images/contact-hero.jpg" alt="Panorama pegunungan hijau di kawasan Darajat" fill sizes="100vw" preload />
          <div className="resort-contact-container"><span className="resort-contact-hero-label">HUBUNGI GREEN HERO</span><h1>Kami Siap Membantu Perjalanan Anda</h1><p>Hubungi tim Green Hero Darajat untuk informasi kamar, reservasi, fasilitas, maupun kebutuhan selama menginap.</p></div>
        </section>

        <section className="resort-contact-container resort-contact-cards" aria-label="Pilihan menghubungi hotel">
          {contactCards.map(({ title, badge, description, value, action, href, icon: Icon, external }, index) => <article className="resort-contact-card" key={title}><div className="resort-contact-card-top"><span className="resort-contact-icon"><Icon size={26} /></span><span className="resort-contact-badge">{badge}</span></div><h2>{title}</h2><p>{description}</p><strong className="resort-contact-card-value">{index === 0 && <span className="resort-contact-dot" />}{value}</strong><a className={`button ${index === 0 ? "button-primary" : "button-quiet"}`} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{action}{external && <ExternalLink size={16} />}</a></article>)}
        </section>

        <section className="resort-contact-container resort-contact-section">
          <div className="resort-contact-reservation"><div className="resort-contact-reservation-top"><div><span className="resort-contact-eyebrow"><BellRing size={18} />BANTUAN RESERVASI CEPAT</span><h2>Butuh Bantuan Reservasi?</h2><p>Tim kami dapat membantu informasi ketersediaan kamar, detail reservasi, maupun Green Hero Experiences.</p></div><div className="resort-contact-reservation-actions"><a className="button button-primary" href={`${contactDetails.whatsappHref}?text=Halo%20Green%20Hero,%20saya%20butuh%20bantuan%20reservasi`} target="_blank" rel="noreferrer"><MessageCircle size={18} />Chat Reservasi</a><a className="button button-quiet" href="/reservation-check">Cek Reservasi</a></div></div><div className="resort-contact-topics"><span>Topik Populer:</span><div>{contactTopics.map((topic) => <button type="button" key={topic.label} onClick={() => selectTopic(topic)}>{topic.label}</button>)}</div></div></div>
        </section>

        <section className="resort-contact-container resort-contact-section resort-contact-service-grid">
          <div className="resort-contact-form-card" id="contact-form"><h2>Kirim Pesan</h2><p>Tinggalkan pertanyaan atau kebutuhan menginap Anda. Form ini masih berupa demo dan belum mengirim pesan.</p><form onSubmit={submitMessage} onChange={() => setFormStatus("")}><label htmlFor="contact-name">Nama Lengkap <span>*</span></label><input id="contact-name" name="fullName" autoComplete="name" placeholder="Contoh: Raden Surya" required maxLength={120} /><div className="resort-contact-form-row"><div><label htmlFor="contact-whatsapp">Nomor WhatsApp <span>*</span></label><input id="contact-whatsapp" name="whatsapp" type="tel" autoComplete="tel" placeholder="+62 812-xxxx-xxxx" required maxLength={30} /></div><div><label htmlFor="contact-email">Email <span>*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="email@anda.com" required maxLength={254} /></div></div><label htmlFor="contact-subject">Subjek Pesan</label><select id="contact-subject" name="subject" ref={subjectRef} value={subject} onChange={(event) => setSubject(event.target.value)}>{contactSubjects.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select><label htmlFor="contact-message">Pesan Anda <span>*</span></label><textarea id="contact-message" name="message" rows={4} placeholder="Tuliskan pertanyaan, rencana tanggal menginap, atau kebutuhan khusus Anda di sini..." value={message} onChange={(event) => setMessage(event.target.value)} required maxLength={3000} /><button className="button button-primary" type="submit"><Send size={18} />Kirim Pesan</button>{formStatus && <p className="resort-contact-status" role="status">{formStatus}</p>}</form></div>
          <div className="resort-contact-service"><span className="resort-contact-eyebrow">OPERASIONAL RESORT</span><h2>Informasi Layanan &amp; Operasional</h2><p>Green Hero Darajat berkomitmen memberikan pelayanan prima bagi kenyamanan liburan Anda dan keluarga di kawasan Darajat Pass.</p><div className="resort-contact-service-list">{serviceInformation.map(({ title, detail, icon: Icon }, index) => <article key={title}><span className={`resort-contact-service-icon service-icon-${index}`}><Icon size={22} /></span><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div><blockquote>“Kenyamanan udara pegunungan Garut berpadu dengan kehangatan air panas alami.”<cite>— GREEN HERO DARAJAT HOSPITALITY</cite></blockquote></div>
        </section>

        <section className="resort-contact-container resort-contact-section" id="location"><div className="resort-contact-section-heading"><span className="resort-contact-eyebrow">PANDUAN RUTE &amp; LOKASI</span><h2>Temukan Kami di Darajat</h2><p>Terletak strategis di kawasan wisata pegunungan Darajat Pass, Garut, dengan akses jalan beraspal mulus dan udara sejuk pegunungan.</p></div><div className="resort-contact-location"><div className="resort-contact-location-details"><span className="resort-contact-altitude"><Mountain size={18} />1.600 – 1.800 mdpl</span><h3>Green Hero Darajat</h3><div className="resort-contact-location-row"><MapPin size={22} /><div><span>ALAMAT RESMI</span><p>{contactDetails.address}</p></div></div><div className="resort-contact-location-row"><Mountain size={22} /><div><span>KETERANGAN KAWASAN</span><p>Berada di kawasan dataran tinggi Darajat Pass dengan pemandangan pegunungan dan perkebunan teh yang menghampar asri. Berdekatan dengan kawah aktif dan sumber air panas vulkanik alami Garut.</p></div></div><div className="resort-contact-location-row"><Navigation size={22} /><div><span>WAKTU TEMPUH</span><p>± 45 menit dari Alun-Alun Garut / Tarogong<br />± 2,5 jam dari Kota Bandung via Tol Cileunyi</p></div></div><div className="resort-contact-map-link"><a className="button button-primary" href={contactDetails.mapsHref} target="_blank" rel="noreferrer"><Navigation size={18} />Buka di Google Maps<ExternalLink size={16} /></a></div></div><div className="resort-contact-location-preview"><div className="resort-contact-location-photo" style={{ transform: `scale(${locationZoom})` }}><Image src="/images/contact-location.jpg" alt="Lanskap dataran tinggi Darajat Pass, Garut" fill sizes="(max-width: 800px) 100vw, 60vw" /></div><div className="resort-contact-location-marker"><span><Hotel size={28} /></span><h3>Green Hero Darajat</h3><p>Kawasan Wisata Kawah Darajat Pass, Garut</p><strong><Thermometer size={17} />Suhu Sejuk 16°C – 22°C</strong></div><div className="resort-contact-map-controls"><button type="button" aria-label="Perbesar tampilan lokasi" disabled={locationZoom >= 1.8} onClick={() => setLocationZoom((zoom) => Math.min(1.8, zoom + 0.2))}><Plus size={20} /></button><button type="button" aria-label="Perkecil tampilan lokasi" disabled={locationZoom <= 1} onClick={() => setLocationZoom((zoom) => Math.max(1, zoom - 0.2))}><Minus size={20} /></button></div></div></div></section>

        <section className="resort-contact-container resort-contact-final-section"><div className="resort-contact-booking"><span className="resort-contact-eyebrow">RESERVASI MUDAH &amp; LANGSUNG</span><h2>Sudah Siap Menginap?</h2><p>Pilih tanggal perjalanan dan temukan kamar yang tersedia di Green Hero Darajat. Rasakan kehangatan sumber air panas di tengah sejuknya pegunungan.</p><div><a className="button button-white" href="/rooms#availability">Pesan Sekarang</a><a className="button button-outline-light" href="/rooms">Lihat Kamar</a></div></div></section>
      </main>
      <footer className="resort-contact-footer theme-footer"><div className="resort-contact-container"><div className="resort-contact-footer-grid"><div><Brand href="/" /><p>Resort peristirahatan bernuansa alam di dataran tinggi Garut. Dilengkapi fasilitas kolam pemandian air panas alami, pemandangan kebun teh pegunungan, dan keramahan khas Sunda.</p><strong className="resort-contact-footer-hours"><span />Front Office &amp; Reservasi 24 Jam Setiap Hari</strong></div><div><h2>Navigasi</h2><a href="/#about">Tentang Kami</a><a href="/rooms">Kamar &amp; Fasilitas</a><a href="/rooms">Kebijakan Reservasi</a><a href="#location">Panduan Rute Darajat</a><a href="/contact" aria-current="page">Kontak &amp; Bantuan</a></div><div><h2>Experiences &amp; Dining</h2>{["Kambing Guling", "BBQ & Grill", "Ayam Bakar Kampung", "Birthday Celebration", "Anniversary Setup"].map((label) => <a key={label} href="/#experiences">{label}</a>)}</div><div><h2>Kontak &amp; Lokasi</h2><p className="resort-contact-footer-detail"><MapPin size={18} />{contactDetails.address}</p><a className="resort-contact-footer-detail" href={contactDetails.phoneHref}><Phone size={18} />(0262) 543-890</a><a className="resort-contact-footer-detail" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp Concierge 24 Jam: {contactDetails.whatsapp}</a><a className="resort-contact-footer-detail" href={`mailto:${contactDetails.email}`}><Mail size={18} />{contactDetails.email}</a></div></div><div className="resort-contact-footer-bottom"><span>© 2026 Green Hero Darajat Hotel &amp; Resort. Seluruh Hak Cipta Dilindungi.</span><a href="/">Peta Situs</a></div></div></footer>
    </>
  );
}
