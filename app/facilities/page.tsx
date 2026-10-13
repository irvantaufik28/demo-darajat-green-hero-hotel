import type { Metadata } from "next";
import FacilitiesPage from "@/features/facilities/pages/FacilitiesPage";

export const metadata: Metadata = {
  title: "Fasilitas | Hotel Darajat Pass",
  description: "Jelajahi kolam air panas, restoran, fasilitas keluarga, dan layanan Hotel Darajat Pass untuk menginap lebih nyaman.",
};

export default function Page() {
  return <FacilitiesPage />;
}
