export const businessTypes = [
  "dental",
  "clinic",
  "beauty_salon",
  "nail_salon",
  "barber",
  "playstation_cafe",
  "stadium",
  "tour",
  "gym",
  "restaurant",
  "lounge",
  "agro_tourism",
] as const;

export type BusinessType = (typeof businessTypes)[number];

export const businessTypeLabels: Record<BusinessType, string> = {
  dental: "Dental clinic",
  clinic: "Clinic",
  beauty_salon: "Beauty salon",
  nail_salon: "Nail salon",
  barber: "Barber shop",
  playstation_cafe: "PlayStation cafe",
  stadium: "Stadium / pitch",
  tour: "Tour business",
  gym: "Gym / trainer",
  restaurant: "Restaurant",
  lounge: "Lounge / game center",
  agro_tourism: "Plantation / agro-tourism",
};

export const weekDays = [
  { value: "monday", label: "Monday", short: "Mon", az: "Bazar ertesi" },
  { value: "tuesday", label: "Tuesday", short: "Tue", az: "Cersenbe axsami" },
  { value: "wednesday", label: "Wednesday", short: "Wed", az: "Cersenbe" },
  { value: "thursday", label: "Thursday", short: "Thu", az: "Cume axsami" },
  { value: "friday", label: "Friday", short: "Fri", az: "Cume" },
  { value: "saturday", label: "Saturday", short: "Sat", az: "Senbe" },
  { value: "sunday", label: "Sunday", short: "Sun", az: "Bazar" },
] as const;

export type WeekDay = (typeof weekDays)[number]["value"];

export const reservationStatuses = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;

export type ReservationStatus = (typeof reservationStatuses)[number];

export type BusinessSettings = {
  id: string;
  businessName: string;
  businessType: BusinessType;
  publicSlug: string;
  customDomain: string;
  phone: string;
  address: string;
  workingDays: WeekDay[];
  workStart: string;
  workEnd: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
};

export type StaffMember = {
  id: string;
  name: string;
  roleSpecialty: string;
  phone: string;
  workingDays: WeekDay[];
  workStart: string;
  workEnd: string;
  active: boolean;
};

export type ServiceItem = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
  active: boolean;
};

export type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
};

export type Reservation = {
  id: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  notes: string;
  source: "admin" | "public";
  createdAt: string;
  customer?: Customer;
  staff?: StaffMember;
  service?: ServiceItem;
};

export const demoPresets = ["clinic", "salon", "tour", "qgc", "laliga"] as const;

export type DemoPreset = (typeof demoPresets)[number];

export const demoPresetLabels: Record<DemoPreset, string> = {
  clinic: "Clinic",
  salon: "Salon",
  tour: "Tour business",
  qgc: "QGC gaming",
  laliga: "LaLiga lounge",
};

export type DashboardStats = {
  todayReservations: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  staffCount: number;
  serviceCount: number;
  customerCount: number;
  totalEstimatedRevenue: number;
  todayEstimatedRevenue: number;
};

export const defaultBusinessSettings: BusinessSettings = {
  id: "demo-business",
  businessName: "RezervAZ Clinic",
  businessType: "clinic",
  publicSlug: "rezervaz-clinic",
  customDomain: "",
  phone: "+994 50 000 00 00",
  address: "Nizami street 10, Baku",
  workingDays: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ],
  workStart: "09:00",
  workEnd: "18:00",
  logoUrl: "",
  primaryColor: "#0f766e",
  secondaryColor: "#14b8a6",
};
