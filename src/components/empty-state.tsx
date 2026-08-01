import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function EmptyState({ description, icon: Icon, title }: EmptyStateProps) {
  return (
    <div className="rounded-[8px] border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[8px] bg-slate-100 text-slate-500">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="mt-4 font-semibold text-slate-950">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
