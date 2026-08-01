import { CalendarCheck, MapPin, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import {
  FieldLabel,
  inputClass,
  selectClass,
} from "@/components/form-fields";
import { FormSubmitButton } from "@/components/form-submit-button";
import { ToastMessage } from "@/components/toast-message";
import { LanguageSwitcher } from "@/components/language-switcher";
import { publicBookingAction } from "@/lib/actions";
import { getPublicBookingTheme } from "@/lib/client-theme";
import {
  getBusinessSettings,
  listReservationBlocks,
  listReservations,
  listServices,
  listStaff,
} from "@/lib/data";
import {
  formatCurrency,
  formatDate,
  formatTime,
  generateSlotAvailability,
  getDayKey,
  getDayLabel,
  getWeekDates,
  minutesToTime,
  overlaps,
  todayISO,
} from "@/lib/time";
import { businessTypeLabels, type ServiceItem } from "@/lib/types";
import RoomPhotoCarousel from "@/components/room-photo-carousel";

type PublicBookingPageProps = {
  searchParams?: Promise<{
    date?: string;
    hours?: string;
    roomMode?: string;
    durationMinutes?: string;
    error?: string;
    serviceId?: string;
    staffId?: string;
    success?: string;
  }>;
};

function buildServiceOptions(services: ServiceItem[]) {
  return services
    .filter((service) => service.durationMinutes === 60)
    .sort((first, second) => {
      if (first.durationMinutes !== second.durationMinutes) {
        return first.durationMinutes - second.durationMinutes;
      }
      return first.price - second.price;
    });
}

function serviceOptionLabel(service: ServiceItem) {
  const mode = service.name.toLowerCase().includes("ps5") ? "PS5" : "Standard";
  const hours = service.durationMinutes / 60;
  return `${mode} · ${hours}h · ${formatCurrency(service.price)}`;
}

export default async function PublicBookingPage({
  searchParams,
}: PublicBookingPageProps) {
  const params = await searchParams;
  const [business, staff, services] = await Promise.all([
    getBusinessSettings(),
    listStaff(true),
    listServices(true),
  ]);
  const roomOptions = staff;
  const serviceOptions = buildServiceOptions(services);
  const selectedStaff =
    roomOptions.find((provider) => provider.id === params?.staffId) ?? roomOptions[0];
  const selectedService =
    serviceOptions.find((service) => service.id === params?.serviceId) ??
    serviceOptions.find(
      (service) =>
        params?.roomMode === "ps5" === service.name.toLowerCase().includes("ps5"),
    ) ??
    serviceOptions[0] ??
    services[0];
  const selectedDate = params?.date || todayISO();
  const requestedHours = Number(params?.hours ?? params?.durationMinutes ?? 1);
  const selectedHours =
    Number.isInteger(requestedHours) && requestedHours >= 1 && requestedHours <= 8
      ? requestedHours
      : 1;
  const selectedRoomMode = selectedService?.name.toLowerCase().includes("ps5")
    ? "ps5"
    : "standard";
  const selectedDurationMinutes = selectedHours * 60;
  const reservations =
    selectedStaff && selectedDate
      ? await listReservationBlocks({
          date: selectedDate,
          staffId: selectedStaff.id,
        })
      : [];
  const weekDates = selectedStaff ? getWeekDates(selectedDate) : [];
  const weekReservations =
    selectedStaff && weekDates.length
      ? await listReservations({
          from: weekDates[0],
          to: weekDates[weekDates.length - 1],
          staffId: selectedStaff.id,
        })
      : [];
  const slotAvailability =
    selectedService && selectedStaff
      ? generateSlotAvailability({
          business,
          date: selectedDate,
          durationMinutes: selectedDurationMinutes,
          reservations,
          service: selectedService,
          staff: selectedStaff,
        })
      : [];
  const availableSlots = slotAvailability
    .filter((slot) => slot.isAvailable)
    .map((slot) => slot.startTime);
  const hourSlots = Array.from({ length: 22 }, (_, index) => (9 + index) % 24);
  const roomPhotos = [
    ["Africa Room", "/clients/rooms/africa-room.png"],
    ["Athens Room", "/clients/rooms/athens-room.png"],
    ["Baku Room", "/clients/rooms/baku-room.png"],
    ["Country Room", "/clients/rooms/country-room.png"],
    ["Dubay", "/clients/rooms/dubay.png"],
    ["East Room", "/clients/rooms/east-room.png"],
    ["Futurizm", "/clients/rooms/futurizm.png"],
    ["Game Room", "/clients/rooms/game-room.png"],
    ["Istanbul", "/clients/rooms/istanbul.png"],
    ["Kabinet 501", "/clients/rooms/kabinet-501.png"],
    ["Kabinet 502", "/clients/rooms/kabinet-502.png"],
    ["Kabinet 503", "/clients/rooms/kabinet-503.png"],
    ["Kabinet 504", "/clients/rooms/kabinet-504.png"],
    ["Kabinet 505", "/clients/rooms/kabinet-505.png"],
    ["Kiev", "/clients/rooms/kiev.png"],
    ["La Liga Room", "/clients/rooms/la-liga-room.png"],
    ["Loft Room", "/clients/rooms/loft-room.png"],
    ["London Room", "/clients/rooms/london-room.png"],
    ["Macao Room", "/clients/rooms/macao-room.png"],
    ["Morocco Room", "/clients/rooms/morocco-room.png"],
    ["Paris Room", "/clients/rooms/paris-room.png"],
    ["Planet Room", "/clients/rooms/planet-room.png"],
    ["Prizma Room", "/clients/rooms/prizma-room.png"],
    ["Retro Room", "/clients/rooms/retro-room.png"],
    ["Roma Room", "/clients/rooms/roma-room.png"],
    ["Şuşa Room", "/clients/rooms/u-a-room.png"],
    ["Vintage Room", "/clients/rooms/vintage-room.png"],
  ].map(([name, src]) => ({ name, src }));

  const scheduleForDay = (date: string) =>
    weekReservations.filter((reservation) => reservation.date === date);
  const theme = getPublicBookingTheme(business);
  const isGamingCafe = business.businessType === "playstation_cafe";
  const isLounge = business.businessType === "lounge";
  const bookingLabel = isGamingCafe ? "session" : isLounge ? "reservation" : "appointment";
  const fieldStyle: CSSProperties = {
    backgroundColor: theme.inputBackground,
    borderColor: theme.inputBorder,
    color: theme.inputText,
  };
  const panelStyle: CSSProperties = {
    background: theme.cardBackground,
    borderColor: theme.cardBorder,
    boxShadow: theme.cardShadow,
    color: theme.text,
  };
  const mutedStyle: CSSProperties = { color: theme.muted };
  const labelStyle: CSSProperties = { color: theme.label };

  return (
    <main
      className="min-h-screen bg-slate-50 px-3 pb-5 pt-20 sm:px-4 sm:py-8"
      style={
        {
          "--brand": theme.buttonBackground,
          "--brand-secondary": business.secondaryColor,
          background: theme.pageBackground,
          color: theme.text,
        } as CSSProperties
      }
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="mt-6 flex min-w-0 items-center gap-3">
              {business.logoUrl ? (
                <div
                  className="h-16 w-16 shrink-0 rounded-full border bg-cover bg-center shadow-lg sm:h-20 sm:w-20"
                  role="img"
                  aria-label={`${business.businessName} logo`}
                  style={{
                    backgroundColor: theme.iconBackground,
                    backgroundImage: `url(${business.logoUrl})`,
                    borderColor: theme.cardBorder,
                  }}
                />
              ) : (
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] text-white sm:h-12 sm:w-12"
                  style={{
                    backgroundColor: theme.iconBackground,
                    color: theme.iconText,
                  }}
                >
                  <CalendarCheck className="h-6 w-6" aria-hidden="true" />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="break-words text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
                  <span style={{ color: theme.text }}>
                    {business.businessName}
                  </span>
                </h1>
                <p className="mt-1 text-sm capitalize" style={mutedStyle}>
                  {businessTypeLabels[business.businessType]} {bookingLabel}
                </p>
                {isLounge ? (
                  <p className="mt-2 text-sm font-semibold" style={{ color: theme.text }}>
                    Otaq 8 AZN/saat - PS5 ilə 10 AZN/saat
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div
            className="rounded-[8px] border p-4 text-sm shadow-sm"
            style={{
              background: theme.contactBackground,
              borderColor: theme.cardBorder,
              color: theme.muted,
            }}
          >
            <p className="flex min-w-0 items-center gap-2">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="min-w-0 break-words">
                {business.phone || "Phone not set"}
              </span>
            </p>
            <p className="mt-2 flex min-w-0 items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="min-w-0 break-words">
                {business.address || "Address not set"}
              </span>
            </p>
            <div
              className="mt-4 flex justify-end border-t pt-3"
              style={{
                "--brand": theme.text,
                "--brand-secondary": theme.cardBorder,
              } as CSSProperties}
            >
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mb-6 flex h-1 overflow-hidden rounded-[999px]">
          {theme.accentColors.map((color) => (
            <span
              className="flex-1"
              key={color}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <ToastMessage
          error={params?.error}
          success={params?.success}
        />

        <div className="grid min-w-0 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section
            className="min-w-0 rounded-[8px] border p-4 shadow-sm sm:p-5"
            style={panelStyle}
          >
            <h2 className="font-semibold" style={{ color: theme.text }}>
              {isGamingCafe
                ? "Choose gaming session"
                : isLounge
                  ? "Choose lounge reservation"
                  : "Choose appointment"}
            </h2>
            <p className="mt-1 text-sm" style={mutedStyle}>
              {isGamingCafe
                ? "Pick a package, cabinet or room, and date to see available time slots."
                : isLounge
                  ? "Pick an experience, room or table, and date to see available time slots."
                : "Pick a service, provider, and date to see available time slots."}
            </p>

            {serviceOptions.length && roomOptions.length ? (
              <form className="mt-5 space-y-4">
                <FieldLabel label="Room" labelStyle={labelStyle}>
                  <select
                    className={selectClass}
                    name="staffId"
                    defaultValue={selectedStaff?.id}
                    style={fieldStyle}
                  >
                    {roomOptions.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                  {selectedStaff ? (
                    <p className="mt-2 text-xs" style={mutedStyle}>
                      {selectedStaff.roleSpecialty}
                    </p>
                  ) : null}
                </FieldLabel>
                <FieldLabel label="Room type" labelStyle={labelStyle}>
                  <select
                    className={selectClass}
                    name="serviceId"
                    defaultValue={selectedService?.id}
                    style={fieldStyle}
                  >
                    {serviceOptions.map((service) => (
                      <option key={service.id} value={service.id}>
                        {serviceOptionLabel(service)}
                      </option>
                    ))}
                  </select>
                  {selectedService ? (
                    <p className="mt-2 text-xs" style={mutedStyle}>
                      {selectedService.description}
                    </p>
                  ) : null}
                </FieldLabel>
                <p className="-mt-2 text-xs" style={mutedStyle}>
                  <span>1 hour: </span>
                  {formatCurrency(selectedService?.price ?? 0)}
                  <span>. Choose Standard or PS5 above.</span>
                </p>
                <FieldLabel label="How many hours" labelStyle={labelStyle}>
                  <input
                    className={inputClass}
                    name="hours"
                    type="number"
                    defaultValue={selectedHours}
                    min={1}
                    max={8}
                    step={1}
                    style={fieldStyle}
                  />
                  <p className="mt-2 text-xs" style={mutedStyle}>
                    Enter 1 to 8 hours. The price is charged per hour.
                  </p>
                </FieldLabel>
                <FieldLabel label="Date" labelStyle={labelStyle}>
                  <input
                    className={inputClass}
                    name="date"
                    type="date"
                    defaultValue={selectedDate}
                    min={todayISO()}
                    style={fieldStyle}
                  />
                </FieldLabel>
                <button
                  className="brand-button h-10 w-full rounded-[8px] px-4 text-sm font-semibold transition"
                  type="submit"
                  style={{ color: theme.buttonText }}
                >
                  Check availability
                </button>
              </form>
            ) : (
              <div className="mt-5 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Booking is not ready yet. Add active staff and services in the
                admin dashboard.
              </div>
            )}
          </section>

          <section
            className="min-w-0 rounded-[8px] border p-4 shadow-sm sm:p-5"
            style={panelStyle}
          >
            <h2 className="font-semibold" style={{ color: theme.text }}>
              Book a time
            </h2>
            <p className="mt-1 break-words text-sm leading-6" style={mutedStyle}>
              {selectedService && selectedStaff
                ? `${selectedService.name} ${isGamingCafe || isLounge ? "in" : "with"} ${selectedStaff.name} on ${formatDate(
                    selectedDate,
                  )}`
                : "Select service and staff to continue."}
            </p>

            <form action={publicBookingAction} className="mt-5 space-y-4">
                <input
                  type="hidden"
                  name="serviceId"
                  value={selectedService.id}
                />
                <input type="hidden" name="staffId" value={selectedStaff.id} />
                <input type="hidden" name="date" value={selectedDate} />
                <input type="hidden" name="roomMode" value={selectedRoomMode} />
                <input
                  type="hidden"
                  name="durationMinutes"
                  value={selectedDurationMinutes}
                />
                <FieldLabel label="Available time" labelStyle={labelStyle}>
                  <select
                    className={selectClass}
                    name="startTime"
                    required
                    style={fieldStyle}
                    disabled={!availableSlots.length}
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {formatTime(slot)}
                      </option>
                    ))}
                    {!availableSlots.length ? (
                      <option value="" disabled>
                        No open slots for this period
                      </option>
                    ) : null}
                  </select>
                </FieldLabel>
                <div
                  className="rounded-[8px] border p-3 text-sm"
                  style={{
                    background: theme.softBackground,
                    borderColor: theme.cardBorder,
                  }}
                >
                  <div className="grid gap-2 rounded-[6px] border border-dashed p-3 sm:grid-cols-3" style={{ borderColor: theme.cardBorder }}>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide" style={mutedStyle}>Day</p>
                      <p className="font-semibold" style={{ color: theme.text }}>{formatDate(selectedDate)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide" style={mutedStyle}>Room</p>
                      <p className="font-semibold" style={{ color: theme.text }}>{selectedStaff?.name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide" style={mutedStyle}>Type</p>
                      <p className="font-semibold" style={{ color: theme.text }}>{selectedService?.name}</p>
                    </div>
                  </div>
                  <p className="mt-3 font-semibold" style={{ color: theme.text }}>
                    Weekly timetable for {selectedStaff?.name}
                  </p>
                  <div className="mt-3 min-w-0 max-w-full overflow-x-auto">
                    <div className="min-w-[880px] rounded-[8px] border bg-white text-xs" style={{ borderColor: "#94a3b8", color: "#111827" }}>
                      <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b bg-slate-100 px-3 py-3" style={{ borderColor: "#94a3b8" }}>
                        <div className="font-bold" style={{ color: "#111827" }}>Hour</div>
                        {weekDates.map((date) => (
                          <div key={date} className="border-l border-slate-300 text-center font-bold" style={{ color: "#111827" }}>
                            {getDayLabel(getDayKey(date))}
                            <div className="mt-1 font-medium" style={{ color: "#475569" }}>{date.slice(5)}</div>
                          </div>
                        ))}
                      </div>
                      {hourSlots.map((hour) => (
                        <div key={hour} className="grid min-h-[48px] grid-cols-[100px_repeat(7,1fr)] border-t px-3 py-2" style={{ borderColor: "#cbd5e1" }}>
                          <div className="flex items-center font-semibold" style={{ color: "#1e293b" }}>
                            {minutesToTime(hour * 60)}
                          </div>
                          {weekDates.map((date) => {
                            const dayReservations = scheduleForDay(date);
                            const isBooked = dayReservations.some((reservation) =>
                              overlaps(
                                minutesToTime(hour * 60),
                                minutesToTime(hour * 60 + 60),
                                reservation.startTime,
                                reservation.endTime,
                              ),
                            );
                            return (
                              <div
                                key={`${date}-${hour}`}
                                className="mx-1 flex items-center justify-center rounded-[6px] px-2 py-1 text-center text-[11px] font-semibold"
                                style={{
                                  background: isBooked ? "#fee2e2" : "#ecfdf5",
                                  color: isBooked ? "#b91c1c" : "#166534",
                                }}
                              >
                                {isBooked ? "Booked" : "Free"}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <FieldLabel label="Full name" labelStyle={labelStyle}>
                  <input
                    className={inputClass}
                    name="fullName"
                    required
                    style={fieldStyle}
                  />
                </FieldLabel>
                <FieldLabel label="Phone number" labelStyle={labelStyle}>
                  <input
                    className={inputClass}
                    name="phone"
                    placeholder="+994..."
                    required
                    style={fieldStyle}
                  />
                </FieldLabel>
                <FieldLabel label="Email optional" labelStyle={labelStyle}>
                  <input
                    className={inputClass}
                    name="email"
                    type="email"
                    style={fieldStyle}
                  />
                </FieldLabel>
                <FormSubmitButton
                  label="Submit Booking Request"
                  pendingLabel="Submitting..."
                  style={{ color: theme.buttonText }}
                  disabled={!availableSlots.length}
                />
                <p className="text-xs leading-5" style={mutedStyle}>
                  Your request will be sent as pending. The admin can confirm or
                  cancel it.
                </p>
              </form>
          </section>
        </div>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
              Preview rooms
            </h2>
            <p className="mt-1 text-sm" style={mutedStyle}>
              This gallery previews 27 rooms automatically. The photo updates
              every few seconds.
            </p>
          </div>
          <RoomPhotoCarousel photos={roomPhotos} />
        </section>

      </div>
    </main>
  );
}
