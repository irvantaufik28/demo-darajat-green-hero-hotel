"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Flower2,
  Info,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { celebrationCategories } from "@/features/booking/constants/celebration-packages-data";
import "../styles/birthday-celebration.css";

/* ── Static Data ──────────────────────────────────────────── */
const packages = celebrationCategories[0].packages;

const styleItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
    ),
    title: "Warm Lighting",
    description: "Lentera lembut dan string lights temaram menyempurnakan udara sejuk.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
    ),
    title: "Natural Tones",
    description: "Sentuhan earthy beige, sage green, ivory, dan champagne yang tenang.",
  },
  {
    icon: <Flower2 size={18} />,
    title: "Floral & Foliage Accents",
    description: "Rangkaian daun eucalyptus segar dan bunga subtil beraroma bersih.",
  },
  {
    icon: <UtensilsCrossed size={18} />,
    title: "Elegant Table Styling",
    description: "Peralatan makan linen berkelas dan detail personal kartu ucapan.",
  },
];

const moments = [
  "Birthday Surprise",
  "Family Celebration",
  "Anniversary Dinner",
  "Small Gathering",
  "Intimate Celebration",
];

const addons = [
  { icon: <Star size={22} />, label: "Extra Birthday Cake", sub: "Tambahan" },
  { icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M22 4v16"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>
  ), label: "Additional Room Decoration", sub: "Tambahan" },
  { icon: <Flower2 size={22} />, label: "Flower Arrangement", sub: "Tambahan" },
  { icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8"/><path d="M4 4h16"/><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4"/></svg>
  ), label: "Welcome Drinks", sub: "Tambahan" },
  { icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18"/><path d="M9 21V9"/></svg>
  ), label: "Dining Setup", sub: "Tambahan" },
  { icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
  ), label: "Photo Corner", sub: "Tambahan" },
  { icon: <Flame size={22} />, label: "BBQ / Dining Pairing", sub: "Tambahan" },
];

const steps = [
  {
    number: "01",
    title: "Pilih Paket",
    description: "Tentukan paket perayaan yang sesuai dengan jumlah tamu, konsep kejutan, dan preferensi dekorasi Anda.",
  },
  {
    number: "02",
    title: "Tentukan Tanggal & Detail",
    description: "Informasikan nama perayaan, usia, request khusus ucapan, dan waktu yang diinginkan untuk setup dekorasi.",
  },
  {
    number: "03",
    title: "Tambahkan ke Reservasi",
    description: "Paket akan dikonfirmasi oleh tim reservasi kami dan langsung dipersiapkan di kamar atau venue pilihan sebelum kedatangan Anda.",
  },
];

