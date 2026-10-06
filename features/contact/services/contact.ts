import { apiRequest } from "../../../lib/api/client";

export type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactMessageResult = { ok: boolean; reference?: string };

// Submit a contact-form message to the public API.
export function submitContactMessage(body: ContactMessageInput) {
  return apiRequest<ContactMessageResult>("contact", { method: "POST", body });
}
