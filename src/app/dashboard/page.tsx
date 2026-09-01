import ChatBot from "@/components/dashboard/ChatBot";

// La sesión y el chrome (header, sidebar) los resuelve dashboard/layout.tsx.
export default function SimuladorPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="font-display text-xl font-semibold text-brand-ink">
        Simula tu bot de WhatsApp
      </h1>
      <p className="mb-4 mt-1 text-sm text-brand-ink/55">
        Comparte el link de tu web y prueba cómo respondería tu bot a un cliente
        real.
      </p>
      <ChatBot />
    </div>
  );
}
