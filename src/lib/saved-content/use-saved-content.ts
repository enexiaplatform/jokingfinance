"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  SAVED_CONTENT_EVENT,
  SAVED_CONTENT_STORAGE_KEY,
  type SavedContentItem,
  type SavedContentSnapshot,
} from "./storage";

const emptySnapshot = JSON.stringify({ items: [] });

function readSnapshot() {
  if (typeof window === "undefined") {
    return emptySnapshot;
  }

  return localStorage.getItem(SAVED_CONTENT_STORAGE_KEY) ?? emptySnapshot;
}

function parseSnapshot(snapshot: string): SavedContentSnapshot {
  try {
    const parsed = JSON.parse(snapshot) as Partial<SavedContentSnapshot>;

    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return { items: [] };
  }
}

function writeSnapshot(snapshot: SavedContentSnapshot) {
  localStorage.setItem(SAVED_CONTENT_STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(new Event(SAVED_CONTENT_EVENT));
}

export function useSavedContent() {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(SAVED_CONTENT_EVENT, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(SAVED_CONTENT_EVENT, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    readSnapshot,
    () => emptySnapshot,
  );
  const savedContent = useMemo(() => parseSnapshot(snapshot), [snapshot]);

  const saveItem = useCallback((item: Omit<SavedContentItem, "savedAt">) => {
    const current = parseSnapshot(readSnapshot());
    const nextItem: SavedContentItem = {
      ...item,
      savedAt: new Date().toISOString(),
    };
    const items = [nextItem, ...current.items.filter((savedItem) => savedItem.id !== item.id)];

    writeSnapshot({ items });
  }, []);

  const removeItem = useCallback((id: string) => {
    const current = parseSnapshot(readSnapshot());
    writeSnapshot({
      items: current.items.filter((item) => item.id !== id),
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => savedContent.items.some((item) => item.id === id),
    [savedContent.items],
  );

  return {
    items: savedContent.items,
    isSaved,
    saveItem,
    removeItem,
  };
}
