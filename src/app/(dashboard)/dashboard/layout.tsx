import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { getCurrentUser } from "@/lib/auth";
import { getBusinessSettings } from "@/lib/data";
import { getAdminLoginPath } from "@/lib/env";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, business] = await Promise.all([
    getCurrentUser(),
    getBusinessSettings(),
  ]);

  if (!user) {
    redirect(getAdminLoginPath());
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={
        {
          "--brand": business.primaryColor,
          "--brand-secondary": business.secondaryColor,
        } as CSSProperties
      }
    >
      <div className="fixed inset-y-0 left-0 hidden w-72 md:block">
        <AppSidebar user={user} business={business} />
      </div>
      <div className="md:pl-72">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-3 backdrop-blur sm:px-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <MobileSidebar user={user} business={business} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                {business.businessName}
              </p>
              <p className="truncate text-lg font-semibold text-slate-950">
                Dashboard
              </p>
            </div>
          </div>
          <div className="hidden rounded-[999px] border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 sm:block">
            {user.role === "admin" ? "Admin" : "Staff"}
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
