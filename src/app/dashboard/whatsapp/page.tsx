import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import FormularioWhatsApp from "@/components/dashboard/FormularioWhatsApp";

// Los tres pasos reales para poner el bot en un WhatsApp de verdad. El primero
// lo hace el usuario desde acá; los otros dos los ejecuta el equipo con la API
// oficial de Meta (WhatsApp Business Platform).
const PASOS = [
  {
    titulo: "Dejas tu número",
    detalle:
      "El número de WhatsApp Business donde quieres que atienda el bot. Si todavía no tienes uno, se puede crear en el momento.",
  },
  {
    titulo: "Verificamos el número con Meta",
    detalle:
      "Se registra en la WhatsApp Business Platform y se verifica que el número sea tuyo. Es el paso que hace Meta, no nosotros.",
  },
  {
    titulo: "Conectamos tu bot",
    detalle:
      "Tu bot queda atendiendo ese número 24/7 con la configuración que cargaste en Personalización.",
  },
];

export default async function WhatsAppPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: conexion } = user
    ? await supabase
        .from("conexion_whatsapp")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const estado = conexion?.estado ?? "no_conectado";
  const pendiente = estado === "pendiente";
  const conectado = estado === "conectado";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-brand-ink">
            WhatsApp
          </h1>
          <p className="mt-1 text-sm text-brand-ink/55">
            Pon tu bot a atender clientes reales en tu número de WhatsApp.
          </p>
        </div>
        <Chip estado={estado} />
      </div>

      {conectado ? (
        <div className="mt-6 rounded-xl border border-brand-ink/10 bg-white p-6">
          <h2 className="font-display text-base font-semibold text-brand-ink">
            Tu bot está atendiendo en {conexion?.numero}
          </h2>
          <p className="mt-2 text-sm text-brand-ink/60">
            Cada conversación queda registrada en el CRM y suma a tus métricas.
          </p>
          <Link
            href="/dashboard/crm"
            className="mt-4 inline-block rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink-soft"
          >
            Ver contactos
          </Link>
        </div>
      ) : (
        <>
          <ol className="mt-6 divide-y divide-brand-ink/10 overflow-hidden rounded-xl border border-brand-ink/10 bg-white">
            {PASOS.map((paso, i) => {
              // Con solicitud enviada, el paso 1 queda cumplido y el 2 en curso.
              const cumplido = pendiente && i === 0;
              const enCurso = pendiente && i === 1;

              return (
                <li key={paso.titulo} className="flex gap-4 p-5">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${
                      cumplido
                        ? "bg-brand-yellow text-brand-ink"
                        : enCurso
                          ? "bg-brand-ink text-white"
                          : "bg-brand-mist text-brand-ink/45"
                    }`}
                  >
                    {cumplido ? "✓" : i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-brand-ink">
                      {paso.titulo}
                    </h3>
                    <p className="mt-1 text-sm text-brand-ink/60">
                      {paso.detalle}
                    </p>
                    {enCurso && (
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-brand-ink/45">
                        En este paso estás
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5">
            <FormularioWhatsApp
              numero={conexion?.numero ?? ""}
              pendiente={pendiente}
            />
          </div>
        </>
      )}

      <p className="mt-6 text-xs text-brand-ink/45">
        La conexión con la WhatsApp Business Platform de Meta está en
        desarrollo. Dejar tu número reserva tu lugar y nos avisa para
        configurarlo contigo; mientras tanto, puedes probar el bot en el{" "}
        <Link href="/dashboard" className="underline underline-offset-2">
          simulador
        </Link>
        .
      </p>
    </div>
  );
}

function Chip({ estado }: { estado: string }) {
  const estilos: Record<string, { texto: string; clase: string }> = {
    conectado: {
      texto: "Conectado",
      clase: "bg-brand-yellow text-brand-ink",
    },
    pendiente: {
      texto: "Solicitud enviada",
      clase: "bg-brand-ink text-white",
    },
    no_conectado: {
      texto: "Sin conectar",
      clase: "border border-brand-ink/20 text-brand-ink/55",
    },
  };

  const { texto, clase } = estilos[estado] ?? estilos.no_conectado;

  return (
    <span
      className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${clase}`}
    >
      {texto}
    </span>
  );
}
