import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ESTADOS,
  etiquetaDeCanal,
  estiloDeEstado,
  haceCuanto,
  type Contacto,
} from "@/lib/crm";
import { cambiarEstado, borrarContacto } from "./actions";
import NuevoContacto from "@/components/dashboard/NuevoContacto";

const POR_PAGINA = 10;

const ESTILO_PAGINA =
  "rounded-lg border border-brand-ink/15 bg-white px-3 py-1.5 text-brand-ink transition hover:border-brand-ink";

export default async function CrmPage({
  searchParams,
}: {
  searchParams: { estado?: string; q?: string; pagina?: string };
}) {
  const filtro = ESTADOS.find((e) => e.valor === searchParams.estado) ?? null;
  const busqueda = (searchParams.q ?? "").trim();
  const pagina = Math.max(1, Number(searchParams.pagina) || 1);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  // Los contadores de las pastillas necesitan el total por estado. A la escala
  // de un CRM chico, traer los estados y contarlos acá es más simple que una
  // consulta agregada por cada pastilla.
  const { data: todos } = await supabase
    .from("contactos")
    .select("estado")
    .eq("user_id", userId);

  const conteos = (todos ?? []).reduce<Record<string, number>>(
    (acumulado, fila) => {
      acumulado[fila.estado] = (acumulado[fila.estado] ?? 0) + 1;
      return acumulado;
    },
    {}
  );
  const total = todos?.length ?? 0;

  let consulta = supabase
    .from("contactos")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (filtro) consulta = consulta.eq("estado", filtro.valor);

  if (busqueda) {
    // Las comas y paréntesis rompen la sintaxis del filtro `or` de PostgREST.
    const termino = busqueda.replace(/[,()]/g, " ");
    consulta = consulta.or(
      `nombre.ilike.%${termino}%,telefono.ilike.%${termino}%`
    );
  }

  const { data, count } = await consulta
    .order("ultima_actividad", { ascending: false })
    .range((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA - 1);

  const contactos = (data ?? []) as Contacto[];
  const encontrados = count ?? 0;
  const paginas = Math.max(1, Math.ceil(encontrados / POR_PAGINA));

  const enlace = (cambios: {
    estado?: string | null;
    q?: string;
    pagina?: number;
  }) => {
    const params = new URLSearchParams();
    const estado =
      cambios.estado === undefined ? filtro?.valor : cambios.estado;
    const q = cambios.q ?? busqueda;

    if (estado) params.set("estado", estado);
    if (q) params.set("q", q);
    if (cambios.pagina && cambios.pagina > 1) {
      params.set("pagina", String(cambios.pagina));
    }

    const cadena = params.toString();
    return cadena ? `/dashboard/crm?${cadena}` : "/dashboard/crm";
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-brand-ink">
            CRM
          </h1>
          <p className="mt-1 text-sm text-brand-ink/55">
            Las personas que le escriben a Angie, y en qué punto de la venta
            está cada una.
          </p>
        </div>
        <NuevoContacto />
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-2">
        {filtro && <input type="hidden" name="estado" value={filtro.valor} />}
        <input
          name="q"
          defaultValue={busqueda}
          placeholder="Buscar por nombre o teléfono..."
          aria-label="Buscar contactos"
          className="w-full max-w-sm rounded-lg border border-brand-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-ink"
        />
        <button
          type="submit"
          className="rounded-lg border border-brand-ink/20 px-4 py-2 text-sm font-medium text-brand-ink transition hover:bg-brand-ink hover:text-white"
        >
          Buscar
        </button>
        {busqueda && (
          <Link
            href={enlace({ q: "", pagina: 1 })}
            className="self-center px-1 text-sm text-brand-ink/50 underline-offset-4 hover:underline"
          >
            Limpiar
          </Link>
        )}
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pastilla href={enlace({ estado: null, pagina: 1 })} activa={!filtro}>
          Todos ({total})
        </Pastilla>
        {ESTADOS.map((estado) => (
          <Pastilla
            key={estado.valor}
            href={enlace({ estado: estado.valor, pagina: 1 })}
            activa={filtro?.valor === estado.valor}
          >
            {estado.etiqueta} ({conteos[estado.valor] ?? 0})
          </Pastilla>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-brand-ink/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-brand-ink/10 text-left">
                <Th>Contacto</Th>
                <Th>Estado</Th>
                <Th>Canal</Th>
                <Th>Última actividad</Th>
                <th className="px-4 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {contactos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center">
                    <p className="font-display text-base font-medium text-brand-ink">
                      {busqueda || filtro
                        ? "No se encontraron contactos"
                        : "Todavía no hay contactos"}
                    </p>
                    <p className="mx-auto mt-2 max-w-md text-sm text-brand-ink/55">
                      {busqueda || filtro
                        ? "Prueba con otro nombre o quita los filtros."
                        : "Cuando conectes WhatsApp, cada persona que le escriba a Angie aparece acá sola. Mientras tanto, puedes cargarlos a mano."}
                    </p>
                  </td>
                </tr>
              )}

              {contactos.map((contacto) => (
                <tr
                  key={contacto.id}
                  className="border-b border-brand-ink/5 transition-colors last:border-0 hover:bg-brand-mist/50"
                >
                  <td className="px-4 py-3">
                    <span className="block font-medium text-brand-ink">
                      {contacto.nombre || "Sin nombre"}
                    </span>
                    {contacto.telefono && (
                      <span className="block font-mono text-xs text-brand-ink/50">
                        {contacto.telefono}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <form action={cambiarEstado} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={contacto.id} />
                      <select
                        name="estado"
                        defaultValue={contacto.estado}
                        aria-label={`Estado de ${contacto.nombre || "el contacto"}`}
                        className={`cursor-pointer appearance-none rounded-full px-3 py-1 text-xs font-medium outline-none ${estiloDeEstado(
                          contacto.estado
                        )}`}
                      >
                        {ESTADOS.map((estado) => (
                          <option key={estado.valor} value={estado.valor}>
                            {estado.etiqueta}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="text-xs text-brand-ink/40 underline-offset-2 transition hover:text-brand-ink hover:underline"
                      >
                        Guardar
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-brand-ink/60">
                    {etiquetaDeCanal(contacto.canal)}
                  </td>
                  <td className="px-4 py-3 text-brand-ink/60">
                    {haceCuanto(contacto.ultima_actividad)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={borrarContacto}>
                      <input type="hidden" name="id" value={contacto.id} />
                      <button
                        type="submit"
                        className="text-xs text-brand-ink/40 underline-offset-2 transition hover:text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {encontrados > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-brand-ink/55">
          <span>
            Mostrando {(pagina - 1) * POR_PAGINA + 1} a{" "}
            {Math.min(pagina * POR_PAGINA, encontrados)} de {encontrados}
          </span>
          <div className="flex gap-2">
            {pagina > 1 && (
              <Link href={enlace({ pagina: pagina - 1 })} className={ESTILO_PAGINA}>
                Anterior
              </Link>
            )}
            {pagina < paginas && (
              <Link href={enlace({ pagina: pagina + 1 })} className={ESTILO_PAGINA}>
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-brand-ink/45">
      {children}
    </th>
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
      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
        activa
          ? "border-brand-ink bg-brand-yellow font-medium text-brand-ink"
          : "border-brand-ink/15 bg-white text-brand-ink/60 hover:border-brand-ink/40"
      }`}
    >
      {children}
    </Link>
  );
}
