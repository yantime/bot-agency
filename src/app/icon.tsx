import { ImageResponse } from "next/og";

// El favicon se genera desde código para que siga la paleta de marca sin tener
// que versionar binarios. Next lo cablea solo por convención de nombre.
export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4e80a",
          color: "#141414",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        A
      </div>
    ),
    size
  );
}
