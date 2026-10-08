import type { Metadata } from "next";
import { getNights } from "@/features/booking/constants/booking-data";
import RoomsPage from "@/features/rooms/pages/RoomsPage";

export const metadata: Metadata = {
  title: "Kamar & Suite | Green Hero Darajat",
  description: "Pilih beberapa tipe dan jumlah kamar dalam satu booking di Green Hero Darajat.",
};

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const params = Object.fromEntries(Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const dateParts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const dateValue = (type: string) => dateParts.find((part) => part.type === type)?.value ?? "";
  const today = `${dateValue("year")}-${dateValue("month")}-${dateValue("day")}`;
  const tomorrow = new Date(`${today}T00:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const validDates = (params.checkIn ?? "") >= today && getNights(params.checkIn ?? "", params.checkOut ?? "") > 0;
  return <RoomsPage initialSelection={[]} initialCheckIn={validDates ? params.checkIn! : today} initialCheckOut={validDates ? params.checkOut! : tomorrow.toISOString().slice(0, 10)} initialMinDate={today} initialGuests={params.guests ?? "2 Dewasa"} initialRoomType={params.roomTypeId ?? "all"} />;
}
