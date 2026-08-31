"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { iniciarSesion, type EstadoLogin } from "./actions";

const estadoInicial: EstadoLogin = {};

function BotonSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-brand-ink px-4 py-3 font-semibold text-white transition hover:bg-brand-ink-soft disabled:opacity-60"
    >
      {pending ? "Ingresando..." : "Ingresar"}
    </button>
  );
}

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [estado, formAction] = useFormState(iniciarSesion, estadoInicial);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

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
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-brand-ink"
          placeholder="Tu contraseña"
        />
      </div>

      {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}

      <BotonSubmit />

      <p className="text-center text-sm text-gray-500">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-brand-ink hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
