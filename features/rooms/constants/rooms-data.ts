import { Bath, BedDouble, Coffee, Mountain, UsersRound, Wifi, type LucideIcon } from "lucide-react";

export type Room = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  remainingRooms: number;
  cancellationPolicy: { summary: string; description: string };
  tagline: string;
  eyebrow: string;
  badge: string;
  image: string;
  imageAlt: string;
  description: string;
  previewTag: string;
  guests: string;
  feature: string;
  amenities: { icon: LucideIcon; label: string }[];
};

const demoCancellationPolicy = {
  summary: "Pembatalan gratis hingga 3 hari sebelum check-in",
  description: "Kebijakan ini adalah contoh demo. Ketentuan setelah batas waktu pembatalan serta perubahan tanggal perlu dikonfirmasi langsung dengan hotel.",
};

export const rooms: Room[] = [
  {
    id: "standard",
    name: "Standard Room",
    price: 450000,
    available: true,
    remainingRooms: 5,
    cancellationPolicy: demoCancellationPolicy,
    tagline: "Nyaman & Asri",
    eyebrow: "HIGHLAND CLASSIC",
    badge: "Deluxe Collection · 2 Queen Beds",
    image: "/images/room-standard-new.webp",
    imageAlt: "Standard Room dengan dua tempat tidur, meja kerja, dan televisi",
    description: "Kamar berarsitektur kayu hangat dengan pemandangan perbukitan Darajat, menghadirkan relaksasi prima setelah seharian menikmati kolam air panas alami.",
    previewTag: "NYAMAN UNTUK KELUARGA KECIL",
    guests: "Hingga 4 Tamu",
    feature: "Pemandangan taman",
    amenities: [
      { icon: UsersRound, label: "Hingga 4 Tamu" },
      { icon: BedDouble, label: "2 Queen Beds" },
      { icon: Bath, label: "Akses Kolam Air Panas" },
      { icon: Wifi, label: "High-Speed Wi-Fi" },
      { icon: Bath, label: "Air Panas Alami 24 Jam" },
      { icon: Coffee, label: "Teh & Kopi Lokal" },
    ],
  },
  {
    id: "vip",
    name: "VIP Room",
    price: 850000,
    available: true,
    remainingRooms: 2,
    cancellationPolicy: demoCancellationPolicy,
    tagline: "Private Panoramic Balcony",
    eyebrow: "EXCLUSIVE RETREAT",
    badge: "Signature Suite · Balkon Privat",
    image: "/images/room-vip-new.webp",
    imageAlt: "VIP Room dengan tempat tidur besar, area duduk, dan balkon",
    description: "Kenyamanan suite premium dengan balkon pribadi berlatar kebun teh menghijau dan gulungan kabut Darajat. Tempat sempurna untuk ketenangan jiwa.",
    previewTag: "PALING DIMINATI",
    guests: "2–4 Tamu",
    feature: "Balkon pribadi",
    amenities: [
      { icon: UsersRound, label: "2–4 Tamu Eksklusif" },
      { icon: BedDouble, label: "1 King Bed" },
      { icon: Mountain, label: "Balkon Privat & Tea Mountain View" },
      { icon: Coffee, label: "Daybed Santai Kayu Jati" },
      { icon: Bath, label: "Akses Prioritas Kolam Air Panas" },
      { icon: Wifi, label: "High-Speed Dedicated Wi-Fi" },
    ],
  },
  {
    id: "family",
    name: "Family Room",
    price: 650000,
    available: true,
    remainingRooms: 3,
    cancellationPolicy: demoCancellationPolicy,
    tagline: "Kapasitas Maksimal",
    eyebrow: "FAMILY HAVEN",
    badge: "Grand Residence · Kapasitas 5 Tamu",
    image: "/images/room-family-new.webp",
    imageAlt: "Family Room dengan sofa, tempat tidur besar, dan jendela lebar",
    description: "Hunian luas berkonsep lodge pegunungan dengan area berkumpul keluarga, ranjang bertingkat berkayu jati yang aman dan ramah anak.",
    previewTag: "UNTUK KELUARGA",
    guests: "Hingga 5 Tamu",
    feature: "Ruang keluarga",
    amenities: [
      { icon: UsersRound, label: "Hingga 5 Tamu" },
      { icon: BedDouble, label: "1 King Bed + 2 Bunk Beds" },
      { icon: Coffee, label: "Living Area Keluarga" },
      { icon: Mountain, label: "Pemandangan Lembah" },
      { icon: Bath, label: "Air Panas Alami 24 Jam" },
      { icon: Coffee, label: "Sarapan & Kopi" },
    ],
  },
  {
    id: "mountain-villa",
    name: "Mountain Villa",
    price: 1250000,
    available: false,
    remainingRooms: 0,
    cancellationPolicy: demoCancellationPolicy,
    tagline: "Privat & Tenang",
    eyebrow: "MOUNTAIN ESCAPE",
    badge: "Private Villa · Hingga 6 Tamu",
    image: "/images/room-mountain-villa-new.webp",
    imageAlt: "Mountain Villa berbahan kayu dengan area bermain luar ruang",
    description: "Vila pegunungan untuk liburan yang lebih leluasa, dengan suasana privat dan panorama lembah Darajat yang menenangkan.",
    previewTag: "PRIVAT & TENANG",
    guests: "6 Tamu",
    feature: "Pemandangan lembah",
    amenities: [
      { icon: UsersRound, label: "Hingga 6 Tamu" },
      { icon: BedDouble, label: "Ruang Tidur Keluarga" },
      { icon: Mountain, label: "Pemandangan Lembah" },
      { icon: Coffee, label: "Area Bersantai Privat" },
      { icon: Bath, label: "Akses Kolam Air Panas" },
      { icon: Wifi, label: "High-Speed Wi-Fi" },
    ],
  },
  {
    id: "panorama-onsen",
    name: "Panorama Onsen Suite",
    price: 1050000,
    available: false,
    remainingRooms: 0,
    cancellationPolicy: demoCancellationPolicy,
    tagline: "Pengalaman Istimewa",
    eyebrow: "ONSEN RETREAT",
    badge: "Panorama Suite · 2 Tamu",
    image: "/images/room-panorama-onsen-new.webp",
    imageAlt: "Panorama Onsen Suite dengan tempat tidur kembar dan akses teras",
    description: "Suite dengan suasana relaksasi air hangat dan panorama Darajat, dirancang untuk waktu istirahat yang lebih intim.",
    previewTag: "PENGALAMAN ISTIMEWA",
    guests: "2 Tamu",
    feature: "Akses kolam hangat",
    amenities: [
      { icon: UsersRound, label: "Hingga 2 Tamu" },
      { icon: BedDouble, label: "1 King Bed" },
      { icon: Mountain, label: "Panorama Darajat" },
      { icon: Bath, label: "Akses Kolam Hangat" },
      { icon: Coffee, label: "Teh & Kopi Lokal" },
      { icon: Wifi, label: "High-Speed Wi-Fi" },
    ],
  },
];

export function formatRoomPrice(price: number) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function getRoom(id: string) {
  return rooms.find((room) => room.id === id);
}
