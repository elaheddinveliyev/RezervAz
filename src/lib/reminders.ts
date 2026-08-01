import { formatDate, formatTime } from "@/lib/time";
import type { BusinessSettings, Reservation } from "@/lib/types";

export function createWhatsAppReminder(
  reservation: Reservation,
  business: BusinessSettings,
) {
  const customer = reservation.customer?.fullName ?? "Müştəri";
  const service = reservation.service?.name ?? "xidmət";

  return `Salam, ${customer}. Sizin ${business.businessName}-də ${formatDate(
    reservation.date,
  )} saat ${formatTime(reservation.startTime)}-da ${service} üçün rezervasiyanız var.`;
}
