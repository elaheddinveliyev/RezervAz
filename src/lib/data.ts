import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/auth";
import {
  addDemoReservationEndTime,
  getDemoStore,
  joinDemoReservations,
  nextDemoId,
  resetDemoStore,
} from "@/lib/demo-store";
import {
  DEMO_SESSION_COOKIE,
  isAppRole,
  isDemoDataEnabled,
  isDemoLoginEnabled,
  isSupabaseConfigured,
} from "@/lib/env";
import { addMinutesToTime, overlaps, todayISO } from "@/lib/time";
import {
  type BusinessSettings,
  type BusinessType,
  type Customer,
  type DashboardStats,
  type DemoPreset,
  type Reservation,
  type ReservationStatus,
  type ServiceItem,
  type StaffMember,
  type WeekDay,
  businessTypes,
  defaultBusinessSettings,
  reservationStatuses,
  weekDays,
} from "@/lib/types";

type BusinessSettingsRow = {
  id: string;
  business_name: string;
  business_type: BusinessType;
  public_slug: string | null;
  custom_domain: string | null;
  phone: string | null;
  address: string | null;
  working_days: WeekDay[] | null;
  work_start: string | null;
  work_end: string | null;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
};

type StaffRow = {
  id: string;
  name: string;
  role_specialty: string | null;
  phone: string | null;
  working_days: WeekDay[] | null;
  work_start: string | null;
  work_end: string | null;
  active: boolean | null;
};

type ServiceRow = {
  id: string;
  name: string;
  duration_minutes: number | null;
  price: number | null;
  description: string | null;
  active: boolean | null;
};

type CustomerRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
};

type ReservationRow = {
  id: string;
  customer_id: string;
  staff_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  notes: string | null;
  source: "admin" | "public" | null;
  created_at: string | null;
  customer?: CustomerRow | null;
  staff?: StaffRow | null;
  service?: ServiceRow | null;
};

type ReservationBlockRow = {
  id: string;
  staff_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
};

type BusinessInput = Omit<BusinessSettings, "id">;
type StaffInput = Omit<StaffMember, "id">;
type ServiceInput = Omit<ServiceItem, "id">;
type CustomerInput = Omit<Customer, "id">;
type ReservationInput = {
  customerId: string;
  staffId: string;
  serviceId: string;
  date: string;
  startTime: string;
  status: ReservationStatus;
  notes: string;
  source: "admin" | "public";
  durationMinutes?: number;
};

async function shouldUseDemoData() {
  if (isDemoDataEnabled()) {
    return true;
  }

  if (!isSupabaseConfigured()) {
    return true;
  }

  if (!isDemoLoginEnabled()) {
    return false;
  }

  const cookieStore = await cookies();
  return isAppRole(cookieStore.get(DEMO_SESSION_COOKIE)?.value);
}

function normalizeTime(value: string | null | undefined, fallback: string) {
  return (value || fallback).slice(0, 5);
}

function normalizeWeekDays(values: unknown): WeekDay[] {
  if (!Array.isArray(values)) {
    return defaultBusinessSettings.workingDays;
  }

  const allowed = new Set(weekDays.map((day) => day.value));
  return values.filter((value): value is WeekDay => allowed.has(value));
}

function mapBusiness(row: BusinessSettingsRow): BusinessSettings {
  const type = businessTypes.includes(row.business_type)
    ? row.business_type
    : defaultBusinessSettings.businessType;

  return {
    id: row.id,
    businessName: row.business_name || defaultBusinessSettings.businessName,
    businessType: type,
    publicSlug: row.public_slug ?? defaultBusinessSettings.publicSlug,
    customDomain: row.custom_domain ?? "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    workingDays: normalizeWeekDays(row.working_days),
    workStart: normalizeTime(row.work_start, defaultBusinessSettings.workStart),
    workEnd: normalizeTime(row.work_end, defaultBusinessSettings.workEnd),
    logoUrl: row.logo_url ?? "",
    primaryColor: row.primary_color ?? defaultBusinessSettings.primaryColor,
    secondaryColor: row.secondary_color ?? defaultBusinessSettings.secondaryColor,
  };
}

function mapStaff(row: StaffRow): StaffMember {
  return {
    id: row.id,
    name: row.name,
    roleSpecialty: row.role_specialty ?? "",
    phone: row.phone ?? "",
    workingDays: normalizeWeekDays(row.working_days),
    workStart: normalizeTime(row.work_start, defaultBusinessSettings.workStart),
    workEnd: normalizeTime(row.work_end, defaultBusinessSettings.workEnd),
    active: row.active ?? true,
  };
}

