import type { Metadata } from "next";
import BirthdayCelebrationPage from "@/features/experiences/components/BirthdayCelebrationPage";

export const metadata: Metadata = {
  title: "Birthday Celebration Experience | Green Hero Darajat",
  description:
    "Rayakan momen spesial bersama keluarga di dataran tinggi Darajat. Pilih paket Birthday Celebration Green Hero — hangat, sederhana, dan berkesan.",
};

export default function Page() {
  return <BirthdayCelebrationPage />;
}
