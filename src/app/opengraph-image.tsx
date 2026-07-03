import { ImageResponse } from "next/og";

export const alt = "JokingFinance - Học trước khi dùng tiền thật";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(145deg, #17251f 0%, #0f1a16 100%)",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "1000px" }}>
          <div style={{ color: "#6fdca0", display: "flex", fontSize: 28, fontWeight: 700 }}>
            JokingFinance
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1.08,
              marginTop: 24,
            }}
          >
            Học trước khi dùng tiền thật.
          </div>
          <div
            style={{
              color: "#cdd9d1",
              display: "flex",
              fontSize: 30,
              lineHeight: 1.45,
              marginTop: 28,
            }}
          >
            Bài học, tình huống và danh mục mô phỏng bằng điểm ảo.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
