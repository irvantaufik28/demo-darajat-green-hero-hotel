import type { Metadata } from "next";
import GrilledChickenPage from "@/features/experiences/pages/GrilledChickenPage";

export const metadata: Metadata = {
  title: "Ayam Bakar Kampung | Hotel Darajat Pass",
  description:
    "Sajian ayam kampung bakar bumbu rempah khas Jawa Barat untuk keluarga dan gathering selama menginap di Hotel Darajat Pass, Pasirwangi, Garut.",
};

export default function Page() {
  return <GrilledChickenPage />;
}
