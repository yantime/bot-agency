"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoLogin = {
  error?: string;
};

// Inicia sesión con email y contraseña. Falla si el email aún no fue confirmado.
export async function iniciarSesion(
  _prevState: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Confirmá tu email antes de ingresar." };
    }
    return { error: "Email o contraseña incorrectos." };
  }

  redirect(redirectTo);
}
