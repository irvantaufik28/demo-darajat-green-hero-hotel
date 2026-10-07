import type { Metadata } from "next";
import FacilitiesPage from "@/features/facilities/pages/FacilitiesPage";

export const metadata: Metadata = {
  title: "Fasilitas Resor | Green Hero Darajat",
  description: "Jelajahi kolam air panas, restoran, fasilitas keluarga, dan layanan hotel Green Hero Darajat untuk menginap lebih nyaman.",
};

export default function Page() {
  return <FacilitiesPage />;
}
