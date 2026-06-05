"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PUBLIC_NAV_ITEMS } from "@/lib/constants";
import { fallbackMarketSummary } from "@/lib/market-data/fallbackSummary";
import {
  formatMarketChange,
  formatMarketNumber,
  formatMarketPercent,
  formatMarketUpdatedAt,
  formatTodayLabel,
  marketArrow,
} from "@/lib/market-data/format";
import type { MarketSummary } from "@/lib/market-data/summary";
import { cn } from "@/lib/utils";

const MARKET_REFRESH_MS = 60_000;

export function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [marketSummary, setMarketSummary] = useState<MarketSummary>(fallbackMarketSummary);
  const tickerLoop = [...marketSummary.tickers, ...marketSummary.tickers];

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
          setMarketSummary((current) => ({
            ...current,
            notice: "Dang hien du lieu du phong.",
          }));
        }
      }
    }

    void loadMarketSummary();
    const intervalId = window.setInterval(loadMarketSummary, MARKET_REFRESH_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div className="ribbon">
        <div className="ribbon-inner">
          <span className="ribbon-tag">
            <span className="dot" />
            Thị trường · {marketSummary.source === "vnstock" ? "Vnstock" : "mô phỏng"}
          </span>
          <div className="ticker-mask">
            <div className="ticker-track">
              {tickerLoop.map((item, index) => (
                <span className="tk" key={`${item.symbol}-${index}`}>
                  <b>{item.symbol}</b>
                  <span className="pr">{formatMarketNumber(item.price)}</span>
                  <span className={cn("ch", item.direction)}>
                    {marketArrow(item.direction)} {formatMarketPercent(item.changePercent)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="util">
        <div className="wrap">
          <span className="sim-badge">
            <span className="d" />
            {marketSummary.source === "vnstock"
              ? `Dữ liệu demo từ Vnstock · cập nhật ${formatMarketUpdatedAt(marketSummary.updatedAt)}`
              : "Dữ liệu mô phỏng · không phải giá thật"}
          </span>
          <div className="links">
            <span>{formatTodayLabel()}</span>
            <Link href="/request-access">Đăng ký thử</Link>
            <Link href="/login">Đăng nhập</Link>
          </div>
        </div>
      </div>

      <header className="nav">
        <div className="wrap">
          <Link className="brand" href="/">
            <Image src="/brand/logomark.svg" alt="" width={38} height={38} unoptimized />
            Joking<span className="fin">Finance</span>
          </Link>

          <nav className="nav-links" aria-label="Điều hướng công khai">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "active" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/app/dashboard">Bảng học tập</Link>
          </nav>

          <label className="nav-search">
            <Search className="h-[17px] w-[17px]" aria-hidden="true" />
            <input placeholder="Gõ mã CK hoặc tìm bài học..." />
          </label>

          <div className="nav-cta">
            <Link className="btn btn-ghost btn-sm" href="/login">
              Đăng nhập
            </Link>
            <Link className="btn btn-primary btn-sm" href="/signup">
              Bắt đầu luyện tập
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#cbd6ce] bg-white text-[#17201b] lg:hidden"
            aria-label="Mở hoặc đóng điều hướng"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className={cn("border-t border-[var(--line)] bg-[var(--surface)] px-4 py-3 lg:hidden", open ? "block" : "hidden")}>
          <nav className="grid gap-1" aria-label="Điều hướng công khai trên di động">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-[#4c5d54] hover:bg-[#edf4ef]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link className="btn btn-primary mt-2" href="/signup" onClick={() => setOpen(false)}>
              Bắt đầu luyện tập
            </Link>
          </nav>
        </div>
      </header>

      <div className="idx-strip">
        <div className="wrap p-0">
          <div className="idx-rail">
            {marketSummary.indices.map((item) => (
              <div className="idx" key={item.code}>
                <span className="name">{item.name}</span>
                <span className="val">{formatMarketNumber(item.value, 2)}</span>
                <span className={cn("chg", item.direction)}>
                  {marketArrow(item.direction)} {formatMarketChange(item.change, 2)} <span>{formatMarketPercent(item.changePercent)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
