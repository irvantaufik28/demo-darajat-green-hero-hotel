"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Cake,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coffee,
  Heart,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { Brand } from "@/components/Brand";
import { BOOKING_DRAFT_KEY, bookingExtraPrices, bookingExtraLabels, normalizeExtraCounts, type PaidExtraId, type BookingDraft, getExtraCost, getNights } from "@/features/booking/constants/booking-data";
import { foodCategories, type FoodCategory } from "@/features/booking/constants/food-packages-data";
import FoodPackageModal from "../components/FoodPackageModal";
import CelebrationPackageModal from "../components/CelebrationPackageModal";
import { celebrationCategories, type CelebrationCategory } from "@/features/booking/constants/celebration-packages-data";
import { formatRoomPrice, getRoom } from "@/features/rooms/constants/rooms-data";
import "../styles/booking.css";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";

type Props = {
  roomId: string;
  roomSelection: RoomSelection;
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: string;
};

type Extra = {
  id: string;
  name: string;
  description: string;
  price?: number;
  unit?: string;
  note?: string;
};

const roomExtras: Extra[] = [
  { id: "extra-bed", name: "Extra Bed", description: "Tambahan tempat tidur single berkualitas sesuai kapasitas dan kenyamanan istirahat.", price: bookingExtraPrices["extra-bed"], unit: "/ malam" },
  { id: "extra-person", name: "Extra Person", note: "Sesuai kapasitas", description: "Tambahan tamu dengan amenities dasar, sesuai kapasitas maksimal kamar.", unit: "/ orang" },
  { id: "breakfast", name: "Additional Breakfast", description: "Tambahan sarapan buffet khas Nusantara untuk tamu pendamping yang belum termasuk dalam paket reservasi.", unit: "/ orang" },
  { id: "baby-cot", name: "Baby Cot / Crib", note: "By Request", description: "Boks bayi dan matras untuk kenyamanan tidur buah hati Anda, sesuai ketersediaan." },
];

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const shortMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function stayDate(value: string, short = false) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${(short ? shortMonths : months)[month - 1]} ${year}`;
}

function validStay(checkIn: string, checkOut: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return false;
  return Date.parse(`${checkOut}T00:00:00Z`) > Date.parse(`${checkIn}T00:00:00Z`);
}

export default function BookingExtrasPage({ roomId, roomSelection, initialCheckIn, initialCheckOut, initialGuests }: Props) {
  const room = getRoom(roomId);
  const selectionQuery = serializeRoomSelection(roomSelection);
  const totalRooms = countSelectedRooms(roomSelection);
  const hasStay = validStay(initialCheckIn, initialCheckOut);
  const checkIn = hasStay ? initialCheckIn : "2026-10-18";
  const checkOut = hasStay ? initialCheckOut : "2026-10-20";
  const nights = getNights(checkIn, checkOut);
  const guests = initialGuests || "2 Dewasa, 1 Anak";
  const [counts, setCounts] = useState<Record<string, number>>({ "extra-bed": 1 });
  const [activeCelebrationCategory, setActiveCelebrationCategory] = useState<CelebrationCategory | null>(null);
  const [activeFoodCategory, setActiveFoodCategory] = useState<FoodCategory | null>(null);
  const [requests, setRequests] = useState<Record<string, boolean>>({});
  const [specialNote, setSpecialNote] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(BOOKING_DRAFT_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved) as BookingDraft;
      if (serializeRoomSelection(draft.roomSelection ?? [{ roomId: draft.roomId, quantity: 1 }]) === selectionQuery && draft.checkIn === checkIn && draft.checkOut === checkOut && draft.guests === guests) {
        setCounts(normalizeExtraCounts(draft.counts ?? {}));
        setRequests(Object.fromEntries(Object.entries(draft.requests ?? {}).filter(([id]) => !["cake", "birthday", "anniversary"].includes(id))));
        setSpecialNote(draft.specialNote ?? "");
      }
    } catch {
      // Ignore saved demo choices when browser storage is unavailable.
    }
  }, [selectionQuery, checkIn, checkOut, guests]);

  if (!room) return null;

  const roomTotal = getRoomSelectionTotal(roomSelection, nights);
  const paidExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const extrasTotal = paidExtras.reduce((total, id) => total + getExtraCost(id, counts[id], nights), 0);
  const roomHref = `/rooms?${new URLSearchParams({ rooms: selectionQuery, checkIn, checkOut, guests })}`;

  function changeCount(id: string, delta: number) {
    setCounts((previous) => ({ ...previous, [id]: Math.max(0, Math.min(1, (previous[id] ?? 0) + delta)) }));
  }

  function toggleRequest(id: string) {
    setRequests((previous) => ({ ...previous, [id]: !previous[id] }));
  }

  function goToGuest(skipExtras: boolean) {
    const selectedCounts: Record<string, number> = skipExtras ? {} : normalizeExtraCounts(counts);
    const draft: BookingDraft = {
      roomId, roomSelection, checkIn, checkOut, guests,
      counts: selectedCounts,
      requests: skipExtras ? {} : requests,
      specialNote: skipExtras ? "" : specialNote,
    };
    try { sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft)); } catch { /* The URL still carries priced extras. */ }
    const params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
    for (const id of Object.keys(bookingExtraPrices) as (keyof typeof bookingExtraPrices)[]) {
      if (selectedCounts[id] > 0) params.set(id, String(selectedCounts[id]));
    }
    window.location.assign(`/booking/guest-details?${params}`);
  }

  function extraCard(extra: Extra, icon?: ReactNode) {
    const count = counts[extra.id] ?? 0;
    const requested = requests[extra.id] ?? false;
    const active = extra.price ? count > 0 : requested;
    const isCompact = true;
    const price = <div className="booking-extra-price">{extra.price ? formatRoomPrice(extra.price) : extra.id === "baby-cot" ? "Sesuai Ketersediaan" : "Rp —"}<span>{extra.unit}</span></div>;
    const note = extra.id === "extra-person" && room?.id === "vip" ? "Maks. 1 tamu tambahan" : extra.note;
    const description = extra.id === "extra-bed" && room?.id === "vip"
      ? "Kamar VIP mendukung 1 extra bed. Tambahan tempat tidur single berkualitas sesuai kapasitas dan kenyamanan istirahat."
      : extra.description;
    return (
      <article className={`booking-extra-card${active ? " is-selected" : ""}`} key={extra.id}>
        <div className="booking-extra-copy">
          <div className="booking-extra-name">{icon}<h3>{extra.name}</h3>{note && <span className="booking-extra-note">{note}</span>}{active && <span className="booking-selected"><CheckCircle2 size={15} /> {extra.price ? "Ditambahkan" : "Diajukan"}</span>}</div>
          <p>{description}</p>
          {!isCompact && price}
        </div>
        <div className="booking-extra-actions">
          {isCompact && price}
          {extra.price ? count > 0 ? (
            <div className="booking-quantity">
              {extra.id === "extra-bed" ? <span className="booking-single-selected">1 Unit Ditambahkan</span> : null}
              <button type="button" className="booking-remove" onClick={() => setCounts((previous) => ({ ...previous, [extra.id]: 0 }))} aria-label={`Hapus ${extra.name}`}><Trash2 size={17} /></button>
            </div>
          ) : <button type="button" className="booking-add-button" onClick={() => changeCount(extra.id, 1)}><Plus size={17} /> Tambahkan</button> : <button type="button" className="booking-add-button" aria-pressed={requested} onClick={() => toggleRequest(extra.id)}>{requested ? <><Check size={17} /> Diajukan</> : extra.id === "baby-cot" ? "Ajukan" : <><Plus size={17} /> Tambahkan</>}</button>}
        </div>
      </article>
    );
  }

  return (
    <div className="booking-page booking-extras-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#booking-summary" contactHref="/contact" />
      <main className="container booking-main">
        <nav className="booking-progress" aria-label="Tahap pemesanan">
          {["Pilih Kamar", "Pilihan Tambahan", "Data Tamu", "Pembayaran"].map((label, index) => <div className={`booking-step${index === 1 ? " is-current" : ""}${index === 0 ? " is-complete" : ""}`} key={label}><span className="booking-step-circle">{index === 0 ? <Check size={18} /> : index + 1}</span><span>{label}</span></div>)}
        </nav>

        <div className="booking-intro"><span className="booking-eyebrow">PILIHAN TAMBAHAN</span><h1>Lengkapi Pengalaman Menginap Anda</h1><p>Tambahkan pilihan sesuai kebutuhan selama menginap di kawasan sejuk Darajat. Semua tambahan bersifat opsional dan dapat dilewati ke tahap berikutnya.</p></div>

        <div className="booking-layout">
          <div className="booking-options">
            <div className="booking-stay-banner"><div><strong><BedDouble size={20} /> Pilihan Kamar <span>{totalRooms} Kamar</span></strong><p><CalendarDays size={16} /> {stayDate(checkIn)} → {stayDate(checkOut)} ({nights} Malam)</p><p><UsersRound size={16} /> {guests}</p><BookingRoomSelection selection={roomSelection} nights={nights} /><small>Subtotal Kamar: <b>{formatRoomPrice(roomTotal)}</b></small></div><a href={roomHref}>Ubah Kamar <ArrowRight size={16} /></a></div>

            <section className="booking-section"><div className="booking-food-hero"><Image src="/images/outdoor-dining.webp" alt="Santap bersama di teras resor Green Hero Darajat" fill sizes="(max-width: 840px) 100vw, 60vw" /><div><span>FOOD &amp; GRILL</span><h2>Nikmati Waktu Bersama di Udara Sejuk Darajat</h2><p>Santap hidangan hangat langsung di teras resor sembari menikmati panorama kabut dataran tinggi Garut bersama keluarga tercinta.</p></div></div><div className="booking-card-list">{foodCategories.map((category) => {
              const selectedPackages = category.packages.filter((item) => counts[item.id] > 0);
              const startingPrice = Math.min(...category.packages.map((item) => item.price));
              return <button type="button" key={category.id} className={`booking-extra-card booking-food-choice${selectedPackages.length ? " is-selected" : ""}`} onClick={() => setActiveFoodCategory(category)} aria-haspopup="dialog">
                <span className="booking-extra-copy"><span className="booking-extra-name"><span className="booking-food-name">{category.name}</span>{selectedPackages.length > 0 && <span className="booking-selected"><CheckCircle2 size={15} /> Ditambahkan</span>}</span><span className="booking-food-description">{category.description}</span><span className="booking-extra-price"><small>Mulai dari</small> {formatRoomPrice(startingPrice)}<span>/ paket</span></span>{selectedPackages.length > 0 && <span className="booking-food-selection">{selectedPackages.map((item) => `${item.name} × ${counts[item.id]}`).join(" · ")}</span>}</span>
                <span className="booking-add-button">{selectedPackages.length ? "Ubah Paket" : "Pilih Paket"}<ChevronRight size={17} /></span>
              </button>;
            })}</div><p className="booking-section-note"><UtensilsCrossed size={17} /> Pilihan santapan disiapkan segar langsung oleh tim dapur resor.</p></section>

            <section className="booking-section"><div className="booking-section-title"><span>ROOM ADD-ONS</span><h2>Tambahan untuk Kenyamanan Kamar</h2></div><div className="booking-room-grid">{roomExtras.map((extra) => extraCard(extra, extra.id === "breakfast" ? <Coffee size={21} /> : <BedDouble size={21} />))}</div></section>

            <section className="booking-section"><div className="booking-section-title is-clay"><span>SPECIAL MOMENTS</span><h2>Buat Momen Menginap Lebih Berkesan</h2></div><div className="booking-moment-grid">{celebrationCategories.map((category) => {
              const selectedPackage = category.packages.find((item) => counts[item.id] > 0);
              const price = selectedPackage?.price ?? Math.min(...category.packages.map((item) => item.price));
              return <button type="button" key={category.id} className={`booking-extra-card booking-moment-choice${selectedPackage ? " is-selected" : ""}`} onClick={() => setActiveCelebrationCategory(category)} aria-haspopup="dialog">
                <span className="booking-moment-top">{category.id === "birthday" ? <Cake size={22} /> : <Heart size={22} />}{selectedPackage && <span className="booking-selected"><CheckCircle2 size={15} /> Dipilih</span>}</span>
                <span className="booking-extra-copy"><span className="booking-food-name">{category.name}</span><span className="booking-food-description">{category.description}</span>{selectedPackage && <span className="booking-food-selection">{selectedPackage.name}</span>}</span>
                <span className="booking-extra-actions"><span className="booking-extra-price"><small>{selectedPackage ? "Harga paket" : "Mulai dari"}</small> {formatRoomPrice(price)}<span>/ paket</span></span><span className="booking-add-button">{selectedPackage ? "Ubah Paket" : "Pilih Paket"}<ChevronRight size={17} /></span></span>
              </button>;
            })}</div></section>

            <section className="booking-request-section"><div className="booking-section-title"><span>PERMINTAAN TAMBAHAN</span><h2>Permintaan Selama Menginap</h2><p>Catatan: Permintaan khusus tidak dijamin seketika dan bergantung pada ketersediaan kamar saat check-in.</p></div><div className="booking-request-grid">{[{ id: "early", label: "Early Check-in", icon: <Clock3 size={23} /> }, { id: "late", label: "Late Check-out", icon: <Clock3 size={23} /> }].map((item) => <div className="booking-request-card" key={item.id}><div>{item.icon}<span><strong>{item.label}</strong><small>{requests[item.id] ? "Permintaan diajukan" : "Status: By Request"}</small></span></div><button type="button" aria-pressed={!!requests[item.id]} onClick={() => toggleRequest(item.id)}>{requests[item.id] ? "Batalkan" : "Ajukan Permintaan"}</button></div>)}</div><label className="booking-note-label" htmlFor="booking-special-note">Catatan Khusus (Opsional)</label><textarea id="booking-special-note" rows={3} value={specialNote} onChange={(event) => setSpecialNote(event.target.value)} placeholder="Contoh: kamar berdekatan dengan keluarga, kebutuhan khusus ramah lansia, atau permintaan waktu penyajian BBQ..." /></section>
          </div>

          <aside className="booking-summary" id="booking-summary"><div className="booking-summary-header"><h2>Ringkasan Booking</h2><span>Langkah 2 dari 4</span></div><div className="booking-summary-stay"><strong>{totalRooms} Kamar ({nights} Malam)</strong><span><CalendarDays size={16} /> {stayDate(checkIn, true)} – {stayDate(checkOut, true)}</span><span><UsersRound size={16} /> {guests}</span></div><div className="booking-summary-cost"><h3>Rincian Biaya:</h3><BookingRoomSelection selection={roomSelection} nights={nights} /><div className="booking-summary-row"><span>Subtotal {totalRooms} Kamar ({nights} Malam)</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="booking-summary-addons"><h4>Pilihan Tambahan:</h4>{paidExtras.length ? paidExtras.map((id) => <div className="booking-summary-row" key={id}><span>{bookingExtraLabels[id]} {id === "extra-bed" ? `(${nights} Malam)` : `(${counts[id]}x)`}</span><strong>{formatRoomPrice(getExtraCost(id, counts[id], nights))}</strong></div>) : <p>Belum ada pilihan berbayar.</p>}{Object.values(requests).some(Boolean) && <p>Permintaan lain dikonfirmasi staf hotel.</p>}</div><div className="booking-summary-total"><span><strong>Total Estimasi Sementara</strong><small>Termasuk pajak &amp; layanan</small></span><strong>{formatRoomPrice(roomTotal + extrasTotal)}</strong></div></div><div className="booking-summary-actions"><button type="button" className="button button-primary" onClick={() => goToGuest(false)}>Lanjut ke Data Tamu <ArrowRight size={18} /></button><button type="button" onClick={() => goToGuest(true)}>Lewati Pilihan Tambahan</button></div><div className="booking-trust"><ShieldCheck size={19} /><span>Semua tambahan opsional. Pembayaran dan rincian final dikonfirmasi pada tahap berikutnya.</span></div></aside>
        </div>
      </main>
      {activeCelebrationCategory && <CelebrationPackageModal key={activeCelebrationCategory.id} category={activeCelebrationCategory} counts={counts} onClose={() => setActiveCelebrationCategory(null)} onSave={(selection) => { setCounts((previous) => normalizeExtraCounts({ ...previous, ...selection })); setActiveCelebrationCategory(null); }} />}
      {activeFoodCategory && <FoodPackageModal key={activeFoodCategory.id} category={activeFoodCategory} counts={counts} onClose={() => setActiveFoodCategory(null)} onSave={(selection) => { setCounts((previous) => ({ ...previous, ...selection })); setActiveFoodCategory(null); }} />}
      <footer className="booking-footer theme-footer"><div className="container booking-footer-inner"><div className="booking-footer-grid"><div className="booking-footer-about"><Brand href="/" /><p>Resor dataran tinggi di lereng vulkanik Darajat, Garut. Menggabungkan kenyamanan alami, kolam air panas bumi murni, dan kehangatan keramahan Sunda untuk momen istirahat keluarga Anda.</p><span><MapPin size={17} /> Jl. Darajat KM 14, Karyamekar, Pasirwangi, Garut, Jawa Barat</span></div><div><strong>Navigasi Resor</strong><a href="/">Tentang Kami</a><a href="/rooms">Kamar &amp; Fasilitas</a><a href="/#location">Panduan Rute Darajat</a><a href="/rooms">Kebijakan Reservasi</a></div><div><strong>Bantuan &amp; Legal</strong><a href="/contact">Kontak &amp; Bantuan</a><a href="/contact">Kebijakan Privasi</a><a href="/contact">F.A.Q.</a></div></div><div className="booking-footer-bottom"><span>© 2026 Green Hero Darajat Hotel &amp; Resort.</span><a href="/rooms">Kembali ke Kamar &amp; Suite <ChevronRight size={15} /></a></div></div></footer>
    </div>
  );
}
