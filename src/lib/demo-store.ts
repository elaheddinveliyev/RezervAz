import {
  type BusinessSettings,
  type Customer,
  type DemoPreset,
  type Reservation,
  type ServiceItem,
  type StaffMember,
  defaultBusinessSettings,
} from "@/lib/types";
import { getDefaultDemoPreset } from "@/lib/env";
import { addMinutesToTime, todayISO } from "@/lib/time";

type DemoStore = {
  mode: DemoPreset;
  business: BusinessSettings;
  staff: StaffMember[];
  services: ServiceItem[];
  customers: Customer[];
  reservations: Reservation[];
  sequence: number;
};

const globalForDemo = globalThis as typeof globalThis & {
  __rezervazDemoStore?: DemoStore;
};

function makeId(prefix: string, sequence: number) {
  return `${prefix}-${sequence.toString().padStart(3, "0")}`;
}

function dateOffset(days: number) {
  const date = new Date(`${todayISO()}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function withReservationJoins(store: DemoStore, reservation: Reservation) {
  return {
    ...reservation,
    customer: store.customers.find((item) => item.id === reservation.customerId),
    staff: store.staff.find((item) => item.id === reservation.staffId),
    service: store.services.find((item) => item.id === reservation.serviceId),
  };
}

function createClinicStore(): DemoStore {
  const business: BusinessSettings = {
    ...defaultBusinessSettings,
    businessName: "RezervAZ Clinic",
    businessType: "clinic",
    publicSlug: "rezervaz-clinic",
    customDomain: "",
    phone: "+994 12 555 10 10",
    address: "Nizami küçəsi 10, Bakı",
    primaryColor: "#0f766e",
    secondaryColor: "#14b8a6",
  };
  const staff: StaffMember[] = [
    {
      id: "staff-001",
      name: "Dr. Aysel Məmmədova",
      roleSpecialty: "Dentist",
      phone: "+994 50 111 22 33",
      workingDays: business.workingDays,
      workStart: "09:00",
      workEnd: "17:00",
      active: true,
    },
    {
      id: "staff-002",
      name: "Dr. Kamran Əliyev",
      roleSpecialty: "Therapist",
      phone: "+994 55 222 33 44",
      workingDays: business.workingDays,
      workStart: "10:00",
      workEnd: "18:00",
      active: true,
    },
  ];
  const services: ServiceItem[] = [
    {
      id: "service-001",
      name: "Dental consultation",
      durationMinutes: 30,
      price: 30,
      description: "Initial dental check and treatment recommendation.",
      active: true,
    },
    {
      id: "service-002",
      name: "General check-up",
      durationMinutes: 45,
      price: 45,
      description: "Basic doctor consultation for new patients.",
      active: true,
    },
  ];
  const customers: Customer[] = [
    {
      id: "customer-001",
      fullName: "Nigar Həsənova",
      phone: "+994 50 700 11 22",
      email: "nigar@example.com",
      notes: "Prefers morning appointments.",
    },
    {
      id: "customer-002",
      fullName: "Murad Quliyev",
      phone: "+994 55 800 22 33",
      email: "",
      notes: "First visit.",
    },
  ];
  const reservations: Reservation[] = [
    {
      id: "reservation-001",
      customerId: customers[0].id,
      staffId: staff[0].id,
      serviceId: services[0].id,
      date: todayISO(),
      startTime: "10:00",
      endTime: "10:30",
      status: "confirmed",
      notes: "Bring previous x-ray if available.",
      source: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "reservation-002",
      customerId: customers[1].id,
      staffId: staff[1].id,
      serviceId: services[1].id,
      date: dateOffset(1),
      startTime: "14:00",
      endTime: "14:45",
      status: "pending",
      notes: "",
      source: "public",
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    mode: "clinic",
    business,
    staff,
    services,
    customers,
    reservations,
    sequence: 20,
  };
}

function createSalonStore(): DemoStore {
  const store = createClinicStore();
  store.mode = "salon";
  store.business = {
    ...store.business,
    businessName: "Lale Beauty Studio",
    businessType: "beauty_salon",
    publicSlug: "lale-beauty-studio",
    phone: "+994 50 444 55 66",
    address: "28 May küçəsi 7, Bakı",
    primaryColor: "#be185d",
    secondaryColor: "#f472b6",
  };
  store.staff = [
    {
      id: "staff-001",
      name: "Lalə Rüstəmova",
      roleSpecialty: "Hair stylist",
      phone: "+994 50 333 44 55",
      workingDays: ["tuesday", "wednesday", "thursday", "friday", "saturday"],
      workStart: "10:00",
      workEnd: "19:00",
      active: true,
    },
    {
      id: "staff-002",
      name: "Amina Səfərova",
      roleSpecialty: "Nail master",
      phone: "+994 55 666 77 88",
      workingDays: ["monday", "wednesday", "friday", "saturday"],
      workStart: "11:00",
      workEnd: "18:00",
      active: true,
    },
  ];
  store.services = [
    {
      id: "service-001",
      name: "Haircut and styling",
      durationMinutes: 60,
      price: 35,
      description: "Wash, haircut, and simple styling.",
      active: true,
    },
    {
      id: "service-002",
      name: "Gel manicure",
      durationMinutes: 75,
      price: 30,
      description: "Gel polish manicure session.",
      active: true,
    },
  ];

  return store;
}

function createTourStore(): DemoStore {
  const store = createClinicStore();
  store.mode = "tour";
  store.business = {
    ...store.business,
    businessName: "Absheron Day Tours",
    businessType: "tour",
    publicSlug: "absheron-day-tours",
    phone: "+994 70 123 45 67",
    address: "İçərişəhər, Bakı",
    primaryColor: "#1d4ed8",
    secondaryColor: "#38bdf8",
    workStart: "08:00",
    workEnd: "20:00",
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  };
  store.staff = [
    {
      id: "staff-001",
      name: "Rəşad Abbasov",
      roleSpecialty: "City guide",
      phone: "+994 70 111 22 33",
      workingDays: store.business.workingDays,
      workStart: "09:00",
      workEnd: "18:00",
      active: true,
    },
    {
      id: "staff-002",
      name: "Leyla İsmayılova",
      roleSpecialty: "Agro-tour guide",
      phone: "+994 77 222 33 44",
      workingDays: ["friday", "saturday", "sunday"],
      workStart: "08:00",
      workEnd: "17:00",
      active: true,
    },
  ];
  store.services = [
    {
      id: "service-001",
      name: "Old City walking tour",
      durationMinutes: 120,
      price: 60,
      description: "Guided walking tour for small groups.",
      active: true,
    },
    {
      id: "service-002",
      name: "Agro-tourism package",
      durationMinutes: 180,
      price: 90,
      description: "Plantation visit with local tasting.",
      active: true,
    },
  ];

  return store;
}

function createQgcStore(): DemoStore {
  const business: BusinessSettings = {
    ...defaultBusinessSettings,
    businessName: "Qarabagh Game Center",
    businessType: "playstation_cafe",
    publicSlug: "qgc",
    customDomain: "qgc.az",
    phone: "+994 50 588 22 66",
    address: "Suleyman Rustam, Nasimi, Baku",
    workingDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    workStart: "10:00",
    workEnd: "23:30",
    primaryColor: "#111827",
    secondaryColor: "#f59e0b",
  };
  const staff: StaffMember[] = [
    {
      id: "staff-001",
      name: "PS5 VIP Room 1",
      roleSpecialty: "Private PlayStation room",
      phone: business.phone,
      workingDays: business.workingDays,
      workStart: "10:00",
      workEnd: "23:30",
      active: true,
    },
    {
      id: "staff-002",
      name: "PS5 VIP Room 2",
      roleSpecialty: "Private PlayStation room",
      phone: business.phone,
      workingDays: business.workingDays,
      workStart: "10:00",
      workEnd: "23:30",
      active: true,
    },
    {
      id: "staff-003",
      name: "Standard Cabinet 1",
      roleSpecialty: "Open gaming cabinet",
      phone: business.phone,
      workingDays: business.workingDays,
      workStart: "10:00",
      workEnd: "23:30",
      active: true,
    },
    {
      id: "staff-004",
      name: "Tournament Zone",
      roleSpecialty: "Group gaming area",
      phone: business.phone,
      workingDays: ["friday", "saturday", "sunday"],
      workStart: "12:00",
      workEnd: "23:00",
      active: true,
    },
  ];
  const services: ServiceItem[] = [
    {
      id: "service-001",
      name: "PS5 hourly session",
      durationMinutes: 60,
      price: 10,
      description: "One-hour PlayStation session for 1-2 players.",
      active: true,
    },
    {
      id: "service-002",
      name: "VIP room booking",
      durationMinutes: 120,
      price: 25,
      description: "Private room booking for friends or small groups.",
      active: true,
    },
    {
      id: "service-003",
      name: "Tournament table",
      durationMinutes: 90,
      price: 20,
      description: "Reserved setup for FIFA, FC, Mortal Kombat, or Tekken.",
      active: true,
    },
    {
      id: "service-004",
      name: "Birthday gaming package",
      durationMinutes: 180,
      price: 80,
      description: "Three-hour group gaming package for birthdays and events.",
      active: true,
    },
  ];
  const customers: Customer[] = [
    {
      id: "customer-001",
      fullName: "Orxan Aliyev",
      phone: "+994 50 710 22 33",
      email: "",
      notes: "Usually books evenings.",
    },
    {
      id: "customer-002",
      fullName: "Fidan Karimova",
      phone: "+994 55 920 44 55",
      email: "fidan@example.com",
      notes: "Asked about VIP room.",
    },
    {
      id: "customer-003",
      fullName: "Tural Huseynli",
      phone: "+994 70 330 66 77",
      email: "",
      notes: "Birthday package lead.",
    },
  ];
  const reservations: Reservation[] = [
    {
      id: "reservation-001",
      customerId: customers[0].id,
      staffId: staff[0].id,
      serviceId: services[0].id,
      date: todayISO(),
      startTime: "18:00",
      endTime: "19:00",
      status: "confirmed",
      notes: "FC match with friend.",
      source: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "reservation-002",
      customerId: customers[1].id,
      staffId: staff[1].id,
      serviceId: services[1].id,
      date: todayISO(),
      startTime: "20:00",
      endTime: "22:00",
      status: "pending",
      notes: "Public request for VIP room.",
      source: "public",
      createdAt: new Date().toISOString(),
    },
    {
      id: "reservation-003",
      customerId: customers[2].id,
      staffId: staff[3].id,
      serviceId: services[3].id,
      date: dateOffset(1),
      startTime: "17:00",
      endTime: "20:00",
      status: "confirmed",
      notes: "Birthday group, confirm player count by phone.",
      source: "admin",
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    mode: "qgc",
    business,
    staff,
    services,
    customers,
    reservations,
    sequence: 30,
  };
}

function createLaligaStore(): DemoStore {
  const business: BusinessSettings = {
    ...defaultBusinessSettings,
    businessName: "LaLiga Lounge Center",
    businessType: "lounge",
    publicSlug: "laliga-lounge-center",
    customDomain: "instagram.com/laligaloungecenter",
    phone: "+994 55 814 64 64",
    address: "Zahid Xalilov 25B, Elmler, Baku",
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
    workEnd: "03:00",
    logoUrl: "/clients/laliga-logo.png",
    primaryColor: "#4b145c",
    secondaryColor: "#facc15",
  };
  const rooms = [
    ["Game Room", "6 nəfərlik"],
    ["La Liga Room", "6 nəfərlik"],
    ["Futurizm", "6 nəfərlik"],
    ["Paris Room", "6 nəfərlik"],
    ["London Room", "6 nəfərlik"],
    ["Morocco Room", "6 nəfərlik"],
    ["Loft Room", "6 nəfərlik"],
    ["Vintage Room", "6 nəfərlik"],
    ["Retro Room", "6 nəfərlik"],
    ["Athens Room", "7 nəfərlik"],
    ["Kabinet 504", "4-5 nəfərlik"],
    ["Kabinet 502", "4-5 nəfərlik"],
    ["Kabinet 501", "4-5 nəfərlik"],
    ["Kabinet 503", "5-6 nəfərlik"],
    ["Country Room", "7 nəfərlik"],
    ["Prizma Room", "8-15 nəfərlik"],
    ["Africa Room", "6 nəfərlik"],
    ["East Room", "6 nəfərlik"],
    ["Bakı Room", "8-10 nəfərlik"],
    ["Roma Room", "8-10 nəfərlik"],
    ["İstanbul", "8-10 nəfərlik"],
    ["Kiev", "8 nəfərlik"],
    ["Dubay", "8-10 nəfərlik"],
    ["Planet Room", "8-15 nəfərlik"],
    ["Macao Room", "6 nəfərlik"],
    ["Kabinet 505", "4-5 nəfərlik"],
    ["Şuşa Room", "8 nəfərlik"],
  ] as const;
  const staff: StaffMember[] = rooms.map(([name, capacity], index) => ({
    id: `staff-${(index + 1).toString().padStart(3, "0")}`,
    name,
    roleSpecialty: `${capacity} otaq - 8 AZN/saat, PS5 ilə 10 AZN/saat`,
    phone: business.phone,
    workingDays: business.workingDays,
    workStart: "09:00",
    workEnd: "03:00",
    active: true,
  }));
  const services: ServiceItem[] = [
    {
      id: "service-001",
      name: "Otaq rezervasiyası - 1 saat",
      durationMinutes: 60,
      price: 8,
      description: "Standart otaq rezervasiyası. Hər otaq üçün saatlıq qiymət 8 AZN.",
      active: true,
    },
    {
      id: "service-002",
      name: "PS5 ilə otaq - 1 saat",
      durationMinutes: 60,
      price: 10,
      description: "PS5 ilə otaq rezervasiyası. Hər otaq üçün saatlıq qiymət 10 AZN.",
      active: true,
    },
    {
      id: "service-003",
      name: "Otaq rezervasiyası - 2 saat",
      durationMinutes: 120,
      price: 16,
      description: "İki saatlıq standart otaq rezervasiyası.",
      active: true,
    },
    {
      id: "service-004",
      name: "PS5 ilə otaq - 2 saat",
      durationMinutes: 120,
      price: 20,
      description: "İki saatlıq PS5 ilə otaq rezervasiyası.",
      active: true,
    },
  ];
  const customers: Customer[] = [
    {
      id: "customer-001",
      fullName: "Rauf Mammadli",
      phone: "+994 55 210 44 11",
      email: "",
      notes: "Often books Game Room in the evening.",
    },
    {
      id: "customer-002",
      fullName: "Ayan Ismayilova",
      phone: "+994 50 680 88 22",
      email: "ayan@example.com",
      notes: "Asked for Prizma Room group reservation.",
    },
    {
      id: "customer-003",
      fullName: "Nicat Hasanov",
      phone: "+994 70 445 19 90",
      email: "",
      notes: "Prefers PS5 after 20:00.",
    },
  ];
  const reservations: Reservation[] = [
    {
      id: "reservation-001",
      customerId: customers[0].id,
      staffId: staff[0].id,
      serviceId: services[0].id,
      date: todayISO(),
      startTime: "21:00",
      endTime: "22:00",
      status: "confirmed",
      notes: "Game Room, 6 nəfərlik.",
      source: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "reservation-002",
      customerId: customers[2].id,
      staffId: staff[1].id,
      serviceId: services[1].id,
      date: todayISO(),
      startTime: "19:30",
      endTime: "20:30",
      status: "pending",
      notes: "La Liga Room with PS5.",
      source: "public",
      createdAt: new Date().toISOString(),
    },
    {
      id: "reservation-003",
      customerId: customers[1].id,
      staffId: staff[15].id,
      serviceId: services[2].id,
      date: dateOffset(2),
      startTime: "18:00",
      endTime: "20:00",
      status: "confirmed",
      notes: "Prizma Room group reservation, 8-15 nəfərlik.",
      source: "admin",
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    mode: "laliga",
    business,
    staff,
    services,
    customers,
    reservations,
    sequence: 40,
  };
}

export function createDemoStore(mode: DemoPreset = getDefaultDemoPreset()) {
  if (mode === "salon") {
    return createSalonStore();
  }

  if (mode === "tour") {
    return createTourStore();
  }

  if (mode === "qgc") {
    return createQgcStore();
  }

  if (mode === "laliga") {
    return createLaligaStore();
  }

  return createClinicStore();
}

export function getDemoStore() {
  if (!globalForDemo.__rezervazDemoStore) {
    globalForDemo.__rezervazDemoStore = createDemoStore();
  }

  return globalForDemo.__rezervazDemoStore;
}

export function resetDemoStore(mode: DemoPreset) {
  globalForDemo.__rezervazDemoStore = createDemoStore(mode);
  return globalForDemo.__rezervazDemoStore;
}

export function nextDemoId(prefix: string) {
  const store = getDemoStore();
  store.sequence += 1;
  return makeId(prefix, store.sequence);
}

export function joinDemoReservations(reservations = getDemoStore().reservations) {
  const store = getDemoStore();
  return reservations.map((reservation) => withReservationJoins(store, reservation));
}

export function addDemoReservationEndTime(
  startTime: string,
  durationMinutes: number,
) {
  return addMinutesToTime(startTime, durationMinutes);
}
