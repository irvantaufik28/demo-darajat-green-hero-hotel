import type { Metadata } from "next";
import ContactPage from "@/features/contact/pages/ContactPage";

export const metadata: Metadata = {
  title: "Hubungi Kami | Green Hero Darajat",
  description: "Hubungi tim Green Hero Darajat untuk informasi kamar, reservasi, fasilitas, dan panduan lokasi di kawasan Darajat Pass, Garut.",
};

export default function Page() {
  return <ContactPage />;
}
