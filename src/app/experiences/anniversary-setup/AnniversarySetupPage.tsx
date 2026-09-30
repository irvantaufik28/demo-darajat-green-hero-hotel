import Image from "next/image";
import { ArrowRight, BedDouble, Cake, CalendarDays, Camera, CheckCircle2, ClipboardCheck, Clock3, Crown, Flower2, Heart, Info, Lamp, Mail, Moon, Palette, PenLine, Sparkles, UtensilsCrossed, Wine } from "lucide-react";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { celebrationCategories } from "@/data/celebrationPackages";
import { formatRoomPrice } from "@/data/rooms";
import styles from "./anniversary-setup.module.css";

const anniversary = celebrationCategories[1];
const highlights = [
  { title: "Dirancang untuk Berdua", description: "Setiap setup dibuat untuk menciptakan suasana yang tenang, nyaman, dan personal." },
  { title: "Detail yang Lebih Intimate", description: "Gunakan elemen floral, warm lighting, linen, dan dekorasi yang lembut." },
  { title: "Disiapkan Sesuai Reservasi", description: "Setup mengikuti tanggal menginap, preferensi tamu, dan ketersediaan hotel." },
];
const diningDetails = [
  { icon: Lamp, title: "Warm Table Lighting", description: "Lentera lilin temaram menciptakan kehangatan di udara sejuk dataran tinggi." },
  { icon: UtensilsCrossed, title: "Natural Tableware & Linen", description: "Tekstur linen alami, keramik porselen halus, dan sentuhan dedaunan segar." },
  { icon: BedDouble, title: "Intimate Balcony or Room Setup", description: "Pilihan santap malam di balkon privat kamar atau pelataran kayu terbuka." },
];
const stylingDetails = [
  { icon: Lamp, title: "Warm Candlelight & Fairy Lights", description: "Pencahayaan temaram hangat 2700K yang menenangkan dan intim." },
  { icon: Flower2, title: "Natural Flowers & Foliage", description: "Bunga putih, eucalyptus, zaitun, dan sentuhan champagne tones segar." },
  { icon: BedDouble, title: "Linen & Rustic Teak Wood", description: "Tekstur kain linen alami dan kayu jati hangat khas villa pegunungan." },
  { icon: Heart, title: "Subtle Petals & Gold Accents", description: "Aksen kelopak bunga subtil tanpa kesan berlebihan atau artifisial." },
];
const personalDetails = [
  { icon: PenLine, title: "Nama Pasangan", description: "Tertulis pada wooden sign" },
  { icon: Mail, title: "Personalized Message", description: "Kartu ucapan eksklusif tertulis" },
  { icon: CalendarDays, title: "Tanggal & Tahun Pernikahan", description: "Penanda perjalanan cinta kalian" },
  { icon: Clock3, title: "Preferred Setup Time", description: "Sebelum check-in / malam hari" },
  { icon: Cake, title: "Pesan Khusus pada Cake", description: "Pesan manis di atas artisan cake" },
  { icon: Palette, title: "Preferensi Bunga & Warna", description: "Sentuhan palet lembut selaras" },
];
const addons = [
  { icon: Cake, title: "Anniversary Cake" },
  { icon: Flower2, title: "Floral Arrangement" },
  { icon: UtensilsCrossed, title: "Romantic Dinner" },
  { icon: Wine, title: "Welcome Drinks" },
  { icon: BedDouble, title: "Room Decoration" },
  { icon: Camera, title: "Photo Corner" },
];
const steps = [
  { icon: ClipboardCheck, title: "Pilih Paket", description: "Tentukan paket perayaan yang sesuai dengan preferensi Anda dan pasangan dari 3 pilihan yang tersedia." },
  { icon: CalendarDays, title: "Tentukan Tanggal & Detail", description: "Cantumkan tanggal menginap, ucapan spesial, nama pasangan, dan waktu setup yang diinginkan saat konfirmasi." },
  { icon: CheckCircle2, title: "Tambahkan ke Reservasi", description: "Paket dikonfirmasi oleh tim guest experience dan disiapkan rapi di kamar sebelum Anda tiba di resort." },
];

