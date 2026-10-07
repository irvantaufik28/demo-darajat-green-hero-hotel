"use client";

import Image from "next/image";
import { CheckCircle2, Info, Utensils } from "lucide-react";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { foodCategories } from "@/features/booking/constants/food-packages-data";
import "../styles/grilled-chicken.css";

const chickenCategory = foodCategories.find((c) => c.id === "grilled-chicken")!;

const editorialHighlights = [
  {
    number: "01",
    title: "Cocok untuk Makan Bersama",
    description: "Pilihan praktis untuk keluarga dan kelompok dengan porsi yang dirancang pas dan memuaskan.",
  },
  {
    number: "02",
    title: "Disiapkan Sesuai Reservasi",
    description: "Hidangan dipersiapkan higienis mengikuti tanggal dan jumlah tamu agar rasa senantiasa segar saat disajikan.",
  },
  {
    number: "03",
    title: "Lengkap dengan Pendamping",
    description: "Disajikan bersama nasi putih pulen, sambal tradisional, lalapan kebun segar, tahu tempe, dan pelengkap.",
  },
];

const pendampings = [
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>),
    title: "Ayam Kampung Bakar",
    description: "Daging empuk gurih meresap dengan bumbu olesan rempah manis gurih khas Jawa Barat yang dibakar perlahan di atas arang batok kelapa.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>),
    title: "Nasi Hangat",
    description: "Nasi putih pulen mengepul disajikan dalam bakul anyaman bambu tradisional, menjaga aroma alami dan kehangatan di udara sejuk pegunungan.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>),
    title: "Aneka Sambal",
    description: "Sambal terasi ulek segar, sambal dadak tomat hijau, dan sambal kecap cabai rawit pedas manis untuk kombinasi santap yang kaya sensasi.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
    title: "Lalapan Segar",
    description: "Mentimun renyah, daun kemangi wangi, kol kubis, dan selada air segar yang dipetik langsung dari kebun hortikultura lereng Garut.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>),
    title: "Tahu & Tempe",
    description: "Tahu sutra gurih khas Jawa Barat dan tempe kedelai lokal goreng bumbu ketumbar renyah di luar, lembut di dalam.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>),
    title: "Sayur Pendamping",
    description: "Sayur asem segar berkuah gurih asam pedas atau kuah sup hangat rempah penyejuk malam pegunungan Darajat yang menyegarkan.",
  },
];

const addons = [
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>, label: "Extra Ayam Kampung", sub: "1 Ekor Utuh Panggang" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>, label: "Additional Rice", sub: "Bakul Nasi Tambahan" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>, label: "Extra Sambal", sub: "Pilihan Sambal Khas" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>, label: "Tahu & Tempe", sub: "Platter Tambahan" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>, label: "Sayur Pendamping", sub: "Mangkok Sayur Asem" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, label: "Additional Drinks", sub: "Wedang Jahe / Teh Manis" },
];

const steps = [
  { number: "01", title: "Pilih Paket", description: "Sesuaikan paket Family, Gathering, atau Celebration dengan jumlah anggota keluarga dan rombongan Anda." },
  { number: "02", title: "Tentukan Tanggal & Jam", description: "Pilih jadwal penyajian santap sore atau santap malam di teras villa pribadi atau restoran resort." },
  { number: "03", title: "Tambahkan ke Reservasi", description: "Centang pilihan Ayam Bakar Kampung pada menu Add-On saat pemesanan kamar atau konfirmasi melalui staf Guest Experience kami." },
];

