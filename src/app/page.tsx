import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatementBand from "@/components/landing/StatementBand";
import TrustMarquee from "@/components/landing/TrustMarquee";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main id="top">
      <Navbar />
      <Hero />
      <StatementBand />
      <TrustMarquee />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
