"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/auth";
import {
  applyDemoPreset,
  createCustomer,
  createReservation,
  createService,
  createStaff,
  deleteCustomer,
  deleteReservation,
  deleteService,
  deleteStaff,
  saveBusinessSettings,
  updateCustomer,
  updateReservation,
  updateService,
  updateStaff,
} from "@/lib/data";
import {
  DEMO_SESSION_COOKIE,
  demoUsers,
  isAppRole,
  isDemoLoginEnabled,
  isSupabaseConfigured,
  getAdminLoginPath,
  signDemoSession,
} from "@/lib/env";
import {
  businessTypeValue,
  checkboxValue,
  demoPresetValue,
  numberValue,
  redirectWithToast,
  statusValue,
  textValue,
  weekDayValues,
} from "@/lib/form";
import { todayISO } from "@/lib/time";
import { getCurrentUser } from "@/lib/auth";

function safeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "/dashboard";
  }

  if (!value.startsWith("/dashboard") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function loginErrorPath(error: "missing" | "invalid", nextPath: string) {
  const params = new URLSearchParams({ error, next: nextPath });
  return `${getAdminLoginPath()}?${params.toString()}`;
}

async function setDemoSession(role: "admin" | "staff") {
  const token = await signDemoSession(role);

  if (!token) {
    throw new Error("Demo authentication is not configured securely.");
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("next"));

  if (!email || !password || !email.includes("@")) {
    redirect(loginErrorPath("missing", nextPath));
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      redirect(nextPath);
    }
  }

  const demoUser = isDemoLoginEnabled()
    ? demoUsers.find((user) => {
        const expectedPassword =
          user.role === "admin"
            ? process.env.DEMO_ADMIN_PASSWORD
            : process.env.DEMO_STAFF_PASSWORD;
        return user.email === email && expectedPassword === password;
      })
    : null;

  if (!demoUser) {
    redirect(loginErrorPath("invalid", nextPath));
  }

  await setDemoSession(demoUser.role);

  redirect(nextPath);
}

export async function signInDemoAction(formData: FormData) {
  const role = String(formData.get("role") ?? "");
  const nextPath = safeNextPath(formData.get("next"));

  if (!isDemoLoginEnabled() || !isAppRole(role)) {
    redirect(loginErrorPath("invalid", nextPath));
  }

  await setDemoSession(role);
  redirect(nextPath);
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase?.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
  redirect(getAdminLoginPath());
}

function revalidateApp() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard/settings");
  revalidatePath("/book");
}

function handleActionError(path: string, error: unknown) {
  const message =
    error instanceof Error ? error.message : "Something went wrong.";
  redirect(redirectWithToast(path, { error: message }));
}

function requireText(value: string, label: string) {
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function requireFutureDate(value: string) {
  requireText(value, "Date");

  if (value < todayISO()) {
    throw new Error("Date cannot be in the past.");
  }

  return value;
}

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    throw new Error("Administrator access is required.");
  }
}

