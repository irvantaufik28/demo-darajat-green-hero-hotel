import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { normalizeExtraCounts, getNights } from "@/data/booking";
import { getRoom } from "@/data/rooms";
import { parseRoomSelection } from "@/data/roomSelection";
import BookingGuestPage from "./BookingGuestPage";
import "../extras/booking.css";
import "./guest.css";

export const metadata: Metadata = {
  title: "Data Tamu | Green Hero Darajat",
  description: "Lengkapi data pemesan untuk reservasi Green Hero Darajat.",
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
  const validDates = getNights(checkIn, checkOut) > 0;
  const counts = normalizeExtraCounts(params);

  return (
    <BookingGuestPage
      roomId={room.id}
      roomSelection={roomSelection}
      checkIn={validDates ? checkIn : "2026-10-18"}
      checkOut={validDates ? checkOut : "2026-10-20"}
      guests={params.guests ?? "2 Dewasa, 1 Anak"}
      counts={counts}
    />
  );
}
