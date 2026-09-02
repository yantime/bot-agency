"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type EstadoSolicitud = { ok: boolean; mensaje: string } | null;

// Guarda el número y deja la conexión en "pendiente". El salto a "conectado"
// lo hará la integración con la API de Meta cuando exista: ninguna pantalla
// se marca conectada por su cuenta.
export async function solicitarConexion(
  _anterior: EstadoSolicitud,
  datos: FormData
): Promise<EstadoSolicitud> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, mensaje: "Tu sesión expiró. Vuelve a iniciar sesión." };
  }

  const numero = String(datos.get("numero") ?? "")
    .replace(/[^\d+]/g, "")
    .slice(0, 20);

  // Un número de WhatsApp con código de país tiene al menos 8 dígitos.
  if (numero.replace(/\D/g, "").length < 8) {
    return {
      ok: false,
      mensaje: "Escribe el número completo con código de país.",
    };
  }

  const { error } = await supabase.from("conexion_whatsapp").upsert(
    {
      user_id: user.id,
      numero,
      estado: "pendiente",
      solicitado_at: new Date().toISOString(),
      actualizado_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[VentaBot] Error guardando conexión de WhatsApp:", error);
    return { ok: false, mensaje: "No pudimos guardar tu solicitud." };
  }

  revalidatePath("/dashboard/whatsapp");
  return { ok: true, mensaje: "Solicitud registrada." };
}

export async function cancelarSolicitud(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("conexion_whatsapp")
    .update({
      estado: "no_conectado",
      solicitado_at: null,
      actualizado_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("[VentaBot] Error cancelando la solicitud:", error);
  }

  revalidatePath("/dashboard/whatsapp");
}
