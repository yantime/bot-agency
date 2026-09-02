"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ESTADOS } from "@/lib/crm";
import { crearContacto, type EstadoAccion } from "@/app/dashboard/crm/actions";

const ESTILO_CAMPO =
  "w-full rounded-lg border border-brand-ink/15 bg-white px-3 py-2 text-sm text-brand-ink outline-none transition focus:border-brand-ink";

export default function NuevoContacto() {
  const [abierto, setAbierto] = useState(false);
  const [estado, accion] = useFormState<EstadoAccion, FormData>(
    crearContacto,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Al guardar bien se limpia el formulario y se cierra, para poder cargar
  // varios contactos seguidos sin borrar los campos a mano.
  useEffect(() => {
    if (estado?.ok) {
      formRef.current?.reset();
      setAbierto(false);
    }
  }, [estado]);

  if (!abierto) {
    return (
      <div className="flex items-center gap-3">
        {estado?.ok && (
          <span role="status" className="text-sm text-brand-ink/55">
            {estado.mensaje}
          </span>
        )}
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink-soft"
        >
          Agregar contacto
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={accion}
      className="w-full rounded-xl border border-brand-ink/10 bg-white p-4 sm:w-auto sm:min-w-[420px]"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="mb-1 block text-xs font-medium text-brand-ink">
            Nombre
          </label>
          <input id="nombre" name="nombre" maxLength={80} placeholder="María Quispe" className={ESTILO_CAMPO} />
        </div>

        <div>
          <label htmlFor="telefono" className="mb-1 block text-xs font-medium text-brand-ink">
            Teléfono
          </label>
          <input id="telefono" name="telefono" maxLength={30} placeholder="+51 999 888 777" className={ESTILO_CAMPO} />
        </div>

        <div>
          <label htmlFor="estado" className="mb-1 block text-xs font-medium text-brand-ink">
            Estado
          </label>
          <select id="estado" name="estado" defaultValue="nuevo" className={ESTILO_CAMPO}>
            {ESTADOS.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notas" className="mb-1 block text-xs font-medium text-brand-ink">
            Notas
          </label>
          <input id="notas" name="notas" maxLength={500} placeholder="Pidió catálogo" className={ESTILO_CAMPO} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Guardar />
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="text-sm text-brand-ink/55 underline-offset-4 hover:underline"
        >
          Cancelar
        </button>
        {estado && !estado.ok && (
          <span role="status" className="text-sm text-red-600">
            {estado.mensaje}
          </span>
        )}
      </div>
    </form>
  );
}

function Guardar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink-soft disabled:opacity-50"
    >
      {pending ? "Guardando..." : "Guardar"}
    </button>
  );
}
