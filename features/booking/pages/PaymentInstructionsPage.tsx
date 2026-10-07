"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, CalendarDays, Check, ChevronDown, Clock3, Copy, Info, LockKeyhole, Mail, MessageCircle, RefreshCw, UsersRound, UserRound, Wallet, Zap } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { GUEST_DRAFT_KEY, bookingExtraLabels, bookingExtraPrices, getExtraCost, getNights, type GuestDraft, type PaidExtraId } from "@/features/booking/constants/booking-data";
import { formatRoomPrice, getRoom } from "@/features/rooms/constants/rooms-data";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import "../styles/booking.css";
import "../styles/instructions.css";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";

type Props = {
  roomId: string;
  roomSelection: RoomSelection;
  checkIn: string;
  checkOut: string;
  guests: string;
  counts: Record<PaidExtraId, number>;
};

const virtualAccount = "8277000000000000";
const displayedAccount = "8277 0000 0000 0000";
const reservationNumber = "GHD-DEMO-00124";
const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatStay(checkIn: string, checkOut: string) {
  const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
  const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);
  if (startYear === endYear && startMonth === endMonth) return `${startDay} – ${endDay} ${months[startMonth - 1]} ${startYear}`;
  return `${startDay} ${months[startMonth - 1]} ${startYear} – ${endDay} ${months[endMonth - 1]} ${endYear}`;
}

