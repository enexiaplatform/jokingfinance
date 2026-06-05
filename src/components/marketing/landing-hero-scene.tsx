"use client";

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
import { useEffect, useMemo, useState } from "react";
import { TAGLINE } from "@/lib/constants";
import { fallbackMarketSummary } from "@/lib/market-data/fallbackSummary";
import {
  formatMarketChange,
  formatMarketNumber,
  formatMarketPercent,
} from "@/lib/market-data/format";
import type { MarketSummary } from "@/lib/market-data/summary";

const safetyChips = [
  { label: "Chỉ phục vụ giáo dục", icon: ShieldCheck },
  { label: "Không giao dịch tiền thật", icon: Ban },
  { label: "Không khuyến nghị mua/bán", icon: XCircle },
  { label: "Chỉ dùng điểm ảo", icon: Coins },
];

export function LandingHeroScene() {
  const [marketSummary, setMarketSummary] = useState<MarketSummary>(fallbackMarketSummary);
  const boardRows = useMemo(
    () =>
      [...marketSummary.tickers]
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 5),
    [marketSummary.tickers],
  );

  useEffect(() => {
    let active = true;

    async function loadMarketSummary() {
      try {
        const response = await fetch("/api/market/summary", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Market summary request failed");
        }

        const data = (await response.json()) as MarketSummary;
        if (active) {
          setMarketSummary(data);
        }
      } catch {
        if (active) {
          setMarketSummary(fallbackMarketSummary);
        }
      }
    }

    void loadMarketSummary();

    return () => {
      active = false;
    };
  }, []);

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
                {index === 0 ? ". " : ""}
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
            <span className="t">Bảng giá Vnstock · Mã đang theo dõi</span>
            <div className="board-tabs">
              <button className="on" type="button">
                Demo
              </button>
              <button type="button">{marketSummary.source === "vnstock" ? "Thật" : "Dự phòng"}</button>
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
              {boardRows.map((item) => (
                <tr key={item.symbol}>
                  <td>
                    <div className="sym">{item.symbol}</div>
                    <div className="co">{item.exchange ?? "Vnstock"}</div>
                  </td>
                  <td>
                    <span className="num">{formatMarketNumber(item.price)}</span>
                  </td>
                  <td>
                    <span className={`num ${item.direction}`}>{formatMarketChange(item.change)}</span>
                  </td>
                  <td>
                    <span className={`pill ${item.direction}`}>{formatMarketPercent(item.changePercent)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="board-foot">
            <Info className="h-[14px] w-[14px]" aria-hidden="true" />
            Giá demo lấy từ Vnstock khi khả dụng. Không phải khuyến nghị.
          </div>
        </div>
      </div>
    </section>
  );
}
