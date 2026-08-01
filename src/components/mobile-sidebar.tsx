"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import type { CurrentUser } from "@/lib/auth";
import type { BusinessSettings } from "@/lib/types";

type MobileSidebarProps = {
  business: BusinessSettings;
  user: CurrentUser;
};

export function MobileSidebar({ business, user }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Open sidebar"
        className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close sidebar"
            className="absolute inset-0 bg-slate-950/45"
            type="button"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative h-full w-72 max-w-[85vw] bg-white shadow-xl">
            <AppSidebar
              business={business}
              user={user}
              onNavigate={() => setIsOpen(false)}
            />
            <button
              aria-label="Close sidebar"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-600 shadow-sm"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
