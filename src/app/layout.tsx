import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f766e",
};

export const metadata: Metadata = {
  title: "RezervAZ — Online Reservation & Booking Platform",
  description:
    "All-in-one appointment booking and reservation management platform for service businesses in Azerbaijan.",
  openGraph: {
    title: "RezervAZ — Online Reservation & Booking Platform",
    description:
      "All-in-one appointment booking and reservation management platform for service businesses in Azerbaijan.",
    type: "website",
    locale: "az_AZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body className="antialiased">{children}</body>
    </html>
  );
}
