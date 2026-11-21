import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finanzas | Panel personal",
  description: "Panel de control para tus finanzas personales.",
};

// Color de la barra del navegador en móvil
export const viewport: Viewport = {
  themeColor: "#ee8e6e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${quicksand.className} min-h-screen bg-[#f8e3da] text-[#4a3a36] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}