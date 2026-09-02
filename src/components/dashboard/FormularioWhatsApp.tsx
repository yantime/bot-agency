"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  solicitarConexion,
  cancelarSolicitud,
  type EstadoSolicitud,
} from "@/app/dashboard/whatsapp/actions";

export default function FormularioWhatsApp({
  numero,
  pendiente,
}: {
  numero: string;
  pendiente: boolean;
}) {
  const [estado, accion] = useFormState<EstadoSolicitud, FormData>(
    solicitarConexion,
    null
  );

  if (pendiente) {
    return (
      <div className="rounded-xl border border-brand-ink/10 bg-white p-5">
        <h2 className="font-display text-sm font-semibold text-brand-ink">
          Reservaste el {numero}
        </h2>
        <p className="mt-1.5 text-sm text-brand-ink/60">
          Te escribimos a ese mismo número para hacer la verificación con Meta y
          dejar el bot andando.
        </p>
        <form action={cancelarSolicitud} className="mt-3">
          <button
            type="submit"
            className="text-sm text-brand-ink/55 underline-offset-4 transition hover:text-brand-ink hover:underline"
          >
            Usar otro número
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={accion} className="rounded-xl border border-brand-ink/10 bg-white p-5">
      <label
        htmlFor="numero"
        className="block font-display text-sm font-semibold text-brand-ink"
      >
        ¿En qué número quieres que atienda tu bot?
      </label>
      <p className="mt-1 text-sm text-brand-ink/55">
        Con código de país, como aparece en tu WhatsApp.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          id="numero"
          name="numero"
          type="tel"
          inputMode="tel"
          defaultValue={numero}
          maxLength={20}
          placeholder="+51 999 888 777"
          className="w-full max-w-xs rounded-lg border border-brand-ink/15 bg-white px-3 py-2 text-sm text-brand-ink outline-none transition focus:border-brand-ink"
        />
        <Enviar />
      </div>

      {estado && !estado.ok && (
        <p role="status" className="mt-2 text-sm text-red-600">
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}

function Enviar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink-soft disabled:opacity-50"
    >
      {pending ? "Guardando..." : "Reservar mi número"}
    </button>
  );
}
