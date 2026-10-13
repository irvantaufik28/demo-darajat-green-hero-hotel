import type { Metadata } from "next";
import ReservationCheckPage from "@/features/reservation-check/pages/ReservationCheckPage";

export const metadata: Metadata = {
  title: "Cek Status Reservasi | Darajat Pass",
  description: "Lihat status, detail penginapan, dan ringkasan pembayaran reservasi Darajat Pass.",
};

export default function Page() {
  return <ReservationCheckPage />;
}
