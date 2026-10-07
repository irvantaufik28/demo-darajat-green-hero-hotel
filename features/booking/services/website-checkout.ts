import { apiRequest } from "@/lib/api/client";
import type { GuestDraft } from "../constants/booking-data";
import { LIVE_GUEST_DRAFT_KEY, liveBookingFingerprint, type LiveRoomBooking } from "@/features/rooms/services/live-booking";

const checkoutStorageKey = "green-hero-website-checkout";

export type WebsiteReservation = {
  id: string;
  bookingCode: string;
  checkoutToken: string;
  reservationStatus: string;
  paymentStatus: string;
  paymentExpiresAt: string;
  bookingTotal: number;
  currency: "IDR";
};

export type WebsitePaymentStatus = {
  id: string;
  bookingCode: string;
  reservationStatus: string;
  paymentStatus: string;
  bookingTotal: number;
  paidAmount: number;
  remainingBalance: number;
  currency: "IDR";
  paymentExpiresAt: string | null;
  paymentSession: { status: string; expiresAt: string } | null;
};

export type WebsiteCheckout = {
  fingerprint: string;
  idempotencyKey: string;
  reservation?: WebsiteReservation;
};

export function readWebsiteGuest(booking: LiveRoomBooking): GuestDraft | null {
  try {
    const raw = sessionStorage.getItem(LIVE_GUEST_DRAFT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as { bookingKey?: string; draft?: GuestDraft };
    if (value.bookingKey !== liveBookingFingerprint(booking) || !value.draft) return null;
    const { fullName, whatsapp, email, nationality } = value.draft;
    if (!fullName?.trim() || !whatsapp?.trim() || !email?.trim() || !nationality) return null;
    return value.draft;
  } catch {
    return null;
  }
}

export function checkoutFingerprint(booking: LiveRoomBooking, guest: GuestDraft) {
  const policies = booking.allocation.map((room) => room.cancellationPolicyId ?? "default").join(",");
  return `${liveBookingFingerprint(booking)}|${policies}|${guest.fullName.trim()}|${guest.whatsapp.trim()}|${guest.email.trim()}|${guest.nationality}`;
}

export function readWebsiteCheckout(): WebsiteCheckout | null {
  try {
    const raw = sessionStorage.getItem(checkoutStorageKey);
    if (!raw) return null;
    const value = JSON.parse(raw) as WebsiteCheckout;
    return value?.fingerprint && value.idempotencyKey ? value : null;
  } catch {
    return null;
  }
}

export function saveWebsiteCheckout(value: WebsiteCheckout) {
  sessionStorage.setItem(checkoutStorageKey, JSON.stringify(value));
}

export function clearWebsiteCheckout() {
  sessionStorage.removeItem(checkoutStorageKey);
}

export function createWebsiteReservation(booking: LiveRoomBooking, guest: GuestDraft, idempotencyKey: string) {
  return apiRequest<WebsiteReservation>("reservations", {
    method: "POST",
    body: {
      checkInDate: booking.checkIn,
      checkOutDate: booking.checkOut,
      totalAdults: booking.adults,
      totalChildren: booking.children,
      rooms: booking.allocation,
      guest: {
        fullName: guest.fullName.trim(),
        phone: guest.whatsapp.trim(),
        email: guest.email.trim(),
        nationality: guest.nationality,
      },
      idempotencyKey,
    },
  });
}

export function createWebsitePaymentSession(reservation: WebsiteReservation) {
  return apiRequest<{ status: string; checkoutUrl: string | null; amount: number; expiresAt: string }>(
    `reservations/${reservation.id}/payment-session`,
    { method: "POST", bearerToken: reservation.checkoutToken },
  );
}

export function getWebsitePaymentStatus(reservation: WebsiteReservation) {
  return apiRequest<WebsitePaymentStatus>(`reservations/${reservation.id}/payment-status`, {
    bearerToken: reservation.checkoutToken,
  });
}
