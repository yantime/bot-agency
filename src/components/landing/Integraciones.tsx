import Reveal from "@/components/Reveal";

// Sólo lo que existe hoy va como "Activo". Todo lo demás lleva "Próximamente"
// de forma explícita: afirmar integraciones que el MVP no tiene es publicidad
// engañosa (INDECOPI / DL 1044 en Perú), además de quemar credibilidad.
type Estado = "activo" | "pronto";

const CONEXIONES: {
  nombre: string;
  detalle: string;
  estado: Estado;
  icono: React.ReactNode;
}[] = [
  {
    nombre: "Claude",
    detalle: "Motor de IA",
    estado: "activo",
    icono: (
      <path d="M12 2.6c.3 0 .6.2.7.5l1.4 5 3.7-3.7a.8.8 0 0 1 1.2 1l-3.7 3.8 5 1.4a.8.8 0 0 1 0 1.5l-5 1.4 3.7 3.7a.8.8 0 0 1-1.1 1.1l-3.8-3.7-1.4 5a.8.8 0 0 1-1.5 0l-1.4-5-3.7 3.7a.8.8 0 0 1-1.1-1.1l3.7-3.7-5-1.4a.8.8 0 0 1 0-1.5l5-1.4-3.7-3.8a.8.8 0 0 1 1.1-1l3.7 3.7 1.4-5c.1-.3.4-.5.8-.5Z" />
    ),
  },
  {
    nombre: "Simulador",
    detalle: "Prueba tu bot aquí",
    estado: "activo",
    icono: (
      <path d="M4 4.6h16c.7 0 1.2.6 1.2 1.3v9c0 .7-.5 1.3-1.2 1.3h-8.3l-4.4 3.4a.8.8 0 0 1-1.3-.6v-2.8H4c-.7 0-1.2-.6-1.2-1.3v-9c0-.7.5-1.3 1.2-1.3Zm.4 1.7v8.2h2.8c.5 0 .8.4.8.9v1.9l3-2.6c.2-.1.4-.2.6-.2h8V6.3H4.4Z" />
    ),
  },
  {
    nombre: "WhatsApp",
    detalle: "Canal de ventas",
    estado: "pronto",
    icono: (
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.79 2.4a8.2 8.2 0 0 1 2.41 5.83c0 4.55-3.7 8.25-8.25 8.25a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.71-8.24 8.28-8.24Zm-4.55 4.7c-.16 0-.42.06-.65.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.76 2.79 4.35 3.8 2.15.85 2.59.68 3.06.64.47-.04 1.5-.61 1.71-1.2.21-.6.21-1.11.15-1.21-.06-.11-.23-.17-.48-.3-.25-.13-1.5-.74-1.73-.83-.23-.08-.4-.13-.57.13-.17.25-.65.83-.8 1-.15.17-.29.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.4-.79-1.91-.2-.5-.42-.44-.57-.44Z" />
    ),
  },
  {
    nombre: "Widget web",
    detalle: "Chat en tu sitio",
    estado: "pronto",
    icono: (
      <path d="M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Zm6.4 8.4h-3a15.6 15.6 0 0 0-1.2-5.3 7.6 7.6 0 0 1 4.2 5.3Zm-6.4-5.6c.7 1 1.5 2.9 1.7 5.6h-3.4c.2-2.7 1-4.6 1.7-5.6ZM4.4 12.8h3c.1 2 .5 3.8 1.2 5.3a7.6 7.6 0 0 1-4.2-5.3Zm3-1.6h-3a7.6 7.6 0 0 1 4.2-5.3 15.6 15.6 0 0 0-1.2 5.3Zm4.6 7.2c-.7-1-1.5-2.9-1.7-5.6h3.4c-.2 2.7-1 4.6-1.7 5.6Zm2.2.1c.7-1.5 1.1-3.3 1.2-5.3h3a7.6 7.6 0 0 1-4.2 5.3Z" />
    ),
  },
  {
    nombre: "Google Calendar",
    detalle: "Agenda de demos",
    estado: "pronto",
    icono: (
      <path d="M7.5 2.6c.5 0 .9.4.9.9v1h7.2v-1a.9.9 0 0 1 1.8 0v1H19c1 0 1.9.8 1.9 1.9V19c0 1-.9 1.9-1.9 1.9H5c-1 0-1.9-.9-1.9-1.9V6.4c0-1 .9-1.9 1.9-1.9h1.6v-1c0-.5.4-.9.9-.9ZM4.9 9.4V19c0 .1 0 .1.1.1h14c.1 0 .1 0 .1-.1V9.4H4.9Zm14.2-1.8V6.4c0-.1 0-.1-.1-.1h-1.6v.9a.9.9 0 0 1-1.8 0v-.9H8.4v.9a.9.9 0 0 1-1.8 0v-.9H5c-.1 0-.1 0-.1.1v1.2h14.2Z" />
    ),
  },
];

const RUBROS = [
  "Inmobiliarias",
  "Clínicas y estética",
  "E-commerce",
  "Estudios jurídicos",
  "Concesionarias",
  "Agencias de viaje",
  "Educación online",
  "Retail",
];

export default function Integraciones() {
  const items = [...RUBROS, ...RUBROS];

  return (
    <section
      id="integraciones"
      className="border-b border-brand-ink/10 bg-white pt-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-ink/50">
            Canales y conexiones
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-brand-ink sm:text-3xl">
            Dónde vive tu bot
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 divide-x divide-y divide-brand-ink/10 border border-brand-ink/10 lg:grid-cols-5 lg:divide-y-0">
          {CONEXIONES.map((item, i) => {
            const activo = item.estado === "activo";
            return (
              <Reveal key={item.nombre} delay={i * 90} className="h-full">
                <div className="group flex h-full flex-col items-center gap-2.5 p-6 text-center transition-colors duration-300 hover:bg-brand-yellow/10">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`transition-colors duration-300 ${
                      activo
                        ? "text-brand-ink/70 group-hover:text-brand-ink"
                        : "text-brand-ink/20 group-hover:text-brand-ink/40"
                    }`}
                    aria-hidden
                  >
                    {item.icono}
                  </svg>

                  <span
                    className={`font-display text-sm font-medium leading-tight ${
                      activo ? "text-brand-ink" : "text-brand-ink/45"
                    }`}
                  >
                    {item.nombre}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-brand-ink/40">
                    {item.detalle}
                  </span>

                  <span
                    className={`mt-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                      activo
                        ? "bg-brand-yellow text-brand-ink"
                        : "border border-brand-ink/15 text-brand-ink/40"
                    }`}
                  >
                    {activo ? "Activo" : "Próximamente"}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <p className="mt-6 text-center text-sm text-brand-ink/50">
            ¿Necesitás WhatsApp funcionando ya?{" "}
            <a
              href="#precios"
              className="border-b border-brand-ink/30 text-brand-ink transition hover:border-brand-yellow-deep"
            >
              Lo configuramos a medida
            </a>
            .
          </p>
        </Reveal>
      </div>

      <div className="mt-14 overflow-hidden border-t border-brand-ink/10 py-5">
        <div className="mb-1 text-center font-mono text-[11px] uppercase tracking-widest text-brand-ink/40">
          Pensado para negocios que venden todos los días
        </div>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {items.map((rubro, i) => (
            <span
              key={i}
              className="font-display text-lg font-medium text-brand-ink/25"
            >
              {rubro}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
