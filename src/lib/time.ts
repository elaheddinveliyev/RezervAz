import {
  type BusinessSettings,
  type Reservation,
  type ServiceItem,
  type StaffMember,
  type WeekDay,
  weekDays,
} from "@/lib/types";

const dayIndexToKey: WeekDay[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("az-AZ", {
    dateStyle: "medium",
  }).format(new Date(`${date}T12:00:00`));
}

export function formatTime(time: string) {
  return time.slice(0, 5);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: "AZN",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function getDayKey(date: string): WeekDay {
  return dayIndexToKey[new Date(`${date}T12:00:00`).getDay()];
}

export function getDayLabel(day: WeekDay) {
  return weekDays.find((item) => item.value === day)?.short ?? day;
}

export function timeToMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function minutesToTime(totalMinutes: number) {
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalizedMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (normalizedMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function addMinutesToTime(time: string, minutes: number) {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function overlaps(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) {
  const intervalA = toComparableInterval(startA, endA);
  const intervalB = toComparableInterval(startB, endB);

  return (
    intervalsOverlap(intervalA, intervalB) ||
    intervalsOverlap(shiftInterval(intervalA, 1440), intervalB) ||
    intervalsOverlap(intervalA, shiftInterval(intervalB, 1440))
  );
}

function toComparableInterval(startTime: string, endTime: string) {
  const start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);

  if (end <= start) {
    end += 1440;
  }

  return { start, end };
}

function shiftInterval(
  interval: { start: number; end: number },
  minutes: number,
) {
  return {
    start: interval.start + minutes,
    end: interval.end + minutes,
  };
}

function intervalsOverlap(
  first: { start: number; end: number },
  second: { start: number; end: number },
) {
  return first.start < second.end && first.end > second.start;
}

export function getWeekDates(date: string) {
  const selected = new Date(`${date}T12:00:00`);
  const day = selected.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(selected);
  monday.setDate(selected.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);
    return current.toISOString().slice(0, 10);
  });
}

export function getWorkingWindow(
  date: string,
  staff: StaffMember,
  business: BusinessSettings,
) {
  const day = getDayKey(date);
  const staffDays = staff.workingDays.length
    ? staff.workingDays
    : business.workingDays;
  const isWorkingDay =
    business.workingDays.includes(day) && staffDays.includes(day);

  return {
    isWorkingDay,
    start: staff.workStart || business.workStart,
    end: staff.workEnd || business.workEnd,
  };
}

type SlotAvailability = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  nextReservationStartTime?: string;
};

export function generateSlotAvailability({
  business,
  date,
  durationMinutes,
  reservations,
  service,
  staff,
}: {
  business: BusinessSettings;
  date: string;
  durationMinutes?: number;
  reservations: Reservation[];
  service: ServiceItem;
  staff: StaffMember;
}) {
  const window = getWorkingWindow(date, staff, business);

  if (!window.isWorkingDay || !staff.active || !service.active) {
    return [];
  }

  const normalizedDurationMinutes = Math.max(30, durationMinutes ?? service.durationMinutes);
  const slots: SlotAvailability[] = [];
  const start = timeToMinutes(window.start);
  let end = timeToMinutes(window.end);

  if (end <= start) {
    end += 1440;
  }

  const reservationsForDay = reservations.filter((reservation) => {
    return (
      reservation.staffId === staff.id &&
      reservation.date === date &&
      reservation.status !== "cancelled"
    );
  });

  for (let current = start; current + normalizedDurationMinutes <= end; current += 30) {
    const startTime = minutesToTime(current);
    const endTime = minutesToTime(current + normalizedDurationMinutes);
    const isTaken = reservationsForDay.some((reservation) => {
      return overlaps(startTime, endTime, reservation.startTime, reservation.endTime);
    });

    const nextReservationStartTime = reservationsForDay
      .filter((reservation) => {
        return timeToMinutes(reservation.startTime) >= current + normalizedDurationMinutes;
      })
      .sort((first, second) => {
        return timeToMinutes(first.startTime) - timeToMinutes(second.startTime);
      })[0]?.startTime;

    slots.push({
      startTime,
      endTime,
      isAvailable: !isTaken,
      nextReservationStartTime,
    });
  }

  return slots;
}

export function generateAvailableSlots({
  business,
  date,
  reservations,
  service,
  staff,
}: {
  business: BusinessSettings;
  date: string;
  reservations: Reservation[];
  service: ServiceItem;
  staff: StaffMember;
}) {
  return generateSlotAvailability({
    business,
    date,
    reservations,
    service,
    staff,
  })
    .filter((slot) => slot.isAvailable)
    .map((slot) => slot.startTime);
}
