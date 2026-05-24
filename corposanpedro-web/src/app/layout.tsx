import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CorpoSanpedro - Dashboard",
  description: "Plataforma de gestión operativa CorpoSanpedro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
