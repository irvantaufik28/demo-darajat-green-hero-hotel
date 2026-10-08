import type { RoomSelection } from "../constants/room-selection-data";
import type { PublicRoom, RoomAvailability } from "../services/public-rooms";

export function allocateGuests(
  rooms: { roomType: PublicRoom; quantity: number }[],
  adults: number,
  children: number,
) {
  const units = rooms.flatMap(({ roomType, quantity }) => Array.from({ length: quantity }, () => roomType));
  const memo = new Set<string>();
  function assign(index: number, remainingAdults: number, remainingChildren: number): { roomTypeId: string; adults: number; children: number }[] | null {
    if (index === units.length) return remainingAdults === 0 && remainingChildren === 0 ? [] : null;
    const key = `${index}:${remainingAdults}:${remainingChildren}`;
    if (memo.has(key)) return null;
    for (const pattern of units[index].capacityPatterns) {
      if (pattern.extraBeds > 0 || pattern.adults + pattern.children === 0) continue;
      if (pattern.adults > remainingAdults || pattern.children > remainingChildren) continue;
      const rest = assign(index + 1, remainingAdults - pattern.adults, remainingChildren - pattern.children);
      if (rest) return [{ roomTypeId: units[index].id, adults: pattern.adults, children: pattern.children }, ...rest];
    }
    memo.add(key);
    return null;
  }
  return assign(0, adults, children);
}

type PlanState = { adults: number; children: number; roomCount: number; includesTarget: boolean; counts: number[] };

function findPlan(items: RoomAvailability[], adults: number, children: number, targetId: string): RoomSelection | null {
  const initial: PlanState = { adults: 0, children: 0, roomCount: 0, includesTarget: false, counts: items.map(() => 0) };
  let states = new Map<string, PlanState>([["0:0:0", initial]]);
  for (const [index, item] of items.entries()) {
    const patterns = item.roomType.capacityPatterns.filter((pattern) => pattern.extraBeds === 0 && pattern.adults + pattern.children > 0);
    for (let unit = 0; unit < Math.min(item.availableRooms, 20); unit += 1) {
      const next = new Map(states);
      for (const state of states.values()) {
        if (state.roomCount >= 20) continue;
        for (const pattern of patterns) {
          const nextAdults = state.adults + pattern.adults;
          const nextChildren = state.children + pattern.children;
          if (nextAdults > adults || nextChildren > children) continue;
          const includesTarget = state.includesTarget || item.roomType.id === targetId;
          const key = `${nextAdults}:${nextChildren}:${Number(includesTarget)}`;
          const existing = next.get(key);
          if (existing && existing.roomCount <= state.roomCount + 1) continue;
          const counts = [...state.counts];
          counts[index] += 1;
          next.set(key, { adults: nextAdults, children: nextChildren, roomCount: state.roomCount + 1, includesTarget, counts });
        }
      }
      states = next;
    }
  }
  const plan = states.get(`${adults}:${children}:1`);
  return plan ? items.flatMap((item, index) => plan.counts[index] > 0 ? [{ roomId: item.roomType.id, quantity: plan.counts[index] }] : []) : null;
}

export function suggestRoomSelection(availability: RoomAvailability[], adults: number, children: number, targetId: string): RoomSelection | null {
  const eligible = availability.filter((item) => item.bookable && item.availableRooms > 0 && item.roomType.capacityPatterns.some((pattern) => pattern.extraBeds === 0 && pattern.adults + pattern.children > 0));
  const target = eligible.find((item) => item.roomType.id === targetId);
  if (!target || adults + children < 1) return null;
  const direct = findPlan([target], adults, children, targetId);
  const mixed = findPlan([target, ...eligible.filter((item) => item.roomType.id !== targetId)], adults, children, targetId);
  const count = (selection: RoomSelection) => selection.reduce((total, item) => total + item.quantity, 0);
  return mixed && (!direct || count(mixed) < count(direct)) ? mixed : direct;
}
