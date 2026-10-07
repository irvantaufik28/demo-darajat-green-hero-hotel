import Image from "next/image";
import { ArrowRight, CheckCircle2, Info, Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "@/components/Brand";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { facilityHours, featuredFacilities, hotelServices, roomFacilities } from "@/features/facilities/constants/facilities-data";
import "../styles/facilities.css";

export default function FacilitiesPage() {
  return (
    <div className="facilities-page">
      <SiteHeader id="facilities-header" links={interiorLinks} activeHref="/facilities" homeHref="/" bookingHref="/rooms#availability" contactHref="/contact" />
      <main>
        <section className="facilities-hero" aria-labelledby="facilities-title">
          <Image src="/images/green-hero-resort-sunset.webp" alt="Green Hero Darajat, kolam air hangat, dan panorama pegunungan saat senja" fill priority sizes="100vw" />
          <div className="facilities-hero-shade" />
          <div className="facilities-hero-content"><nav aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Fasilitas</span></nav><span className="facilities-eyebrow">FASILITAS GREEN HERO</span><h1 id="facilities-title">Fasilitas untuk Menginap Lebih Nyaman</h1><p>Dari kolam air hangat hingga layanan hotel sehari-hari, Green Hero Darajat menyediakan fasilitas yang mendukung waktu menginap bersama keluarga.</p></div>
        </section>

        <div className="facilities-container facilities-highlights">
          {featuredFacilities.map((facility, index) => <section id={facility.id} key={facility.id} className={`facilities-feature${index % 2 ? " is-reversed" : ""}`} aria-labelledby={`facility-${facility.id}`}><div className="facilities-feature-photo"><Image src={facility.image} alt={facility.imageAlt} fill sizes="(max-width: 1023px) 100vw, 680px" /></div><div className="facilities-feature-copy"><span className="facilities-eyebrow">{facility.eyebrow}</span><h2 id={`facility-${facility.id}`}>{facility.title}</h2><p>{facility.description}</p><div className={`facilities-feature-list${facility.compact ? " is-compact" : ""}`}>{facility.features.map(({ icon: Icon, title, description }) => <div key={title}><span className={`facilities-feature-icon${facility.id === "dining" ? " has-background" : ""}`}><Icon size={23} /></span><div><h3>{title}</h3>{description && <p>{description}</p>}</div></div>)}</div>{facility.note && <div className="facilities-note"><Info size={19} /><p><strong>Catatan:</strong> {facility.note}</p></div>}</div></section>)}
        </div>

        <section className="facilities-services" aria-labelledby="facilities-services-title"><div className="facilities-container"><div className="facilities-section-heading is-centered"><span className="facilities-eyebrow">LAYANAN HOTEL</span><h2 id="facilities-services-title">Layanan yang Membantu Selama Menginap</h2><p>Staf kami berdedikasi menghadirkan keramahtamahan khas Jawa Barat dengan pelayanan sigap sepanjang hari.</p></div><div className="facilities-service-grid">{hotelServices.map(({ icon: Icon, title, description, note }) => <article key={title} className="facilities-service-card"><div><span className="facilities-service-icon"><Icon size={26} /></span><h3>{title}</h3><p>{description}</p></div><span className="facilities-service-note"><CheckCircle2 size={16} />{note}</span></article>)}</div></div></section>

        <section className="facilities-container facilities-room-section" aria-labelledby="facilities-room-title"><div className="facilities-section-heading"><span className="facilities-eyebrow">FASILITAS DI DALAM KAMAR</span><h2 id="facilities-room-title">Kenyamanan di Setiap Kamar</h2><p>Setiap akomodasi di Green Hero Darajat dilengkapi fasilitas standar kenyamanan tinggi untuk memastikan waktu istirahat yang tenteram.</p></div><div className="facilities-room-grid">{roomFacilities.map(({ icon: Icon, title, description, availability, limited }) => <article key={title} className="facilities-room-card"><span className="facilities-room-icon"><Icon size={23} /></span><div><h3>{title}</h3><p>{description}</p><span className={`facilities-availability${limited ? " is-limited" : ""}`}>{availability}</span></div></article>)}</div><div className="facilities-note facilities-availability-note"><Info size={22} /><p>Beberapa fasilitas dapat berbeda berdasarkan tipe kamar, periode menginap, atau kebijakan operasional hotel. Silakan periksa rincian pada detail masing-masing kamar saat melakukan reservasi.</p></div></section>

        <section className="facilities-container facilities-experiences"><div><span className="facilities-eyebrow">GREEN HERO EXPERIENCES</span><h2>Ingin Pengalaman yang Lebih Lengkap?</h2><p>Tambahkan pilihan Green Hero Experiences seperti hidangan Kambing Guling spesial, BBQ &amp; Grill malam hari, Birthday Celebration, atau Room Decoration romantis saat proses pemesanan Anda.</p><a className="button facilities-outline-button" href="/#experiences">Lihat Green Hero Experiences <ArrowRight size={18} /></a></div></section>

        <section className="facilities-booking-cta"><div className="facilities-container"><h2>Siap Menginap di Green Hero Darajat?</h2><p>Pilih tanggal menginap dan temukan kamar yang tersedia untuk liburan keluarga Anda di udara sejuk Garut.</p><div><a className="button facilities-booking-button" href="/rooms#availability">Cek Ketersediaan</a><a className="button facilities-contact-button" href="/contact">Hubungi Reservasi</a></div></div></section>
      </main>

      <footer className="facilities-footer theme-footer"><div className="facilities-container"><div className="facilities-footer-grid"><div className="facilities-footer-about"><Brand href="/" /><p>Resort pegunungan ramah keluarga dengan pemandian air panas alami belerang di kawasan dataran tinggi Darajat, Pasirwangi, Garut, Jawa Barat.</p><div className="facilities-footer-contact"><span><MapPin size={18} />Jl. Raya Darajat KM 14, Desa Karyamekar, Kec. Pasirwangi, Kabupaten Garut, Jawa Barat 44161</span><span><Phone size={18} />+62 812-2345-6789 / (0262) 540-112</span><span><Mail size={18} />reservation@greenherodarajat.com</span></div></div><div><h2>Navigasi Utama</h2><a href="/#about">Tentang Kami</a><a href="/rooms">Kamar &amp; Fasilitas</a><a href="/contact">Kebijakan Reservasi</a><a href="/#location">Panduan Rute Darajat</a><a href="/contact">Kontak &amp; Bantuan</a><a href="/contact">Kebijakan Privasi</a></div><div><h2>Jam Operasional Fasilitas</h2><div className="facilities-hours">{facilityHours.map(({ title, hours }) => <div key={title}><strong>{title}</strong><span>{hours}</span></div>)}</div></div></div><div className="facilities-footer-bottom"><span>© 2026 Green Hero Darajat Hotel &amp; Resort. Seluruh Hak Cipta Dilindungi.</span><div><a href="/contact">Syarat &amp; Ketentuan</a><a href="/contact">Kebijakan Privasi</a><a href="/">Peta Situs</a></div></div></div></footer>
    </div>
  );
}
