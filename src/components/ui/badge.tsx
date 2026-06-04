import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "green" | "gold" | "coral" | "neutral" | "blue";
  className?: string;
};

const tones = {
  green: "border-[#b9d9c5] bg-[#e8f6ed] text-[#166534]",
  gold: "border-[#e8d59b] bg-[#fff7d6] text-[#7a4d00]",
  coral: "border-[#f1bea8] bg-[#fff0e8] text-[#9a3412]",
  neutral: "border-[#d7ded5] bg-white text-[#4a5a52]",
  blue: "border-[#b8d2e8] bg-[#edf7ff] text-[#1d4f7a]",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
