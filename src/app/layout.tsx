import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ZODI_ORGANIZATION, APP_TITLE } from "@/lib/branding";

export const metadata: Metadata = {
  title: `${APP_TITLE} — ${ZODI_ORGANIZATION}`,
  description: "Sistema de control de combustible multi-estación",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
