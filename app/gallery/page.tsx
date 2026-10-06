import type { Metadata } from "next";
import GalleryPage from "@/features/gallery/components/GalleryPage";

export const metadata: Metadata = {
  title: "Galeri Resor | Green Hero Darajat",
  description: "Jelajahi foto kamar, kolam air hangat, panorama Darajat, dan momen keluarga di Green Hero Darajat Hotel & Resort.",
};

export default function Page() {
  return <GalleryPage />;
}
