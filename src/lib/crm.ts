// Tipos y catálogos del CRM. Se comparten entre la página, la tabla y las
// acciones del servidor.

export type EstadoContacto =
  | "nuevo"
  | "conversando"
  | "calificado"
  | "cliente"
  | "perdido";

export type Contacto = {
  id: string;
  nombre: string;
  telefono: string;
  estado: EstadoContacto;
  canal: string;
  notas: string;
  ultima_actividad: string;
  creado_at: string;
};

// El orden es el del embudo: de recién llegado a cerrado.
export const ESTADOS = [
  { valor: "nuevo", etiqueta: "Nuevo" },
  { valor: "conversando", etiqueta: "Conversando" },
  { valor: "calificado", etiqueta: "Calificado" },
  { valor: "cliente", etiqueta: "Cliente" },
  { valor: "perdido", etiqueta: "Perdido" },
] as const;

export const CANALES_CONTACTO = [
  { valor: "manual", etiqueta: "Manual" },
  { valor: "whatsapp", etiqueta: "WhatsApp" },
  { valor: "web", etiqueta: "Web" },
  { valor: "simulador", etiqueta: "Simulador" },
] as const;

export function etiquetaDeEstado(estado: string): string {
  return ESTADOS.find((e) => e.valor === estado)?.etiqueta ?? estado;
}

export function etiquetaDeCanal(canal: string): string {
  return CANALES_CONTACTO.find((c) => c.valor === canal)?.etiqueta ?? canal;
}

// Colores del chip de estado. Cliente usa el amarillo de marca porque es el
// único estado que se celebra; perdido se apaga.
export function estiloDeEstado(estado: string): string {
  switch (estado) {
    case "cliente":
      return "bg-brand-yellow text-brand-ink";
    case "calificado":
      return "bg-brand-ink text-white";
    case "conversando":
      return "border border-brand-ink/25 text-brand-ink";
    case "perdido":
      return "border border-brand-ink/10 text-brand-ink/35";
    default:
      return "bg-brand-mist text-brand-ink/70";
  }
}

export function esEstado(valor: unknown): valor is EstadoContacto {
  return ESTADOS.some((e) => e.valor === valor);
}

// "hace 3 h", "ayer", "12 mar". Más legible que una fecha completa en tabla.
export function haceCuanto(iso: string): string {
  const fecha = new Date(iso);
  const minutos = Math.floor((Date.now() - fecha.getTime()) / 60000);

  if (minutos < 1) return "recién";
  if (minutos < 60) return `hace ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return "ayer";
  if (dias < 7) return `hace ${dias} días`;

  return fecha.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}
