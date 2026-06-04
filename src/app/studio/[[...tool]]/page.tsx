"use client";

import dynamic from "next/dynamic";

const SanityStudio = dynamic(
  () =>
    import("@/components/marketing/sanity-studio-client").then(
      (module) => module.SanityStudioClient,
    ),
  { ssr: false },
);

export default function StudioPage() {
  return <SanityStudio />;
}
