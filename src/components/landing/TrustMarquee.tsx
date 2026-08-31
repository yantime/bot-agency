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

export default function TrustMarquee() {
  const items = [...RUBROS, ...RUBROS];

  return (
    <div className="overflow-hidden border-b border-brand-ink/10 bg-white py-5">
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
  );
}
