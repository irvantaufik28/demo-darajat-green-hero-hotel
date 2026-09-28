"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BadgeCheck, Check, CircleCheck, Clock3, Coffee, ContactRound, Download, Flame, Headphones, Hotel, Info, KeyRound, LoaderCircle, Mail, MapPin, MessageCircle, CalendarDays, Phone, Search, ShieldCheck, Star, Thermometer, Ticket, Wifi } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { contactDetails } from "@/data/contact";
import { demoReservation as reservation, demoReservationTotal } from "@/data/reservation";
import { formatRoomPrice } from "@/data/rooms";

const stayDetails = [
  { label: "Nama Tamu Utama", value: reservation.guestName },
  { label: "Jumlah Kamar", value: "1 Kamar VIP" },
  { label: "Kapasitas Tamu", value: reservation.guests },
  { label: "Tanggal Check-in", value: reservation.checkIn, note: "Mulai 14:00 WIB" },
  { label: "Tanggal Check-out", value: reservation.checkOut, note: "Maks 12:00 WIB" },
  { label: "Durasi Menginap", value: `${reservation.nights} Malam`, note: "Liburan Pegunungan Nyaman" },
];

export default function ReservationCheckPage() {
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading" | "found">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (lookupStatus === "found") resultRef.current?.focus({ preventScroll: true });
  }, [lookupStatus]);

  function checkReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lookupStatus === "loading") return;
    setLookupStatus("loading");
    timerRef.current = setTimeout(() => {
      setLookupStatus("found");
      timerRef.current = null;
    }, 1400);
  }

  function downloadVoucher() {
    const documentContent = `<!doctype html><html lang="id"><meta charset="utf-8"><title>Voucher Demo ${reservation.code}</title><style>body{font-family:Arial,sans-serif;color:#023223;max-width:760px;margin:50px auto;padding:24px;line-height:1.8}h1{font-family:Georgia,serif}aside{background:#f7f3ea;padding:16px}table{width:100%;border-collapse:collapse}td{padding:12px;border-bottom:1px solid #ddd}td:last-child{text-align:right}</style><h1>Green Hero Darajat</h1><h2>E-Voucher & Bukti Reservasi Demo</h2><aside>SIMULASI DEMO — bukan voucher menginap atau bukti transaksi yang sah.</aside><p>Kode: <strong>${reservation.code}</strong><br>Tamu: ${reservation.guestName}<br>Kamar: ${reservation.room.name}<br>Check-in: ${reservation.checkIn}, 14:00 WIB<br>Check-out: ${reservation.checkOut}, 12:00 WIB<br>${reservation.guests} • ${reservation.nights} malam</p><table><tr><td>${reservation.room.name} (${reservation.nights} malam)</td><td>${formatRoomPrice(reservation.room.price * reservation.nights)}</td></tr><tr><td>${reservation.grill.name}</td><td>${formatRoomPrice(reservation.grill.price)}</td></tr><tr><td>Romantic Firepit & Tea</td><td>Gratis</td></tr><tr><td>Pajak & layanan</td><td>Termasuk</td></tr><tr><td><strong>Total</strong></td><td><strong>${formatRoomPrice(demoReservationTotal)}</strong></td></tr></table><p>Status demo: Terkonfirmasi & Lunas<br>Metode: BCA Virtual Account<br>Waktu: ${reservation.paidAt} WIB</p></html>`;
    const url = URL.createObjectURL(new Blob([documentContent], { type: "text/html;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reservation.code}-demo-voucher.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <SiteHeader id="reservation-header" links={interiorLinks} activeHref="/reservation-check" homeHref="/" bookingHref="/rooms#availability" />
      <main className="reservation-check-page reservation-check-container">
        <section className="reservation-check-intro"><span className="reservation-check-label"><i />Reservasi Anda</span><h1>Cek Status Reservasi</h1><p>Masukkan kode reservasi dan informasi kontak yang digunakan saat pemesanan untuk melihat detail booking Anda.</p></section>
        <section className="reservation-check-card reservation-check-lookup" aria-label="Pencarian reservasi"><form onSubmit={checkReservation} noValidate><div className="reservation-check-inputs"><div><label htmlFor="reservation-code">Kode Reservasi</label><div className="reservation-check-input"><Ticket size={20} /><input id="reservation-code" name="bookingCode" placeholder="Contoh: GH-260927-001" autoComplete="off" maxLength={80} disabled={lookupStatus === "loading"} /></div></div><div><label htmlFor="reservation-contact">Nomor WhatsApp atau Email</label><div className="reservation-check-input"><ContactRound size={20} /><input id="reservation-contact" name="contactInfo" placeholder="Masukkan WhatsApp atau email saat booking" autoComplete="off" maxLength={254} disabled={lookupStatus === "loading"} /></div></div></div><div className="reservation-check-form-actions"><p><Info size={18} />Demo: input boleh kosong. Detail yang ditampilkan menggunakan data contoh.</p><button className="button button-primary" type="submit" disabled={lookupStatus === "loading"}>{lookupStatus === "loading" ? <LoaderCircle className="reservation-check-spinner" size={20} /> : <Search size={20} />}{lookupStatus === "loading" ? "Mengecek Reservasi..." : "Cek Reservasi"}</button></div></form></section>
        <div className="reservation-check-announcement" role="status" aria-live="polite">{lookupStatus === "loading" ? "Sedang mencari detail reservasi demo." : lookupStatus === "found" ? "Detail reservasi demo ditemukan." : ""}</div>
        {lookupStatus === "loading" && <section className="reservation-check-loading" aria-label="Memuat detail reservasi" aria-busy="true"><div className="reservation-check-loading-label"><LoaderCircle className="reservation-check-spinner" size={26} /><div><strong>Mencari reservasi Anda</strong><p>Mohon tunggu sebentar...</p></div></div><div className="reservation-check-skeleton wide" /><div className="reservation-check-skeleton" /><div className="reservation-check-loading-columns"><div className="reservation-check-skeleton tall" /><div className="reservation-check-skeleton tall" /></div></section>}
        {lookupStatus === "found" && <div className="reservation-check-result" ref={resultRef} tabIndex={-1} aria-label="Detail reservasi demo">
          <section className="reservation-check-card reservation-check-timeline-card"><div className="reservation-check-status-row"><div><span>Status Pemesanan:</span><strong className="reservation-check-paid"><CircleCheck size={15} />Sudah Dibayar</strong><strong className="reservation-check-confirmed"><BadgeCheck size={15} />Terkonfirmasi</strong></div><div><span>Kode Booking:</span><strong className="reservation-check-booking-code">{reservation.code}</strong></div></div><ol className="reservation-check-timeline"><li className="complete"><span><Check size={20} /></span><strong>Reservasi Dibuat</strong><small>{reservation.createdAt}</small></li><li className="complete"><span><Check size={20} /></span><strong>Pembayaran</strong><small>{reservation.paidAt}</small></li><li className="current"><span><Hotel size={20} /></span><strong>Reservasi Terkonfirmasi</strong><small>Kamar Terjamin</small></li><li><span><KeyRound size={20} /></span><strong>Check-in</strong><small>18 Okt 2026, 14:00</small></li></ol></section>
          <div className="reservation-check-details-grid"><div className="reservation-check-main-details"><section className="reservation-check-confirmation"><span><Mail size={22} /></span><div><h2>Reservasi Anda Terkonfirmasi</h2><p>Contoh reservasi untuk <strong>{reservation.guestName}</strong>. Ini adalah simulasi; tidak ada pemesanan, pembayaran, atau pesan konfirmasi yang dikirim.</p></div></section><section className="reservation-check-card"><div className="reservation-check-card-heading"><h2>Detail Penginapan</h2><span>Voucher Digital Demo</span></div><div className="reservation-check-room"><div className="reservation-check-room-image"><Image src={reservation.room.image} alt={reservation.room.imageAlt} fill sizes="(max-width: 600px) 90vw, 176px" /></div><div><div className="reservation-check-room-tags"><span>Gedung Utama Lt. 2</span><strong><Star size={13} />4.9</strong></div><h3>{reservation.room.name} · Panoramic Balcony</h3><p>{reservation.room.description}</p><div className="reservation-check-room-amenities"><span><Wifi size={15} />Free High-Speed WiFi</span><span><Coffee size={15} />Sarapan Gratis</span></div></div></div><div className="reservation-check-stay-grid">{stayDetails.map(({ label, value, note }) => <div key={label}><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>)}</div></section>
          <section className="reservation-check-card"><div className="reservation-check-card-heading"><div><h2>Green Hero Experiences</h2><p>Layanan tambahan terpilih untuk kenyamanan liburan Anda di Pasirwangi.</p></div><span>2 Paket</span></div><div className="reservation-check-experiences"><article><div className="reservation-check-extra-image"><Image src="/images/bbq-grill.webp" alt="Paket BBQ dan Highland Grill" fill sizes="64px" /></div><div><h3>Paket BBQ &amp; {reservation.grill.name}</h3><p>Untuk {reservation.grill.capacity} • {reservation.grill.inclusions.slice(0, 3).join(", ")}</p><small><Clock3 size={14} />Dijadwalkan: Minggu Malam, 19:00 WIB di Area Gazebo Balcony</small></div><div className="reservation-check-extra-price"><strong>{formatRoomPrice(reservation.grill.price)}</strong><span><Check size={12} />Termasuk dalam tagihan</span></div></article><article><span className="reservation-check-firepit"><Flame size={28} /></span><div><h3>Romantic Firepit &amp; Warm Herbal Tea</h3><p>Penghangat api unggun outdoor ditemani teh tubruk rempah khas pegunungan Garut untuk keluarga.</p><small><Coffee size={14} />Fasilitas gratis untuk tamu Suite</small></div><div className="reservation-check-extra-price"><strong className="reservation-check-free">Gratis</strong><small>Complimentary Hospitality</small></div></article></div></section></div>
          <aside className="reservation-check-sidebar"><section className="reservation-check-card reservation-check-payment"><h2>Ringkasan Pembayaran</h2><div className="reservation-check-costs"><div><span>{reservation.room.name} ({reservation.nights} Malam)</span><strong>{formatRoomPrice(reservation.room.price * reservation.nights)}</strong></div><div><span>Paket BBQ &amp; {reservation.grill.name}</span><strong>{formatRoomPrice(reservation.grill.price)}</strong></div><div><span>Romantic Firepit &amp; Tea</span><strong className="reservation-check-free">Rp 0 (Gratis)</strong></div><div><span>Pajak &amp; Biaya Pelayanan</span><strong className="reservation-check-free">Termasuk</strong></div></div><div className="reservation-check-total"><div><strong>Total Pembayaran</strong><small>Harga Bersih (Nett)</small></div><b>{formatRoomPrice(demoReservationTotal)}</b></div><div className="reservation-check-payment-info"><div><span>Metode Bayar:</span><strong>BCA Virtual Account</strong></div><div><span>Waktu Transaksi:</span><strong>{reservation.paidAt} WIB</strong></div><div><span>Nomor Rek/VA:</span><strong>{reservation.virtualAccount}</strong></div></div><button type="button" className="button button-primary" onClick={downloadVoucher}><Download size={20} />Unduh E-Voucher &amp; Bukti</button><a className="button button-quiet" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />Hubungi Resepsionis via WhatsApp</a><p className="reservation-check-security"><ShieldCheck size={14} />Voucher dan pembayaran hanya simulasi demo</p></section><section className="reservation-check-modification"><CalendarDays size={22} /><div><h3>Ingin Mengubah Tanggal?</h3><p>Reschedule dapat diajukan maksimal H-3 sebelum tanggal check-in. Hubungi admin melalui WhatsApp untuk bantuan cepat.</p></div></section></aside></div>
        </div>}
        <section className="reservation-check-help"><span><Headphones size={30} /></span><div><h2>Butuh Bantuan Reservasi?</h2><p>Tim Green Hero Darajat siap membantu jika Anda mengalami kendala pengecekan, perubahan jadwal, atau konfirmasi transfer pembayaran.</p></div><a className="button button-primary" href={contactDetails.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={20} />Hubungi Kami via WhatsApp</a></section>
      </main>
      <footer className="reservation-check-footer"><div className="reservation-check-container"><div className="reservation-check-footer-grid"><div><Brand href="/" /><p>Resort peristirahatan bernuansa alam pegunungan sejuk di kawasan wisata Darajat, dilengkapi pemandian air panas alami langsung dari kawah belerang vulkanik Garut.</p><p className="reservation-check-footer-contact"><MapPin size={18} />{contactDetails.address}</p><a className="reservation-check-footer-contact" href={contactDetails.phoneHref}><Phone size={18} />{contactDetails.phone}</a><a className="reservation-check-footer-contact" href={`mailto:${contactDetails.email}`}><Mail size={18} />{contactDetails.email}</a></div><div><h2>Navigasi Utama</h2><a href="/rooms">Kamar &amp; Suite</a><a href="/facilities">Kolam Air Panas</a><a href="/facilities">Fasilitas Resort</a><a href="/gallery">Galeri Foto</a><a href="/contact#location">Panduan Rute Darajat</a><a href="/contact">Kontak &amp; Bantuan</a></div><div><h2>Layanan Tamu</h2><a href="/reservation-check" aria-current="page">Cek Status Reservasi</a><a href="/rooms">Kebijakan Reservasi &amp; Refund</a><a href="/contact">Ketentuan Check-in / Out</a><a href="/contact">Paket Rombongan &amp; Gathering</a><a href="/contact">Kebijakan Privasi</a></div><div><h2>Waktu Operasional</h2><div className="reservation-check-footer-hours"><p><span>Layanan Meja Depan:</span><strong>24 Jam</strong></p><p><span>Pemandian Air Panas:</span><strong>24 Jam (Tamu Menginap)</strong></p><p><span>Restoran &amp; Grill:</span><strong>06:00 – 22:00 WIB</strong></p><small><Thermometer size={16} />Suhu rata-rata: 17°C – 22°C (Sejuk)</small></div></div></div><div className="reservation-check-footer-bottom"><span>© 2026 Green Hero Darajat Hotel &amp; Resort. Seluruh Hak Cipta Dilindungi.</span><a href="/contact">Syarat &amp; Ketentuan</a><a href="/contact">Kebijakan Privasi</a></div></div></footer>
    </>
  );
}
