import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ContactRound,
  Stethoscope,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
  Wallet,
  XCircle,
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";
import { getBusinessSettings, getDashboardStats, listReservations } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency, formatDate, formatTime, todayISO } from "@/lib/time";
import { businessTypeLabels } from "@/lib/types";

export default async function DashboardPage() {
  const [user, business, stats, todayReservations] = await Promise.all([
    getCurrentUser(),
    getBusinessSettings(),
    getDashboardStats(),
    listReservations({ date: todayISO() }),
  ]);
  const cards = [
    {
      title: "Today's Appointments",
      value: String(stats.todayReservations),
      detail: stats.todayReservations
        ? `${formatDate(todayISO())} schedule`
        : "No appointments scheduled today",
      icon: CalendarClock,
      tone: "teal" as const,
    },
    {
      title: "Today's Est. Revenue",
      value: formatCurrency(stats.todayEstimatedRevenue),
      detail: "Confirmed bookings today",
      icon: Wallet,
      tone: "teal" as const,
    },
    {
      title: "Total Est. Revenue",
      value: formatCurrency(stats.totalEstimatedRevenue),
      detail: "Active & completed bookings",
      icon: TrendingUp,
      tone: "teal" as const,
    },
    {
      title: "Total Reservations",
      value: String(stats.totalReservations),
      detail: "All reservations in this workspace",
      icon: ClipboardList,
    },
    {
      title: "Pending",
      value: String(stats.pendingReservations),
      detail: "Bookings waiting for confirmation",
      icon: Clock3,
      tone: "amber" as const,
    },
    {
      title: "Confirmed",
      value: String(stats.confirmedReservations),
      detail: "Upcoming confirmed appointments",
      icon: CheckCircle2,
      tone: "teal" as const,
    },
    {
      title: "Completed",
      value: String(stats.completedReservations),
      detail: "Finished appointments",
      icon: UserRoundCheck,
    },
    {
      title: "Cancelled",
      value: String(stats.cancelledReservations),
      detail: "Cancelled appointments",
      icon: XCircle,
      tone: "rose" as const,
    },
    {
      title: "Staff",
      value: String(stats.staffCount),
      detail: "Active providers",
      icon: UsersRound,
    },
    {
      title: "Services",
      value: String(stats.serviceCount),
      detail: "Active services",
      icon: Stethoscope,
    },
    {
      title: "Customers",
      value: String(stats.customerCount),
      detail: "Saved customer profiles",
      icon: ContactRound,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-teal-700">
            Welcome, {user?.name}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Track today&apos;s appointments, pending bookings, staff, services,
            and customers from one simple reservation workspace.
          </p>
        </div>
        <div className="rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <p className="font-semibold text-slate-950">Business</p>
          <p className="mt-1 text-slate-500">
            {business.businessName} · {businessTypeLabels[business.businessType]}
          </p>
          {business.customDomain ? (
            <p className="mt-1 text-xs text-slate-400">{business.customDomain}</p>
          ) : null}
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[8px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-950">
              Today&apos;s Appointments
            </h2>
          </div>
          {todayReservations.length ? (
            <div className="divide-y divide-slate-100">
              {todayReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {reservation.customer?.fullName ?? "Customer"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {reservation.service?.name ?? "Service"} with{" "}
                      {reservation.staff?.name ?? "staff"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 md:justify-end">
                    <span className="text-sm font-semibold text-slate-700">
                      {formatTime(reservation.startTime)}
                    </span>
                    <StatusBadge status={reservation.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[8px] bg-slate-100 text-slate-500">
                <CalendarClock className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-4 font-semibold text-slate-950">
                No appointments today
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                New reservations will appear here with customer, service, staff,
                time, and status details.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Statuses</h2>
          <div className="mt-4 space-y-3">
            {[
              ["Pending", "bg-amber-100 text-amber-800"],
              ["Confirmed", "bg-teal-100 text-teal-800"],
              ["Completed", "bg-slate-100 text-slate-700"],
              ["Cancelled", "bg-rose-100 text-rose-700"],
            ].map(([label, className]) => (
              <div
                className="flex items-center justify-between rounded-[8px] border border-slate-200 px-3 py-2"
                key={label}
              >
                <span className="text-sm font-medium text-slate-700">
                  {label}
                </span>
                <span
                  className={[
                    "rounded-[999px] px-2 py-1 text-xs font-semibold",
                    className,
                  ].join(" ")}
                >
                  {label === "Pending"
                    ? stats.pendingReservations
                    : label === "Confirmed"
                      ? stats.confirmedReservations
                      : label === "Completed"
                        ? stats.completedReservations
                        : stats.cancelledReservations}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
