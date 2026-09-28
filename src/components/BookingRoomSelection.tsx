import { formatRoomPrice } from "@/data/rooms";
import { getSelectedRoomItems, type RoomSelection } from "@/data/roomSelection";
import "./booking-room-selection.css";

type Props = {
  selection: RoomSelection;
  nights: number;
  showPrices?: boolean;
};

export function BookingRoomSelection({ selection, nights, showPrices = true }: Props) {
  return <div className="booking-room-selection">{getSelectedRoomItems(selection).map(({ room, quantity }) => <div className="booking-room-selection-row" key={room.id}><div><strong>{room.name}</strong><span>{quantity} Kamar × {nights} Malam{showPrices && ` × ${formatRoomPrice(room.price)}`}</span></div>{showPrices && <b>{formatRoomPrice(room.price * quantity * nights)}</b>}</div>)}</div>;
}
