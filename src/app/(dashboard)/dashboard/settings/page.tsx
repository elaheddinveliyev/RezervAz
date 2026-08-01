import { Palette, Settings } from "lucide-react";
import { cookies } from "next/headers";
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
  applyDemoPresetAction,
  saveBusinessSettingsAction,
} from "@/lib/actions";
import { getBusinessSettings } from "@/lib/data";
import {
  DEMO_SESSION_COOKIE,
  isAppRole,
  isDemoDataEnabled,
  isSupabaseConfigured,
} from "@/lib/env";
import {
  businessTypeLabels,
  businessTypes,
  demoPresetLabels,
  demoPresets,
} from "@/lib/types";

type SettingsPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const business = await getBusinessSettings();
  const supabaseReady = isSupabaseConfigured();
  const demoSessionActive = isAppRole(
    cookieStore.get(DEMO_SESSION_COOKIE)?.value,
  );
  const demoPresetsEnabled =
    !supabaseReady || isDemoDataEnabled() || demoSessionActive;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Business Settings"
        description="Customize this white-label reservation system for any company: clinic, dental, beauty, nail salon, PlayStation cafe, lounge, stadium, gym, tour, restaurant, or agro-tourism."
      />
      <ToastMessage error={params?.error} saved={params?.saved} />

      {demoPresetsEnabled ? (
        <section className="mb-6 rounded-[8px] border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-950">Demo modes</h2>
          <p className="mt-1 text-sm text-amber-900">
            These buttons reset the local demo data for quick sales demos. Use
            QGC gaming or LaLiga lounge when pitching game-center customers.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {demoPresets.map((value) => (
              <form action={applyDemoPresetAction} key={value}>
                <input type="hidden" name="preset" value={value} />
                <FormSubmitButton
                  label={demoPresetLabels[value]}
                  pendingLabel="Loading..."
                  tone="secondary"
                />
              </form>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="brand-soft flex h-10 w-10 items-center justify-center rounded-[8px]">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Company profile</h2>
            <p className="text-sm text-slate-500">
              These values control the dashboard, public booking page, company
              colors, and deployment/domain notes.
            </p>
          </div>
        </div>
        <form
          action={saveBusinessSettingsAction}
          className="grid gap-4 lg:grid-cols-4"
        >
          <FieldLabel label="Business name">
            <input
              className={inputClass}
              name="businessName"
              defaultValue={business.businessName}
              required
            />
          </FieldLabel>
          <FieldLabel label="Business type">
            <select
              className={selectClass}
              name="businessType"
              defaultValue={business.businessType}
            >
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {businessTypeLabels[type]}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Phone">
            <input
              className={inputClass}
              name="phone"
              defaultValue={business.phone}
            />
          </FieldLabel>
          <FieldLabel label="Address">
            <input
              className={inputClass}
              name="address"
              defaultValue={business.address}
            />
          </FieldLabel>
          <FieldLabel label="Public slug">
            <input
              className={inputClass}
              name="publicSlug"
              placeholder="company-name"
              defaultValue={business.publicSlug}
            />
          </FieldLabel>
          <FieldLabel label="Custom domain">
            <input
              className={inputClass}
              name="customDomain"
              placeholder="booking.company.az"
              defaultValue={business.customDomain}
            />
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
          <FieldLabel label="Logo placeholder">
            <input
              className={inputClass}
              name="logoUrl"
              placeholder="Optional URL"
              defaultValue={business.logoUrl}
            />
          </FieldLabel>
          <FieldLabel label="Primary color">
            <div className="mt-1 flex h-10 items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-2">
              <Palette className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <input
                className="h-7 w-12 border-0 bg-transparent p-0"
                name="primaryColor"
                type="color"
                defaultValue={business.primaryColor}
              />
              <span className="text-xs text-slate-500">
                {business.primaryColor}
              </span>
            </div>
          </FieldLabel>
          <FieldLabel label="Secondary color">
            <div className="mt-1 flex h-10 items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-2">
              <Palette className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <input
                className="h-7 w-12 border-0 bg-transparent p-0"
                name="secondaryColor"
                type="color"
                defaultValue={business.secondaryColor}
              />
              <span className="text-xs text-slate-500">
                {business.secondaryColor}
              </span>
            </div>
          </FieldLabel>
          <div className="lg:col-span-4">
            <p className={labelClass}>Working days</p>
            <div className="mt-1">
              <WeekDayCheckboxes selected={business.workingDays} />
            </div>
          </div>
          <div className="lg:col-span-4">
            <FormSubmitButton label="Save Settings" />
          </div>
        </form>
      </section>
    </div>
  );
}
