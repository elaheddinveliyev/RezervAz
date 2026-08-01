import type { LucideIcon } from "lucide-react";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-teal-700">RezervAZ</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h1>
      </div>

      <section className="rounded-[8px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[8px] bg-teal-50 text-teal-700">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-slate-950">Coming soon</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      </section>
    </div>
  );
}
