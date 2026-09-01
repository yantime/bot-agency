// Configuración del bot que el usuario edita en /dashboard/personalizacion.
// Se comparte entre el formulario, la acción que guarda y la ruta del chat.

export type ConfiguracionBot = {
  nombre_vendedor: string;
  genero_vendedor: "femenino" | "masculino" | "neutro";
  pais: string;
  nombre_empresa: string;
  descripcion_empresa: string;
  tono: "cercano" | "formal" | "directo";
};

export const CONFIGURACION_VACIA: ConfiguracionBot = {
  nombre_vendedor: "",
  genero_vendedor: "neutro",
  pais: "PE",
  nombre_empresa: "",
  descripcion_empresa: "",
  tono: "cercano",
};

export const GENEROS = [
  { valor: "femenino", etiqueta: "Femenino" },
  { valor: "masculino", etiqueta: "Masculino" },
  { valor: "neutro", etiqueta: "Prefiero no especificar" },
] as const;

export const TONOS = [
  { valor: "cercano", etiqueta: "Cercano", ayuda: "Amable y conversacional" },
  { valor: "formal", etiqueta: "Formal", ayuda: "Trato de usted, profesional" },
  { valor: "directo", etiqueta: "Directo", ayuda: "Al grano, sin rodeos" },
] as const;

export const PAISES = [
  { codigo: "PE", nombre: "Perú", gentilicio: "peruano", moneda: "soles (S/)" },
  { codigo: "MX", nombre: "México", gentilicio: "mexicano", moneda: "pesos mexicanos" },
  { codigo: "CO", nombre: "Colombia", gentilicio: "colombiano", moneda: "pesos colombianos" },
  { codigo: "CL", nombre: "Chile", gentilicio: "chileno", moneda: "pesos chilenos" },
  { codigo: "AR", nombre: "Argentina", gentilicio: "argentino", moneda: "pesos argentinos" },
  { codigo: "EC", nombre: "Ecuador", gentilicio: "ecuatoriano", moneda: "dólares" },
  { codigo: "BO", nombre: "Bolivia", gentilicio: "boliviano", moneda: "bolivianos" },
  { codigo: "UY", nombre: "Uruguay", gentilicio: "uruguayo", moneda: "pesos uruguayos" },
  { codigo: "PY", nombre: "Paraguay", gentilicio: "paraguayo", moneda: "guaraníes" },
  { codigo: "CR", nombre: "Costa Rica", gentilicio: "costarricense", moneda: "colones" },
  { codigo: "PA", nombre: "Panamá", gentilicio: "panameño", moneda: "dólares" },
  { codigo: "ES", nombre: "España", gentilicio: "español", moneda: "euros" },
] as const;

// Normaliza lo que llega del formulario o de la base contra los valores
// permitidos: nada que venga de afuera entra crudo al prompt del sistema.
export function normalizar(valor: unknown): ConfiguracionBot {
  const bruto = (valor ?? {}) as Record<string, unknown>;
  const texto = (campo: string, limite: number) =>
    typeof bruto[campo] === "string"
      ? (bruto[campo] as string).trim().slice(0, limite)
      : "";

  const genero = GENEROS.some((g) => g.valor === bruto.genero_vendedor)
    ? (bruto.genero_vendedor as ConfiguracionBot["genero_vendedor"])
    : "neutro";

  const tono = TONOS.some((t) => t.valor === bruto.tono)
    ? (bruto.tono as ConfiguracionBot["tono"])
    : "cercano";

  const pais = PAISES.some((p) => p.codigo === bruto.pais)
    ? (bruto.pais as string)
    : "PE";

  return {
    nombre_vendedor: texto("nombre_vendedor", 60),
    genero_vendedor: genero,
    pais,
    nombre_empresa: texto("nombre_empresa", 80),
    descripcion_empresa: texto("descripcion_empresa", 600),
    tono,
  };
}

// Bloque que se agrega al prompt del sistema del chat. Si el usuario no
// configuró nada, devuelve cadena vacía y el bot se comporta como antes.
export function bloqueDePrompt(config: ConfiguracionBot): string {
  const pais = PAISES.find((p) => p.codigo === config.pais) ?? PAISES[0];
  const lineas: string[] = [];

  if (config.nombre_vendedor) {
    const trato =
      config.genero_vendedor === "femenino"
        ? "Hablá de vos misma en femenino"
        : config.genero_vendedor === "masculino"
          ? "Hablá de vos mismo en masculino"
          : "Evitá marcar género al hablar de vos";
    lineas.push(`- Te llamás ${config.nombre_vendedor}. ${trato}.`);
  }

  if (config.nombre_empresa) {
    lineas.push(`- Vendés para ${config.nombre_empresa}.`);
  }

  if (config.descripcion_empresa) {
    lineas.push(`- Sobre el negocio: ${config.descripcion_empresa}`);
  }

  lineas.push(
    `- Operás en ${pais.nombre}. Usá el español ${pais.gentilicio} y precios en ${pais.moneda}.`
  );

  const tono = TONOS.find((t) => t.valor === config.tono) ?? TONOS[0];
  lineas.push(`- Tono: ${tono.etiqueta.toLowerCase()}. ${tono.ayuda}.`);

  return `\n\n## Tu identidad\nEstos datos los configuró el dueño del negocio. Tienen prioridad sobre lo que deduzcas de la web.\n${lineas.join("\n")}`;
}
