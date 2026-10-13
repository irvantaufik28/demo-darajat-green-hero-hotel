import type { Metadata } from "next";
import WebsitePaymentSuccessPage from "@/features/booking/pages/WebsitePaymentSuccessPage";

export const metadata: Metadata = {
  title: "Status Pembayaran | Darajat Pass",
  description: "Lihat konfirmasi pembayaran dan ringkasan reservasi Darajat Pass.",
};

type Props = {
  searchParams: Promise<{ booking?: string | string[]; demo?: string | string[] }>;
};

export default async function Page({ searchParams }: Props) {
  const { booking, demo } = await searchParams;
  return <WebsitePaymentSuccessPage bookingCode={typeof booking === "string" ? booking : ""} demoMode={demo === "1"} />;
}
