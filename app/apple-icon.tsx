import { ImageResponse } from "next/og";
import { markDataUri } from "./brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS masks and squares this off itself, so it ships as a full-bleed dark tile
// with the mark inset — no rounding of our own.
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
          background: "#111111",
        }}
      >
        <img src={markDataUri("#f4f4f4")} width={112} height={136} alt="" />
      </div>
    ),
    { ...size },
  );
}
