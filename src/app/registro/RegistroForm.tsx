"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { registrarUsuario, type EstadoAuth } from "./actions";

const estadoInicial: EstadoAuth = {};

function BotonSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-brand-ink px-4 py-3 font-semibold text-white transition hover:bg-brand-ink-soft disabled:opacity-60"
    >
      {pending ? "Creando cuenta..." : "Crear cuenta"}
    </button>
  );
}

export default function RegistroForm() {
  const [estado, formAction] = useFormState(registrarUsuario, estadoInicial);

  if (estado.exito) {
    return (
      <div className="rounded-lg border border-brand-yellow-deep/40 bg-brand-yellow/10 p-4 text-sm text-brand-ink">
        ¡Listo! Te enviamos un email de confirmación. Confirmá tu cuenta antes
        de ingresar.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-brand-ink"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-brand-ink"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {estado.error && (
        <p className="text-sm text-red-600">{estado.error}</p>
      )}

      <BotonSubmit />

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-brand-ink hover:underline">
          Ingresa aquí
        </Link>
      </p>
    </form>
  );
}
