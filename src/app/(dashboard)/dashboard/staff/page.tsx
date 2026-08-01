import { UsersRound } from "lucide-react";
import {
  FieldLabel,
  inputClass,
  labelClass,
  selectClass,
} from "@/components/form-fields";
import { FormSubmitButton } from "@/components/form-submit-button";
import { PageHeader } from "@/components/page-header";
import { ToastMessage } from "@/components/toast-message";
import { WeekDayCheckboxes } from "@/components/week-day-checkboxes";
import {
  createStaffAction,
  deleteStaffAction,
  updateStaffAction,
} from "@/lib/actions";
import { getBusinessSettings, listStaff } from "@/lib/data";
import { getDayLabel } from "@/lib/time";

type StaffPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function StaffPage({ searchParams }: StaffPageProps) {
  const params = await searchParams;
  const [business, staff] = await Promise.all([
    getBusinessSettings(),
    listStaff(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Staff"
        description="Manage doctors, barbers, guides, trainers, and any other provider who can receive reservations."
      />
      <ToastMessage error={params?.error} saved={params?.saved} />

      <section className="mb-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-teal-50 text-teal-700">
            <UsersRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Add provider</h2>
            <p className="text-sm text-slate-500">
              Use generic roles so this works for clinics, salons, tours, gyms,
              and more.
            </p>
          </div>
        </div>
        <form action={createStaffAction} className="grid gap-4 lg:grid-cols-4">
          <FieldLabel label="Name">
            <input className={inputClass} name="name" required />
          </FieldLabel>
          <FieldLabel label="Role / specialty">
            <input
              className={inputClass}
              name="roleSpecialty"
              placeholder="Dentist, Barber, Guide"
              required
            />
          </FieldLabel>
          <FieldLabel label="Phone">
            <input className={inputClass} name="phone" placeholder="+994..." />
          </FieldLabel>
          <FieldLabel label="Status">
            <select className={selectClass} name="active" defaultValue="on">
              <option value="on">Active</option>
              <option value="">Inactive</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Work start">
            <input
              className={inputClass}
              name="workStart"
              type="time"
              defaultValue={business.workStart}
            />
          </FieldLabel>
          <FieldLabel label="Work end">
            <input
              className={inputClass}
              name="workEnd"
              type="time"
              defaultValue={business.workEnd}
            />
          </FieldLabel>
          <div className="lg:col-span-2">
            <p className={labelClass}>Working days</p>
            <div className="mt-1">
              <WeekDayCheckboxes selected={business.workingDays} />
            </div>
          </div>
          <div className="lg:col-span-4">
            <FormSubmitButton label="Add Staff" />
          </div>
        </form>
      </section>

      {staff.length ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {staff.map((member) => (
            <details
              key={member.id}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-semibold text-slate-950">{member.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {member.roleSpecialty || "Provider"} · {member.phone || "No phone"}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {member.workingDays.map(getDayLabel).join(", ")} ·{" "}
                      {member.workStart}-{member.workEnd}
                    </p>
                  </div>
                  <span
                    className={[
                      "inline-flex w-fit rounded-[999px] px-2 py-1 text-xs font-semibold",
                      member.active
                        ? "bg-teal-100 text-teal-800"
                        : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    {member.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </summary>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <form
                  action={updateStaffAction}
                  className="grid gap-4 lg:grid-cols-4"
                >
                  <input type="hidden" name="id" value={member.id} />
                  <FieldLabel label="Name">
                    <input
                      className={inputClass}
                      name="name"
                      defaultValue={member.name}
                      required
                    />
                  </FieldLabel>
                  <FieldLabel label="Role / specialty">
                    <input
                      className={inputClass}
                      name="roleSpecialty"
                      defaultValue={member.roleSpecialty}
                      required
                    />
                  </FieldLabel>
                  <FieldLabel label="Phone">
                    <input
                      className={inputClass}
                      name="phone"
                      defaultValue={member.phone}
                    />
                  </FieldLabel>
                  <FieldLabel label="Status">
                    <select
                      className={selectClass}
                      name="active"
                      defaultValue={member.active ? "on" : ""}
                    >
                      <option value="on">Active</option>
                      <option value="">Inactive</option>
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Work start">
                    <input
                      className={inputClass}
                      name="workStart"
                      type="time"
                      defaultValue={member.workStart}
                    />
                  </FieldLabel>
                  <FieldLabel label="Work end">
                    <input
                      className={inputClass}
                      name="workEnd"
                      type="time"
                      defaultValue={member.workEnd}
                    />
                  </FieldLabel>
                  <div className="lg:col-span-2">
                    <p className={labelClass}>Working days</p>
                    <div className="mt-1">
                      <WeekDayCheckboxes selected={member.workingDays} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 lg:col-span-4">
                    <FormSubmitButton label="Save Staff" />
                  </div>
                </form>
                <form action={deleteStaffAction} className="mt-3">
                  <input type="hidden" name="id" value={member.id} />
                  <FormSubmitButton
                    label="Delete Staff"
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
          <p className="font-semibold text-slate-950">No staff yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Add at least one provider before creating reservations.
          </p>
        </section>
      )}
    </div>
  );
}
