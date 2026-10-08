import Image from "next/image";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { getSelectedRoomItems, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import "./booking-room-selection.css";

type Props = {
  selection: RoomSelection;
  nights: number;
  showPrices?: boolean;
};

export function BookingRoomSelection({ selection, nights, showPrices = true }: Props) {
  return <div className="booking-room-selection">{getSelectedRoomItems(selection).map(({ room, quantity }) => <div className="booking-room-selection-row" key={room.id}><Image className="booking-room-selection-photo" src={room.image} alt={room.name} width={56} height={56} /><div className="booking-room-selection-details"><strong>{room.name}</strong><span>{quantity} Kamar × {nights} Malam{showPrices && ` × ${formatRoomPrice(room.price)}`}</span></div>{showPrices && <b>{formatRoomPrice(room.price * quantity * nights)}</b>}</div>)}</div>;
}
