import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Sólo las rutas que necesitan sesión. La landing es estática y pública:
     * correrle un getUser() contra Supabase le sumaba una ida y vuelta de red a
     * cada visita anónima (y a cada rastreo de Google) sin usar el resultado.
     */
    "/dashboard/:path*",
    "/login",
    "/registro",
    "/auth/:path*",
  ],
};
