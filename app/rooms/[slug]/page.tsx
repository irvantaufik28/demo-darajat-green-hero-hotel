import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoom, rooms } from "@/features/rooms/constants/rooms-data";
import RoomDetailPage from "@/features/rooms/pages/RoomDetailPage";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>;
};

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.id }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return { title: "Kamar tidak ditemukan | Green Hero Darajat" };
  return { title: `${room.name} | Green Hero Darajat`, description: room.description };
}

export default async function Page({ params, searchParams }: DetailPageProps) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const dates = await searchParams;
  return <RoomDetailPage roomId={room.id} initialCheckIn={dates.checkIn ?? ""} initialCheckOut={dates.checkOut ?? ""} />;
}
