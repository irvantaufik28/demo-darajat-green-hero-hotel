import type { Metadata } from "next";
import WebsitePaymentSuccessPage from "@/features/booking/pages/WebsitePaymentSuccessPage";

export const metadata: Metadata = {
  title: "Status Pembayaran | Green Hero Darajat",
  description: "Lihat konfirmasi pembayaran dan ringkasan reservasi Green Hero Darajat.",
};

type Props = {
  searchParams: Promise<{ booking?: string | string[] }>;
};

export default async function Page({ searchParams }: Props) {
  const { booking } = await searchParams;
  return <WebsitePaymentSuccessPage bookingCode={typeof booking === "string" ? booking : ""} />;
}
