"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ContactRound,
  Globe2,
  LayoutDashboard,
  ListChecks,
  Settings,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import type { CurrentUser } from "@/lib/auth";
import type { BusinessSettings } from "@/lib/types";
import { SignOutButton } from "@/components/sign-out-button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Reservations", href: "/dashboard/reservations", icon: ListChecks },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Staff", href: "/dashboard/staff", icon: UsersRound },
  { name: "Services", href: "/dashboard/services", icon: Stethoscope },
  { name: "Customers", href: "/dashboard/customers", icon: ContactRound },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Public Page", href: "/book", icon: Globe2 },
];

type AppSidebarProps = {
  business: BusinessSettings;
  user: CurrentUser;
  onNavigate?: () => void;
};

export function AppSidebar({ business, user, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        {business.logoUrl ? (
          <div
            className="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-slate-950 bg-cover bg-center"
            role="img"
            aria-label={`${business.businessName} logo`}
            style={{ backgroundImage: `url(${business.logoUrl})` }}
          />
        ) : (
          <div className="brand-bg flex h-9 w-9 items-center justify-center rounded-[8px] text-sm font-bold">
            {business.businessName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-950">
            {business.businessName}
          </p>
          <p className="text-xs text-slate-500">Reservation dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={[
                "flex h-10 items-center gap-3 rounded-[8px] px-3 text-sm font-medium transition",
                isActive
                  ? "brand-soft"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="mb-3 rounded-[8px] bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-950">{user.name}</p>
          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
          <div className="mt-3 inline-flex rounded-[999px] bg-white px-2 py-1 text-xs font-semibold capitalize text-teal-700 ring-1 ring-slate-200">
            {user.source === "demo" ? "demo " : ""}
            {user.role}
          </div>
        </div>
        <SignOutButton label="Sign Out" />
      </div>
    </aside>
  );
}
