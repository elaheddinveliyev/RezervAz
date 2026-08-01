import type { CSSProperties } from "react";

export const inputClass =
  "brand-field mt-1 h-10 w-full min-w-0 max-w-full rounded-[8px] border border-slate-300 bg-white px-3 text-sm outline-none transition";

export const textareaClass =
  "brand-field mt-1 min-h-20 w-full min-w-0 max-w-full rounded-[8px] border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition";

export const selectClass = inputClass;

export const labelClass = "text-sm font-medium text-slate-700";

export function FieldLabel({
  children,
  label,
  labelClassName = labelClass,
  labelStyle,
}: {
  children: React.ReactNode;
  label: string;
  labelClassName?: string;
  labelStyle?: CSSProperties;
}) {
  return (
    <label className="block">
      <span className={labelClassName} style={labelStyle}>
        {label}
      </span>
      {children}
    </label>
  );
}
