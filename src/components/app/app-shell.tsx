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
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { APP_NAV_ITEMS } from "@/lib/constants";
import { fallbackMarketSummary } from "@/lib/market-data/fallbackSummary";
import {
  formatMarketNumber,
  formatMarketPercent,
  formatMarketUpdatedAt,
  marketArrow,
} from "@/lib/market-data/format";
import type { MarketSummary } from "@/lib/market-data/summary";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

const navIcons: Record<string, LucideIcon> = {
  "/app/dashboard": LayoutDashboard,
  "/app/saved": BookMarked,
  "/app/simulator": LineChart,
  "/app/portfolio": WalletCards,
  "/app/trades": ArrowLeftRight,
  "/app/journal": NotebookPen,
  "/app/missions": ClipboardList,
  "/articles": BookOpen,
  "/app/settings": Settings,
};

function pageTitle(pathname: string) {
  const current = APP_NAV_ITEMS.find((item) => item.href === pathname);
  return current?.label ?? "Bảng học tập";
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
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
            ["/app/dashboard", "/app/saved", "/app/simulator", "/articles", "/app/missions"].includes(item.href),
          ).map((item) => {
            const Icon = navIcons[item.href] ?? BookOpen;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(pathname === item.href && "active")}
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
                className={cn(pathname === item.href && "active")}
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
            <div className="v">103.420.000</div>
            <div className="s">điểm ảo · +3,42% tổng</div>
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
                Dữ liệu {marketSummary.source === "vnstock" ? "Vnstock" : "dự phòng"} · cập nhật {formatMarketUpdatedAt(marketSummary.updatedAt)}
              </div>
            </div>
            <div className="right">
              <label className="nav-search m-0 w-[220px]">
                <Search className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                <input placeholder="Tìm mã CK..." />
              </label>
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
