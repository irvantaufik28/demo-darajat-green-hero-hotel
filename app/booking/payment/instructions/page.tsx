import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { normalizeExtraCounts, getNights } from "@/features/booking/constants/booking-data";
import { getRoom } from "@/features/rooms/constants/rooms-data";
import { parseRoomSelection } from "@/features/rooms/constants/room-selection-data";
import PaymentInstructionsPage from "@/features/booking/pages/PaymentInstructionsPage";

export const metadata: Metadata = {
  title: "Instruksi Pembayaran | Green Hero Darajat",
  description: "Instruksi BCA Virtual Account dan ringkasan reservasi Green Hero Darajat.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const params = Object.fromEntries(Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const roomSelection = parseRoomSelection(params.rooms, params.room ?? "vip");
  const room = getRoom(roomSelection[0]?.roomId ?? "");
  if (!room || !room.available) notFound();

  const checkIn = params.checkIn ?? "";
  const checkOut = params.checkOut ?? "";
  const hasDates = getNights(checkIn, checkOut) > 0;
  const counts = normalizeExtraCounts(params);

  return (
    <PaymentInstructionsPage
      roomId={room.id}
      roomSelection={roomSelection}
      checkIn={hasDates ? checkIn : "2026-10-18"}
      checkOut={hasDates ? checkOut : "2026-10-20"}
      guests={params.guests ?? "2 Dewasa, 1 Anak"}
      counts={counts}
    />
  );
}
