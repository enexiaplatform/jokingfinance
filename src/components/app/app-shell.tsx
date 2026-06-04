"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { APP_NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <header className="sticky top-0 z-40 border-b border-[#d9ddd3] bg-[#fffdf8]/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/app/dashboard" className="flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0f766e] text-white">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            {APP_NAME}
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#cbd6ce] bg-white"
            aria-label="Bật tắt điều hướng ứng dụng"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <div className={cn("border-t border-[#d9ddd3] bg-[#fffdf8] p-3", open ? "grid" : "hidden")}>
          {APP_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold",
                pathname === item.href
                  ? "bg-[#e8f6ed] text-[#0f766e]"
                  : "text-[#4c5d54] hover:bg-[#edf4ef]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-[#d9ddd3] bg-[#fffdf8] p-4 lg:flex lg:flex-col">
          <Link href="/app/dashboard" className="flex items-center gap-2 px-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0f766e] text-white">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            {APP_NAME}
          </Link>
          <nav className="mt-8 grid gap-1" aria-label="Điều hướng ứng dụng">
            {APP_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold",
                  pathname === item.href
                    ? "bg-[#e8f6ed] text-[#0f766e]"
                    : "text-[#4c5d54] hover:bg-[#edf4ef]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={signOut}
            className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#d9ddd3] bg-white px-4 text-sm font-semibold text-[#314039] hover:bg-[#fff3ef]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Đăng xuất
          </button>
        </aside>

        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
