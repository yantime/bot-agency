"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  GENEROS,
  PAISES,
  TONOS,
  type ConfiguracionBot,
} from "@/lib/configuracion";
import {
  guardarConfiguracion,
  type EstadoGuardado,
} from "@/app/dashboard/personalizacion/actions";

const ESTILO_CAMPO =
  "w-full rounded-lg border border-brand-ink/15 bg-white px-3 py-2 text-sm text-brand-ink outline-none transition focus:border-brand-ink";

export default function FormularioPersonalizacion({
  configuracion,
}: {
  configuracion: ConfiguracionBot;
}) {
  const [estado, accion] = useFormState<EstadoGuardado, FormData>(
    guardarConfiguracion,
    null
  );

  return (
    <form action={accion} className="space-y-6">
      <Bloque titulo="El vendedor">
        <Campo etiqueta="Nombre del vendedor" htmlFor="nombre_vendedor">
          <input
            id="nombre_vendedor"
            name="nombre_vendedor"
            defaultValue={configuracion.nombre_vendedor}
            maxLength={60}
            placeholder="Ana"
            className={ESTILO_CAMPO}
          />
        </Campo>

        <Campo etiqueta="Género del vendedor" htmlFor="genero_vendedor">
          <select
            id="genero_vendedor"
            name="genero_vendedor"
            defaultValue={configuracion.genero_vendedor}
            className={ESTILO_CAMPO}
          >
            {GENEROS.map((genero) => (
              <option key={genero.valor} value={genero.valor}>
                {genero.etiqueta}
              </option>
            ))}
          </select>
        </Campo>
      </Bloque>

      <Bloque titulo="El negocio">
        <Campo etiqueta="Nombre de la empresa" htmlFor="nombre_empresa">
          <input
            id="nombre_empresa"
            name="nombre_empresa"
            defaultValue={configuracion.nombre_empresa}
            maxLength={80}
            placeholder="Boutique Lima"
            className={ESTILO_CAMPO}
          />
        </Campo>

        <Campo etiqueta="País de operación" htmlFor="pais">
          <select
            id="pais"
            name="pais"
            defaultValue={configuracion.pais}
            className={ESTILO_CAMPO}
          >
            {PAISES.map((pais) => (
              <option key={pais.codigo} value={pais.codigo}>
                {pais.nombre}
              </option>
            ))}
          </select>
        </Campo>

        <Campo
          etiqueta="Descripción de la empresa"
          htmlFor="descripcion_empresa"
          ayuda="Qué vendés, a quién y qué te diferencia. Angie lo usa para responder."
          ancho
        >
          <textarea
            id="descripcion_empresa"
            name="descripcion_empresa"
            defaultValue={configuracion.descripcion_empresa}
            maxLength={600}
            rows={4}
            placeholder="Vendemos ropa de mujer con entrega en 24 h en Lima. Nuestro fuerte son las tallas grandes."
            className={`${ESTILO_CAMPO} resize-y`}
          />
        </Campo>
      </Bloque>

      <Bloque titulo="Cómo habla">
        <Campo etiqueta="Tono" htmlFor="tono" ancho>
          <div className="grid gap-2 sm:grid-cols-3">
            {TONOS.map((tono) => (
              <label
                key={tono.valor}
                className="flex cursor-pointer items-start gap-2 rounded-lg border border-brand-ink/15 bg-white p-3 transition hover:border-brand-ink/40 has-[:checked]:border-brand-ink has-[:checked]:bg-brand-yellow/15"
              >
                <input
                  type="radio"
                  name="tono"
                  value={tono.valor}
                  defaultChecked={configuracion.tono === tono.valor}
                  className="mt-0.5 accent-brand-ink"
                />
                <span>
                  <span className="block text-sm font-medium text-brand-ink">
                    {tono.etiqueta}
                  </span>
                  <span className="block text-xs text-brand-ink/50">
                    {tono.ayuda}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </Campo>
      </Bloque>

      <div className="flex items-center gap-4">
        <BotonGuardar />
        {estado && (
          <span
            role="status"
            className={`text-sm ${estado.ok ? "text-brand-ink/60" : "text-red-600"}`}
          >
            {estado.mensaje}
          </span>
        )}
      </div>
    </form>
  );
}

function BotonGuardar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-ink-soft disabled:opacity-50"
    >
      {pending ? "Guardando..." : "Guardar cambios"}
    </button>
  );
}

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-brand-ink/10 bg-white p-5">
      <legend className="px-2 font-mono text-[11px] uppercase tracking-widest text-brand-ink/45">
        {titulo}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Campo({
  etiqueta,
  htmlFor,
  ayuda,
  ancho = false,
  children,
}: {
  etiqueta: string;
  htmlFor: string;
  ayuda?: string;
  ancho?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={ancho ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-brand-ink"
      >
        {etiqueta}
      </label>
      {children}
      {ayuda && <p className="mt-1.5 text-xs text-brand-ink/50">{ayuda}</p>}
    </div>
  );
}