export default function PaymentInstructionsPage({ roomId, roomSelection, checkIn, checkOut, guests, counts }: Props) {
  const room = getRoom(roomId);
  const selectionQuery = serializeRoomSelection(roomSelection);
  const totalRooms = countSelectedRooms(roomSelection);
  const [guest, setGuest] = useState<GuestDraft | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [deadlineLabel, setDeadlineLabel] = useState("Menyiapkan waktu demo…");
  const [message, setMessage] = useState("");
  const nights = getNights(checkIn, checkOut);
  const selectedExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const roomTotal = getRoomSelectionTotal(roomSelection, nights);
  const extrasTotal = selectedExtras.reduce((sum, id) => sum + getExtraCost(id, counts[id], nights), 0);
  const total = roomTotal + extrasTotal;
  const params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests, method: "bca" });
  for (const id of selectedExtras) params.set(id, String(counts[id]));
  const paymentHref = `/booking/payment?${params}`;
  const timerKey = `green-hero-demo-payment-deadline:${params}`;

  useEffect(() => {
    let deadline = Date.now() + 30 * 60 * 1000;
    try {
      const savedGuest = sessionStorage.getItem(GUEST_DRAFT_KEY);
      if (savedGuest) {
        const draft = JSON.parse(savedGuest) as Partial<GuestDraft>;
        if (typeof draft.fullName === "string" && typeof draft.whatsapp === "string" && typeof draft.email === "string") setGuest(draft as GuestDraft);
      }
    } catch { /* Missing browser storage does not prevent the demo. */ }
    try {
      const savedDeadline = Number(sessionStorage.getItem(timerKey));
      if (Number.isFinite(savedDeadline) && savedDeadline > 0) deadline = savedDeadline;
      else sessionStorage.setItem(timerKey, String(deadline));
    } catch { /* Use a local countdown when browser storage is unavailable. */ }
    setDeadlineLabel(`${new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(deadline)} • ${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Jakarta" }).format(deadline)} WIB`);
    function updateCountdown() { setSecondsRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))); }
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [timerKey]);

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} berhasil disalin.`);
    } catch { setMessage(`Tidak dapat menyalin otomatis. Silakan pilih dan salin ${label.toLowerCase()} secara manual.`); }
  }

  if (!room) return null;
  const accountName = `Green Hero Darajat — ${guest?.fullName || "Nama Pemesan"}`;
  const countdown = secondsRemaining === null ? "--:--" : `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(secondsRemaining % 60).padStart(2, "0")}`;
  const expired = secondsRemaining === 0;
  const guides = [
    { title: "BCA Mobile (m-BCA)", steps: [<>Buka aplikasi <strong>BCA Mobile</strong>, pilih <strong>m-BCA</strong> dan masukkan Kode Akses Anda.</>, <>Pilih menu <strong>m-Transfer</strong> &gt; <strong>BCA Virtual Account</strong>.</>, <>Masukkan 16 digit Nomor Virtual Account: <code>{displayedAccount}</code> lalu pilih <strong>Send</strong>.</>, <>Periksa nama <strong>{accountName}</strong> dan total tagihan <strong>{formatRoomPrice(total)}</strong> pada layar konfirmasi.</>, <>Masukkan PIN m-BCA untuk menyelesaikan pembayaran saat layanan resmi tersedia.</>] },
    { title: "KlikBCA (Internet Banking)", steps: [<>Masuk ke <strong>KlikBCA Individual</strong>.</>, <>Pilih <strong>Transfer Dana</strong> &gt; <strong>Transfer ke BCA Virtual Account</strong>.</>, <>Masukkan nomor Virtual Account <code>{displayedAccount}</code>, lalu pilih <strong>Lanjutkan</strong>.</>, <>Periksa nama penerima dan nominal <strong>{formatRoomPrice(total)}</strong>.</>, <>Ikuti instruksi KeyBCA pada layar untuk menyelesaikan transaksi.</>] },
    { title: "ATM BCA", steps: [<>Masukkan kartu ATM BCA dan PIN Anda.</>, <>Pilih <strong>Transaksi Lainnya</strong> &gt; <strong>Transfer</strong> &gt; <strong>ke Rekening BCA Virtual Account</strong>.</>, <>Masukkan Nomor Virtual Account <code>{displayedAccount}</code>.</>, <>Periksa nama dan nominal <strong>{formatRoomPrice(total)}</strong>, lalu ikuti instruksi pada mesin ATM.</>] },
    { title: "Transfer dari Bank Lain (ATM Bersama / Prima / ALTO)", steps: [<>Ketersediaan transfer dari bank lain mengikuti ketentuan Virtual Account resmi yang diterbitkan.</>, <>Pada demo ini, transfer antarbank belum tersedia. Gunakan instruksi resmi dari hotel saat layanan pembayaran aktif.</>] },
  ];

  return (
    <div className="booking-page payment-instructions-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="/rooms" contactHref="/contact" />
      <main className="container booking-main instructions-main">
        <nav className="booking-progress" aria-label="Tahap pemesanan">{["Pilih Kamar", "Pilihan Tambahan", "Data Tamu", "Pembayaran"].map((label, index) => <div key={label} className={`booking-step${index < 3 ? " is-complete" : " is-current"}`} aria-current={index === 3 ? "step" : undefined}><span className="booking-step-circle">{index < 3 ? <Check size={18} /> : 4}</span><span>{label}</span></div>)}</nav>
        <header className="instructions-intro"><div><span className="instructions-eyebrow"><i /> PEMBAYARAN</span><h1>Selesaikan Pembayaran Anda</h1><p>Gunakan informasi pembayaran berikut untuk menyelesaikan reservasi sebelum batas waktu pembayaran berakhir.</p></div><div className="instructions-identification"><span>No. Reservasi: <strong>{reservationNumber}</strong></span><span className="instructions-pending"><i /> {expired ? "Waktu Demo Berakhir" : "Menunggu Pembayaran"}</span></div></header>
        <div className="instructions-demo"><Info size={18} /><span><strong>Simulasi pembayaran.</strong> Nomor VA adalah contoh. Tidak ada reservasi atau transaksi yang dibuat; jangan transfer ke nomor ini.</span></div>
        <div className="instructions-layout">
          <div className="instructions-left">
            <section className="instructions-card instructions-account" aria-labelledby="instructions-account-title">
              <div className="instructions-account-heading"><div><span className="instructions-bank">BCA</span><div><h2 id="instructions-account-title">BCA Virtual Account</h2><p>Verifikasi otomatis 24 jam real-time</p></div></div><span className="instructions-automatic"><Zap size={15} /> Konfirmasi Otomatis</span></div>
              <div className="instructions-va"><span>Nomor Virtual Account <small>CONTOH DEMO</small></span><div><strong>{displayedAccount}</strong><button type="button" onClick={() => copyValue(virtualAccount, "Nomor VA contoh")}><Copy size={17} /> Salin Nomor VA</button></div></div>
              <div className="instructions-account-grid"><div><span>Nama Akun Reservasi</span><strong>{accountName}</strong></div><div><span>Total Pembayaran</span><div className="instructions-amount"><strong>{formatRoomPrice(total)}</strong><button type="button" onClick={() => copyValue(String(total), "Nominal pembayaran")} aria-label="Salin nominal pembayaran"><Copy size={19} /></button></div></div></div>
              <div className="instructions-callout"><Info size={20} /><p><strong>Catatan Penting:</strong> Bayar sesuai jumlah yang tertera hingga digit terakhir agar pembayaran dapat diverifikasi secara otomatis tanpa konfirmasi manual saat sistem pembayaran aktif.</p></div>
            </section>
            <section className="instructions-card instructions-guides" aria-labelledby="instructions-guide-title"><div className="instructions-guide-heading"><Wallet size={25} /><div><h2 id="instructions-guide-title">Panduan Cara Pembayaran</h2><p>Pilih metode transfer yang Anda gunakan di bawah ini</p></div></div><div className="instructions-accordion">{guides.map((guide, index) => <div key={guide.title} className={`instructions-guide${openGuide === index ? " is-open" : ""}`}><h3><button type="button" aria-expanded={openGuide === index} aria-controls={`instructions-guide-${index}`} id={`instructions-guide-button-${index}`} onClick={() => setOpenGuide(openGuide === index ? null : index)}><span><b>{index + 1}</b>{guide.title}</span><ChevronDown size={20} /></button></h3><div id={`instructions-guide-${index}`} role="region" aria-labelledby={`instructions-guide-button-${index}`} hidden={openGuide !== index}><ol>{guide.steps.map((step, stepIndex) => <li key={stepIndex}>{step}</li>)}</ol></div></div>)}</div></section>
          </div>
          <aside className="instructions-right">
            <section className="instructions-card instructions-timer" aria-labelledby="instructions-timer-title"><div className="instructions-timer-heading"><h2 id="instructions-timer-title"><Clock3 size={18} /> Batas Waktu Pembayaran</h2><span>WIB (GMT+7)</span></div><div className="instructions-deadline"><div><span>Berakhir pada:</span><strong>{deadlineLabel}</strong></div><output aria-label="Sisa waktu pembayaran demo" className={expired ? "is-expired" : ""}>{countdown}</output></div><p>{expired ? "Waktu simulasi berakhir. Anda dapat kembali memilih metode pembayaran." : "Selesaikan pembayaran sebelum waktu habis agar alokasi kamar tetap terjaga saat sistem reservasi aktif."}</p></section>
            <section className="instructions-card instructions-summary"><div className="instructions-stay"><h2>Ringkasan Reservasi</h2><div className="instructions-room"><div><strong>Green Hero Darajat</strong><span>{totalRooms} Kamar • {nights} Malam</span></div></div><p><CalendarDays size={17} />{formatStay(checkIn, checkOut)}</p><p><UsersRound size={17} />{guests}</p><p><UserRound size={17} />{guest ? `${guest.fullName} (${guest.whatsapp})` : "Data pemesan belum diisi"}</p></div><BookingRoomSelection selection={roomSelection} nights={nights} /><div className="instructions-extras"><h3>Pilihan Tambahan:</h3>{selectedExtras.length ? selectedExtras.map((id) => <div className="instructions-cost-row" key={id}><span>{counts[id]}x {bookingExtraLabels[id]}{id === "extra-bed" ? ` (${nights} Malam)` : ""}</span><strong>{formatRoomPrice(getExtraCost(id, counts[id], nights))}</strong></div>) : <p>Tidak ada tambahan</p>}</div><div className="instructions-costs"><div className="instructions-cost-row"><span>Subtotal Kamar ({nights} Malam)</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="instructions-cost-row"><span>Subtotal Fasilitas Tambahan</span><strong>{formatRoomPrice(extrasTotal)}</strong></div><div className="instructions-cost-row instructions-tax"><span>Pajak &amp; Biaya Layanan</span><strong>Termasuk</strong></div></div><div className="instructions-total"><div><span>Total Tagihan<small>Sudah termasuk pajak &amp; layanan</small></span><strong>{formatRoomPrice(total)}</strong></div><button type="button" className="button button-primary" onClick={() => setMessage(expired ? "Waktu simulasi telah berakhir. Pilih kembali metode pembayaran untuk melanjutkan demo." : "Pembayaran belum terverifikasi. Ini adalah simulasi; tidak ada transaksi yang diproses.")}><RefreshCw size={18} /> Cek Status Pembayaran</button><a className="instructions-change-method" href={paymentHref}>Ganti Metode Pembayaran</a><div className="instructions-support"><a href="/contact"><MessageCircle size={17} /> Butuh bantuan pembayaran? Hubungi Tim Hotel</a></div></div></section>
            <div className="instructions-trust"><div><LockKeyhole size={20} /><span>Tanpa Transaksi</span></div><div><BadgeCheck size={20} /><span>Simulasi VA</span></div><div><Mail size={20} /><span>Demo Reservasi</span></div></div>
          </aside>
        </div>
      </main>
      <footer className="instructions-footer theme-footer"><div className="container instructions-footer-grid"><div><Brand href="/" /><p>Resor dataran tinggi di kawasan wisata pemandian air panas alami Pasirwangi, Garut. Menghadirkan kesejukan pegunungan, pemandangan kebun teh asri, dan kenyamanan keluarga.</p><p>Jl. Raya Darajat KM 14, Karyamekar, Pasirwangi, Kabupaten Garut, Jawa Barat 44161</p></div><div><h2>Informasi &amp; Tautan</h2><a href="/">Tentang Kami</a><a href="/rooms">Kamar &amp; Fasilitas</a><a href="/contact">Kebijakan Reservasi</a><a href="/contact">Kebijakan Privasi</a></div><div><h2>Bantuan &amp; Dukungan</h2><a href="/contact">Hubungi Kami</a><a href="/contact">FAQ &amp; Bantuan</a><a href={paymentHref}>Metode Pembayaran</a></div></div><div className="container instructions-footer-bottom"><span>© 2026 Green Hero Darajat Hotel &amp; Resort.</span><span>Demo frontend · Pembayaran belum aktif</span></div></footer>
      {message && <div className="instructions-toast" role="status"><Info size={18} /><span>{message}</span><button type="button" onClick={() => setMessage("")} aria-label="Tutup pemberitahuan">×</button></div>}
    </div>
  );
}
