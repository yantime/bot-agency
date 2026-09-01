"use client";

import { useEffect } from "react";

// Último recurso: sólo se usa si el crash ocurre en el root layout, donde
// error.tsx ya no puede renderizar. Debe traer su propio <html> y <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[VentaBot] Error global:", error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#ffffff",
          color: "#141414",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          No pudimos cargar el sitio
        </h1>
        <p style={{ margin: 0, opacity: 0.6, maxWidth: "28rem" }}>
          Fue un problema temporal. Volvé a intentar en unos segundos.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            border: "none",
            borderRadius: "999px",
            background: "#141414",
            color: "#ffffff",
            padding: "0.65rem 1.5rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
        {error.digest && (
          <p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.35 }}>
            Código de error: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
