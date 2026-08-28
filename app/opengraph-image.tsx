import { ImageResponse } from "next/og";
import { markDataUri } from "./brand-mark";

export const alt =
  "Dentsu Data Artist Mongol — AI, data engineering and analytics in Mongolia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          color: "#dadada",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <img src={markDataUri("#f4f4f4")} width={66} height={80} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#999999",
            }}
          >
            Dentsu Data Artist Mongol
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.12,
            color: "#f4f4f4",
            maxWidth: 900,
          }}
        >
          AI, data engineering and analytics — built in Ulaanbaatar.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#999999",
          }}
        >
          <div style={{ display: "flex" }}>
            Backed by the dentsu network · 160+ specialists
          </div>
          <div style={{ display: "flex" }}>mn.data-artist.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
