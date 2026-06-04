import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  tone?: "neutral" | "positive" | "warning" | "danger";
};

const tones = {
  neutral: "border-[#dbe2d8] bg-white",
  positive: "border-[#b9d9c5] bg-[#f2fbf4]",
  warning: "border-[#ead99e] bg-[#fff9e6]",
  danger: "border-[#efc1af] bg-[#fff3ef]",
};

export function MetricCard({
  label,
  value,
  helper,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <div className={cn("rounded-md border p-4 shadow-sm", tones[tone])}>
      <p className="text-xs font-semibold uppercase text-[#66736c]">{label}</p>
      <div className="mt-2 text-2xl font-bold text-[#17201b]">{value}</div>
      {helper ? <div className="mt-2 text-sm text-[#5b6861]">{helper}</div> : null}
    </div>
  );
}
