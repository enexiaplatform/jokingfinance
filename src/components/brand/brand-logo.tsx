import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markOnly?: boolean;
  size?: "sm" | "md";
  variant?: "default" | "light";
};

const markSizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
};

const markPixels = {
  sm: 32,
  md: 36,
};

const textSizes = {
  sm: "text-base",
  md: "text-lg",
};

export function BrandLogo({
  className,
  markOnly = false,
  size = "md",
  variant = "default",
}: BrandLogoProps) {
  const light = variant === "light";

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2 font-extrabold tracking-normal",
        light ? "text-white" : "text-[#17201b]",
        className,
      )}
    >
      <Image
        src="/brand/logomark.svg"
        alt=""
        aria-hidden="true"
        width={markPixels[size]}
        height={markPixels[size]}
        unoptimized
        className={cn("shrink-0 rounded-md", markSizes[size])}
      />
      {markOnly ? (
        <span className="sr-only">JokingFinance</span>
      ) : (
        <span className={cn("leading-none", textSizes[size])}>
          Joking
          <span className={light ? "text-[#a7e1b8]" : "text-[#0f766e]"}>
            Finance
          </span>
        </span>
      )}
    </span>
  );
}
