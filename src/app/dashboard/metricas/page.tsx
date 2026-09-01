import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PAISES } from "@/lib/configuracion";

const RANGOS = [
  { clave: "hoy", etiqueta: "Hoy", dias: 1 },
  { clave: "semana", etiqueta: "Última semana", dias: 7 },
  { clave: "mes", etiqueta: "Último mes", dias: 30 },
] as const;

// "reales" agrupa los canales donde hay clientes de verdad. Es el default:
// las pruebas del dueño en el simulador no son ventas y no deben inflar
// las métricas del negocio.
const CANALES = [
  { clave: "reales", etiqueta: "Clientes reales", valores: ["whatsapp", "web"] },
  { clave: "whatsapp", etiqueta: "WhatsApp", valores: ["whatsapp"] },
  { clave: "web", etiqueta: "Web", valores: ["web"] },
  { clave: "simulador", etiqueta: "Simulador", valores: ["simulador"] },
] as const;

type Conversacion = { convirtio: boolean; monto: number };

function desde(dias: number): string {
  const fecha = new Date();
  if (dias === 1) {
    fecha.setHours(0, 0, 0, 0);
  } else {
    fecha.setDate(fecha.getDate() - dias);
  }
  return fecha.toISOString();
}

export default async function MetricasPage({
  searchParams,
}: {
  searchParams: { rango?: string; canal?: string };
}) {
  const rango = RANGOS.find((r) => r.clave === searchParams.rango) ?? RANGOS[1];
  const canal = CANALES.find((c) => c.clave === searchParams.canal) ?? CANALES[0];

  const enlace = (cambios: { rango?: string; canal?: string }) =>
    `/dashboard/metricas?rango=${cambios.rango ?? rango.clave}&canal=${cambios.canal ?? canal.clave}`;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [conversacionesRes, configRes] = await Promise.all([
    supabase
      .from("conversaciones")
      .select("convirtio, monto")
      .eq("user_id", user?.id ?? "")
      .in("canal", [...canal.valores])
      .gte("creado_at", desde(rango.dias)),
    supabase
      .from("configuracion_bot")
      .select("pais")
      .eq("user_id", user?.id ?? "")
      .maybeSingle(),
  ]);

  const filas = (conversacionesRes.data ?? []) as Conversacion[];
  const pais = PAISES.find((p) => p.codigo === configRes.data?.pais) ?? PAISES[0];

  const conversaciones = filas.length;
  const ventas = filas.filter((fila) => fila.convirtio).length;
  const total = filas.reduce((suma, fila) => suma + Number(fila.monto ?? 0), 0);
  const conversion = conversaciones > 0 ? (ventas / conversaciones) * 100 : 0;

  const moneda = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-display text-xl font-semibold text-brand-ink">
        Métricas
      </h1>
      <p className="mt-1 text-sm text-brand-ink/55">
        Lo que gestionó tu bot en el período seleccionado.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Grupo>
          {CANALES.map((opcion) => (
            <Pastilla
              key={opcion.clave}
              href={enlace({ canal: opcion.clave })}
              activa={opcion.clave === canal.clave}
            >
              {opcion.etiqueta}
            </Pastilla>
          ))}
        </Grupo>

        <Grupo>
          {RANGOS.map((opcion) => (
            <Pastilla
              key={opcion.clave}
              href={enlace({ rango: opcion.clave })}
              activa={opcion.clave === rango.clave}
            >
              {opcion.etiqueta}
            </Pastilla>
          ))}
        </Grupo>
      </div>

      <div className="mt-5 grid gap-px overflow-hidden rounded-xl border border-brand-ink/10 bg-brand-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        <Tarjeta
          etiqueta="Ventas totales"
          valor={`${pais.moneda.includes("S/") ? "S/ " : ""}${moneda.format(total)}`}
        />
        <Tarjeta etiqueta="Ventas" valor={String(ventas)} />
        <Tarjeta etiqueta="Conversaciones" valor={String(conversaciones)} />
        <Tarjeta
          etiqueta="Tasa de conversión"
          valor={`${conversion.toFixed(conversion % 1 === 0 ? 0 : 1)}%`}
        />
      </div>

      {canal.clave === "simulador" && conversaciones > 0 && (
        <p className="mt-3 text-xs text-brand-ink/45">
          Son tus propias pruebas del bot, no clientes reales. El simulador no
          cierra ventas, así que las ventas siempre quedan en cero acá.
        </p>
      )}

      {conversaciones === 0 && <Vacio canal={canal.clave} />}
    </div>
  );
}

function Vacio({ canal }: { canal: string }) {
  const esSimulador = canal === "simulador";

  return (
    <div className="mt-6 rounded-xl border border-dashed border-brand-ink/20 bg-white p-8 text-center">
      <p className="font-display text-base font-medium text-brand-ink">
        {esSimulador
          ? "Todavía no probaste el bot en este período"
          : "Todavía no hay conversaciones con clientes en este período"}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-brand-ink/55">
        {esSimulador
          ? "Cada charla que tengas en el simulador queda registrada acá."
          : "Los números se llenan cuando tu bot empiece a atender clientes reales por WhatsApp. Mientras tanto, puedes probarlo en el simulador."}
      </p>
      <Link
        href="/dashboard"
        className="mt-5 inline-block rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink-soft"
      >
        Ir al simulador
      </Link>
    </div>
  );
}

function Grupo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex overflow-hidden rounded-full border border-brand-ink/15 bg-white">
      {children}
    </div>
  );
}

function Pastilla({
  href,
  activa,
  children,
}: {
  href: string;
  activa: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={activa ? "page" : undefined}
      className={`whitespace-nowrap px-4 py-2 text-sm transition ${
        activa
          ? "bg-brand-ink font-medium text-white"
          : "text-brand-ink/60 hover:bg-brand-mist"
      }`}
    >
      {children}
    </Link>
  );
}

function Tarjeta({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="bg-white p-5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-brand-ink/45">
        {etiqueta}
      </span>
      <p className="mt-2 font-display text-3xl font-semibold text-brand-ink">
        {valor}
      </p>
    </div>
  );
}
