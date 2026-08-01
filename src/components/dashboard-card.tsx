import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "teal" | "amber" | "rose" | "slate";
};

const toneClasses = {
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function DashboardCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "slate",
}: DashboardCardProps) {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-[8px] ring-1",
            toneClasses[tone],
          ].join(" ")}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{detail}</p>
    </article>
  );
}
