import type { Metadata } from "next";
import RoastGoatPage from "@/features/experiences/pages/RoastGoatPage";

export const metadata: Metadata = {
  title: "Kambing Guling | Hotel Darajat Pass",
  description:
    "Nikmati sajian kambing guling hangat untuk momen bersama keluarga, sahabat, dan acara spesial selama menginap di Hotel Darajat Pass, Garut.",
};

export default function Page() {
  return <RoastGoatPage />;
}