/* ── Component ────────────────────────────────────────────── */
export default function BirthdayCelebrationPage() {
  return (
    <div className="bc-page">
      <SiteHeader
        id="bc-header"
        links={interiorLinks}
        activeHref="/experiences/birthday-celebration"
        homeHref="/"
        bookingHref="/rooms"
        contactHref="/contact"
      />

      <main>
        {/* ── 1. HERO ──────────────────────────────────── */}
        <section className="bc-hero" aria-labelledby="bc-title">
          <Image
            src="/images/birthday-outdoor-celebration.jpg"
            alt="Keluarga merayakan ulang tahun di teras outdoor Green Hero Darajat"
            fill
            priority
            sizes="100vw"
            className="bc-hero-image"
          />
          <div className="bc-hero-shade" aria-hidden="true" />
          <div className="bc-hero-content">
            <div className="bc-container">
              <nav className="bc-hero-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <span>Experiences</span>
                <span>/</span>
                <span aria-current="page">Birthday Celebration</span>
              </nav>
              <div className="bc-hero-badge">GREEN HERO EXPERIENCES</div>
              <h1 id="bc-title">
                Rayakan Momen Spesial<br />
                di Sejuknya Darajat
              </h1>
              <p>
                Lengkapi waktu menginap Anda dengan perayaan ulang tahun yang hangat,
                sederhana, dan berkesan di Green Hero Darajat.
              </p>
              <div className="bc-hero-actions">
                <a href="#pilihan-paket" className="bc-btn-gold">
                  Pilih Paket
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a href="/contact" className="bc-btn-outline">
                  Tanya Ketersediaan
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL ─────────────────────────────── */}
        <section className="bc-editorial" aria-labelledby="bc-editorial-title">
          <div className="bc-container">
            <div className="bc-editorial-inner">
              {/* foto kiri */}
              <div className="bc-editorial-photo">
                <Image
                  src="/images/birthday-room-decor.webp"
                  alt="Kamar birthday yang hangat dengan dekorasi natural di Green Hero Darajat"
                  fill
                  sizes="(max-width: 1023px) 100vw, 580px"
                />
                <div className="bc-editorial-chip" aria-hidden="true">
                  <div className="bc-editorial-chip-text">
                    <span>Atmosphere</span>
                    <strong>Tenang &amp; Hangat di Dataran Tinggi</strong>
                  </div>
                  <Sparkles size={26} />
                </div>
              </div>

              {/* copy kanan */}
              <div className="bc-editorial-copy">
                <span className="bc-eyebrow">INTIMATE HIGHLAND CELEBRATION</span>
                <h2 id="bc-editorial-title">
                  Perayaan yang Hangat<br />dan Berkesan
                </h2>
                <p>
                  Mulai dari surprise sederhana di kamar hingga perayaan keluarga yang lebih
                  lengkap, Birthday Celebration Green Hero dirancang untuk menghadirkan
                  suasana yang nyaman dan menyenangkan.
                </p>
                <div className="bc-highlights">
                  {[
                    {
                      num: "01",
                      title: "Cocok untuk Keluarga",
                      desc: "Perayaan dirancang agar terasa nyaman untuk pasangan, keluarga, atau tamu terdekat.",
                    },
                    {
                      num: "02",
                      title: "Dekorasi Bernuansa Hangat",
                      desc: "Gunakan elemen dekorasi yang natural, lembut, dan selaras dengan suasana resort pegunungan.",
                    },
                    {
                      num: "03",
                      title: "Tersedia Berdasarkan Reservasi",
                      desc: "Setiap setup dipersiapkan khusus sesuai tanggal menginap dan kebutuhan perayaan Anda.",
                    },
                  ].map((item) => (
                    <div key={item.num} className="bc-highlight-item">
                      <span>{item.num}</span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#pilihan-paket" className="bc-editorial-link">
                  Lihat Pilihan Paket
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ──────────────────────────────── */}
        <section
          className="bc-packages"
          id="pilihan-paket"
          aria-labelledby="bc-packages-title"
        >
          <div className="bc-container">
            <div className="bc-section-heading">
              <span className="bc-eyebrow is-center">PILIHAN PAKET</span>
              <h2 id="bc-packages-title">Pilih Paket Sesuai Momen Anda</h2>
              <p>
                Paket dirancang untuk memberikan pengalaman perayaan yang sederhana hingga
                lebih lengkap, tetap selaras dengan suasana Green Hero Darajat.
              </p>
            </div>

            <div className="bc-packages-grid">
              {packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`bc-package-card${pkg.popular ? " is-popular" : ""}`}
                >
                  {pkg.popular && (
                    <div className="bc-popular-badge" aria-label="Paling populer">
                      Paling Populer
                    </div>
                  )}
                  <div className="bc-package-header">
                    <span className="bc-package-capacity">{pkg.capacity}</span>
                    <span aria-hidden="true"><Sparkles size={20} /></span>
                  </div>
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className="bc-package-price">
                    <small>Mulai Dari</small>
                    <div className="bc-price-row">
                      <strong>Rp{pkg.price.toLocaleString("id-ID")}</strong>
                      <span>/ paket</span>
                    </div>
                  </div>
                  <span className="bc-inclusions-label">Termasuk dalam paket:</span>
                  <ul className="bc-inclusions" aria-label={`Inklusi ${pkg.name}`}>
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="bc-inclusion-item">
                        <CheckCircle2 size={14} />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="bc-packages-note" role="note">
              <Info size={20} />
              <p>
                Harga dapat berubah mengikuti jumlah tamu, kebutuhan dekorasi, dan lokasi
                setup. Ketersediaan paket mengikuti reservasi dan operasional hotel.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. DESIGN STYLE ───────────────────────────── */}
        <section className="bc-style" aria-labelledby="bc-style-title">
          <div className="bc-container">
            <div className="bc-style-inner">
              <div className="bc-style-copy">
                <span className="bc-eyebrow">HARMONIOUS RESORT AESTHETIC</span>
                <h2 id="bc-style-title">
                  Nuansa Perayaan yang Selaras<br />dengan Green Hero
                </h2>
                <p>
                  Perayaan dirancang tetap hangat, natural, dan nyaman, menggunakan
                  pendekatan dekorasi yang tidak berlebihan agar selaras dengan suasana
                  pegunungan Darajat.
                </p>
                <div className="bc-style-grid">
                  {styleItems.map((item) => (
                    <div key={item.title} className="bc-style-item">
                      <div className="bc-style-icon" aria-hidden="true">
                        {item.icon}
                      </div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bc-style-photo">
                <Image
                  src="/images/birthday-room-decor.webp"
                  alt="Kue ulang tahun dan dekorasi bunga di kamar Green Hero Darajat"
                  fill
                  sizes="(max-width: 1023px) 100vw, 480px"
                />
                <div className="bc-style-photo-label" aria-hidden="true">
                  Organic Minimalist Details
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. MOMEN CHIPS ───────────────────────────── */}
        <section className="bc-moments" aria-labelledby="bc-moments-title">
          <div className="bc-container">
            <div className="bc-moments-inner">
              <h3 id="bc-moments-title">Cocok untuk Berbagai Momen</h3>
              <div className="bc-moments-chips">
                {moments.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. ADD-ONS ────────────────────────────────── */}
        <section className="bc-addons" aria-labelledby="bc-addons-title">
          <div className="bc-container">
            <div className="bc-section-heading">
              <span className="bc-eyebrow is-center">CUSTOMIZE EXPERIENCE</span>
              <h2 id="bc-addons-title">Lengkapi Perayaan Anda</h2>
              <p>
                Pilihan pelengkap yang tersedia sebagai tambahan untuk menyempurnakan hari
                istimewa.
              </p>
            </div>
            <div className="bc-addons-grid">
              {addons.map((addon) => (
                <div key={addon.label} className="bc-addon-item">
                  <div className="bc-addon-icon" aria-hidden="true">
                    {addon.icon}
                  </div>
                  <strong>{addon.label}</strong>
                  <span>{addon.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. CINEMATIC BREAK ───────────────────────── */}
        <section className="bc-cinematic" aria-labelledby="bc-cinematic-title">
          <Image
            src="/images/misty-valley.webp"
            alt="Villa teras outdoor malam hari berlatar lembah berkabut Darajat"
            fill
            sizes="100vw"
            className="bc-cinematic-image"
          />
          <div className="bc-cinematic-overlay" aria-hidden="true" />
          <div className="bc-cinematic-content">
            <span className="bc-cinematic-eyebrow">UNFORGETTABLE HIGHLAND NIGHTS</span>
            <h2 id="bc-cinematic-title">Celebrate in the Highlands</h2>
            <p>
              Udara sejuk Garut, hangatnya keluarga, dan keheningan alam yang menenangkan
              jiwa.
            </p>
          </div>
        </section>

        {/* ── 8. HOW TO ORDER ───────────────────────────── */}
        <section className="bc-how-to" id="cara-pesan" aria-labelledby="bc-howto-title">
          <div className="bc-container">
            <div className="bc-section-heading">
              <span className="bc-eyebrow is-center">RESERVATION FLOW</span>
              <h2 id="bc-howto-title">Cara Memesan Paket</h2>
              <p>
                Birthday Celebration dapat ditambahkan saat proses booking kamar atau
                dikonfirmasi sesuai reservasi.
              </p>
            </div>
            <div className="bc-steps">
              {steps.map((step) => (
                <div key={step.number} className="bc-step">
                  <span className="bc-step-number" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CTA ────────────────────────────────────── */}
        <section className="bc-cta" aria-labelledby="bc-cta-title">
          <div className="bc-container">
            <div className="bc-cta-card">
              <div className="bc-cta-inner">
                <span className="bc-cta-eyebrow">MAKE IT MEMORABLE</span>
                <h2 id="bc-cta-title">
                  Buat Momen Menginap<br />Lebih Berkesan
                </h2>
                <p>
                  Pilih kamar dan tambahkan Birthday Celebration sebagai bagian dari
                  pengalaman menginap Anda di Green Hero Darajat.
                </p>
                <div className="bc-cta-actions">
                  <a href="/rooms" className="bc-cta-btn-white">
                    <CalendarCheck size={17} />
                    Pesan Kamar
                  </a>
                  <a href="/#experiences" className="bc-cta-btn-glass">
                    Lihat Experiences Lainnya
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <ExperienceFooter activeHref="/experiences/birthday-celebration" />
    </div>
  );
}
