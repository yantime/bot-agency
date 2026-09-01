"use client";

import { useEffect } from "react";

// Boundary de ruta: contiene el crash en el segmento en vez de tumbar la app
// entera con "Application error: a client-side exception has occurred".
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[VentaBot] Error de cliente:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-brand-ink/50">
        Algo falló
      </span>
      <h1 className="mt-3 font-display text-2xl font-semibold text-brand-ink sm:text-3xl">
        No pudimos mostrar esta sección
      </h1>
      <p className="mt-3 max-w-md text-brand-ink/60">
        Fue un problema temporal de tu navegador, no de tu cuenta. Volvé a
        intentar.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-full bg-brand-ink px-6 py-2.5 font-semibold text-white transition hover:bg-brand-ink-soft"
        >
          Reintentar
        </button>
        <a
          href="/"
          className="rounded-full border border-brand-ink/20 px-6 py-2.5 font-semibold text-brand-ink transition hover:border-brand-ink"
        >
          Ir al inicio
        </a>
      </div>

      {error.digest && (
        <p className="mt-6 font-mono text-[11px] text-brand-ink/35">
          Código de error: {error.digest}
        </p>
      )}
    </div>
  );
}
