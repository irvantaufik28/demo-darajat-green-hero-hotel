import { apiRequest } from "../../../lib/api/client";

// Look up a reservation by its booking code for the public reservation-check page.
export function getReservationByCode(code: string, signal?: AbortSignal) {
  return apiRequest<{ reservation: unknown; total: number }>(
    `reservations/${encodeURIComponent(code)}`,
    { signal },
  );
}
