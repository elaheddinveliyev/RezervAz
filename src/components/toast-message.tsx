type ToastMessageProps = {
  error?: string;
  saved?: string;
  success?: string;
};

export function ToastMessage({ error, saved, success }: ToastMessageProps) {
  if (!error && !saved && !success) {
    return null;
  }

  if (error) {
    return (
      <div className="mb-5 rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-[8px] border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
      {success ? "Booking request sent." : "Changes saved."}
    </div>
  );
}
