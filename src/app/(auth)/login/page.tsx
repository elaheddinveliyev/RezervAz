import { CalendarCheck, ShieldCheck } from "lucide-react";
import { SignInButton } from "@/components/sign-in-button";
import { signInAction, signInDemoAction } from "@/lib/actions";
import { demoUsers, isDemoLoginEnabled, isSupabaseConfigured } from "@/lib/env";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  missing: "Enter both email and password.",
  invalid: "Email or password is incorrect.",
};

export async function LoginPageContent({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next?.startsWith("/dashboard")
    ? params.next
    : "/dashboard";
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const supabaseReady = isSupabaseConfigured();
  const demoLoginReady = isDemoLoginEnabled();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex min-h-[34rem] flex-col justify-between bg-slate-950 p-8 text-white">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-teal-400 text-slate-950">
              <CalendarCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="mt-10 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-200">
                RezervAZ
              </p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Simple reservation dashboard
              </h1>
              <p className="max-w-md text-sm leading-6 text-slate-300">
                A lightweight MVP for clinics, salons, tours, gyms, restaurants,
                and appointment-based businesses in Azerbaijan.
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-teal-300" aria-hidden="true" />
              <span>Protected admin and staff dashboard routes</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarCheck className="h-5 w-5 text-teal-300" aria-hidden="true" />
              <span>Supabase Auth ready, with a local demo fallback</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-medium text-teal-700">Welcome back</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Sign in to RezervAZ
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage reservations, providers, services, and customers from one
                clean workspace.
              </p>
            </div>

            {demoLoginReady ? (
              <div className="mb-5 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">
                  {supabaseReady
                    ? "Development demo login is active"
                    : "Demo login is active"}
                </p>
                <p className="mt-1 text-amber-900">
                  {supabaseReady
                    ? "Supabase is connected. These local accounts still work on this development machine for quick testing."
                    : "Until Supabase environment values are added, you can test with these local accounts."}
                </p>
                <div className="mt-3 grid gap-2">
                  {demoUsers.map((user) => (
                    <form action={signInDemoAction} key={user.email}>
                      <input type="hidden" name="role" value={user.role} />
                      <input type="hidden" name="next" value={nextPath} />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-between rounded-[6px] bg-white/75 px-3 py-2 text-left text-xs text-amber-950 transition hover:bg-white"
                      >
                        <span>
                          <span className="font-semibold">{user.role}</span>:{" "}
                          {user.email}
                        </span>
                        <span className="font-semibold">Continue</span>
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mb-5 rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <form action={signInAction} className="space-y-4" noValidate>
              <input type="hidden" name="next" value={nextPath} />
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  className="mt-2 h-11 w-full rounded-[8px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  name="email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  placeholder="name@example.com"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <input
                  className="mt-2 h-11 w-full rounded-[8px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              <SignInButton />
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  return <LoginPageContent searchParams={searchParams} />;
}

