import type { Metadata } from "next";
import BirthdayCelebrationPage from "@/features/experiences/pages/BirthdayCelebrationPage";

export const metadata: Metadata = {
  title: "Birthday Celebration | Hotel Darajat Pass",
  description:
    "Rayakan momen spesial bersama keluarga di dataran tinggi Darajat. Pilih paket Birthday Celebration Darajat Pass yang hangat, sederhana, dan berkesan.",
};

export default function Page() {
  return <BirthdayCelebrationPage />;
}
