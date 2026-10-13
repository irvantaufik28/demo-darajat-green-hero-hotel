import type { Metadata } from "next";
import BbqGrillPage from "@/features/experiences/pages/BbqGrillPage";

export const metadata: Metadata = {
  title: "BBQ & Grill | Hotel Darajat Pass",
  description:
    "Nikmati pengalaman BBQ & Grill bersama keluarga di area outdoor Darajat Pass. Pilih paket sesuai jumlah tamu, disiapkan hangat di udara sejuk pegunungan Garut.",
};

export default function Page() {
  return <BbqGrillPage />;
}
