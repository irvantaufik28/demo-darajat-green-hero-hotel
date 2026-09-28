"use client";

import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { foodCategories } from "@/data/foodPackages";

/* ── Data ─────────────────────────────────────────────────── */
const grillCategory = foodCategories.find((c) => c.id === "grill")!;

const editorialHighlights = [
  {
    number: "01",
    title: "Untuk Keluarga & Gathering",
    description:
      "Dirancang fleksibel untuk santap bersama orang terkasih, menciptakan momen keakraban santai tanpa repot.",
  },
  {
    number: "02",
    title: "Disiapkan untuk Reservasi Anda",
    description:
      "Seluruh bahan baku segar, marinasi spesial, serta peralatan grill dan tungku dipersiapkan higienis sesuai jadwal reservasi Anda.",
  },
  {
    number: "03",
    title: "Grill dalam Suasana Pegunungan",
    description:
      "Nikmati hidangan panas yang dipanggang sendiri atau dibantu staf di tengah desau angin sejuk lereng gunung Darajat.",
  },
];

const bentoCategories = [
  {
    number: "01",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
    ),
    title: "Meat Selection",
    description:
      "Daging sapi pilihan dengan marbling seimbang serta potongan dada dan paha ayam tanpa tulang yang empuk saat dibakar.",
    items: [
      { name: "Beef Shortplate (US Cut)", note: "Slice 1.5mm" },
      { name: "Saikoro Beef Cubes", note: "Meltique Cut" },
      { name: "Marinated Spicy Beef", note: "Signature Rub" },
      { name: "Fresh Chicken Fillet", note: "Herb Infused" },
    ],
  },
  {
    number: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>
    ),
    title: "Grill Sides & Veggies",
    description:
      "Kombinasi pendamping grill gurih dan sayuran organik segar yang dipetik dari petani sekitar lereng Pasirwangi Garut.",
    items: [
      { name: "Jumbo Smoked Beef Sausage", note: "Bratwurst" },
      { name: "Fishball & Seafood Tofu", note: "Olahan Segar" },
      { name: "Jagung Manis & Selada Segar", note: "Lokal Garut" },
      { name: "Jamur Enoki & Champignon", note: "Fresh Cut" },
    ],
  },
  {
    number: "03",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/></svg>
    ),
    title: "Sauces & Marinades",
    description:
      "Perpaduan racikan saus modern dan sentuhan cita rasa Sunda otentik yang memperkaya aroma pembakaran arang.",
    items: [
      { name: "Bumbu Oles Manis Gurih Khas Sunda", note: "Chef's Signature", isSignature: true },
      { name: "Saus BBQ Smokey Black Pepper", note: "Western Taste" },
      { name: "Garlic Sesame Oil Dipping", note: "Savoury" },
      { name: "Sambal Kecap Rawit & Jeruk Limau", note: "Pedas Segar" },
    ],
  },
];

const addons = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
    ),
    label: "Additional Beef",
    sub: "Shortplate 250g",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
    ),
    label: "Additional Chicken",
    sub: "Fillet Gurih 300g",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
    ),
    label: "Mixed Seafood",
    sub: "Udang & Cumi Marinasi",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/><path d="M2 12h20"/><path d="M12 12v10"/></svg>
    ),
    label: "Extra Vegetables",
    sub: "Jagung & Jamur Platter",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
    ),
    label: "Hotpot / Suki",
    sub: "Kuah Tomyum / Kaldu",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    label: "Additional Serving",
    sub: "Bantuan Chef / Staf",
  },
];

const steps = [
  {
    number: "01",
    title: "Pilih Paket",
    description:
      "Tentukan paket BBQ (Highland Grill, Family Grill, atau Grand Grill) yang paling sesuai dengan jumlah orang rombongan Anda.",
  },
  {
    number: "02",
    title: "Tentukan Tanggal & Jam",
    description:
      "Pilih waktu penyajian (tersedia sesi santap sore pukul 17:00 atau makan malam pukul 19:00 WIB) di teras villa Anda atau area outdoor deck.",
  },
  {
    number: "03",
    title: "Tambahkan ke Reservasi",
    description:
      "Centang pilihan BBQ pada menu Add-On saat pemesanan kamar atau konfirmasi melalui staf Guest Experience kami sebelum check-in.",
  },
];

