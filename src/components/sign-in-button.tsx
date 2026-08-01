"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-teal-900 disabled:opacity-80"
      type="submit"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
      )}
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}
