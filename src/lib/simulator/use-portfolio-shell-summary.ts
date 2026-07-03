"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getPortfolioSummary } from "./calculations";
import {
  PORTFOLIO_STORAGE_EVENT,
  PORTFOLIO_STORAGE_KEY,
} from "./storage";
import type { PortfolioState } from "./types";

const emptySnapshot = "";

function readSnapshot() {
  if (typeof window === "undefined") {
    return emptySnapshot;
  }

  return localStorage.getItem(PORTFOLIO_STORAGE_KEY) ?? emptySnapshot;
}

export function usePortfolioShellSummary() {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(PORTFOLIO_STORAGE_EVENT, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(PORTFOLIO_STORAGE_EVENT, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    readSnapshot,
    () => emptySnapshot,
  );

  return useMemo(() => {
    if (!snapshot) {
      return null;
    }

    try {
      const state = JSON.parse(snapshot) as PortfolioState;
      return getPortfolioSummary(state);
    } catch {
      return null;
    }
  }, [snapshot]);
}
