"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  Info,
  LockKeyhole,
  MailCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { bookingExtraLabels, bookingExtraPrices, getExtraCost, getNights, type PaidExtraId } from "@/data/booking";
import { formatRoomPrice, getRoom } from "@/data/rooms";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/data/roomSelection";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";

type Props = {
  roomId: string;
  roomSelection: RoomSelection;
  checkIn: string;
  checkOut: string;
  guests: string;
  counts: Record<PaidExtraId, number>;
  initialPaymentMethod?: string;
};

type PaymentTabId = "hotel" | "card" | "virtual-account" | "wallet";

type PaymentOption = {
  id: string;
  label: string;
  brand: string;
  information: string[];
};

const paymentTabs: { id: PaymentTabId; label: string }[] = [
  { id: "hotel", label: "Bayar di Hotel" },
  { id: "card", label: "Kartu Kredit" },
  { id: "virtual-account", label: "Virtual Account" },
  { id: "wallet", label: "E-Wallet" },
];

const paymentOptions: Record<PaymentTabId, PaymentOption[]> = {
  hotel: [
    { id: "hotel-payment", label: "Bayar di Hotel", brand: "HOTEL", information: ["Pilihan ini hanya menampilkan alur bayar di hotel pada demo.", "Reservasi dan ketentuan pembayaran sebenarnya perlu dikonfirmasi langsung oleh hotel."] },
    { id: "no-prepayment", label: "Tanpa Pembayaran di Muka", brand: "HOTEL", information: ["Tidak ada pembayaran di muka pada tampilan demo ini.", "Memilih opsi ini belum membuat atau menahan reservasi kamar."] },
  ],
  card: [
    { id: "credit-card", label: "Visa, Mastercard, JCB", brand: "VISA  ●●  JCB", information: ["Informasi kartu tidak diminta atau disimpan pada halaman demo ini.", "Pembayaran kartu memerlukan payment gateway resmi yang belum terhubung."] },
  ],
  "virtual-account": [
    ...["BCA", "Bank Neo Commerce", "BRI", "BSI", "CIMB", "Danamon", "Permata", "Mandiri", "ATM"].map((name) => ({ id: name.toLowerCase().replaceAll(" ", "-"), label: name, brand: name === "ATM" ? "ATM" : name.toUpperCase(), information: [`Virtual Account ${name} belum diterbitkan pada halaman demo.`, "Nomor dan instruksi pembayaran baru tersedia setelah integrasi payment gateway."] })),
  ],
  wallet: [
    ...["GoPay", "ShopeePay", "QRIS", "Dana", "LinkAja", "AstraPay", "Jenius"].map((name) => ({ id: name.toLowerCase(), label: name, brand: name === "QRIS" ? "QRIS" : name, information: name === "QRIS" ? ["Kode QR belum dibuat pada halaman demo.", "Setelah integrasi, pindai kode QR yang ditampilkan melalui aplikasi pembayaran Anda."] : [`Otorisasi ${name} belum tersedia pada halaman demo.`, "Jangan mengirim pembayaran sebelum menerima instruksi resmi dari hotel."] })),
  ],
};

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatDateRange(checkIn: string, checkOut: string) {
  const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
  const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);
  if (startYear === endYear && startMonth === endMonth) return `${startDay} – ${endDay} ${months[startMonth - 1]} ${startYear}`;
  return `${startDay} ${months[startMonth - 1]} ${startYear} – ${endDay} ${months[endMonth - 1]} ${endYear}`;
}

