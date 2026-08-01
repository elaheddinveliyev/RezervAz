"use client";

import { Loader2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  style?: CSSProperties;
  tone?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

const toneClasses = {
  primary: "brand-button disabled:opacity-80",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:bg-slate-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-800",
};

export function FormSubmitButton({
  label,
  pendingLabel = "Saving...",
  style,
  tone = "primary",
  disabled = false,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={[
        "inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto",
        toneClasses[tone],
      ].join(" ")}
      style={style}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}
