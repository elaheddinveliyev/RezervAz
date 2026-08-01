import type { WeekDay } from "@/lib/types";
import { weekDays } from "@/lib/types";

type WeekDayCheckboxesProps = {
  selected: WeekDay[];
};

export function WeekDayCheckboxes({ selected }: WeekDayCheckboxesProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {weekDays.map((day) => (
        <label
          key={day.value}
          className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <input
            type="checkbox"
            name="workingDays"
            value={day.value}
            defaultChecked={selected.includes(day.value)}
            className="h-4 w-4 accent-teal-700"
          />
          {day.short}
        </label>
      ))}
    </div>
  );
}
