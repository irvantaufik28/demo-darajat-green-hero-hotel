export const guestNationalities = [
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩", phoneExample: "81234567890" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾", phoneExample: "123456789" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬", phoneExample: "81234567" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺", phoneExample: "412345678" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸", phoneExample: "2025550123" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", phoneExample: "7700900123" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵", phoneExample: "9012345678" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳", phoneExample: "13800138000" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷", phoneExample: "1012345678" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳", phoneExample: "9876543210" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪", phoneExample: "15123456789" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", phoneExample: "512345678" },
] as const;

export type GuestNationalityCode = (typeof guestNationalities)[number]["code"];

export const demoGuestContact = {
  fullName: "Hendra Pratama",
  nationality: "ID" as GuestNationalityCode,
  whatsapp: "81234567890",
  email: "hendra.pratama@example.com",
};

export function getGuestNationality(code: unknown) {
  return guestNationalities.find((country) => country.code === code) ?? guestNationalities[0];
}

export function normalizeLocalWhatsapp(value: string, dialCode: string) {
  let digits = value.replace(/\D/g, "");
  const prefix = dialCode.slice(1);
  if (value.trim().startsWith("+") && digits.startsWith(prefix)) digits = digits.slice(prefix.length);
  return digits.replace(/^0+/, "");
}
