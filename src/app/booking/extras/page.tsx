import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoom } from "@/data/rooms";
import { parseRoomSelection } from "@/data/roomSelection";
import BookingExtrasPage from "./BookingExtrasPage";
import "./booking.css";

export const metadata: Metadata = {
  title: "Pilihan Tambahan | Green Hero Darajat",
  description: "Lengkapi pengalaman menginap Anda dengan pilihan tambahan di Green Hero Darajat.",
};

type PageProps = {
  searchParams: Promise<{ room?: string; checkIn?: string; checkOut?: string; guests?: string; rooms?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const roomSelection = parseRoomSelection(params.rooms, params.room ?? "vip");
  const room = getRoom(roomSelection[0]?.roomId ?? "");
  if (!room || !room.available) notFound();

  return (
    <BookingExtrasPage
      roomId={room.id}
      roomSelection={roomSelection}
      initialCheckIn={params.checkIn ?? ""}
      initialCheckOut={params.checkOut ?? ""}
      initialGuests={params.guests ?? ""}
    />
  );
}
