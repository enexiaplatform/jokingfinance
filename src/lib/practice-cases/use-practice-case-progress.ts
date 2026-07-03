"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  PRACTICE_CASE_PROGRESS_EVENT,
  PRACTICE_CASE_PROGRESS_STORAGE_KEY,
  type PracticeCaseProgressSnapshot,
  type PracticeCaseResult,
} from "./progress-storage";

const emptySnapshot = JSON.stringify({ results: [] });

function readSnapshot() {
  if (typeof window === "undefined") {
    return emptySnapshot;
  }

  return localStorage.getItem(PRACTICE_CASE_PROGRESS_STORAGE_KEY) ?? emptySnapshot;
}

function parseSnapshot(snapshot: string): PracticeCaseProgressSnapshot {
  try {
    const parsed = JSON.parse(snapshot) as Partial<PracticeCaseProgressSnapshot>;

    return {
      results: Array.isArray(parsed.results) ? parsed.results : [],
    };
  } catch {
    return { results: [] };
  }
}

function writeSnapshot(progress: PracticeCaseProgressSnapshot) {
  localStorage.setItem(PRACTICE_CASE_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(PRACTICE_CASE_PROGRESS_EVENT));
}

export function usePracticeCaseProgress() {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(PRACTICE_CASE_PROGRESS_EVENT, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(PRACTICE_CASE_PROGRESS_EVENT, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    readSnapshot,
    () => emptySnapshot,
  );
  const progress = useMemo(() => parseSnapshot(snapshot), [snapshot]);

  const saveResult = useCallback(
    (result: PracticeCaseResult) => {
      const results = [
        ...progress.results.filter((item) => item.slug !== result.slug),
        result,
      ];

      writeSnapshot({ results });
    },
    [progress.results],
  );

  const clearProgress = useCallback(() => {
    writeSnapshot({ results: [] });
  }, []);

  return {
    progress,
    saveResult,
    clearProgress,
  };
}
