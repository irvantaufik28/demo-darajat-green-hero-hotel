"use client";

import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import type { LiveRoomBooking } from "@/features/rooms/services/live-booking";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "@/components/booking-room-selection.css";

export function LiveBookingRoomSelection({ booking, nights }: { booking: LiveRoomBooking; nights: number }) {
  const { t } = useTranslations({ en, id });
  const grouped = new Map<string, { name: string; quantity: number; total: number }>();
  for (const room of booking.quote.rooms) {
    const item = grouped.get(room.roomTypeId) ?? { name: room.roomTypeName, quantity: 0, total: 0 };
    item.quantity += 1;
    item.total += room.baseAmount - room.discountAmount;
    grouped.set(room.roomTypeId, item);
  }

  return <div className="booking-room-selection">{[...grouped].map(([roomTypeId, item]) => <div className="booking-room-selection-row" key={roomTypeId}><div><strong>{item.name}</strong><span>{t("extras.live.roomNightLine", { count: item.quantity, nights })}</span></div><b>{formatRoomPrice(item.total)}</b></div>)}</div>;
}
