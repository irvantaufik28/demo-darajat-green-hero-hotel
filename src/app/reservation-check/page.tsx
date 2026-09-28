import type { Metadata } from "next";
import ReservationCheckPage from "./ReservationCheckPage";
import "./reservation-check.css";

export const metadata: Metadata = {
  title: "Cek Status Reservasi | Green Hero Darajat",
  description: "Lihat status dan detail reservasi, informasi penginapan, serta ringkasan pembayaran Green Hero Darajat.",
};

export default function Page() {
  return <ReservationCheckPage />;
}
