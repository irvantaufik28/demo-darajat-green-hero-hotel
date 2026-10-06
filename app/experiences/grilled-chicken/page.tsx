import type { Metadata } from "next";
import GrilledChickenPage from "@/features/experiences/components/GrilledChickenPage";

export const metadata: Metadata = {
  title: "Grilled Chicken (Ayam Bakar Kampung) Experience | Green Hero Darajat",
  description:
    "Sajian ayam kampung bakar bumbu rempah khas Jawa Barat untuk keluarga dan gathering selama menginap di Green Hero Darajat, Pasirwangi, Garut.",
};

export default function Page() {
  return <GrilledChickenPage />;
}
