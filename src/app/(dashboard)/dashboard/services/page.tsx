import { Stethoscope } from "lucide-react";
import {
  FieldLabel,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/form-fields";
import { FormSubmitButton } from "@/components/form-submit-button";
import { PageHeader } from "@/components/page-header";
import { ToastMessage } from "@/components/toast-message";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
} from "@/lib/actions";
import { listServices } from "@/lib/data";
import { formatCurrency } from "@/lib/time";

type ServicesPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const services = await listServices();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Services"
        description="Define bookable services with duration and price. Duration is used automatically to calculate reservation end time."
      />
      <ToastMessage error={params?.error} saved={params?.saved} />

      <section className="mb-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-teal-50 text-teal-700">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Add service</h2>
            <p className="text-sm text-slate-500">
              Examples: dental consultation, haircut, tour package, gym session.
            </p>
          </div>
        </div>
        <form action={createServiceAction} className="grid gap-4 lg:grid-cols-4">
          <FieldLabel label="Service name">
            <input className={inputClass} name="name" required />
          </FieldLabel>
          <FieldLabel label="Duration">
            <input
              className={inputClass}
              name="durationMinutes"
              type="number"
              min="5"
              step="5"
              defaultValue="30"
              required
            />
          </FieldLabel>
          <FieldLabel label="Price">
            <input
              className={inputClass}
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
            />
          </FieldLabel>
          <FieldLabel label="Status">
            <select className={selectClass} name="active" defaultValue="on">
              <option value="on">Active</option>
              <option value="">Inactive</option>
            </select>
          </FieldLabel>
          <div className="lg:col-span-4">
            <FieldLabel label="Description">
              <textarea className={textareaClass} name="description" />
            </FieldLabel>
          </div>
          <div className="lg:col-span-4">
            <FormSubmitButton label="Add Service" />
          </div>
        </form>
      </section>

      {services.length ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {services.map((service) => (
            <details
              key={service.id}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-semibold text-slate-950">{service.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {service.durationMinutes} min · {formatCurrency(service.price)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {service.description || "No description"}
                    </p>
                  </div>
                  <span
                    className={[
                      "inline-flex w-fit rounded-[999px] px-2 py-1 text-xs font-semibold",
                      service.active
                        ? "bg-teal-100 text-teal-800"
                        : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    {service.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </summary>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <form
                  action={updateServiceAction}
                  className="grid gap-4 lg:grid-cols-4"
                >
                  <input type="hidden" name="id" value={service.id} />
                  <FieldLabel label="Service name">
                    <input
                      className={inputClass}
                      name="name"
                      defaultValue={service.name}
                      required
                    />
                  </FieldLabel>
                  <FieldLabel label="Duration">
                    <input
                      className={inputClass}
                      name="durationMinutes"
                      type="number"
                      min="5"
                      step="5"
                      defaultValue={service.durationMinutes}
                      required
                    />
                  </FieldLabel>
                  <FieldLabel label="Price">
                    <input
                      className={inputClass}
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={service.price}
                    />
                  </FieldLabel>
                  <FieldLabel label="Status">
                    <select
                      className={selectClass}
                      name="active"
                      defaultValue={service.active ? "on" : ""}
                    >
                      <option value="on">Active</option>
                      <option value="">Inactive</option>
                    </select>
                  </FieldLabel>
                  <div className="lg:col-span-4">
                    <FieldLabel label="Description">
                      <textarea
                        className={textareaClass}
                        name="description"
                        defaultValue={service.description}
                      />
                    </FieldLabel>
                  </div>
                  <div className="lg:col-span-4">
                    <FormSubmitButton label="Save Service" />
                  </div>
                </form>
                <form action={deleteServiceAction} className="mt-3">
                  <input type="hidden" name="id" value={service.id} />
                  <FormSubmitButton
                    label="Delete Service"
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
          <p className="font-semibold text-slate-950">No services yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Add at least one active service before accepting bookings.
          </p>
        </section>
      )}
    </div>
  );
}
