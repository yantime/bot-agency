import RegistroForm from "./RegistroForm";

export default function RegistroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-mist px-6">
      <div className="w-full max-w-md rounded-2xl border border-brand-ink/10 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-brand-ink">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-gray-500">
          Angie te ayuda a vender desde el primer día. Gratis, sin tarjeta.
        </p>

        <div className="mt-6">
          <RegistroForm />
        </div>
      </div>
    </main>
  );
}
