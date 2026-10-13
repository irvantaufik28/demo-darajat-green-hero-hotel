import type { Metadata } from "next";
import ContactPage from "@/features/contact/pages/ContactPage";

export const metadata: Metadata = {
  title: "Hubungi Kami | Hotel Darajat Pass",
  description: "Hubungi tim Hotel Darajat Pass untuk informasi kamar, reservasi, fasilitas, dan panduan lokasi di kawasan Darajat, Garut.",
};

export default function Page() {
  return <ContactPage />;
}
