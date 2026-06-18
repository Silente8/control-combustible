import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Control Combustible ZODI YARACUY",
  description: "Sistema de control de combustible para estación de gasolina",
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