export async function saveBusinessSettingsAction(formData: FormData) {
  try {
    await requireAdmin();
    await saveBusinessSettings({
      businessName: requireText(textValue(formData, "businessName"), "Business name"),
      businessType: businessTypeValue(formData),
      publicSlug:
        textValue(formData, "publicSlug") ||
        textValue(formData, "businessName")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      customDomain: textValue(formData, "customDomain"),
      phone: textValue(formData, "phone"),
      address: textValue(formData, "address"),
      workingDays: weekDayValues(formData),
      workStart: textValue(formData, "workStart") || "09:00",
      workEnd: textValue(formData, "workEnd") || "18:00",
      logoUrl: textValue(formData, "logoUrl"),
      primaryColor: textValue(formData, "primaryColor") || "#0f766e",
      secondaryColor: textValue(formData, "secondaryColor") || "#14b8a6",
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/settings", error);
  }

  redirect("/dashboard/settings?saved=1");
}

export async function applyDemoPresetAction(formData: FormData) {
  await requireAdmin();
  await applyDemoPreset(demoPresetValue(formData));
  revalidateApp();
  redirect("/dashboard/settings?saved=1");
}

export async function createStaffAction(formData: FormData) {
  try {
    await requireAdmin();
    await createStaff({
      name: requireText(textValue(formData, "name"), "Name"),
      roleSpecialty: requireText(
        textValue(formData, "roleSpecialty"),
        "Role / specialty",
      ),
      phone: textValue(formData, "phone"),
      workingDays: weekDayValues(formData),
      workStart: textValue(formData, "workStart") || "09:00",
      workEnd: textValue(formData, "workEnd") || "18:00",
      active: checkboxValue(formData, "active"),
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/staff", error);
  }

  redirect("/dashboard/staff?saved=1");
}

export async function updateStaffAction(formData: FormData) {
  const id = textValue(formData, "id");

  try {
    await requireAdmin();
    await updateStaff(id, {
      name: requireText(textValue(formData, "name"), "Name"),
      roleSpecialty: requireText(
        textValue(formData, "roleSpecialty"),
        "Role / specialty",
      ),
      phone: textValue(formData, "phone"),
      workingDays: weekDayValues(formData),
      workStart: textValue(formData, "workStart") || "09:00",
      workEnd: textValue(formData, "workEnd") || "18:00",
      active: checkboxValue(formData, "active"),
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/staff", error);
  }

  redirect("/dashboard/staff?saved=1");
}

export async function deleteStaffAction(formData: FormData) {
  try {
    await requireAdmin();
    await deleteStaff(textValue(formData, "id"));
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/staff", error);
  }

  redirect("/dashboard/staff?saved=1");
}

export async function createServiceAction(formData: FormData) {
  try {
    await requireAdmin();
    await createService({
      name: requireText(textValue(formData, "name"), "Service name"),
      durationMinutes: numberValue(formData, "durationMinutes", 30),
      price: numberValue(formData, "price", 0),
      description: textValue(formData, "description"),
      active: checkboxValue(formData, "active"),
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/services", error);
  }

  redirect("/dashboard/services?saved=1");
}

export async function updateServiceAction(formData: FormData) {
  const id = textValue(formData, "id");

  try {
    await requireAdmin();
    await updateService(id, {
      name: requireText(textValue(formData, "name"), "Service name"),
      durationMinutes: numberValue(formData, "durationMinutes", 30),
      price: numberValue(formData, "price", 0),
      description: textValue(formData, "description"),
      active: checkboxValue(formData, "active"),
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/services", error);
  }

  redirect("/dashboard/services?saved=1");
}

export async function deleteServiceAction(formData: FormData) {
  try {
    await requireAdmin();
    await deleteService(textValue(formData, "id"));
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/services", error);
  }

  redirect("/dashboard/services?saved=1");
}

export async function createCustomerAction(formData: FormData) {
  try {
    await requireAdmin();
    await createCustomer({
      fullName: requireText(textValue(formData, "fullName"), "Full name"),
      phone: requireText(textValue(formData, "phone"), "Phone"),
      email: textValue(formData, "email"),
      notes: textValue(formData, "notes"),
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/customers", error);
  }

  redirect("/dashboard/customers?saved=1");
}

export async function updateCustomerAction(formData: FormData) {
  const id = textValue(formData, "id");

  try {
    await requireAdmin();
    await updateCustomer(id, {
      fullName: requireText(textValue(formData, "fullName"), "Full name"),
      phone: requireText(textValue(formData, "phone"), "Phone"),
      email: textValue(formData, "email"),
      notes: textValue(formData, "notes"),
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/customers", error);
  }

  redirect("/dashboard/customers?saved=1");
}

export async function deleteCustomerAction(formData: FormData) {
  try {
    await requireAdmin();
    await deleteCustomer(textValue(formData, "id"));
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/customers", error);
  }

  redirect("/dashboard/customers?saved=1");
}

export async function createReservationAction(formData: FormData) {
  try {
    await createReservation({
      customerId: requireText(textValue(formData, "customerId"), "Customer"),
      staffId: requireText(textValue(formData, "staffId"), "Staff"),
      serviceId: requireText(textValue(formData, "serviceId"), "Service"),
      date: requireFutureDate(textValue(formData, "date")),
      startTime: requireText(textValue(formData, "startTime"), "Start time"),
      status: statusValue(formData),
      notes: textValue(formData, "notes"),
      source: "admin",
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/reservations", error);
  }

  redirect("/dashboard/reservations?saved=1");
}

export async function updateReservationAction(formData: FormData) {
  const id = textValue(formData, "id");

  try {
    await updateReservation(id, {
      customerId: requireText(textValue(formData, "customerId"), "Customer"),
      staffId: requireText(textValue(formData, "staffId"), "Staff"),
      serviceId: requireText(textValue(formData, "serviceId"), "Service"),
      date: requireText(textValue(formData, "date"), "Date"),
      startTime: requireText(textValue(formData, "startTime"), "Start time"),
      status: statusValue(formData),
      notes: textValue(formData, "notes"),
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/reservations", error);
  }

  redirect("/dashboard/reservations?saved=1");
}

export async function deleteReservationAction(formData: FormData) {
  try {
    await deleteReservation(textValue(formData, "id"));
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/reservations", error);
  }

  redirect("/dashboard/reservations?saved=1");
}

export async function publicBookingAction(formData: FormData) {
  try {
    const customer = await createCustomer({
      fullName: requireText(textValue(formData, "fullName"), "Full name"),
      phone: requireText(textValue(formData, "phone"), "Phone number"),
      email: textValue(formData, "email"),
      notes: "",
    });

    const roomMode = textValue(formData, "roomMode");
    const modeLabel = roomMode === "ps5" ? "PS5 room" : "Standard room";

    await createReservation({
      customerId: customer.id,
      staffId: requireText(textValue(formData, "staffId"), "Staff"),
      serviceId: requireText(textValue(formData, "serviceId"), "Service"),
      date: requireFutureDate(textValue(formData, "date")),
      startTime: requireText(textValue(formData, "startTime"), "Start time"),
      status: "pending",
      notes: `Public booking request • ${modeLabel}`,
      source: "public",
      durationMinutes: Number(textValue(formData, "durationMinutes")) || undefined,
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/book", error);
  }

  redirect("/book?success=1");
}
