"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
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
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

const navIcons: Record<string, LucideIcon> = {
  "/app/dashboard": LayoutDashboard,
  "/app/simulator": LineChart,
  "/app/portfolio": WalletCards,
  "/app/trades": ArrowLeftRight,
  "/app/journal": NotebookPen,
  "/app/missions": ClipboardList,
  "/articles": BookOpen,
  "/app/settings": Settings,
};

const miniIndexes = [
  { name: "VN-INDEX", val: "1.843,09", pct: "+0,63%", dir: "up" },
  { name: "VN30", val: "1.962,40", pct: "+0,50%", dir: "up" },
  { name: "HNX", val: "294,06", pct: "-1,19%", dir: "down" },
  { name: "UPCOM", val: "98,72", pct: "+0,42%", dir: "up" },
];

function pageTitle(pathname: string) {
  const current = APP_NAV_ITEMS.find((item) => item.href === pathname);
  return current?.label ?? "Bảng học tập";
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

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
            ["/app/dashboard", "/app/simulator", "/articles", "/app/missions"].includes(item.href),
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
              <div className="sub">Phiên mô phỏng · Thứ Sáu, 05/06/2026 · 09:37</div>
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
            {miniIndexes.map((item) => (
              <span className="m" key={item.name}>
                <b>{item.name}</b>
                <span className="v">{item.val}</span>
                <span className={cn("c", item.dir)}>
                  {item.dir === "up" ? "▲" : "▼"} {item.pct}
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
