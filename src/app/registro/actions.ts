"use server";

import { createClient } from "@/lib/supabase/server";

export type EstadoAuth = {
  error?: string;
  exito?: boolean;
};

// Registra un usuario nuevo con email y contraseña.
// Supabase envía automáticamente el email de confirmación (configurado en el dashboard de Supabase).
export async function registrarUsuario(
  _prevState: EstadoAuth,
  formData: FormData
): Promise<EstadoAuth> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { exito: true };
}
