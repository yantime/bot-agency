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
