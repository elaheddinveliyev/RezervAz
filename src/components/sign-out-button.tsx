"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions";

type SignOutButtonProps = {
  label?: string;
};

export function SignOutButton({ label = "Sign Out" }: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <button
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        type="submit"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
    </form>
  );
}
