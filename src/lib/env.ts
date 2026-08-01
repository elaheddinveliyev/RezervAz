import { type DemoPreset, demoPresets } from "@/lib/types";

export type AppRole = "admin" | "staff";

export const DEMO_SESSION_COOKIE = "rezervaz_demo_role";

export function getAdminLoginPath() {
  const configured = process.env.ADMIN_LOGIN_PATH?.trim() || "/private-admin-access";
  return configured.startsWith("/") && !configured.includes("?") && !configured.includes("#")
    ? configured.replace(/\/$/, "")
    : "/private-admin-access";
}

export function isAdminIpAllowed(ip: string | undefined) {
  const allowedIps = (process.env.ADMIN_ALLOWED_IPS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return Boolean(ip && allowedIps.includes(ip));
}

export const demoUsers = [
  {
    role: "admin",
    email: "admin@rezervaz.local",
    name: "Demo Admin",
  },
  {
    role: "staff",
    email: "staff@rezervaz.local",
    name: "Demo Staff",
  },
] as const;

const demoSessionMaxAgeSeconds = 60 * 60 * 8;

function base64UrlEncode(value: Uint8Array) {
  return btoa(String.fromCharCode(...value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function demoSessionKey() {
  const secret = process.env.DEMO_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    return null;
  }

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign", "verify"],
  );
}

export async function signDemoSession(role: AppRole) {
  const key = await demoSessionKey();

  if (!key) {
    return null;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + demoSessionMaxAgeSeconds;
  const payload = `${role}.${expiresAt}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );

  return `${payload}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifyDemoSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [role, expiresAtValue, encodedSignature] = value.split(".");
  const expiresAt = Number(expiresAtValue);

  if (
    !isAppRole(role) ||
    !Number.isInteger(expiresAt) ||
    expiresAt <= Math.floor(Date.now() / 1000) ||
    !encodedSignature
  ) {
    return null;
  }

  const key = await demoSessionKey();

  if (!key) {
    return null;
  }

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(encodedSignature),
    new TextEncoder().encode(`${role}.${expiresAt}`),
  );

  return isValid ? role : null;
}

export function isAppRole(value: string | undefined): value is AppRole {
  return value === "admin" || value === "staff";
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
      key &&
      !url.includes("your-project") &&
      !key.includes("your-anon-key"),
  );
}

export function isDemoLoginEnabled() {
  return (
    process.env.DEMO_LOGIN_ENABLED === "true" &&
    Boolean(process.env.DEMO_SESSION_SECRET && process.env.DEMO_SESSION_SECRET.length >= 32)
  );
}

export function isDemoDataEnabled() {
  return process.env.DEMO_DATA_ENABLED === "true";
}

export function getDefaultDemoPreset(): DemoPreset {
  const value = process.env.DEMO_CLIENT_PRESET;

  return demoPresets.includes(value as DemoPreset)
    ? (value as DemoPreset)
    : "clinic";
}
