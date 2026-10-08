"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import type { LiveRoomBooking } from "@/features/rooms/services/live-booking";
import { listRooms } from "@/features/rooms/services/public-rooms";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import "@/components/booking-room-selection.css";

type RoomImage = { url: string; altText: string };
let roomImagesRequest: Promise<Record<string, RoomImage>> | null = null;

export function LiveBookingRoomSelection({ booking, nights }: { booking: LiveRoomBooking; nights: number }) {
  const { t } = useTranslations({ en, id });
  const [fetchedImages, setFetchedImages] = useState<Record<string, RoomImage>>({});

  useEffect(() => {
    if (booking.quote.rooms.every((room) => booking.roomImages?.[room.roomTypeId])) return;
    let active = true;
    roomImagesRequest ??= listRooms().then(({ items }) => Object.fromEntries(items.map((room) => {
      const cover = room.images.find((image) => image.isCover) ?? room.images[0];
      return [room.id, { url: cover?.url ?? "/images/room-standard-new.webp", altText: cover?.altText ?? room.name }];
    }))).catch((error) => { roomImagesRequest = null; throw error; });
    roomImagesRequest.then((images) => { if (active) setFetchedImages(images); }).catch(() => {});
    return () => { active = false; };
  }, [booking]);

  const grouped = new Map<string, { name: string; quantity: number; total: number }>();
  for (const room of booking.quote.rooms) {
    const item = grouped.get(room.roomTypeId) ?? { name: room.roomTypeName, quantity: 0, total: 0 };
    item.quantity += 1;
    item.total += room.baseAmount - room.discountAmount;
    grouped.set(room.roomTypeId, item);
  }

  return <div className="booking-room-selection">{[...grouped].map(([roomTypeId, item]) => {
    const image = booking.roomImages?.[roomTypeId] ?? fetchedImages[roomTypeId];
    return <div className="booking-room-selection-row" key={roomTypeId}><Image className="booking-room-selection-photo" src={image?.url ?? "/images/room-standard-new.webp"} alt={image?.altText ?? item.name} width={56} height={56} unoptimized /><div className="booking-room-selection-details"><strong>{item.name}</strong><span>{t("extras.live.roomNightLine", { count: item.quantity, nights })}</span></div><b>{formatRoomPrice(item.total)}</b></div>;
  })}</div>;
}
