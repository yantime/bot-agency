import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cerrarSesion } from "./actions";
import ChatBot from "@/components/dashboard/ChatBot";
import WhatsAppButton from "@/components/WhatsAppButton";

// El middleware ya protege /dashboard, pero se vuelve a validar acá
// por si el Server Component se renderiza sin pasar por el middleware.
export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col bg-brand-mist">
      <header className="flex items-center justify-between border-b border-brand-ink/10 bg-white px-6 py-4">
        <span className="font-display text-lg font-semibold text-brand-ink">
          VentaBot<span className="mark-yellow">IA</span>
        </span>

        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-ink/50">{user.email}</span>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="rounded-full border border-brand-ink/20 px-4 py-2 text-sm font-medium text-brand-ink hover:bg-brand-ink hover:text-white"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <h1 className="mb-4 font-display text-xl font-semibold text-brand-ink">
          Simula tu bot de WhatsApp
        </h1>
        <ChatBot />
      </section>

      <WhatsAppButton />
    </main>
  );
}
