"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Flame,
  Info,
  LockKeyhole,
  Mail,
  MessageCircle,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { GUEST_DRAFT_KEY, bookingExtraLabels, bookingExtraPrices, getExtraCost, getNights, type GuestDraft, type PaidExtraId } from "@/data/booking";
import { formatRoomPrice, getRoom } from "@/data/rooms";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/data/roomSelection";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";
import { demoGuestContact, guestNationalities, getGuestNationality, normalizeLocalWhatsapp, type GuestNationalityCode } from "@/data/guestContact";

type Props = {
  roomId: string;
  roomSelection: RoomSelection;
  checkIn: string;
  checkOut: string;
  guests: string;
  counts: Record<PaidExtraId, number>;
};

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatStayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

export default function BookingGuestPage({ roomId, roomSelection, checkIn, checkOut, guests, counts }: Props) {
  const room = getRoom(roomId);
  const selectionQuery = serializeRoomSelection(roomSelection);
  const totalRooms = countSelectedRooms(roomSelection);
  const [fullName, setFullName] = useState(demoGuestContact.fullName);
  const [nationality, setNationality] = useState<GuestNationalityCode>(demoGuestContact.nationality);
  const [whatsapp, setWhatsapp] = useState(demoGuestContact.whatsapp);
  const [email, setEmail] = useState(demoGuestContact.email);
  const selectedNationality = getGuestNationality(nationality);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(GUEST_DRAFT_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved) as Partial<GuestDraft> | null;
      if (!draft || typeof draft !== "object") return;
      const savedNationality = getGuestNationality(draft.nationality);
      setNationality(savedNationality.code);
      setFullName(typeof draft.fullName === "string" && draft.fullName.trim() ? draft.fullName : demoGuestContact.fullName);
      setWhatsapp(typeof draft.whatsapp === "string" && draft.whatsapp.trim() ? normalizeLocalWhatsapp(draft.whatsapp, savedNationality.dialCode) : demoGuestContact.whatsapp);
      setEmail(typeof draft.email === "string" && draft.email.trim() ? draft.email : demoGuestContact.email);
    } catch {
      // The form remains usable when browser storage is unavailable.
    }
  }, []);
  if (!room) return null;

  const nights = getNights(checkIn, checkOut);
  const selectedExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const roomTotal = getRoomSelectionTotal(roomSelection, nights);
  const extrasTotal = selectedExtras.reduce((total, id) => total + getExtraCost(id, counts[id], nights), 0);
  const step2Params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
  const backHref = `/booking/extras?${step2Params}`;
  const roomHref = `/rooms?${new URLSearchParams({ rooms: selectionQuery, checkIn, checkOut, guests })}`;

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify({ fullName, nationality, whatsapp: `${selectedNationality.dialCode}${whatsapp}`, email } satisfies GuestDraft)); } catch { /* The demo flow can continue. */ }
    const params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
    for (const id of selectedExtras) params.set(id, String(counts[id]));
    window.location.assign(`/booking/payment?${params}`);
  }

  return (
    <div className="booking-page guest-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#guest-summary" contactHref="/contact" />
      <main className="container booking-main guest-main">
        <nav className="booking-progress" aria-label="Tahap pemesanan">
          {["Pilih Kamar", "Pilihan Tambahan", "Data Tamu", "Pembayaran"].map((label, index) => (
            <div className={`booking-step${index < 2 ? " is-complete" : ""}${index === 2 ? " is-current" : ""}`} key={label}>
              <span className="booking-step-circle">{index < 2 ? <Check size={18} /> : index + 1}</span><span>{label}</span>
            </div>
          ))}
        </nav>

        <div className="guest-intro"><span className="booking-eyebrow">DATA TAMU</span><h1>Lengkapi Data Pemesan</h1><p>Data pemesan dummy sudah terisi untuk demo. Anda dapat mengubah data sebelum melanjutkan; data belum dikirim ke server.</p></div>

        <div className="guest-layout">
          <div className="guest-left">
            <section className="guest-form-card" aria-labelledby="guest-form-title">
              <div className="guest-form-heading"><div><h2 id="guest-form-title">Kontak Utama Pemesanan</h2><p>Data ini digunakan untuk menghubungi pemesan dan menyiapkan informasi menginap.</p></div><BadgeCheck size={26} /></div>
              <form id="guest-form" onSubmit={handleContinue}>
                <div className="guest-field"><label htmlFor="guest-full-name"><span>Nama Lengkap <b>*</b></span><small>Sesuai KTP / Paspor</small></label><div className="guest-input-wrap"><input id="guest-full-name" name="fullName" type="text" autoComplete="name" placeholder="Nama sesuai identitas (KTP / Paspor)" value={fullName} onChange={(event) => setFullName(event.target.value)} required /><UserRound size={21} /></div><p><Info size={15} /> Nama yang terdaftar saat proses check-in di resepsionis.</p></div>
                <div className="guest-field"><label htmlFor="guest-nationality"><span>Nationality / Kewarganegaraan <b>*</b></span><small>Kode Negara WhatsApp</small></label><div className="guest-input-wrap"><select id="guest-nationality" name="nationality" autoComplete="country" value={nationality} onChange={(event) => setNationality(getGuestNationality(event.target.value).code)} required>{guestNationalities.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name}</option>)}</select></div></div>
                <div className="guest-field"><label htmlFor="guest-whatsapp"><span>Nomor WhatsApp <b>*</b></span><small>Aktif WhatsApp</small></label><div className="guest-phone-wrap"><span className="guest-phone-code"><span aria-hidden="true">{selectedNationality.flag}</span><strong>{selectedNationality.dialCode}</strong></span><input id="guest-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national" placeholder={selectedNationality.phoneExample} pattern="[1-9][0-9]{5,13}" maxLength={20} title="Masukkan 6–14 angka tanpa kode negara atau angka 0 di depan" value={whatsapp} onChange={(event) => setWhatsapp(normalizeLocalWhatsapp(event.target.value, selectedNationality.dialCode))} required /><MessageCircle size={21} /></div><p><Info size={15} /> Kode negara mengikuti nationality. Masukkan nomor tanpa kode negara atau angka 0 di depan.</p></div>
                <div className="guest-field"><label htmlFor="guest-email"><span>Alamat Email <b>*</b></span><small>Untuk Dokumen Reservasi</small></label><div className="guest-input-wrap"><input id="guest-email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required /><Mail size={21} /></div><p><Info size={15} /> Rincian reservasi dapat dikirim ke alamat email ini ketika layanan tersedia.</p></div>
                <div className="guest-security"><LockKeyhole size={21} /><span>Data demo disimpan sementara di browser Anda dan tidak dikirim ke server.</span></div>
              </form>
            </section>

            <a className="guest-back-link" href={backHref}><ArrowLeft size={19} /> Kembali ke Pilihan Tambahan</a>

            <div className="guest-resort-note"><div className="guest-resort-photo"><Image src="/images/hero-resort.webp" alt="Suasana resor pegunungan Green Hero Darajat" fill sizes="(max-width: 640px) 100vw, 180px" /></div><div><span>GREEN HERO DARAJAT</span><p>Istirahat di udara sejuk pegunungan Garut dengan suasana hangat untuk keluarga.</p></div></div>
          </div>

          <aside className="guest-summary" id="guest-summary" aria-label="Ringkasan booking"><div className="guest-summary-header"><h2>Ringkasan Booking</h2><span>Langkah 3 dari 4</span></div><div className="guest-summary-content"><div className="guest-summary-stay"><div className="guest-summary-room"><div><h3>{totalRooms} Kamar ({nights} Malam)</h3><p>Green Hero Darajat</p></div><a href={roomHref}>Ubah</a></div><div className="guest-schedule"><div><span>Check-in</span><strong>{formatStayDate(checkIn)}</strong><small>Mulai 14:00</small></div><div><span>Check-out</span><strong>{formatStayDate(checkOut)}</strong><small>Sebelum 12:00</small></div></div><p><UsersRound size={16} /> {guests} • {totalRooms} Kamar</p></div>
            <BookingRoomSelection selection={roomSelection} nights={nights} /><div className="guest-summary-prices"><div className="guest-price-row"><span>Subtotal {totalRooms} Kamar ({nights} Malam)</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="guest-selected-extras"><h4>Pilihan Tambahan Terpilih:</h4>{selectedExtras.length ? selectedExtras.map((id) => <div className="guest-price-row" key={id}><span>{bookingExtraLabels[id]} {id === "extra-bed" ? `(${nights} Malam)` : counts[id] > 1 ? `(${counts[id]}x)` : ""}</span><strong>{formatRoomPrice(getExtraCost(id, counts[id], nights))}</strong></div>) : <p>Tidak ada tambahan berbayar.</p>}</div><div className="guest-hot-spring"><Flame size={18} /> Akses Kolam Air Panas Alami Termasuk</div></div>
            <div className="guest-total"><div><span>Total Estimasi</span><strong>{formatRoomPrice(roomTotal + extrasTotal)}</strong></div><small>Termasuk pajak &amp; biaya layanan</small></div><button type="submit" form="guest-form" className="button button-primary guest-continue">Lanjut ke Pembayaran <ArrowRight size={19} /></button><div className="guest-policy-note"><BadgeCheck size={20} /><span><strong>Informasi Reservasi</strong>Harga dan ketentuan final akan diverifikasi oleh hotel sebelum pembayaran tersedia.</span></div></div></aside>
        </div>
      </main>
      <footer className="guest-footer theme-footer"><div className="container guest-footer-grid"><div><Brand href="/" /><p>Hotel &amp; resor ramah keluarga di kawasan dataran tinggi Darajat, Garut.</p></div><div><strong>Eksplorasi</strong><a href="/">Home</a><a href="/rooms">Kamar &amp; Suite</a><a href="/facilities">Fasilitas</a></div><div><strong>Kontak &amp; Bantuan</strong><span>Jl. Raya Darajat KM 14, Pasirwangi, Garut</span><span>halo@greenherodarajat.com</span></div></div><div className="container guest-footer-bottom">© 2026 Green Hero Darajat Hotel &amp; Resort. · Demo frontend</div></footer>
    </div>
  );
}
