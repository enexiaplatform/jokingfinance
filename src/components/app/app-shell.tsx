"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  BookMarked,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  LogOut,
  NotebookPen,
  Search,
  Settings,
  Scale,
  WalletCards,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { APP_NAV_ITEMS } from "@/lib/constants";
import { fallbackMarketSummary } from "@/lib/market-data/fallbackSummary";
import {
  formatPercent,
  formatPoints,
} from "@/lib/format";
import {
  formatMarketNumber,
  formatMarketPercent,
  marketStatusLabel,
  marketTimestampLabel,
  marketArrow,
} from "@/lib/market-data/format";
import type { MarketSummary } from "@/lib/market-data/summary";
import { usePortfolioShellSummary } from "@/lib/simulator/use-portfolio-shell-summary";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

const navIcons: Record<string, LucideIcon> = {
  "/app/dashboard": LayoutDashboard,
  "/app/saved": BookMarked,
  "/cases": Scale,
  "/app/simulator": LineChart,
  "/app/tools": Wrench,
  "/app/portfolio": WalletCards,
  "/app/trades": ArrowLeftRight,
  "/app/journal": NotebookPen,
  "/app/missions": ClipboardList,
  "/articles": BookOpen,
  "/app/settings": Settings,
};

function pageTitle(pathname: string) {
  const current = APP_NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return current?.label ?? "Bảng học tập";
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [marketSummary, setMarketSummary] = useState<MarketSummary>(fallbackMarketSummary);
  const portfolioSummary = usePortfolioShellSummary();

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
          setMarketSummary({
            ...fallbackMarketSummary,
            status: "failed",
            fetchedAt: new Date().toISOString(),
            notice:
              "Không thể tải dữ liệu thị trường. Đang dùng dữ liệu minh họa gần nhất.",
          });
        }
      }
    }

    void loadMarketSummary();

    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
  }

  return (
    <div className="app">
      <aside className="side">
        <Link className="brand" href="/app/dashboard">
          <Image src="/brand/logomark.svg" alt="" width={34} height={34} unoptimized />
          Joking<span className="fin">Finance</span>
        </Link>

        <div className="side-sec">Học tập</div>
        <nav className="side-nav" aria-label="Học tập">
          {APP_NAV_ITEMS.filter((item) =>
            ["/app/dashboard", "/app/saved", "/cases", "/app/simulator", "/app/tools", "/articles", "/app/missions"].includes(item.href),
          ).map((item) => {
            const Icon = navIcons[item.href] ?? BookOpen;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  (pathname === item.href || pathname.startsWith(`${item.href}/`)) &&
                    "active",
                )}
              >
                <Icon aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="side-sec">Danh mục ảo</div>
        <nav className="side-nav" aria-label="Danh mục ảo">
          {APP_NAV_ITEMS.filter((item) =>
            ["/app/portfolio", "/app/trades", "/app/journal", "/app/settings"].includes(item.href),
          ).map((item) => {
            const Icon = navIcons[item.href] ?? WalletCards;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  (pathname === item.href || pathname.startsWith(`${item.href}/`)) &&
                    "active",
                )}
              >
                <Icon aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="side-foot">
          <div className="side-bal">
            <div className="lab">Tổng danh mục ảo</div>
            <div className="v">
              {portfolioSummary
                ? formatPoints(portfolioSummary.portfolioValue).replace(" điểm ảo", "")
                : "Chưa có dữ liệu"}
            </div>
            <div className="s">
              {portfolioSummary
                ? `điểm ảo · ${formatPercent(portfolioSummary.pnlPercent)} tổng`
                : "Mở mô phỏng để khởi tạo"}
            </div>
          </div>
          <button className="btn btn-outline btn-sm w-full" type="button" onClick={signOut}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-row">
            <div>
              <h1>{pageTitle(pathname)}</h1>
              <div className="sub">
                {marketStatusLabel(marketSummary.status)} · {marketTimestampLabel(marketSummary)}
              </div>
            </div>
            <div className="right">
              <form className="nav-search m-0 w-[220px]" action="/app/simulator">
                <button type="submit" aria-label="Mở mã trong mô phỏng">
                  <Search className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                </button>
                <input
                  name="ticker"
                  aria-label="Tìm mã cổ phiếu"
                  placeholder="Tìm mã CK..."
                  autoComplete="off"
                />
              </form>
              <Link className="btn btn-primary btn-sm" href="/app/simulator">
                <LineChart className="h-4 w-4" aria-hidden="true" />
                Lệnh mới
              </Link>
            </div>
          </div>
          <div className="mini-idx">
            {marketSummary.indices.map((item) => (
              <span className="m" key={item.code}>
                <b>{item.name}</b>
                <span className="v">{formatMarketNumber(item.value, 2)}</span>
                <span className={cn("c", item.direction)}>
                  {marketArrow(item.direction)} {formatMarketPercent(item.changePercent)}
                </span>
              </span>
            ))}
          </div>
        </header>
        <div className="dash">{children}</div>
      </main>
    </div>
  );
}
