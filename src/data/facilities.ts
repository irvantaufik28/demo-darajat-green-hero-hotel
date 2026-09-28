import { Bath, Baby, Bell, Brush, Coffee, CookingPot, Croissant, Headphones, Luggage, ParkingCircle, Refrigerator, ShowerHead, Signal, Trees, UsersRound, UtensilsCrossed, Waves, Wifi, type LucideIcon } from "lucide-react";

type FacilityFeature = { icon: LucideIcon; title: string; description?: string };
type FeaturedFacility = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  features: FacilityFeature[];
  note?: string;
  compact?: boolean;
};

export const featuredFacilities: FeaturedFacility[] = [
  {
    id: "pools", eyebrow: "REKREASI & HANGATNYA ALAM", title: "Kolam & Relaksasi",
    description: "Area kolam menjadi salah satu pengalaman utama selama menginap, cocok untuk relaksasi maupun waktu bersama keluarga di tengah sejuknya udara pegunungan Darajat.",
    image: "/images/facilities-pool.jpg", imageAlt: "Kolam air panas alami dikelilingi pepohonan dan gazebo di dataran tinggi Darajat",
    compact: true,
    features: [{ icon: Waves, title: "Outdoor swimming pool" }, { icon: Bath, title: "Warm pool (36°C – 38°C)" }, { icon: Waves, title: "Natural Hot tub" }, { icon: Baby, title: "Kids warm pool" }],
    note: "Tidak menyediakan layanan spa. Fokus murni pada kehangatan air belerang alami pegunungan.",
  },
  {
    id: "dining", eyebrow: "KULINER & SANTAP PAGI", title: "Restoran & Sarapan",
    description: "Nikmati makanan dan minuman tanpa harus meninggalkan area hotel. Pilihan sarapan hangat khas Sunda dan hidangan nusantara disajikan segar setiap pagi dengan panorama lembah berkabut.",
    image: "/images/facilities-dining.jpg", imageAlt: "Restoran resor dengan interior kayu dan jendela menghadap pegunungan",
    features: [{ icon: UtensilsCrossed, title: "Restaurant & Dining Lounge", description: "Tempat bersantap keluarga dengan view pegunungan terbuka" }, { icon: Croissant, title: "Breakfast Buffet & À La Carte", description: "Pilihan menu sarapan Nusantara, bubur lezat, dan teh hangat" }, { icon: Bell, title: "24-Hour Room Service", description: "Pengantaran hidangan panas langsung ke pintu kamar Anda" }],
  },
  {
    id: "family", eyebrow: "RAMAH KELUARGA & ANAK", title: "Nyaman untuk Keluarga",
    description: "Dirancang agar pengalaman menginap tetap nyaman untuk orang tua dan anak. Nikmati area terbuka hijau berlatar kebun teh dan kolam dangkal anak yang aman serta mudah diawasi.",
    image: "/images/facilities-family.jpg", imageAlt: "Area bermain dan taman hijau untuk keluarga di resor pegunungan",
    features: [{ icon: UsersRound, title: "Family-friendly environment", description: "Kawasan asri, bersih, dan bebas bising untuk rekreasi privat keluarga" }, { icon: Waves, title: "Kids pool kedalaman aman", description: "Air hangat bersuhu nyaman dengan kedalaman ramah anak balita" }, { icon: Trees, title: "Children-friendly open garden & seating", description: "Taman rumput luas untuk si kecil bereksplorasi secara aman" }],
  },
  {
    id: "connectivity", eyebrow: "AKSESIBILITAS & KELANCARAN", title: "Parkir & Konektivitas",
    description: "Fasilitas dasar yang membantu perjalanan tetap praktis selama berada di Darajat. Akses kendaraan mudah dengan area parkir luas di depan lobby serta koneksi internet stabil.",
    image: "/images/facilities-parking.jpg", imageAlt: "Area parkir dan pintu masuk resor yang dikelilingi pepohonan pegunungan",
    features: [{ icon: ParkingCircle, title: "Free Guest Parking", description: "Area parkir beraspal luas untuk kendaraan pribadi maupun bus pariwisata" }, { icon: Wifi, title: "Free High-Speed Wi-Fi", description: "Akses internet serat optik di seluruh area publik resort" }, { icon: Signal, title: "Wi-Fi in Rooms & Suites", description: "Konektivitas stabil di dalam setiap unit kamar untuk kenyamanan bekerja santai" }],
  },
];

export const hotelServices = [
  { icon: Headphones, title: "24-Hour Front Desk", description: "Resepsionis siaga 24 jam untuk melayani check-in terlambat, kebutuhan perlengkapan, dan panduan wisata Darajat.", note: "Siaga Setiap Hari" },
  { icon: Brush, title: "Daily Housekeeping", description: "Pembersihan kamar harian menjaga kesegaran, kehigienisan linen, dan kenyamanan maksimal ruang istirahat Anda.", note: "Jadwal Reguler & On-Request" },
  { icon: Luggage, title: "Luggage Storage", description: "Penitipan koper dan barang bawaan aman sebelum waktu check-in tiba atau setelah check-out agar bebas berwisata.", note: "Gratis untuk Tamu" },
  { icon: Bell, title: "Room Service", description: "Layanan pesan antar makanan panas, kudapan sore, serta minuman hangat langsung ke kamar atau vila Anda.", note: "Tersedia Hingga Larut Malam" },
];

export const roomFacilities = [
  { icon: Bath, title: "Private Bathroom", description: "Kamar mandi bersih dengan sanitair modern dan perlengkapan mandi lengkap.", availability: "Tersedia di semua kamar", limited: false },
  { icon: ShowerHead, title: "Shower Air Panas Alami", description: "Aliran air hangat belerang alami dari kawah Darajat yang menyegarkan tubuh.", availability: "Tersedia di semua kamar", limited: false },
  { icon: Bath, title: "Bathtub Berendam", description: "Bak mandi berendam privat untuk relaksasi maksimal dengan air hangat alami.", availability: "Kamar tertentu (VIP & Suite)", limited: true },
  { icon: Coffee, title: "Minibar & Pembuat Teh/Kopi", description: "Electric kettle, cangkir keramik, air mineral kemasan, dan pilihan teh Garut.", availability: "Tersedia di semua kamar", limited: false },
  { icon: Refrigerator, title: "Refrigerator / Kulkas", description: "Lemari es mini untuk menyimpan minuman dingin dan oleh-oleh khas Garut.", availability: "Tersedia di tipe kamar tertentu", limited: true },
  { icon: CookingPot, title: "Kitchenette / Dapur Mini", description: "Area cuci piring dan counter dapur simpel untuk kenyamanan keluarga menginap lama.", availability: "Family Villa & Penthouse", limited: true },
];

export const facilityHours = [
  { title: "Kolam Air Panas Alami", hours: "Buka 24 Jam khusus tamu menginap" },
  { title: "Restoran Sunda & Nusantara", hours: "06:00 – 22:00 WIB (Room service 24 jam)" },
  { title: "Layanan Front Desk", hours: "Siaga 24 Jam setiap hari" },
];
