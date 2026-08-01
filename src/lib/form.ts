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
