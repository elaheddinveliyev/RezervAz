export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse">
      <div className="mb-6">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-64 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            className="h-36 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
            key={index}
          >
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="mt-5 h-8 w-12 rounded bg-slate-200" />
            <div className="mt-5 h-4 w-40 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
