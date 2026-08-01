import {
  type BusinessType,
  type DemoPreset,
  type ReservationStatus,
  type WeekDay,
  businessTypes,
  demoPresets,
  reservationStatuses,
  weekDays,
} from "@/lib/types";

export function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function weekDayValues(formData: FormData) {
  const allowed = new Set(weekDays.map((day) => day.value));
  const values = formData
    .getAll("workingDays")
    .map(String)
    .filter((value): value is WeekDay => allowed.has(value as WeekDay));

  return values.length
    ? values
    : (["monday", "tuesday", "wednesday", "thursday", "friday"] satisfies WeekDay[]);
}

export function businessTypeValue(formData: FormData) {
  const value = textValue(formData, "businessType") as BusinessType;
  return businessTypes.includes(value) ? value : "clinic";
}

export function statusValue(formData: FormData) {
  const value = textValue(formData, "status") as ReservationStatus;
  return reservationStatuses.includes(value) ? value : "pending";
}

export function demoPresetValue(formData: FormData) {
  const value = textValue(formData, "preset") as DemoPreset;
  return demoPresets.includes(value) ? value : "clinic";
}

export function redirectWithToast(path: string, params: Record<string, string>) {
  const url = new URL(path, "http://rezervaz.local");

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return `${url.pathname}?${url.searchParams.toString()}`;
}

// Sanitize user input to prevent XSS
// Removes HTML tags and escapes special characters
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, (char) => (char === "<" ? "<" : ">"))
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

// Validate phone number in E.164 format (+[country code][number])
export function validatePhoneE164(phone: string): boolean {
  // E.164 format: + followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

// Normalize phone to E.164 format (adds + if missing, removes spaces)
export function normalizePhoneE164(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return "+" + cleaned.slice(2);
  // Assume Azerbaijan if no country code (for local numbers)
  if (cleaned.startsWith("994")) return "+" + cleaned;
  return "+" + cleaned;
}