function mapService(row: ServiceRow): ServiceItem {
  return {
    id: row.id,
    name: row.name,
    durationMinutes: row.duration_minutes ?? 30,
    price: Number(row.price ?? 0),
    description: row.description ?? "",
    active: row.active ?? true,
  };
}

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email ?? "",
    notes: row.notes ?? "",
  };
}

function mapReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    customerId: row.customer_id,
    staffId: row.staff_id,
    serviceId: row.service_id,
    date: row.appointment_date,
    startTime: normalizeTime(row.start_time, "09:00"),
    endTime: normalizeTime(row.end_time, "09:30"),
    status: row.status,
    notes: row.notes ?? "",
    source: row.source ?? "admin",
    createdAt: row.created_at ?? new Date().toISOString(),
    customer: row.customer ? mapCustomer(row.customer) : undefined,
    staff: row.staff ? mapStaff(row.staff) : undefined,
    service: row.service ? mapService(row.service) : undefined,
  };
}

function mapReservationBlock(row: ReservationBlockRow): Reservation {
  return {
    id: row.id,
    customerId: "",
    staffId: row.staff_id,
    serviceId: "",
    date: row.appointment_date,
    startTime: normalizeTime(row.start_time, "09:00"),
    endTime: normalizeTime(row.end_time, "09:30"),
    status: row.status,
    notes: "",
    source: "admin",
    createdAt: "",
  };
}

function businessToRow(input: BusinessInput) {
  return {
    business_name: input.businessName,
    business_type: input.businessType,
    public_slug: input.publicSlug,
    custom_domain: input.customDomain || null,
    phone: input.phone,
    address: input.address,
    working_days: input.workingDays,
    work_start: input.workStart,
    work_end: input.workEnd,
    logo_url: input.logoUrl,
    primary_color: input.primaryColor,
    secondary_color: input.secondaryColor,
  };
}

function staffToRow(input: StaffInput) {
  return {
    name: input.name,
    role_specialty: input.roleSpecialty,
    phone: input.phone,
    working_days: input.workingDays,
    work_start: input.workStart,
    work_end: input.workEnd,
    active: input.active,
  };
}

function serviceToRow(input: ServiceInput) {
  return {
    name: input.name,
    duration_minutes: input.durationMinutes,
    price: input.price,
    description: input.description,
    active: input.active,
  };
}

function customerToRow(input: CustomerInput) {
  return {
    full_name: input.fullName,
    phone: input.phone,
    email: input.email || null,
    notes: input.notes,
  };
}

function reservationToRow(input: ReservationInput, endTime: string) {
  return {
    customer_id: input.customerId,
    staff_id: input.staffId,
    service_id: input.serviceId,
    appointment_date: input.date,
    start_time: input.startTime,
    end_time: endTime,
    status: input.status,
    notes: input.notes,
    source: input.source,
  };
}

