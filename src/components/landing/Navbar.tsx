import Link from "next/link";
import ArrowButton from "@/components/ArrowButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-ink/10 bg-brand-mist/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display">
          <span className="h-2 w-2 rounded-full bg-brand-yellow" />
          <span className="text-xl font-semibold text-brand-ink">
            VentaBot<span className="mark-yellow">IA</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#como-funciona"
            className="group relative text-sm text-brand-ink/70 transition hover:text-brand-ink"
          >
            Cómo funciona
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-ink transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#precios"
            className="group relative text-sm text-brand-ink/70 transition hover:text-brand-ink"
          >
            Precios
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-ink transition-all duration-300 group-hover:w-full" />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-brand-ink/70 hover:text-brand-ink"
          >
            Ingresar
          </Link>
          <Link
            href="/registro"
            className="group flex items-center gap-2 rounded-full bg-brand-ink py-1.5 pl-4 pr-1.5 text-sm font-semibold text-white transition hover:bg-brand-ink-soft"
          >
            Empezar gratis
            <ArrowButton variant="light" className="h-7 w-7" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
