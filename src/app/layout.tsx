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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITULO = "VentaBot IA | Chatbot para WhatsApp Ventas con Inteligencia Artificial";
const DESCRIPCION =
  "Crea un chatbot para WhatsApp ventas en minutos. Agentes de inteligencia artificial que atienden, califican y cierran clientes 24/7, sin perder el trato humano.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITULO,
    template: "%s | VentaBot IA",
  },
  description: DESCRIPCION,
  keywords: [
    "chatbot para WhatsApp ventas",
    "bot de ventas con IA",
    "chatbot de ventas",
    "agente de ventas con inteligencia artificial",
    "automatizar ventas por WhatsApp",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "VentaBot IA",
    title: TITULO,
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
  },
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
