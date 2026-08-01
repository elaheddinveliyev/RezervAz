import type { ReservationStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: ReservationStatus;
};

const statusClasses: Record<ReservationStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-teal-100 text-teal-800",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-[999px] px-2 py-1 text-xs font-semibold capitalize",
        statusClasses[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}
