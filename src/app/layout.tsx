import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "VentaBot IA | Bots de ventas con inteligencia artificial",
  description:
    "Automatizá tus ventas con agentes de IA que atienden, califican y cierran clientes 24/7.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}
    >
      <body className="bg-white font-body text-brand-ink antialiased">
        {children}
      </body>
    </html>
  );
}
