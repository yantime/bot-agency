import Link from "next/link";
import Reveal from "@/components/Reveal";

const planes = [
  {
    nombre: "Free",
    precio: "$0",
    periodo: "/mes",
    descripcion: "Para conocer a Angie sin compromiso.",
    caracteristicas: [
      "1 Angie para tu negocio",
      "100 conversaciones/mes",
      "Integración web básica",
      "Soporte por comunidad",
    ],
    destacado: false,
  },
  {
    nombre: "Starter",
    precio: "$39",
    periodo: "/mes",
    descripcion: "Para negocios que están arrancando con ventas por chat.",
    caracteristicas: [
      "3 Angies en paralelo",
      "750 conversaciones/mes",
      "Integración WhatsApp y web",
      "Soporte por email",
    ],
    destacado: false,
  },
  {
    nombre: "Pro",
    precio: "$99",
    periodo: "/mes",
    descripcion: "Para negocios que quieren escalar sus ventas.",
    caracteristicas: [
      "5 Angies en paralelo",
      "2.500 conversaciones/mes",
      "Integraciones con WhatsApp y web",
      "Reportes y analítica",
      "Soporte prioritario",
    ],
    destacado: true,
  },
  {
    nombre: "Business",
    precio: "$349",
    periodo: "/mes",
    descripcion: "Para equipos con alto volumen de conversaciones.",
    caracteristicas: [
      "Angies ilimitadas",
      "Hasta 5.000 conversaciones/mes",
      "Integraciones personalizadas (CRM, ERP)",
      "SLA dedicado",
      "Account manager",
    ],
    destacado: false,
  },
];

export default function Pricing() {
  return (
    <section id="precios" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-ink/50">
            Planes
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Planes y precios
          </h2>
          <p className="mt-4 text-brand-ink/60">
            Elige cuánto quieres que Angie trabaje por ti.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {planes.map((plan, i) => (
            <Reveal key={plan.nombre} delay={i * 100} className="h-full">
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 transition duration-300 hover:-translate-y-1 ${
                  plan.destacado
                    ? "border-brand-ink bg-brand-ink text-white shadow-xl shadow-brand-ink/10 lg:scale-105"
                    : "border-brand-ink/10 bg-white text-brand-ink hover:shadow-lg"
                }`}
              >
                {plan.destacado && (
                  <span className="mb-4 w-fit rounded-full bg-brand-yellow px-3 py-1 font-mono text-xs uppercase tracking-wide text-brand-ink">
                    Más elegido
                  </span>
                )}

                <h3 className="font-display text-xl font-semibold">
                  {plan.nombre}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    plan.destacado ? "text-white/60" : "text-brand-ink/50"
                  }`}
                >
                  {plan.descripcion}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold">
                    {plan.precio}
                  </span>
                  <span
                    className={plan.destacado ? "text-white/60" : "text-brand-ink/50"}
                  >
                    {plan.periodo}
                  </span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.caracteristicas.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span className={plan.destacado ? "text-brand-yellow" : "text-brand-yellow-deep"}>
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/registro"
                  className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
                    plan.destacado
                      ? "bg-brand-yellow text-brand-ink hover:bg-white"
                      : "border border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white"
                  }`}
                >
                  Elegir {plan.nombre}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
