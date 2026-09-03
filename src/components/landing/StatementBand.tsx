export default function StatementBand() {
  return (
    <section className="bg-brand-yellow py-16">
      <div className="mx-auto flex max-w-5xl items-start justify-between gap-6 px-6">
        <p className="font-serif text-2xl font-bold leading-snug text-brand-ink sm:text-3xl md:text-4xl">
          Creemos que vender no debería significar estar disponible las 24
          horas. Por eso existe Angie: el turno de ventas que nunca duerme.
        </p>
        <span className="mt-2 hidden shrink-0 text-2xl text-brand-ink sm:block" aria-hidden>
          ↓
        </span>
      </div>
    </section>
  );
}
