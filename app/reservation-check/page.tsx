import type { Metadata } from "next";
import ReservationCheckPage from "@/features/reservation-check/components/ReservationCheckPage";

export const metadata: Metadata = {
  title: "Cek Status Reservasi | Green Hero Darajat",
  description: "Lihat status dan detail reservasi, informasi penginapan, serta ringkasan pembayaran Green Hero Darajat.",
};

export default function Page() {
  return <ReservationCheckPage />;
}
