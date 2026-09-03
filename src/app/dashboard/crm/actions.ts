"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { esEstado } from "@/lib/crm";

export type EstadoAccion = { ok: boolean; mensaje: string } | null;

export async function crearContacto(
  _anterior: EstadoAccion,
  datos: FormData
): Promise<EstadoAccion> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, mensaje: "Tu sesión expiró. Vuelve a iniciar sesión." };
  }

  const nombre = String(datos.get("nombre") ?? "").trim().slice(0, 80);
  const telefono = String(datos.get("telefono") ?? "").trim().slice(0, 30);
  const notas = String(datos.get("notas") ?? "").trim().slice(0, 500);
  const estadoPedido = datos.get("estado");
  const estado = esEstado(estadoPedido) ? estadoPedido : "nuevo";

  if (!nombre && !telefono) {
    return { ok: false, mensaje: "Escribe al menos un nombre o un teléfono." };
  }

  const { error } = await supabase.from("contactos").insert({
    user_id: user.id,
    nombre,
    telefono,
    notas,
    estado,
    canal: "manual",
  });

  if (error) {
    console.error("[Angie] Error creando contacto:", error);
    return { ok: false, mensaje: "No pudimos guardar el contacto." };
  }

  revalidatePath("/dashboard/crm");
  return { ok: true, mensaje: "Contacto agregado." };
}

export async function cambiarEstado(datos: FormData): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const id = String(datos.get("id") ?? "");
  const estado = datos.get("estado");
  if (!id || !esEstado(estado)) return;

  // El .eq("user_id") es redundante con la política RLS, pero deja explícito
  // en el código que nadie puede tocar el contacto de otro.
  const { error } = await supabase
    .from("contactos")
    .update({ estado, ultima_actividad: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[Angie] Error cambiando estado:", error);
  }

  revalidatePath("/dashboard/crm");
}

export async function borrarContacto(datos: FormData): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const id = String(datos.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase
    .from("contactos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[Angie] Error borrando contacto:", error);
  }

  revalidatePath("/dashboard/crm");
}
