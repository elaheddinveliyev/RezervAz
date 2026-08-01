type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageHeader({
  children,
  description,
  eyebrow = "RezervAZ",
  title,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div className="min-w-0">
        <p className="brand-text text-sm font-medium">{eyebrow}</p>
        <h1 className="mt-2 break-words text-2xl font-semibold text-slate-950">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {children ? <div className="w-full lg:w-auto">{children}</div> : null}
    </div>
  );
}
