"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/auth";
import {
  applyDemoPreset,
  createCustomer,
  createReservation,
  getBusinessSettings,
  listReservationBlocks,
  listServices,
  listStaff,
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
  validatePhoneE164,
  sanitizeInput,
  normalizePhoneE164,
  weekDayValues,
} from "@/lib/form";
import { generateSlotAvailability, todayISO, timeToMinutes } from "@/lib/time";
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

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const parsed = new Date(value + "T12:00:00Z");
  if (!validDate || Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== value) {
    throw new Error("Invalid reservation date.");
  }
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

async function requireReservationManager() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    throw new Error("Sign in to manage reservations.");
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
    const rawPhone = textValue(formData, "phone");
    const phone = validatePhoneE164(rawPhone) ? rawPhone : normalizePhoneE164(rawPhone);
    
    await createCustomer({
      fullName: requireText(textValue(formData, "fullName"), "Full name"),
      phone: requireText(phone, "Phone"),
      email: textValue(formData, "email"),
      notes: sanitizeInput(textValue(formData, "notes")),
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
    const rawPhone = textValue(formData, "phone");
    const phone = validatePhoneE164(rawPhone) ? rawPhone : normalizePhoneE164(rawPhone);
    
    await updateCustomer(id, {
      fullName: requireText(textValue(formData, "fullName"), "Full name"),
      phone: requireText(phone, "Phone"),
      email: textValue(formData, "email"),
      notes: sanitizeInput(textValue(formData, "notes")),
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
    await requireReservationManager();
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
    await requireReservationManager();
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
    await requireReservationManager();
    await deleteReservation(textValue(formData, "id"));
    revalidateApp();
  } catch (error) {
    handleActionError("/dashboard/reservations", error);
  }

  redirect("/dashboard/reservations?saved=1");
}

export async function publicBookingAction(formData: FormData) {
  try {
    const date = requireFutureDate(textValue(formData, "date"));
    const staffId = requireText(textValue(formData, "staffId"), "Staff");
    const serviceId = requireText(textValue(formData, "serviceId"), "Service");
    const startTime = requireText(textValue(formData, "startTime"), "Start time");
    const durationMinutes = Number(textValue(formData, "durationMinutes"));

    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(startTime) ||
        !Number.isInteger(durationMinutes) ||
        durationMinutes < 60 || durationMinutes > 480 ||
        durationMinutes % 60 !== 0 ||
        timeToMinutes(startTime) + durationMinutes > 1440) {
      throw new Error("Invalid booking time or duration.");
    }

    const [business, staff, services] = await Promise.all([
      getBusinessSettings(), listStaff(true), listServices(true),
    ]);
    const provider = staff.find((item) => item.id === staffId);
    const service = services.find((item) => item.id === serviceId);
    if (!provider || !service) {
      throw new Error("The selected staff member or service is unavailable.");
    }

    const reservations = await listReservationBlocks({ date, staffId });
    const allowed = generateSlotAvailability({
      business, date, durationMinutes, reservations, service, staff: provider,
    }).some((slot) => slot.isAvailable && slot.startTime === startTime);
    if (!allowed) {
      throw new Error("This time is not available. Please select another slot.");
    }

    const rawPhone = textValue(formData, "phone");
    const phone = validatePhoneE164(rawPhone) ? rawPhone : normalizePhoneE164(rawPhone);
    if (!validatePhoneE164(phone)) {
      throw new Error("Enter a valid international phone number.");
    }

    const customer = await createCustomer({
      fullName: requireText(textValue(formData, "fullName"), "Full name"),
      phone,
      email: textValue(formData, "email"),
      notes: "",
    });

    const isPs5 = service.name.toLowerCase().includes("ps5");
    await createReservation({
      customerId: customer.id,
      staffId, serviceId, date, startTime, status: "pending",
      notes: isPs5 ? "Public booking request • PS5 room" : "Public booking request • Standard room",
      source: "public", durationMinutes,
    });
    revalidateApp();
  } catch (error) {
    handleActionError("/book", error);
  }

  redirect("/book?success=1");
}
