import { ImageResponse } from "next/og";

// Tarjeta que se ve al compartir el link por WhatsApp, LinkedIn o X.
export const alt =
  "Angie, la vendedora con IA que atiende tu WhatsApp 24/7";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#141414",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "#f4e80a",
            }}
          />
          <div style={{ display: "flex", fontSize: 30, color: "#f3f2f6" }}>
            angiebot.com
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Angie atiende, califica y cierra ventas por ti
          </div>
          <div style={{ display: "flex", width: 220, height: 12, background: "#f4e80a" }} />
        </div>

        <div style={{ display: "flex", fontSize: 32, color: "#a5a3ae" }}>
          Tu vendedora con IA en WhatsApp, 24/7
        </div>
      </div>
    ),
    size
  );
}
