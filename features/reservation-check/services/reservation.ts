import { apiRequest } from "../../../lib/api/client";

export type PublicReservationLookup = {
  reservation: {
    bookingCode: string;
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    reservationStatus: string;
    paymentStatus: string;
    createdAt: string;
    confirmedAt: string | null;
    checkedInAt: string | null;
    checkedOutAt: string | null;
    rooms: {
      name: string;
      adults: number;
      children: number;
      bedConfiguration: string | null;
      image: { url: string; altText: string | null } | null;
    }[];
    experiences: {
      name: string;
      description: string | null;
      quantity: number;
      unitPrice: number;
      serviceDate: string | null;
    }[];
    payment: {
      bookingTotal: number;
      paidAmount: number;
      remainingBalance: number;
      currency: "IDR";
      latestTransaction: {
        method: string | null;
        provider: string | null;
        reference: string | null;
        paidAt: string | null;
        amount: number;
      } | null;
    };
    documents: { voucherAvailable: boolean; receiptAvailable: boolean };
  };
  total: number;
};

export type ReservationLookupCredentials = {
  bookingCode: string;
  contactInfo: string;
};

export function getReservationByCode(
  credentials: ReservationLookupCredentials,
  signal?: AbortSignal,
) {
  return apiRequest<PublicReservationLookup>("reservations/lookup", {
    method: "POST",
    body: credentials,
    signal,
  });
}

export async function downloadReservationDocument(
  credentials: ReservationLookupCredentials,
  type: "voucher" | "receipt",
) {
  const response = await fetch(
    `/api/v1/public/reservations/lookup/documents/${type}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    },
  );
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(
      payload?.error?.message ?? "Unable to download reservation document.",
    );
  }
  return response.blob();
}
