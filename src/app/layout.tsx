import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RezervAZ",
  description: "Simple reservation MVP for appointment-based businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
