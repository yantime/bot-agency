import Reveal from "@/components/Reveal";

const pasos = [
  {
    numero: "01",
    titulo: "Conecta tu bot",
    descripcion:
      "Configura tu agente de ventas en minutos, sin código. Define tu producto, tono y objetivos.",
  },
  {
    numero: "02",
    titulo: "El bot conversa",
    descripcion:
      "La IA responde a tus clientes en tiempo real, resuelve dudas y detecta oportunidades de venta.",
  },
  {
    numero: "03",
    titulo: "Cierras más ventas",
    descripcion:
      "El bot guía la conversación hacia el cierre o agenda demos automáticamente. Tú solo recibes los resultados.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-brand-mist py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-ink/50">
            El flujo
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Cómo funciona
          </h2>
          <p className="mt-4 text-brand-ink/60">
            Tres pasos simples para tener tu equipo de ventas con IA
            funcionando.
          </p>
        </Reveal>

        <div className="mt-16 grid divide-y divide-brand-ink/10 border border-brand-ink/10 bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
          {pasos.map((paso, i) => (
            <Reveal key={paso.numero} delay={i * 120} className="h-full">
              <div className="group h-full p-10 transition-colors duration-300 hover:bg-brand-yellow/10">
                <span className="font-display text-4xl font-semibold text-brand-ink/15 transition group-hover:text-brand-yellow-deep">
                  {paso.numero}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-brand-ink">
                  {paso.titulo}
                </h3>
                <p className="mt-2 text-brand-ink/60">{paso.descripcion}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
