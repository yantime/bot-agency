"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECCIONES = [
  {
    href: "/dashboard",
    nombre: "Simulador",
    icono: (
      <path d="M4 4.6h16c.7 0 1.2.6 1.2 1.3v9c0 .7-.5 1.3-1.2 1.3h-8.3l-4.4 3.4a.8.8 0 0 1-1.3-.6v-2.8H4c-.7 0-1.2-.6-1.2-1.3v-9c0-.7.5-1.3 1.2-1.3Zm.4 1.7v8.2h2.8c.5 0 .8.4.8.9v1.9l3-2.6c.2-.1.4-.2.6-.2h8V6.3H4.4Z" />
    ),
  },
  {
    href: "/dashboard/personalizacion",
    nombre: "Personalización",
    icono: (
      <path d="M4 6.2h7.3a2.9 2.9 0 0 1 5.5 0H20a.9.9 0 0 1 0 1.8h-3.2a2.9 2.9 0 0 1-5.5 0H4a.9.9 0 0 1 0-1.8Zm10 .9a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 0 0-2.2 0ZM4 16h3.2a2.9 2.9 0 0 1 5.5 0H20a.9.9 0 0 1 0 1.8h-7.3a2.9 2.9 0 0 1-5.5 0H4a.9.9 0 0 1 0-1.8Zm4.9.9a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 0 0-2.2 0Z" />
    ),
  },
  {
    href: "/dashboard/whatsapp",
    nombre: "WhatsApp",
    icono: (
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.79 2.4a8.2 8.2 0 0 1 2.41 5.83c0 4.55-3.7 8.25-8.25 8.25a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.71-8.24 8.28-8.24Zm-4.55 4.7c-.16 0-.42.06-.65.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.76 2.79 4.35 3.8 2.15.85 2.59.68 3.06.64.47-.04 1.5-.61 1.71-1.2.21-.6.21-1.11.15-1.21-.06-.11-.23-.17-.48-.3-.25-.13-1.5-.74-1.73-.83-.23-.08-.4-.13-.57.13-.17.25-.65.83-.8 1-.15.17-.29.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.4-.79-1.91-.2-.5-.42-.44-.57-.44Z" />
    ),
  },
  {
    href: "/dashboard/crm",
    nombre: "CRM",
    icono: (
      <path d="M9.2 3.4a3.7 3.7 0 1 1 0 7.4 3.7 3.7 0 0 1 0-7.4Zm0 1.8a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Zm7.3.4a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Zm0 1.8a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM9.2 12.3c2.9 0 5.4 1.5 5.4 3.5v3.9a.9.9 0 0 1-.9.9H4.7a.9.9 0 0 1-.9-.9v-3.9c0-2 2.5-3.5 5.4-3.5Zm0 1.8c-2.2 0-3.6 1-3.6 1.7v3h7.2v-3c0-.7-1.4-1.7-3.6-1.7Zm7.3-1.3c2.1 0 3.7 1.2 3.7 2.8v3.9a.9.9 0 0 1-.9.9h-2.9v-1.8h2v-3c0-.4-.7-1-1.9-1-.3 0-.6 0-.9.1l-.5-1.7c.5-.1 1-.2 1.4-.2Z" />
    ),
  },
  {
    href: "/dashboard/metricas",
    nombre: "Métricas",
    icono: (
      <path d="M4.4 3.2c.5 0 .9.4.9.9v14.6c0 .1 0 .1.1.1h14.2a.9.9 0 0 1 0 1.8H5.4c-1 0-1.9-.8-1.9-1.9V4.1c0-.5.4-.9.9-.9Zm13.4 3.4c.5 0 .9.4.9.9v8a.9.9 0 0 1-1.8 0v-8c0-.5.4-.9.9-.9Zm-4.4 3c.5 0 .9.4.9.9v5a.9.9 0 0 1-1.8 0v-5c0-.5.4-.9.9-.9Zm-4.4 2.3c.5 0 .9.4.9.9v2.7a.9.9 0 0 1-1.8 0v-2.7c0-.5.4-.9.9-.9Z" />
    ),
  },
];

export default function Sidebar() {
  const ruta = usePathname();

  return (
    <nav className="flex shrink-0 flex-col gap-1 border-r border-brand-ink/10 bg-white p-3 md:w-56">
      {SECCIONES.map((seccion) => {
        // "/dashboard" sólo coincide exacto; las subrutas usan prefijo.
        const activa =
          seccion.href === "/dashboard"
            ? ruta === "/dashboard"
            : ruta.startsWith(seccion.href);

        return (
          <Link
            key={seccion.href}
            href={seccion.href}
            aria-current={activa ? "page" : undefined}
            title={seccion.nombre}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activa
                ? "bg-brand-yellow/25 text-brand-ink"
                : "text-brand-ink/55 hover:bg-brand-mist hover:text-brand-ink"
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0"
              aria-hidden
            >
              {seccion.icono}
            </svg>
            <span className="hidden md:inline">{seccion.nombre}</span>
          </Link>
        );
      })}
    </nav>
  );
}
