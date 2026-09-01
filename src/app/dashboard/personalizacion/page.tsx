import { createClient } from "@/lib/supabase/server";
import { CONFIGURACION_VACIA, normalizar } from "@/lib/configuracion";
import FormularioPersonalizacion from "@/components/dashboard/FormularioPersonalizacion";

export default async function PersonalizacionPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El layout ya redirige si no hay sesión; acá sólo se usa el id.
  const { data } = user
    ? await supabase
        .from("configuracion_bot")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const config = data ? normalizar(data) : CONFIGURACION_VACIA;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="font-display text-xl font-semibold text-brand-ink">
        Personalización
      </h1>
      <p className="mb-6 mt-1 text-sm text-brand-ink/55">
        Con quién habla tu cliente y cómo. El simulador usa estos datos en cada
        respuesta.
      </p>

      <FormularioPersonalizacion configuracion={config} />
    </div>
  );
}
