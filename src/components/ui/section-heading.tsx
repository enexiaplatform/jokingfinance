import type { ReactNode } from "react";
import { Badge } from "./badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Badge tone="green">{eyebrow}</Badge>
      <h2 className="mt-4 text-3xl font-bold tracking-normal text-[#17201b] md:text-4xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 text-base leading-7 text-[#5b6861] md:text-lg">
          {children}
        </p>
      ) : null}
    </div>
  );
}
