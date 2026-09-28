"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Info, Users } from "lucide-react";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { foodCategories } from "@/data/foodPackages";

const roastGoat = foodCategories.find((c) => c.id === "roast-goat")!;

const moments = [
  { label: "Family Dinner", emoji: "🏠" },
  { label: "Gathering", emoji: "👥" },
  { label: "Birthday", emoji: "🎂" },
  { label: "Celebration", emoji: "🎉" },
];

const steps = [
  {
    number: "01",
    title: "Pilih Paket",
    description: "Sesuaikan kapasitas paket dengan jumlah tamu yang akan bersantap.",
  },
  {
    number: "02",
    title: "Tentukan Tanggal & Jam",
    description: "Pilih jadwal waktu penyajian yang paling cocok untuk acara keluarga Anda.",
  },
  {
    number: "03",
    title: "Tambahkan ke Reservasi",
    description: "Paket akan otomatis terkonfirmasi dan disiapkan hangat oleh tim kami.",
  },
];

export default function RoastGoatPage() {
  return (
    <div className="kg-page">
      <SiteHeader
        id="kg-header"
        links={interiorLinks}
        activeHref="/experiences/roast-goat"
        homeHref="/"
        bookingHref="/rooms"
        contactHref="/contact"
      />

      <main>
        {/* ── 1. HERO ──────────────────────────────────── */}
        <section className="kg-hero" aria-labelledby="kg-title">
          <Image
            src="/images/kambing-guling.webp"
            alt="Kambing guling hangat disajikan di area outdoor Green Hero Darajat"
            fill
            priority
            sizes="100vw"
            className="kg-hero-image"
          />
          <div className="kg-hero-shade" aria-hidden="true" />
          <div className="kg-hero-content">
            <div className="kg-container">
              <nav className="kg-hero-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <span>Experiences</span>
                <span>/</span>
                <span aria-current="page">Roast Goat</span>
              </nav>
              <div className="kg-hero-badge">GREEN HERO EXPERIENCES</div>
              <h1 id="kg-title">
                Kambing Guling<br />
                untuk Momen Bersama
              </h1>
              <p>
                Nikmati sajian kambing guling hangat untuk melengkapi waktu bersama keluarga,
                sahabat, maupun acara spesial selama berada di Green Hero Darajat.
              </p>
              <div className="kg-hero-actions">
                <a href="#pilihan-paket" className="kg-btn-primary button">Pilih Paket</a>
                <a href="/contact" className="kg-btn-outline button">Tanya Ketersediaan</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL ─────────────────────────────── */}
        <section className="kg-editorial" aria-labelledby="kg-editorial-title">
          <div className="kg-container">
            <div className="kg-editorial-inner">
              <div className="kg-editorial-photo">
                <Image
                  src="/images/kambing-guling.webp"
                  alt="Kambing guling disajikan dengan perlengkapan tradisional khas Sunda"
                  fill
                  sizes="(max-width: 1023px) 100vw, 580px"
                />
                <div className="kg-editorial-chip" aria-hidden="true">
                  Tradisi Kuliner Resor
                </div>
              </div>
              <div className="kg-editorial-copy">
                <span className="kg-eyebrow">KEHANGATAN TRADISI DATARAN TINGGI</span>
                <h2 id="kg-editorial-title">Sajian Hangat untuk Momen Spesial</h2>
                <p>
                  Mulai dari makan bersama keluarga hingga perayaan kecil, Kambing Guling
                  Green Hero dapat ditambahkan sebagai pengalaman khusus selama menginap.
                </p>
                <div className="kg-features">
                  <div className="kg-feature-item">
                    <div className="kg-feature-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <h3>Cocok untuk Keluarga &amp; Gathering</h3>
                      <p>Porsi dirancang pas untuk dinikmati bersama dalam suasana pegunungan yang sejuk dan hangat.</p>
                    </div>
                  </div>
                  <div className="kg-feature-item">
                    <div className="kg-feature-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h16"/><path d="M6 3v3a6 6 0 0 0 12 0V3"/><path d="M12 12v9"/><path d="M8 21h8"/></svg>
                    </div>
                    <div>
                      <h3>Disiapkan untuk Acara Anda</h3>
                      <p>Diproses dengan pendekatan tradisional dan disajikan untuk momen yang telah Anda rencanakan.</p>
                    </div>
                  </div>
                  <div className="kg-feature-item">
                    <div className="kg-feature-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></svg>
                    </div>
                    <div>
                      <h3>Tersedia Berdasarkan Reservasi</h3>
                      <p>Pengalaman ini dapat ditambahkan sesuai jadwal menginap dan ketersediaan layanan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PACKAGES ──────────────────────────────── */}
        <section className="kg-packages" id="pilihan-paket" aria-labelledby="kg-packages-title">
          <div className="kg-container">
            <div className="kg-section-heading">
              <span className="kg-eyebrow" style={{ justifyContent: "center" }}>PILIHAN PAKET</span>
              <h2 id="kg-packages-title">Pilih Sesuai Jumlah Tamu</h2>
              <p>Setiap paket dipersiapkan lengkap dengan perlengkapan saji dan bumbu pendamping khas Sunda Darajat.</p>
            </div>
            <div className="kg-packages-grid">
              {roastGoat.packages.map((pkg) => {
                const baseCount = roastGoat.packages[0].inclusions.length;
                return (
                  <article key={pkg.id} className={`kg-package-card${pkg.popular ? " is-popular" : ""}`}>
                    {pkg.popular && (
                      <div className="kg-package-popular-badge" aria-label="Paling populer">Paling Populer</div>
                    )}
                    <div className="kg-package-photo">
                      <Image src="/images/kambing-guling.webp" alt={`Paket ${pkg.name}`} fill sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                      <div className="kg-package-capacity">{pkg.capacity}</div>
                    </div>
                    <div className="kg-package-body">
                      <h3>{pkg.name}</h3>
                      <p>{pkg.description}</p>
                      <div className="kg-package-price">
                        <small>Harga Paket</small>
                        <strong>Rp{pkg.price.toLocaleString("id-ID")}</strong>
                      </div>
                      <ul className="kg-inclusions" aria-label={`Inklusi ${pkg.name}`}>
                        <li><span className="kg-inclusions-label">Inklusi:</span></li>
                        {pkg.inclusions.map((inc, idx) => (
                          <li key={inc} className={`kg-inclusion-item${idx >= baseCount ? " is-extra" : ""}`}>
                            <CheckCircle2 size={15} />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="kg-packages-note" role="note">
              <Info size={20} />
              <p><strong>Catatan:</strong> Harga dan jumlah porsi dapat menyesuaikan kebutuhan acara. Ketersediaan paket mengikuti tanggal reservasi dan operasional hotel.</p>
            </div>
          </div>
        </section>

        {/* ── 4. THE EXPERIENCE ─────────────────────────── */}
        <section className="kg-experience" aria-labelledby="kg-experience-title">
          <div className="kg-container">
            <div className="kg-experience-inner">
              <div className="kg-experience-photo-wrap">
                <div className="kg-experience-photo">
                  <Image src="/images/outdoor-dining.webp" alt="Keluarga menikmati santap bersama di area outdoor Green Hero Darajat" fill sizes="(max-width: 1023px) 100vw, 560px" />
                </div>
                <div className="kg-experience-decor" aria-hidden="true" />
              </div>
              <div className="kg-experience-copy">
                <span className="kg-eyebrow">THE EXPERIENCE</span>
                <h2 id="kg-experience-title">Bukan Hanya Menu Tambahan</h2>
                <p>Jadikan makan bersama sebagai bagian dari pengalaman menginap. Paket dapat disiapkan untuk keluarga, gathering, ulang tahun, atau momen spesial lainnya di tengah hawa dingin pegunungan Darajat.</p>
                <div className="kg-moment-grid">
                  {moments.map(({ label, emoji }) => (
                    <div key={label} className="kg-moment-item">
                      <div className="kg-moment-icon" aria-hidden="true">
                        <span style={{ fontSize: "18px" }}>{emoji}</span>
                      </div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. CARA PEMESANAN ─────────────────────────── */}
        <section className="kg-how-to" aria-labelledby="kg-howto-title">
          <div className="kg-container">
            <div className="kg-section-heading">
              <span className="kg-eyebrow" style={{ justifyContent: "center" }}>LANGKAH SEDERHANA</span>
              <h2 id="kg-howto-title">Cara Pemesanan</h2>
              <p>Green Hero Experiences dapat ditambahkan secara fleksibel selama proses booking kamar berlangsung.</p>
            </div>
            <div className="kg-steps">
              {steps.map((step) => (
                <div key={step.number} className="kg-step">
                  <div className="kg-step-number" aria-hidden="true">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. CTA ────────────────────────────────────── */}
        <section className="kg-cta" id="hubungi-kami" aria-labelledby="kg-cta-title">
          <div className="kg-container">
            <div className="kg-cta-inner">
              <span className="kg-eyebrow">TAMBAHKAN KE PENGALAMAN ANDA</span>
              <h2 id="kg-cta-title">Tambahkan ke Pengalaman<br />Menginap Anda</h2>
              <p>Pilih kamar terlebih dahulu, kemudian tambahkan Kambing Guling pada tahap Pilihan Tambahan saat proses reservasi online.</p>
              <div className="kg-cta-actions">
                <a href="/rooms" className="kg-cta-btn-white">Pesan Kamar</a>
                <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="kg-cta-btn-light">Cek Ketersediaan via WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <ExperienceFooter activeHref="/experiences/roast-goat" />
    </div>
  );
}
