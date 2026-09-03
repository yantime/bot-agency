import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatementBand from "@/components/landing/StatementBand";
import Integraciones from "@/components/landing/Integraciones";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { SITE_URL } from "@/lib/site";

// El canonical se declara por página, no en el layout raíz: si viviera en el
// layout, /registro heredaría "/" como canónica y quedaría desindexada de hecho.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Los precios tienen que coincidir con los de components/landing/Pricing.tsx:
// marcar un precio que la página no muestra es motivo de penalización manual.
const DATOS_ESTRUCTURADOS = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organizacion`,
      name: "Angie",
      url: SITE_URL,
      description:
        "Angie es una vendedora con inteligencia artificial que atiende WhatsApp: responde, califica y cierra ventas 24/7.",
    },
    {
      "@type": "SoftwareApplication",
      name: "Angie",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, WhatsApp",
      inLanguage: "es",
      publisher: { "@id": `${SITE_URL}/#organizacion` },
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
          url: `${SITE_URL}/registro`,
        },
        {
          "@type": "Offer",
          name: "Starter",
          price: "39",
          priceCurrency: "USD",
          url: `${SITE_URL}/registro`,
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "99",
          priceCurrency: "USD",
          url: `${SITE_URL}/registro`,
        },
        {
          "@type": "Offer",
          name: "Business",
          price: "349",
          priceCurrency: "USD",
          url: `${SITE_URL}/registro`,
        },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(DATOS_ESTRUCTURADOS),
        }}
      />
      <Navbar />
      <Hero />
      <StatementBand />
      <Integraciones />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
