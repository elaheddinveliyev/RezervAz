import type { BusinessSettings } from "@/lib/types";

export type PublicBookingTheme = {
  accentColors: string[];
  buttonBackground: string;
  buttonText: string;
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  contactBackground: string;
  emptyBorder: string;
  iconBackground: string;
  iconText: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  label: string;
  muted: string;
  pageBackground: string;
  softBackground: string;
  text: string;
};

export function getPublicBookingTheme(
  business: BusinessSettings,
): PublicBookingTheme {
  const slug = business.publicSlug.toLowerCase();

  if (slug.includes("laliga")) {
    return {
      accentColors: ["#4b145c", "#38bdf8", "#facc15", "#f97316", "#22c55e"],
      buttonBackground: "#4b145c",
      buttonText: "#ffffff",
      cardBackground: "rgba(10, 15, 18, 0.94)",
      cardBorder: "rgba(119, 46, 139, 0.48)",
      cardShadow: "0 24px 70px rgba(0, 0, 0, 0.28)",
      contactBackground: "rgba(11, 17, 20, 0.9)",
      emptyBorder: "rgba(119, 46, 139, 0.55)",
      iconBackground: "#4b145c",
      iconText: "#ffffff",
      inputBackground: "#080d10",
      inputBorder: "rgba(148, 163, 184, 0.48)",
      inputText: "#f8fafc",
      label: "#f8fafc",
      muted: "#cbd5e1",
      pageBackground:
        "linear-gradient(135deg, #080d10 0%, #10171a 34%, #2c1036 70%, #080d10 100%)",
      softBackground: "rgba(75, 20, 92, 0.28)",
      text: "#f8fafc",
    };
  }

  if (slug.includes("qgc")) {
    return {
      accentColors: ["#f59e0b", "#111827", "#22c55e"],
      buttonBackground: "#f59e0b",
      buttonText: "#111827",
      cardBackground: "rgba(15, 23, 42, 0.94)",
      cardBorder: "rgba(245, 158, 11, 0.35)",
      cardShadow: "0 24px 70px rgba(0, 0, 0, 0.24)",
      contactBackground: "rgba(17, 24, 39, 0.92)",
      emptyBorder: "rgba(245, 158, 11, 0.45)",
      iconBackground: "#111827",
      iconText: "#f59e0b",
      inputBackground: "#020617",
      inputBorder: "rgba(148, 163, 184, 0.45)",
      inputText: "#f8fafc",
      label: "#f8fafc",
      muted: "#cbd5e1",
      pageBackground:
        "linear-gradient(135deg, #030712 0%, #111827 48%, #292524 100%)",
      softBackground: "rgba(17, 24, 39, 0.82)",
      text: "#f8fafc",
    };
  }

  return {
    accentColors: [business.primaryColor, business.secondaryColor],
    buttonBackground: business.primaryColor,
    buttonText: "#ffffff",
    cardBackground: "#ffffff",
    cardBorder: "#e2e8f0",
    cardShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
    contactBackground: "#ffffff",
    emptyBorder: "#cbd5e1",
    iconBackground: business.primaryColor,
    iconText: "#ffffff",
    inputBackground: "#ffffff",
    inputBorder: "#cbd5e1",
    inputText: "#020617",
    label: "#334155",
    muted: "#64748b",
    pageBackground: "#f8fafc",
    softBackground: "#f8fafc",
    text: "#020617",
  };
}
