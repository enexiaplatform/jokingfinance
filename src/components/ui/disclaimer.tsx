import { AlertTriangle } from "lucide-react";
import { EDUCATION_DISCLAIMER } from "@/lib/constants";
import { cn } from "@/lib/utils";

type DisclaimerProps = {
  children?: string;
  className?: string;
};

export function Disclaimer({ children = EDUCATION_DISCLAIMER, className }: DisclaimerProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-md border border-[#e2d3a7] bg-[#fff8df] p-4 text-sm leading-6 text-[#5b420b]",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