export default function PaymentPage({ roomId, roomSelection, checkIn, checkOut, guests, counts }: Props) {
  const room = getRoom(roomId);
  const selectionQuery = serializeRoomSelection(roomSelection);
  const totalRooms = countSelectedRooms(roomSelection);
  const [selectedTab] = useState<PaymentTabId>("virtual-account");
  const [selectedOptions] = useState<Record<PaymentTabId, string>>({ hotel: "hotel-payment", card: "credit-card", "virtual-account": "bca", wallet: "qris" });
  const [message, setMessage] = useState("");
  if (!room) return null;

  const nights = getNights(checkIn, checkOut);
  const selectedExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const roomTotal = getRoomSelectionTotal(roomSelection, nights);
  const extrasTotal = selectedExtras.reduce((total, id) => total + getExtraCost(id, counts[id], nights), 0);
  const total = roomTotal + extrasTotal;
  const backParams = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
  for (const id of selectedExtras) backParams.set(id, String(counts[id]));
  const backHref = `/booking/guest-details?${backParams}`;
  const selectedOption = paymentOptions[selectedTab].find((option) => option.id === selectedOptions[selectedTab]);

  function handleContinue() {
    if (selectedTab === "virtual-account" && selectedOption?.id === "bca") {
      const instructionParams = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests, method: "bca" });
      for (const id of selectedExtras) instructionParams.set(id, String(counts[id]));
      try { sessionStorage.removeItem(`green-hero-demo-payment-deadline:${instructionParams}`); } catch { /* Continue without browser storage. */ }
      window.location.assign(`/booking/payment/instructions?${instructionParams}`);
      return;
    }
    setMessage(`${selectedOption?.label ?? "Metode pembayaran"} hanya tersedia sebagai simulasi. Tidak ada transaksi yang dibuat.`);
  }

  return (
    <div className="booking-page payment-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#payment-summary" contactHref="/contact" />
      <main className="container booking-main payment-main">
        <nav className="booking-progress" aria-label="Tahap pemesanan">
          {["Pilih Kamar", "Pilihan Tambahan", "Data Tamu", "Pembayaran"].map((label, index) => (
            <div className={`booking-step${index < 3 ? " is-complete" : ""}${index === 3 ? " is-current" : ""}`} key={label}>
              <span className="booking-step-circle">{index < 3 ? <Check size={18} /> : 4}</span><span>{label}</span>
            </div>
          ))}
        </nav>

        <div className="payment-intro"><span className="booking-eyebrow">PEMBAYARAN RESERVASI</span><h1>Selesaikan Pembayaran</h1><p>Pilih metode pembayaran untuk meninjau reservasi Green Hero Darajat. Pembayaran belum aktif pada halaman demo ini.</p></div>

        <div className="payment-layout">
          <div className="payment-left">
            <section className="payment-method-card" aria-labelledby="payment-method-title"><div className="payment-method-heading"><div><Wallet size={25} /><h2 id="payment-method-title">Pilih Metode Pembayaran</h2></div><p className="payment-demo-notice" id="payment-demo-notice"><Info size={16} /> Demo hanya bisa BCA Virtual Account.</p></div>
              <div className="payment-tabs" role="tablist" aria-label="Kategori metode pembayaran">
                {paymentTabs.map((tab) => <button key={tab.id} id={`payment-tab-${tab.id}`} type="button" role="tab" aria-selected={selectedTab === tab.id} aria-controls="payment-options-panel" className={selectedTab === tab.id ? "is-active" : ""} disabled={tab.id !== "virtual-account"} title={tab.id !== "virtual-account" ? "Demo hanya bisa BCA Virtual Account" : undefined} aria-describedby="payment-demo-notice">{tab.label}</button>)}
              </div>
              <div id="payment-options-panel" role="tabpanel" aria-labelledby={`payment-tab-${selectedTab}`} className="payment-options-panel">
                <fieldset className="payment-methods"><legend className="sr-only">Pilihan {paymentTabs.find((tab) => tab.id === selectedTab)?.label}</legend>
                  {paymentOptions[selectedTab].map((option) => <div className="payment-option-group" key={option.id}>
                    <label className={`payment-method-option${selectedOptions[selectedTab] === option.id ? " is-selected" : ""}${option.id !== "bca" ? " is-unavailable" : ""}`} title={option.id !== "bca" ? "Demo hanya bisa BCA Virtual Account" : undefined}><input type="radio" name={`payment-option-${selectedTab}`} value={option.id} checked={selectedOptions[selectedTab] === option.id} readOnly disabled={option.id !== "bca"} aria-describedby="payment-demo-notice" /><strong>{option.label}</strong><span className="payment-brand-mark">{option.brand}</span></label>
                    {selectedOptions[selectedTab] === option.id && <div className="payment-option-information"><div><Info size={18} /><strong>Informasi Penting</strong></div><ul>{option.information.map((item) => <li key={item}>{item}</li>)}</ul></div>}
                  </div>)}
                </fieldset>
              </div>
            </section>

            <div className="payment-trust-grid"><div><LockKeyhole size={23} /><span><strong>Tanpa Transaksi</strong><small>Tidak ada tagihan pada demo</small></span></div><div><Zap size={23} /><span><strong>Pilihan Interaktif</strong><small>Metode dapat dipilih</small></span></div><div><MailCheck size={23} /><span><strong>Data Pemesan</strong><small>Tersimpan sementara di browser</small></span></div></div>
          </div>

          <aside className="payment-right" id="payment-summary"><div className="payment-timer"><Clock3 size={24} /><div><span>SISA WAKTU <strong>--:--</strong></span><p>Timer akan aktif setelah sistem reservasi tersedia. Kamar belum ditahan pada demo ini.</p></div></div>
            <div className="payment-summary-card"><div className="payment-summary-heading"><h2>Ringkasan Reservasi</h2><span>DEMO</span></div><div className="payment-booking-details"><div><span>Tipe Kamar</span><strong>{totalRooms} Kamar • {nights} Malam</strong></div><div><span>Jadwal Menginap</span><strong>{formatDateRange(checkIn, checkOut)}<small>{guests}</small></strong></div><div><span>Tambahan</span><strong>{selectedExtras.length ? selectedExtras.map((id) => <small key={id}>{bookingExtraLabels[id]} ({counts[id]}x)</small>) : <small>Tidak ada tambahan</small>}</strong></div></div><BookingRoomSelection selection={roomSelection} nights={nights} /><div className="payment-total"><div><span>TOTAL PEMBAYARAN</span><strong>{formatRoomPrice(total)}</strong></div><p>Jumlah termasuk kamar dan pilihan tambahan yang dipilih.</p></div><button type="button" className="payment-pay-button" onClick={handleContinue}><LockKeyhole size={20} /> {selectedTab === "virtual-account" && selectedOption?.id === "bca" ? "Lanjut ke Instruksi Pembayaran" : selectedTab === "hotel" ? "Lanjutkan dengan Bayar di Hotel" : `Bayar ${formatRoomPrice(total)}`}</button><p className="payment-pay-caption">Pembayaran belum diproses pada halaman demo.</p>{message && <p className="payment-status" role="status">{message}</p>}<div className="payment-back"><a href={backHref}><ArrowLeft size={18} /> Kembali ke Data Tamu</a></div></div>
          </aside>
        </div>
      </main>
      <footer className="payment-footer theme-footer"><div className="container payment-footer-grid"><div><Brand href="/" /><p>Resor peristirahatan dataran tinggi di kawasan Darajat, Garut. Nikmati panorama pegunungan dan air panas alami bersama keluarga.</p></div><div><strong>Jelajahi</strong><a href="/">Home</a><a href="/rooms">Kamar &amp; Suite</a><a href="/facilities">Fasilitas</a></div><div><strong>Kontak</strong><span>Jl. Raya Darajat KM 14, Pasirwangi, Garut</span><span>halo@greenherodarajat.com</span></div></div><div className="container payment-footer-bottom"><span>© 2026 Green Hero Darajat Hotel &amp; Resort.</span><span>Demo frontend · Pembayaran belum aktif</span></div></footer>
    </div>
  );
}