export default function GrilledChickenPage() {
  return (
    <div className="ab-page">
      <SiteHeader
        id="ab-header"
        links={interiorLinks}
        activeHref="/experiences/grilled-chicken"
        homeHref="/"
        bookingHref="/rooms"
        contactHref="/contact"
      />

      <main>
        {/* ── 1. HERO ──────────────────────────────────── */}
        <section className="ab-hero" aria-labelledby="ab-title">
          <Image src="/images/outdoor-dining.webp" alt="Keluarga menikmati Ayam Bakar Kampung di teras outdoor Green Hero Darajat" fill priority sizes="100vw" className="ab-hero-image" />
          <div className="ab-hero-shade" aria-hidden="true" />
          <div className="ab-hero-content">
            <nav className="ab-hero-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a><span>/</span><span>Experiences</span><span>/</span>
              <span aria-current="page">Grilled Chicken</span>
            </nav>
            <div className="ab-hero-badge">GREEN HERO EXPERIENCES</div>
            <h1 id="ab-title">Ayam Bakar Kampung untuk<br />Dinikmati Bersama</h1>
            <p>Sajian ayam kampung bakar dengan cita rasa khas Indonesia, disiapkan untuk melengkapi waktu bersama keluarga di sejuknya Darajat.</p>
            <div className="ab-hero-actions">
              <a href="#pilihan-paket" className="ab-btn-primary">Pilih Paket</a>
              <a href="#cara-pesan" className="ab-btn-outline">Cek Ketersediaan</a>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL ─────────────────────────────── */}
        <section className="ab-editorial" aria-labelledby="ab-editorial-title">
          <div className="ab-container">
            <div className="ab-editorial-inner">
              <div className="ab-editorial-photo">
                <Image src="/images/outdoor-dining.webp" alt="Ayam bakar kampung dengan lalapan dan sambal tradisional" fill sizes="(max-width: 1023px) 100vw, 680px" />
                <div className="ab-editorial-chip" aria-hidden="true">
                  <Utensils size={18} />
                  <span>Kuliner Tradisi Dataran Tinggi — Gurih Manis Bumbu Rempah</span>
                </div>
              </div>
              <div className="ab-editorial-copy">
                <span className="ab-eyebrow">CITA RASA NUSANTARA</span>
                <h2 id="ab-editorial-title">Hangat, Sederhana,<br />dan Nikmat Bersama</h2>
                <p>Ayam Bakar Kampung Green Hero menghadirkan sajian yang familiar untuk makan bersama keluarga, gathering, dan momen santai selama menginap di dataran tinggi Pasirwangi.</p>
                <div className="ab-numbered-list">
                  {editorialHighlights.map((item) => (
                    <div key={item.number} className="ab-numbered-item">
                      <span>{item.number}</span>
                      <div><h3>{item.title}</h3><p>{item.description}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ──────────────────────────────── */}
        <section className="ab-packages" id="pilihan-paket" aria-labelledby="ab-packages-title">
          <div className="ab-container">
            <div className="ab-section-heading">
              <span className="ab-eyebrow is-center">PILIHAN PAKET</span>
              <h2 id="ab-packages-title">Pilih Paket Sesuai Jumlah Tamu</h2>
              <p>Pilihan paket dapat disesuaikan dengan kebutuhan keluarga maupun kelompok selama menginap di Green Hero Darajat.</p>
            </div>
            <div className="ab-packages-grid">
              {chickenCategory.packages.map((pkg, idx) => (
                <article key={pkg.id} className={`ab-package-card${pkg.popular ? " is-popular" : ""}`}>
                  {pkg.popular && (
                    <div className="ab-popular-badge" aria-label="Paling populer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--gold)" }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      PALING POPULER
                    </div>
                  )}
                  <div className="ab-package-capacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    {pkg.capacity}
                  </div>
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className="ab-package-price">
                    <div className="ab-price-row">
                      <strong>Rp{pkg.price.toLocaleString("id-ID")}</strong>
                      <span>/ paket</span>
                    </div>
                  </div>
                  <span className="ab-inclusions-label">Termasuk Dalam Paket:</span>
                  <ul className="ab-inclusions" aria-label={`Inklusi ${pkg.name}`}>
                    {pkg.inclusions.map((inc, i) => (
                      <li key={inc} className={`ab-inclusion-item${i === 0 ? " is-featured" : ""}`}>
                        <CheckCircle2 size={14} />{inc}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="ab-packages-note" role="note">
              <Info size={20} />
              <p>Harga dapat berubah mengikuti jumlah tamu, pilihan menu pendamping, dan kebutuhan penyajian. Ketersediaan paket mengikuti reservasi kamar atau villa di Green Hero Darajat.</p>
            </div>
          </div>
        </section>

        {/* ── 4. PENDAMPING FAVORIT ─────────────────────── */}
        <section className="ab-pendamping" aria-labelledby="ab-pendamping-title">
          <div className="ab-container">
            <div className="ab-section-heading">
              <span className="ab-eyebrow is-center">KOMPOSISI SAJIAN MEJA</span>
              <h2 id="ab-pendamping-title">Lengkap dengan Pendamping Favorit</h2>
              <p>Setiap sajian disiapkan secara higienis menggunakan bahan lokal segar lereng Pasirwangi Garut.</p>
            </div>
            <div className="ab-pendamping-grid">
              {pendampings.map((item) => (
                <div key={item.title} className="ab-pendamping-card">
                  <div className="ab-pendamping-icon" aria-hidden="true">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. CINEMATIC BREAK ───────────────────────── */}
        <section className="ab-cinematic" aria-labelledby="ab-cinematic-title">
          <Image src="/images/kambing-guling.webp" alt="Suasana makan malam outdoor di pegunungan Darajat yang berkabut" fill sizes="100vw" className="ab-cinematic-image" />
          <div className="ab-cinematic-overlay" aria-hidden="true" />
          <div className="ab-cinematic-content">
            <svg className="ab-cinematic-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <blockquote id="ab-cinematic-title">&ldquo;Rasa Nusantara di Sejuknya Darajat&rdquo;</blockquote>
            <p>Duduk bersama menikmati kehangatan bumbu tradisional di tengah panorama alam 1.800 mdpl.</p>
          </div>
        </section>

        {/* ── 6. TAMBAHKAN SESUAI SELERA ───────────────── */}
        <section className="ab-addons" aria-labelledby="ab-addons-title">
          <div className="ab-container">
            <div className="ab-section-heading">
              <span className="ab-eyebrow is-center">PELENGKAP TAMBAHAN</span>
              <h2 id="ab-addons-title">Tambahkan Sesuai Selera</h2>
              <p>Tersedia sebagai tambahan untuk menyempurnakan hidangan keluarga Anda.</p>
            </div>
            <div className="ab-addons-grid">
              {addons.map((addon) => (
                <div key={addon.label} className="ab-addon-row">
                  <div className="ab-addon-left">
                    <div className="ab-addon-icon" aria-hidden="true">{addon.icon}</div>
                    <div><strong>{addon.label}</strong><span>{addon.sub}</span></div>
                  </div>
                  <span className="ab-addon-tag">Tersedia sebagai tambahan</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. CARA PESAN ─────────────────────────────── */}
        <section className="ab-how-to" id="cara-pesan" aria-labelledby="ab-howto-title">
          <div className="ab-container">
            <div className="ab-section-heading">
              <span className="ab-eyebrow is-center">PROSES SEDERHANA</span>
              <h2 id="ab-howto-title">Langkah Pemesanan Ayam Bakar</h2>
              <p>Tiga tahapan ringkas untuk menikmati hidangan hangat khas pegunungan.</p>
            </div>
            <div className="ab-steps">
              {steps.map((step) => (
                <div key={step.number} className="ab-step">
                  <span className="ab-step-number" aria-hidden="true">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. CTA ────────────────────────────────────── */}
        <section className="ab-cta" aria-labelledby="ab-cta-title">
          <div className="ab-container">
            <svg className="ab-cta-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>
            <h2 id="ab-cta-title">Nikmati Makan Bersama<br />di Green Hero</h2>
            <p>Pilih kamar dan tambahkan Ayam Bakar Kampung sebagai bagian dari pengalaman menginap Anda di kesejukan alam Darajat.</p>
            <div className="ab-cta-actions">
              <a href="/rooms" className="ab-cta-btn-white">Pesan Kamar Sekarang</a>
              <a href="/#experiences" className="ab-cta-btn-outline">Lihat Experiences Lainnya</a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <ExperienceFooter activeHref="/experiences/grilled-chicken" />
    </div>
  );
}
