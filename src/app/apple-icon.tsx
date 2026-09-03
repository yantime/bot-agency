import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 132,
          fontWeight: 700,
        }}
      >
        A
      </div>
    ),
    size
  );
}
