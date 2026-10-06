export const galleryCategories = [
  { id: "all", label: "Semua" },
  { id: "rooms", label: "Kamar" },
  { id: "pools", label: "Kolam Air Hangat" },
  { id: "resort", label: "Area Hotel" },
  { id: "dining", label: "Dining" },
  { id: "experiences", label: "Family & Experience" },
  { id: "landscape", label: "Pemandangan" },
] as const;

export type GalleryCategoryId = (typeof galleryCategories)[number]["id"];
export type GalleryPhoto = {
  id: string;
  category: Exclude<GalleryCategoryId, "all">;
  categoryLabel: string;
  title: string;
  caption: string;
  description?: string;
  image: string;
  alt: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  { id: "thermal-pools", category: "pools", categoryLabel: "Kolam Air Hangat", title: "Kolam Air Hangat Alami Pegunungan", caption: "Sensasi Berendam Hangat di Ketinggian Garut", image: "/images/green-hero-warm-pool.webp", alt: "Tamu menikmati kolam air hangat di depan vila dengan panorama pegunungan" },
  { id: "vip-suite", category: "rooms", categoryLabel: "Kamar & Suite", title: "VIP Suite Panoramic Balcony", caption: "VIP Suite Panoramic Balcony", image: "/images/gallery-01.jpg", alt: "Interior VIP Suite berkayu hangat dengan balkon menghadap perbukitan" },
  { id: "resort-entrance", category: "resort", categoryLabel: "Area Hotel", title: "Suasana Pagi Darajat & Area Resor", caption: "Lobi & Gerbang Masuk Pegunungan", image: "/images/gallery-02.jpg", alt: "Pintu masuk dan area parkir resor di lereng pegunungan Darajat" },
  { id: "family-suite", category: "rooms", categoryLabel: "Kamar & Suite", title: "Family Suite Bunk Bed Wood Interior", caption: "Family Suite dengan Bunk Bed", description: "Kapasitas 4–6 Orang • Pemandangan Lembah", image: "/images/gallery-03.jpg", alt: "Family Suite dengan ranjang bertingkat dan interior kayu" },
  { id: "tea-landscape", category: "landscape", categoryLabel: "Pemandangan", title: "Hamparan Kebun Teh & Resor di Lereng Darajat", caption: "Lansekap Perkebunan Teh Garut", description: "Ketinggian 1.600 mdpl yang Sejuk", image: "/images/gallery-04.jpg", alt: "Panorama perkebunan teh dan resor di dataran tinggi Garut" },
  { id: "restaurant", category: "dining", categoryLabel: "Dining", title: "Restoran Pemandangan Lembah & Sarapan Tradisional", caption: "Restoran Pasirwangi & Buffet", description: "Menu Khas Sunda & Sajian Hangat", image: "/images/gallery-05.jpg", alt: "Restoran dengan hidangan sarapan tradisional dan pemandangan lembah" },
  { id: "family-garden", category: "experiences", categoryLabel: "Family & Experience", title: "Taman Bermain Anak & Ayunan Kayu Alami", caption: "Taman Rumput & Ayunan Kayu", description: "Ruang Terbuka Hijau yang Ramah Anak", image: "/images/gallery-06.jpg", alt: "Taman hijau dan ayunan kayu untuk bermain bersama keluarga" },
  { id: "standard-room", category: "rooms", categoryLabel: "Kamar & Suite", title: "Kamar Standard dengan Twin Queen Bed", caption: "Standard Twin Queen Room", description: "Lantai Kayu Hangat & Selimut Lembut", image: "/images/gallery-07.jpg", alt: "Kamar Standard dengan dua tempat tidur queen dan lantai kayu" },
  { id: "warm-pool", category: "pools", categoryLabel: "Kolam Air Hangat", title: "Kolam Air Hangat Alami 24 Jam", caption: "Kolam Rendam Sumber Air Belerang Alami", description: "Suhu Hangat Stabil Tanpa Kaporit", image: "/images/gallery-08.jpg", alt: "Kolam rendam air hangat dengan uap alami dan panorama lembah" },
  { id: "roast-goat", category: "dining", categoryLabel: "Dining", title: "Kambing Guling Utuh Tradisional Darajat", caption: "Kambing Guling Gurih Bumbu Rempah", description: "Disiapkan segar di pelataran terbuka dengan suasana api unggun malam pegunungan.", image: "/images/gallery-09.jpg", alt: "Kambing guling tradisional disiapkan oleh chef di area panggang terbuka" },
  { id: "satay-grill", category: "dining", categoryLabel: "Dining", title: "Sate Bakar Arang & Sambal Pasirwangi", caption: "Sate Ayam & Daging Bakar Arang", image: "/images/gallery-10.jpg", alt: "Sate ayam dan daging dipanggang di atas arang" },
  { id: "celebration", category: "experiences", categoryLabel: "Family & Experience", title: "Dekorasi Kamar Romantis & Ulang Tahun", caption: "Paket Dekorasi Spesial Kamar", image: "/images/gallery-11.jpg", alt: "Dekorasi perayaan di kamar hotel dengan pencahayaan hangat" },
];
