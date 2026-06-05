"use client";

import { useEffect, useMemo, useState } from "react";
import { fallbackMarketSummary } from "@/lib/market-data/fallbackSummary";
import {
  formatMarketNumber,
  formatMarketPercent,
  marketArrow,
} from "@/lib/market-data/format";
import type { MarketSummary, MarketTickerItem } from "@/lib/market-data/summary";
import { cn } from "@/lib/utils";

function useMarketSummary() {
  const [marketSummary, setMarketSummary] = useState<MarketSummary>(fallbackMarketSummary);

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

  return marketSummary;
}

function MoverList({
  items,
  fallbackLabel,
}: {
  items: MarketTickerItem[];
  fallbackLabel: string;
}) {
  if (items.length === 0) {
    return <p className="p-4 text-sm text-[#66736c]">{fallbackLabel}</p>;
  }

  return (
    <>
      {items.map((item) => (
        <div className="mover" key={item.symbol}>
          <div>
            <div className="sym">{item.symbol}</div>
            <div className="co">{item.exchange ?? "Vnstock"}</div>
          </div>
          <div className="r">
            <div className="px">{formatMarketNumber(item.price)}</div>
            <div className={cn("pc", item.direction)}>
              {marketArrow(item.direction)} {formatMarketPercent(item.changePercent)}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function MarketRailCards() {
  const marketSummary = useMarketSummary();
  const gainers = useMemo(
    () =>
      marketSummary.tickers
        .filter((item) => item.changePercent >= 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 5),
    [marketSummary.tickers],
  );
  const losers = useMemo(
    () =>
      marketSummary.tickers
        .filter((item) => item.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 5),
    [marketSummary.tickers],
  );
  const upCount = marketSummary.tickers.filter((item) => item.changePercent > 0).length;
  const downCount = marketSummary.tickers.filter((item) => item.changePercent < 0).length;
  const flatCount = marketSummary.tickers.length - upCount - downCount;

  return (
    <>
      <div className="card">
        <div className="card-head">
          <span className="t">Mã tăng trong danh sách theo dõi</span>
          <span className="lab">{marketSummary.source === "vnstock" ? "Vnstock" : "Mô phỏng"}</span>
        </div>
        <MoverList items={gainers} fallbackLabel="Chưa có mã tăng trong danh sách theo dõi." />
      </div>

      <div className="card">
        <div className="card-head">
          <span className="t">Mã giảm trong danh sách theo dõi</span>
          <span className="lab">{marketSummary.source === "vnstock" ? "Vnstock" : "Mô phỏng"}</span>
        </div>
        <MoverList items={losers} fallbackLabel="Chưa có mã giảm trong danh sách theo dõi." />
      </div>

      <div className="card">
        <div className="card-head"><span className="t">Tổng quan dữ liệu Vnstock</span></div>
        <div className="stat-li"><span>Mã tăng giá</span><b className="up">{upCount}</b></div>
        <div className="stat-li"><span>Mã giảm giá</span><b className="down">{downCount}</b></div>
        <div className="stat-li"><span>Đứng giá</span><b className="ref">{flatCount}</b></div>
        <div className="stat-li"><span>Nguồn dữ liệu</span><b>{marketSummary.source === "vnstock" ? "Vnstock" : "Dự phòng"}</b></div>
      </div>
    </>
  );
}
