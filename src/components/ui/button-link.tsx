import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
};

const variants = {
  primary:
    "border-transparent bg-[#0f766e] text-white shadow-sm hover:bg-[#115e59]",
  secondary:
    "border-[#b7c4ba] bg-white text-[#17201b] hover:border-[#0f766e] hover:bg-[#f3fbf4]",
  ghost:
    "border-transparent bg-transparent text-[#314039] hover:bg-[#edf4ef]",
  danger:
    "border-[#f2c4b5] bg-[#fff5f1] text-[#9a3412] hover:bg-[#ffe8df]",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
