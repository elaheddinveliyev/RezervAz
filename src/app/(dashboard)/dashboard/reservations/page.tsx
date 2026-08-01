import { ListChecks } from "lucide-react";
import {
  FieldLabel,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/form-fields";
import { FormSubmitButton } from "@/components/form-submit-button";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { ToastMessage } from "@/components/toast-message";
import { WhatsAppCopyButton } from "@/components/whatsapp-copy-button";
import {
  createReservationAction,
  deleteReservationAction,
  updateReservationAction,
} from "@/lib/actions";
import {
  getBusinessSettings,
  getReservationFormOptions,
  listReservations,
} from "@/lib/data";
import { createWhatsAppReminder } from "@/lib/reminders";
import { formatDate, formatTime, todayISO } from "@/lib/time";
import { reservationStatuses } from "@/lib/types";

type ReservationsPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function ReservationsPage({
  searchParams,
}: ReservationsPageProps) {
  const params = await searchParams;
  const [business, reservations, options] = await Promise.all([
    getBusinessSettings(),
    listReservations(),
    getReservationFormOptions(),
  ]);
  const canCreate =
    options.customers.length && options.staff.length && options.services.length;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Reservations"
        description="Create, edit, delete, and confirm appointments. End time is calculated from the selected service duration."
      />
      <ToastMessage error={params?.error} saved={params?.saved} />

      <section className="mb-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-teal-50 text-teal-700">
            <ListChecks className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Create reservation</h2>
            <p className="text-sm text-slate-500">
              Double booking is blocked for the same staff member and overlapping
              time.
            </p>
          </div>
        </div>

        {canCreate ? (
          <form
            action={createReservationAction}
            className="grid gap-4 lg:grid-cols-4"
          >
            <FieldLabel label="Customer">
              <select className={selectClass} name="customerId" required>
                {options.customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.fullName} · {customer.phone}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Staff / provider">
              <select className={selectClass} name="staffId" required>
                {options.staff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} · {staff.roleSpecialty}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Service">
              <select className={selectClass} name="serviceId" required>
                {options.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} · {service.durationMinutes} min
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Status">
              <select className={selectClass} name="status" defaultValue="pending">
                {reservationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Date">
              <input
                className={inputClass}
                name="date"
                type="date"
                defaultValue={todayISO()}
                required
              />
            </FieldLabel>
            <FieldLabel label="Start time">
              <input
                className={inputClass}
                name="startTime"
                type="time"
                defaultValue="10:00"
                required
              />
            </FieldLabel>
            <div className="lg:col-span-2">
              <FieldLabel label="Notes">
                <textarea className={textareaClass} name="notes" />
              </FieldLabel>
            </div>
            <div className="lg:col-span-4">
              <FormSubmitButton label="Create Reservation" />
            </div>
          </form>
        ) : (
          <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Add at least one active staff member, service, and customer before
            creating reservations.
          </div>
        )}
      </section>

      {reservations.length ? (
        <section className="space-y-4">
          {reservations.map((reservation) => (
            <details
              key={reservation.id}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none">
                <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_auto] lg:items-start">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {reservation.customer?.fullName ?? "Customer"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {reservation.service?.name ?? "Service"} with{" "}
                      {reservation.staff?.name ?? "staff"}
                    </p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>
                      {formatDate(reservation.date)} ·{" "}
                      {formatTime(reservation.startTime)}-
                      {formatTime(reservation.endTime)}
                    </p>
                    <p className="mt-1 capitalize">Source: {reservation.source}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <StatusBadge status={reservation.status} />
                    <WhatsAppCopyButton
                      message={createWhatsAppReminder(reservation, business)}
                    />
                  </div>
                </div>
              </summary>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <form
                  action={updateReservationAction}
                  className="grid gap-4 lg:grid-cols-4"
                >
                  <input type="hidden" name="id" value={reservation.id} />
                  <FieldLabel label="Customer">
                    <select
                      className={selectClass}
                      name="customerId"
                      defaultValue={reservation.customerId}
                      required
                    >
                      {options.customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.fullName}
                        </option>
                      ))}
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Staff / provider">
                    <select
                      className={selectClass}
                      name="staffId"
                      defaultValue={reservation.staffId}
                      required
                    >
                      {options.staff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Service">
                    <select
                      className={selectClass}
                      name="serviceId"
                      defaultValue={reservation.serviceId}
                      required
                    >
                      {options.services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} · {service.durationMinutes} min
                        </option>
                      ))}
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Status">
                    <select
                      className={selectClass}
                      name="status"
                      defaultValue={reservation.status}
                    >
                      {reservationStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Date">
                    <input
                      className={inputClass}
                      name="date"
                      type="date"
                      defaultValue={reservation.date}
                      required
                    />
                  </FieldLabel>
                  <FieldLabel label="Start time">
                    <input
                      className={inputClass}
                      name="startTime"
                      type="time"
                      defaultValue={reservation.startTime}
                      required
                    />
                  </FieldLabel>
                  <div className="lg:col-span-2">
                    <FieldLabel label="Notes">
                      <textarea
                        className={textareaClass}
                        name="notes"
                        defaultValue={reservation.notes}
                      />
                    </FieldLabel>
                  </div>
                  <div className="lg:col-span-4">
                    <FormSubmitButton label="Save Reservation" />
                  </div>
                </form>
                <form action={deleteReservationAction} className="mt-3">
                  <input type="hidden" name="id" value={reservation.id} />
                  <FormSubmitButton
                    label="Delete Reservation"
                    pendingLabel="Deleting..."
                    tone="danger"
                  />
                </form>
              </div>
            </details>
          ))}
        </section>
      ) : (
        <section className="rounded-[8px] border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-950">No reservations yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Create the first reservation here or use the public booking page.
          </p>
        </section>
      )}
    </div>
  );
}
