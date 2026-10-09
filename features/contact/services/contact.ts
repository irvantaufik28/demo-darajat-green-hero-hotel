import { apiRequest } from "../../../lib/api/client";

export type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactMessageResult = { ok: boolean; reference?: string };

export type PublicHotelInfo = {
  name: string;
  address: string;
  district: string | null;
  city: string;
  province: string;
  postalCode: string | null;
  googleMapsUrl: string | null;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  email: string | null;
};

export function getPublicHotelInfo(signal?: AbortSignal) {
  return apiRequest<{ hotel: PublicHotelInfo }>("hotel-info", { signal });
}

// Submit a contact-form message to the public API.
export function submitContactMessage(body: ContactMessageInput) {
  return apiRequest<ContactMessageResult>("contact", { method: "POST", body });
}