/* ── Component ────────────────────────────────────────────── */
export default function BbqGrillPage() {
  return (
    <div className="bbq-page">
      {/* ── Header ──────────────────────────────────────── */}
      <SiteHeader
        id="bbq-header"
        links={interiorLinks}
        activeHref="/experiences/bbq-grill"
        homeHref="/"
        bookingHref="/rooms"
        contactHref="/contact"
      />

      <main>
        {/* ── 1. HERO ──────────────────────────────────── */}
        <section className="bbq-hero" aria-labelledby="bbq-title">
          <Image
            src="/images/bbq-grill.webp"
            alt="Keluarga menikmati BBQ outdoor di area pegunungan Darajat"
            fill
            priority
            sizes="100vw"
            className="bbq-hero-image"
          />
          <div className="bbq-hero-shade" aria-hidden="true" />
          <div className="bbq-hero-content">
            <div className="bbq-container">
              <nav className="bbq-hero-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <span>Experiences</span>
                <span>/</span>
                <span aria-current="page">BBQ &amp; Grill</span>
              </nav>
              <div className="bbq-hero-badge">GREEN HERO EXPERIENCES</div>
              <h1 id="bbq-title">
                BBQ &amp; Grill di Tengah<br />
                Udara Sejuk Darajat
              </h1>
              <p>
                Nikmati waktu bersama keluarga dan teman dengan pilihan grill yang disiapkan
                untuk melengkapi pengalaman menginap di Green Hero Darajat.
              </p>
              <div className="bbq-hero-actions">
                <a href="#pilihan-paket" className="bbq-btn-primary">
                  Pilih Paket
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </a>
                <a href="#cara-pesan" className="bbq-btn-outline">
                  Cek Ketersediaan
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL ─────────────────────────────── */}
        <section className="bbq-editorial" aria-labelledby="bbq-editorial-title">
          <div className="bbq-container">
            <div className="bbq-editorial-inner">
              {/* foto kiri */}
              <div className="bbq-editorial-photo">
                <Image
                  src="/images/bbq-grill.webp"
                  alt="Bahan grill segar di atas panggangan arang Green Hero Darajat"
                  fill
                  sizes="(max-width: 1023px) 100vw, 580px"
                />
                <div className="bbq-editorial-chip" aria-hidden="true">
                  <div className="bbq-editorial-chip-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>
                  </div>
                  <div>
                    <strong>Outdoor Highland Deck</strong>
                    <span>Pemandangan perbukitan Darajat &amp; kabut sore</span>
                  </div>
                </div>
              </div>

              {/* copy kanan */}
              <div className="bbq-editorial-copy">
                <span className="bbq-eyebrow">HIGHLAND DINING EXPERIENCE</span>
                <h2 id="bbq-editorial-title">
                  Lebih Hangat Saat Dinikmati Bersama
                </h2>
                <p>
                  Dari makan malam keluarga hingga gathering kecil, BBQ &amp; Grill Green Hero
                  menghadirkan pengalaman santap yang santai di suasana dataran tinggi Darajat.
                  Hangatnya bara api menyempurnakan malam pegunungan Anda.
                </p>
                <div className="bbq-numbered-list">
                  {editorialHighlights.map((item) => (
                    <div key={item.number} className="bbq-numbered-item">
                      <span>{item.number}</span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#pilihan-paket" className="bbq-editorial-link">
                  Lihat Pilihan Paket
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ──────────────────────────────── */}
        <section
          className="bbq-packages"
          id="pilihan-paket"
          aria-labelledby="bbq-packages-title"
        >
          <div className="bbq-container">
            <div className="bbq-section-heading">
              <span className="bbq-eyebrow" style={{ justifyContent: "center" }}>PILIHAN PAKET</span>
              <h2 id="bbq-packages-title">Pilih Paket Sesuai Jumlah Tamu</h2>
              <p>
                Pilihan paket dapat disesuaikan dengan kebutuhan keluarga maupun kelompok
                selama menginap di Green Hero Darajat.
              </p>
            </div>

            <div className="bbq-packages-grid">
              {grillCategory.packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`bbq-package-card${pkg.popular ? " is-popular" : ""}`}
                >
                  {pkg.popular && (
                    <div className="bbq-package-popular-badge" aria-label="Paling populer">
                      Paling Populer
                    </div>
                  )}
                  <div className="bbq-package-header">
                    <span className="bbq-package-tag">
                      {pkg.id === "grill-highland"
                        ? "Porsi Santai"
                        : pkg.id === "grill-family"
                        ? "Favorit Keluarga"
                        : "Porsi Besar"}
                    </span>
                    <div className="bbq-package-guests">
                      <Users size={15} />
                      {pkg.capacity}
                    </div>
                  </div>

                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>

                  <div className="bbq-package-price">
                    <small>Harga Estimasi</small>
                    <div className="bbq-package-price-row">
                      <strong>Rp{pkg.price.toLocaleString("id-ID")}</strong>
                      <span>/ paket</span>
                    </div>
                  </div>

                  <span className="bbq-inclusions-label">Termasuk Dalam Paket:</span>
                  <ul className="bbq-inclusions" aria-label={`Inklusi ${pkg.name}`}>
                    {pkg.inclusions.map((inc, idx) => (
                      <li
                        key={inc}
                        className={`bbq-inclusion-item${idx === 0 && pkg.popular ? " is-featured" : ""}`}
                      >
                        <CheckCircle2 size={15} />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="bbq-packages-note" role="note">
              <Info size={20} />
              <p>
                Harga pada halaman ini dapat berubah mengikuti pilihan bahan, jumlah tamu, dan
                kebutuhan acara. Ketersediaan paket mengikuti jadwal reservasi villa/kamar Anda
                di Green Hero Darajat.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. BAHAN & OLAHAN ─────────────────────────── */}
        <section className="bbq-table" aria-labelledby="bbq-table-title">
          <div className="bbq-container">
            <div className="bbq-table-header">
              <div>
                <span className="bbq-eyebrow">BAHAN &amp; OLAHAN</span>
                <h2 id="bbq-table-title">Pilihan untuk Meja Anda</h2>
                <p>
                  Kualitas bahan segar yang dipotong higienis dan dimarinasi menggunakan
                  rempah aromatik khas pegunungan Parahyangan.
                </p>
              </div>
              <div className="bbq-table-badge">
                <ShieldCheck size={16} />
                100% Halal &amp; Fresh Preparation
              </div>
            </div>

            <div className="bbq-bento-grid">
              {bentoCategories.map((cat) => (
                <div key={cat.number} className="bbq-bento-card">
                  <div className="bbq-bento-icon" aria-hidden="true">
                    {cat.icon}
                  </div>
                  <span className="bbq-eyebrow is-gold">KATEGORI {cat.number}</span>
                  <h3>{cat.title}</h3>
                  <p>{cat.description}</p>
                  <div className="bbq-bento-items">
                    {cat.items.map((item) => (
                      <div key={item.name} className="bbq-bento-row">
                        <span>{item.name}</span>
                        <span className={"isSignature" in item && item.isSignature ? "is-signature" : ""}>
                          {item.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. CINEMATIC BREAK ───────────────────────── */}
        <section className="bbq-cinematic" aria-hidden="false">
          <Image
            src="/images/outdoor-dining.webp"
            alt="Bara api menyala di area outdoor pegunungan Darajat"
            fill
            sizes="100vw"
            className="bbq-cinematic-image"
          />
          <div className="bbq-cinematic-overlay" aria-hidden="true" />
          <div className="bbq-cinematic-content">
            <span className="bbq-cinematic-eyebrow">MOMEN SANTAP HANGAT</span>
            <blockquote>
              &ldquo;Hangatnya Grill, Sejuknya Darajat&rdquo;
            </blockquote>
            <p>
              Duduk melingkar bersama keluarga, mendengar percikan bara api di udara
              pegunungan 1.800 mdpl yang berkabut lembut.
            </p>
          </div>
        </section>

        {/* ── 6. LENGKAPI BBQ ───────────────────────────── */}
        <section className="bbq-addons" aria-labelledby="bbq-addons-title">
          <div className="bbq-container">
            <div className="bbq-addons-header">
              <div className="bbq-addons-pill">
                <PlusCircle size={14} />
                Tersedia sebagai tambahan
              </div>
              <h2 id="bbq-addons-title">Lengkapi BBQ Anda</h2>
              <p>
                Ingin porsi ekstra untuk jenis hidangan tertentu? Anda dapat memilih
                tambahan berikut saat melakukan pemesanan.
              </p>
            </div>
            <div className="bbq-addons-grid">
              {addons.map((addon) => (
                <div key={addon.label} className="bbq-addon-item">
                  <div className="bbq-addon-icon" aria-hidden="true">
                    {addon.icon}
                  </div>
                  <strong>{addon.label}</strong>
                  <span>{addon.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. CARA PESAN ─────────────────────────────── */}
        <section
          className="bbq-how-to"
          id="cara-pesan"
          aria-labelledby="bbq-howto-title"
        >
          <div className="bbq-container">
            <div className="bbq-section-heading">
              <span className="bbq-eyebrow" style={{ justifyContent: "center" }}>PROSES SEDERHANA</span>
              <h2 id="bbq-howto-title">Langkah Pemesanan BBQ</h2>
              <p>
                BBQ &amp; Grill dapat ditambahkan saat proses booking sebagai bagian dari
                pengalaman eksklusif Green Hero Experiences.
              </p>
            </div>
            <div className="bbq-steps">
              {steps.map((step) => (
                <div key={step.number} className="bbq-step">
                  <div className="bbq-step-number" aria-hidden="true">
                    {step.number}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. CTA ────────────────────────────────────── */}
        <section className="bbq-cta" aria-labelledby="bbq-cta-title">
          <div className="bbq-container">
            <div className="bbq-cta-inner">
              <span className="bbq-cta-eyebrow">PENGALAMAN TAK TERLUPAKAN</span>
              <h2 id="bbq-cta-title">
                Buat Malam di Darajat<br />
                Lebih Hangat
              </h2>
              <p>
                Pilih kamar favorit Anda dan tambahkan paket BBQ &amp; Grill pada tahap
                Pilihan Tambahan saat melakukan reservasi online.
              </p>
              <div className="bbq-cta-actions">
                <a href="/rooms" className="bbq-cta-btn-white">
                  Pesan Kamar Sekarang
                </a>
                <a href="/#experiences" className="bbq-cta-btn-outline">
                  Lihat Experiences Lainnya
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <ExperienceFooter activeHref="/experiences/bbq-grill" />
    </div>
  );
}
