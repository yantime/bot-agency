"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizar } from "@/lib/configuracion";

export type EstadoGuardado = { ok: boolean; mensaje: string } | null;

export async function guardarConfiguracion(
  _anterior: EstadoGuardado,
  datos: FormData
): Promise<EstadoGuardado> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, mensaje: "Tu sesión expiró. Vuelve a iniciar sesión." };
  }

  const config = normalizar(Object.fromEntries(datos));

  const { error } = await supabase.from("configuracion_bot").upsert(
    {
      user_id: user.id,
      ...config,
      actualizado_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[Angie] Error guardando configuración:", error);
    return {
      ok: false,
      mensaje: "No pudimos guardar los cambios. Intenta de nuevo.",
    };
  }

  // El simulador lee esta configuración en cada mensaje.
  revalidatePath("/dashboard/personalizacion");
  return { ok: true, mensaje: "Configuración guardada." };
}
