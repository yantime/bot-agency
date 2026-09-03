import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cerrarSesion } from "./actions";
import Sidebar from "@/components/dashboard/Sidebar";
import WhatsAppButton from "@/components/WhatsAppButton";

// El middleware ya protege /dashboard, pero se vuelve a validar acá
// por si el Server Component se renderiza sin pasar por el middleware.
// Hereda a todo /dashboard/*: son pantallas con sesión, nunca indexables.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-mist">
      <header className="flex items-center justify-between border-b border-brand-ink/10 bg-white px-6 py-4">
        <span className="font-display text-lg font-semibold text-brand-ink">
          Angie<span className="mark-yellow">bot</span>
        </span>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-brand-ink/50 sm:inline">
            {user.email}
          </span>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="rounded-full border border-brand-ink/20 px-4 py-2 text-sm font-medium text-brand-ink transition hover:bg-brand-ink hover:text-white"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 px-6 pb-28 pt-8">{children}</main>
      </div>

      <WhatsAppButton />
    </div>
  );
}
