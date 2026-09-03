import ArrowButton from "@/components/ArrowButton";

export default function Footer() {
  return (
    <footer className="bg-brand-ink py-12 text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 sm:flex-row">
        <span className="font-display text-lg font-semibold text-white">
          Angie<span className="text-brand-yellow">bot</span>
        </span>

        <p className="text-sm">
          © {new Date().getFullYear()} Angie. Todos los derechos
          reservados.
        </p>

        <div className="flex items-center gap-6 text-sm">
          <a href="#como-funciona" className="hover:text-white">
            Cómo funciona
          </a>
          <a href="#precios" className="hover:text-white">
            Precios
          </a>
          <a
            href="#top"
            aria-label="Volver arriba"
            className="group inline-flex"
          >
            <ArrowButton variant="light" className="-rotate-90" />
          </a>
        </div>
      </div>
    </footer>
  );
}
