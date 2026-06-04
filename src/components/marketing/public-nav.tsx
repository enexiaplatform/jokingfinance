"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { APP_NAME, PUBLIC_NAV_ITEMS } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

export function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9ddd3] bg-[#fffdf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#17201b]">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0f766e] text-white">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng công khai">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#4c5d54] transition-colors hover:bg-[#edf4ef] hover:text-[#17201b]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/login" variant="ghost">
            Đăng nhập
          </ButtonLink>
          <ButtonLink href="/signup">Bắt đầu luyện tập</ButtonLink>
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

      <div
        className={cn(
          "border-t border-[#d9ddd3] bg-[#fffdf8] px-4 py-3 lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="grid gap-1" aria-label="Điều hướng công khai trên di động">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#4c5d54] hover:bg-[#edf4ef]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <ButtonLink href="/login" variant="secondary">
              Đăng nhập
            </ButtonLink>
            <ButtonLink href="/signup">Bắt đầu luyện tập</ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
