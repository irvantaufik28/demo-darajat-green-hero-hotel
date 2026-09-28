import { rooms } from "./rooms";
import { foodCategories } from "./foodPackages";

export const demoReservation = {
  code: "GH-260927-001",
  guestName: "Hendra Pratama",
  room: rooms.find((room) => room.id === "vip")!,
  grill: foodCategories.find((category) => category.id === "grill")!.packages.find((item) => item.id === "grill-highland")!,
  nights: 2,
  guests: "2 Dewasa, 1 Anak",
  checkIn: "Min, 18 Okt 2026",
  checkOut: "Sel, 20 Okt 2026",
  createdAt: "16 Okt 2026, 14:10",
  paidAt: "16 Okt 2026, 14:22",
  virtualAccount: "8271 0812 3456 7890",
};

export const demoReservationTotal = demoReservation.room.price * demoReservation.nights + demoReservation.grill.price;