export default function AnniversarySetupPage() {
  return (
    <div className={styles.page}>
      <SiteHeader links={interiorLinks} activeHref="/experiences/anniversary-setup" homeHref="/" bookingHref="/rooms" />
      <main>
        <section className={styles.hero} aria-labelledby="anniversary-title">
          <Image src="/images/anniversary-dinner-night.webp" alt="Meja makan malam romantis dengan cahaya lilin di area terbuka Green Hero Darajat" fill preload sizes="100vw" className={styles.cover} />
          <div className={styles.shade} />
          <div className={`${styles.container} ${styles.heroContent}`}>
            <span className={styles.badge}><Sparkles size={15} /> Green Hero Experiences</span>
            <h1 id="anniversary-title">Rayakan Perjalanan Kalian di Sejuknya Darajat</h1>
            <p>Waktu berdua terasa lebih istimewa dengan suasana hangat, dekorasi yang personal, dan ketenangan dataran tinggi Green Hero Darajat.</p>
            <div className={styles.actions}>
              <a className={styles.whiteButton} href="#packages">Pilih Paket</a>
              <a className={styles.outlineButton} href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer">Tanya Ketersediaan <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="anniversary-intro-title">
          <div className={`${styles.container} ${styles.split}`}>
            <div className={styles.editorialPhoto}>
              <Image src="/images/anniversary-room-decor.webp" alt="Kamar Green Hero Darajat dengan dekorasi bunga dan handuk berbentuk hati untuk anniversary" fill sizes="(max-width: 840px) 100vw, 50vw" className={styles.cover} />
              <span className={styles.photoCaption}><Heart size={15} /> Intimate Highland Suite — Suasana Hangat Berdua</span>
            </div>
            <div>
              <span className={styles.eyebrow}>A Moment for Two</span>
              <h2 id="anniversary-intro-title">Momen yang Lebih Personal untuk Dirayakan Bersama</h2>
              <p>{anniversary.description}</p>
              <div className={styles.highlights}>{highlights.map((item, index) => <div key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></div>)}</div>
              <a className={styles.textLink} href="#packages">Lihat Pilihan Paket <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`} id="packages" aria-labelledby="anniversary-packages-title">
          <div className={styles.container}>
            <div className={styles.centerHeading}><span className={styles.eyebrow}>Pilihan Paket</span><h2 id="anniversary-packages-title">Pilih Cara Merayakan Momen Kalian</h2><p>Tiga pilihan pengalaman untuk melengkapi waktu berdua selama menginap di Green Hero Darajat.</p></div>
            <div className={styles.packages}>{anniversary.packages.map((item) => <article key={item.id} className={`${styles.packageCard}${item.popular ? ` ${styles.popular}` : ""}`}>
              {item.popular && <span className={styles.popularBadge}><Crown size={14} /> Paling Populer</span>}
              <span className={styles.capacity}><Heart size={14} /> {item.capacity}</span>
              <h3>{item.name}</h3><p>{item.description}</p>
              <div className={styles.price}><strong>{formatRoomPrice(item.price)}</strong><span>/ paket</span></div>
              <ul>{item.inclusions.map((inclusion) => <li key={inclusion}><CheckCircle2 size={17} /><span>{inclusion}</span></li>)}</ul>
            </article>)}</div>
            <p className={styles.note}><Info size={18} /><span>Harga pada prototype dapat berubah mengikuti kebutuhan dekorasi, pilihan dining, dan detail personalisasi. Ketersediaan paket mengikuti reservasi dan operasional hotel.</span></p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="anniversary-dining-title">
          <div className={`${styles.container} ${styles.split}`}>
            <div><span className={styles.eyebrow}>Romantic Dining</span><h2 id="anniversary-dining-title">Makan Malam Berdua dalam Suasana yang Lebih Intimate</h2><p>Lengkapi anniversary dengan dining setup sederhana yang dirancang untuk menikmati waktu berdua tanpa suasana yang berlebihan.</p>
              <div className={styles.diningDetails}>{diningDetails.map(({ icon: Icon, title, description }) => <div className={styles.detail} key={title}><span className={styles.icon}><Icon size={20} /></span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div>
            </div>
            <div className={styles.diningPhoto}><Image src="/images/anniversary-dining.webp" alt="Meja makan malam untuk dua orang di balkon dengan panorama Darajat" fill sizes="(max-width: 840px) 100vw, 50vw" className={styles.cover} /></div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="anniversary-style-title">
          <div className={styles.container}><span className={styles.eyebrow}>Harmoni dengan Alam</span><h2 id="anniversary-style-title">Nuansa yang Selaras dengan Green Hero</h2><p className={styles.lead}>Dekorasi menggunakan pendekatan yang natural dan tenang agar tetap selaras dengan suasana pegunungan dan karakter Green Hero Darajat.</p>
            <div className={styles.styleGrid}>{stylingDetails.map(({ icon: Icon, title, description }) => <div className={styles.styleCard} key={title}><span className={styles.icon}><Icon size={22} /></span><h3>{title}</h3><p>{description}</p></div>)}</div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="anniversary-personal-title">
          <div className={styles.container}><div className={styles.personalPanel}><span className={styles.eyebrow}>Sentuhan Khusus</span><h2 id="anniversary-personal-title">Buat Lebih Personal</h2><p>Setiap kisah memiliki perjalanan unik. Anda dapat menyesuaikan detail personalisasi sebelum kedatangan:</p><div className={styles.personalGrid}>{personalDetails.map(({ icon: Icon, title, description }) => <div className={styles.detail} key={title}><Icon size={20} /><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></div></div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="anniversary-addons-title">
          <div className={styles.container}><div className={styles.centerHeading}><h2 id="anniversary-addons-title">Lengkapi Momen Kalian</h2><p>Tersedia sebagai pilihan tambahan untuk menyempurnakan hari istimewa:</p></div><div className={styles.addonGrid}>{addons.map(({ icon: Icon, title }) => <div key={title}><Icon size={24} /><h3>{title}</h3><p>Tersedia tambahan</p></div>)}</div></div>
        </section>

        <section className={styles.quiet} aria-labelledby="anniversary-quiet-title">
          <Image src="/images/anniversary-quiet.webp" alt="Suasana tenang candlelight dinner di dataran tinggi Darajat" fill sizes="100vw" className={styles.cover} /><div className={styles.shade} /><div className={`${styles.container} ${styles.quietContent}`}><Moon size={28} /><h2 id="anniversary-quiet-title">A Quiet Celebration in the Highlands</h2><p>Menikmati keheningan alam pegunungan Garut, hangatnya cahaya lilin, dan waktu berdua yang bermakna.</p></div>
        </section>

        <section className={styles.section} aria-labelledby="anniversary-order-title">
          <div className={styles.container}><div className={styles.centerHeading}><span className={styles.eyebrow}>Proses Sederhana</span><h2 id="anniversary-order-title">Cara Memesan Paket Anniversary</h2><p>Tiga langkah mudah untuk mewujudkan kejutan berkesan bagi pasangan Anda.</p></div><div className={styles.steps}>{steps.map(({ icon: Icon, title, description }, index) => <article key={title}><div><span className={styles.icon}><Icon size={23} /></span><span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div><p className={styles.orderNote}>Anniversary Setup dapat ditambahkan selama proses booking kamar dan dikonfirmasi berdasarkan ketersediaan.</p></div>
        </section>

        <section className={styles.ctaSection} aria-labelledby="anniversary-cta-title"><div className={styles.container}><div className={styles.ctaPanel}><Heart size={28} /><h2 id="anniversary-cta-title">Buat Waktu Berdua Lebih Berkesan</h2><p>Pilih kamar dan tambahkan Anniversary Setup sebagai bagian dari pengalaman menginap Anda di Green Hero Darajat.</p><div className={styles.actions}><a href="/rooms" className={styles.whiteButton}>Pesan Kamar Sekarang</a><a href="/#experiences" className={styles.outlineButton}>Lihat Experiences Lainnya</a></div></div></div></section>
      </main>
      <ExperienceFooter activeHref="/experiences/anniversary-setup" />
    </div>
  );
}
