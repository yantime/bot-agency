import Link from "next/link";
import ArrowButton from "@/components/ArrowButton";
import ChatPreview from "@/components/landing/ChatPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-mist bg-brand-radial">
      {/* Ficha amarilla de esquina — guiño al tab fijo "¡Hola, charlemos!" de staffdigital.pe */}
      <div className="absolute right-0 top-0 hidden -rotate-3 translate-x-3 -translate-y-1 bg-brand-yellow px-5 py-3 font-mono text-xs font-medium uppercase tracking-wide text-brand-ink sm:block">
        Probalo ahora ↓
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
        <div className="flex flex-col items-start text-left">
          <span
            className="reveal is-visible mb-6 flex items-center gap-2 rounded-full border border-brand-ink/15 bg-white px-4 py-1 font-mono text-xs uppercase tracking-wider text-brand-ink/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
            Vendé mientras dormís, con IA
          </span>

          <h1
            className="reveal is-visible font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-ink sm:text-5xl md:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Bots de ventas con IA que{" "}
            <span className="mark-yellow">atienden, califican</span> y{" "}
            <span className="mark-yellow">cierran</span> por vos
          </h1>

          <p
            className="reveal is-visible mt-6 max-w-xl text-lg text-brand-ink/70"
            style={{ animationDelay: "180ms" }}
          >
            Automatizá la atención a tus clientes 24/7 con agentes de
            inteligencia artificial entrenados para vender. Sin perder el
            trato humano.
          </p>

          <div
            className="reveal is-visible mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: "280ms" }}
          >
            <Link
              href="/registro"
              className="group flex items-center gap-3 rounded-full bg-brand-ink py-2 pl-6 pr-2 font-semibold text-white transition hover:bg-brand-ink-soft"
            >
              Crear cuenta gratis
              <ArrowButton variant="light" className="h-9 w-9" />
            </Link>
            <a
              href="#como-funciona"
              className="group flex items-center gap-3 rounded-full border border-brand-ink/20 py-2 pl-6 pr-2 font-semibold text-brand-ink transition hover:border-brand-ink"
            >
              Ver cómo funciona
              <ArrowButton variant="ink" className="h-9 w-9" />
            </a>
          </div>
        </div>

        <div
          className="reveal is-visible flex justify-center lg:justify-end"
          style={{ animationDelay: "380ms" }}
        >
          <ChatPreview />
        </div>
      </div>
    </section>
  );
}
