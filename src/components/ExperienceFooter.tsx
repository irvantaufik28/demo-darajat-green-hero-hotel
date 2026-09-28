import { Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "@/components/Brand";
import styles from "./ExperienceFooter.module.css";

const navigationLinks = [
  { label: "Tentang Kami", href: "/#about" },
  { label: "Kamar & Suite", href: "/rooms" },
  { label: "Fasilitas", href: "/facilities" },
  { label: "Galeri", href: "/gallery" },
  { label: "Kontak & Bantuan", href: "/contact" },
  { label: "Cek Reservasi", href: "/reservation-check" },
];

const experienceLinks = [
  { label: "Kambing Guling", href: "/experiences/roast-goat" },
  { label: "BBQ & Grill", href: "/experiences/bbq-grill" },
  { label: "Ayam Bakar Family Set", href: "/experiences/grilled-chicken" },
  { label: "Birthday Celebration", href: "/experiences/birthday-celebration" },
  { label: "Anniversary Setup", href: "/experiences/anniversary-setup" },
];

export function ExperienceFooter({ activeHref }: { activeHref: string }) {
  return (
    <footer className={`${styles.footer} theme-footer`} aria-label="Footer">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.about}>
            <Brand href="/" />
            <p>Resort ramah keluarga di dataran tinggi Darajat, Garut. Nikmati panorama pegunungan, air panas alami, dan kehangatan momen bersama orang terkasih.</p>
            <div className={styles.hours}>
              <span><strong>Front Desk</strong>24 jam setiap hari</span>
              <span><strong>Restoran & Dining</strong>06:00 – 22:00 WIB</span>
              <span><strong>Layanan Experiences</strong>Berdasarkan reservasi</span>
            </div>
          </div>
          <nav className={styles.links} aria-label="Navigasi footer">
            <h2>Navigasi</h2>
            {navigationLinks.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <nav className={styles.links} aria-label="Experiences footer">
            <h2>Experiences</h2>
            {experienceLinks.map(({ label, href }) => (
              <a key={href} href={href} aria-current={activeHref === href ? "page" : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <div className={styles.contact}>
            <h2>Kontak & Lokasi</h2>
            <span><MapPin size={17} aria-hidden="true" />Jl. Raya Darajat KM 14, Karyamekar, Pasirwangi, Kabupaten Garut, Jawa Barat 44161</span>
            <a href="tel:+6281234567890"><Phone size={17} aria-hidden="true" />+62 812-3456-7890</a>
            <a href="mailto:halo@greenherodarajat.com"><Mail size={17} aria-hidden="true" />halo@greenherodarajat.com</a>
            <a href="/contact">Hubungi tim reservasi →</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 Green Hero Darajat Hotel & Resort. Seluruh Hak Cipta Dilindungi.</span>
          <span>Demo frontend · Data & kontak contoh</span>
        </div>
      </div>
    </footer>
  );
}
