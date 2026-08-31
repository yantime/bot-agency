import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Ruta a la que Supabase redirige tras confirmar el email (link del correo).
// Intercambia el código por una sesión activa y manda al usuario al dashboard.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
