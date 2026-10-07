import type { Metadata } from "next";
import RoastGoatPage from "@/features/experiences/pages/RoastGoatPage";

export const metadata: Metadata = {
  title: "Roast Goat (Kambing Guling) Experience | Green Hero Darajat",
  description:
    "Nikmati sajian kambing guling hangat untuk momen bersama keluarga, sahabat, dan acara spesial selama menginap di Green Hero Darajat, Garut.",
};

export default function Page() {
  return <RoastGoatPage />;
}
