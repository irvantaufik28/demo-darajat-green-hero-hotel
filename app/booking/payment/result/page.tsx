import type { Metadata } from "next";
import WebsitePaymentResultPage from "@/features/booking/pages/WebsitePaymentResultPage";

export const metadata: Metadata = {
  title: "Status Pembayaran | Hotel Darajat Pass",
  description: "Periksa status pembayaran reservasi Hotel Darajat Pass.",
};

type Props = {
  searchParams: Promise<{ booking?: string | string[] }>;
};

export default async function Page({ searchParams }: Props) {
  const { booking } = await searchParams;
  return <WebsitePaymentResultPage bookingCode={typeof booking === "string" ? booking : ""} />;
}
