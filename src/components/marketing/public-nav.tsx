"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PUBLIC_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const tickerItems = [
  { sym: "FPT", px: "138.500", pct: "+6,87%", dir: "up" },
  { sym: "PNJ", px: "97.200", pct: "+5,54%", dir: "up" },
  { sym: "HPG", px: "29.850", pct: "+5,11%", dir: "up" },
  { sym: "VIC", px: "41.200", pct: "-5,40%", dir: "down" },
  { sym: "NVL", px: "11.450", pct: "-4,66%", dir: "down" },
  { sym: "VCB", px: "92.500", pct: "+1,10%", dir: "up" },
  { sym: "MSN", px: "71.800", pct: "-1,37%", dir: "down" },
];

const indexItems = [
  { name: "VN-INDEX", val: "1.843,09", chg: "+11,54", pct: "+0,63%", dir: "up" },
  { name: "VN30", val: "1.962,40", chg: "+9,82", pct: "+0,50%", dir: "up" },
  { name: "HNX-INDEX", val: "294,06", chg: "-3,54", pct: "-1,19%", dir: "down" },
  { name: "UPCOM", val: "98,72", chg: "+0,41", pct: "+0,42%", dir: "up" },
  { name: "USD/VND", val: "25.410", chg: "-15", pct: "-0,06%", dir: "down" },
  { name: "VÀNG SJC", val: "92,80tr", chg: "+0,30", pct: "+0,32%", dir: "up" },
];

export function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tickerLoop = [...tickerItems, ...tickerItems];

  return (
    <>
      <div className="ribbon">
        <div className="ribbon-inner">
          <span className="ribbon-tag">
            <span className="dot" />
            Thị trường · mô phỏng
          </span>
          <div className="ticker-mask">
            <div className="ticker-track">
              {tickerLoop.map((item, index) => (
                <span className="tk" key={`${item.sym}-${index}`}>
                  <b>{item.sym}</b>
                  <span className="pr">{item.px}</span>
                  <span className={cn("ch", item.dir)}>
                    {item.dir === "up" ? "▲" : "▼"} {item.pct}
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
            Dữ liệu mô phỏng · không phải giá thật
          </span>
          <div className="links">
            <span>Thứ Sáu, 05/06/2026</span>
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
            {indexItems.map((item) => (
              <div className="idx" key={item.name}>
                <span className="name">{item.name}</span>
                <span className="val">{item.val}</span>
                <span className={cn("chg", item.dir)}>
                  {item.dir === "up" ? "▲" : "▼"} {item.chg} <span>{item.pct}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
