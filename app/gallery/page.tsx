import type { Metadata } from "next";
import GalleryPage from "@/features/gallery/pages/GalleryPage";

export const metadata: Metadata = {
  title: "Galeri | Hotel Darajat Pass",
  description: "Jelajahi foto kamar, kolam air hangat, panorama Darajat, dan momen keluarga di Hotel Darajat Pass.",
};

export default function Page() {
  return <GalleryPage />;
}
