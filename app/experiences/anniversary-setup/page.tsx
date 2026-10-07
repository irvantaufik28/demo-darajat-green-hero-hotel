import type { Metadata } from "next";
import AnniversarySetupPage from "@/features/experiences/pages/AnniversarySetupPage";

export const metadata: Metadata = {
  title: "Honeymoon & Anniversary Setup | Green Hero Darajat",
  description: "Rayakan waktu berdua di Darajat dengan dekorasi personal dan romantic dining. Temukan paket Anniversary Setup Green Hero Darajat.",
};

export default function Page() {
  return <AnniversarySetupPage />;
}
