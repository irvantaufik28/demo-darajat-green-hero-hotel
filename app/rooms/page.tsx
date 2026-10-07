import type { Metadata } from "next";
import { getNights } from "@/features/booking/constants/booking-data";
import { parseRoomSelection } from "@/features/rooms/constants/room-selection-data";
import RoomsPage from "@/features/rooms/pages/RoomsPage";

export const metadata: Metadata = {
  title: "Kamar & Suite | Green Hero Darajat",
  description: "Pilih beberapa tipe dan jumlah kamar dalam satu booking di Green Hero Darajat.",
};

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const params = Object.fromEntries(Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const validDates = getNights(params.checkIn ?? "", params.checkOut ?? "") > 0;
  return <RoomsPage initialSelection={params.rooms === undefined ? [] : parseRoomSelection(params.rooms)} initialCheckIn={validDates ? params.checkIn! : "2026-10-18"} initialCheckOut={validDates ? params.checkOut! : "2026-10-20"} initialGuests={params.guests ?? "4 Dewasa (Family)"} />;
}
