import { ContactRound, Mail, Phone } from "lucide-react";
import {
  FieldLabel,
  inputClass,
  textareaClass,
} from "@/components/form-fields";
import { FormSubmitButton } from "@/components/form-submit-button";
import { PageHeader } from "@/components/page-header";
import { ToastMessage } from "@/components/toast-message";
import {
  createCustomerAction,
  deleteCustomerAction,
  updateCustomerAction,
} from "@/lib/actions";
import { listCustomers } from "@/lib/data";

type CustomersPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const customers = await listCustomers();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Customers"
        description="Keep customer names, phone numbers, optional email addresses, and internal notes in one place."
      />
      <ToastMessage error={params?.error} saved={params?.saved} />

      <section className="mb-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-teal-50 text-teal-700">
            <ContactRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Add customer</h2>
            <p className="text-sm text-slate-500">
              Phone is required because WhatsApp reminders use it operationally.
            </p>
          </div>
        </div>
        <form action={createCustomerAction} className="grid gap-4 lg:grid-cols-3">
          <FieldLabel label="Full name">
            <input className={inputClass} name="fullName" required />
          </FieldLabel>
          <FieldLabel label="Phone">
            <input className={inputClass} name="phone" placeholder="+994..." required />
          </FieldLabel>
          <FieldLabel label="Email">
            <input className={inputClass} name="email" type="email" />
          </FieldLabel>
          <div className="lg:col-span-3">
            <FieldLabel label="Notes">
              <textarea className={textareaClass} name="notes" />
            </FieldLabel>
          </div>
          <div className="lg:col-span-3">
            <FormSubmitButton label="Add Customer" />
          </div>
        </form>
      </section>

      {customers.length ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {customers.map((customer) => (
            <details
              key={customer.id}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {customer.fullName}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        {customer.phone}
                      </span>
                      {customer.email ? (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          {customer.email}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {customer.notes || "No notes"}
                    </p>
                  </div>
                </div>
              </summary>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <form
                  action={updateCustomerAction}
                  className="grid gap-4 lg:grid-cols-3"
                >
                  <input type="hidden" name="id" value={customer.id} />
                  <FieldLabel label="Full name">
                    <input
                      className={inputClass}
                      name="fullName"
                      defaultValue={customer.fullName}
                      required
                    />
                  </FieldLabel>
                  <FieldLabel label="Phone">
                    <input
                      className={inputClass}
                      name="phone"
                      defaultValue={customer.phone}
                      required
                    />
                  </FieldLabel>
                  <FieldLabel label="Email">
                    <input
                      className={inputClass}
                      name="email"
                      type="email"
                      defaultValue={customer.email}
                    />
                  </FieldLabel>
                  <div className="lg:col-span-3">
                    <FieldLabel label="Notes">
                      <textarea
                        className={textareaClass}
                        name="notes"
                        defaultValue={customer.notes}
                      />
                    </FieldLabel>
                  </div>
                  <div className="lg:col-span-3">
                    <FormSubmitButton label="Save Customer" />
                  </div>
                </form>
                <form action={deleteCustomerAction} className="mt-3">
                  <input type="hidden" name="id" value={customer.id} />
                  <FormSubmitButton
                    label="Delete Customer"
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
          <p className="font-semibold text-slate-950">No customers yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Add customers manually or let the public booking page create them.
          </p>
        </section>
      )}
    </div>
  );
}