export async function getBusinessSettings() {
  if (await shouldUseDemoData()) {
    return getDemoStore().business;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("business_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapBusiness(data as BusinessSettingsRow) : defaultBusinessSettings;
}

export async function saveBusinessSettings(input: BusinessInput) {
  if (await shouldUseDemoData()) {
    getDemoStore().business = {
      id: getDemoStore().business.id,
      ...input,
    };
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase!
    .from("business_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  const payload = businessToRow(input);
  const query = existing
    ? supabase!.from("business_settings").update(payload).eq("id", existing.id)
    : supabase!.from("business_settings").insert(payload);
  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }
}

export async function applyDemoPreset(mode: DemoPreset) {
  resetDemoStore(mode);
}

export async function listStaff(activeOnly = false) {
  if (await shouldUseDemoData()) {
    const staff = getDemoStore().staff;
    return activeOnly ? staff.filter((item) => item.active) : staff;
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase!.from("staff_members").select("*").order("name");

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as StaffRow[]).map(mapStaff);
}

export async function createStaff(input: StaffInput) {
  if (await shouldUseDemoData()) {
    getDemoStore().staff.push({ id: nextDemoId("staff"), ...input });
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("staff_members").insert(staffToRow(input));

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateStaff(id: string, input: StaffInput) {
  if (await shouldUseDemoData()) {
    const store = getDemoStore();
    store.staff = store.staff.map((item) =>
      item.id === id ? { id, ...input } : item,
    );
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!
    .from("staff_members")
    .update(staffToRow(input))
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteStaff(id: string) {
  if (await shouldUseDemoData()) {
    const store = getDemoStore();
    store.staff = store.staff.filter((item) => item.id !== id);
    store.reservations = store.reservations.filter((item) => item.staffId !== id);
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("staff_members").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function listServices(activeOnly = false) {
  if (await shouldUseDemoData()) {
    const services = getDemoStore().services;
    return activeOnly ? services.filter((item) => item.active) : services;
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase!.from("services").select("*").order("name");

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ServiceRow[]).map(mapService);
}

export async function createService(input: ServiceInput) {
  if (await shouldUseDemoData()) {
    getDemoStore().services.push({ id: nextDemoId("service"), ...input });
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("services").insert(serviceToRow(input));

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateService(id: string, input: ServiceInput) {
  if (await shouldUseDemoData()) {
    const store = getDemoStore();
    store.services = store.services.map((item) =>
      item.id === id ? { id, ...input } : item,
    );
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!
    .from("services")
    .update(serviceToRow(input))
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteService(id: string) {
  if (await shouldUseDemoData()) {
    const store = getDemoStore();
    store.services = store.services.filter((item) => item.id !== id);
    store.reservations = store.reservations.filter((item) => item.serviceId !== id);
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("services").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function listCustomers() {
  if (await shouldUseDemoData()) {
    return getDemoStore().customers;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!
    .from("customers")
    .select("*")
    .order("full_name");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as CustomerRow[]).map(mapCustomer);
}

export async function createCustomer(input: CustomerInput) {
  if (await shouldUseDemoData()) {
    const customer = { id: nextDemoId("customer"), ...input };
    getDemoStore().customers.push(customer);
    return customer;
  }

  const customer = { id: crypto.randomUUID(), ...input };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!
    .from("customers")
    .insert({ id: customer.id, ...customerToRow(input) });

  if (error) {
    throw new Error(error.message);
  }

  return customer;
}

export async function updateCustomer(id: string, input: CustomerInput) {
  if (await shouldUseDemoData()) {
    const store = getDemoStore();
    store.customers = store.customers.map((item) =>
      item.id === id ? { id, ...input } : item,
    );
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!
    .from("customers")
    .update(customerToRow(input))
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCustomer(id: string) {
  if (await shouldUseDemoData()) {
    const store = getDemoStore();
    store.customers = store.customers.filter((item) => item.id !== id);
    store.reservations = store.reservations.filter(
      (item) => item.customerId !== id,
    );
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("customers").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function listReservations(filters?: {
  date?: string;
  staffId?: string;
  from?: string;
  to?: string;
}) {
  if (await shouldUseDemoData()) {
    let reservations = joinDemoReservations();

    if (filters?.date) {
      reservations = reservations.filter((item) => item.date === filters.date);
    }

    if (filters?.from) {
      reservations = reservations.filter((item) => item.date >= filters.from!);
    }

    if (filters?.to) {
      reservations = reservations.filter((item) => item.date <= filters.to!);
    }

    if (filters?.staffId) {
      reservations = reservations.filter((item) => item.staffId === filters.staffId);
    }

    return reservations.sort((a, b) =>
      `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`),
    );
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase!
    .from("reservations")
    .select(
      "*, customer:customers(*), staff:staff_members(*), service:services(*)",
    )
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (filters?.date) {
    query = query.eq("appointment_date", filters.date);
  }

  if (filters?.from) {
    query = query.gte("appointment_date", filters.from);
  }

  if (filters?.to) {
    query = query.lte("appointment_date", filters.to);
  }

  if (filters?.staffId) {
    query = query.eq("staff_id", filters.staffId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ReservationRow[]).map(mapReservation);
}

export async function listReservationBlocks(filters?: {
  date?: string;
  staffId?: string;
}) {
  if (await shouldUseDemoData()) {
    let reservations = getDemoStore().reservations;

    if (filters?.date) {
      reservations = reservations.filter((item) => item.date === filters.date);
    }

    if (filters?.staffId) {
      reservations = reservations.filter((item) => item.staffId === filters.staffId);
    }

    return reservations;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!.rpc("get_reservation_blocks", {
    filter_date: filters?.date ?? null,
    filter_staff_id: filters?.staffId ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ReservationBlockRow[]).map(mapReservationBlock);
}

export async function hasStaffConflict({
  date,
  endTime,
  excludeReservationId,
  staffId,
  startTime,
}: {
  date: string;
  endTime: string;
  excludeReservationId?: string;
  staffId: string;
  startTime: string;
}) {
  const reservations = await listReservationBlocks({ date, staffId });

  return reservations.some((reservation) => {
    if (
      reservation.id === excludeReservationId ||
      reservation.status === "cancelled"
    ) {
      return false;
    }

    return overlaps(
      startTime,
      endTime,
      reservation.startTime,
      reservation.endTime,
    );
  });
}

export async function createReservation(input: ReservationInput) {
  const service = (await listServices()).find((item) => item.id === input.serviceId);

  if (!service) {
    throw new Error("Service was not found.");
  }

  const requestedDurationMinutes = input.durationMinutes ?? service.durationMinutes;
  const endTime = addMinutesToTime(input.startTime, requestedDurationMinutes);
  const hasConflict = await hasStaffConflict({
    date: input.date,
    endTime,
    staffId: input.staffId,
    startTime: input.startTime,
  });

  if (hasConflict) {
    throw new Error("That slot is already taken by someone else. Please choose another time.");
  }

  if (await shouldUseDemoData()) {
    const reservation: Reservation = {
      id: nextDemoId("reservation"),
      ...input,
      endTime: addDemoReservationEndTime(
        input.startTime,
        requestedDurationMinutes,
      ),
      createdAt: new Date().toISOString(),
    };
    getDemoStore().reservations.push(reservation);
    return reservation;
  }

  const reservation: Reservation = {
    id: crypto.randomUUID(),
    ...input,
    endTime,
    createdAt: new Date().toISOString(),
  };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!
    .from("reservations")
    .insert({ id: reservation.id, ...reservationToRow(input, endTime) });

  if (error) {
    throw new Error(error.message);
  }

  return reservation;
}

export async function updateReservation(
  id: string,
  input: Omit<ReservationInput, "source">,
) {
  const service = (await listServices()).find((item) => item.id === input.serviceId);

  if (!service) {
    throw new Error("Service was not found.");
  }

  const requestedDurationMinutes = input.durationMinutes ?? service.durationMinutes;
  const endTime = addMinutesToTime(input.startTime, requestedDurationMinutes);
  const hasConflict = await hasStaffConflict({
    date: input.date,
    endTime,
    excludeReservationId: id,
    staffId: input.staffId,
    startTime: input.startTime,
  });

  if (hasConflict) {
    throw new Error("This provider already has a reservation at that time.");
  }

  if (await shouldUseDemoData()) {
    const store = getDemoStore();
    store.reservations = store.reservations.map((item) =>
      item.id === id
        ? {
            ...item,
            ...input,
            endTime,
          }
        : item,
    );
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!
    .from("reservations")
    .update(reservationToRow({ ...input, source: "admin" }, endTime))
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteReservation(id: string) {
  if (await shouldUseDemoData()) {
    const store = getDemoStore();
    store.reservations = store.reservations.filter((item) => item.id !== id);
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("reservations").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [staff, services, customers, reservations] = await Promise.all([
    listStaff(true),
    listServices(true),
    listCustomers(),
    listReservations(),
  ]);

  const today = todayISO();
  const servicePriceMap = new Map(services.map((s) => [s.id, s.price]));

  const activeReservations = reservations.filter(
    (item) => item.status === "confirmed" || item.status === "completed",
  );

  const totalEstimatedRevenue = activeReservations.reduce((sum, res) => {
    return sum + (servicePriceMap.get(res.serviceId) ?? 0);
  }, 0);

  const todayEstimatedRevenue = activeReservations
    .filter((res) => res.date === today)
    .reduce((sum, res) => {
      return sum + (servicePriceMap.get(res.serviceId) ?? 0);
    }, 0);

  return {
    todayReservations: reservations.filter((item) => item.date === today).length,
    totalReservations: reservations.length,
    pendingReservations: reservations.filter((item) => item.status === "pending")
      .length,
    confirmedReservations: reservations.filter(
      (item) => item.status === "confirmed",
    ).length,
    completedReservations: reservations.filter(
      (item) => item.status === "completed",
    ).length,
    cancelledReservations: reservations.filter(
      (item) => item.status === "cancelled",
    ).length,
    staffCount: staff.length,
    serviceCount: services.length,
    customerCount: customers.length,
    totalEstimatedRevenue,
    todayEstimatedRevenue,
  };
}

export async function getReservationFormOptions() {
  const [customers, staff, services] = await Promise.all([
    listCustomers(),
    listStaff(true),
    listServices(true),
  ]);

  return { customers, staff, services };
}

export function parseReservationStatus(value: string): ReservationStatus {
  return reservationStatuses.includes(value as ReservationStatus)
    ? (value as ReservationStatus)
    : "pending";
}

