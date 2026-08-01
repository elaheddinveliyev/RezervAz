import { CalendarDays } from "lucide-react";
import { inputClass, selectClass } from "@/components/form-fields";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getBusinessSettings, listReservations, listStaff } from "@/lib/data";
import { formatDate, formatTime, getWeekDates, todayISO } from "@/lib/time";

type CalendarPageProps = {
  searchParams?: Promise<{
    date?: string;
    view?: string;
  }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const params = await searchParams;
  const selectedDate = params?.date || todayISO();
  const view = params?.view === "week" ? "week" : "day";
  const weekDates = getWeekDates(selectedDate);
  const [business, staff, reservations] = await Promise.all([
    getBusinessSettings(),
    listStaff(true),
    view === "week"
      ? listReservations({ from: weekDates[0], to: weekDates[6] })
      : listReservations({ date: selectedDate }),
  ]);
  const dates = view === "week" ? weekDates : [selectedDate];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Calendar"
        description="Daily and weekly views show reservations by staff/provider with status labels."
      >
        <form className="flex flex-wrap gap-3 rounded-[8px] border border-slate-200 bg-white p-3 shadow-sm">
          <input
            className={inputClass}
            name="date"
            type="date"
            defaultValue={selectedDate}
          />
          <select className={selectClass} name="view" defaultValue={view}>
            <option value="day">Daily view</option>
            <option value="week">Weekly view</option>
          </select>
          <button
            className="h-10 rounded-[8px] bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
            type="submit"
          >
            Show
          </button>
        </form>
      </PageHeader>

      <section className="mb-4 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-950">
              {view === "week"
                ? `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`
                : formatDate(selectedDate)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {business.businessName} · {business.workStart}-{business.workEnd}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {reservations.length} reservations
          </div>
        </div>
      </section>

      {staff.length ? (
        <section className="space-y-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="rounded-[8px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold text-slate-950">{member.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {member.roleSpecialty} · {member.workStart}-{member.workEnd}
                </p>
              </div>
              <div
                className={[
                  "grid gap-px bg-slate-100",
                  view === "week" ? "lg:grid-cols-7" : "grid-cols-1",
                ].join(" ")}
              >
                {dates.map((date) => {
                  const dayReservations = reservations.filter(
                    (reservation) =>
                      reservation.staffId === member.id && reservation.date === date,
                  );

                  return (
                    <div key={date} className="min-h-40 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {formatDate(date)}
                      </p>
                      <div className="mt-3 space-y-2">
                        {dayReservations.length ? (
                          dayReservations.map((reservation) => (
                            <div
                              key={reservation.id}
                              className="rounded-[8px] border border-slate-200 p-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-950">
                                  {formatTime(reservation.startTime)}
                                </p>
                                <StatusBadge status={reservation.status} />
                              </div>
                              <p className="mt-2 text-sm text-slate-600">
                                {reservation.customer?.fullName ?? "Customer"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {reservation.service?.name ?? "Service"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-[8px] border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-400">
                            Empty
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="rounded-[8px] border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-950">No active staff</p>
          <p className="mt-2 text-sm text-slate-500">
            Add active providers to use the calendar view.
          </p>
        </section>
      )}
    </div>
  );
}
