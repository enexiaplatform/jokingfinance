import {
  Ban,
  BookOpen,
  Coins,
  Info,
  LineChart,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { TAGLINE } from "@/lib/constants";

const gainers = [
  { sym: "FPT", co: "FPT Corp", px: "138.500", d: "+8.900", pct: "+6,87%" },
  { sym: "PNJ", co: "Vàng bạc PNJ", px: "97.200", d: "+5.100", pct: "+5,54%" },
  { sym: "HPG", co: "Hoà Phát", px: "29.850", d: "+1.450", pct: "+5,11%" },
  { sym: "MWG", co: "Thế Giới Di Động", px: "64.700", d: "+2.800", pct: "+4,52%" },
  { sym: "SSI", co: "CK SSI", px: "32.400", d: "+1.200", pct: "+3,85%" },
];

const safetyChips = [
  { label: "Chỉ phục vụ giáo dục", icon: ShieldCheck },
  { label: "Không giao dịch tiền thật", icon: Ban },
  { label: "Không khuyến nghị mua/bán", icon: XCircle },
  { label: "Chỉ dùng điểm ảo", icon: Coins },
];

export function LandingHeroScene() {
  return (
    <section className="hero">
      <div className="hero-grid-bg" />
      <div className="wrap">
        <div>
          <span className="eyebrow">Nền tảng học tài chính & mô phỏng danh mục ảo</span>
          <h1>
            {TAGLINE.split(". ").map((part, index) => (
              <span key={part}>
                {part}
                {index === 0 ? "." : ""}
                {index === 0 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p className="lead">
            JokingFinance giúp bạn đọc thị trường dễ hiểu hơn và luyện đầu tư bằng danh
            mục ảo: bảng giá, chỉ số, nhiệm vụ thực hành, nhật ký giao dịch, trước khi
            bỏ một đồng tiền thật.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="/app/dashboard">
              <LineChart className="h-[18px] w-[18px]" aria-hidden="true" />
              Mở bảng mô phỏng
            </Link>
            <Link className="btn btn-outline" href="/articles">
              <BookOpen className="h-[18px] w-[18px]" aria-hidden="true" />
              Đọc bài học mới nhất
            </Link>
          </div>
          <div className="safety-chips">
            {safetyChips.map((chip) => {
              const Icon = chip.icon;

              return (
                <span className="chip" key={chip.label}>
                  <Icon className="h-[15px] w-[15px]" aria-hidden="true" />
                  {chip.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="board">
          <div className="board-head">
            <span className="t">Bảng giá mô phỏng · Top biến động</span>
            <div className="board-tabs">
              <button className="on" type="button">
                Tăng
              </button>
              <button type="button">Giảm</button>
            </div>
          </div>
          <table className="qt">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Giá</th>
                <th>+/-</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {gainers.map((item) => (
                <tr key={item.sym}>
                  <td>
                    <div className="sym">{item.sym}</div>
                    <div className="co">{item.co}</div>
                  </td>
                  <td>
                    <span className="num">{item.px}</span>
                  </td>
                  <td>
                    <span className="num up">{item.d}</span>
                  </td>
                  <td>
                    <span className="pill up">{item.pct}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="board-foot">
            <Info className="h-[14px] w-[14px]" aria-hidden="true" />
            Giá mô phỏng, cập nhật mỗi phiên học. Không phải khuyến nghị.
          </div>
        </div>
      </div>
    </section>
  );
}
