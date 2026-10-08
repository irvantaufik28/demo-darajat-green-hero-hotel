import type { Metadata } from "next";
import RoomDetailPage from "@/features/rooms/pages/RoomDetailPage";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>;
};

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const apiBase = (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL)?.replace(/\/+$/, "");
  if (!apiBase) return { title: "Kamar | Green Hero Darajat" };
  try {
    const response = await fetch(`${apiBase}/public/rooms/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return { title: "Kamar | Green Hero Darajat" };
    const data = await response.json() as { roomType: { name: string; description: string | null } };
    return { title: `${data.roomType.name} | Green Hero Darajat`, description: data.roomType.description ?? undefined };
  } catch {
    return { title: "Kamar | Green Hero Darajat" };
  }
}

export default async function Page({ params, searchParams }: DetailPageProps) {
  const { slug } = await params;
  const dates = await searchParams;
  return <RoomDetailPage slug={slug} initialCheckIn={dates.checkIn ?? ""} initialCheckOut={dates.checkOut ?? ""} />;
}
