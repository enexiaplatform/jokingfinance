"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export function SanityStudioClient() {
  return <NextStudio config={config} />;
}
