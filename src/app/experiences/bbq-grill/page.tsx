import type { Metadata } from "next";
import BbqGrillPage from "./BbqGrillPage";
import "./bbq-grill.css";

export const metadata: Metadata = {
  title: "BBQ & Grill Experience | Green Hero Darajat",
  description:
    "Nikmati pengalaman BBQ & Grill bersama keluarga di area outdoor Green Hero Darajat. Pilih paket sesuai jumlah tamu, disiapkan hangat di udara sejuk pegunungan Garut.",
};

export default function Page() {
  return <BbqGrillPage />;
}
