import type { Metadata } from "next";
import LoginForm from "./LoginForm";

// Pantalla de sesión: no aporta nada en resultados de búsqueda.
export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  const redirectTo = searchParams.redirectTo ?? "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-mist px-6">
      <div className="w-full max-w-md rounded-2xl border border-brand-ink/10 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-brand-ink">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ingresa a tu cuenta y vuelve a trabajar con Angie.
        </p>

        <div className="mt-6">
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  );
}
